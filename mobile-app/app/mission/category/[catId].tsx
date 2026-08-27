import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwCard, DwIcon, DwChip } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS, LAYOUT } from "@/lib/constants";

const CATEGORY_LABELS: Record<string, string> = {
  keamanan_siber: "Keamanan Siber",
  privasi_data: "Privasi Data",
  etika_digital: "Etika Digital",
};

const CATEGORY_ICONS: Record<string, string> = {
  keamanan_siber: "shield-lock",
  privasi_data: "lock-outline",
  etika_digital: "hand-heart",
};

export default function MissionCategoryScreen() {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { profile } = useProfile();
  const [missions, setMissions] = useState<any[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [catId]);

  async function load() {
    if (!catId) return;
    setLoading(true);
    const { data } = await supabase
      .from("missions")
      .select("*")
      .eq("is_active", true)
      .eq("category", catId)
      .order("created_at", { ascending: false });
    setMissions(data || []);
    if (profile) {
      const { data: comp } = await supabase
        .from("mission_completions")
        .select("mission_id")
        .eq("user_id", profile.id);
      setCompletedIds((comp || []).map((c: any) => c.mission_id));
    }
    setLoading(false);
  }

  const label = CATEGORY_LABELS[catId || ""] || catId;
  const icon = CATEGORY_ICONS[catId || ""] || "book-open-variant";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <DwIcon name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={colors.primary}
          />
          <Text style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, marginLeft: SPACING.sm }]}>
            {label}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="loading" size={32} color={colors.primary} />
        </View>
      ) : missions.length === 0 ? (
        <View style={styles.center}>
          <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>
            Belum ada misi di kategori ini
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {missions.map((m) => {
            const done = completedIds.includes(m.id);
            return (
              <Pressable
                key={m.id}
                onPress={() => router.push(`/mission/${m.id}`)}
                style={({ pressed }) => [
                  styles.item,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderRadius: RADIUS.md,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <View style={styles.itemTop}>
                  <Text style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, flex: 1 }]}>
                    {m.title}
                  </Text>
                  {done && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={colors.success}
                    />
                  )}
                </View>
                {m.description && (
                  <Text
                    style={[TYPOGRAPHY.bodySm, { color: colors.onSurfaceVariant, marginTop: SPACING.xs }]}
                    numberOfLines={2}
                  >
                    {m.description}
                  </Text>
                )}
                <View style={styles.itemChips}>
                  <DwChip label={m.mission_type} style={{ height: 32, borderRadius: 16 }} />
                  <DwChip
                    label={`+${m.xp_reward} XP`}
                    color={colors.success}
                    style={{ height: 32, borderRadius: 16, backgroundColor: colors.successContainer }}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxxl,
    gap: SPACING.md,
  },
  item: {
    width: 372,
    maxWidth: "100%",
    alignSelf: "center",
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemChips: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
});
