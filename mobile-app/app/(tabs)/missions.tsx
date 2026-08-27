import { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { useMissions } from "@/hooks/useMissions";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import {
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  ELEVATION,
  LAYOUT,
} from "@/lib/constants";

type FilterKey = "all" | "running" | "done";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "running", label: "Sedang berjalan" },
  { key: "done", label: "Selesai" },
];

const CATEGORIES = [
  {
    id: "keamanan_siber",
    label: "Keamanan Siber",
    icon: "shield-lock" as const,
    colorKey: "primary" as const,
    containerKey: "primaryContainer" as const,
  },
  {
    id: "privasi_data",
    label: "Privasi Data",
    icon: "lock-outline" as const,
    colorKey: "tertiary" as const,
    containerKey: "tertiaryContainer" as const,
  },
  {
    id: "etika_digital",
    label: "Etika Digital",
    icon: "hand-heart" as const,
    colorKey: "success" as const,
    containerKey: "warningContainer" as const,
  },
] as const;

const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  keamanan_siber: "#3e4bbe",
  privasi_data: "#744cb0",
  etika_digital: "#1d6f3c",
};

const CATEGORY_COLORS_DARK: Record<string, string> = {
  keamanan_siber: "#bdc3ff",
  privasi_data: "#d6baff",
  etika_digital: "#8ed99b",
};

const CATEGORY_CONTAINERS_LIGHT: Record<string, string> = {
  keamanan_siber: "#dfe0ff",
  privasi_data: "#eddbff",
  etika_digital: "#ffddb0",
};

const CATEGORY_CONTAINERS_DARK: Record<string, string> = {
  keamanan_siber: "#3641a9",
  privasi_data: "#5b378d",
  etika_digital: "#6b3d00",
};

export default function MissionsScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { missions, loading, refetch } = useMissions();
  const { profile } = useProfile();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [catProgress, setCatProgress] = useState<any[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);

  useEffect(() => {
    refetch();
  }, []);

  // Progres kategori & tantangan harian dihitung dari completion USER,
  // bukan dari jumlah misi di katalog (biar user baru mulai dari 0).
  useEffect(() => {
    if (!profile || missions.length === 0) return;
    (async () => {
      const { data: comp } = await supabase
        .from("mission_completions")
        .select("mission_id")
        .eq("user_id", profile.id);
      const doneIds = new Set((comp || []).map((c: any) => c.mission_id));

      const prog = CATEGORIES.map((cat) => {
        const inCat = missions.filter((m: any) => m.category === cat.id);
        const total = inCat.length;
        const done = inCat.filter((m: any) => doneIds.has(m.id)).length;
        return { ...cat, total, done };
      });
      setCatProgress(prog);

      const next = missions.find((m: any) => !doneIds.has(m.id)) || missions[0];
      setDailyChallenge(next);
    })();
  }, [profile, missions]);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <MaterialCommunityIcons
          name="loading"
          size={32}
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text
        style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, fontWeight: "700" }]}
      >
        Misi
      </Text>

      {/* Tantangan Hari Ini Card */}
      <DwCard colors={colors}>
        <View style={styles.challengeContent}>
          <View style={styles.challengeLeft}>
            <View style={[styles.kickerRow]}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={14}
                color={colors.primary}
              />
              <Text
                style={[
                  TYPOGRAPHY.labelSm,
                  { color: colors.onSurfaceVariant, marginLeft: 4, fontWeight: "700" },
                ]}
              >
                TANTANGAN HARI INI
              </Text>
            </View>
            <Text
              style={[
                TYPOGRAPHY.titleLg,
                {
                  color: colors.onSurface,
                  marginTop: SPACING.xs,
                  fontWeight: "600",
                },
              ]}
            >
              {dailyChallenge?.title || "Tantangan Hari Ini"}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.labelMd,
                {
                  color: colors.onSurfaceVariant,
                  marginTop: SPACING.xs,
                  fontWeight: "400",
                },
              ]}
              numberOfLines={2}
            >
              {dailyChallenge?.description ||
                "Selesaikan misi ini untuk mengasah literasi digitalmu."}
            </Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.challengeBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => {
            if (dailyChallenge) router.push(`/mission/${dailyChallenge.id}`);
            else router.push(`/mission/category/keamanan_siber`);
          }}
        >
          <Text
            style={[TYPOGRAPHY.labelLg, { color: colors.onPrimary }]}
          >
            Mulai Sekarang
          </Text>
        </Pressable>
      </DwCard>

      {/* Filter Chips */}
      <View style={styles.chipRow}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <Pressable
              key={f.key}
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
              onPress={() => setFilter(f.key)}
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
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Category Cards */}
      {catProgress.map((cat) => {
        const catColor = isDark
          ? CATEGORY_COLORS_DARK[cat.id]
          : CATEGORY_COLORS_LIGHT[cat.id];
        const catBg = isDark
          ? CATEGORY_CONTAINERS_DARK[cat.id]
          : CATEGORY_CONTAINERS_LIGHT[cat.id];
        const progress = cat.total > 0 ? cat.done / cat.total : 0;

        return (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [
              styles.categoryCard,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderRadius: RADIUS.md,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
            onPress={() => router.push(`/mission/category/${cat.id}`)}
          >
            <View style={styles.categoryTop}>
              {/* Icon box */}
              <View
                style={[
                  styles.categoryIconBox,
                  { backgroundColor: catBg, borderRadius: RADIUS.sm },
                ]}
              >
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={22}
                  color={catColor}
                />
              </View>

              {/* Text */}
              <View style={styles.categoryTextWrap}>
                <Text
                  style={[TYPOGRAPHY.titleMd, { color: colors.onSurface }]}
                >
                  {cat.label}
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.labelMd,
                    {
                      color: colors.onSurfaceVariant,
                      marginTop: 2,
                      fontWeight: "400",
                    },
                  ]}
                >
                  {cat.done} dari {cat.total} selesai
                </Text>
              </View>

              {/* Right side: value + chevron */}
              <View style={styles.categoryRight}>
                <Text
                  style={[
                    TYPOGRAPHY.labelSm,
                    { color: colors.onSurfaceVariant, fontWeight: "500" },
                  ]}
                >
                  {cat.done}/{cat.total}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </View>
            </View>

            {/* Progress bar */}
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: colors.outlineVariant,
                  borderRadius: 3,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(progress * 100, 0)}%` as any,
                    backgroundColor: catColor,
                    borderRadius: 3,
                  },
                ]}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/* ── Local presentational wrapper (not exported, avoids new file) ── */
function DwCard({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: Record<string, string>;
}) {
  return (
    <View
      style={[
        styles.tantanganCard,
        {
          backgroundColor: colors.surfaceContainer,
          borderRadius: 24,
          ...ELEVATION.low,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: LAYOUT.screenPadding,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Tantangan Hari Ini */
  tantanganCard: {
    width: 372,
    maxWidth: "100%",
    height: 170,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    justifyContent: "space-between",
  },
  challengeContent: {
    flex: 1,
  },
  challengeLeft: {
    flex: 1,
  },
  kickerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  challengeBtn: {
    width: 150,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: SPACING.sm,
  },

  /* Filter chips */
  chipRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Category cards */
  categoryCard: {
    width: 372,
    maxWidth: "100%",
    height: 110,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    justifyContent: "space-between",
  },
  categoryTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTextWrap: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  categoryRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  progressTrack: {
    height: 6,
    width: "100%",
    marginTop: SPACING.md,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
  },
});
