import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS, TYPOGRAPHY } from "@/lib/constants";

export interface SegmentedOption {
  key: string;
  label: string;
}

export interface SegmentedControlProps {
  value: string;
  onValueChange: (v: string) => void;
  options: SegmentedOption[];
}

/**
 * M3 segmented control: full width, height 48, three equal segments.
 * Selected segment → primary bg / onPrimary label; unselected → onSurfaceVariant label.
 */
export function SegmentedControl({
  value,
  onValueChange,
  options,
}: SegmentedControlProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceContainerLow },
      ]}
    >
      {options.map((opt) => {
        const selected = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onValueChange(opt.key)}
            style={({ pressed }) => [
              styles.segment,
              {
                backgroundColor: selected ? colors.primary : "transparent",
                opacity: !selected && pressed ? 0.7 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text
              style={[
                TYPOGRAPHY.labelLg,
                {
                  color: selected ? colors.onPrimary : colors.onSurfaceVariant,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    borderRadius: RADIUS.md,
    padding: 4,
    flexDirection: "row",
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
