import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ProgressBar, RadioButton } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuizStore } from "@/stores/quizStore";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useXP } from "@/hooks/useXP";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getQuiz } = useQuizzes();
  const { claimXP } = useXP();
  const { questions, currentIndex, answers, isFinished, score, startQuiz, answerQuestion, nextQuestion, finishQuiz, resetQuiz } = useQuizStore();

  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => { loadQuiz(); }, [id]);

  async function loadQuiz() {
    if (!id) return;
    const quiz = await getQuiz(id);
    if (quiz) startQuiz(quiz.id, quiz.questions);
  }

  const q = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  function handleSelect(value: string) {
    if (showResult) return;
    setSelected(value);
    const idx = parseInt(value);
    answerQuestion(q.id, idx);
    setShowResult(true);
  }

  async function handleNext() {
    if (currentIndex < questions.length - 1) {
      nextQuestion();
      setSelected(null);
      setShowResult(false);
    } else {
      const result = finishQuiz();
      const xp = Math.round(result.score * 20);
      setXpEarned(xp);
      await claimXP(xp, "quiz", id);
    }
  }

  function handleRetry() {
    resetQuiz();
    setSelected(null);
    setShowResult(false);
    setXpEarned(0);
    loadQuiz();
  }

  if (isFinished) {
    return (
      <View style={styles.center}>
        <Card style={styles.resultCard}>
          <Card.Content style={styles.resultContent}>
            <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
              {score === questions.length ? "Sempurna!" : score >= questions.length / 2 ? "Bagus!" : "Coba Lagi"}
            </Text>
            <Text variant="titleLarge">{score}/{questions.length}</Text>
            <Text style={{ color: "#3e4bbe", fontWeight: "bold" }}>+{xpEarned} XP</Text>
            <Button mode="contained" onPress={handleRetry}>Coba Lagi</Button>
            <Button mode="text" onPress={() => router.back()}>Kembali</Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!q) {
    return <View style={styles.center}><Text>Memuat quiz...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <ProgressBar progress={progress / 100} color="#3e4bbe" style={{ margin: 16 }} />
      <Text variant="labelMedium" style={{ textAlign: "center", marginBottom: 16 }}>
        Soal {currentIndex + 1} dari {questions.length}
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="labelMedium">{q.sender}</Text>
          <Text variant="labelSmall" style={{ color: "#767680" }}>{q.senderMeta}</Text>
          <Card style={{ marginTop: 12, backgroundColor: "#f0ecf4" }}>
            <Card.Content><Text variant="bodyMedium">{q.body}</Text></Card.Content>
          </Card>
          <Text variant="titleSmall" style={{ marginTop: 16, marginBottom: 8 }}>{q.question}</Text>

          <RadioButton.Group onValueChange={handleSelect} value={selected ?? ""}>
            {q.options.map((opt, i) => (
              <Card key={i} style={[
                styles.optionCard,
                showResult && i === q.correctIndex && styles.correctOption,
                showResult && selected === String(i) && i !== q.correctIndex && styles.wrongOption,
              ]}>
                <Card.Content>
                  <RadioButton.Item label={opt} value={String(i)} disabled={showResult} />
                </Card.Content>
              </Card>
            ))}
          </RadioButton.Group>

          {showResult && (
            <View style={styles.explanation}>
              <Text variant="labelMedium" style={{ marginBottom: 4 }}>Penjelasan:</Text>
              {q.explanation.map((text: string, i: number) => (
                <Text key={i} variant="bodySmall" style={{ marginBottom: 2 }}>• {text}</Text>
              ))}
            </View>
          )}

          {showResult && (
            <Button mode="contained" onPress={handleNext} style={{ marginTop: 16 }}>
              {currentIndex < questions.length - 1 ? "Selanjutnya" : "Lihat Hasil"}
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fbf8fe", padding: 24 },
  card: { marginHorizontal: 16, marginBottom: 16 },
  optionCard: { marginBottom: 8 },
  correctOption: { backgroundColor: "#10b98120" },
  wrongOption: { backgroundColor: "#ef444420" },
  explanation: { marginTop: 16, padding: 12, backgroundColor: "#3e4bbe10", borderRadius: 8 },
  resultCard: { width: "100%", maxWidth: 320 },
  resultContent: { alignItems: "center", gap: 16, padding: 8 },
});
