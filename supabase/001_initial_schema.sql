-- ============================================================
-- DIGITALWISE — Supabase Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- =========================
-- 1. PROFILES (extended dari auth.users)
-- =========================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url  TEXT,
  current_level INT DEFAULT 1,
  total_xp    INT DEFAULT 0,
  weekly_xp   INT DEFAULT 0,
  streak_count INT DEFAULT 0,
  last_active_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  role        TEXT DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
  theme       TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_weekly_xp ON profiles(weekly_xp DESC);
CREATE INDEX idx_profiles_total_xp ON profiles(total_xp DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile saat user daftar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =========================
-- 2. LEVELS (lookup table)
-- =========================
CREATE TABLE levels (
  level_num     INT PRIMARY KEY,
  title         TEXT NOT NULL,
  xp_threshold  INT NOT NULL,
  color         TEXT
);

INSERT INTO levels (level_num, title, xp_threshold, color) VALUES
  (1, 'Pemula Digital',     0,    '#94a3b8'),
  (2, 'Pencari Tahu',       200,  '#3b82f6'),
  (3, 'Pemberani Digital',   400,  '#10b981'),
  (4, 'Penjaga Aman',       600,  '#f59e0b'),
  (5, 'Ahli Siber',         900,  '#ef4444'),
  (6, 'Legenda Digital',    1200, '#8b5cf6');

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Levels viewable by everyone" ON levels FOR SELECT USING (true);


-- =========================
-- 3. MISSIONS
-- =========================
CREATE TABLE missions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN (
    'keamanan_siber', 'privasi_data', 'etika_digital'
  )),
  xp_reward     INT NOT NULL DEFAULT 10,
  mission_type  TEXT NOT NULL CHECK (mission_type IN (
    'quiz', 'learning', 'simulation', 'daily_checkin', 'special'
  )),
  difficulty    TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active     BOOLEAN DEFAULT TRUE,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active missions viewable by authenticated"
  ON missions FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);


-- =========================
-- 4. MISSION COMPLETIONS
-- =========================
CREATE TABLE mission_completions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id  UUID REFERENCES missions(id) ON DELETE CASCADE,
  xp_earned   INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON mission_completions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON mission_completions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =========================
-- 5. QUIZZES
-- =========================
CREATE TABLE quizzes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN (
    'keamanan_siber', 'privasi_data', 'etika_digital'
  )),
  questions     JSONB NOT NULL,
  passing_score INT DEFAULT 80,
  xp_reward     INT DEFAULT 20,
  time_limit_sec INT DEFAULT 300,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes viewable by authenticated"
  ON quizzes FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);


-- =========================
-- 6. QUIZ RESULTS
-- =========================
CREATE TABLE quiz_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id       UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score         INT NOT NULL,
  total_questions INT NOT NULL,
  xp_earned     INT NOT NULL,
  answers       JSONB,
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  is_perfect    BOOLEAN DEFAULT FALSE
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =========================
-- 7. LEARNING MATERIALS
-- =========================
CREATE TABLE learning_materials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN (
    'keamanan_siber', 'privasi_data', 'etika_digital'
  )),
  content_type  TEXT NOT NULL CHECK (content_type IN ('video', 'article', 'interactive')),
  video_url     TEXT,
  thumbnail_url TEXT,
  key_takeaways JSONB,
  xp_reward     INT DEFAULT 15,
  duration_min  INT DEFAULT 5,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Materials viewable by authenticated"
  ON learning_materials FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);


-- =========================
-- 8. LEARNING PROGRESS
-- =========================
CREATE TABLE learning_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  material_id     UUID REFERENCES learning_materials(id) ON DELETE CASCADE,
  completed       BOOLEAN DEFAULT FALSE,
  watch_time_sec  INT DEFAULT 0,
  xp_earned       INT DEFAULT 0,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE(user_id, material_id)
);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress"
  ON learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress"
  ON learning_progress FOR UPDATE USING (auth.uid() = user_id);


-- =========================
-- 9. BADGES
-- =========================
CREATE TABLE badges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  icon_url      TEXT NOT NULL DEFAULT '',
  category      TEXT CHECK (category IN ('achievement', 'streak', 'quiz', 'special')),
  xp_bonus      INT DEFAULT 0,
  is_hidden     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO badges (name, description, icon_url, category) VALUES
  ('Detektif Phishing', 'Selesaikan 3 quiz phishing dengan sempurna', '/badges/phishing-detective.png', 'quiz'),
  ('Penjaga Privasi', 'Selesaikan semua materi Privasi Data', '/badges/privacy-guard.png', 'achievement'),
  ('Streak Master', 'Streak 7 hari berturut-turut', '/badges/streak-master.png', 'streak'),
  ('Pemberani Siber', 'Laporkan insiden pertama kali', '/badges/cyber-brave.png', 'special'),
  ('Siswa Teladan', 'Capai Level 5', '/badges/model-student.png', 'achievement');

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable by everyone" ON badges FOR SELECT USING (true);


-- =========================
-- 10. USER BADGES
-- =========================
CREATE TABLE user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id    UUID REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =========================
-- 11. USER XP LOG
-- =========================
CREATE TABLE user_xp_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount      INT NOT NULL,
  source      TEXT NOT NULL CHECK (source IN (
    'mission', 'quiz', 'learning', 'badge_bonus', 'streak_bonus', 'admin'
  )),
  source_id   UUID,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_log_user_date ON user_xp_log(user_id, created_at DESC);

ALTER TABLE user_xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp log"
  ON user_xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp log"
  ON user_xp_log FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =========================
-- 12. STREAKS
-- =========================
CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak  INT DEFAULT 0,
  longest_streak  INT DEFAULT 0,
  last_active_date DATE,
  streak_freezes  INT DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streak"
  ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streak"
  ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streak"
  ON streaks FOR UPDATE USING (auth.uid() = user_id);


-- =========================
-- 13. REPORTS
-- =========================
CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category      TEXT NOT NULL CHECK (category IN (
    'phishing', 'cyberbullying', 'account_hijack',
    'data_leak', 'malware', 'online_scam', 'other'
  )),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  evidence_urls TEXT[],
  status        TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewing', 'resolved', 'dismissed'
  )),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admin can view all reports"
  ON reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- =========================
-- 14. NOTIFICATIONS
-- =========================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN (
    'badge_unlock', 'level_up', 'mission_available',
    'quiz_result', 'forum_reply', 'system', 'streak_reminder'
  )),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);


-- =========================
-- 15. FORUM POSTS
-- =========================
CREATE TABLE forum_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_type     TEXT NOT NULL CHECK (post_type IN ('question', 'challenge', 'poll')),
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  category      TEXT CHECK (category IN (
    'keamanan_siber', 'privasi_data', 'etika_digital', 'general'
  )),
  tags          TEXT[],
  poll_options  JSONB,
  is_pinned     BOOLEAN DEFAULT FALSE,
  likes_count   INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by authenticated"
  ON forum_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create posts"
  ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE USING (auth.uid() = author_id);


-- =========================
-- 16. FORUM COMMENTS
-- =========================
CREATE TABLE forum_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_mentor_answer BOOLEAN DEFAULT FALSE,
  likes_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by authenticated"
  ON forum_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create comments"
  ON forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);


-- =========================
-- RPC FUNCTIONS
-- =========================

-- Claim XP + auto level-up
CREATE OR REPLACE FUNCTION claim_xp(
  p_user_id UUID,
  p_amount INT,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_new_total INT;
  v_new_weekly INT;
  v_new_level INT;
  v_old_level INT;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  SELECT current_level INTO v_old_level
  FROM profiles WHERE id = p_user_id;

  UPDATE profiles
  SET
    total_xp = total_xp + p_amount,
    weekly_xp = weekly_xp + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING total_xp, weekly_xp INTO v_new_total, v_new_weekly;

  SELECT level_num INTO v_new_level
  FROM levels
  WHERE xp_threshold <= v_new_total
  ORDER BY level_num DESC LIMIT 1;

  IF v_new_level > v_old_level THEN
    v_leveled_up := TRUE;
    UPDATE profiles SET current_level = v_new_level WHERE id = p_user_id;
  END IF;

  INSERT INTO user_xp_log (user_id, amount, source, source_id)
  VALUES (p_user_id, p_amount, p_source, p_source_id);

  RETURN jsonb_build_object(
    'new_total_xp', v_new_total,
    'new_weekly_xp', v_new_weekly,
    'new_level', v_new_level,
    'leveled_up', v_leveled_up
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Update streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_streak RECORD;
  v_today DATE := CURRENT_DATE;
  v_new_streak INT;
  v_bonus_xp INT := 0;
BEGIN
  INSERT INTO streaks (user_id, current_streak, last_active_date)
  VALUES (p_user_id, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_streak
  FROM streaks WHERE user_id = p_user_id;

  IF v_streak.last_active_date IS NULL THEN
    v_new_streak := 1;
  ELSIF v_streak.last_active_date = v_today THEN
    RETURN jsonb_build_object(
      'streak_count', v_streak.current_streak,
      'bonus_xp', 0,
      'already_active_today', true
    );
  ELSIF v_streak.last_active_date = v_today - 1 THEN
    v_new_streak := v_streak.current_streak + 1;
  ELSIF v_streak.streak_freezes > 0 AND v_streak.last_active_date = v_today - 2 THEN
    v_new_streak := v_streak.current_streak + 1;
    UPDATE streaks SET streak_freezes = streak_freezes - 1 WHERE user_id = p_user_id;
  ELSE
    v_new_streak := 1;
  END IF;

  UPDATE streaks
  SET
    current_streak = v_new_streak,
    longest_streak = GREATEST(longest_streak, v_new_streak),
    last_active_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  UPDATE profiles
  SET streak_count = v_new_streak, last_active_date = v_today
  WHERE id = p_user_id;

  IF v_new_streak IN (7, 14, 30, 60, 100) THEN
    v_bonus_xp := v_new_streak * 2;
    PERFORM claim_xp(p_user_id, v_bonus_xp, 'streak_bonus');
  END IF;

  RETURN jsonb_build_object(
    'streak_count', v_new_streak,
    'bonus_xp', v_bonus_xp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================
-- SEED DATA: Sample missions
-- =========================
INSERT INTO missions (title, description, category, xp_reward, mission_type) VALUES
  ('Identifikasi Phishing', 'Kenali ciri-ciri pesan phishing', 'keamanan_siber', 100, 'simulation'),
  ('Buat Kata Sandi Kuat', 'Buat kata sandi yang aman', 'keamanan_siber', 50, 'learning'),
  ('Atur Privasi Akun', 'Periksa pengaturan privasi media sosial', 'privasi_data', 50, 'learning'),
  ('Cek Jejak Digital', 'Gugurkan jejak digitalmu', 'privasi_data', 75, 'learning'),
  ('Berkomunikasi Sopan', 'Latihan etika digital', 'etika_digital', 50, 'learning'),
  ('Daily Check-in', 'Login hari ini', 'keamanan_siber', 10, 'daily_checkin');


-- =========================
-- SEED DATA: Sample quiz
-- =========================
INSERT INTO quizzes (title, description, category, questions, xp_reward) VALUES (
  'Simulasi Phishing',
  'Kenali pesan phishing dari contoh nyata',
  'keamanan_siber',
  '[
    {
      "id": 1,
      "sender": "SMS · +62 811-xxxx-2210",
      "senderMeta": "Kurir paket · 08.12",
      "body": "PAKET TERTAHAN — kiriman No. JP-88213 belum bisa diproses. Bayar biaya bea cukai Rp23.000 sekarang: t.me/claim-paket",
      "question": "Bagaimana kamu menilai pesan ini?",
      "options": ["Aman", "Tidak Aman"],
      "correctIndex": 1,
      "explanation": [
        "Kurir resmi tidak minta transfer mendadak lewat link.",
        "Tenggat 2 jam dipakai supaya kamu panik.",
        "Lacak resi di aplikasi resmi kurir."
      ]
    },
    {
      "id": 2,
      "sender": "SMS · +62 812-xxxx-8890",
      "senderMeta": "Nomor tidak dikenal · 09.41",
      "body": "SELAMAT!!! Kamu terpilih memenangkan hadiah Rp5.000.000 dari undian operator. Klaim di bit.ly/hadiah-operator.",
      "question": "Bagaimana kamu menilai pesan ini?",
      "options": ["Aman", "Tidak Aman"],
      "correctIndex": 1,
      "explanation": [
        "Hadiah gratis yang tak diminta adalah umpan klasik penipuan.",
        "Tenggat waktu singkat dipakai agar kamu panik.",
        "Link pendek menyembunyikan tujuan sebenarnya."
      ]
    },
    {
      "id": 3,
      "sender": "SMS · +62 813-xxxx-4477",
      "senderMeta": "Nomor tidak dikenal · 19.05",
      "body": "Hai, aku Salsa dari kelas sebelah! HP-ku hilang dan aku login WA di HP baru, tapi butuh verifikasi. Kirimkan kode OTP yang masuk ke HP-mu ya.",
      "question": "Bagaimana kamu menilai pesan ini?",
      "options": ["Aman", "Tidak Aman"],
      "correctIndex": 1,
      "explanation": [
        "Kode OTP adalah kunci akunmu — jangan pernah dibagikan.",
        "\"Teman\" yang minta OTP biasanya akunnya sudah dibajak.",
        "Abaikan, lalu konfirmasi ke teman lewat jalur lain."
      ]
    },
    {
      "id": 4,
      "sender": "Pesan · Bu Ratna (Guru BK)",
      "senderMeta": "Kontak tersimpan · 07.30",
      "body": "Assalamualaikum, anak-anak. Pengingat: diskusi kelompok besok jam 9 pagi di ruang BK. Siapkan materi yang sudah dikirim minggu lalu ya.",
      "question": "Bagaimana kamu menilai pesan ini?",
      "options": ["Aman", "Tidak Aman"],
      "correctIndex": 0,
      "explanation": [
        "Pengirim dikenal dan sudah tersimpan di kontak.",
        "Tidak ada link mencurigakan atau permintaan data pribadi.",
        "Isinya masuk akal dan bisa dikonfirmasi ke sekolah."
      ]
    },
    {
      "id": 5,
      "sender": "Email · no-reply@instagrarn-secure.info",
      "senderMeta": "Domain mirip, bukan resmi · 21.14",
      "body": "PERINGATAN TERAKHIR! Akunmu akan DIBLOKIR PERMANEN dalam 24 jam karena dugaan pelanggaran. Verifikasi sekarang: instagrarn-secure.info/verify",
      "question": "Bagaimana kamu menilai pesan ini?",
      "options": ["Aman", "Tidak Aman"],
      "correctIndex": 1,
      "explanation": [
        "Domain palsu: \"instagrarn\" (r-n) meniru nama resmi.",
        "Platform resmi tidak memverifikasi akun lewat link di pesan.",
        "Cek status akun langsung dari aplikasi resminya."
      ]
    }
  ]'::jsonb,
  100
);
