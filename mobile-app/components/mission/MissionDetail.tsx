import { View, StyleSheet } from "react-native";
import { Text, Card, Button, Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface MissionDetailProps {
  title: string;
  description: string | null;
  category: string;
  xpReward: number;
  difficulty: string;
  missionType: string;
  onStart: () => void;
  isCompleted?: boolean;
}

const typeLabels: Record<string, string> = {
  quiz: "Quiz",
  learning: "Belajar",
  simulation: "Simulasi",
  daily_checkin: "Check-in Harian",
  special: "Khusus",
};

export function MissionDetail({
  title,
  description,
  category,
  xpReward,
  difficulty,
  missionType,
  onStart,
  isCompleted,
}: MissionDetailProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Chip compact>{typeLabels[missionType] || missionType}</Chip>
          <Chip compact style={styles.xpChip} textStyle={styles.xpText}>+{xpReward} XP</Chip>
        </View>

        <Text variant="headlineSmall" style={styles.title}>{title}</Text>
        {description && <Text variant="bodyMedium" style={styles.desc}>{description}</Text>}

        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="bar-chart" size={14} color="#767680" />
            <Text variant="labelSmall" style={styles.infoText}>{difficulty}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="folder" size={14} color="#767680" />
            <Text variant="labelSmall" style={styles.infoText}>{category.replace("_", " ")}</Text>
          </View>
        </View>

        <Button mode="contained" onPress={onStart} disabled={isCompleted} style={styles.btn}>
          {isCompleted ? "Selesai ✓" : "Mulai Misi"}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  xpChip: { backgroundColor: "#10b98120" },
  xpText: { color: "#10b981" },
  title: { fontWeight: "bold", marginBottom: 8 },
  desc: { color: "#767680", marginBottom: 16 },
  info: { flexDirection: "row", gap: 16, marginBottom: 16 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoText: { color: "#767680" },
  btn: { marginTop: 8 },
});
