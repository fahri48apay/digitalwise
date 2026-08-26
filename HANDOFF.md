# 🤝 Handoff Kit — Project DigitalWise

> **Untuk agen AI mana pun yang melanjutkan project ini:** baca dokumen ini SEBELUM
> mengubah apa pun. Semua ID dan keputusan di bawah diverifikasi langsung dari
> Penpot pada **25 Agustus 2026**.
> Bahasa komunikasi dengan user: **Indonesia**.

---

## 1. Ringkasan project

Aplikasi Android **"DigitalWise"** — gamifikasi literasi digital untuk membentengi
remaja dari kejahatan siber di media sosial. Konsep inti sketsa user:
**Belajar – Main – Menang!** (Poin, Badge, Level, XP, Peringkat, Lapor & Bantuan).

Deliverables yang sudah ada:

1. **Desain live di Penpot**: 22 board (11 light + 11 dark) prototype ter-wiring
   (74 interaksi), 2 token set + theme `mode`, 6 komponen library (15 varian;
   Progress/Bar 75 = komponen tunggal).
2. **Prototype HTML mandiri**: `~/digitalwise/app.html` (11 layar, interaktif,
   light+dark) — paritas penuh dengan 11 board Penpot (sinkron 25 Agu 2026).
3. **Design tokens web**: `~/digitalwise/tokens.css` (sumber kebenaran, M3, WCAG AA).
4. **Skrip verifikasi**: `check-contrast.mjs` (48 pasangan warna AA) + `check-html.mjs`.

Stack target belum diputuskan user — desain memakai konvensi Material Design 3,
siap dipetakan ke Compose/RN/Flutter.

## 2. Peta aset

| Aset | Lokasi |
|---|---|
| Handoff kit (file ini) | `~/digitalwise/HANDOFF.md` |
| Prototype HTML (14 layar) | `~/digitalwise/app.html` |
| Token semantik web (sumber kebenaran) | `~/digitalwise/tokens.css` |
| Skrip cek kontras WCAG | `~/digitalwise/check-contrast.mjs` |
| Skrip cek keseimbangan tag HTML | `~/digitalwise/check-html.mjs` |
| Sketsa referensi user | gambar awal (DigitalWise hand-drawn) |
| File Penpot | "DigitalWise" ✅ rename selesai (25 Agu 2026) |

## 3. State Penpot (terverifikasi 25 Agu 2026)

- **File**: "DigitalWise" · id `502b4555-3f5f-807a-8008-88ec17c68b1a`
  ✅ rename selesai via dashboard (25 Agu 2026).
- **Page "DigitalWise"** · id `502b4555-3f5f-807a-8008-88ec17c68b1b`
- **Page "_Komponen"** · id `0add7fbb-e103-806b-8008-88f46c372a13` (library komponen)
- Canvas board 412×892 (Android dp) · baris light y=0, baris dark y=992 · x step 500.

### Board light (y=0)

| Board | ID | x | Anak* |
|---|---|---|---|
| `01 - Masuk` | `0add7fbb-e103-806b-8008-88eeb90ed5ce` | 0 | 20 |
| `02 - Beranda` | `0add7fbb-e103-806b-8008-88ef24d7a342` | 500 | 82 |
| `03 - Misi` | `0add7fbb-e103-806b-8008-88ef72e5a5a0` | 1000 | 60 |
| `04 - Simulasi Phishing` | `0add7fbb-e103-806b-8008-88efc9ecaf29` | 1500 | 38 |
| `05 - Naik Level` | `0add7fbb-e103-806b-8008-88efefa27d76` | 2000 | 27 |
| `06 - Peringkat` | `0add7fbb-e103-806b-8008-88f01a60246f` | 2500 | 66 |
| `07 - Profil` | `0add7fbb-e103-806b-8008-88f043deb84c` | 3000 | 73 |
| `08 - Lapor & Bantuan` | `0add7fbb-e103-806b-8008-88f0746d45cf` | 3500 | 34 |
| `09 - Materi Keamanan Siber` | `0add7fbb-e103-806b-8008-88f3ce0feae5` | 4000 | 51 |
| `10 - Detail Materi` | `0add7fbb-e103-806b-8008-88fc680fade9` | 4500 | 30 |
| `11 - Notifikasi` | `0add7fbb-e103-806b-8008-88fcb7f3f3a2` | 5000 | 56 |
| `04a - Kuis Soal 1` | `1a174325-1c8a-80d2-8008-89ad004bf201` | 5500 | 56 |
| `04c - Kuis Soal 3` | `1a174325-1c8a-80d2-8008-89ad0082b60a` | 6000 | 56 |
| `04d - Kuis Soal 4` | `1a174325-1c8a-80d2-8008-89ad00ac2929` | 6500 | 56 |
| `04e - Kuis Soal 5` | `1a174325-1c8a-80d2-8008-89ad00d1a69e` | 7000 | 56 |
| `12 - Diskusi & Forum` | `1a174325-1c8a-80d2-8008-89b07e118bdc` | 7500 | 56 |
| `13 - Onboarding Intro` | `9fa13424-108e-8014-8008-89bc8b8aff5b` | 8000 | 10 |
| `14 - Onboarding Gamifikasi` | `9fa13424-108e-8014-8008-89bc8b93f11d` | 8500 | 10 |
| `15 - Onboarding Izin` | `9fa13424-108e-8014-8008-89bc8b9b11ee` | 9000 | 10 |

### Board dark (y=992) — klon recolor, anak sama dengan pasangannya

| Board | ID |
|---|---|
| `01D - Masuk` | `0add7fbb-e103-806b-8008-88f1f8d63809` |
| `02D - Beranda` | `0add7fbb-e103-806b-8008-88f1f97a39ff` |
| `03D - Misi` | `0add7fbb-e103-806b-8008-88f1faedc5c0` |
| `04D - Simulasi Phishing` | `0add7fbb-e103-806b-8008-88f1fc432387` |
| `05D - Naik Level` | `0add7fbb-e103-806b-8008-88f1fd7ad3d3` |
| `06D - Peringkat` | `0add7fbb-e103-806b-8008-88f1fea4eec0` |
| `07D - Profil` | `0add7fbb-e103-806b-8008-88f2007a3653` |
| `08D - Lapor & Bantuan` | `0add7fbb-e103-806b-8008-88f202f96e44` |
| `09D - Materi Keamanan Siber` | `0add7fbb-e103-806b-8008-88f400749e7a` |
| `10D - Detail Materi` | `0add7fbb-e103-806b-8008-88fc8e249231` |
| `11D - Notifikasi` | `0add7fbb-e103-806b-8008-88fcf6ce0594` |
| `04aD - Kuis Soal 1` | `1a174325-1c8a-80d2-8008-89ad00f4a8d2` |
| `04cD - Kuis Soal 3` | `1a174325-1c8a-80d2-8008-89ad01185ae9` |
| `04dD - Kuis Soal 4` | `1a174325-1c8a-80d2-8008-89ad013cab3e` |
| `04eD - Kuis Soal 5` | `1a174325-1c8a-80d2-8008-89ad01628604` |
| `12D - Diskusi & Forum` | `1a174325-1c8a-80d2-8008-89b07e4b8742` |
| `13D - Onboarding Intro` | `9fa13424-108e-8014-8008-89bc8b8f75ed` |
| `14D - Onboarding Gamifikasi` | `9fa13424-108e-8014-8008-89bc8b978720` |
| `15D - Onboarding Izin` | `9fa13424-108e-8014-8008-89bc8b9e69ec` |

\* jumlah anak = referensi sanity-check per 25 Agu; bisa berubah bila kamu edit.

### Shape penting & konvensi penamaan

- Hit areas selalu bernama `*-hit`, fill `on-surface` @ op 0.01, diletakkan paling
  atas (z-order terakhir) supaya klik tidak tertutup.
- `02`/`02D`: `topbar / bell-hit` → Notifikasi (id light `0add7fbb-e103-806b-8008-88fcf5619b6f`,
  dark `0add7fbb-e103-806b-8008-88fcf992114f`).
- Penamaan `domain / nama` (spasi di sekitar `/` — Penpot menormalisasi `/` jadi ` / `).
  Domain yang dipakai: `bg, sys, topbar, xp, stat, misi, progres, help, nav, filter,
  kat, tantangan, sim, kuis, feedback, cta, reward, deco, podium, rank, note, akun,
  lencana, darurat, kategori, form, privasi, materi, poin, video, notf, seksi,
  link, judul, logo`.

## 4. Wiring interaksi (94 total — 47 light + 47 dark, 0 putus)

Trigger semua `click`, animasi seragam **push left 300ms ease-out** via
`navigate-to` + `animation: {type:"push", direction:"left", duration:300, easing:"ease-out"}`.
Board dark mengarah ke board D sepenuhnya (simetris dengan light).

| Dari | Shape | Ke |
|---|---|---|
| 01 | `cta / masuk` | 02 |
| 02 | `topbar / bell-hit` | 11 |
| 02 | `misi / lihat-semua-hit` | 03 |
| 02 | `help / lapor-btn` | 08 |
| 02 | `forum / forum-btn` | 12 |
| 02 | `nav / misi-hit` · `nav / peringkat-hit` · `nav / profil-hit` | 03 · 06 · 07 |
| 03 | `cta / mulai` | 04a |
| 03 | `kat / kartu-1` | 09 |
| 03 | `nav / beranda-hit` · `nav / peringkat-hit` · `nav / profil-hit` | 02 · 06 · 07 |
| 04a | `nav / back-hit` | 03 |
| 04a | `cta / lanjut` | 04 |
| 04 | `nav / back-hit` | 03 |
| 04 | `cta / lanjut` | 04c |
| 04c | `nav / back-hit` | 03 |
| 04c | `cta / lanjut` | 04d |
| 04d | `nav / back-hit` | 03 |
| 04d | `cta / lanjut` | 04e |
| 04e | `nav / back-hit` | 03 |
| 04e | `cta / lanjut` | 05 |
| 05 | `cta / lanjut-belajar` | 03 |
| 06 | `nav / beranda-hit` · `nav / misi-hit` · `nav / profil-hit` | 02 · 03 · 07 |
| 07 | `akun / lapor-hit` | 08 |
| 07 | `nav / beranda-hit` · `nav / misi-hit` · `nav / peringkat-hit` | 02 · 03 · 06 |
| 08 | `nav / back-hit` | 07 |
| 09 | `nav / back-hit` | 03 |
| 09 | `cta / kuis-kategori` | 04 |
| 09 | `materi / item-3` | 10 |
| 09 | `nav / beranda-hit` · `nav / misi-hit` · `nav / peringkat-hit` · `nav / profil-hit` | 02 · 03 · 06 · 07 |
| 10 | `nav / back-hit` | 09 |
| 10 | `cta / selesaikan` | 09 |
| 11 | `nav / back-hit` | 02 |
| 11 | `nav / beranda-hit` · `nav / misi-hit` · `nav / peringkat-hit` · `nav / profil-hit` | 02 · 03 · 06 · 07 |
| 12 | `nav / back-hit` | 02 |
| 11 | `nav / beranda-hit` · `nav / misi-hit` · `nav / peringkat-hit` · `nav / profil-hit` | 02 · 03 · 06 · 07 |

Hitung per board (light = dark): 01:1 · 02:6 · 03:5 · 04:2 · 05:1 · 06:3 · 07:4 ·
08:1 · 09:7 · 10:2 · 11:5 = 37.

Catatan prototype: kuis hanya menampilkan state "soal 2 dari 5" + panel feedback
benar (statis). Layar tanpa bottom nav = focused task (04, 10; 08 & 11 kembali via
back top-bar).

## 5. Design token & tema

- **Token set `digitalwise.light`** — 38 token (33 warna semantik + 5 radius).
- **Token set `digitalwise.dark`** — 33 warna.
- **Theme group `mode`**: `light` (aktif, bound set light) · `dark` (bound set dark).
  ⚠️ Signature resmi: `cat.addTheme({ group: "mode", name: "dark" })` — objek, BUKAN
  dua string (dokumentasi overview menyebut dua string, ternyata gagal).
- Sumber kebenaran nilai: `~/digitalwise/tokens.css` (light+dark, type scale Plus
  Jakarta Sans, spacing 4pt, radius, elevasi, motion, touch 48dp).
- ⚠️ **Warna shape hard-coded hex** (tidak di-bind via `applyToken`) — ganti tema
  Penpot TIDAK mengubah tampilan board; baris dark adalah klon terpisah. Kalau mau
  theme-switching live: re-apply token atau pakai variabel warna.
- **8 warna AMBIGU** (sah di kedua skema; jangan dipakai untuk deteksi "bocor"):
  `DFE0FF DDE1F9 EDDBFF A9F2B6 FFDDB0 F9DEDC C6C5D0 45464F`.
- `video / bg` sengaja `#2F3036` di KEDUA mode (permukaan video memang gelap) —
  bukan sisa light.
- Font: **Plus Jakarta Sans** (tersedia di Penpot, weight 200–800; dipakai 400–800).

## 6. Komponen (page `_Komponen`)

| Container | Property | Varian |
|---|---|---|
| `Komponen / Button` | Type | Primary · Outline · Success · Error |
| `Komponen / IconBox` | Tone | Primary · Tertiary · Success · Warning · Error |
| `Komponen / Avatar` | Size | Default (44) · Large (72) |
| `Komponen / NavItem` | State | Active (pill + label 700) · Default |
| `Komponen / Chip` | State | Selected · Default |
| `Progress / Bar 75` | — | komponen tunggal (track + fill 75%) |

Library names: `Avatar, Bar 75, Button, Chip, IconBox, NavItem`.
⚠️ Ikon dalam IconBox/NavItem = SVG statis per varian (bukan swap ikon) —
ganti ikon = edit main instance.

## 7. Keputusan desain & alasannya (jangan dibalik tanpa alasan baru)

1. **Indigo = aksi/keamanan, violet = gamifikasi** — hierarki M3 konsisten; satu
   primary button per layar (Practical UI).
2. **"150 XP lagi menuju Level 4"** — goal-gradient effect (Laws of UX).
3. **Layar 05 perayaan penuh** — peak-end rule; konfeti + glow tetap ada di dark.
4. **Podium tanpa ikon star di baris XP** — ikon 12px menutupi angka (ditemukan
   saat review ekspor PNG); teks di-center per kartu.
5. **Baris "Kamu" selalu tampil di Peringkat** + catatan "bersaing positif" —
   relevansi diri tanpa budaya toxic; sekaligus memperbaiki inkonsistensi sketsa
   (Raka Level 3 tapi peringkat 1).
6. **Progress bars, bukan pie chart** — perbandingan 3 nilai lebih presisi dan
   ramah buta warna (sketsa memakai pie).
7. **Tombol Aman/Tidak Aman: outline + ikon + warna** — bukan warna saja (buta warna).
8. **Konten edukatif realistis** — contoh phishing memakai taktik nyata (hadiah
   gratis, tenggat 1 jam, link bit.ly) agar simulasi bernilai belajar.
9. **Bahasa remaja, tanpa emoji di UI** — ikon vektor Feather-style (MIT), copy
   singkat kalimat aktif.
10. **Dark = klon terpisah, bukan variabel** — mengikuti keterbatasan API (lihat
    §8.5) dan supaya Play mode bisa mendemokan kedua tema.
11. **Persona demo = "Kamu" (Kirana Putri, peringkat #6, 650 XP)** — Raka adalah
    peer di podium #1. Sapaan Beranda, layar naik level, Profil, dan notifikasi
    mengikuti persona ini (perbaikan konsistensi lintas layar, 25 Agu 2026).
    Baris "Kamu" memakai goal-gradient "50 XP lagi ke #5" (700−650).

## 8. Gotcha API plugin Penpot (warisan CT §7 + pelajaran baru sesi ini)

Warisan Coffee Tongkrong (tetap berlaku): storage reset antar sesi · x/y absolut
halaman · nama `/` jadi ` / ` · `createText("")` gagal · komentar `-->` ditolak
sandbox · `createShapeFromSvg` ✅ · `board.interactions` readonly (pakai
`addInteraction`/`interaction.remove()`) · rename file manual · width/height
readonly (`resize`) · tanpa injeksi raster · `isContainedIn` false-negative di teks.

**Baru dari sesi DigitalWise (25 Agu 2026):**

1. `penpot.currentUser` → error permission `user:read not granted` — jangan akses.
2. `addTheme` signature benar: **objek** `{group, name}` — bentuk dua string gagal
   dengan "Value not valid".
3. `shape.fills` berisi instance Fill dengan private fields — `Object.assign({}, f)`
   menghasilkan `{}` dan set gagal ("Value not valid: [{} ...]"). Selalu set ulang
   dengan objek plain `{fillColor, fillOpacity}`. Teks ber-range styling (getRange):
   set base fills + apply ulang range setelahnya.
4. `penpotUtils.getPages()` mengembalikan referensi ringan TANPA `.root` — ambil
   page penuh via `penpotUtils.getPageById(id)` dulu.
5. **Cross-page reparent mustahil**: "Cannot modify a page that is not currently
   active" — shape hanya bisa dimodifikasi saat halaman ASALNYA aktif; memindah
   shape antar halaman via API tidak bisa (drag manual di UI).
6. `penpotUtils.createVariantContainer` bisa menempatkan container di halaman/board
   tak terduga (pernah: IconBox nyempil di dalam board `01 - Masuk`, Chip di root
   halaman lain). SELALU verifikasi parentChain setelah membuat varian.
7. `clone()` membawa interaksi ikut — hapus semua interaksi klon sebelum wiring ulang.
8. `addInteraction("click", board)` **SILENTLY DROPS destination** — harus pakai Action
   object: `addInteraction("click", {type:"navigate-to", destination: board})`. Tanpa
   `{type:"navigate-to",...}`, destination = NONE tapi tidak error.
9. Ekspor PNG **terlihat oleh model** di environment ini (attached media) — manfaatkan
   sebagai QA visual; ini berbeda dari catatan CT §7.9 (beda versi MCP).
10. Filter nama board: `/^0\d/` tidak menangkap "10", "11", "04a" — pakai `/^\d\d?[a-e]?D? - /`.
11. Ikon kecil (≤16px) di depan teks butuh gap ≥8px atau hapus — di 412dp, gap 4–6px
    tampak menimpa saat dirender (kasus podium & share icon).
12. `createBoard(name)` kadang tak menerapkan nama — selalu cek & rename manual;
    call gagal di tengah bisa meninggalkan board liar "Board".

## 9. Ritual awal sesi (copy-paste ini dulu)

```js
// Verifikasi state DigitalWise — JANGAN bikin ulang yang "hilang", cari by name
if (penpot.currentPage.name !== "DigitalWise") {
  const ref = penpotUtils.getPages().find(p => p.name === "DigitalWise");
  await penpot.openPage(penpotUtils.getPageById(ref.id));
}
const root = penpot.currentPage.root;
const byName = {};
(root.children || []).forEach(s => {
  if (s.type === "board" && /^\d\d?[a-e]?D? - /.test(s.name)) byName[s.name] = s.id;
});
const expected = ["01 - Masuk","02 - Beranda","03 - Misi","04 - Simulasi Phishing",
  "04a - Kuis Soal 1","04c - Kuis Soal 3","04d - Kuis Soal 4","04e - Kuis Soal 5",
  "05 - Naik Level","06 - Peringkat","07 - Profil","08 - Lapor & Bantuan",
  "09 - Materi Keamanan Siber","10 - Detail Materi","11 - Notifikasi","12 - Diskusi & Forum"];
const missing = [];
expected.forEach(n => {
  if (!byName[n]) missing.push(n);
  if (!byName[n.replace(/^(\d+)/, "$1D")]) missing.push(n + " (dark)");
});
let totalIx = 0, broken = 0;
(root.children || []).filter(s => s.type === "board").forEach(b =>
  (b.children || []).forEach(s => (s.interactions || []).forEach(ix => {
    totalIx++; try { if (!ix.action.destination) broken++; } catch (e) { broken++; }
  })));
return {
  page: penpot.currentPage.name,
   boards: Object.keys(byName).length,   // ekspektasi 38
   missing,                              // ekspektasi []
   totalInteractions: totalIx,           // ekspektasi 106
   broken,                               // ekspektasi 0
  tokens: penpot.library.local.tokens.sets.map(s => s.name + ":" + s.tokens.length)
};
```

Kalau ada yang `missing` → cari by name global (`penpotUtils.findShape`), JANGAN
bikin baru. Kalau interaksi < 106 → cek tabel §4 dan wiring ulang yang putus.

## 10. Backlog / next steps

- [x] **Rename file Penpot** → "DigitalWise" ✅ (25 Agu 2026).
- [ ] (Opsional) Pindah file ke project Penpot baru bernama "DigitalWise".
- [x] **Sinkronkan `app.html`** — layar 09–11 ditambahkan ✅ (25 Agu 2026; galeri
  presentasi, wiring antar-layar tetap di prototype Penpot).
- [x] Audit 25 Agu 2026: persona diselaraskan (§7.11), `role="status"` panel kuis,
  `aria-pressed` chip filter, typo "janji" & "jejak digital", notifikasi
  "#2" → "naik 2 peringkat", hitungan varian 13 → 15.
- [x] Audit 25 Agu 2026 (lanjutan): focus-visible seragam (trail-btn, link legal,
  theme-toggle, back video), `tokens.css` mirror `prefers-color-scheme` diimplement
  nyata (bukan dead code), Material Symbols `display=block`, void tags `check-html.mjs`
  dilengkapi.
- [x] Board kuis lengkap: soal 1, 3, 4, 5 (04a/c/d/e light+dark, 8 boards baru).
- [x] Fitur sketsa yang belum ada board-nya: **Diskusi & Forum** (board 12/12D + entry di Beranda, HTML section 12).
- [x] Progress bar "3 dari 4" → "2 dari 4 · 50%" (boards 02/03/09 light+dark + HTML 6 lokasi).
- [x] State kosong/error HTML (section 14): streak putus, offline, nol lencana, laporan ditolak.
- [x] Onboarding HTML (section 13): 3 slides carousel + izin notifikasi.
- [x] State kosong/error Penpot boards on `_Komponen` page.
- [x] Onboarding Penpot boards (13-15 light+dark, 6 boards baru).
- [x] Bind token ke shape (`applyToken`): 1021 bindings across 38 boards ✅.
