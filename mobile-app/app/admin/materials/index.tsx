import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert, useWindowDimensions } from "react-native";
import { Text, Card, Button, FAB, TextInput, Chip, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber" },
  { id: "privasi_data", label: "Privasi Data" },
  { id: "etika_digital", label: "Etika Digital" },
];

export default function AdminMaterialsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [xpReward, setXpReward] = useState("10");
  const [durationMin, setDurationMin] = useState("5");

  const fetchMaterials = async () => {
    setLoading(true);
    const { data } = await supabase.from("learning_materials").select("*").order("created_at", { ascending: false });
    setMaterials(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory(""); setVideoUrl("");
    setXpReward("10"); setDurationMin("5"); setEditingId(null); setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title); setDescription(item.description || ""); setCategory(item.category);
    setVideoUrl(item.video_url || ""); setXpReward(String(item.xp_reward));
    setDurationMin(String(item.duration_min)); setEditingId(item.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !category) {
      Alert.alert("Error", "Judul dan kategori wajib diisi");
      return;
    }
    const payload = {
      title: title.trim(), description: description.trim(), category,
      video_url: videoUrl.trim() || null, xp_reward: parseInt(xpReward) || 10,
      duration_min: parseInt(durationMin) || 5, content_type: videoUrl ? "video" : "article",
      is_active: true, sort_order: materials.length + 1,
    };
    if (editingId) {
      await supabase.from("learning_materials").update(payload).eq("id", editingId);
    } else {
      await supabase.from("learning_materials").insert(payload);
    }
    resetForm();
    fetchMaterials();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus", "Yakin hapus materi ini?", [
      { text: "Batal" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        await supabase.from("learning_materials").delete().eq("id", id);
        fetchMaterials();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Kelola Materi</Text>
        <Button mode="contained" icon="plus" onPress={() => { resetForm(); setShowForm(!showForm); }}>
          Tambah Materi
        </Button>
      </View>

      {/* Form */}
      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>{editingId ? "Edit Materi" : "Tambah Materi Baru"}</Text>
            <TextInput label="Judul" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
            <TextInput label="Deskripsi" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
            <Text variant="labelMedium" style={{ marginBottom: 8 }}>Kategori</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <Chip key={cat.id} selected={category === cat.id} onPress={() => setCategory(cat.id)}
                  style={[styles.chip, category === cat.id && styles.chipSelected]}>{cat.label}</Chip>
              ))}
            </View>
            <TextInput label="Video URL (opsional)" value={videoUrl} onChangeText={setVideoUrl} mode="outlined" style={styles.input} />
            <View style={styles.row}>
              <TextInput label="XP Reward" value={xpReward} onChangeText={setXpReward} mode="outlined" keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
              <TextInput label="Durasi (menit)" value={durationMin} onChangeText={setDurationMin} mode="outlined" keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
            </View>
            <View style={styles.formActions}>
              <Button mode="outlined" onPress={resetForm}>Batal</Button>
              <Button mode="contained" onPress={handleSave}>{editingId ? "Update" : "Simpan"}</Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 32 }}>Memuat...</Text>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.listCard}>
              <Card.Content style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: "bold" }}>{item.title}</Text>
                  <Text variant="bodySmall" style={{ color: "#767680" }}>{item.category} · {item.xp_reward} XP · {item.duration_min} menit</Text>
                </View>
                <View style={styles.actions}>
                  <IconButton icon="pencil" size={20} onPress={() => handleEdit(item)} />
                  <IconButton icon="trash" size={20} iconColor="#ef4444" onPress={() => handleDelete(item.id)} />
                </View>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  formCard: { marginBottom: 16, backgroundColor: "#fff" },
  input: { marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { marginBottom: 4 },
  chipSelected: { backgroundColor: "#3e4bbe20" },
  row: { flexDirection: "row", gap: 12 },
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 },
  listCard: { marginBottom: 8 },
  listContent: { flexDirection: "row", alignItems: "center" },
  actions: { flexDirection: "row" },
});
