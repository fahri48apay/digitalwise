import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Text, Card, Button, TextInput, Chip, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";
import { useReports } from "@/hooks/useReports";
import { useUpload } from "@/hooks/useUpload";

const CATEGORIES = [
  { id: "phishing", label: "Phishing" },
  { id: "cyberbullying", label: "Cyberbullying" },
  { id: "account_hijack", label: "Pembajakan Akun" },
  { id: "data_leak", label: "Kebocoran Data" },
  { id: "malware", label: "Malware" },
  { id: "online_scam", label: "Penipuan Online" },
  { id: "other", label: "Lainnya" },
];

export default function NewReportScreen() {
  const router = useRouter();
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

  async function handleSubmit() {
    if (!profile || !category || !title.trim() || !description.trim()) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    // Upload images if any
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
      Alert.alert("Berhasil!", "Laporan kamu sudah dikirim", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }

  const uploadMultiple = async (uris: string[], userId: string, folder: string) => {
    const results: { url: string }[] = [];
    for (const uri of uris) {
      const result = await upload(uri, userId, folder);
      if (result) results.push({ url: result.url });
    }
    return results;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Lapor Insiden</Text>
        <Text variant="bodyMedium" style={{ color: "#767680" }}>
          Laporkan insiden keamanan siber yang kamu alami
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Category */}
          <Text variant="labelLarge" style={styles.label}>Kategori</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.chip, category === cat.id && styles.chipSelected]}
                textStyle={category === cat.id ? styles.chipTextSelected : undefined}
              >
                {cat.label}
              </Chip>
            ))}
          </View>

          {/* Title */}
          <TextInput
            label="Judul Laporan"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          {/* Description */}
          <TextInput
            label="Deskripsi Kejadian"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
          />

          {/* Screenshot Upload */}
          <Text variant="labelLarge" style={styles.label}>Bukti Screenshot (opsional)</Text>
          <View style={styles.imageRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <IconButton
                  icon="close-circle"
                  size={20}
                  iconColor="#ef4444"
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                />
              </View>
            ))}
          </View>
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
            loading={loading || uploading}
            disabled={loading || uploading || !category || !title.trim() || !description.trim()}
            style={styles.submitBtn}
          >
            Kirim Laporan
          </Button>
        </Card.Content>
      </Card>

      {/* Info */}
      <Card style={[styles.card, { backgroundColor: "#3e4bbe10" }]}>
        <Card.Content>
          <Text variant="labelMedium" style={{ marginBottom: 4 }}>Tips Melapor:</Text>
          <Text variant="bodySmall" style={{ color: "#767680" }}>
            • Sertakan detail sejelas mungkin{"\n"}
            • Lampirkan screenshot jika ada (maks 3 gambar){"\n"}
            • Laporan akan ditinjau oleh admin{"\n"}
            • Identitas kamu dirahasiakan
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  header: { padding: 16, paddingBottom: 8 },
  card: { marginHorizontal: 16, marginBottom: 12 },
  label: { marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { marginBottom: 4 },
  chipSelected: { backgroundColor: "#3e4bbe20" },
  chipTextSelected: { color: "#3e4bbe" },
  input: { marginBottom: 12 },
  imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  imageContainer: { position: "relative" },
  image: { width: 80, height: 80, borderRadius: 8 },
  removeBtn: { position: "absolute", top: -8, right: -8, backgroundColor: "#fff" },
  uploadBtns: { flexDirection: "row", gap: 8, marginBottom: 12 },
  submitBtn: { marginTop: 8 },
});
