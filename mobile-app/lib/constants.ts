export const COLORS = {
  primary: "#3e4bbe",
  tertiary: "#744cb0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#fbf8fe",
  surface: "#ffffff",
  surfaceVariant: "#f0ecf4",
  text: "#1a1b21",
  textSecondary: "#767680",
  outline: "#c6c5d0",
};

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
  const current = getLevelForXp(totalXp);
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
  const progress = next
    ? ((totalXp - current.xpThreshold) / (next.xpThreshold - current.xpThreshold)) * 100
    : 100;
  return { current, next, progress: Math.min(progress, 100) };
}

export const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber", color: "#3e4bbe" },
  { id: "privasi_data", label: "Privasi Data", color: "#744cb0" },
  { id: "etika_digital", label: "Etika Digital", color: "#1d6f3c" },
];
