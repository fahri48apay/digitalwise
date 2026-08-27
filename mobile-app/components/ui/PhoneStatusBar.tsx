import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, SPACING } from "@/lib/constants";

export function PhoneStatusBar() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.bar, { backgroundColor: colors.background }]}>
      <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurface }]}>12:30</Text>
      <View style={styles.icons}>
        <MaterialCommunityIcons name="signal-cellular-3" size={14} color={colors.onSurface} />
        <MaterialCommunityIcons name="wifi" size={14} color={colors.onSurface} />
        <MaterialCommunityIcons name="battery-full" size={14} color={colors.onSurface} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg + SPACING.xs,
  },
  icons: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
