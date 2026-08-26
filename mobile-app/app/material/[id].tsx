import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, Chip } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMaterials } from "@/hooks/useMaterials";
import { useProfile } from "@/hooks/useProfile";
import { CATEGORIES } from "@/lib/constants";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
  key_takeaways: string[] | null;
  xp_reward: number;
  duration_min: number;
}

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMaterial, getProgress, markComplete } = useMaterials();
  const { profile } = useProfile();
  const [material, setMaterial] = useState<Material | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await getMaterial(id);
      setMaterial(data);
      if (profile && data) {
        const prog = await getProgress(profile.id, data.id);
        setCompleted(prog?.completed ?? false);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    if (!profile || !material) return;
    if (completed) {
      Alert.alert("Sudah selesai", "Kamu sudah menyelesaikan materi ini");
      return;
    }
    await markComplete(profile.id, material.id, material.xp_reward);
    setCompleted(true);
    Alert.alert("Selesai!", `Kamu mendapatkan ${material.xp_reward} XP`);
  };

  if (loading) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  if (!material) {
    return <View style={styles.center}><Text>Materi tidak ditemukan</Text></View>;
  }

  const cat = CATEGORIES.find(c => c.id === material.category);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.meta}>
          <Ionicons name={material.content_type === "video" ? "play-circle" : "document-text"} size={20} color={cat?.color || "#3e4bbe"} />
          <Chip compact style={{ backgroundColor: (cat?.color || "#3e4bbe") + "20" }}>
            <Text style={{ color: cat?.color || "#3e4bbe", fontSize: 11 }}>{cat?.label || material.category}</Text>
          </Chip>
          <Text variant="labelSmall" style={{ color: "#767680" }}>{material.duration_min} menit</Text>
          <Text variant="labelSmall" style={{ color: "#3e4bbe" }}>{material.xp_reward} XP</Text>
        </View>
        <Text variant="headlineSmall" style={{ fontWeight: "bold", marginTop: 12 }}>{material.title}</Text>
        {material.description && (
          <Text variant="bodyMedium" style={{ color: "#767680", marginTop: 8 }}>{material.description}</Text>
        )}
      </View>

      {/* Video (if available) */}
      {material.video_url && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelLarge">Video</Text>
            <Text variant="bodySmall" style={{ color: "#3e4bbe", marginTop: 4 }}>{material.video_url}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Key Takeaways */}
      {material.key_takeaways && material.key_takeaways.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleSmall" style={{ marginBottom: 12 }}>Poin Penting</Text>
            {material.key_takeaways.map((point, i) => (
              <View key={i} style={styles.takeaway}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text variant="bodyMedium" style={{ flex: 1 }}>{point}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Complete Button */}
      <View style={{ padding: 16 }}>
        <Button
          mode={completed ? "outlined" : "contained"}
          onPress={handleComplete}
          icon={completed ? "checkmark" : "school"}
          style={{ paddingVertical: 4 }}
        >
          {completed ? "Sudah Selesai" : "Tandai Selesai"}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 16 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  card: { marginHorizontal: 16, marginBottom: 12 },
  takeaway: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
});
