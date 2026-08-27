import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppTheme } from "@/providers/ThemeProvider";
import { SPACING, TYPOGRAPHY, LEVELS } from "@/lib/constants";
import { DwButton } from "@/components/ui/Button";

// ── Confetti particle config ──────────────────────────────────
const PARTICLE_COUNT = 20;
const PARTICLE_COLORS_KEYS = ["primary", "tertiary", "success", "warning"] as const;

interface Particle {
  id: number;
  colorKey: (typeof PARTICLE_COLORS_KEYS)[number];
  size: number;
  startX: number;
  driftX: number;
  duration: number;
  delay: number;
}

function generateParticles(screenWidth: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      id: i,
      colorKey: PARTICLE_COLORS_KEYS[i % PARTICLE_COLORS_KEYS.length],
      size: 8 + Math.round(Math.random() * 4), // 8–12
      startX: Math.round(Math.random() * screenWidth),
      driftX: Math.round((Math.random() - 0.5) * 60), // ±30
      duration: 1800 + Math.round(Math.random() * 800), // 1800–2600
      delay: Math.round(Math.random() * 1200),
    });
  }
  return particles;
}

// ── Confetti layer ────────────────────────────────────────────
function Confetti({
  particles,
  colors,
  screenHeight,
}: {
  particles: Particle[];
  colors: Record<string, string>;
  screenHeight: number;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      accessibilityElementsHidden
    >
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          particle={p}
          color={colors[p.colorKey]}
          screenHeight={screenHeight}
        />
      ))}
    </View>
  );
}

function ConfettiParticle({
  particle,
  color,
  screenHeight,
}: {
  particle: Particle;
  color: string;
  screenHeight: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: particle.duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { resetBeforeIteration: true }
    ).start();
  }, []);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, screenHeight + 20],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, particle.driftX, particle.driftX * 0.5],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.05, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: particle.startX,
        width: particle.size,
        height: particle.size,
        borderRadius: particle.size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    />
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function LevelUpScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const raw = useLocalSearchParams();
  const level = Math.max(1, Math.min(parseInt(String(raw.level ?? "1"), 10) || 1, LEVELS.length));
  const title = raw.title
    ? decodeURIComponent(String(raw.title))
    : LEVELS.find((l) => l.level === level)?.title ?? "";
  const xpEarned = Math.max(0, parseInt(String(raw.xp ?? "0"), 10) || 0);

  const particles = useMemo(() => generateParticles(screenWidth), [screenWidth]);

  // ── Animations ──────────────────────────────────────────────
  // Glow pulse
  const glowScale = useRef(new Animated.Value(1)).current;
  // Content fade-in
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Glow pulse: 1.0 → 1.1 → 1.0
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1.0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Content fade in from bottom after 500ms
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ── Confetti layer ─────────────────────────────────────── */}
      <Confetti
        particles={particles}
        colors={colors}
        screenHeight={screenHeight}
      />

      {/* ── Content ────────────────────────────────────────────── */}
      <Animated.View
        style={{
          alignItems: "center",
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }],
        }}
      >
        {/* ── Glow behind badge ────────────────────────────────── */}
        <View style={{ position: "relative", width: 300, height: 300, justifyContent: "center", alignItems: "center" }}>
          <Animated.View
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: colors.primary,
              opacity: 0.1,
              transform: [{ scale: glowScale }],
            }}
          />

          {/* ── Level badge ─────────────────────────────────────── */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[TYPOGRAPHY.displayLg, { color: colors.onPrimary }]}>{level}</Text>
          </View>
        </View>

        {/* ── Texts ────────────────────────────────────────────── */}
        <Text
          style={[
            TYPOGRAPHY.headlineMd,
            { color: colors.onSurface, textAlign: "center", marginTop: SPACING.xxl },
          ]}
        >
          Selamat!
        </Text>

        <Text
          style={[
            TYPOGRAPHY.titleLg,
            {
              color: colors.onPrimaryContainer,
              textAlign: "center",
              marginTop: SPACING.sm,
            },
          ]}
        >
          Kamu Naik Level!
        </Text>

        <Text
          style={[
            TYPOGRAPHY.bodyLg,
            {
              color: colors.onSurfaceVariant,
              textAlign: "center",
              marginTop: SPACING.sm,
            },
          ]}
        >
          {title}
        </Text>

        {/* ── XP earned pill ───────────────────────────────────── */}
        {xpEarned > 0 && (
          <View
            style={{
              backgroundColor: colors.successContainer,
              borderRadius: 16,
              paddingHorizontal: SPACING.md,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
              marginTop: SPACING.lg,
            }}
          >
            <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSuccessContainer }]}>
              +{xpEarned} XP
            </Text>
          </View>
        )}

        {/* ── Continue button ──────────────────────────────────── */}
        <View style={{ width: 372, maxWidth: "100%", marginTop: SPACING.xxxl }}>
          <DwButton
            label="Lanjut Belajar"
            variant="filled"
            onPress={handleContinue}
            style={{ height: 48, borderRadius: 22 }}
          />
        </View>
      </Animated.View>
    </View>
  );
}
