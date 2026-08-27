import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/lib/constants";

interface DwChipProps {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  style?: ViewStyle;
}

export function DwChip({ label, icon, color, style }: DwChipProps) {
  const { colors } = useAppTheme();
  const chipBg = color ? `${color}20` : colors.secondaryContainer;
  const chipText = color || colors.onSecondaryContainer;

  return (
    <View style={[styles.chip, { backgroundColor: chipBg }, style]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={15}
          color={chipText}
          style={{ marginRight: SPACING.xs }}
        />
      )}
      <Text style={[TYPOGRAPHY.labelMd, { color: chipText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    alignSelf: "flex-start",
  },
});
