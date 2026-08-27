import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";

interface DwIconProps {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  color?: string;
}

export function DwIcon({ name, size = 24, color }: DwIconProps) {
  const { colors } = useAppTheme();
  return <MaterialCommunityIcons name={name} size={size} color={color || colors.onSurfaceVariant} />;
}
