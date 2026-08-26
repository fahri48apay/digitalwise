import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Card, Button, FAB, TextInput, Chip, IconButton } from "react-native-paper";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber" },
  { id: "privasi_data", label: "Privasi Data" },
  { id: "etika_digital", label: "Etika Digital" },
];

export default function AdminQuizzesScreen() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [xpReward, setXpReward] = useState("20");

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    setQuizzes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory(""); setDifficulty("easy");
    setXpReward("20"); setEditingId(null); setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title); setDescription(item.description || ""); setCategory(item.category);
    setDifficulty(item.difficulty || "easy"); setXpReward(String(item.xp_reward));
    setEditingId(item.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !category) {
      Alert.alert("Error", "Judul dan kategori wajib diisi");
      return;
    }
    const payload = {
      title: title.trim(), description: description.trim(), category, difficulty,
      xp_reward: parseInt(xpReward) || 20, is_active: true,
    };
    if (editingId) {
      await supabase.from("quizzes").update(payload).eq("id", editingId);
    } else {
      await supabase.from("quizzes").insert(payload);
    }
    resetForm();
    fetchQuizzes();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus", "Yakin hapus quiz ini?", [
      { text: "Batal" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        await supabase.from("quizzes").delete().eq("id", id);
        fetchQuizzes();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Kelola Quiz</Text>
        <Button mode="contained" icon="plus" onPress={() => { resetForm(); setShowForm(!showForm); }}>
          Tambah Quiz
        </Button>
      </View>

      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>{editingId ? "Edit Quiz" : "Tambah Quiz Baru"}</Text>
            <TextInput label="Judul Quiz" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
            <TextInput label="Deskripsi" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
            <Text variant="labelMedium" style={{ marginBottom: 8 }}>Kategori</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <Chip key={cat.id} selected={category === cat.id} onPress={() => setCategory(cat.id)}
                  style={[styles.chip, category === cat.id && styles.chipSelected]}>{cat.label}</Chip>
              ))}
            </View>
            <Text variant="labelMedium" style={{ marginBottom: 8 }}>Difficulty</Text>
            <View style={styles.chipRow}>
              {[{ id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }].map((d) => (
                <Chip key={d.id} selected={difficulty === d.id} onPress={() => setDifficulty(d.id)}
                  style={[styles.chip, difficulty === d.id && styles.chipSelected]}>{d.label}</Chip>
              ))}
            </View>
            <TextInput label="XP Reward" value={xpReward} onChangeText={setXpReward} mode="outlined" keyboardType="numeric" style={styles.input} />
            <View style={styles.formActions}>
              <Button mode="outlined" onPress={resetForm}>Batal</Button>
              <Button mode="contained" onPress={handleSave}>{editingId ? "Update" : "Simpan"}</Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 32 }}>Memuat...</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.listCard}>
              <Card.Content style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: "bold" }}>{item.title}</Text>
                  <Text variant="bodySmall" style={{ color: "#767680" }}>{item.category} · {item.difficulty} · {item.xp_reward} XP</Text>
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
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 },
  listCard: { marginBottom: 8 },
  listContent: { flexDirection: "row", alignItems: "center" },
  actions: { flexDirection: "row" },
});
