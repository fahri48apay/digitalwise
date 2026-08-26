// Verifikasi kontras WCAG 2.2 AA untuk pasangan token DigitalWise
// Text: >= 4.5:1 · UI/large text: >= 3:1

function lum(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const schemes = {
  light: {
    primary: '#3e4bbe', onPrimary: '#ffffff', primaryContainer: '#dfe0ff', onPrimaryContainer: '#000f5c',
    secondary: '#595d72', onSecondary: '#ffffff', secondaryContainer: '#dde1f9', onSecondaryContainer: '#161b2c',
    tertiary: '#744cb0', onTertiary: '#ffffff', tertiaryContainer: '#eddbff', onTertiaryContainer: '#2b0a57',
    success: '#1d6f3c', onSuccess: '#ffffff', successContainer: '#a9f2b6', onSuccessContainer: '#00210c',
    warning: '#8a5300', onWarning: '#ffffff', warningContainer: '#ffddb0', onWarningContainer: '#2b1700',
    error: '#b3261e', onError: '#ffffff', errorContainer: '#f9dedc', onErrorContainer: '#410e0b',
    surface: '#fbf8fe', surfaceContainerLow: '#f5f2fa', surfaceContainer: '#efedf5',
    surfaceContainerHigh: '#e9e7ef', surfaceContainerHighest: '#e4e1ea',
    onSurface: '#1a1b21', onSurfaceVariant: '#45464f', outline: '#767680', outlineVariant: '#c6c5d0',
    inverseSurface: '#2f3036', inverseOnSurface: '#f1f0f7',
  },
  dark: {
    primary: '#bdc3ff', onPrimary: '#1b2593', primaryContainer: '#3641a9', onPrimaryContainer: '#dfe0ff',
    secondary: '#c0c4dd', onSecondary: '#2a3042', secondaryContainer: '#414659', onSecondaryContainer: '#dde1f9',
    tertiary: '#d6baff', onTertiary: '#431c74', tertiaryContainer: '#5b378d', onTertiaryContainer: '#eddbff',
    success: '#8ed99b', onSuccess: '#00391a', successContainer: '#005327', onSuccessContainer: '#a9f2b6',
    warning: '#ffb95c', onWarning: '#4a2800', warningContainer: '#6b3d00', onWarningContainer: '#ffddb0',
    error: '#f2b8b5', onError: '#601410', errorContainer: '#8c1d18', onErrorContainer: '#f9dedc',
    surface: '#131318', surfaceContainerLow: '#1a1b20', surfaceContainer: '#1e1f24',
    surfaceContainerHigh: '#292a2f', surfaceContainerHighest: '#34353a',
    onSurface: '#e4e1ec', onSurfaceVariant: '#c6c5d0', outline: '#90909a', outlineVariant: '#45464f',
    inverseSurface: '#e4e1ec', inverseOnSurface: '#2f3036',
  },
};

// [deskripsi, fg, bg, minimum]
function pairs(s) {
  return [
    ['on-primary di primary (tombol filled)', s.onPrimary, s.primary, 4.5],
    ['on-primary-container di primary-container', s.onPrimaryContainer, s.primaryContainer, 4.5],
    ['on-secondary di secondary', s.onSecondary, s.secondary, 4.5],
    ['on-secondary-container di secondary-container', s.onSecondaryContainer, s.secondaryContainer, 4.5],
    ['on-tertiary di tertiary (badge)', s.onTertiary, s.tertiary, 4.5],
    ['on-tertiary-container di tertiary-container', s.onTertiaryContainer, s.tertiaryContainer, 4.5],
    ['on-success di success (tombol Aman)', s.onSuccess, s.success, 4.5],
    ['on-success-container di success-container', s.onSuccessContainer, s.successContainer, 4.5],
    ['on-warning di warning', s.onWarning, s.warning, 4.5],
    ['on-warning-container di warning-container', s.onWarningContainer, s.warningContainer, 4.5],
    ['on-error di error (tombol Tidak Aman)', s.onError, s.error, 4.5],
    ['on-error-container di error-container', s.onErrorContainer, s.errorContainer, 4.5],
    ['primary di surface (teks aksen/link)', s.primary, s.surface, 4.5],
    ['on-surface di surface', s.onSurface, s.surface, 4.5],
    ['on-surface di surface-container', s.onSurface, s.surfaceContainer, 4.5],
    ['on-surface di surface-container-high', s.onSurface, s.surfaceContainerHigh, 4.5],
    ['on-surface-variant di surface (teks sekunder)', s.onSurfaceVariant, s.surface, 4.5],
    ['on-surface-variant di surface-container', s.onSurfaceVariant, s.surfaceContainer, 4.5],
    ['outline di surface (elemen UI, min 3:1)', s.outline, s.surface, 3],
    ['primary di surface-container-low', s.primary, s.surfaceContainerLow, 4.5],
    ['error di surface (teks error)', s.error, s.surface, 4.5],
    ['success di surface', s.success, s.surface, 4.5],
    ['inverse-on-surface di inverse-surface (snackbar)', s.inverseOnSurface, s.inverseSurface, 4.5],
    ['on-surface di surface-container-highest (nav)', s.onSurface, s.surfaceContainerHighest, 4.5],
  ];
}

let fail = 0;
for (const [name, s] of Object.entries(schemes)) {
  console.log(`\n=== ${name.toUpperCase()} ===`);
  for (const [desc, fg, bg, min] of pairs(s)) {
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1 (min ${min})  ${desc}  [${fg} on ${bg}]`);
  }
}
console.log(fail === 0 ? '\nSEMUA PASANGAN LOLOS WCAG AA' : `\n${fail} pasangan GAGAL — perlu diperbaiki`);
process.exit(fail === 0 ? 0 : 1);
