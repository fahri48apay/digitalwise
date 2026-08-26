import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Card, Chip, Button, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForum } from "@/hooks/useForum";

const categoryLabels: Record<string, string> = {
  keamanan_siber: "Keamanan Siber",
  privasi_data: "Privasi Data",
  etika_digital: "Etika Digital",
  general: "Umum",
};

const categoryColors: Record<string, string> = {
  keamanan_siber: "#ef4444",
  privasi_data: "#3b82f6",
  etika_digital: "#8b5cf6",
  general: "#767680",
};

const postTypeIcons: Record<string, string> = {
  question: "help-circle",
  challenge: "flash",
  poll: "bar-chart",
};

export default function ForumScreen() {
  const router = useRouter();
  const { getPosts, loading } = useForum();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPosts = async (category?: string) => {
    const data = await getPosts(category || undefined);
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    fetchPosts(cat || undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>Forum Diskusi</Text>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={[{ id: null, label: "Semua" }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label }))]}
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

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchPosts(selectedCategory || undefined)} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const catColor = categoryColors[item.category] || "#767680";
          const typeIcon = postTypeIcons[item.post_type] || "chatbubble";
          return (
            <Card style={[styles.card, item.is_pinned && styles.cardPinned]} onPress={() => router.push(`/forum/${item.id}`)}>
              <Card.Content>
                <View style={styles.cardMeta}>
                  <Ionicons name={typeIcon as any} size={16} color={catColor} />
                  <Chip compact style={{ backgroundColor: catColor + "20" }}>
                    <Text style={{ color: catColor, fontSize: 10 }}>{categoryLabels[item.category] || item.category}</Text>
                  </Chip>
                  {item.is_pinned && <Chip compact style={{ backgroundColor: "#f59e0b20" }}><Text style={{ color: "#f59e0b", fontSize: 10 }}>Pinned</Text></Chip>}
                </View>
                <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: 8 }} numberOfLines={2}>{item.title}</Text>
                <Text variant="bodySmall" style={{ color: "#767680", marginTop: 4 }} numberOfLines={2}>{item.content}</Text>
                <View style={styles.cardFooter}>
                  <Text variant="labelSmall" style={{ color: "#767680" }}>
                    {item.profiles?.display_name || "Anonim"}
                  </Text>
                  <View style={styles.stats}>
                    <Ionicons name="heart-outline" size={14} color="#767680" />
                    <Text variant="labelSmall" style={{ color: "#767680" }}>{item.likes_count}</Text>
                    <Ionicons name="chatbubble-outline" size={14} color="#767680" />
                    <Text variant="labelSmall" style={{ color: "#767680" }}>{item.comment_count}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color="#76768080" />
            <Text variant="bodyLarge" style={{ color: "#767680", marginTop: 12 }}>Belum ada postingan</Text>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => router.push("/forum/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  header: { padding: 16, paddingBottom: 8 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 12 },
  filterChip: { marginRight: 8 },
  card: { marginBottom: 12 },
  cardPinned: { borderColor: "#f59e0b", borderWidth: 1 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  stats: { flexDirection: "row", alignItems: "center", gap: 4 },
  empty: { alignItems: "center", paddingTop: 64 },
  fab: { position: "absolute", right: 16, bottom: 16, backgroundColor: "#3e4bbe" },
});
