import "../lib/constants";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider, useAppTheme } from "@/providers/ThemeProvider";
import { COLORS, COLORS_DARK } from "@/lib/constants";
import { isOnboardingDone } from "@/lib/onboarding";

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
    elevation: {
      level0: "transparent",
      level1: COLORS.surfaceContainerLow,
      level2: COLORS.surfaceContainer,
      level3: COLORS.surfaceContainerHigh,
      level4: COLORS.surfaceContainerHighest,
      level5: COLORS.surfaceContainerHighest,
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS_DARK.primary,
    onPrimary: COLORS_DARK.onPrimary,
    primaryContainer: COLORS_DARK.primaryContainer,
    onPrimaryContainer: COLORS_DARK.onPrimaryContainer,
    secondary: COLORS_DARK.secondary,
    onSecondary: COLORS_DARK.onSecondary,
    secondaryContainer: COLORS_DARK.secondaryContainer,
    onSecondaryContainer: COLORS_DARK.onSecondaryContainer,
    tertiary: COLORS_DARK.tertiary,
    onTertiary: COLORS_DARK.onTertiary,
    tertiaryContainer: COLORS_DARK.tertiaryContainer,
    onTertiaryContainer: COLORS_DARK.onTertiaryContainer,
    error: COLORS_DARK.error,
    onError: COLORS_DARK.onError,
    errorContainer: COLORS_DARK.errorContainer,
    onErrorContainer: COLORS_DARK.onErrorContainer,
    background: COLORS_DARK.background,
    onBackground: COLORS_DARK.onSurface,
    surface: COLORS_DARK.surface,
    onSurface: COLORS_DARK.onSurface,
    surfaceVariant: COLORS_DARK.surfaceContainer,
    onSurfaceVariant: COLORS_DARK.onSurfaceVariant,
    outline: COLORS_DARK.outline,
    outlineVariant: COLORS_DARK.outlineVariant,
    surfaceDisabled: COLORS_DARK.surfaceContainerLow,
    onSurfaceDisabled: COLORS_DARK.onSurfaceVariant,
    backdrop: COLORS_DARK.scrim,
    elevation: {
      level0: "transparent",
      level1: COLORS_DARK.surfaceContainerLow,
      level2: COLORS_DARK.surfaceContainer,
      level3: COLORS_DARK.surfaceContainerHigh,
      level4: COLORS_DARK.surfaceContainerHighest,
      level5: COLORS_DARK.surfaceContainerHighest,
    },
  },
};

function AppInner() {
  const { isDark } = useAppTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    isOnboardingDone().then((done) => {
      if (!done) {
        router.replace("/onboarding");
      }
      setOnboardingChecked(true);
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="quiz/[id]" />
        <Stack.Screen name="mission/[id]" />
        <Stack.Screen name="material" options={{ headerShown: true, title: "Materi" }} />
        <Stack.Screen name="material/[id]" options={{ headerShown: true, title: "Materi" }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: "Notifikasi" }} />
        <Stack.Screen name="forum" options={{ headerShown: true, title: "Forum" }} />
        <Stack.Screen name="forum/[id]" options={{ headerShown: true, title: "Forum" }} />
        <Stack.Screen name="forum/new" options={{ headerShown: true, title: "Buat Postingan" }} />
        <Stack.Screen name="report/new" options={{ headerShown: true, title: "Lapor" }} />
        <Stack.Screen name="levelup" options={{ headerShown: false, animation: "fade" }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
