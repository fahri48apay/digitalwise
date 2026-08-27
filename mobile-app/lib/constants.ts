/**
 * DigitalWise — Design Tokens
 * Source of truth: ~/digitalwise/tokens.css
 * Material Design 3 semantic roles — Light + Dark
 */
import { TextStyle } from "react-native";

// ─── LIGHT COLORS ─────────────────────────────────────────────
export const COLORS = {
  // Primary — indigo: aksi utama, identitas keamanan
  primary: "#3e4bbe",
  onPrimary: "#ffffff",
  primaryContainer: "#dfe0ff",
  onPrimaryContainer: "#000f5c",

  // Secondary — indigo keabuan: aksi sekunder, chip
  secondary: "#595d72",
  onSecondary: "#ffffff",
  secondaryContainer: "#dde1f9",
  onSecondaryContainer: "#161b2c",

  // Tertiary — violet: aksen gamifikasi
  tertiary: "#744cb0",
  onTertiary: "#ffffff",
  tertiaryContainer: "#eddbff",
  onTertiaryContainer: "#2b0a57",

  // Success — status "aman", misi selesai
  success: "#1d6f3c",
  onSuccess: "#ffffff",
  successContainer: "#a9f2b6",
  onSuccessContainer: "#00210c",

  // Warning — peringatan dini
  warning: "#8a5300",
  onWarning: "#ffffff",
  warningContainer: "#ffddb0",
  onWarningContainer: "#2b1700",

  // Error — konten berbahaya, phishing, laporan
  error: "#b3261e",
  onError: "#ffffff",
  errorContainer: "#f9dedc",
  onErrorContainer: "#410e0b",

  // Surfaces — tangga tonal
  background: "#fbf8fe",
  surface: "#ffffff",
  surfaceDim: "#dbd9e0",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f2fa",
  surfaceContainer: "#efedf5",
  surfaceContainerHigh: "#e9e7ef",
  surfaceContainerHighest: "#e4e1ea",

  // Teks & garis
  onSurface: "#1a1b21",
  onSurfaceVariant: "#45464f",
  outline: "#767680",
  outlineVariant: "#c6c5d0",

  // Inverse
  inverseSurface: "#2f3036",
  inverseOnSurface: "#f1f0f7",
  inversePrimary: "#bdc3ff",

  // Scrim
  scrim: "rgba(0, 0, 0, 0.45)",
};

// ─── DARK COLORS (Penpot 0xD variants) ───────────────────────
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

// ─── THEME HELPER ─────────────────────────────────────────────
export type ThemeMode = "light" | "dark";

export function getColors(mode: ThemeMode) {
  return mode === "dark" ? COLORS_DARK : COLORS;
}

// ─── TYPOGRAPHY (M3 type scale) ───────────────────────────────
export const FONT_FAMILY = "Plus Jakarta Sans";

export const TYPOGRAPHY: Record<string, TextStyle> = {
  displayLg: { fontFamily: FONT_FAMILY, fontSize: 36, lineHeight: 44, fontWeight: "700" },
  headlineMd: { fontFamily: FONT_FAMILY, fontSize: 24, lineHeight: 32, fontWeight: "700" },
  titleLg: { fontFamily: FONT_FAMILY, fontSize: 20, lineHeight: 28, fontWeight: "600" },
  titleMd: { fontFamily: FONT_FAMILY, fontSize: 16, lineHeight: 24, fontWeight: "600" },
  bodyLg: { fontFamily: FONT_FAMILY, fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyMd: { fontFamily: FONT_FAMILY, fontSize: 14, lineHeight: 20, fontWeight: "400" },
  labelLg: { fontFamily: FONT_FAMILY, fontSize: 14, lineHeight: 20, fontWeight: "600" },
  labelMd: { fontFamily: FONT_FAMILY, fontSize: 12, lineHeight: 16, fontWeight: "600" },
  labelSm: { fontFamily: FONT_FAMILY, fontSize: 11, lineHeight: 16, fontWeight: "600" },
};

// ─── SPACING (skala 4pt) ─────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
};

// ─── RADIUS ───────────────────────────────────────────────────
export const RADIUS = {
  xs: 8,    // chip kecil
  sm: 12,   // input, kartu kecil
  md: 16,   // kartu
  lg: 20,   // kartu besar / sheet
  xl: 28,   // hero card
  full: 999, // tombol pill, nav indicator
};

// ─── ELEVATION (M3, shadow dua lapis) ─────────────────────────
export const ELEVATION = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  low: {
    shadowColor: "#1a1b21",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.30,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#1a1b21",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 4,
  },
  high: {
    shadowColor: "#1a1b21",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 8,
  },
};

// ─── LAYOUT ───────────────────────────────────────────────────
export const LAYOUT = {
  touchTarget: 48,
  navHeight: 72,
  statusBarHeight: 34,
  screenPadding: 24,
};

// ─── GAME DATA ────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, title: "Pemula Digital", xpThreshold: 0 },
  { level: 2, title: "Pencari Tahu", xpThreshold: 200 },
  { level: 3, title: "Pemberani Digital", xpThreshold: 400 },
  { level: 4, title: "Penjaga Aman", xpThreshold: 600 },
  { level: 5, title: "Ahli Siber", xpThreshold: 900 },
  { level: 6, title: "Legenda Digital", xpThreshold: 1200 },
];

export function getLevelForXp(totalXp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].xpThreshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getXpProgress(totalXp: number) {
  const safeXp = Number.isFinite(Number(totalXp)) ? Number(totalXp) : 0;
  const current = getLevelForXp(safeXp);
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
  const progress = next
    ? ((safeXp - current.xpThreshold) / (next.xpThreshold - current.xpThreshold)) * 100
    : 100;
  return { current, next, progress: Math.min(Math.max(progress, 0), 100) };
}

export const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber", color: COLORS.primary },
  { id: "privasi_data", label: "Privasi Data", color: COLORS.tertiary },
  { id: "etika_digital", label: "Etika Digital", color: COLORS.success },
];
