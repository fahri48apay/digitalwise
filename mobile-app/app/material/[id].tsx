import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useAppTheme } from "@/providers/ThemeProvider";
import { useMaterials } from "@/hooks/useMaterials";
import { useProfile } from "@/hooks/useProfile";
import { DwCard, DwChip, DwButton, DwIcon } from "@/components/ui";
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
  video_url: string | null;
  thumbnail_url: string | null;
  key_takeaways: string[] | null;
  xp_reward: number;
  duration_min: number;
}

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

const VIDEO_BG = "#2F3036";

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { getMaterial, getProgress, markComplete } = useMaterials();
  const { profile } = useProfile();
  const [material, setMaterial] = useState<Material | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await getMaterial(id);
      setMaterial(data);
      if (profile && data) {
        const prog = await getProgress(profile.id, data.id);
        setCompleted(prog?.completed ?? false);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    if (!profile || !material) return;
    if (completed) {
      Alert.alert("Sudah selesai", "Kamu sudah menyelesaikan materi ini");
      return;
    }
    await markComplete(profile.id, material.id, material.xp_reward);
    setCompleted(true);
    Alert.alert("Selesai!", `Kamu mendapatkan ${material.xp_reward} XP`);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="loading" size={32} color={colors.primary} />
      </View>
    );
  }

  if (!material) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text
          style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}
        >
          Materi tidak ditemukan
        </Text>
      </View>
    );
  }

  const catColor = isDark
    ? CATEGORY_COLORS_DARK[material.category] || colors.primary
    : CATEGORY_COLORS_LIGHT[material.category] || colors.primary;
  const cat = CATEGORIES.find((c) => c.id === material.category);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          Detail Materi
        </Text>
      </View>

      {/* Header section */}
      <View style={styles.headerSection}>
        {/* Meta chips */}
        <View style={styles.metaRow}>
          <DwChip label={cat?.label || material.category} color={catColor} />
          <DwChip
            label={`${material.duration_min} menit`}
            color={colors.onSurfaceVariant}
          />
          <DwChip label={`${material.xp_reward} XP`} color={colors.primary} />
        </View>

        {/* Title */}
        <Text
          style={[
            TYPOGRAPHY.headlineMd,
            { color: colors.onSurface, marginTop: SPACING.lg },
          ]}
        >
          {material.title}
        </Text>

        {/* Description */}
        {material.description && (
          <Text
            style={[
              TYPOGRAPHY.bodyMd,
              { color: colors.onSurfaceVariant, marginTop: SPACING.sm },
            ]}
          >
            {material.description}
          </Text>
        )}
      </View>

      {/* Video embed */}
      {material.video_url && (() => {
        const ytId = extractYouTubeId(material.video_url);
        if (!ytId) return null;
        const screenW = Dimensions.get("window").width;
        const videoH = Math.round((screenW - SPACING.md * 2) * 9 / 16);
        return (
          <View style={[styles.videoArea, { height: videoH }]}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${ytId}?playsinline=1&rel=0` }}
              style={[styles.webview, { height: videoH }]}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
            />
          </View>
        );
      })()}

      {/* Key Takeaways */}
      {material.key_takeaways && material.key_takeaways.length > 0 && (
        <DwCard style={styles.takeawayCard}>
          <Text
            style={[TYPOGRAPHY.titleMd, { color: colors.onSurface }]}
          >
            Poin Penting
          </Text>
          {material.key_takeaways.map((point, i) => (
            <View key={i} style={styles.takeawayItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text
                style={[
                  TYPOGRAPHY.bodyMd,
                  { color: colors.onSurface, flex: 1 },
                ]}
              >
                {point}
              </Text>
            </View>
          ))}
        </DwCard>
      )}

      {/* Complete button */}
      <View style={styles.buttonSection}>
        <DwButton
          label={completed ? "Sudah Selesai" : "Selesaikan"}
          onPress={handleComplete}
          variant={completed ? "outlined" : "filled"}
          icon={
            <MaterialCommunityIcons
              name={completed ? "check" : "school"}
              size={20}
              color={completed ? colors.primary : colors.onPrimary}
            />
          }
          style={{ height: 48, borderRadius: 22 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSection: {
    paddingHorizontal: LAYOUT.screenPadding,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flexWrap: "wrap",
  },
  videoArea: {
    width: "100%",
    maxWidth: 372,
    borderRadius: RADIUS.md,
    marginHorizontal: LAYOUT.screenPadding,
    marginTop: SPACING.lg,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: VIDEO_BG,
  },
  webview: {
    width: "100%",
    borderRadius: RADIUS.md,
  },
  takeawayCard: {
    width: 372,
    maxWidth: "100%",
    marginHorizontal: LAYOUT.screenPadding,
    marginTop: SPACING.lg,
    alignSelf: "center",
  },
  takeawayItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  buttonSection: {
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
});
