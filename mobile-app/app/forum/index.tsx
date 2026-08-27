import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useForum } from "@/hooks/useForum";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwCard, DwChip, DwIcon } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS, LAYOUT } from "@/lib/constants";

const categoryLabels: Record<string, string> = {
  keamanan_siber: "Keamanan Siber",
  privasi_data: "Privasi Data",
  etika_digital: "Etika Digital",
  general: "Umum",
};

const categoryColors: Record<string, keyof ReturnType<typeof useAppTheme>["colors"]> = {
  keamanan_siber: "error",
  privasi_data: "primary",
  etika_digital: "tertiary",
  general: "outline",
};

const postTypeIcons: Record<string, string> = {
  question: "help-circle-outline",
  challenge: "flash-outline",
  poll: "chart-bar",
};

export default function ForumScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { getPosts, loading } = useForum();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPosts = async (category?: string) => {
    const data = await getPosts(category || undefined);
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    fetchPosts(cat || undefined);
  };

  const filters = [
    { id: null, label: "Semua" },
    ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainer }]}
          accessibilityLabel="Kembali"
        >
          <DwIcon name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface }]}>
          Forum Diskusi
        </Text>
      </View>

      {/* Category filter chips */}
      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item.id ?? "all"}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const active = selectedCategory === item.id;
          return (
            <Pressable
              onPress={() => handleCategorySelect(item.id)}
              style={[
                styles.filterChip,
                {
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: active ? colors.primary : "transparent",
                  borderWidth: active ? 0 : 1,
                  borderColor: colors.outline,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: SPACING.lg,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  TYPOGRAPHY.labelMd,
                  { color: active ? colors.onPrimary : colors.onSurfaceVariant },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Posts list */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchPosts(selectedCategory || undefined)}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 96 }}
        renderItem={({ item }) => {
          const colorKey = categoryColors[item.category] ?? "outline";
          const catColor = colors[colorKey];
          const typeIcon = postTypeIcons[item.post_type] || "chatbubble-outline";
          return (
            <DwCard
              variant={item.is_pinned ? "outlined" : "filled"}
              style={{
                marginBottom: SPACING.md,
                ...(item.is_pinned ? { borderColor: colors.warning, borderWidth: 1 } : {}),
              }}
            >
              <Pressable onPress={() => router.push(`/forum/${item.id}`)}>
                {/* Meta row */}
                <View style={styles.cardMeta}>
                  <DwIcon name={typeIcon as any} size={16} color={catColor} />
                  <DwChip label={categoryLabels[item.category] || item.category} color={catColor} style={{ borderRadius: 12 }} />
                  {item.is_pinned && (
                    <DwChip label="Pinned" color={colors.warning} style={{ borderRadius: 12 }} />
                  )}
                </View>
                {/* Title */}
                <Text
                  style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, marginTop: SPACING.sm }]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                {/* Preview */}
                <Text
                  style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant, marginTop: SPACING.xs }]}
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
                {/* Footer */}
                <View style={styles.cardFooter}>
                  <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                    {item.profiles?.display_name || "Anonim"}
                  </Text>
                  <View style={styles.stats}>
                    <DwIcon name="heart-outline" size={14} color={colors.onSurfaceVariant} />
                    <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                      {item.likes_count}
                    </Text>
                    <DwIcon name="comment-outline" size={14} color={colors.onSurfaceVariant} />
                    <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                      {item.comment_count}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </DwCard>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <DwIcon name="forum-outline" size={48} color={colors.outline} />
            <Text style={[TYPOGRAPHY.bodyLg, { color: colors.onSurfaceVariant, marginTop: SPACING.lg }]}>
              Belum ada postingan
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/forum/new")}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        accessibilityLabel="Buat postingan baru"
      >
        <DwIcon name="plus" size={24} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    marginRight: 0,
  },
  card: {
    marginBottom: SPACING.md,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flexWrap: "wrap",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  stats: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  empty: { alignItems: "center", paddingTop: 80 },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
