import "../lib/constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { AuthProvider } from "@/providers/AuthProvider";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3e4bbe",
    secondary: "#744cb0",
    background: "#fbf8fe",
    surface: "#ffffff",
    surfaceVariant: "#f0ecf4",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
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
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </PaperProvider>
  );
}
