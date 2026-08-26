import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Text, Card, Button, TextInput, Chip, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useForum } from "@/hooks/useForum";
import { useUpload } from "@/hooks/useUpload";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber", color: "#ef4444" },
  { id: "privasi_data", label: "Privasi Data", color: "#3b82f6" },
  { id: "etika_digital", label: "Etika Digital", color: "#8b5cf6" },
  { id: "general", label: "Umum", color: "#767680" },
];

const POST_TYPES = [
  { id: "question", label: "Pertanyaan", icon: "help-circle" },
  { id: "challenge", label: "Tantangan", icon: "flash" },
  { id: "poll", label: "Polling", icon: "bar-chart" },
];

export default function NewPostScreen() {
  const router = useRouter();
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
      Alert.alert("Berhasil!", "Postingan kamu sudah dipublikasikan", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Buat Postingan</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Post Type */}
          <Text variant="labelLarge" style={styles.label}>Tipe</Text>
          <View style={styles.chipRow}>
            {POST_TYPES.map((type) => (
              <Chip
                key={type.id}
                selected={postType === type.id}
                onPress={() => setPostType(type.id)}
                icon={type.icon as any}
                style={[styles.chip, postType === type.id && styles.chipSelected]}
              >
                {type.label}
              </Chip>
            ))}
          </View>

          {/* Category */}
          <Text variant="labelLarge" style={styles.label}>Kategori</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.chip, category === cat.id && { backgroundColor: cat.color + "20" }]}
                textStyle={category === cat.id ? { color: cat.color } : undefined}
              >
                {cat.label}
              </Chip>
            ))}
          </View>

          {/* Title */}
          <TextInput
            label="Judul"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          {/* Content */}
          <TextInput
            label="Isi postingan"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
          />

          {/* Screenshot Upload */}
          <Text variant="labelLarge" style={styles.label}>Lampiran (opsional)</Text>
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <IconButton
                icon="close-circle"
                size={20}
                iconColor="#ef4444"
                style={styles.removeBtn}
                onPress={() => setImage(null)}
              />
            </View>
          )}
          <View style={styles.uploadBtns}>
            <Button mode="outlined" icon="image" onPress={handlePickImage} compact>
              Galeri
            </Button>
            <Button mode="outlined" icon="camera" onPress={handleTakePhoto} compact>
              Kamera
            </Button>
          </View>

          {/* Submit */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting || uploading}
            disabled={submitting || uploading || !category || !title.trim() || !content.trim()}
            style={styles.submitBtn}
          >
            Publikasikan
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  header: { padding: 16, paddingBottom: 8 },
  card: { marginHorizontal: 16, marginBottom: 12 },
  label: { marginBottom: 8, marginTop: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { marginBottom: 4 },
  chipSelected: { backgroundColor: "#3e4bbe20" },
  input: { marginBottom: 12 },
  imageContainer: { position: "relative", marginBottom: 12, alignSelf: "flex-start" },
  image: { width: 120, height: 120, borderRadius: 8 },
  removeBtn: { position: "absolute", top: -8, right: -8, backgroundColor: "#fff" },
  uploadBtns: { flexDirection: "row", gap: 8, marginBottom: 12 },
  submitBtn: { marginTop: 8 },
});
