import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProfileStore } from "@/stores/profileStore";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";
import { DwAvatar } from "@/components/ui";

type FilterMode = "week" | "all";

export default function LeaderboardScreen() {
  const { colors } = useAppTheme();
  const { entries, loading, refetch } = useLeaderboard();
  const { profile } = useProfileStore();
  const [filter, setFilter] = React.useState<FilterMode>("week");

  useEffect(() => { refetch(); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>
          Memuat...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={[
            TYPOGRAPHY.titleLg,
            { color: colors.onSurface, fontWeight: "700" },
          ]}
        >
          Peringkat
        </Text>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilter("week")}
            style={[
              styles.chip,
              filter === "week"
                ? { backgroundColor: colors.secondaryContainer }
                : {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.outlineVariant,
                  },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.labelMd,
                {
                  color:
                    filter === "week"
                      ? colors.onSecondaryContainer
                      : colors.onSurfaceVariant,
                  fontWeight: filter === "week" ? "600" : "500",
                },
              ]}
            >
              Minggu ini
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("all")}
            style={[
              styles.chip,
              filter === "all"
                ? { backgroundColor: colors.secondaryContainer }
                : {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.outlineVariant,
                  },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.labelMd,
                {
                  color:
                    filter === "all"
                      ? colors.onSecondaryContainer
                      : colors.onSurfaceVariant,
                  fontWeight: filter === "all" ? "600" : "500",
                },
              ]}
            >
              Semua waktu
            </Text>
          </Pressable>
        </View>

        {/* Podium */}
        <View style={styles.podium}>
          {/* #2 — left */}
          <PodiumCard
            entry={top3[1]}
            rank={2}
            colors={colors}
          />

          {/* #1 — center */}
          <PodiumCard
            entry={top3[0]}
            rank={1}
            colors={colors}
          />

          {/* #3 — right */}
          <PodiumCard
            entry={top3[2]}
            rank={3}
            colors={colors}
          />
        </View>

        {/* Ranked list */}
        <View style={styles.rankList}>
          {rest.map((entry, index) => {
            const rank = index + 4;
            const isMe = entry.id === profile?.id;
            const prevEntry = rank > 1 ? entries[rank - 2] : undefined;
            return (
              <RankRow
                key={entry.id}
                entry={entry}
                rank={rank}
                isMe={isMe}
                prevEntryXp={prevEntry?.total_xp}
                colors={colors}
              />
            );
          })}
        </View>

        {/* Note card */}
        <View style={[styles.noteCard, { backgroundColor: colors.surfaceContainer }]}>
          <View style={styles.noteIcon}>
            <Text
              style={[
                TYPOGRAPHY.labelLg,
                { color: colors.onSuccessContainer, fontSize: 16, lineHeight: 20 },
              ]}
            >
              i
            </Text>
          </View>
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              {
                flex: 1,
                color: colors.onSuccessContainer,
                lineHeight: 18,
              },
            ]}
          >
            Bersaing secara positif! Beri semangat temanmu, bukan mengejek yang
            tertinggal.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Podium Card ────────────────────────────────────────────────
function PodiumCard({
  entry,
  rank,
  colors,
}: {
  entry: { display_name: string; total_xp: number; avatar_url: string | null } | undefined;
  rank: 1 | 2 | 3;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const isFirst = rank === 1;

  const cardW = isFirst ? 120 : 110;
  const cardH = isFirst ? 180 : 150;
  const cardBg = isFirst ? colors.tertiaryContainer : colors.surfaceContainerLow;

  const badgeSize = isFirst ? 26 : 22;
  const badgeBg = isFirst ? colors.tertiary : colors.surfaceContainerHighest;
  const badgeText = isFirst ? colors.onTertiary : colors.onSurfaceVariant;

  const avatarSize = isFirst ? 44 : 36;

  const nameColor = isFirst ? colors.onTertiaryContainer : colors.onSurface;
  const xpColor = isFirst ? colors.onTertiaryContainer : colors.onSurfaceVariant;
  const xpWeight = isFirst ? "600" : "500";

  const initial = entry
    ? entry.display_name.charAt(0).toUpperCase()
    : "";
  const firstName = entry ? entry.display_name.split(" ")[0] : "";
  const xp = entry ? entry.total_xp : 0;

  return (
    <View
      style={[
        styles.podiumCard,
        {
          width: cardW,
          height: cardH,
          backgroundColor: cardBg,
        },
      ]}
    >
      {/* Badge circle */}
      <View
        style={[
          styles.podiumBadge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: badgeBg,
          },
        ]}
      >
        <Text
          style={{
            color: badgeText,
            fontSize: isFirst ? 13 : 12,
            fontWeight: "700",
          }}
        >
          {rank}
        </Text>
      </View>

      {/* Avatar */}
      <DwAvatar uri={entry?.avatar_url} name={initial} size={avatarSize} />

      {/* Name */}
      <Text
        numberOfLines={1}
        style={[
          TYPOGRAPHY.labelMd,
          { color: nameColor, fontSize: 13, marginTop: 4 },
        ]}
      >
        {firstName}
      </Text>

      {/* XP */}
      <Text
        style={[
          TYPOGRAPHY.labelSm,
          {
            color: xpColor,
            fontWeight: xpWeight,
            marginTop: 2,
          },
        ]}
      >
        {formatNumber(xp)} XP
      </Text>
    </View>
  );
}

// ─── Rank Row ───────────────────────────────────────────────────
function RankRow({
  entry,
  rank,
  isMe,
  prevEntryXp,
  colors,
}: {
  entry: { id: string; display_name: string; total_xp: number; avatar_url: string | null };
  rank: number;
  isMe: boolean;
  prevEntryXp: number | undefined;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  // XP remaining to next rank (for current user)
  let xpText = `${formatNumber(entry.total_xp)} XP`;
  if (isMe && prevEntryXp !== undefined) {
    const remaining = prevEntryXp - entry.total_xp;
    xpText = `${formatNumber(entry.total_xp)} XP · ${formatNumber(remaining)} XP lagi ke #${rank - 1}`;
  }

  const rowBg = isMe ? colors.primaryContainer : colors.surfaceContainerLow;
  const rankColor = isMe ? colors.onPrimaryContainer : colors.onSurfaceVariant;
  const nameColor = isMe ? colors.onPrimaryContainer : colors.onSurface;
  const nameWeight = isMe ? "700" : "600";
  const xpColor = isMe ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  return (
    <View style={[styles.rankRow, { backgroundColor: rowBg }]}>
      {/* Rank number */}
      <Text
        style={[
          TYPOGRAPHY.labelLg,
          { color: rankColor, fontWeight: "700", width: 24, textAlign: "center" },
        ]}
      >
        {rank}
      </Text>

      {/* Avatar */}
      <DwAvatar
        uri={entry.avatar_url}
        name={entry.display_name.charAt(0).toUpperCase()}
        size={32}
      />

      {/* Name */}
      <Text
        numberOfLines={1}
        style={[
          TYPOGRAPHY.labelLg,
          {
            flex: 1,
            color: nameColor,
            fontWeight: nameWeight,
            marginLeft: SPACING.sm,
          },
        ]}
      >
        {entry.display_name}
      </Text>

      {/* XP */}
      <Text
        numberOfLines={1}
        style={[
          TYPOGRAPHY.labelSm,
          { color: xpColor, fontWeight: "500" },
        ]}
      >
        {xpText}
      </Text>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────
function formatNumber(n: number): string {
  return n.toLocaleString("id-ID");
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  filterRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  chip: {
    height: 36,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    marginTop: SPACING.lg + SPACING.sm,
    marginBottom: SPACING.lg,
  },
  podiumCard: {
    borderRadius: RADIUS.md,
    alignItems: "center",
    paddingVertical: SPACING.sm + SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  podiumBadge: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  rankList: {
    gap: SPACING.sm,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    gap: SPACING.sm,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  noteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
