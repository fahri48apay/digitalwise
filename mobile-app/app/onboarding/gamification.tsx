import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/providers/ThemeProvider";
import { completeOnboarding } from "@/lib/onboarding";
import { DwButton, DwIcon } from "@/components/ui";
import { SPACING, RADIUS, TYPOGRAPHY, LAYOUT } from "@/lib/constants";

export default function OnboardingGamification() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <View
            style={[
              styles.circle,
              { backgroundColor: colors.tertiaryContainer },
            ]}
          >
            <DwIcon name="trophy" size={80} color={colors.tertiary} />
          </View>
        </View>

        {/* Copy */}
        <Text
          style={[TYPOGRAPHY.headlineMd, styles.headline, { color: colors.onSurface }]}
        >
          Belajar Sambil Bermain
        </Text>
        <Text
          style={[
            TYPOGRAPHY.bodyMd,
            styles.description,
            { color: colors.onSurfaceVariant },
          ]}
        >
          Selesaikan misi, kumpulkan XP, dan naik level. Buktikan kamu bisa
          jadi pahlawan digital!
        </Text>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === 1 ? colors.primary : colors.outlineVariant,
                },
              ]}
            />
          ))}
        </View>

        <DwButton
          label="Selanjutnya"
          variant="filled"
          onPress={() => router.push("/onboarding/permission")}
          style={{ borderRadius: RADIUS.sm }}
        />

        <Pressable
          onPress={async () => {
            await completeOnboarding();
            router.replace("/(tabs)");
          }}
          style={styles.skipHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Lewati onboarding"
        >
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              { color: colors.onSurfaceVariant, textAlign: "center" },
            ]}
          >
            Lewati
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: 80,
    paddingBottom: SPACING.xxxl,
    justifyContent: "space-between",
  },
  body: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  illustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxxxl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  description: {
    textAlign: "center",
    maxWidth: 320,
  },
  bottom: {
    gap: SPACING.md,
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skipHitSlop: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
