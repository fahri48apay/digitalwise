import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuizStore } from "@/stores/quizStore";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useXP } from "@/hooks/useXP";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwButton } from "@/components/ui/Button";
import { DwCard } from "@/components/ui/Card";
import { DwIcon } from "@/components/ui/Icon";
import { DwAvatar } from "@/components/ui/Avatar";
import { SPACING, RADIUS, TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getQuiz } = useQuizzes();
  const { claimXP } = useXP();
  const {
    questions,
    currentIndex,
    answers,
    isFinished,
    score,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetQuiz,
  } = useQuizStore();
  const { colors } = useAppTheme();

  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  async function loadQuiz() {
    if (!id) return;
    const quiz = await getQuiz(id);
    if (quiz) startQuiz(quiz.id, quiz.questions);
  }

  const q = questions[currentIndex];
  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

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

  // ── Result Screen ──────────────────────────────────────────
  if (isFinished) {
    const message =
      score === questions.length
        ? "Sempurna!"
        : score >= questions.length / 2
          ? "Bagus!"
          : "Coba Lagi";

    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <DwCard variant="elevated" style={styles.resultCard}>
          <View style={styles.resultContent}>
            <Text
              style={[TYPOGRAPHY.headlineMd, { color: colors.onSurface }]}
            >
              {message}
            </Text>
            <Text
              style={[TYPOGRAPHY.displayLg, { color: colors.primary }]}
            >
              {score}/{questions.length}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.titleLg,
                { color: colors.tertiary, fontWeight: "bold" },
              ]}
            >
              +{xpEarned} XP
            </Text>

            <View style={styles.resultActions}>
              <DwButton label="Coba Lagi" onPress={handleRetry} />
              <DwButton
                label="Kembali"
                variant="outlined"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </DwCard>
      </View>
    );
  }

  // ── Loading ────────────────────────────────────────────────
  if (!q) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>
          Memuat quiz...
        </Text>
      </View>
    );
  }

  // ── Main Quiz Screen ───────────────────────────────────────
  const isAnswered = answers.some((a) => a.questionId === q.id);
  const currentAnswer = answers.find((a) => a.questionId === q.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { width: LAYOUT.touchTarget, height: LAYOUT.touchTarget },
          ]}
          hitSlop={8}
          accessibilityLabel="Kembali"
        >
          <DwIcon name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress */}
        <View style={styles.progressSection}>
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              { color: colors.onSurfaceVariant, textAlign: "center" },
            ]}
          >
            Soal {currentIndex + 1} dari {questions.length}
          </Text>
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: colors.surfaceContainerHighest,
                borderRadius: 4,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                },
              ]}
            />
          </View>
        </View>

        {/* Email Card */}
        <DwCard style={styles.emailCard}>
          {/* Sender */}
          <View style={styles.senderRow}>
            <DwAvatar name={q.sender} size={36} />
            <View style={styles.senderInfo}>
              <Text
                style={[TYPOGRAPHY.labelLg, { color: colors.onSurface }]}
              >
                {q.sender}
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.labelSm,
                  { color: colors.onSurfaceVariant, fontWeight: "400" },
                ]}
              >
                {q.senderMeta}
              </Text>
            </View>
          </View>

          {/* Subject */}
          <Text
            style={[
              TYPOGRAPHY.titleMd,
              { color: colors.onSurface, marginTop: SPACING.md },
            ]}
          >
            {q.question}
          </Text>

          {/* Body */}
          <DwCard
            variant="filled"
            style={[
              styles.emailBody,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderRadius: RADIUS.sm,
                marginTop: SPACING.md,
              },
            ]}
          >
            <Text
              style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}
            >
              {q.body}
            </Text>
          </DwCard>
        </DwCard>

        {/* Answer Options */}
        {q.options.map((opt, i) => {
          let bg = colors.surfaceContainerLow;
          let border = colors.outlineVariant;
          let textColor = colors.onSurface;
          let icon: string | null = null;
          let iconColor = colors.onSurface;

          if (isAnswered && currentAnswer) {
            if (i === q.correctIndex) {
              bg = colors.successContainer;
              border = colors.success;
              icon = "check-circle";
              iconColor = colors.success;
            } else if (
              i === currentAnswer.selectedIndex &&
              !currentAnswer.isCorrect
            ) {
              bg = colors.errorContainer;
              border = colors.error;
              icon = "close-circle";
              iconColor = colors.error;
            }
          } else if (selected === String(i)) {
            bg = colors.primaryContainer;
            border = colors.primary;
          }

          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(String(i))}
              disabled={isAnswered}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  height: 56,
                  borderRadius: RADIUS.sm,
                  borderWidth: 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected === String(i), disabled: isAnswered }}
              accessibilityLabel={`${LETTERS[i]}. ${opt}`}
            >
              {/* Letter circle */}
              <View
                style={[
                  styles.letterCircle,
                  {
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isAnswered && i === q.correctIndex
                      ? colors.success
                      : isAnswered && i === currentAnswer?.selectedIndex && !currentAnswer?.isCorrect
                        ? colors.error
                        : selected === String(i)
                          ? colors.primary
                          : colors.surfaceContainerHighest,
                  },
                ]}
              >
                <Text
                  style={[
                    TYPOGRAPHY.labelSm,
                    {
                      color: isAnswered && i === q.correctIndex
                        ? colors.onSuccess
                        : isAnswered && i === currentAnswer?.selectedIndex && !currentAnswer?.isCorrect
                          ? colors.onError
                          : selected === String(i)
                            ? colors.onPrimary
                            : colors.onSurfaceVariant,
                      fontWeight: "600",
                      fontSize: 12,
                    },
                  ]}
                >
                  {LETTERS[i]}
                </Text>
              </View>

              {/* Option text */}
              <Text
                style={[
                  TYPOGRAPHY.bodyMd,
                  {
                    color: textColor,
                    flex: 1,
                    marginLeft: SPACING.md,
                  },
                ]}
                numberOfLines={2}
              >
                {opt}
              </Text>

              {/* Result icon */}
              {icon && (
                <DwIcon name={icon as any} size={20} color={iconColor} />
              )}
            </Pressable>
          );
        })}

        {/* Explanation */}
        {isAnswered && (
          <View
            style={[
              styles.explanation,
              {
                backgroundColor: colors.surfaceContainer,
                borderRadius: RADIUS.sm,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
                marginTop: SPACING.lg,
              },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.labelMd,
                { color: colors.onSurface, marginBottom: SPACING.xs },
              ]}
            >
              Penjelasan:
            </Text>
            {q.explanation.map((text: string, i: number) => (
              <Text
                key={i}
                style={[
                  TYPOGRAPHY.bodyMd,
                  {
                    color: colors.onSurfaceVariant,
                    marginBottom: SPACING.xs,
                  },
                ]}
              >
                {"\u2022"} {text}
              </Text>
            ))}
          </View>
        )}

        {/* Next / Lihat Hasil */}
        {isAnswered && (
          <View style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}>
            <DwButton
              label={
                currentIndex < questions.length - 1
                  ? "Selanjutnya"
                  : "Lihat Hasil"
              }
              onPress={handleNext}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xxl,
  },
  topBar: {
    paddingTop: LAYOUT.statusBarHeight,
    paddingHorizontal: SPACING.sm,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  progressSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  progressTrack: {
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
  },
  emailCard: {
    marginBottom: SPACING.lg,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  emailBody: {
    padding: SPACING.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  letterCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  explanation: {
    padding: SPACING.md,
  },
  resultCard: {
    width: "100%",
    maxWidth: 320,
  },
  resultContent: {
    alignItems: "center",
    gap: SPACING.lg,
    padding: SPACING.sm,
  },
  resultActions: {
    width: "100%",
    gap: SPACING.sm,
  },
});
