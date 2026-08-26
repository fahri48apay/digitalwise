-- ============================================================
-- SAMPLE DATA — DigitalWise
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- =========================
-- 1. SAMPLE MATERIALS (6 materi)
-- =========================
INSERT INTO learning_materials (title, description, category, content_type, video_url, key_takeaways, xp_reward, duration_min, sort_order) VALUES
(
  'Mengenal Phishing',
  'Pelajari apa itu phishing dan bagaimana mengenali email/sms palsu yang mencoba mencuri data kamu.',
  'keamanan_siber',
  'video',
  'https://www.youtube.com/watch?v=example1',
  '["Phishing adalah upaya menipu untuk mendapatkan data sensitif", "Periksa URL sebelum klik link", "Jangan download attachment dari email mencurigakan"]'::jsonb,
  15,
  5,
  1
),
(
  'Cara Membuat Password Kuat',
  'Tips membuat password yang sulit ditebak tapi mudah diingat.',
  'keamanan_siber',
  'article',
  NULL,
  '["Gunakan minimal 12 karakter", "Campur huruf besar, kecil, angka, simbol", "Jangan pakai password sama untuk semua akun", "Gunakan password manager"]'::jsonb,
  10,
  3,
  2
),
(
  'Privasi di Media Sosial',
  'Atur privasi akun media sosial kamu agar tetap aman dari orang asing.',
  'privasi_data',
  'video',
  'https://www.youtube.com/watch?v=example2',
  '["Set profile ke private jika perlu", "Periksa siapa yang bisa melihat postingan kamu", "Jangan bagikan lokasi real-time", "Review aplikasi yang terhubung ke akun"]'::jsonb,
  15,
  4,
  3
),
(
  'Mengenali Cyberbullying',
  'Apa itu cyberbullying? Kenali tanda-tandanya dan cara menghadapinya.',
  'etika_digital',
  'article',
  NULL,
  '["Cyberbullying adalah intimidasi secara online", "Simpan bukti (screenshot)", "Laporkan ke platform dan orang dewasa terpercaya", "Jangan balas dengan kekerasan"]'::jsonb,
  10,
  3,
  4
),
(
  'Bahaya Wifi Gratis',
  'Mengapa wifi gratis di tempat umum bisa berbahaya dan cara menghindarinya.',
  'keamanan_siber',
  'video',
  'https://www.youtube.com/watch?v=example3',
  '["Wifi gratis bisa dimanfaatkan hacker untuk memantau traffic", "Hindari login akun penting di wifi publik", "Gunakan VPN jika harus menggunakan wifi publik", "Matikan auto-connect ke wifi"]'::jsonb,
  15,
  5,
  5
),
(
  'Verifikasi Dua Faktor (2FA)',
  'Cara mengaktifkan 2FA untuk melindungi akun kamu dari peretasan.',
  'keamanan_siber',
  'article',
  NULL,
  '["2FA menambah lapisan keamanan ekstra", "Gunakan authenticator app, bukan SMS jika memungkinkan", "Simpan backup codes di tempat aman", "Aktifkan 2FA di semua akun penting"]'::jsonb,
  20,
  4,
  6
);


-- =========================
-- 2. SAMPLE QUIZZES (4 quiz dengan soal)
-- =========================
INSERT INTO quizzes (title, description, category, questions, passing_score, xp_reward, time_limit_sec) VALUES
(
  'Quiz: Phishing',
  'Uji pemahaman kamu tentang phishing dan cara mengenalinya.',
  'keamanan_siber',
  '[
    {
      "question": "Email dari bank meminta kamu klik link untuk verifikasi akun. Apa yang harus dilakukan?",
      "options": ["Klik link langsung", "Hubungi bank via nomor resmi", "Forward ke teman", "Abaikan saja"],
      "correctIndex": 1,
      "explanation": "Selalu hubungi bank via nomor resmi yang tertera di kartu/statement, bukan dari email."
    },
    {
      "question": "Tanda-tanda email phishing adalah...",
      "options": ["Memiliki logo resmi", "Address pengirim aneh dan banyak typo", "Dari alamat kantor", "Memiliki tanda tangan digital"],
      "correctIndex": 1,
      "explanation": "Email phishing sering memiliki alamat pengirim yang aneh dan banyak kesalahan penulisan."
    },
    {
      "question": "Link bit.ly dalam email selalu aman untuk diklik?",
      "options": ["Ya, selalu aman", "Tidak, bisa jadi penipuan", "Hanya jika dari teman", "Tergantung warna link"],
      "correctIndex": 1,
      "explanation": "Link pendek bisa menyembunyikan URL asli yang berbahaya. Selalu verifikasi sebelum klik."
    },
    {
      "question": "Apa yang harus dilakukan jika sudah terjebak phishing?",
      "options": ["Diam saja", "Segera ganti password dan hubungi bank", "Post di media sosial", "Hapus emailnya"],
      "correctIndex": 1,
      "explanation": "Segera ganti password, hubungi bank/pihak terkait, dan laporkan insiden."
    },
    {
      "question": "附件 dari email tidak dikenal sebaiknya...",
      "options": ["Langsung dibuka", "Download dan scan antivirus dulu", "Dibagikan ke grup", "Diabaikan"],
      "correctIndex": 1,
      "explanation": "Jangan buka attachment dari email mencurigakan. Scan dulu dengan antivirus jika memang perlu."
    }
  ]'::jsonb,
  80,
  25,
  300
),
(
  'Quiz: Password',
  'Uji pengetahuan kamu tentang keamanan password.',
  'keamanan_siber',
  '[
    {
      "question": "Password yang kuat sebaiknya...",
      "options": ["Nama + tahun lahir", "Minimal 12 karakter dengan campuran huruf, angka, simbol", "Password saja", "12345678"],
      "correctIndex": 1,
      "explanation": "Password kuat minimal 12 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol."
    },
    {
      "question": "Bolehkah menggunakan password yang sama untuk semua akun?",
      "options": ["Boleh, praktis", "Tidak boleh, sangat berbahaya", "Boleh untuk akun tidak penting", "Tergantung platform"],
      "correctIndex": 1,
      "explanation": "Jika satu akun dibobol, akun lain juga akan terancam. Gunakan password berbeda untuk setiap akun."
    },
    {
      "question": "Apa itu password manager?",
      "options": ["Aplikasi untuk mengelola password", "Orang yang menjaga password", "Cara mereset password", "Website untuk cek password"],
      "correctIndex": 0,
      "explanation": "Password manager adalah aplikasi yang menyimpan dan mengelola semua password kamu dengan aman."
    },
    {
      "question": "Kapan harus mengganti password?",
      "options": ["Setiap tahun", "Hanya jika ada indikasi akun diretas", "Setiap bulan", "Tidak perlu"],
      "correctIndex": 1,
      "explanation": "Ganti password jika ada indikasi akun diretas atau jika password sudah bocor di data breach."
    }
  ]'::jsonb,
  75,
  20,
  240
),
(
  'Quiz: Privasi Data',
  'Uji pemahaman kamu tentang privasi data pribadi.',
  'privasi_data',
  '[
    {
      "question": "Data pribadi yang tidak boleh dibagikan sembarangan...",
      "options": ["Nama panggilan", "Nomor KTP dan alamat rumah", "Hobi", "Warna favorit"],
      "correctIndex": 1,
      "explanation": "Nomor KTP, alamat, dan data sensitif lainnya tidak boleh dibagikan ke orang yang tidak dikenal."
    },
    {
      "question": "Sebaiknya profile media sosial diatur ke...",
      "options": ["Public untuk semua orang", "Private hanya untuk teman yang dikenal", "Tergantung mood", "Semi-public"],
      "correctIndex": 1,
      "explanation": "Profile private membantu melindungi data pribadi dari orang asing yang tidak bertanggung jawab."
    },
    {
      "question": "Aplikasi yang meminta izin akses kontak, kamera, dan lokasi sebaiknya...",
      "options": ["Langsung izinkan semua", "Pikirkan dulu apakah benar-benar diperlukan", "Tolak semua", "Install saja"],
      "correctIndex": 1,
      "explanation": "Hanya berikan izin yang benar-benar diperlukan untuk fungsionalitas aplikasi."
    }
  ]'::jsonb,
  80,
  20,
  180
),
(
  'Quiz: Keamanan WiFi',
  'Uji pengetahuan kamu tentang keamanan jaringan wifi.',
  'keamanan_siber',
  '[
    {
      "question": "Wifi gratis di cafe aman untuk login bank?",
      "options": ["Ya, selama ada password", "Tidak, bisa dimanfaatkan hacker", "Ya, jika pakai VPN", "Tergantung cafe"],
      "correctIndex": 1,
      "explanation": "Wifi gratis bisa dimanfaatkan hacker untuk memantau traffic. Hindari login akun penting di wifi publik."
    },
    {
      "question": "Cara aman menggunakan wifi publik...",
      "options": ["Gunakan VPN", "Matikan wifi", "Hanya buka youtube", "Gunakan data seluler saja"],
      "correctIndex": 0,
      "explanation": "VPN mengenkripsi traffic kamu sehingga lebih aman saat menggunakan wifi publik."
    },
    {
      "question": "Auto-connect ke wifi sebaiknya...",
      "options": ["Dinyalakan agar praktis", "Dimatikan agar tidak otomatis connect ke wifi berbahaya", "Tidak masalah", "Tergantung device"],
      "correctIndex": 1,
      "explanation": "Matikan auto-connect untuk mencegah device otomatis terhubung ke wifi yang mungkin berbahaya."
    }
  ]'::jsonb,
  80,
  20,
  180
);


-- =========================
-- 3. SAMPLE MISSIONS (6 misi)
-- =========================
INSERT INTO missions (title, description, category, xp_reward, mission_type, difficulty) VALUES
(
  'Selesaikan Quiz Phishing',
  'Kerjakan dan lulus quiz tentang phishing dengan minimal 80%.',
  'keamanan_siber',
  25,
  'quiz',
  'easy'
),
(
  'Baca Materi Password',
  'Baca materi tentang cara membuat password kuat.',
  'keamanan_siber',
  15,
  'learning',
  'easy'
),
(
  'Aktifkan 2FA di Akun',
  'Aktifkan verifikasi dua faktor di minimal 1 akun media sosial kamu.',
  'keamanan_siber',
  30,
  'simulation',
  'medium'
),
(
  'Selesaikan Quiz Privasi',
  'Kerjakan quiz tentang privasi data dan pahami pentingnya melindungi data pribadi.',
  'privasi_data',
  25,
  'quiz',
  'easy'
),
(
  'Check-in 3 Hari Berturut-turut',
  'Buka aplikasi selama 3 hari berturut-turut untuk menjaga streak.',
  'etika_digital',
  20,
  'daily_checkin',
  'easy'
),
(
  'Quiz Master: Jawab Semua Benar',
  'Selesaikan quiz apapun dengan skor sempurna (100%).',
  'keamanan_siber',
  50,
  'special',
  'hard'
);
