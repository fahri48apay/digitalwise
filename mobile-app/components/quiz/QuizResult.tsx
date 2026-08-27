import { View, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/lib/constants";

interface QuizResultProps {
  score: number;
  total: number;
  xpEarned: number;
  isPerfect: boolean;
  onRetry: () => void;
  onBack: () => void;
}

export function QuizResult({
  score,
  total,
  xpEarned,
  isPerfect,
  onRetry,
  onBack,
}: QuizResultProps) {
  const pct = Math.round((score / total) * 100);
  const icon = isPerfect ? "trophy" : pct >= 60 ? "checkmark-circle" : "close-circle";
  const color = isPerfect ? COLORS.success : pct >= 60 ? COLORS.primary : COLORS.error;
  const title = isPerfect ? "Sempurna!" : pct >= 60 ? "Bagus!" : "Coba Lagi";

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={[styles.iconBox, { backgroundColor: color }]}>
            <Ionicons name={icon} size={40} color="#fff" />
          </View>

          <Text variant="headlineSmall" style={styles.title}>{title}</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {isPerfect
              ? "Kamu menjawab semua dengan benar!"
              : pct >= 60
              ? "Kamu sudah paham konsep dasarnya!"
              : "Belajar lagi ya, pasti bisa!"}
          </Text>

          <View style={styles.scoreRow}>
            <Text variant="labelLarge">{score}/{total}</Text>
            <Text variant="labelMedium" style={{ color: COLORS.outline }}>{pct}%</Text>
          </View>

          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xpEarned} XP</Text>
          </View>

          <View style={styles.actions}>
            <Button mode="contained" onPress={onRetry}>Coba Lagi</Button>
            <Button mode="text" onPress={onBack}>Kembali</Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background, padding: 24 },
  card: { width: "100%", maxWidth: 320 },
  content: { alignItems: "center", gap: 12, padding: 8 },
  iconBox: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center" },
  title: { fontWeight: "bold" },
  subtitle: { color: COLORS.outline, textAlign: "center" },
  scoreRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  xpBadge: { backgroundColor: `${COLORS.primary}20`, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  xpText: { color: COLORS.primary, fontWeight: "bold" },
  actions: { width: "100%", gap: 8 },
});
