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
import { DwButton, DwCard, DwInput, DwChip, DwIcon } from "@/components/ui";
import { useAppTheme } from "@/providers/ThemeProvider";
import { SPACING, RADIUS, TYPOGRAPHY } from "@/lib/constants";
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
  const { colors } = useAppTheme();

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

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("missions")
      .select("*")
      .order("created_at", { ascending: false });
    setMissions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setMissionType("quiz");
    setXpReward("30");
    setRequirement("1");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setMissionType(item.mission_type || "quiz");
    setXpReward(String(item.xp_reward));
    setRequirement(String(item.requirement_count || 1));
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
      mission_type: missionType,
      xp_reward: parseInt(xpReward) || 30,
      requirement_count: parseInt(requirement) || 1,
      is_active: true,
      sort_order: missions.length + 1,
    };
    if (editingId) {
      await supabase.from("missions").update(payload).eq("id", editingId);
    } else {
      await supabase.from("missions").insert(payload);
    }
    resetForm();
    fetchMissions();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("missions").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchMissions();
  };

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {/* Delete Confirm Modal */}
      <RNModal visible={!!deleteId} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteId(null)}
        >
          <Pressable>
            <DwCard variant="outlined" style={styles.modalContent}>
              <Text
                style={[
                  TYPOGRAPHY.titleMd,
                  { fontWeight: "bold", marginBottom: SPACING.sm, color: colors.onSurface },
                ]}
              >
                Hapus Misi?
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.bodyMd,
                  { marginBottom: SPACING.xxl, color: colors.outline },
                ]}
              >
                Tindakan ini tidak dapat dibatalkan.
              </Text>
              <View style={styles.formActions}>
                <DwButton
                  label="Batal"
                  variant="text"
                  onPress={() => setDeleteId(null)}
                  fullWidth={false}
                />
                <DwButton
                  label="Hapus"
                  variant="filled"
                  onPress={confirmDelete}
                  fullWidth={false}
                  style={{ backgroundColor: colors.error }}
                />
              </View>
            </DwCard>
          </Pressable>
        </Pressable>
      </RNModal>

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            TYPOGRAPHY.titleLg,
            { fontWeight: "700", color: colors.onSurface },
          ]}
        >
          Kelola Misi
        </Text>
        <DwButton
          label="Tambah Misi"
          variant="filled"
          onPress={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          fullWidth={false}
          icon={<DwIcon name="plus" size={18} color={colors.onPrimary} />}
        />
      </View>

      {/* Form */}
      {showForm && (
        <DwCard variant="filled" style={styles.formCard}>
          <Text
            style={[
              TYPOGRAPHY.titleMd,
              { marginBottom: SPACING.md, color: colors.onSurface },
            ]}
          >
            {editingId ? "Edit Misi" : "Tambah Misi Baru"}
          </Text>

          <DwInput
            label="Judul Misi"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.input}
          />
          <DwInput
            label="Deskripsi"
            value={description}
            onChangeText={setDescription}
            multiline
            containerStyle={styles.input}
          />

          <Text
            style={[
              TYPOGRAPHY.labelLg,
              { marginBottom: SPACING.sm, color: colors.onSurfaceVariant },
            ]}
          >
            Kategori
          </Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <Pressable key={cat.id} onPress={() => setCategory(cat.id)}>
                <DwChip
                  label={cat.label}
                  color={category === cat.id ? colors.primary : undefined}
                />
              </Pressable>
            ))}
          </View>

          <Text
            style={[
              TYPOGRAPHY.labelLg,
              { marginBottom: SPACING.sm, marginTop: SPACING.xs, color: colors.onSurfaceVariant },
            ]}
          >
            Tipe Misi
          </Text>
          <View style={styles.chipRow}>
            {MISSION_TYPES.map((t) => (
              <Pressable key={t.id} onPress={() => setMissionType(t.id)}>
                <DwChip
                  label={t.label}
                  color={missionType === t.id ? colors.primary : undefined}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <DwInput
                label="XP Reward"
                value={xpReward}
                onChangeText={setXpReward}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <DwInput
                label="Requirement Count"
                value={requirement}
                onChangeText={setRequirement}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formActions}>
            <DwButton
              label="Batal"
              variant="outlined"
              onPress={resetForm}
              fullWidth={false}
            />
            <DwButton
              label={editingId ? "Update" : "Simpan"}
              variant="filled"
              onPress={handleSave}
              fullWidth={false}
            />
          </View>
        </DwCard>
      )}

      {/* List */}
      {loading ? (
        <Text
          style={[
            TYPOGRAPHY.bodyLg,
            { textAlign: "center", marginTop: SPACING.xxxl, color: colors.outline },
          ]}
        >
          Memuat...
        </Text>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DwCard variant="filled" style={styles.listCard}>
              <View style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      TYPOGRAPHY.titleMd,
                      { fontWeight: "bold", color: colors.onSurface },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      TYPOGRAPHY.bodyMd,
                      { color: colors.outline, marginTop: SPACING.xs },
                    ]}
                  >
                    {item.category} · {item.mission_type} · {item.xp_reward} XP
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleEdit(item)}
                    style={styles.iconBtn}
                    accessibilityLabel="Edit misi"
                  >
                    <DwIcon name="pencil" size={20} />
                  </Pressable>
                  <Pressable
                    onPress={() => setDeleteId(item.id)}
                    style={styles.iconBtn}
                    accessibilityLabel="Hapus misi"
                  >
                    <DwIcon name="trash" size={20} color={colors.error} />
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

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: SPACING.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    formCard: {
      marginBottom: SPACING.lg,
      backgroundColor: colors.surfaceContainer,
      borderRadius: RADIUS.md,
    },
    input: {
      marginBottom: SPACING.md,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    row: {
      flexDirection: "row",
      gap: SPACING.md,
    },
    formActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    listCard: {
      marginBottom: SPACING.sm,
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: RADIUS.sm,
    },
    listContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    actions: {
      flexDirection: "row",
    },
    iconBtn: {
      padding: SPACING.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.scrim,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      borderRadius: RADIUS.md,
      padding: SPACING.xxl,
      width: "80%",
      maxWidth: 320,
    },
  });
}
