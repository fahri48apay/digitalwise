import { View, StyleSheet } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface MissionCardProps {
  id: string;
  title: string;
  description: string | null;
  category: string;
  xpReward: number;
  difficulty: string;
  isCompleted?: boolean;
  onPress: () => void;
}

const catColors: Record<string, string> = {
  keamanan_siber: "#3e4bbe",
  privasi_data: "#744cb0",
  etika_digital: "#1d6f3c",
};

const diffBadge: Record<string, { label: string; color: string }> = {
  easy: { label: "Mudah", color: "#10b981" },
  medium: { label: "Sedang", color: "#f59e0b" },
  hard: { label: "Sulit", color: "#ef4444" },
};

export function MissionCard({
  title,
  description,
  category,
  xpReward,
  difficulty,
  isCompleted,
  onPress,
}: MissionCardProps) {
  const catColor = catColors[category] || "#3e4bbe";
  const diff = diffBadge[difficulty] || diffBadge.easy;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.dot, { backgroundColor: catColor }]} />
            <Text variant="titleSmall">{title}</Text>
          </View>
          {isCompleted && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
        </View>
        {description && <Text variant="bodySmall" style={styles.desc}>{description}</Text>}
        <View style={styles.chips}>
          <Chip compact style={[styles.chip, { backgroundColor: "#3e4bbe20" }]} textStyle={{ color: "#3e4bbe", fontSize: 11 }}>
            +{xpReward} XP
          </Chip>
          <Chip compact style={[styles.chip, { backgroundColor: diff.color + "20" }]} textStyle={{ color: diff.color, fontSize: 11 }}>
            {diff.label}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  desc: { color: "#767680", marginTop: 4, marginLeft: 16 },
  chips: { flexDirection: "row", gap: 8, marginTop: 8, marginLeft: 16 },
  chip: { height: 28 },
});
