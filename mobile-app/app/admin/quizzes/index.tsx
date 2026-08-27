import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Modal as RNModal,
  Pressable,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DwButton, DwCard, DwInput } from "@/components/ui";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "keamanan_siber", label: "Keamanan Siber" },
  { id: "privasi_data", label: "Privasi Data" },
  { id: "etika_digital", label: "Etika Digital" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export default function AdminQuizzesScreen() {
  const { colors } = useAppTheme();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [xpReward, setXpReward] = useState("20");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });
    setQuizzes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setDifficulty("easy");
    setXpReward("20");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setDifficulty(item.difficulty || "easy");
    setXpReward(String(item.xp_reward));
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !category) {
      Alert.alert("Error", "Judul dan kategori wajib diisi");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      xp_reward: parseInt(xpReward) || 20,
      is_active: true,
    };
    if (editingId) {
      await supabase.from("quizzes").update(payload).eq("id", editingId);
    } else {
      await supabase.from("quizzes").insert(payload);
    }
    resetForm();
    fetchQuizzes();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("quizzes").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchQuizzes();
  };

  // ── Selectable chip (not built into DwChip, which is display-only) ──
  const SelectableChip = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectChip,
        {
          backgroundColor: selected
            ? colors.secondaryContainer
            : colors.surfaceContainerHigh,
        },
      ]}
    >
      <Text
        style={[
          TYPOGRAPHY.labelMd,
          { color: selected ? colors.onSecondaryContainer : colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Delete Confirm Modal ── */}
      <RNModal visible={!!deleteId} transparent animationType="fade">
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.scrim }]}
          onPress={() => setDeleteId(null)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surfaceContainer, borderRadius: RADIUS.md },
            ]}
          >
            <Text style={[TYPOGRAPHY.titleMd, { fontWeight: "700", marginBottom: SPACING.sm }]}>
              Hapus Quiz?
            </Text>
            <Text style={[TYPOGRAPHY.bodyMd, { marginBottom: SPACING.xl, color: colors.outline }]}>
              Tindakan ini tidak dapat dibatalkan.
            </Text>
            <View style={styles.formActions}>
              <DwButton label="Batal" variant="outlined" onPress={() => setDeleteId(null)} />
              <DwButton label="Hapus" variant="filled" onPress={confirmDelete} />
            </View>
          </View>
        </Pressable>
      </RNModal>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.titleLg, { fontWeight: "700", color: colors.onSurface }]}>
          Kelola Quiz
        </Text>
        <DwButton
          label="Tambah Quiz"
          variant="filled"
          onPress={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          style={styles.addButton}
        />
      </View>

      {/* ── Form Card ── */}
      {showForm && (
        <DwCard variant="filled" style={styles.formCard}>
          <Text
            style={[TYPOGRAPHY.titleMd, { marginBottom: SPACING.md, color: colors.onSurface }]}
          >
            {editingId ? "Edit Quiz" : "Tambah Quiz Baru"}
          </Text>

          <DwInput
            label="Judul Quiz"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputField}
          />
          <DwInput
            label="Deskripsi"
            value={description}
            onChangeText={setDescription}
            multiline
            containerStyle={styles.inputField}
          />

          <Text
            style={[
              TYPOGRAPHY.labelMd,
              { marginBottom: SPACING.sm, color: colors.onSurfaceVariant },
            ]}
          >
            Kategori
          </Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <SelectableChip
                key={cat.id}
                label={cat.label}
                selected={category === cat.id}
                onPress={() => setCategory(cat.id)}
              />
            ))}
          </View>

          <Text
            style={[
              TYPOGRAPHY.labelMd,
              { marginBottom: SPACING.sm, color: colors.onSurfaceVariant },
            ]}
          >
            Difficulty
          </Text>
          <View style={styles.chipRow}>
            {DIFFICULTIES.map((d) => (
              <SelectableChip
                key={d.id}
                label={d.label}
                selected={difficulty === d.id}
                onPress={() => setDifficulty(d.id)}
              />
            ))}
          </View>

          <DwInput
            label="XP Reward"
            value={xpReward}
            onChangeText={setXpReward}
            keyboardType="numeric"
            containerStyle={styles.inputField}
          />

          <View style={styles.formActions}>
            <DwButton label="Batal" variant="outlined" onPress={resetForm} />
            <DwButton
              label={editingId ? "Update" : "Simpan"}
              variant="filled"
              onPress={handleSave}
            />
          </View>
        </DwCard>
      )}

      {/* ── Quiz List ── */}
      {loading ? (
        <Text
          style={[
            TYPOGRAPHY.bodyLg,
            { textAlign: "center", marginTop: SPACING.xxxxl, color: colors.outline },
          ]}
        >
          Memuat...
        </Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DwCard variant="filled" style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: RADIUS.sm, marginBottom: SPACING.sm }}>
              <View style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[TYPOGRAPHY.labelLg, { fontWeight: "700", color: colors.onSurface }]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[TYPOGRAPHY.labelSm, { color: colors.outline, marginTop: 2 }]}>
                    {item.category} · {item.difficulty} · {item.xp_reward} XP
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleEdit(item)}
                    style={styles.iconBtn}
                    accessibilityLabel="Edit quiz"
                  >
                    <MaterialCommunityIcons name="pencil" size={20} color={colors.onSurfaceVariant} />
                  </Pressable>
                  <Pressable
                    onPress={() => setDeleteId(item.id)}
                    style={styles.iconBtn}
                    accessibilityLabel="Hapus quiz"
                  >
                    <MaterialCommunityIcons name="trash" size={20} color={colors.error} />
                  </Pressable>
                </View>
              </View>
            </DwCard>
          )}
          contentContainerStyle={{ paddingBottom: SPACING.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  addButton: {
    alignSelf: "auto",
    height: 44,
    paddingHorizontal: SPACING.lg,
  },
  formCard: { marginBottom: SPACING.lg },
  inputField: { marginBottom: SPACING.md },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.md },
  selectChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    alignSelf: "flex-start",
  },
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: SPACING.sm, marginTop: SPACING.md },
  listContent: { flexDirection: "row", alignItems: "center" },
  actions: { flexDirection: "row" },
  iconBtn: { padding: SPACING.sm },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContent: { padding: SPACING.xxl, width: "80%", maxWidth: 320 },
});
