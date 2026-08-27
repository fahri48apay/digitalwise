import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Modal as RNModal,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { DwButton, DwCard, DwInput, DwIcon } from "@/components/ui";
import { CATEGORIES, TYPOGRAPHY, SPACING } from "@/lib/constants";
import { useAppTheme } from "@/providers/ThemeProvider";
import { supabase } from "@/lib/supabase";

export default function AdminMaterialsScreen() {
  const { colors } = useAppTheme();
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

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("learning_materials")
      .select("*")
      .order("created_at", { ascending: false });
    setMaterials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setVideoUrl("");
    setXpReward("10");
    setDurationMin("5");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setVideoUrl(item.video_url || "");
    setXpReward(String(item.xp_reward));
    setDurationMin(String(item.duration_min));
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
      video_url: videoUrl.trim() || null,
      xp_reward: parseInt(xpReward) || 10,
      duration_min: parseInt(durationMin) || 5,
      content_type: videoUrl ? "video" : "article",
      is_active: true,
      sort_order: materials.length + 1,
    };
    if (editingId) {
      await supabase.from("learning_materials").update(payload).eq("id", editingId);
    } else {
      await supabase.from("learning_materials").insert(payload);
    }
    resetForm();
    fetchMaterials();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("learning_materials").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchMaterials();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Delete Confirm Modal */}
      <RNModal visible={!!deleteId} transparent animationType="fade">
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: colors.scrim }]}
          onPress={() => setDeleteId(null)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, marginBottom: SPACING.xs }]}
            >
              Hapus Materi?
            </Text>
            <Text
              style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant, marginBottom: SPACING.lg }]}
            >
              Tindakan ini tidak dapat dibatalkan.
            </Text>
            <View style={styles.formActions}>
              <DwButton
                label="Batal"
                variant="text"
                fullWidth={false}
                onPress={() => setDeleteId(null)}
              />
              <DwButton
                label="Hapus"
                variant="filled"
                fullWidth={false}
                style={{ backgroundColor: colors.error }}
                onPress={confirmDelete}
              />
            </View>
          </Pressable>
        </Pressable>
      </RNModal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface }]}>
          Kelola Materi
        </Text>
        <DwButton
          label="Tambah Materi"
          variant="filled"
          fullWidth={false}
          icon={<DwIcon name="plus" size={18} color={colors.onPrimary} />}
          onPress={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        />
      </View>

      {/* Form */}
      {showForm && (
        <DwCard style={styles.formCard}>
          <Text
            style={[TYPOGRAPHY.titleMd, { color: colors.onSurface, marginBottom: SPACING.md }]}
          >
            {editingId ? "Edit Materi" : "Tambah Materi Baru"}
          </Text>

          <DwInput
            label="Judul"
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
              TYPOGRAPHY.labelMd,
              { color: colors.onSurfaceVariant, marginBottom: SPACING.sm },
            ]}
          >
            Kategori
          </Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => {
              const selected = category === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={[
                    styles.chip,
                    {
                      height: 36,
                      borderRadius: 18,
                      paddingHorizontal: SPACING.md,
                      backgroundColor: selected
                        ? colors.secondaryContainer
                        : "transparent",
                      borderWidth: selected ? 0 : 1,
                      borderColor: colors.outline,
                    },
                  ]}
                >
                  <Text
                    style={[
                      TYPOGRAPHY.labelMd,
                      {
                        color: selected
                          ? colors.onSecondaryContainer
                          : colors.onSurface,
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <DwInput
            label="Video URL (opsional)"
            value={videoUrl}
            onChangeText={setVideoUrl}
            containerStyle={styles.input}
          />

          <View style={styles.row}>
            <DwInput
              label="XP Reward"
              value={xpReward}
              onChangeText={setXpReward}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            <DwInput
              label="Durasi (menit)"
              value={durationMin}
              onChangeText={setDurationMin}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
          </View>

          <View style={styles.formActions}>
            <DwButton
              label="Batal"
              variant="outlined"
              fullWidth={false}
              onPress={resetForm}
            />
            <DwButton
              label={editingId ? "Update" : "Simpan"}
              variant="filled"
              fullWidth={false}
              onPress={handleSave}
            />
          </View>
        </DwCard>
      )}

      {/* List */}
      {loading ? (
        <Text
          style={[
            TYPOGRAPHY.bodyMd,
            { color: colors.onSurfaceVariant, textAlign: "center", marginTop: SPACING.xxxl },
          ]}
        >
          Memuat...
        </Text>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DwCard style={[styles.listCard, { backgroundColor: colors.surfaceContainerLow }]}>
              <View style={styles.listContent}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[TYPOGRAPHY.labelLg, { color: colors.onSurface }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[TYPOGRAPHY.labelSm, { color: colors.onSurfaceVariant }]}
                  >
                    {item.category} · {item.xp_reward} XP · {item.duration_min} menit
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleEdit(item)}
                    style={styles.actionBtn}
                    accessibilityLabel="Edit materi"
                  >
                    <DwIcon name="pencil" size={20} />
                  </Pressable>
                  <Pressable
                    onPress={() => setDeleteId(item.id)}
                    style={styles.actionBtn}
                    accessibilityLabel="Hapus materi"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  chip: {
    alignItems: "center",
    justifyContent: "center",
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
  },
  listContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 320,
  },
});
