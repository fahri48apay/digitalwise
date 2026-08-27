import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwCard, DwIcon } from "@/components/ui";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, LAYOUT } from "@/lib/constants";

type IconName = React.ComponentProps<typeof DwIcon>["name"];

interface NotificationTypeDef {
  icon: IconName;
  colorKey: keyof typeof COLORS;
}

const NOTIFICATION_TYPES: Record<string, NotificationTypeDef> = {
  badge_unlock: { icon: "trophy", colorKey: "warning" },
  level_up: { icon: "star", colorKey: "primary" },
  mission_available: { icon: "shield-check", colorKey: "success" },
  quiz_result: { icon: "checkmark-circle", colorKey: "tertiary" },
  forum_reply: { icon: "forum", colorKey: "primary" },
  system: { icon: "information", colorKey: "outline" },
  streak_reminder: { icon: "fire", colorKey: "error" },
};

const DEFAULT_TYPE: NotificationTypeDef = { icon: "bell-outline", colorKey: "outline" };

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
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

  const getTypeDef = (type: string): NotificationTypeDef =>
    NOTIFICATION_TYPES[type] || DEFAULT_TYPE;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <DwIcon name="arrow-left" size={LAYOUT.touchTarget} color={colors.onSurface} />
        </Pressable>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, flex: 1 }]}>
          Notifikasi
        </Text>
      </View>

      {/* Sub-header: unread count + mark all */}
      <View style={styles.subHeader}>
        {unreadCount > 0 ? (
          <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary }]}>
            {unreadCount} belum dibaca
          </Text>
        ) : (
          <View />
        )}
        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllRead}>
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary }]}>
              Tandai semua
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotifications} />}
        renderItem={({ item }) => {
          const typeDef = getTypeDef(item.type);
          const iconColor = colors[typeDef.colorKey];
          const isUnread = !item.is_read;

          return (
            <DwCard
              variant="filled"
              style={[
                styles.card,
                { backgroundColor: isUnread ? colors.primaryContainer : colors.surfaceContainerLow },
              ]}
            >
              <Pressable
                style={styles.cardRow}
                onPress={() => handlePress(item)}
                accessibilityLabel={item.title}
              >
                {/* Icon box */}
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: iconColor + "20" },
                  ]}
                >
                  <DwIcon name={typeDef.icon} size={20} color={iconColor} />
                </View>

                {/* Text content */}
                <View style={styles.textContent}>
                  <Text
                    style={[
                      TYPOGRAPHY.labelLg,
                      { color: colors.onSurface },
                      isUnread && { fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}
                    numberOfLines={2}
                  >
                    {item.body}
                  </Text>
                  <Text style={[TYPOGRAPHY.labelSm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                    {formatTime(item.created_at)}
                  </Text>
                </View>

                {/* Unread dot */}
                {isUnread && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                )}
              </Pressable>
            </DwCard>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <DwIcon name="bell-off-outline" size={48} color={colors.onSurfaceVariant + "80"} />
            <Text style={[TYPOGRAPHY.bodyLg, { color: colors.onSurfaceVariant, marginTop: 12 }]}>
              Belum ada notifikasi
            </Text>
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
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minHeight: LAYOUT.touchTarget,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: { flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  empty: { alignItems: "center", paddingTop: 64 },
});
