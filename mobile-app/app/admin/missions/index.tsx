import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Card, Button, TextInput, Chip, IconButton } from "react-native-paper";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber" },
  { id: "privasi_data", label: "Privasi Data" },
  { id: "etika_digital", label: "Etika Digital" },
];

const MISSION_TYPES = [
  { id: "quiz", label: "Quiz" },
  { id: "learning", label: "Learning" },
  { id: "simulation", label: "Simulation" },
  { id: "daily_checkin", label: "Daily Check-in" },
  { id: "special", label: "Special" },
];

export default function AdminMissionsScreen() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [missionType, setMissionType] = useState("quiz");
  const [xpReward, setXpReward] = useState("30");
  const [requirement, setRequirement] = useState("1");

  const fetchMissions = async () => {
    setLoading(true);
    const { data } = await supabase.from("missions").select("*").order("created_at", { ascending: false });
    setMissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMissions(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory(""); setMissionType("quiz");
    setXpReward("30"); setRequirement("1"); setEditingId(null); setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title); setDescription(item.description || ""); setCategory(item.category);
    setMissionType(item.mission_type || "quiz"); setXpReward(String(item.xp_reward));
    setRequirement(String(item.requirement_count || 1)); setEditingId(item.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !category) {
      Alert.alert("Error", "Judul dan kategori wajib diisi");
      return;
    }
    const payload = {
      title: title.trim(), description: description.trim(), category, mission_type: missionType,
      xp_reward: parseInt(xpReward) || 30, requirement_count: parseInt(requirement) || 1,
      is_active: true, sort_order: missions.length + 1,
    };
    if (editingId) {
      await supabase.from("missions").update(payload).eq("id", editingId);
    } else {
      await supabase.from("missions").insert(payload);
    }
    resetForm();
    fetchMissions();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus", "Yakin hapus misi ini?", [
      { text: "Batal" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        await supabase.from("missions").delete().eq("id", id);
        fetchMissions();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Kelola Misi</Text>
        <Button mode="contained" icon="plus" onPress={() => { resetForm(); setShowForm(!showForm); }}>
          Tambah Misi
        </Button>
      </View>

      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>{editingId ? "Edit Misi" : "Tambah Misi Baru"}</Text>
            <TextInput label="Judul Misi" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
            <TextInput label="Deskripsi" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
            <Text variant="labelMedium" style={{ marginBottom: 8 }}>Kategori</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <Chip key={cat.id} selected={category === cat.id} onPress={() => setCategory(cat.id)}
                  style={[styles.chip, category === cat.id && styles.chipSelected]}>{cat.label}</Chip>
              ))}
            </View>
            <Text variant="labelMedium" style={{ marginBottom: 8 }}>Tipe Misi</Text>
            <View style={styles.chipRow}>
              {MISSION_TYPES.map((t) => (
                <Chip key={t.id} selected={missionType === t.id} onPress={() => setMissionType(t.id)}
                  style={[styles.chip, missionType === t.id && styles.chipSelected]}>{t.label}</Chip>
              ))}
            </View>
            <View style={styles.row}>
              <TextInput label="XP Reward" value={xpReward} onChangeText={setXpReward} mode="outlined" keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
              <TextInput label="Requirement Count" value={requirement} onChangeText={setRequirement} mode="outlined" keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
            </View>
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
          data={missions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.listCard}>
              <Card.Content style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: "bold" }}>{item.title}</Text>
                  <Text variant="bodySmall" style={{ color: "#767680" }}>{item.category} · {item.mission_type} · {item.xp_reward} XP</Text>
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
