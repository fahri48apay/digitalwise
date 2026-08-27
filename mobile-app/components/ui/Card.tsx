import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS, SPACING, ELEVATION } from "@/lib/constants";

type Variant = "elevated" | "filled" | "outlined";

interface DwCardProps {
  children: React.ReactNode;
  variant?: Variant;
  style?: ViewStyle;
}

export function DwCard({ children, variant = "filled", style }: DwCardProps) {
  const { colors } = useAppTheme();

  const cardStyle: ViewStyle[] = [
    styles.base,
    variant === "elevated" && {
      backgroundColor: colors.surfaceContainerLow,
      ...ELEVATION.low,
    },
    variant === "filled" && {
      backgroundColor: colors.surfaceContainer,
    },
    variant === "outlined" && {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
});
