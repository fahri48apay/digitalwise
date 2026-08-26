# Fase 3: Quiz Engine + Misi + Level-up Celebration

> **For agentic workers:** Use `executing-plans` skill to implement this plan task-by-task.

**Goal:** Build the core gamification flow — quiz taking, mission completion, and level-up celebration — with real Supabase data.

**Architecture:** Quiz uses Zustand state machine (already built) + Supabase quiz_results. Missions use Supabase missions table + mission_completions. Level-up celebration is a modal triggered by claim_xp RPC.

**Tech Stack:** React Native, Expo Router, NativeWind, Zustand, Reanimated 3, Supabase

**Spec:** `~/digitalwise/supabase/001_initial_schema.sql` (DB schema), `~/digitalwise/tokens.css` (design tokens)

---

## File Structure

```
mobile-app/
├── components/
│   ├── quiz/
│   │   ├── QuizCard.tsx          # Single question card (sender, body, options)
│   │   └── QuizResult.tsx        # Result screen (score, XP earned, explanations)
│   ├── mission/
│   │   ├── MissionCard.tsx       # Mission list item
│   │   └── MissionDetail.tsx     # Mission detail + start button
│   └── gamification/
│       ├── LevelUpModal.tsx      # Celebration modal with animation
│       ├── XPBadge.tsx           # Animated XP counter
│       └── StreakBadge.tsx       # Streak fire icon + count
├── app/
│   ├── quiz/
│   │   └── [id].tsx              # Quiz flow (start → questions → result)
│   ├── mission/
│   │   └── [id].tsx              # Mission detail screen
│   └── (tabs)/
│       └── missions.tsx          # Updated: real missions list
```

---

## Task 1: Quiz Components

**Files:**
- Create: `components/quiz/QuizCard.tsx`
- Create: `components/quiz/QuizResult.tsx`
- Create: `components/quiz/index.ts`

**Interfaces:**
- Consumes: `QuizQuestion` type from `stores/quizStore.ts`
- Produces: `QuizCardProps`, `QuizResultProps`

- [ ] **Step 1: Create QuizCard component**

```tsx
// components/quiz/QuizCard.tsx
import { View, Text } from "react-native";
import { Card, Button } from "@/components/ui";

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
    <Card padding="lg" className="mb-4">
      {/* Sender info */}
      <View className="mb-3">
        <Text className="text-sm font-heading text-ink">{sender}</Text>
        <Text className="text-xs text-ink-secondary">{senderMeta}</Text>
      </View>

      {/* Message body */}
      <View className="bg-surface-container rounded-lg p-4 mb-4">
        <Text className="text-sm text-ink leading-5">{body}</Text>
      </View>

      {/* Question */}
      <Text className="text-sm font-heading text-ink mb-3">{question}</Text>

      {/* Options */}
      <View className="gap-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = showResult && index === correctIndex;
          const isWrong = showResult && isSelected && !isCorrect;

          return (
            <Button
              key={index}
              variant={isSelected ? "primary" : "outline"}
              size="md"
              label={option}
              disabled={showResult}
              onPress={() => onSelect(index)}
              className={isCorrect ? "bg-success" : isWrong ? "bg-error" : ""}
            />
          );
        })}
      </View>
    </Card>
  );
}
```

- [ ] **Step 2: Create QuizResult component**

```tsx
// components/quiz/QuizResult.tsx
import { View, Text } from "react-native";
import { Card, Button, Badge, ProgressBar } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

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
  const percentage = Math.round((score / total) * 100);

  return (
    <View className="flex-1 bg-surface items-center justify-center px-4">
      <Card padding="lg" className="w-full items-center">
        {/* Icon */}
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
          isPerfect ? "bg-success" : percentage >= 60 ? "bg-primary" : "bg-error"
        }`}>
          <Ionicons
            name={isPerfect ? "trophy" : percentage >= 60 ? "checkmark-circle" : "close-circle"}
            size={40}
            color="#ffffff"
          />
        </View>

        {/* Title */}
        <Text className="text-xl font-heading text-ink mb-2">
          {isPerfect ? "Sempurna!" : percentage >= 60 ? "Bagus!" : "Coba Lagi"}
        </Text>
        <Text className="text-sm text-ink-secondary text-center mb-4">
          {isPerfect
            ? "Kamu menjawab semua dengan benar!"
            : percentage >= 60
            ? "Kamu sudah paham konsep dasarnya!"
            : "Belajar lagi ya, pasti bisa!"}
        </Text>

        {/* Score */}
        <View className="flex-row items-center gap-2 mb-4">
          <Badge label={`${score}/${total}`} variant="primary" size="md" />
          <Badge label={`${percentage}%`} variant="muted" size="md" />
        </View>

        {/* XP Earned */}
        <View className="bg-primary/10 rounded-lg px-4 py-2 mb-6">
          <Text className="text-primary font-heading">+{xpEarned} XP</Text>
        </View>

        {/* Actions */}
        <View className="w-full gap-3">
          <Button label="Coba Lagi" variant="primary" onPress={onRetry} />
          <Button label="Kembali" variant="ghost" onPress={onBack} />
        </View>
      </Card>
    </View>
  );
}
```

- [ ] **Step 3: Create index export**

```tsx
// components/quiz/index.ts
export { QuizCard } from "./QuizCard";
export { QuizResult } from "./QuizResult";
```

- [ ] **Step 4: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds with no errors

---

## Task 2: Quiz Flow Screen

**Files:**
- Create: `app/quiz/[id].tsx`

**Interfaces:**
- Consumes: `useQuizStore` (startQuiz, answerQuestion, nextQuestion, finishQuiz, resetQuiz)
- Consumes: `useQuizzes` hook (getQuiz)
- Consumes: `useXP` hook (claimXP)
- Consumes: `QuizCard`, `QuizResult` components

- [ ] **Step 1: Create quiz flow screen**

```tsx
// app/quiz/[id].tsx
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useQuizStore } from "@/stores/quizStore";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useXP } from "@/hooks/useXP";
import { QuizCard, QuizResult } from "@/components/quiz";
import { Button, ProgressBar } from "@/components/ui";

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

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  async function loadQuiz() {
    const quiz = await getQuiz(id!);
    if (quiz) {
      startQuiz(quiz.id, quiz.questions);
    }
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  async function handleSelect(index: number) {
    if (showResult) return;
    setSelectedOption(index);
    const isCorrect = answerQuestion(currentQuestion.id, index);
    setShowResult(true);
  }

  async function handleNext() {
    if (currentIndex < questions.length - 1) {
      nextQuestion();
      setSelectedOption(null);
      setShowResult(false);
    } else {
      const result = finishQuiz();
      const xp = Math.round(result.score * 20); // 20 XP per correct answer
      setXpEarned(xp);
      await claimXP(xp, "quiz", id);
    }
  }

  function handleRetry() {
    resetQuiz();
    setSelectedOption(null);
    setShowResult(false);
    setXpEarned(0);
    loadQuiz();
  }

  if (isFinished) {
    return (
      <QuizResult
        score={score}
        total={questions.length}
        xpEarned={xpEarned}
        isPerfect={score === questions.length}
        onRetry={handleRetry}
        onBack={() => router.back()}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-ink-secondary">Memuat quiz...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface">
      {/* Progress */}
      <View className="px-4 pt-4 mb-4">
        <ProgressBar value={progress} fillColor="primary" />
        <Text className="text-xs text-ink-secondary text-center mt-2">
          Soal {currentIndex + 1} dari {questions.length}
        </Text>
      </View>

      {/* Quiz Card */}
      <View className="px-4">
        <QuizCard
          sender={currentQuestion.sender}
          senderMeta={currentQuestion.senderMeta}
          body={currentQuestion.body}
          question={currentQuestion.question}
          options={currentQuestion.options}
          onSelect={handleSelect}
          selectedIndex={selectedOption ?? undefined}
          showResult={showResult}
          correctIndex={currentQuestion.correctIndex}
        />

        {/* Explanation (after answer) */}
        {showResult && currentQuestion.explanation && (
          <View className="bg-primary/10 rounded-lg p-4 mb-4">
            <Text className="text-sm font-heading text-ink mb-2">Penjelasan:</Text>
            {currentQuestion.explanation.map((text: string, i: number) => (
              <Text key={i} className="text-sm text-ink-secondary mb-1">
                • {text}
              </Text>
            ))}
          </View>
        )}

        {/* Next button */}
        {showResult && (
          <Button
            label={currentIndex < questions.length - 1 ? "Selanjutnya" : "Lihat Hasil"}
            variant="primary"
            onPress={handleNext}
          />
        )}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Task 3: Mission Components

**Files:**
- Create: `components/mission/MissionCard.tsx`
- Create: `components/mission/MissionDetail.tsx`
- Create: `components/mission/index.ts`

**Interfaces:**
- Consumes: `Mission` type from `hooks/useMissions.ts`
- Produces: `MissionCardProps`, `MissionDetailProps`

- [ ] **Step 1: Create MissionCard component**

```tsx
// components/mission/MissionCard.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Badge } from "@/components/ui";
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

const categoryColors: Record<string, string> = {
  keamanan_siber: "#3e4bbe",
  privasi_data: "#744cb0",
  etika_digital: "#1d6f3c",
};

const difficultyBadge: Record<string, { label: string; variant: "success" | "warning" | "error" }> = {
  easy: { label: "Mudah", variant: "success" },
  medium: { label: "Sedang", variant: "warning" },
  hard: { label: "Sulit", variant: "error" },
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
  const catColor = categoryColors[category] || "#3e4bbe";
  const diff = difficultyBadge[difficulty] || difficultyBadge.easy;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card padding="md" className="mb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: catColor }}
              />
              <Text className="text-sm font-heading text-ink">{title}</Text>
            </View>
            {description && (
              <Text className="text-xs text-ink-secondary ml-4">{description}</Text>
            )}
          </View>
          {isCompleted && (
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          )}
        </View>

        <View className="flex-row items-center gap-2 mt-3 ml-4">
          <Badge label={`+${xpReward} XP`} variant="primary" size="sm" />
          <Badge label={diff.label} variant={diff.variant} size="sm" />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
```

- [ ] **Step 2: Create MissionDetail component**

```tsx
// components/mission/MissionDetail.tsx
import { View, Text } from "react-native";
import { Card, Button, Badge } from "@/components/ui";
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

const missionTypeLabels: Record<string, string> = {
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
    <Card padding="lg" className="mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Badge label={missionTypeLabels[missionType] || missionType} variant="primary" size="sm" />
        <Badge label={`+${xpReward} XP`} variant="success" size="sm" />
      </View>

      {/* Title */}
      <Text className="text-lg font-heading text-ink mb-2">{title}</Text>

      {/* Description */}
      {description && (
        <Text className="text-sm text-ink-secondary mb-4">{description}</Text>
      )}

      {/* Info */}
      <View className="flex-row gap-4 mb-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="bar-chart" size={14} color="#767680" />
          <Text className="text-xs text-ink-secondary capitalize">{difficulty}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="folder" size={14} color="#767680" />
          <Text className="text-xs text-ink-secondary capitalize">{category}</Text>
        </View>
      </View>

      {/* Action */}
      <Button
        label={isCompleted ? "Selesai ✓" : "Mulai Misi"}
        variant={isCompleted ? "outline" : "primary"}
        onPress={onStart}
        disabled={isCompleted}
      />
    </Card>
  );
}
```

- [ ] **Step 3: Create index export**

```tsx
// components/mission/index.ts
export { MissionCard } from "./MissionCard";
export { MissionDetail } from "./MissionDetail";
```

- [ ] **Step 4: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Task 4: Mission Detail Screen

**Files:**
- Create: `app/mission/[id].tsx`

**Interfaces:**
- Consumes: `Mission` from `hooks/useMissions.ts`
- Consumes: `useXP` hook (claimXP)
- Consumes: `MissionDetail` component
- Produces: Navigation to quiz/learning based on mission_type

- [ ] **Step 1: Create mission detail screen**

```tsx
// app/mission/[id].tsx
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";
import { MissionDetail } from "@/components/mission";
import { Card, Badge } from "@/components/ui";

interface Mission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  xp_reward: number;
  mission_type: string;
  difficulty: string;
}

export default function MissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useProfile();
  const { claimXP } = useXP();
  const [mission, setMission] = useState<Mission | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMission();
  }, [id]);

  async function loadMission() {
    const { data } = await supabase
      .from("missions")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setMission(data);
      // Check if already completed
      if (profile) {
        const { data: completion } = await supabase
          .from("mission_completions")
          .select("id")
          .eq("user_id", profile.id)
          .eq("mission_id", id)
          .single();
        setIsCompleted(!!completion);
      }
    }
    setLoading(false);
  }

  async function handleStart() {
    if (!mission || !profile) return;

    if (mission.mission_type === "quiz") {
      // Find quiz for this mission's category
      const { data: quiz } = await supabase
        .from("quizzes")
        .select("id")
        .eq("category", mission.category)
        .eq("is_active", true)
        .limit(1)
        .single();

      if (quiz) {
        router.push(`/quiz/${quiz.id}`);
      }
    } else {
      // For non-quiz missions, claim XP directly (simplified)
      await claimXP(mission.xp_reward, "mission", mission.id);
      // Mark as completed
      await supabase.from("mission_completions").insert({
        user_id: profile!.id,
        mission_id: mission.id,
        xp_earned: mission.xp_reward,
      });
      setIsCompleted(true);
    }
  }

  if (loading || !mission) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-ink-secondary">Memuat misi...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="px-4 pt-4">
        <MissionDetail
          title={mission.title}
          description={mission.description}
          category={mission.category}
          xpReward={mission.xp_reward}
          difficulty={mission.difficulty}
          missionType={mission.mission_type}
          onStart={handleStart}
          isCompleted={isCompleted}
        />
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Task 5: Level-up Celebration Modal

**Files:**
- Create: `components/gamification/LevelUpModal.tsx`
- Create: `components/gamification/XPBadge.tsx`
- Create: `components/gamification/StreakBadge.tsx`
- Create: `components/gamification/index.ts`

**Interfaces:**
- Consumes: `LEVELS` from `lib/constants.ts`
- Consumes: `Reanimated` for animations
- Produces: `LevelUpModalProps`, `XPBadgeProps`, `StreakBadgeProps`

- [ ] **Step 1: Create LevelUpModal component**

```tsx
// components/gamification/LevelUpModal.tsx
import { View, Text, Modal } from "react-native";
import { useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Card, Button } from "@/components/ui";
import { LEVELS } from "@/lib/constants";

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpModal({ visible, newLevel, onDismiss }: LevelUpModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);

  const level = LEVELS.find((l) => l.level === newLevel);

  useEffect(() => {
    if (visible) {
      // Reset
      scale.value = 0;
      opacity.value = 0;
      titleOpacity.value = 0;
      badgeScale.value = 0;

      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 10 });
      titleOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
      badgeScale.value = withDelay(600, withSpring(1, { damping: 8 }));
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center px-4">
        <Animated.View style={containerStyle} className="w-full">
          <Card padding="lg" className="items-center">
            {/* Level up icon */}
            <Animated.View
              style={badgeStyle}
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              className="bg-primary"
            >
              <Text className="text-4xl">🎉</Text>
            </Animated.View>

            {/* Title */}
            <Animated.View style={titleStyle}>
              <Text className="text-2xl font-heading text-ink text-center mb-2">
                Level Up!
              </Text>
              <Text className="text-lg font-heading text-primary text-center mb-1">
                Level {newLevel}
              </Text>
              <Text className="text-sm text-ink-secondary text-center">
                {level?.title}
              </Text>
            </Animated.View>

            {/* Dismiss */}
            <Button
              label="Mantap!"
              variant="primary"
              onPress={onDismiss}
              className="mt-6"
            />
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
}
```

- [ ] **Step 2: Create XPBadge component**

```tsx
// components/gamification/XPBadge.tsx
import { View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useEffect } from "react";

interface XPBadgeProps {
  amount: number;
  show?: boolean;
}

export function XPBadge({ amount, show = false }: XPBadgeProps) {
  const opacity = useSharedValue(show ? 1 : 0);
  const translateY = useSharedValue(show ? 0 : -20);

  useEffect(() => {
    if (show) {
      opacity.value = withSpring(1);
      translateY.value = withSpring(0);
    } else {
      opacity.value = withSpring(0);
      translateY.value = withSpring(-20);
    }
  }, [show]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!show) return null;

  return (
    <Animated.View
      style={style}
      className="bg-success/20 rounded-full px-3 py-1"
    >
      <Text className="text-success font-heading text-sm">+{amount} XP</Text>
    </Animated.View>
  );
}
```

- [ ] **Step 3: Create StreakBadge component**

```tsx
// components/gamification/StreakBadge.tsx
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 12, text: "text-xs", padding: "px-2 py-0.5" },
  md: { icon: 16, text: "text-sm", padding: "px-3 py-1" },
  lg: { icon: 20, text: "text-base", padding: "px-4 py-2" },
};

export function StreakBadge({ count, size = "md" }: StreakBadgeProps) {
  const s = sizes[size];

  if (count === 0) return null;

  return (
    <View className={`flex-row items-center gap-1 bg-warning/20 rounded-full ${s.padding}`}>
      <Ionicons name="flame" size={s.icon} color="#f59e0b" />
      <Text className={`font-heading text-warning ${s.text}`}>{count}</Text>
    </View>
  );
}
```

- [ ] **Step 4: Create index export**

```tsx
// components/gamification/index.ts
export { LevelUpModal } from "./LevelUpModal";
export { XPBadge } from "./XPBadge";
export { StreakBadge } from "./StreakBadge";
```

- [ ] **Step 5: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Task 6: Update Missions Tab (Real Data)

**Files:**
- Modify: `app/(tabs)/missions.tsx`

**Interfaces:**
- Consumes: `useMissions` hook
- Consumes: `MissionCard` component
- Produces: Navigation to `/mission/[id]`

- [ ] **Step 1: Update missions screen**

```tsx
// app/(tabs)/missions.tsx
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useMissions } from "@/hooks/useMissions";
import { MissionCard } from "@/components/mission";
import { Badge } from "@/components/ui";

type FilterType = "all" | "active" | "completed";

export default function MissionsScreen() {
  const router = useRouter();
  const { missions, loading, refetch } = useMissions();
  const [filter, setFilter] = useState<FilterType>("all");

  const onRefresh = useCallback(async () => {
    await refetch();
  }, []);

  const filteredMissions = missions.filter((m) => {
    if (filter === "active") return m.is_active;
    if (filter === "completed") return false; // TODO: track completions
    return true;
  });

  return (
    <ScrollView
      className="flex-1 bg-surface"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 pt-4">
        <Text className="text-xl font-heading text-ink mb-4">Misi</Text>

        {/* Filter */}
        <View className="flex-row mb-4 gap-2">
          {(["all", "active", "completed"] as FilterType[]).map((f) => (
            <Badge
              key={f}
              label={f === "all" ? "Semua" : f === "active" ? "Berjalan" : "Selesai"}
              variant={filter === f ? "primary" : "muted"}
              size="sm"
              onPress={() => setFilter(f)}
            />
          ))}
        </View>

        {/* Mission List */}
        {loading ? (
          <Text className="text-ink-secondary text-center py-8">Memuat...</Text>
        ) : filteredMissions.length === 0 ? (
          <Text className="text-ink-secondary text-center py-8">
            Tidak ada misi tersedia
          </Text>
        ) : (
          filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              id={mission.id}
              title={mission.title}
              description={mission.description}
              category={mission.category}
              xpReward={mission.xp_reward}
              difficulty={mission.difficulty}
              onPress={() => router.push(`/mission/${mission.id}`)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Task 7: Integrate Level-up Modal

**Files:**
- Modify: `app/(tabs)/index.tsx` (add LevelUpModal)
- Modify: `hooks/useXP.ts` (return levelUp info)

**Interfaces:**
- Consumes: `LevelUpModal` component
- Consumes: `claimXP` result (leveled_up, new_level)

- [ ] **Step 1: Update useXP hook to return level-up info**

```tsx
// hooks/useXP.ts
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/stores/profileStore";

interface ClaimXPResult {
  leveled_up: boolean;
  new_level: number;
  new_total_xp: number;
}

export function useXP() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ClaimXPResult | null>(null);
  const { addXP, setLevel, updateStreak } = useProfileStore();
  const { profile } = useProfileStore();

  const claimXP = useCallback(
    async (amount: number, source: string, sourceId?: string) => {
      if (!profile) return null;
      setLoading(true);

      const { data, error } = await supabase.rpc("claim_xp", {
        p_user_id: profile.id,
        p_amount: amount,
        p_source: source,
        p_source_id: sourceId ?? null,
      });

      setLoading(false);

      if (error || !data) return null;

      // Update local store
      addXP(amount);
      if (data.leveled_up) {
        setLevel(data.new_level);
        setLastResult(data);
      }

      return data;
    },
    [profile?.id]
  );

  const clearLastResult = useCallback(() => setLastResult(null), []);

  const checkStreak = useCallback(async () => {
    if (!profile) return null;

    const { data, error } = await supabase.rpc("update_streak", {
      p_user_id: profile.id,
    });

    if (error || !data) return null;

    updateStreak(data.streak_count);
    return data;
  }, [profile?.id]);

  return { claimXP, checkStreak, lastResult, clearLastResult, loading };
}
```

- [ ] **Step 2: Update dashboard to show LevelUpModal**

```tsx
// app/(tabs)/index.tsx
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useCallback, useState, useEffect } from "react";
import { Card, ProgressBar, Badge } from "@/components/ui";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";
import { getXpProgress, CATEGORIES } from "@/lib/constants";
import { LevelUpModal } from "@/components/gamification";

export default function HomeScreen() {
  const { profile, loading, refetch } = useProfile();
  const { checkStreak, lastResult, clearLastResult } = useXP();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (lastResult?.leveled_up) {
      setShowLevelUp(true);
    }
  }, [lastResult]);

  const onRefresh = useCallback(async () => {
    await refetch();
    await checkStreak();
  }, []);

  if (loading || !profile) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-ink-secondary">Memuat...</Text>
      </View>
    );
  }

  const xp = getXpProgress(profile.total_xp);

  return (
    <>
      <ScrollView
        className="flex-1 bg-surface"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-ink-secondary">Halo,</Text>
              <Text className="text-xl font-heading text-ink">
                {profile.display_name.split(" ")[0]}
              </Text>
            </View>
            <View className="w-11 h-11 bg-tertiary rounded-full items-center justify-center">
              <Text className="text-white font-heading">
                {profile.display_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* XP Card */}
        <View className="px-4 mb-4">
          <Card variant="primary" padding="lg">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-white/70 text-sm">Total XP</Text>
                <Text className="text-white text-3xl font-heading">
                  {profile.total_xp}
                </Text>
              </View>
              <View className="items-end">
                <Badge label={`Lv.${xp.current.level}`} variant="outline" size="sm" />
                <Text className="text-white/70 text-xs mt-1">{xp.current.title}</Text>
              </View>
            </View>

            <ProgressBar
              value={xp.progress}
              fillColor="success"
              trackColor="dark"
              height="sm"
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-white/60 text-xs">
                {profile.total_xp} / {xp.next?.xpThreshold ?? "∞"} XP
              </Text>
              {xp.next && (
                <Text className="text-white/60 text-xs">
                  {xp.next.xpThreshold - profile.total_xp} XP lagi ke Level {xp.next.level}
                </Text>
              )}
            </View>
          </Card>
        </View>

        {/* Stats */}
        <View className="flex-row px-4 mb-4 gap-3">
          <Card className="flex-1 items-center" padding="md">
            <Text className="text-lg font-heading text-ink">
              {profile.streak_count}
            </Text>
            <Text className="text-xs text-ink-secondary">Streak</Text>
          </Card>
          <Card className="flex-1 items-center" padding="md">
            <Text className="text-lg font-heading text-ink">
              {profile.weekly_xp}
            </Text>
            <Text className="text-xs text-ink-secondary">XP Minggu Ini</Text>
          </Card>
        </View>

        {/* Level titles */}
        <View className="px-4 mb-4">
          <Card padding="md">
            <Text className="text-sm font-heading text-ink mb-2">Level Titles</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge key={cat.id} label={cat.label} variant="muted" size="sm" />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Level Up Modal */}
      <LevelUpModal
        visible={showLevelUp}
        newLevel={lastResult?.new_level ?? profile.current_level}
        onDismiss={() => {
          setShowLevelUp(false);
          clearLastResult();
        }}
      />
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd ~/digitalwise/mobile-app && npx expo export --platform web --output-dir /tmp/expo-test`
Expected: Build succeeds

---

## Verification

After all tasks:

1. **Build check:** `npx expo export --platform web --output-dir /tmp/expo-test`
2. **Type check:** `npx tsc --noEmit`
3. **Manual test flow:**
   - Login → Dashboard → tap "Misi" tab → see missions list
   - Tap mission → see detail → tap "Mulai Misi"
   - Complete quiz → see result → XP awarded
   - If level up → celebration modal appears
   - Back to dashboard → XP updated
