# Sync Mobile-App Frontend dengan Penpot Design

> **For agentic workers:** Use executing-plans to implement this plan task-by-task.

**Goal:** Seluruh layar `mobile-app/` memiliki visual yang identik dengan desain Penpot (**light + dark theme**), termasuk typography, warna, spacing, komponen, dan layout.

**Architecture:** Bangun design system React Native berdasarkan `tokens.css` (light + dark) → buat shared components → update layar satu per satu → tambahkan dark mode toggle. Setiap layar diekstrak detail dari Penpot via MCP sebelum diimplementasi.

**Tech Stack:** Expo 52, React Native 0.76, React Native Paper 5, Expo Router 4, Zustand, Supabase

**Spec:** Penpot boards 01–15 (light variants), `tokens.css`, `HANDOFF.md`

---

## Mapping: Penpot Board → mobile-app Screen

| # | Penpot Board | mobile-app File | Status |
|---|---|---|---|
| 01 | Masuk | `(auth)/login.tsx` | ⚠️ Generic Paper components |
| 02 | Beranda | `(tabs)/index.tsx` | ⚠️ Perlu sync |
| 03 | Misi | `(tabs)/missions.tsx` | ⚠️ Perlu sync |
| 04 | Simulasi Phishing + Kuis | `quiz/[id].tsx` | ⚠️ Perlu sync |
| 05 | Naik Level | `(tabs)/index.tsx` (modal) | ⚠️ Perlu sync |
| 06 | Peringkat | `(tabs)/leaderboard.tsx` | ⚠️ Perlu sync |
| 07 | Profil | `(tabs)/profile.tsx` | ⚠️ Perlu sync |
| 08 | Lapor & Bantuan | `report/new.tsx` | ⚠️ Perlu sync |
| 09 | Materi | `material/index.tsx` | ⚠️ Perlu sync |
| 10 | Detail Materi | `material/[id].tsx` | ⚠️ Perlu sync |
| 11 | Notifikasi | `notifications.tsx` | ⚠️ Perlu sync |
| 12 | Diskusi & Forum | `forum/index.tsx` | ⚠️ Perlu sync |
| 13–15 | Onboarding | Belum ada | ❌ Perlu buat baru |

---

## Global Constraints

- Semua warna WAJIB dari `COLORS` di `constants.ts` (source of truth: `tokens.css`)
- Font: Plus Jakarta Sans (sudah di-install via Google Fonts di `app.html`, di RN pakai `expo-font` atau system font)
- Spacing: scale 4pt (4, 8, 12, 16, 20, 24, 32, 40, 48)
- Shape: radius xs=8, sm=12, md=16, lg=20, xl=28, full=999
- Min touch target: 48px
- Semua komponen harus reusable dan diletakkan di `components/ui/`
- Ekstrak detail dari Penpot via MCP **sebelum** implementasi setiap layar

---

## Phase 0: Design System Foundation

### Task 0.1: Update constants.ts — Lengkapi Semua Tokens

**Files:**
- Modify: `mobile-app/lib/constants.ts`

Tambahkan export untuk typography scale, spacing, radius, dan elevation yang belum ada.

- [ ] Tambahkan `TYPOGRAPHY` object:
```typescript
export const TYPOGRAPHY = {
  displayLg: { fontSize: 36, lineHeight: 44, fontWeight: "700" as const },
  headlineMd: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },
  titleLg: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  titleMd: { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodyMd: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  labelLg: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
  labelMd: { fontSize: 12, lineHeight: 16, fontWeight: "600" as const },
  labelSm: { fontSize: 11, lineHeight: 16, fontWeight: "600" as const },
};
```

- [ ] Tambahkan `SPACING` object:
```typescript
export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
  xxxl: 32, xxxxl: 40, xxxxxl: 48,
};
```

- [ ] Tambahkan `RADIUS` object:
```typescript
export const RADIUS = {
  xs: 8, sm: 12, md: 16, lg: 20, xl: 28, full: 999,
};
```

- [ ] Tambahkan `ELEVATION` object:
```typescript
export const ELEVATION = {
  none: { shadowOpacity: 0 },
  low: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 2, elevation: 2 },
  medium: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.30, shadowRadius: 6, elevation: 4 },
  high: { shadowOffset: {width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8, elevation: 8 },
};
```

- [ ] Tambahkan `COLORS_DARK` object (mirror dari `tokens.css` dark scheme):
```typescript
export const COLORS_DARK = {
  primary: "#bdc3ff",
  onPrimary: "#1b2593",
  primaryContainer: "#3641a9",
  onPrimaryContainer: "#dfe0ff",
  secondary: "#c0c4dd",
  onSecondary: "#2a3042",
  secondaryContainer: "#414659",
  onSecondaryContainer: "#dde1f9",
  tertiary: "#d6baff",
  onTertiary: "#431c74",
  tertiaryContainer: "#5b378d",
  onTertiaryContainer: "#eddbff",
  success: "#8ed99b",
  onSuccess: "#00391a",
  successContainer: "#005327",
  onSuccessContainer: "#a9f2b6",
  warning: "#ffb95c",
  onWarning: "#4a2800",
  warningContainer: "#6b3d00",
  onWarningContainer: "#ffddb0",
  error: "#f2b8b5",
  onError: "#601410",
  errorContainer: "#8c1d18",
  onErrorContainer: "#f9dedc",
  background: "#131318",
  surface: "#1e1f24",
  surfaceDim: "#131318",
  surfaceContainerLowest: "#0e0e13",
  surfaceContainerLow: "#1a1b20",
  surfaceContainer: "#1e1f24",
  surfaceContainerHigh: "#292a2f",
  surfaceContainerHighest: "#34353a",
  onSurface: "#e4e1ec",
  onSurfaceVariant: "#c6c5d0",
  outline: "#90909a",
  outlineVariant: "#45464f",
  inverseSurface: "#e4e1ec",
  inverseOnSurface: "#2f3036",
  inversePrimary: "#3e4bbe",
  scrim: "rgba(0, 0, 0, 0.6)",
};
```

- [ ] Tambahkan helper `useColorScheme()` untuk switch light/dark:
```typescript
export type ThemeMode = "light" | "dark";
export function getColors(mode: ThemeMode) {
  return mode === "dark" ? COLORS_DARK : COLORS;
}
```

- [ ] Commit: `feat(tokens): add dark theme tokens and theme helper`

---

### Task 0.2: Update Paper Theme — Full Semantic Colors (Light + Dark)

**Files:**
- Modify: `mobile-app/app/_layout.tsx`

Update theme object agar match `tokens.css` light + dark scheme secara lengkap. Buat `lightTheme` dan `darkTheme` terpisah.

- [ ] Buat `lightTheme` berdasarkan `COLORS`:
```typescript
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    onPrimary: COLORS.onPrimary,
    primaryContainer: COLORS.primaryContainer,
    onPrimaryContainer: COLORS.onPrimaryContainer,
    secondary: COLORS.secondary,
    onSecondary: COLORS.onSecondary,
    secondaryContainer: COLORS.secondaryContainer,
    onSecondaryContainer: COLORS.onSecondaryContainer,
    tertiary: COLORS.tertiary,
    onTertiary: COLORS.onTertiary,
    tertiaryContainer: COLORS.tertiaryContainer,
    onTertiaryContainer: COLORS.onTertiaryContainer,
    error: COLORS.error,
    onError: COLORS.onError,
    errorContainer: COLORS.errorContainer,
    onErrorContainer: COLORS.onErrorContainer,
    background: COLORS.background,
    onBackground: COLORS.onSurface,
    surface: COLORS.surface,
    onSurface: COLORS.onSurface,
    surfaceVariant: COLORS.surfaceContainer,
    onSurfaceVariant: COLORS.onSurfaceVariant,
    outline: COLORS.outline,
    outlineVariant: COLORS.outlineVariant,
    surfaceDisabled: COLORS.surfaceContainerLow,
    onSurfaceDisabled: COLORS.onSurfaceVariant,
    backdrop: COLORS.scrim,
  },
};
```

- [ ] Buat `darkTheme` berdasarkan `COLORS_DARK` (struktur sama, values dari dark tokens)

- [ ] Buat `ThemeProvider` context untuk manage theme state + toggle:
```typescript
// components/ThemeProvider.tsx
// - Store theme mode in AsyncStorage
// - Provide toggleTheme() function
// - Apply PaperProvider with correct theme
```

- [ ] Update `_layout.tsx` untuk use `ThemeProvider`

- [ ] Commit: `feat(theme): add light + dark Paper themes with toggle`

---

### Task 0.3: Buat Shared UI Components

**Files:**
- Create: `mobile-app/components/ui/Button.tsx`
- Create: `mobile-app/components/ui/Card.tsx`
- Create: `mobile-app/components/ui/Input.tsx`
- Create: `mobile-app/components/ui/Chip.tsx`
- Create: `mobile-app/components/ui/Icon.tsx`
- Create: `mobile-app/components/ui/Avatar.tsx`
- Create: `mobile-app/components/ui/StatusBar.tsx`

Buat reusable components yang match Penpot design tokens.

- [ ] **Button.tsx** — pill button (radius 26), variants: filled, outlined, text, tonal
```typescript
// Props: variant, label, onPress, icon?, loading?, disabled?, style?
// filled: bg=primary, text=onPrimary, radius=26, height=52, full width
// outlined: border=primary, text=primary, radius=26, height=52
// text: no bg, text=primary
// tonal: bg=secondaryContainer, text=onSecondaryContainer, radius=26
```

- [ ] **Card.tsx** — surface-container bg, radius=16, padding=16
```typescript
// Props: children, style?, variant?: 'elevated' | 'filled' | 'outlined'
// elevated: bg=surfaceContainerLow, elevation=low
// filled: bg=surfaceContainer
// outlined: bg=surface, border=outline
```

- [ ] **Input.tsx** — text input with label, placeholder, icon
```typescript
// Props: label, placeholder, value, onChangeText, secureTextEntry?, trailingIcon?, error?
// White bg, border=outline, radius=12, height=52
// Label above field (12px, weight=600, color=onSurfaceVariant)
// Trailing icon right-aligned
```

- [ ] **Chip.tsx** — small chip with icon and label
```typescript
// Props: label, icon?, variant?: 'filled' | 'outlined', color?
// radius=8, height=32, font=labelMd
```

- [ ] **Icon.tsx** — wrapper for MaterialCommunityIcons or Ionicons
```typescript
// Props: name, size?, color?
// Default size=24, color=onSurfaceVariant
```

- [ ] **Avatar.tsx** — user avatar circle
```typescript
// Props: uri?, name?, size?
// Default 48px, bg=primaryContainer, text=onPrimaryContainer
```

- [ ] **StatusBar.tsx** — phone status bar (time, signal, wifi, battery)
```typescript
// Consistent across all screens: height=34, font=labelMd
```

- [ ] Commit: `feat(ui): create shared design system components`

---

## Phase 1: Auth Screens

### Task 1.1: Login Screen (01 - Masuk)

**Files:**
- Modify: `mobile-app/app/(auth)/login.tsx`

Ekstrak detail dari Penpot board `01 - Masuk`, lalu implementasi.

**Penpot specs (dari ekstraksi):**
- Background: `#fbf8fe` (surface)
- Logo shield: 96×96, centered
- Wordmark: "Digital**Wise**" 800/30px, "Wise" in primary
- Tagline: 14px/400, color=onSurfaceVariant, max-width=280, centered
- Form fields:
  - Label: 12px/600, color=onSurfaceVariant
  - Input: 364×52, bg=white, border=outline, radius=12
  - Placeholder: 15px/400, color=onSurfaceVariant
  - Trailing icon: 24×24, right=12px, color=onSurfaceVariant
- Email field: trailing icon="mail"
- Password field: trailing icon="eye" (toggle visibility)
- CTA "Masuk": 364×52, bg=primary, text=onPrimary, radius=26, weight=600
- Link "Belum punya akun? Daftar sekarang": 14px/600, color=primary, centered
- Legal: 12px/400, color=onSurfaceVariant, centered

- [ ] Ekstrak semua elemen detail dari Penpot board 01
- [ ] Implementasi login screen dengan custom components (bukan generic Paper)
- [ ] Tambahkan logo shield SVG
- [ ] Tambahkan wordmark dengan split color
- [ ] Tambahkan trailing icons (mail, eye toggle)
- [ ] Style tombol Masuk pill (radius 26)
- [ ] Tambahkan legal text di bawah
- [ ] Commit: `feat(login): match Penpot board 01 design`

---

### Task 1.2: Register Screen

**Files:**
- Modify: `mobile-app/app/(auth)/register.tsx`

Ekstrak dari Penpot (board tidak ada secara eksplisit, tapi follow pattern login).

- [ ] Apply design system yang sama dengan login
- [ ] Fields: username, email, password
- [ ] Tombol "Daftar" pill
- [ ] Link "Sudah punya akun? Masuk"
- [ ] Commit: `feat(register): apply design system to register screen`

---

## Phase 2: Tab Screens

### Task 2.1: Tab Bar Layout

**Files:**
- Modify: `mobile-app/app/(tabs)/_layout.tsx`

Ekstrak nav bar dari Penpot boards (konsisten di semua layar).

**Penpot specs:**
- Height: ~72px (nav-height)
- BG: surface-container-highest (#e4e1ea)
- Border-radius (pill indicator): 15px
- Active label: 11px/500
- Active icon: filled variant
- Inactive: onSurfaceVariant

- [ ] Update tab bar styling sesuai Penpot
- [ ] Commit: `feat(tabs): style tab bar per Penpot nav specs`

---

### Task 2.2: Home Screen (02 - Beranda)

**Files:**
- Modify: `mobile-app/app/(tabs)/index.tsx`

Ekstrak dari Penpot board `02 - Beranda`.

**Penpot specs (perlu ekstraksi detail):**
- Header: avatar + greeting + level
- XP card: surface-container bg, radius=24, XP bar (radius=4)
- Streak badge
- Quick action cards (Materi, Forum, Lapor)
- Forum CTA card
- Help CTA card

- [ ] Ekstrak semua elemen dari Penpot board 02
- [ ] Implementasi header dengan avatar dan greeting
- [ ] Implementasi XP card dengan progress bar
- [ ] Implementasi streak badge
- [ ] Implementasi quick action grid
- [ ] Implementasi CTA cards
- [ ] Commit: `feat(home): match Penpot board 02 design`

---

### Task 2.3: Missions Screen (03 - Misi)

**Files:**
- Modify: `mobile-app/app/(tabs)/missions.tsx`

Ekstrak dari Penpot board `03 - Misi`.

- [ ] Ekstrak semua elemen dari Penpot board 03
- [ ] Implementasi mission list dengan card styling
- [ ] Commit: `feat(missions): match Penpot board 03 design`

---

### Task 2.4: Leaderboard Screen (06 - Peringkat)

**Files:**
- Modify: `mobile-app/app/(tabs)/leaderboard.tsx`

Ekstrak dari Penpot board `06 - Peringkat`.

- [ ] Ekstrak semua elemen dari Penpot board 06
- [ ] Implementasi podium (top 3)
- [ ] Implementasi ranked list
- [ ] Commit: `feat(leaderboard): match Penpot board 06 design`

---

### Task 2.5: Profile Screen (07 - Profil)

**Files:**
- Modify: `mobile-app/app/(tabs)/profile.tsx`

Ekstrak dari Penpot board `07 - Profil`.

- [ ] Ekstrak semua elemen dari Penpot board 07
- [ ] Implementasi profile header dengan avatar
- [ ] Implementasi stats cards
- [ ] Implementasi settings/logout
- [ ] Commit: `feat(profile): match Penpot board 07 design`

---

## Phase 3: Feature Screens

### Task 3.1: Quiz Screen (04 - Simulasi Phishing + Kuis Soal)

**Files:**
- Modify: `mobile-app/app/quiz/[id].tsx`

Ekstrak dari Penpot boards `04 - Simulasi Phishing` + `04a-e - Kuis Soal 1-5`.

- [ ] Ekstrak semua elemen dari Penpot boards 04, 04a-e
- [ ] Implementasi quiz question card
- [ ] Implementasi answer options (radio buttons)
- [ ] Implementasi progress indicator
- [ ] Implementasi feedback states (benar/salah)
- [ ] Commit: `feat(quiz): match Penpot board 04 design`

---

### Task 3.2: Material List (09 - Materi) + Detail (10)

**Files:**
- Modify: `mobile-app/app/material/index.tsx`
- Modify: `mobile-app/app/material/[id].tsx`

Ekstrak dari Penpot boards `09 - Materi` + `10 - Detail Materi`.

- [ ] Ekstrak semua elemen dari Penpot boards 09, 10
- [ ] Implementasi material grid/list
- [ ] Implementasi material detail
- [ ] Commit: `feat(material): match Penpot boards 09-10 design`

---

### Task 3.3: Notifications Screen (11)

**Files:**
- Modify: `mobile-app/app/notifications.tsx`

Ekstrak dari Penpot board `11 - Notifikasi`.

- [ ] Ekstrak semua elemen dari Penpot board 11
- [ ] Implementasi notification list dengan section headers
- [ ] Commit: `feat(notifications): match Penpot board 11 design`

---

### Task 3.4: Forum Screens (12)

**Files:**
- Modify: `mobile-app/app/forum/index.tsx`
- Modify: `mobile-app/app/forum/new.tsx`
- Modify: `mobile-app/app/forum/[id].tsx`

Ekstrak dari Penpot board `12 - Diskusi & Forum`.

- [ ] Ekstrak semua elemen dari Penpot board 12
- [ ] Implementasi forum post list
- [ ] Implementasi new post form
- [ ] Implementasi post detail
- [ ] Commit: `feat(forum): match Penpot board 12 design`

---

### Task 3.5: Report Screen (08 - Lapor & Bantuan)

**Files:**
- Modify: `mobile-app/app/report/new.tsx`

Ekstrak dari Penpot board `08 - Lapor & Bantuan`.

- [ ] Ekstrak semua elemen dari Penpot board 08
- [ ] Implementasi report form
- [ ] Commit: `feat(report): match Penpot board 08 design`

---

### Task 3.6: Level Up Modal (05 - Naik Level)

**Files:**
- Modify: `mobile-app/app/(tabs)/index.tsx` (modal overlay)

Ekstrak dari Penpot board `05 - Naik Level`.

- [ ] Ekstrak semua elemen dari Penpot board 05
- [ ] Implementasi level up celebration modal
- [ ] Commit: `feat(levelup): match Penpot board 05 design`

---

## Phase 4: Onboarding (New Screens)

### Task 4.1: Onboarding Intro (13)

**Files:**
- Create: `mobile-app/app/(onboarding)/_layout.tsx`
- Create: `mobile-app/app/(onboarding)/intro.tsx`

Ekstrak dari Penpot board `13 - Onboarding Intro`.

- [ ] Ekstrak semua elemen dari Penpot board 13
- [ ] Create onboarding stack layout
- [ ] Implement intro screen
- [ ] Commit: `feat(onboarding): create intro screen per Penpot board 13`

---

### Task 4.2: Onboarding Gamifikasi (14)

**Files:**
- Create: `mobile-app/app/(onboarding)/gamification.tsx`

Ekstrak dari Penpot board `14 - Onboarding Gamifikasi`.

- [ ] Ekstrak semua elemen dari Penpot board 14
- [ ] Implement gamifikasi explanation screen
- [ ] Commit: `feat(onboarding): create gamification screen per Penpot board 14`

---

### Task 4.3: Onboarding Izin (15)

**Files:**
- Create: `mobile-app/app/(onboarding)/permissions.tsx`

Ekstrak dari Penpot board `15 - Onboarding Izin`.

- [ ] Ekstrak semua elemen dari Penpot board 15
- [ ] Implement permissions request screen
- [ ] Commit: `feat(onboarding): create permissions screen per Penpot board 15`

---

### Task 4.4: Connect Onboarding to Auth Flow

**Files:**
- Modify: `mobile-app/app/_layout.tsx`
- Modify: `mobile-app/app/(auth)/_layout.tsx`

- [ ] Add onboarding stack to root navigator
- [ ] Add first-launch check (AsyncStorage)
- [ ] Route new users through onboarding before login
- [ ] Commit: `feat(onboarding): integrate with auth flow`

---

## Phase 5: Dark Mode (Penpot 01D–15D)

### Task 5.1: Theme Provider + Toggle

**Files:**
- Create: `mobile-app/providers/ThemeProvider.tsx`
- Modify: `mobile-app/app/_layout.tsx`
- Modify: `mobile-app/app/(tabs)/_layout.tsx` (tambah settings icon)

- [ ] Buat `ThemeProvider` dengan React Context:
```typescript
// State: mode ("light" | "dark" | "system")
// Persist: AsyncStorage key "theme-mode"
// Toggle: cycle light → dark → system
// Consumer: useTheme() hook → { mode, colors, isDark, toggleTheme }
```

- [ ] Wrap app dengan `ThemeProvider` di `_layout.tsx`
- [ ] Pass correct Paper theme (lightTheme / darkTheme) based on mode
- [ ] Tambahkan theme toggle button di tab bar atau profile screen
- [ ] Commit: `feat(theme): add ThemeProvider with light/dark/system toggle`

---

### Task 5.2: Audit & Fix All Screens for Dark Mode

**Files:**
- All screen files di `app/`

Setelah semua layar match Penpot light, audit satu per satu untuk dark mode.

**Pattern yang harus dicek di setiap layar:**
- Background screens: harus pakai `theme.colors.background` (bukan hardcode)
- Card/container: harus pakai `theme.colors.surface` / `surfaceVariant`
- Text: harus pakai `theme.colors.onSurface` / `onSurfaceVariant`
- Borders/outlines: harus pakai `theme.colors.outline`
- Images/SVG: pastikan tidak hilang di dark bg
- StatusBar: style harus berubah sesuai theme (light/dark)

- [ ] **Auth screens** — Login + Register: test dark bg, input fields, icons
- [ ] **Tab screens** — Home, Missions, Leaderboard, Profile
- [ ] **Feature screens** — Quiz, Material, Forum, Report, Notifications
- [ ] **Onboarding screens** — Intro, Gamification, Permissions
- [ ] **Admin screens** — Dashboard, CRUD screens
- [ ] Periksa semua `StyleSheet.create()` — ganti hardcode colors dengan theme tokens
- [ ] Periksa semua inline `style={{ color: "..." }}` — ganti dengan theme-aware values
- [ ] Pastikan semua SVG icons visible di dark mode ( stroke/fill color)
- [ ] Pastikan status bar style berubah (dark-content di light, light-content di dark)
- [ ] Commit: `fix(theme): audit all screens for dark mode compliance`

---

### Task 5.3: Penpot Dark Variant Verification

Ekstrak beberapa board dark dari Penpot untuk cross-check.

- [ ] Ekstrak Penpot boards 01D, 02D, 07D, 12D
- [ ] Bandingkan warna actual di app dengan Penpot dark specs
- [ ] Fix perbedaan jika ada
- [ ] Commit: `fix(theme): verify dark mode matches Penpot 0xD variants`

---

## Verification Checklist

Setelah semua task selesai:

### Light Mode
- [ ] Setiap layar memiliki spacing, warna, typography yang identik dengan Penpot light
- [ ] Semua komponen reusable diletakkan di `components/ui/`
- [ ] Tidak ada warna hardcode — semua dari `COLORS` / `COLORS_DARK` constants
- [ ] Semua tombol pill (radius 26) sesuai design
- [ ] Semua input fields sesuai (white bg, radius=12, label di atas)
- [ ] Navigation bar sesuai design

### Dark Mode
- [ ] Theme toggle berfungsi (light ↔ dark ↔ system)
- [ ] Background screens match Penpot 0xD boards
- [ ] Semua teks readable di dark mode (WCAG AA contrast)
- [ ] Semua icons/images visible di dark mode
- [ ] Status bar style berubah sesuai theme
- [ ] Tidak ada elemen "hilang" atau invisible di dark mode
- [ ] Theme preference persist (survive app restart via AsyncStorage)
