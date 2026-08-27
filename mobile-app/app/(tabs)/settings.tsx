import { useEffect, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  Modal as RNModal,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useAppTheme } from "@/providers/ThemeProvider";
import { Switch } from "@/components/ui/Switch";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  RADIUS,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
} from "@/lib/constants";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type RowBgKey =
  | "primaryContainer"
  | "secondaryContainer"
  | "successContainer"
  | "tertiaryContainer"
  | "errorContainer";
type RowColorKey =
  | "onPrimaryContainer"
  | "onSecondaryContainer"
  | "onSuccessContainer"
  | "onTertiaryContainer"
  | "error";

interface NotifPrefs {
  belajar: boolean;
  misi: boolean;
  tips: boolean;
}

const NOTIF_KEY = "notif-prefs";
const DEFAULT_NOTIF: NotifPrefs = { belajar: true, misi: true, tips: true };

/* ─── map theme mode ↔ segmented control keys ─── */
const MODE_TO_KEY = { light: "terang", dark: "gelap", system: "sistem" } as const;
const KEY_TO_MODE = { terang: "light", gelap: "dark", sistem: "system" } as const;

/* ─── reusable setting row ─── */
interface SettingRowProps {
  icon: IconName;
  bgKey: RowBgKey;
  colorKey: RowColorKey;
  label: string;
  sublabel?: string;
  labelColorKey?: RowColorKey;
  onPress?: () => void;
  right?:
    | { type: "chevron" }
    | {
        type: "switch";
        value: boolean;
        onValueChange: (v: boolean) => void;
        accessibilityLabel?: string;
      };
}

function SettingRow({
  icon,
  bgKey,
  colorKey,
  label,
  sublabel,
  labelColorKey,
  onPress,
  right,
}: SettingRowProps) {
  const { colors } = useAppTheme();
  const hasSub = sublabel != null;

  const inner = (
    <>
      <View style={[styles.iconBox, { backgroundColor: colors[bgKey] }]}>
        <MaterialCommunityIcons name={icon} size={22} color={colors[colorKey]} />
      </View>
      <View style={styles.rowText}>
        <Text
          style={[
            TYPOGRAPHY.bodyLg,
            {
              color: labelColorKey ? colors[labelColorKey] : colors.onSurface,
              fontWeight: "400",
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {hasSub && (
          <Text
            style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {sublabel}
          </Text>
        )}
      </View>
      {right?.type === "switch" ? (
        <Switch
          value={right.value}
          onValueChange={right.onValueChange}
          accessibilityLabel={right.accessibilityLabel}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={colors.onSurfaceVariant}
        />
      )}
    </>
  );

  if (right?.type === "switch") {
    return (
      <View
        style={[
          styles.rowBase,
          { height: 52, backgroundColor: colors.surfaceContainerLow },
        ]}
      >
        {inner}
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.rowBase,
        {
          height: hasSub ? 64 : 52,
          backgroundColor: colors.surfaceContainerLow,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      onPress={onPress}
    >
      {inner}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useAppTheme();
  const { profile } = useProfile();

  const [email, setEmail] = useState("—");
  const [notif, setNotif] = useState<NotifPrefs>(DEFAULT_NOTIF);
  const [showDelete, setShowDelete] = useState(false);

  /* load email */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "—");
    });
  }, []);

  /* load notif prefs */
  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as Partial<NotifPrefs>;
        setNotif({
          belajar: parsed.belajar ?? true,
          misi: parsed.misi ?? true,
          tips: parsed.tips ?? true,
        });
      } catch {
        /* ignore corrupt value, keep defaults */
      }
    });
  }, []);

  const updateNotif = (patch: Partial<NotifPrefs>) => {
    setNotif((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      return next;
    });
  };

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

  const confirmDelete = () => {
    // Real account deletion is out of scope — stub only.
    console.log("delete account");
    setShowDelete(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
          <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface }]}>
            Pengaturan
          </Text>
        </View>

        {/* ── Tampilan ── */}
        <Text style={[styles.sectionHeader, { color: colors.onSurface }]}>
          Tampilan
        </Text>
        <SegmentedControl
          value={MODE_TO_KEY[mode]}
          onValueChange={(key) => setMode(KEY_TO_MODE[key as keyof typeof KEY_TO_MODE])}
          options={[
            { key: "terang", label: "Terang" },
            { key: "gelap", label: "Gelap" },
            { key: "sistem", label: "Sistem" },
          ]}
        />

        {/* ── Akun ── */}
        <Text style={[styles.sectionHeader, { color: colors.onSurface }]}>
          Akun
        </Text>
        <SettingRow
          icon="account-edit-outline"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Nama Tampilan"
          sublabel={profile.display_name}
          onPress={() => router.push("/settings/account/name")}
        />
        <SettingRow
          icon="at"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Nama Pengguna"
          sublabel={`@${profile.username}`}
          onPress={() => router.push("/settings/account/username")}
        />
        <SettingRow
          icon="email-outline"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Email"
          sublabel={email}
          onPress={() => router.push("/settings/account/email")}
        />
        <SettingRow
          icon="camera-outline"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Ubah Foto Profil"
          onPress={() => router.push("/settings/account/username")}
        />

        {/* ── Notifikasi ── */}
        <Text style={[styles.sectionHeader, { color: colors.onSurface }]}>
          Notifikasi
        </Text>
        <SettingRow
          icon="bell-outline"
          bgKey="secondaryContainer"
          colorKey="onSecondaryContainer"
          label="Pengingat Belajar"
          right={{
            type: "switch",
            value: notif.belajar,
            onValueChange: (v) => updateNotif({ belajar: v }),
            accessibilityLabel: "Pengingat Belajar",
          }}
        />
        <SettingRow
          icon="calendar-check-outline"
          bgKey="secondaryContainer"
          colorKey="onSecondaryContainer"
          label="Misi Harian"
          right={{
            type: "switch",
            value: notif.misi,
            onValueChange: (v) => updateNotif({ misi: v }),
            accessibilityLabel: "Misi Harian",
          }}
        />
        <SettingRow
          icon="shield-check-outline"
          bgKey="secondaryContainer"
          colorKey="onSecondaryContainer"
          label="Tips Keamanan"
          right={{
            type: "switch",
            value: notif.tips,
            onValueChange: (v) => updateNotif({ tips: v }),
            accessibilityLabel: "Tips Keamanan",
          }}
        />

        {/* ── Privasi & Keamanan ── */}
        <Text style={[styles.sectionHeader, { color: colors.onSurface }]}>
          Privasi &amp; Keamanan
        </Text>
        <SettingRow
          icon="lock-reset"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Ubah Kata Sandi"
          onPress={() => router.push("/settings/password")}
        />
        <SettingRow
          icon="database-cog-outline"
          bgKey="secondaryContainer"
          colorKey="onSecondaryContainer"
          label="Kelola Data Saya"
          onPress={() => router.push("/settings/data")}
        />
        <SettingRow
          icon="account-remove"
          bgKey="errorContainer"
          colorKey="error"
          labelColorKey="error"
          label="Hapus Akun"
          onPress={() => setShowDelete(true)}
        />

        {/* ── Lainnya ── */}
        <Text style={[styles.sectionHeader, { color: colors.onSurface }]}>
          Lainnya
        </Text>
        <SettingRow
          icon="lifebuoy"
          bgKey="successContainer"
          colorKey="onSuccessContainer"
          label="Pusat Bantuan"
          onPress={() => router.push("/help")}
        />
        <SettingRow
          icon="information-outline"
          bgKey="tertiaryContainer"
          colorKey="onTertiaryContainer"
          label="Tentang Aplikasi"
          sublabel={"Versi " + (Constants.expoConfig?.version ?? "1.0.0")}
        />
        <SettingRow
          icon="file-document-outline"
          bgKey="primaryContainer"
          colorKey="onPrimaryContainer"
          label="Kebijakan Privasi"
          onPress={() => router.push("/help")}
        />

        {/* ── Keluar ── */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: colors.errorContainer, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
          <Text style={[TYPOGRAPHY.bodyLg, { color: colors.error, fontWeight: "600" }]}>
            Keluar
          </Text>
        </Pressable>
      </ScrollView>

      {/* ── Delete account confirmation modal ── */}
      <RNModal visible={showDelete} transparent animationType="fade">
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.scrim }]}
          onPress={() => setShowDelete(false)}
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
              Hapus Akun
            </Text>
            <Pressable
              style={[
                styles.modalOption,
                { backgroundColor: colors.errorContainer, borderRadius: RADIUS.sm },
              ]}
              onPress={confirmDelete}
            >
              <Text style={[TYPOGRAPHY.labelLg, { color: colors.error }]}>
                Hapus Akun
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalOption,
                {
                  backgroundColor: colors.surfaceContainerHigh,
                  borderRadius: RADIUS.sm,
                },
              ]}
              onPress={() => setShowDelete(false)}
            >
              <Text style={[TYPOGRAPHY.labelLg, { color: colors.onSurfaceVariant }]}>
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
const styles = {
  center: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  scroll: {
    padding: LAYOUT.screenPadding,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: LAYOUT.touchTarget,
    height: LAYOUT.touchTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  sectionHeader: {
    ...TYPOGRAPHY.titleMd,
    fontWeight: "600" as const,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  rowBase: {
    width: "100%" as const,
    maxWidth: 372,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  rowText: {
    flex: 1,
    justifyContent: "center" as const,
  },
  logoutBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: SPACING.sm,
    height: 52,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalContent: {
    width: "80%" as const,
    maxWidth: 320,
    padding: LAYOUT.screenPadding,
    gap: SPACING.sm,
  },
  modalOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    height: 48,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
};
