import { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { DwCard, DwIcon } from "@/components/ui";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  totalMaterials: number;
  totalQuizzes: number;
  totalMissions: number;
  totalReports: number;
  totalForumPosts: number;
}

interface StatCard {
  icon: string;
  label: string;
  value: number;
  fgKey: string;
  bgKey: string;
}

const STAT_CATEGORIES: StatCard[] = [
  { icon: "account-group", label: "Total User", value: 0, fgKey: "primary", bgKey: "primaryContainer" },
  { icon: "book-open-variant", label: "Materi", value: 0, fgKey: "success", bgKey: "successContainer" },
  { icon: "frequently-asked-questions", label: "Quiz", value: 0, fgKey: "warning", bgKey: "warningContainer" },
  { icon: "flag", label: "Misi", value: 0, fgKey: "tertiary", bgKey: "tertiaryContainer" },
  { icon: "file-document", label: "Laporan", value: 0, fgKey: "error", bgKey: "errorContainer" },
  { icon: "forum", label: "Forum Posts", value: 0, fgKey: "primary", bgKey: "primaryContainer" },
];

export default function AdminDashboard() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMaterials: 0,
    totalQuizzes: 0,
    totalMissions: 0,
    totalReports: 0,
    totalForumPosts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [users, materials, quizzes, missions, reports, posts] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("learning_materials").select("*", { count: "exact", head: true }),
        supabase.from("quizzes").select("*", { count: "exact", head: true }),
        supabase.from("missions").select("*", { count: "exact", head: true }),
        supabase.from("reports").select("*", { count: "exact", head: true }),
        supabase.from("forum_posts").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        totalUsers: users.count || 0,
        totalMaterials: materials.count || 0,
        totalQuizzes: quizzes.count || 0,
        totalMissions: missions.count || 0,
        totalReports: reports.count || 0,
        totalForumPosts: posts.count || 0,
      });
    };
    fetchStats();
  }, []);

  const values: Record<string, number> = {
    totalUsers: stats.totalUsers,
    totalMaterials: stats.totalMaterials,
    totalQuizzes: stats.totalQuizzes,
    totalMissions: stats.totalMissions,
    totalReports: stats.totalReports,
    totalForumPosts: stats.totalForumPosts,
  };

  const statCards = STAT_CATEGORIES.map((card, i) => ({
    ...card,
    value: Object.values(values)[i],
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, marginBottom: SPACING.lg }]}>
        Dashboard Admin
      </Text>

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        {statCards.map((stat) => {
          const fg = colors[stat.fgKey as keyof typeof colors] as string;
          const bg = colors[stat.bgKey as keyof typeof colors] as string;
          return (
            <DwCard
              key={stat.label}
              variant="filled"
              style={[styles.statCard, isMobile && styles.statCardMobile]}
            >
              <View style={styles.statContent}>
                <View style={[styles.iconBox, { backgroundColor: bg }]}>
                  <DwIcon name={stat.icon as any} size={24} color={fg} />
                </View>
                <View>
                  <Text style={[TYPOGRAPHY.headlineMd, { color: colors.onSurface }]}>
                    {stat.value}
                  </Text>
                  <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                    {stat.label}
                  </Text>
                </View>
              </View>
            </DwCard>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
  gridMobile: { gap: SPACING.sm },
  statCard: { width: "30%", minWidth: 200 },
  statCardMobile: { width: "100%" },
  statContent: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
