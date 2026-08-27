import { View, StyleSheet } from "react-native";
import { Text, Card, Button, RadioButton } from "react-native-paper";
import { COLORS } from "@/lib/constants";

interface QuizCardProps {
  sender: string;
  senderMeta: string;
  body: string;
  question: string;
  options: string[];
  onSelect: (index: number) => void;
  selectedIndex?: number;
  showResult?: boolean;
  correctIndex?: number;
}

export function QuizCard({
  sender,
  senderMeta,
  body,
  question,
  options,
  onSelect,
  selectedIndex,
  showResult,
  correctIndex,
}: QuizCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelMedium">{sender}</Text>
        <Text variant="labelSmall" style={styles.meta}>{senderMeta}</Text>

        <Card style={styles.bodyCard}>
          <Card.Content>
            <Text variant="bodyMedium">{body}</Text>
          </Card.Content>
        </Card>

        <Text variant="titleSmall" style={styles.question}>{question}</Text>

        <RadioButton.Group
          onValueChange={(v) => onSelect(parseInt(v))}
          value={selectedIndex !== undefined ? String(selectedIndex) : ""}
        >
          {options.map((opt, i) => (
            <Card
              key={i}
              style={[
                styles.option,
                showResult && i === correctIndex && styles.correct,
                showResult && selectedIndex === i && i !== correctIndex && styles.wrong,
              ]}
            >
              <Card.Content>
                <RadioButton.Item label={opt} value={String(i)} disabled={showResult} />
              </Card.Content>
            </Card>
          ))}
        </RadioButton.Group>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  meta: { color: COLORS.outline },
  bodyCard: { marginTop: 12, backgroundColor: COLORS.surfaceContainer },
  question: { marginTop: 16, marginBottom: 8 },
  option: { marginBottom: 8 },
  correct: { backgroundColor: `${COLORS.success}20` },
  wrong: { backgroundColor: `${COLORS.error}20` },
});
