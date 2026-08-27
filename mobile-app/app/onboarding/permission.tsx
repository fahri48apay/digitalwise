import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/providers/ThemeProvider";
import { completeOnboarding } from "@/lib/onboarding";
import { DwButton, DwIcon } from "@/components/ui";
import { SPACING, RADIUS, TYPOGRAPHY, LAYOUT } from "@/lib/constants";

export default function OnboardingPermission() {
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
              { backgroundColor: colors.successContainer },
            ]}
          >
            <DwIcon name="bell" size={80} color={colors.success} />
          </View>
        </View>

        {/* Copy */}
        <Text
          style={[TYPOGRAPHY.headlineMd, styles.headline, { color: colors.onSurface }]}
        >
          Nyalakan Notifikasi
        </Text>
        <Text
          style={[
            TYPOGRAPHY.bodyMd,
            styles.description,
            { color: colors.onSurfaceVariant },
          ]}
        >
          Dapatkan pengingat misi harian dan update terbaru dari komunitas
          DigitalWise.
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
                    i === 2 ? colors.primary : colors.outlineVariant,
                },
              ]}
            />
          ))}
        </View>

        <DwButton
          label="Izinkan"
          variant="filled"
          onPress={async () => {
            /* TODO: request actual notification permission */
            await completeOnboarding();
            router.replace("/(tabs)");
          }}
          style={{ borderRadius: RADIUS.sm }}
        />
        <DwButton
          label="Nanti Saja"
          variant="outlined"
          onPress={async () => {
            await completeOnboarding();
            router.replace("/(tabs)");
          }}
          style={{ borderRadius: RADIUS.sm }}
        />

        <Pressable
          onPress={async () => {
            await completeOnboarding();
            router.replace("/(tabs)");
          }}
          style={styles.startHitSlop}
          accessibilityRole="button"
          accessibilityLabel="Mulai menggunakan DigitalWise"
        >
          <Text style={[TYPOGRAPHY.labelLg, { color: colors.primary }]}>
            Mulai →
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
  startHitSlop: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
