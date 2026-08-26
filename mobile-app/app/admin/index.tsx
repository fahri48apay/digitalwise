import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalUsers: number;
  totalMaterials: number;
  totalQuizzes: number;
  totalMissions: number;
  totalReports: number;
  totalForumPosts: number;
}

export default function AdminDashboard() {
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

  const statCards = [
    { icon: "people", label: "Total User", value: stats.totalUsers, color: "#3e4bbe" },
    { icon: "book", label: "Materi", value: stats.totalMaterials, color: "#22c55e" },
    { icon: "help-circle", label: "Quiz", value: stats.totalQuizzes, color: "#f59e0b" },
    { icon: "flag", label: "Misi", value: stats.totalMissions, color: "#8b5cf6" },
    { icon: "document-text", label: "Laporan", value: stats.totalReports, color: "#ef4444" },
    { icon: "chatbubbles", label: "Forum Posts", value: stats.totalForumPosts, color: "#3b82f6" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Dashboard Admin</Text>

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        {statCards.map((stat) => (
          <Card key={stat.label} style={[styles.statCard, isMobile && styles.statCardMobile]}>
            <Card.Content style={styles.statContent}>
              <View style={[styles.iconBox, { backgroundColor: stat.color + "20" }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <View>
                <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>{stat.value}</Text>
                <Text variant="labelMedium" style={{ color: "#767680" }}>{stat.label}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe", padding: 16 },
  title: { fontWeight: "bold", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridMobile: { gap: 8 },
  statCard: { width: "30%", minWidth: 200 },
  statCardMobile: { width: "100%" },
  statContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
});
