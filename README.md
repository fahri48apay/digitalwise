<p align="center">
  <img src="docs/screenshots/hero.png" alt="DigitalWise — banner" width="100%" />
</p>

<h1 align="center">🛡️ DigitalWise</h1>

<p align="center">
  <b>Gamifikasi literasi digital untuk membentengi remaja dari kejahatan siber di media sosial.</b><br/>
  <code>Belajar · Main · Menang 🏆</code> — Poin, Badge, Level, XP, Peringkat, Lapor &amp; Bantuan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Android-3DDC84?style=flat&logo=android&logoColor=white"/>
  <img src="https://img.shields.io/badge/stack-React_Native%20%2F%20Expo-000?style=flat&logo=expo&logoColor=white"/>
  <img src="https://img.shields.io/badge/web-React%20%2B%20Tailwind-61DAFB?style=flat&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/backend-Firebase-FFCA28?style=flat&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/design-Material_You%20%28M3%29-6750A4?style=flat&logo=materialdesign&logoColor=white"/>
  <img src="https://img.shields.io/badge/a11y-WCAG_AA-23c55e?style=flat"/>
  <img src="https://img.shields.io/badge/design_tool-Penpot-000?style=flat&logo=penpot&logoColor=white"/>
</p>

---

## ✨ Mengapa DigitalWise?

Remaja menghabiskan waktu berjam-jam di media sosial — tapi jarang dibekali **keterampilan mengenali bahaya** di sana: phishing, penipuan, konten berbahaya, dan eksploitasi. **DigitalWise** mengubah materi keamanan siber yang membosankan menjadi **petualangan belajar yang seru**, dengan mekanika gamifikasi yang menjaga motivasi tetap hidup.

**Fitur utama:**

- 🎯 **Misi & Level** — belajar bertahap dengan XP bar yang terus naik
- 🕵️ **Simulasi Anti-Phishing** — latihan mengenali penipuan dalam skenario realistis
- 🔐 **Materi Keamanan Siber** — sandi kuat, privasi, jejak digital, & proteksi akun
- 🏅 **Badge & Peringkat** — papan peringkat untuk kompetisi sehat antar teman
- 🚩 **Lapor & Bantuan** — saluran aman melaporkan konten serta meminta pertolongan
- 🌗 **Light & Dark Mode** — tema Material You adaptif dengan kontras WCAG AA

---

## 📱 Screenshots (Dari Desain Penpot Asli)

> Semua layar di bawah adalah ekspor langsung dari file desain **Penpot** (bukan mockup).

<div align="center">
  <img src="docs/screenshots/beranda.png" width="150" alt="Beranda" title="Beranda"/>
  <img src="docs/screenshots/misi.png" width="150" alt="Misi" title="Misi &amp; Materi"/>
  <img src="docs/screenshots/phishing.png" width="150" alt="Simulasi Phishing" title="Simulasi Anti-Phishing"/>
  <img src="docs/screenshots/peringkat.png" width="150" alt="Peringkat" title="Papan Peringkat"/>
  <img src="docs/screenshots/profil.png" width="150" alt="Profil" title="Profil &amp; Badge"/>
  <img src="docs/screenshots/materi.png" width="150" alt="Materi" title="Materi Keamanan Siber"/>
</div>

<p align="center"><em>Light mode</em> — tampilkan <b>dark mode</b> juga:</p>
<div align="center">
  <img src="docs/screenshots/beranda-dark.png" width="150" alt="Beranda Dark" title="Beranda — Dark Mode"/>
</div>

---

## 🏗️ Arsitektur Monorepo

```
digitalwise/
├── 🎨 design            # Desain Penpot — 22 board, prototype ter-wiring (74 interaksi)
├── 📱 mobile-app/       # Aplikasi Android (React Native / Expo)
│   ├── app/             #    Screens & navigasi (tabs, onboarding, quiz, forum…)
│   ├── components/      #    UI + komponen gamification
│   ├── stores/          #    State management
│   └── hooks/ lib/      #    Logic & utilitas
├── 🖥️ admin-panel/      # Dashboard admin (React + Tailwind + React Query)
│   └── src/pages/       #    Kelola materi, misi, kuis, laporan, pengaturan
├── ⚙️ backend/          # Firebase Functions (TypeScript)
│   ├── functions/src/   #    forum, quiz, session, notification
│   └── seed/            #    Data awal materi & kuis
├── 📚 docs/             # Handoff kit, rencana, screenshot
├── 🖼️ app.html          # Prototype HTML interaktif (light + dark)
└── 🎨 tokens.css        # Design tokens — single source of truth (M3)
```

---

## 🎨 Design System

Dibangun di atas **Material Design 3 (Material You)** dengan aksesibilitas **WCAG 2.2 AA** (48 pasangan warna tervalidasi lewat `check-contrast.mjs`).

| Role | Light | Dark | Fungsi |
|------|-------|------|--------|
| **Primary** | `#3E4BBE` · indigo | `#BDC3FF` | Aksi utama, identitas keamanan |
| **Tertiary** | `#744CB0` · violet | `#D6BAFF` | Aksen gamifikasi: XP, badge, level |
| **Success** | `#1D6F3C` | `#8ED99B` | Misi selesai, status aman |
| **Error** | `#B3261E` | `#F2B8B5` | Phishing, konten berbahaya |

> Design tokens sumber kebenaran di `tokens.css`, konsisten antara prototype HTML, mobile app, dan admin panel.

---

## 🚀 Menjalankan Project

### 📱 Mobile App (Expo)
```bash
cd mobile-app
npm install
npx expo start
```

### 🖥️ Admin Panel
```bash
cd admin-panel
npm install
npm start          # development
npm run build      # production
```

### ⚙️ Backend (Firebase Functions)
```bash
cd backend/functions
npm install
npx tsc --watch
npm run deploy     # deploy ke Firebase
```

### 🧪 Verifikasi Desain
```bash
node check-contrast.mjs   # cek 48 pasangan warna (WCAG AA)
node check-html.mjs       # cek keseimbangan tag HTML prototype
```

---

## 🗺️ Roadmap

| Fitur | Status |
|-------|--------|
| Desain Penpot (22 board, light + dark, prototype ter-wiring) | ✅ Selesai |
| Prototype HTML interaktif | ✅ Selesai |
| Design tokens + verifikasi kontras WCAG AA | ✅ Selesai |
| Onboarding & izin pengguna | 🚧 Pengembangan |
| Misi, level, XP & badge | 🚧 Pengembangan |
| Simulasi anti-phishing | 🚧 Pengembangan |
| Forum diskusi | 🚧 Pengembangan |
| Admin panel (materi, laporan, setting) | 🚧 Pengembangan |
| Backend & integrasi Firebase | 🚧 Pengembangan |

---

## 🛡️ Keamanan

- **RLS** pada akses konten berbasis `auth.uid` / role (bukan `auth.role` yang bisa dipalsukan)
- Progress per-user dihitung dari data aktual, bukan jumlah katalog
- Protokol **lapor & blokir** untuk konten berbahaya
- Tidak ada secret yang di-commit (`*.env` & service account di-ignore)

---

## 👥 Kontributor

Built with 💜 by **Mohammad Fahri Saleh** — desain, prototype, dan engineering.

---

<p align="center">
  <sub>Material Design 3 · WCAG AA · Dibuat untuk generasi digital yang lebih aman</sub>
</p>
