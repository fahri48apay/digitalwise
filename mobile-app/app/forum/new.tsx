import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useForum } from "@/hooks/useForum";
import { useUpload } from "@/hooks/useUpload";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwCard, DwInput, DwButton } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber" },
  { id: "privasi_data", label: "Privasi Data" },
  { id: "etika_digital", label: "Etika Digital" },
  { id: "general", label: "Umum" },
];

const POST_TYPES = [
  { id: "question", label: "Pertanyaan", icon: "help-circle-outline" as const },
  { id: "challenge", label: "Tantangan", icon: "flash-outline" as const },
  { id: "poll", label: "Polling", icon: "bar-chart" as const },
];

const categoryColorMap: Record<string, string> = {
  keamanan_siber: "error",
  privasi_data: "primary",
  etika_digital: "tertiary",
  general: "outline",
};

export default function NewPostScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { profile } = useProfile();
  const { createPost } = useForum();
  const { pickImage, takePhoto, upload, loading: uploading } = useUpload();

  const [postType, setPostType] = useState("question");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result && !result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await takePhoto();
    if (result && !result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  async function handleSubmit() {
    if (!profile || !category || !title.trim() || !content.trim()) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    setSubmitting(true);
    let attachmentUrl: string | undefined;

    if (image) {
      const uploaded = await upload(image, profile.id, "forum");
      if (uploaded) attachmentUrl = uploaded.url;
    }

    const { error } = await createPost({
      author_id: profile.id,
      post_type: postType,
      title: title.trim(),
      content: content.trim(),
      category,
      attachment_url: attachmentUrl,
    });
    setSubmitting(false);

    if (error) {
      Alert.alert("Error", "Gagal membuat postingan");
    } else {
      router.back();
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainer }]}
          accessibilityLabel="Kembali"
        >
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface }]}>
          Buat Postingan
        </Text>
      </View>

      <DwCard style={styles.card}>
        {/* Post type chips */}
        <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant, marginBottom: SPACING.sm }]}>
          Tipe
        </Text>
        <View style={styles.chipRow}>
          {POST_TYPES.map((type) => {
            const active = postType === type.id;
            return (
              <Pressable
                key={type.id}
                onPress={() => setPostType(type.id)}
                style={[
                  styles.chip,
                  {
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: active ? colors.primaryContainer : "transparent",
                    borderWidth: 1,
                    borderColor: active ? colors.primary : colors.outline,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: SPACING.lg,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Ionicons
                  name={type.icon}
                  size={16}
                  color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
                  style={{ marginRight: SPACING.xs }}
                />
                <Text
                  style={[
                    TYPOGRAPHY.labelMd,
                    { color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant },
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category chips */}
        <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant, marginBottom: SPACING.sm }]}>
          Kategori
        </Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => {
            const active = category === cat.id;
            const colorKey = categoryColorMap[cat.id] as keyof typeof colors;
            const catColor = colors[colorKey] || colors.outline;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.chip,
                  {
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: active ? `${catColor}20` : "transparent",
                    borderWidth: 1,
                    borderColor: active ? catColor : colors.outline,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: SPACING.lg,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    TYPOGRAPHY.labelMd,
                    { color: active ? catColor : colors.onSurfaceVariant },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Title input */}
        <DwInput
          label="Judul"
          value={title}
          onChangeText={setTitle}
          containerStyle={{ marginTop: SPACING.md }}
        />

        {/* Content input */}
        <DwInput
          label="Isi postingan"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          containerStyle={{ marginTop: SPACING.md }}
        />

        {/* Attachment section */}
        <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant, marginTop: SPACING.md, marginBottom: SPACING.sm }]}>
          Lampiran (opsional)
        </Text>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <Pressable
              onPress={() => setImage(null)}
              style={[styles.removeBtn, { backgroundColor: colors.surface }]}
              accessibilityLabel="Hapus gambar"
            >
              <Ionicons name="close-circle" size={20} color={colors.error} />
            </Pressable>
          </View>
        )}
        <View style={styles.uploadBtns}>
          <Pressable
            onPress={handlePickImage}
            style={[styles.uploadBtn, { borderColor: colors.outline }]}
          >
            <Ionicons name="image-outline" size={18} color={colors.primary} />
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary, marginLeft: SPACING.xs }]}>
              Galeri
            </Text>
          </Pressable>
          <Pressable
            onPress={handleTakePhoto}
            style={[styles.uploadBtn, { borderColor: colors.outline }]}
          >
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.primary, marginLeft: SPACING.xs }]}>
              Kamera
            </Text>
          </Pressable>
        </View>
      </DwCard>

      {/* Submit button */}
      <View style={styles.submitWrap}>
        <DwButton
          label="Publikasikan"
          onPress={handleSubmit}
          loading={submitting || uploading}
          disabled={submitting || uploading || !category || !title.trim() || !content.trim()}
          fullWidth
          style={{ borderRadius: 22, height: 48 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {},
  imageContainer: { position: "relative", marginBottom: SPACING.md, alignSelf: "flex-start" },
  image: { width: 120, height: 120, borderRadius: RADIUS.sm },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    borderRadius: 12,
  },
  uploadBtns: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  submitWrap: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
});
