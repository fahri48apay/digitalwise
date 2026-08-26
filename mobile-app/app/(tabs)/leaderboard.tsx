import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProfileStore } from "@/stores/profileStore";

const podiumColors = ["#f59e0b", "#94a3b8", "#cd7f32"];
const podiumLabels = ["#1", "#2", "#3"];

export default function LeaderboardScreen() {
  const { entries, loading, refetch } = useLeaderboard();
  const { profile } = useProfileStore();

  useEffect(() => { refetch(); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const myRank = entries.findIndex((e) => e.id === profile?.id) + 1;

  if (loading) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Peringkat</Text>

      {/* Podium */}
      <View style={styles.podium}>
        {[1, 0, 2].map((rank) => {
          const entry = top3[rank];
          if (!entry) return <View key={rank} style={styles.podiumSlot} />;
          const isFirst = rank === 0;
          return (
            <View key={rank} style={[styles.podiumSlot, isFirst && styles.podiumFirst]}>
              <Avatar.Text size={isFirst ? 56 : 44} label={entry.display_name.charAt(0).toUpperCase()} style={{ backgroundColor: podiumColors[rank] }} />
              <Text variant="labelSmall" style={styles.podiumName} numberOfLines={1}>{entry.display_name.split(" ")[0]}</Text>
              <Text variant="labelSmall" style={styles.podiumXp}>{entry.total_xp} XP</Text>
              <View style={[styles.rankBadge, { backgroundColor: podiumColors[rank] }]}>
                <Text style={styles.rankText}>{podiumLabels[rank]}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* My rank */}
      {myRank > 0 && (
        <Card style={styles.myRank}>
          <Card.Content style={styles.myRankContent}>
            <Text variant="labelLarge">Peringkatmu: #{myRank}</Text>
            <Text variant="labelMedium" style={{ color: "#3e4bbe" }}>{profile?.total_xp} XP</Text>
          </Card.Content>
        </Card>
      )}

      {/* List */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const rank = index + 4;
          const isMe = item.id === profile?.id;
          return (
            <Card style={[styles.listCard, isMe && styles.listCardMe]}>
              <Card.Content style={styles.listContent}>
                <Text variant="labelLarge" style={styles.listRank}>{rank}</Text>
                <Avatar.Text size={36} label={item.display_name.charAt(0).toUpperCase()} style={{ backgroundColor: "#3e4bbe20" }} />
                <View style={styles.listInfo}>
                  <Text variant="bodyMedium" style={isMe ? { fontWeight: "bold" } : undefined}>{item.display_name}</Text>
                  <Text variant="labelSmall" style={{ color: "#767680" }}>Lv.{item.current_level}</Text>
                </View>
                <Text variant="labelLarge" style={styles.listXp}>{item.total_xp}</Text>
              </Card.Content>
            </Card>
          );
        }}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { padding: 16, paddingBottom: 0, fontWeight: "bold" },
  podium: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", padding: 16, gap: 12 },
  podiumSlot: { alignItems: "center", flex: 1 },
  podiumFirst: { marginBottom: 8 },
  podiumName: { marginTop: 4, fontWeight: "bold", maxWidth: 80 },
  podiumXp: { color: "#767680", fontSize: 11 },
  rankBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 4 },
  rankText: { color: "#fff", fontWeight: "bold", fontSize: 11 },
  myRank: { marginHorizontal: 16, marginBottom: 12, backgroundColor: "#3e4bbe10" },
  myRankContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  listCard: { marginHorizontal: 16, marginBottom: 8 },
  listCardMe: { backgroundColor: "#3e4bbe10" },
  listContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  listRank: { width: 24, textAlign: "center", color: "#767680" },
  listInfo: { flex: 1 },
  listXp: { fontWeight: "bold", color: "#3e4bbe" },
});
