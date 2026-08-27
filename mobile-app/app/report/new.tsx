import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useProfile } from "@/hooks/useProfile";
import { useReports } from "@/hooks/useReports";
import { useUpload } from "@/hooks/useUpload";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwButton } from "@/components/ui/Button";
import { DwCard } from "@/components/ui/Card";
import { DwInput } from "@/components/ui/Input";
import { DwChip } from "@/components/ui/Chip";
import { DwIcon } from "@/components/ui/Icon";
import { SPACING, RADIUS, TYPOGRAPHY } from "@/lib/constants";

const CATEGORIES = [
  { id: "phishing", label: "Phishing" },
  { id: "cyberbullying", label: "Cyberbullying" },
  { id: "account_hijack", label: "Pembajakan Akun" },
  { id: "data_leak", label: "Kebocoran Data" },
  { id: "malware", label: "Malware" },
  { id: "online_scam", label: "Penipuan Online" },
  { id: "other", label: "Lainnya" },
];

const TIPS = [
  "Sertakan detail sejelas mungkin",
  "Lampirkan screenshot jika ada (maks 3 gambar)",
  "Laporan akan ditinjau oleh admin",
  "Identitas kamu dirahasiakan",
];

export default function NewReportScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { profile } = useProfile();
  const { submitReport, loading } = useReports();
  const { pickImage, takePhoto, upload, loading: uploading } = useUpload();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handlePickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Maksimal 3 gambar");
      return;
    }
    const result = await pickImage();
    if (result && !result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleTakePhoto = async () => {
    if (images.length >= 3) {
      Alert.alert("Maksimal 3 gambar");
      return;
    }
    const result = await takePhoto();
    if (result && !result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadMultiple = async (uris: string[], userId: string, folder: string) => {
    const results: { url: string }[] = [];
    for (const uri of uris) {
      const result = await upload(uri, userId, folder);
      if (result) results.push({ url: result.url });
    }
    return results;
  };

  async function handleSubmit() {
    if (!profile || !category || !title.trim() || !description.trim()) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    let evidenceUrls: string[] = [];
    if (images.length > 0) {
      const uploaded = await uploadMultiple(images, profile.id, "reports");
      evidenceUrls = uploaded.map((u) => u.url);
    }

    const { error } = await submitReport(
      { category, title: title.trim(), description: description.trim(), evidence_urls: evidenceUrls },
      profile.id
    );

    if (error) {
      Alert.alert("Error", "Gagal mengirim laporan");
    } else {
      router.back();
    }
  }

  const isSubmitting = loading || uploading;
  const canSubmit = category && title.trim() && description.trim();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Top Bar ───────────────────────────────────── */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
          hitSlop={8}
        >
          <DwIcon name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, fontWeight: "700" }]}>
          Lapor & Bantuan
        </Text>
      </View>

      {/* ── Form Card ─────────────────────────────────── */}
      <DwCard style={styles.formCard}>
        {/* Category */}
        <Text style={[TYPOGRAPHY.labelLg, { color: colors.onSurface, marginBottom: SPACING.sm }]}>
          Kategori
        </Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <Pressable key={cat.id} onPress={() => setCategory(cat.id)}>
                <DwChip
                  label={cat.label}
                  color={isSelected ? colors.onSecondaryContainer : colors.onSurfaceVariant}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected
                        ? colors.secondaryContainer
                        : "transparent",
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Title */}
        <DwInput
          label="Judul Laporan"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Description */}
        <DwInput
          label="Deskripsi Kejadian"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ height: 120, textAlignVertical: "top" }}
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Screenshot Upload */}
        <Text style={[TYPOGRAPHY.labelLg, { color: colors.onSurface, marginBottom: SPACING.sm }]}>
          Bukti Screenshot (opsional)
        </Text>
        <View style={styles.imageRow}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable
                onPress={() => removeImage(index)}
                style={[styles.removeBtn, { backgroundColor: colors.surface }]}
                accessibilityLabel="Hapus gambar"
              >
                <DwIcon name="close-circle" size={20} color={colors.error} />
              </Pressable>
            </View>
          ))}
        </View>
        <View style={styles.uploadBtns}>
          <DwButton
            label="Galeri"
            variant="outlined"
            onPress={handlePickImage}
            icon={<DwIcon name="image" size={18} color={colors.primary} />}
            style={{ height: 40, borderRadius: RADIUS.sm }}
          />
          <DwButton
            label="Kamera"
            variant="outlined"
            onPress={handleTakePhoto}
            icon={<DwIcon name="camera" size={18} color={colors.primary} />}
            style={{ height: 40, borderRadius: RADIUS.sm }}
          />
        </View>

        {/* Submit */}
        <DwButton
          label="Kirim Laporan"
          variant="filled"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !canSubmit}
          style={{ height: 48, borderRadius: 22, marginTop: SPACING.sm }}
        />
      </DwCard>

      {/* ── Info Card ─────────────────────────────────── */}
      <DwCard style={[styles.infoCard, { backgroundColor: colors.successContainer }]}>
        <View style={styles.infoHeader}>
          <DwIcon name="information-outline" size={18} color={colors.onSuccessContainer} />
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              { color: colors.onSuccessContainer, marginLeft: SPACING.xs },
            ]}
          >
            Tips Melapor:
          </Text>
        </View>
        {TIPS.map((tip, i) => (
          <Text
            key={i}
            style={[
              styles.tipText,
              { fontFamily: TYPOGRAPHY.labelMd.fontFamily, fontSize: 12, lineHeight: 16, fontWeight: "400", color: colors.onSuccessContainer },
            ]}
          >
            {"\u2022 "}{tip}
          </Text>
        ))}
      </DwCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  formCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    height: 36,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xs,
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    borderRadius: RADIUS.full,
  },
  uploadBtns: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  tipText: {
    marginBottom: SPACING.xs,
  },
});
