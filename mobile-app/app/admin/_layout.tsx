import { useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions, Pressable, ActivityIndicator } from "react-native";
import { useRouter, Slot } from "expo-router";
import { useProfile } from "@/hooks/useProfile";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwButton, DwIcon } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";

const NAV_ITEMS = [
  { icon: "home" as const, label: "Dashboard", path: "/admin" },
  { icon: "book-open-variant" as const, label: "Materi", path: "/admin/materials" },
  { icon: "help-circle" as const, label: "Quiz", path: "/admin/quizzes" },
  { icon: "flag" as const, label: "Misi", path: "/admin/missions" },
];

export default function AdminLayout() {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();
  const isMobile = width < 768;

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [profile, loading]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <DwButton label="Akses ditolak" variant="text" onPress={() => router.replace("/(tabs)")} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sidebar (web) */}
      {!isMobile && (
        <View style={[styles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.outlineVariant }]}>
          <View style={[styles.sidebarHeader, { borderBottomColor: colors.outlineVariant }]}>
            <DwIcon name="shield-crown" size={24} color={colors.primary} />
            <Text style={[TYPOGRAPHY.titleMd, { color: colors.primary, marginLeft: SPACING.sm }]}>
              Admin Panel
            </Text>
          </View>

          <View style={styles.sidebarNav}>
            {NAV_ITEMS.map((item) => (
              <DwButton
                key={item.path}
                label={item.label}
                variant="text"
                fullWidth={false}
                icon={<DwIcon name={item.icon} size={20} color={colors.onSurfaceVariant} />}
                onPress={() => router.push(item.path as any)}
                style={styles.sidebarItem}
              />
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <DwButton
            label="Kembali ke App"
            variant="text"
            fullWidth={false}
            icon={<DwIcon name="arrow-left" size={20} color={colors.onSurfaceVariant} />}
            onPress={() => router.replace("/(tabs)")}
            style={styles.sidebarItem}
          />
        </View>
      )}

      {/* Main content */}
      <View style={styles.main}>
        {/* Top bar (mobile) */}
        <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
          <DwButton
            label="Kembali"
            variant="text"
            fullWidth={false}
            icon={<DwIcon name="arrow-left" size={18} color={colors.primary} />}
            onPress={() => router.replace("/(tabs)")}
            style={styles.topBarBackBtn}
          />

          <Text style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, fontWeight: "bold" }]}>
            Admin Panel
          </Text>

          <View style={styles.topBarActions}>
            {NAV_ITEMS.map((item) => (
              <Pressable
                key={item.path}
                style={({ pressed }) => [styles.topBarNavBtn, { backgroundColor: colors.secondaryContainer }, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(item.path as any)}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <DwIcon name={item.icon} size={18} color={colors.onSecondaryContainer} />
              </Pressable>
            ))}
          </View>
        </View>

        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sidebar: { width: 220, borderRightWidth: 1, padding: SPACING.lg },
  sidebarHeader: { flexDirection: "row", alignItems: "center", paddingBottom: SPACING.lg, marginBottom: SPACING.sm, borderBottomWidth: 1 },
  sidebarNav: { gap: SPACING.xs },
  sidebarItem: { height: 44, justifyContent: "flex-start" },

  main: { flex: 1 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: SPACING.md, borderBottomWidth: 1 },
  topBarBackBtn: { height: 40 },
  topBarActions: { flexDirection: "row", gap: SPACING.xs },
  topBarNavBtn: { width: 40, height: 40, borderRadius: RADIUS.xs, alignItems: "center", justifyContent: "center" },
});
