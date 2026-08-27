import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { useMaterials } from "@/hooks/useMaterials";
import { DwCard, DwChip, DwIcon } from "@/components/ui";
import {
  CATEGORIES,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  LAYOUT,
  COLORS,
  COLORS_DARK,
} from "@/lib/constants";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content_type: string;
  thumbnail_url: string | null;
  xp_reward: number;
  duration_min: number;
  sort_order: number;
}

const ALL_CATEGORIES = [{ id: null, label: "Semua" }, ...CATEGORIES];

const CONTENT_TYPE_ICONS: Record<string, string> = {
  video: "play-circle",
  article: "file-document-outline",
  infographic: "image-outline",
  interactive: "gesture-tap",
};

const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  keamanan_siber: COLORS.primary,
  privasi_data: COLORS.tertiary,
  etika_digital: COLORS.success,
};

const CATEGORY_COLORS_DARK: Record<string, string> = {
  keamanan_siber: COLORS_DARK.primary,
  privasi_data: COLORS_DARK.tertiary,
  etika_digital: COLORS_DARK.success,
};

export default function MaterialsScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { getMaterials, loading } = useMaterials();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchMaterials = async (category?: string) => {
    const data = await getMaterials(category || undefined);
    setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    fetchMaterials(catId || undefined);
  };

  const getCatColor = (catId: string) =>
    isDark
      ? CATEGORY_COLORS_DARK[catId] || colors.primary
      : CATEGORY_COLORS_LIGHT[catId] || colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchMaterials(selectedCategory || undefined)}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Top bar */}
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backBtn}
                accessibilityLabel="Kembali"
              >
                <DwIcon name="arrow-left" size={24} color={colors.onSurface} />
              </Pressable>
              <Text
                style={[
                  TYPOGRAPHY.titleLg,
                  { color: colors.onSurface, fontWeight: "700" },
                ]}
              >
                Materi Belajar
              </Text>
            </View>

            {/* Subtitle */}
            <Text
              style={[
                TYPOGRAPHY.bodyMd,
                { color: colors.onSurfaceVariant, marginBottom: SPACING.lg },
              ]}
            >
              Pelajari literasi digital sambil earn XP
            </Text>

            {/* Category filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {ALL_CATEGORIES.map((item) => {
                const isActive = selectedCategory === item.id;
                return (
                  <Pressable
                    key={item.id ?? "all"}
                    style={[
                      styles.filterChip,
                      {
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: isActive
                          ? colors.secondaryContainer
                          : "transparent",
                        borderWidth: isActive ? 0 : 1,
                        borderColor: colors.outlineVariant,
                      },
                    ]}
                    onPress={() => handleCategorySelect(item.id)}
                  >
                    <Text
                      style={[
                        TYPOGRAPHY.labelMd,
                        {
                          color: isActive
                            ? colors.onSecondaryContainer
                            : colors.onSurfaceVariant,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const catColor = getCatColor(item.category);
          const cat = CATEGORIES.find((c) => c.id === item.category);
          return (
            <Pressable
              onPress={() => router.push(`/material/${item.id}`)}
              style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
            >
              <DwCard style={styles.card}>
                {/* Icon box + category chip */}
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: `${catColor}20` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        (CONTENT_TYPE_ICONS[item.content_type] ||
                          "book-open-variant") as any
                      }
                      size={22}
                      color={catColor}
                    />
                  </View>
                  <DwChip label={cat?.label || item.category} color={catColor} />
                </View>

                {/* Title */}
                <Text
                  style={[
                    TYPOGRAPHY.titleMd,
                    { color: colors.onSurface, marginTop: SPACING.md },
                  ]}
                >
                  {item.title}
                </Text>

                {/* Description */}
                {item.description && (
                  <Text
                    style={[
                      TYPOGRAPHY.bodyMd,
                      { color: colors.onSurfaceVariant, marginTop: SPACING.xs },
                    ]}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}

                {/* Footer: XP + duration */}
                <View style={styles.cardFooter}>
                  <Text style={[TYPOGRAPHY.labelSm, { color: colors.primary }]}>
                    {item.xp_reward} XP
                  </Text>
                  <Text
                    style={[
                      TYPOGRAPHY.labelSm,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {item.duration_min} menit
                  </Text>
                </View>
              </DwCard>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <DwIcon
                name="book-open-variant"
                size={48}
                color={colors.onSurfaceVariant}
              />
              <Text
                style={[
                  TYPOGRAPHY.bodyLg,
                  { color: colors.onSurfaceVariant, marginTop: SPACING.md },
                ]}
              >
                Belum ada materi
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { paddingHorizontal: LAYOUT.screenPadding },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: { paddingBottom: 100 },
  card: {
    marginHorizontal: LAYOUT.screenPadding,
    marginBottom: SPACING.md,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  empty: { alignItems: "center", paddingTop: 64 },
});
