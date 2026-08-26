import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

const typeIcons: Record<string, string> = {
  badge_unlock: "trophy",
  level_up: "star",
  mission_available: "flag",
  quiz_result: "checkmark-circle",
  forum_reply: "chatbubble",
  system: "information-circle",
  streak_reminder: "flame",
};

const typeColors: Record<string, string> = {
  badge_unlock: "#f59e0b",
  level_up: "#3e4bbe",
  mission_available: "#22c55e",
  quiz_result: "#3b82f6",
  forum_reply: "#8b5cf6",
  system: "#767680",
  streak_reminder: "#ef4444",
};

export default function NotificationsScreen() {
  const { profile } = useProfile();
  const { getNotifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    if (!profile) return;
    const data = await getNotifications(profile.id);
    setNotifications(data);
  };

  useEffect(() => { fetchNotifications(); }, [profile?.id]);

  const handleMarkAllRead = async () => {
    if (!profile) return;
    await markAllAsRead(profile.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handlePress = async (item: any) => {
    if (!item.is_read) {
      await markAsRead(item.id);
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Notifikasi</Text>
          {unreadCount > 0 && (
            <Text variant="bodySmall" style={{ color: "#3e4bbe" }}>{unreadCount} belum dibaca</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Button compact onPress={handleMarkAllRead}>Tandai semua</Button>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotifications} />}
        renderItem={({ item }) => {
          const icon = typeIcons[item.type] || "notifications";
          const color = typeColors[item.type] || "#767680";
          return (
            <Card
              style={[styles.card, !item.is_read && styles.cardUnread]}
              onPress={() => handlePress(item)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={styles.info}>
                  <Text variant="titleSmall" style={!item.is_read ? { fontWeight: "bold" } : undefined}>
                    {item.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: "#767680" }} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text variant="labelSmall" style={{ color: "#767680", marginTop: 4 }}>
                    {formatTime(item.created_at)}
                  </Text>
                </View>
                {!item.is_read && <View style={styles.unreadDot} />}
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color="#76768080" />
            <Text variant="bodyLarge" style={{ color: "#767680", marginTop: 12 }}>Belum ada notifikasi</Text>
          </View>
        }
      />
    </View>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return `${diffDay} hari lalu`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, paddingBottom: 8 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  cardUnread: { backgroundColor: "#3e4bbe08" },
  cardContent: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  info: { flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3e4bbe", marginTop: 4 },
  empty: { alignItems: "center", paddingTop: 64 },
});
