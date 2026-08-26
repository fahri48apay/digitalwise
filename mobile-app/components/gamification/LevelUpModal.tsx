import { View, StyleSheet, Modal } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LEVELS } from "@/lib/constants";

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpModal({ visible, newLevel, onDismiss }: LevelUpModalProps) {
  const level = LEVELS.find((l) => l.level === newLevel);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <View style={styles.iconBox}>
              <Text style={styles.emoji}>🎉</Text>
            </View>
            <Text variant="headlineSmall" style={styles.title}>Level Up!</Text>
            <Text variant="titleLarge" style={styles.level}>Level {newLevel}</Text>
            <Text variant="bodyMedium" style={styles.levelTitle}>{level?.title}</Text>
            <Button mode="contained" onPress={onDismiss} style={styles.btn}>Mantap!</Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 320 },
  content: { alignItems: "center", gap: 12, padding: 16 },
  iconBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#3e4bbe", justifyContent: "center", alignItems: "center" },
  emoji: { fontSize: 48 },
  title: { fontWeight: "bold" },
  level: { color: "#3e4bbe", fontWeight: "bold" },
  levelTitle: { color: "#767680" },
  btn: { marginTop: 12, width: "100%" },
});
