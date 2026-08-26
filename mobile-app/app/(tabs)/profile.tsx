import { View, StyleSheet } from "react-native";
import { Text, Avatar, Card, Button, Divider, ProgressBar } from "react-native-paper";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { getXpProgress } from "@/lib/constants";
import { StreakBadge } from "@/components/gamification";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  }

  if (!profile) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  const xp = getXpProgress(profile.total_xp);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Text size={72} label={profile.display_name.charAt(0).toUpperCase()} style={{ backgroundColor: "#3e4bbe" }} />
        <Text variant="headlineSmall" style={{ marginTop: 8, fontWeight: "bold" }}>{profile.display_name}</Text>
        <Text variant="bodyMedium" style={{ color: "#767680" }}>@{profile.username}</Text>
        <View style={{ marginTop: 8 }}>
          <StreakBadge count={profile.streak_count} size="lg" />
        </View>
      </View>

      {/* Level Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.levelHeader}>
            <View>
              <Text variant="labelMedium" style={{ color: "#767680" }}>Level</Text>
              <Text variant="headlineMedium" style={{ fontWeight: "bold", color: "#3e4bbe" }}>{xp.current.level}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="titleMedium" style={{ fontWeight: "bold" }}>{xp.current.title}</Text>
              {xp.next && (
                <Text variant="labelSmall" style={{ color: "#767680" }}>
                  {xp.next.xpThreshold - profile.total_xp} XP lagi ke Lv.{xp.next.level}
                </Text>
              )}
            </View>
          </View>
          <ProgressBar progress={xp.progress / 100} color="#3e4bbe" style={styles.progressBar} />
        </Card.Content>
      </Card>

      {/* Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={{ marginBottom: 12 }}>Statistik</Text>
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Total XP</Text>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>{profile.total_xp}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium">XP Minggu Ini</Text>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>{profile.weekly_xp}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Streak</Text>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>{profile.streak_count} hari</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="bodyMedium">Role</Text>
            <Text variant="titleMedium" style={{ fontWeight: "bold", textTransform: "capitalize" }}>{profile.role}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Admin Button (hanya untuk admin) */}
      {profile.role === "admin" && (
        <Button
          mode="contained"
          icon="settings"
          onPress={() => router.push("/admin")}
          style={styles.adminBtn}
        >
          Admin Panel
        </Button>
      )}

      {/* Logout */}
      <Button mode="outlined" onPress={handleLogout} style={styles.logoutBtn}>
        Keluar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", paddingVertical: 24 },
  card: { marginHorizontal: 16, marginBottom: 12 },
  levelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressBar: { height: 8, borderRadius: 4 },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  divider: { marginVertical: 8 },
  adminBtn: { marginTop: 16, marginHorizontal: 16, backgroundColor: "#8b5cf6" },
  logoutBtn: { marginTop: 8, marginHorizontal: 16 },
});
