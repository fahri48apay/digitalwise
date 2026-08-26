import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useCallback, useState, useEffect } from "react";
import { Text, Card, ProgressBar, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";
import { getXpProgress, CATEGORIES } from "@/lib/constants";
import { LevelUpModal, StreakBadge } from "@/components/gamification";

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading, refetch } = useProfile();
  const { checkStreak, lastResult, clearLastResult } = useXP();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (lastResult?.leveled_up) {
      setShowLevelUp(true);
    }
  }, [lastResult]);

  const onRefresh = useCallback(async () => {
    await refetch();
    await checkStreak();
  }, []);

  if (loading || !profile) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  const xp = getXpProgress(profile.total_xp);

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text variant="labelMedium" style={{ color: "#767680" }}>Halo,</Text>
            <Text variant="titleLarge">{profile.display_name.split(" ")[0]}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <StreakBadge count={profile.streak_count} size="md" />
            <Ionicons name="notifications-outline" size={24} color="#3e4bbe" onPress={() => router.push("/notifications")} />
          </View>
        </View>

        {/* XP Card */}
        <Card style={styles.xpCard}>
          <Card.Content>
            <View style={styles.xpHeader}>
              <View>
                <Text variant="labelMedium" style={styles.xpLabel}>Total XP</Text>
                <Text variant="headlineLarge" style={styles.xpValue}>{profile.total_xp}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv.{xp.current.level}</Text>
                <Text variant="labelSmall" style={styles.levelTitle}>{xp.current.title}</Text>
              </View>
            </View>
            <ProgressBar progress={xp.progress / 100} color="#10b981" style={styles.progressBar} />
            <Text variant="labelSmall" style={styles.xpInfo}>
              {xp.next ? `${xp.next.xpThreshold - profile.total_xp} XP lagi ke Level ${xp.next.level}` : "Max Level!"}
            </Text>
          </Card.Content>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium">{profile.streak_count}</Text>
              <Text variant="labelSmall">Streak</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium">{profile.weekly_xp}</Text>
              <Text variant="labelSmall">XP Minggu Ini</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Categories */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleSmall" style={{ marginBottom: 8 }}>Kategori Belajar</Text>
            {CATEGORIES.map((cat) => (
              <Chip key={cat.id} style={[styles.chip, { backgroundColor: cat.color + "20" }]} textStyle={{ color: cat.color }}>
                {cat.label}
              </Chip>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card} onPress={() => router.push("/material")}>
          <Card.Content style={styles.actionRow}>
            <Ionicons name="book" size={24} color="#3e4bbe" />
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall">Materi Belajar</Text>
              <Text variant="bodySmall" style={{ color: "#767680" }}>Pelajari literasi digital sambil earn XP</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#767680" />
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => router.push("/forum")}>
          <Card.Content style={styles.actionRow}>
            <Ionicons name="chatbubbles" size={24} color="#8b5cf6" />
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall">Forum Diskusi</Text>
              <Text variant="bodySmall" style={{ color: "#767680" }}>Tanya jawab & berbagi pengalaman</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#767680" />
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => router.push("/report/new")}>
          <Card.Content style={styles.actionRow}>
            <Ionicons name="shield-checkmark" size={24} color="#ef4444" />
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall">Lapor Insiden</Text>
              <Text variant="bodySmall" style={{ color: "#767680" }}>Temukan masalah keamanan? Laporkan di sini</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#767680" />
          </Card.Content>
        </Card>
      </ScrollView>

      <LevelUpModal
        visible={showLevelUp}
        newLevel={lastResult?.new_level ?? profile.current_level}
        onDismiss={() => {
          setShowLevelUp(false);
          clearLastResult();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingBottom: 8 },
  xpCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: "#3e4bbe", elevation: 4 },
  xpHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  xpLabel: { color: "rgba(255,255,255,0.7)" },
  xpValue: { color: "#fff", fontWeight: "bold", fontSize: 32 },
  levelBadge: { alignItems: "flex-end" },
  levelText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  levelTitle: { color: "rgba(255,255,255,0.7)" },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)" },
  xpInfo: { color: "rgba(255,255,255,0.6)", marginTop: 4, textAlign: "right" },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  statCard: { flex: 1 },
  statContent: { alignItems: "center", paddingVertical: 8 },
  card: { marginHorizontal: 16, marginBottom: 12 },
  chip: { marginBottom: 6, alignSelf: "flex-start" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },
});
