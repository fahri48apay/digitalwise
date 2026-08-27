import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwButton, DwCard, DwChip, DwIcon } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS, LAYOUT } from "@/lib/constants";

export default function MissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useProfile();
  const { claimXP } = useXP();
  const { colors } = useAppTheme();
  const [mission, setMission] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { loadMission(); }, [id]);

  async function loadMission() {
    if (!id) return;
    const { data } = await supabase.from("missions").select("*").eq("id", id).single();
    if (data) {
      setMission(data);
      if (profile) {
        const { data: c } = await supabase.from("mission_completions").select("id").eq("user_id", profile.id).eq("mission_id", id).single();
        setCompleted(!!c);
      }
    }
  }

  async function handleStart() {
    if (!mission || !profile) return;
    if (mission.mission_type === "quiz") {
      const { data: quiz } = await supabase.from("quizzes").select("id").eq("category", mission.category).eq("is_active", true).limit(1).single();
      if (quiz) router.push(`/quiz/${quiz.id}`);
      else Alert.alert("Info", "Quiz belum tersedia");
    } else {
      const result = await claimXP(mission.xp_reward, "mission", mission.id);
      if (result) {
        await supabase.from("mission_completions").insert({ user_id: profile.id, mission_id: mission.id, xp_earned: mission.xp_reward });
        setCompleted(true);
        Alert.alert("Berhasil!", `+${mission.xp_reward} XP`);
      }
    }
  }

  if (!mission) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>Memuat...</Text>
      </View>
    );
  }

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
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, flex: 1 }]}>
          Detail Misi
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <DwCard style={styles.card}>
          {/* Chips row */}
          <View style={styles.chips}>
            <DwChip
              label={mission.mission_type}
              style={{ height: 36, borderRadius: 18 }}
            />
            <DwChip
              label={`+${mission.xp_reward} XP`}
              color={colors.success}
              style={{
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.successContainer,
              }}
            />
          </View>

          {/* Title */}
          <Text style={[TYPOGRAPHY.headlineMd, { color: colors.onSurface, marginTop: SPACING.md }]}>
            {mission.title}
          </Text>

          {/* Description */}
          {mission.description && (
            <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant, marginTop: SPACING.sm }]}>
              {mission.description}
            </Text>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

          {/* Action button */}
          {completed ? (
            <DwButton
              label="Selesai"
              variant="outlined"
              disabled
              style={{ height: 48, borderRadius: RADIUS.full }}
            />
          ) : (
            <DwButton
              label="Mulai Misi"
              onPress={handleStart}
              style={{ height: 48, borderRadius: RADIUS.full }}
            />
          )}
        </DwCard>
      </ScrollView>
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
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxxl,
  },
  card: { width: 372, alignSelf: "center" },
  chips: { flexDirection: "row", gap: SPACING.sm },
  divider: { height: 1, marginVertical: SPACING.lg },
});
