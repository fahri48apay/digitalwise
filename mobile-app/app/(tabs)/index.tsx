import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { useCallback, useState, useEffect } from "react";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";
import {
  getXpProgress,
  SPACING,
  TYPOGRAPHY,
  LAYOUT,
} from "@/lib/constants";
import { LevelUpModal } from "@/components/gamification";
import { DwCard, DwIcon, DwAvatar } from "@/components/ui";
import { useAppTheme } from "@/providers/ThemeProvider";

// ── Mock missions (replace with Supabase query when table exists) ──
const MOCK_MISSIONS = [
  { id: "1", icon: "shield-check" as const, label: "Cek Email", xp: 100, done: true },
  { id: "2", icon: "lock" as const, label: "Buat Password", xp: 100, done: false },
  { id: "3", icon: "cellphone-check" as const, label: "Privasi HP", xp: 100, done: true },
  { id: "4", icon: "alert-circle" as const, label: "Phishing", xp: 100, done: false },
];

// ── Category progress (replace with real data when available) ──
const CATEGORY_PROGRESS = [
  { id: "keamanan_siber", label: "Keamanan Siber", color: "primary", pct: 72 },
  { id: "privasi_data", label: "Privasi Data", color: "tertiary", pct: 48 },
  { id: "etika_digital", label: "Etika Digital", color: "success", pct: 85 },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { profile, loading, refetch } = useProfile();
  const { checkStreak, lastResult, clearLastResult } = useXP();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (lastResult?.leveled_up) setShowLevelUp(true);
  }, [lastResult]);

  const onRefresh = useCallback(async () => {
    await refetch();
    await checkStreak();
  }, []);

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>Memuat…</Text>
      </View>
    );
  }

  const xp = getXpProgress(profile.total_xp);
  const firstName = profile.display_name.split(" ")[0];
  const remainingXp = xp.next
    ? xp.next.xpThreshold - profile.total_xp
    : Math.max(0, (xp.current.xpThreshold + 300) - profile.total_xp);
  const nextLevel = xp.next ? xp.next.level : xp.current.level + 1;
  const levelXpTarget = xp.next
    ? xp.next.xpThreshold - xp.current.xpThreshold
    : 300;

  // ── Notification bell with red dot ──
  const NotificationBell = () => (
    <Pressable
      onPress={() => router.push("/notifications")}
      style={{ position: "relative", padding: SPACING.xs }}
      accessibilityLabel="Notifikasi"
      accessibilityRole="button"
    >
      <DwIcon name="bell-outline" size={24} color={colors.onSurface} />
      <View
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.error,
          borderWidth: 2,
          borderColor: colors.background,
        }}
      />
    </Pressable>
  );

  // ── Stat pill ──
  const StatPill = ({
    icon,
    text,
    bg,
    textColor,
  }: {
    icon: string;
    text: string;
    bg: string;
    textColor: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        borderRadius: 20,
        backgroundColor: bg,
        paddingHorizontal: SPACING.md,
        gap: SPACING.xs,
      }}
    >
      <DwIcon name={icon as any} size={16} color={textColor} />
      <Text style={[TYPOGRAPHY.labelSm, { color: textColor }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );

  // ── Daily mission card ──
  const MissionCard = ({
    icon,
    label,
    xp,
    done,
  }: {
    icon: string;
    label: string;
    xp: number;
    done: boolean;
  }) => (
    <Pressable
      onPress={() => router.push("/quizzes")}
      style={({ pressed }) => ({
        width: 118,
        height: 132,
        borderRadius: 16,
        backgroundColor: done ? colors.successContainer : colors.surfaceContainerLow,
        padding: SPACING.md,
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.sm,
        opacity: pressed ? 0.8 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${done ? "selesai" : `${xp} XP`}`}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: done ? colors.success : colors.primaryContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DwIcon name={icon as any} size={20} color={done ? colors.onSuccess : colors.onPrimaryContainer} />
      </View>
      <Text
        style={[TYPOGRAPHY.labelMd, { color: colors.onSurface, textAlign: "center" }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        style={[TYPOGRAPHY.labelSm, {
          color: done ? colors.success : colors.tertiary,
          textAlign: "center",
        }]}
        numberOfLines={1}
      >
        {done ? `+${xp} XP · Selesai` : `+${xp} XP`}
      </Text>
    </Pressable>
  );

  // ── Progress bar (reusable) ──
  const ProgressBar = ({
    trackColor,
    fillColor,
    height = 6,
    radius = 3,
    value,
  }: {
    trackColor: string;
    fillColor: string;
    height?: number;
    radius?: number;
    value: number;
  }) => (
    <View
      style={{
        width: "100%",
        height,
        borderRadius: radius,
        backgroundColor: trackColor,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          height: "100%",
          borderRadius: radius,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: LAYOUT.screenPadding,
          paddingBottom: SPACING.xxl * 4,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── TOP BAR ──────────────────────────────────────────── */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xxl,
          }}
        >
          <DwAvatar uri={profile.avatar_url} name={profile.display_name} size={44} />

          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={TYPOGRAPHY.headlineMd}>Halo, {firstName}</Text>
            <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>
              Level {profile.current_level} · {xp.current.title}
            </Text>
          </View>

          <NotificationBell />
        </View>

        {/* ── XP CARD ──────────────────────────────────────────── */}
        <View
          style={{
            width: "100%",
            borderRadius: 24,
            backgroundColor: colors.surfaceContainer,
            padding: SPACING.xxl,
            marginBottom: SPACING.xl,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <Text style={TYPOGRAPHY.titleMd}>
                {profile.total_xp} / {xp.next ? xp.next.xpThreshold : profile.total_xp + remainingXp} XP
              </Text>
              <Text style={[TYPOGRAPHY.labelMd, { color: colors.onPrimaryContainer, marginTop: SPACING.xs }]}>
                {remainingXp} XP lagi menuju Level {nextLevel}
              </Text>
            </View>

            {/* Hex badge */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[TYPOGRAPHY.titleMd, { color: colors.onPrimary }]}>
                {profile.current_level}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ marginTop: SPACING.lg }}>
            <ProgressBar
              trackColor={colors.onPrimaryContainer}
              fillColor={colors.primary}
              height={8}
              radius={4}
              value={xp.progress}
            />
          </View>

          {/* Labels below bar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.sm }}>
            <Text style={[TYPOGRAPHY.labelSm, { color: colors.onPrimaryContainer }]}>XP Level ini</Text>
            <Text style={[TYPOGRAPHY.labelSm, { color: colors.onPrimaryContainer }]}>
              {levelXpTarget} XP
            </Text>
          </View>
        </View>

        {/* ── STAT PILLS ──────────────────────────────────────── */}
        <View
          style={{
            flexDirection: "row",
            gap: SPACING.sm,
            marginBottom: SPACING.xl,
          }}
        >
          <StatPill
            icon="fire"
            text={`Streak ${profile.streak_count} hari`}
            bg={colors.warningContainer}
            textColor={colors.onWarningContainer}
          />
          <StatPill
            icon="trophy"
            text={`Peringkat #— minggu ini`}
            bg={colors.tertiaryContainer}
            textColor={colors.onTertiaryContainer}
          />
        </View>

        {/* ── MISI HARIAN ─────────────────────────────────────── */}
        <View style={{ marginBottom: SPACING.xl }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
            <Text style={TYPOGRAPHY.titleLg}>Misi Harian</Text>
            <Pressable onPress={() => router.push("/quizzes")}>
              <Text style={[TYPOGRAPHY.labelLg, { color: colors.primary }]}>Lihat semua</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: SPACING.sm }}
          >
            {MOCK_MISSIONS.map((m) => (
              <MissionCard
                key={m.id}
                icon={m.icon}
                label={m.label}
                xp={m.xp}
                done={m.done}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── PROGRES BELAJAR ─────────────────────────────────── */}
        <DwCard style={{ marginBottom: SPACING.xl }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.md }}>
            <Text style={TYPOGRAPHY.titleMd}>Progres Belajar</Text>
            <Pressable onPress={() => router.push("/material")}>
              <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary }]}>Detail</Text>
            </Pressable>
          </View>

          {CATEGORY_PROGRESS.map((cat) => (
            <View key={cat.id} style={{ marginBottom: SPACING.sm }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xs }}>
                <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurface }]}>{cat.label}</Text>
                <Text style={[TYPOGRAPHY.labelSm, { color: colors.onSurfaceVariant }]}>{cat.pct}%</Text>
              </View>
              <ProgressBar
                trackColor={colors.outlineVariant}
                fillColor={colors[cat.color as keyof typeof colors]}
                height={6}
                radius={3}
                value={cat.pct}
              />
            </View>
          ))}
        </DwCard>

        {/* ── HELP CARD ───────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/report/new")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 16,
            backgroundColor: colors.surfaceContainer,
            padding: SPACING.lg,
            marginBottom: SPACING.sm,
            opacity: pressed ? 0.8 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Laporkan konten berbahaya"
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.errorContainer,
              alignItems: "center",
              justifyContent: "center",
              marginRight: SPACING.md,
            }}
          >
            <DwIcon name="shield" size={24} color={colors.error} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[TYPOGRAPHY.bodyLg, { color: colors.onErrorContainer }]}>
              Temu konten berbahaya?
            </Text>
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.onErrorContainer }]}>
              Laporkan, mentor kami siap bantu
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/report/new")}
            style={({ pressed }) => ({
              width: 70,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.error,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Lapor"
          >
            <Text style={[TYPOGRAPHY.labelLg, { color: colors.onError }]}>Lapor</Text>
          </Pressable>
        </Pressable>

        {/* ── FORUM CARD ──────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/forum")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 16,
            backgroundColor: colors.surfaceContainer,
            padding: SPACING.lg,
            marginBottom: SPACING.xl,
            opacity: pressed ? 0.8 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Buka forum diskusi"
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.tertiaryContainer,
              alignItems: "center",
              justifyContent: "center",
              marginRight: SPACING.md,
            }}
          >
            <DwIcon name="forum-outline" size={24} color={colors.tertiary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[TYPOGRAPHY.bodyLg, { color: colors.onTertiaryContainer, fontWeight: "700" }]}>
              Punya cerita atau pertanyaan?
            </Text>
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.onTertiaryContainer }]}>
              Diskusi bareng teman & mentor
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/forum")}
            style={({ pressed }) => ({
              width: 70,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.tertiary,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Forum"
          >
            <Text style={[TYPOGRAPHY.labelLg, { color: colors.onTertiary }]}>Forum</Text>
          </Pressable>
        </Pressable>
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
