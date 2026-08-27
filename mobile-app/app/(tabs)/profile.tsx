import { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal as RNModal,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useUpload } from "@/hooks/useUpload";
import { useAppTheme } from "@/providers/ThemeProvider";
import {
  getXpProgress,
  CATEGORIES,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  LAYOUT,
} from "@/lib/constants";
import { DwIcon } from "@/components/ui";

/* ─── badge icon map (one icon per learning category) ─── */
const BADGE_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  keamanan_siber: "shield-lock",
  privasi_data: "lock-outline",
  etika_digital: "hand-heart",
};

/* ─── menu config ─── */
type MenuBgKey =
  | "primaryContainer"
  | "errorContainer"
  | "successContainer"
  | "tertiaryContainer";
type MenuColorKey =
  | "onPrimaryContainer"
  | "onErrorContainer"
  | "onSuccessContainer"
  | "onTertiaryContainer"
  | "error";

interface MenuItem {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  bgKey: MenuBgKey;
  colorKey: MenuColorKey;
  route?: string;
  adminOnly?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: "progress",
    label: "Progres Belajarku",
    icon: "chart-line",
    bgKey: "primaryContainer",
    colorKey: "onPrimaryContainer",
    route: "/progress",
  },
  {
    key: "report",
    label: "Lapor & Minta Bantuan",
    icon: "flag-outline",
    bgKey: "errorContainer",
    colorKey: "onErrorContainer",
    route: "/report/new",
  },
  {
    key: "help",
    label: "Pusat Bantuan",
    icon: "lifebuoy",
    bgKey: "successContainer",
    colorKey: "onSuccessContainer",
    route: "/help",
  },
  {
    key: "admin",
    label: "Panel Admin",
    icon: "shield-crown",
    bgKey: "tertiaryContainer",
    colorKey: "onTertiaryContainer",
    route: "/admin",
    adminOnly: true,
  },
  {
    key: "logout",
    label: "Keluar",
    icon: "logout",
    bgKey: "errorContainer",
    colorKey: "error",
  },
];

/* ─── category container colors (light ↔ dark) ─── */
const CAT_CONTAINER_LIGHT: Record<string, string> = {
  keamanan_siber: "#dfe0ff",
  privasi_data: "#eddbff",
  etika_digital: "#ffddb0",
};
const CAT_CONTAINER_DARK: Record<string, string> = {
  keamanan_siber: "#3641a9",
  privasi_data: "#5b378d",
  etika_digital: "#6b3d00",
};
const CAT_ICON_LIGHT: Record<string, string> = {
  keamanan_siber: "#3e4bbe",
  privasi_data: "#744cb0",
  etika_digital: "#1d6f3c",
};
const CAT_ICON_DARK: Record<string, string> = {
  keamanan_siber: "#bdc3ff",
  privasi_data: "#d6baff",
  etika_digital: "#8ed99b",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { profile, refetch } = useProfile();
  const { pickImage, takePhoto, upload, loading: uploading } = useUpload();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  /* ── handlers (unchanged logic) ── */

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  }

  const handlePick = async (source: "gallery" | "camera") => {
    setShowPicker(false);
    if (!profile) return;

    const result =
      source === "gallery" ? await pickImage() : await takePhoto();
    if (result && !result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!profile) return;

    const result = await upload(uri, profile.id, "avatars");
    if (!result) return;

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: result.url })
      .eq("id", profile.id);

    if (!error) await refetch();
  };

  /* ── loading guard ── */
  if (!profile) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons
          name="loading"
          size={32}
          color={colors.primary}
        />
      </View>
    );
  }

  const xp = getXpProgress(profile.total_xp);
  const displayAvatar = avatarUri || profile.avatar_url;
  const stats = [
    { key: "poin", label: "Poin", value: profile.total_xp },
    { key: "lencana", label: "Lencana", value: 0 },
    { key: "streak", label: "Streak", value: profile.streak_count },
  ];

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text
            style={[
              TYPOGRAPHY.titleLg,
              { color: colors.onSurface, fontWeight: "700" },
            ]}
          >
            Profil
          </Text>
          <Pressable
            style={styles.settingsBtn}
            onPress={() => router.push("/settings")}
            accessibilityLabel="Pengaturan"
          >
            <DwIcon name="cog-outline" size={24} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>

        {/* ── Account Card ── */}
        <View
          style={[
            styles.accountCard,
            {
              backgroundColor: colors.surfaceContainer,
              borderRadius: RADIUS.lg,
            },
          ]}
        >
          {/* Avatar */}
          <Pressable
            onPress={() => setShowPicker(true)}
            style={styles.avatarWrap}
            accessibilityLabel="Ubah foto profil"
          >
            {displayAvatar ? (
              <Image
                source={{ uri: displayAvatar }}
                style={[styles.avatar, { borderRadius: 36 }]}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 36,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.onPrimary,
                    fontSize: 28,
                    fontWeight: "600",
                  }}
                >
                  {profile.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.cameraBtn,
                { backgroundColor: colors.primary, borderColor: colors.surfaceContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="camera"
                size={14}
                color={colors.onPrimary}
              />
            </View>
            {uploading && <View style={styles.uploadOverlay} />}
          </Pressable>

          {/* Level ring badge */}
          <View
            style={[
              styles.levelBadge,
              {
                backgroundColor: colors.primary,
                borderRadius: RADIUS.full,
              },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.labelSm,
                { color: colors.onPrimary, fontWeight: "600" },
              ]}
            >
              Level {xp.current.level} · {xp.current.title}
            </Text>
          </View>

          {/* Name */}
          <Text
            style={[
              TYPOGRAPHY.titleLg,
              {
                color: colors.onPrimaryContainer,
                fontWeight: "600",
                textAlign: "center",
              },
            ]}
          >
            {profile.display_name}
          </Text>

          {/* Handle */}
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              {
                color: colors.onPrimaryContainer,
                textAlign: "center",
                fontWeight: "400",
              },
            ]}
          >
            @{profile.username}
          </Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View
              key={stat.key}
              style={[
                styles.statBox,
                {
                  backgroundColor: colors.surfaceContainerLow,
                  borderRadius: RADIUS.md,
                },
              ]}
            >
              <Text
                style={[
                  TYPOGRAPHY.titleLg,
                  { color: colors.primary, fontWeight: "800" },
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.labelSm,
                  { color: colors.onSurfaceVariant, fontWeight: "400" },
                ]}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Lencana Section ── */}
        <View style={styles.lencanaHeader}>
          <Text
            style={[
              TYPOGRAPHY.titleMd,
              { color: colors.onSurface, fontWeight: "600" },
            ]}
          >
            Lencana
          </Text>
          <Pressable>
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary }]}>
              Lihat semua
            </Text>
          </Pressable>
        </View>

        <View style={styles.badgesRow}>
          {CATEGORIES.map((cat) => {
            const containerBg = isDark
              ? CAT_CONTAINER_DARK[cat.id]
              : CAT_CONTAINER_LIGHT[cat.id];
            const iconColor = isDark
              ? CAT_ICON_DARK[cat.id]
              : CAT_ICON_LIGHT[cat.id];

            return (
              <View
                key={cat.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderRadius: RADIUS.md,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeCircle,
                    {
                      backgroundColor: containerBg,
                      borderRadius: 22,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={BADGE_ICONS[cat.id]}
                    size={22}
                    color={iconColor}
                  />
                </View>
                <Text
                  style={[
                    TYPOGRAPHY.labelSm,
                    {
                      color: colors.onSurface,
                      textAlign: "center",
                      fontWeight: "600",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {cat.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Divider ── */}
        <View
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        {/* ── Menu Items ── */}
        {MENU_ITEMS.filter((item) => !item.adminOnly || profile.role === "admin").map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.menuItem,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderRadius: RADIUS.sm,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
            onPress={() => {
              if (item.key === "logout") {
                handleLogout();
              } else if (item.route) {
                router.push(item.route as any);
              }
            }}
          >
            <View
              style={[
                styles.menuIconBox,
                {
                  backgroundColor: colors[item.bgKey],
                  borderRadius: RADIUS.sm,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={colors[item.colorKey]}
              />
            </View>
            <Text
              style={[
                TYPOGRAPHY.bodyLg,
                {
                  flex: 1,
                  color:
                    item.colorKey === "error"
                      ? colors.error
                      : colors.onSurface,
                  fontWeight: "600",
                },
              ]}
            >
              {item.label}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Photo Picker Modal ── */}
      <RNModal visible={showPicker} transparent animationType="fade">
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.scrim }]}
          onPress={() => setShowPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surfaceContainer,
                borderRadius: RADIUS.lg,
              },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.titleMd,
                { color: colors.onSurface, marginBottom: SPACING.lg, fontWeight: "700" },
              ]}
            >
              Foto Profil
            </Text>
            <Pressable
              style={[
                styles.modalOption,
                { backgroundColor: colors.primaryContainer, borderRadius: RADIUS.sm },
              ]}
              onPress={() => handlePick("gallery")}
            >
              <MaterialCommunityIcons
                name="image"
                size={20}
                color={colors.onPrimaryContainer}
              />
              <Text
                style={[
                  TYPOGRAPHY.labelLg,
                  { color: colors.onPrimaryContainer },
                ]}
              >
                Pilih dari Galeri
              </Text>
            </Pressable>
            {Platform.OS !== "web" && (
              <Pressable
                style={[
                  styles.modalOption,
                  { backgroundColor: colors.secondaryContainer, borderRadius: RADIUS.sm },
                ]}
                onPress={() => handlePick("camera")}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={20}
                  color={colors.onSecondaryContainer}
                />
                <Text
                  style={[
                    TYPOGRAPHY.labelLg,
                    { color: colors.onSecondaryContainer },
                  ]}
                >
                  Ambil Foto
                </Text>
              </Pressable>
            )}
            <Pressable
              style={[
                styles.modalOption,
                { backgroundColor: colors.surfaceContainerHigh, borderRadius: RADIUS.sm },
              ]}
              onPress={() => setShowPicker(false)}
            >
              <Text
                style={[
                  TYPOGRAPHY.labelLg,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Batal
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </RNModal>
    </>
  );
}

/* ─── styles ─── */
const styles = StyleSheet.create({
  scroll: {
    padding: LAYOUT.screenPadding,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  settingsBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Account Card — 372×190 */
  accountCard: {
    width: 372,
    maxWidth: "100%",
    height: 190,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.xs,
  },

  /* Avatar 72×72 */
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 36,
  },

  /* Level badge — 190×28, pill */
  levelBadge: {
    width: 190,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xs,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  /* Lencana */
  lencanaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  badgeCard: {
    width: 104,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Divider */
  divider: {
    height: 1,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },

  /* Menu Items — 372×52 */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    width: 372,
    maxWidth: "100%",
    height: 52,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxWidth: 320,
    padding: SPACING.xxl,
    gap: SPACING.sm,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
});
