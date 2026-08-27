import React from "react";
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/lib/constants";

type Variant = "filled" | "outlined" | "text" | "tonal";

interface DwButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function DwButton({
  label,
  onPress,
  variant = "filled",
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: DwButtonProps) {
  const { colors } = useAppTheme();

  const baseStyle = [
    styles.base,
    fullWidth && styles.fullWidth,
    variant === "filled" && { backgroundColor: colors.primary },
    variant === "tonal" && { backgroundColor: colors.secondaryContainer },
    variant === "outlined" && {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.outline,
    },
    variant === "text" && { backgroundColor: "transparent" },
    disabled && { opacity: 0.38 },
    style,
  ];

  const textColor =
    variant === "filled"
      ? colors.onPrimary
      : variant === "tonal"
        ? colors.onSecondaryContainer
        : colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [...baseStyle, pressed && { opacity: 0.8 }]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[TYPOGRAPHY.labelLg, { color: textColor, marginLeft: icon ? SPACING.sm : 0 }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xxl,
  },
  fullWidth: {
    width: "100%",
  },
});
