import { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Chip, ProgressBar, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useMissions } from "@/hooks/useMissions";

const catColors: Record<string, string> = {
  keamanan_siber: "#3e4bbe",
  privasi_data: "#744cb0",
  etika_digital: "#1d6f3c",
};

export default function MissionsScreen() {
  const router = useRouter();
  const { missions, loading, refetch } = useMissions();

  useEffect(() => { refetch(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Misi</Text>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/mission/${item.id}`)}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Chip
                  compact
                  style={{ backgroundColor: (catColors[item.category] || "#3e4bbe") + "20" }}
                  textStyle={{ color: catColors[item.category] || "#3e4bbe", fontSize: 11 }}
                >
                  {item.category.replace("_", " ")}
                </Chip>
                <Chip compact style={{ backgroundColor: "#10b98120" }} textStyle={{ color: "#10b981", fontSize: 11 }}>
                  +{item.xp_reward} XP
                </Chip>
              </View>
              <Text variant="titleSmall" style={{ marginTop: 8 }}>{item.title}</Text>
              {item.description && <Text variant="bodySmall" style={{ color: "#767680", marginTop: 4 }}>{item.description}</Text>}
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { padding: 16, paddingBottom: 0, fontWeight: "bold" },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: "row", gap: 8 },
});
