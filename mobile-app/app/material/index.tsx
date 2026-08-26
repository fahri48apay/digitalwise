import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMaterials } from "@/hooks/useMaterials";
import { CATEGORIES } from "@/lib/constants";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content_type: string;
  thumbnail_url: string | null;
  xp_reward: number;
  duration_min: number;
  sort_order: number;
}

export default function MaterialsScreen() {
  const router = useRouter();
  const { getMaterials, loading } = useMaterials();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchMaterials = async (category?: string) => {
    const data = await getMaterials(category || undefined);
    setMaterials(data);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    fetchMaterials(catId || undefined);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video": return "play-circle";
      case "article": return "document-text";
      case "infographic": return "image";
      case "interactive": return "touchpad";
      default: return "book";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Materi Belajar</Text>
        <Text variant="bodyMedium" style={{ color: "#767680" }}>Pelajari literasi digital sambil earn XP</Text>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={[{ id: null, label: "Semua" }, ...CATEGORIES]}
        keyExtractor={(item) => item.id ?? "all"}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.id}
            onPress={() => handleCategorySelect(item.id)}
            style={styles.filterChip}
          >
            {item.label}
          </Chip>
        )}
      />

      {/* Materials List */}
      <FlatList
        data={materials}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchMaterials(selectedCategory || undefined)} />}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          return (
            <Card style={styles.card} onPress={() => router.push(`/material/${item.id}`)}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Ionicons name={getContentTypeIcon(item.content_type) as any} size={20} color={cat?.color || "#3e4bbe"} />
                  <Chip compact style={{ backgroundColor: (cat?.color || "#3e4bbe") + "20" }}>
                    <Text style={{ color: cat?.color || "#3e4bbe", fontSize: 11 }}>{cat?.label || item.category}</Text>
                  </Chip>
                </View>
                <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: 8 }}>{item.title}</Text>
                {item.description && (
                  <Text variant="bodySmall" style={{ color: "#767680", marginTop: 4 }} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <View style={styles.cardFooter}>
                  <Text variant="labelSmall" style={{ color: "#3e4bbe" }}>{item.xp_reward} XP</Text>
                  <Text variant="labelSmall" style={{ color: "#767680" }}>{item.duration_min} menit</Text>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={48} color="#76768080" />
            <Text variant="bodyLarge" style={{ color: "#767680", marginTop: 12 }}>Belum ada materi</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  header: { padding: 16, paddingBottom: 8 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 12 },
  filterChip: { marginRight: 8 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  empty: { alignItems: "center", paddingTop: 64 },
});
