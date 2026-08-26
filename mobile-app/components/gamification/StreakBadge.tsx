import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 12, text: 11, px: 8, py: 2 },
  md: { icon: 16, text: 13, px: 12, py: 4 },
  lg: { icon: 20, text: 15, px: 16, py: 6 },
};

export function StreakBadge({ count, size = "md" }: StreakBadgeProps) {
  if (count === 0) return null;
  const s = sizes[size];

  return (
    <View style={[styles.badge, { paddingHorizontal: s.px, paddingVertical: s.py }]}>
      <Ionicons name="flame" size={s.icon} color="#f59e0b" />
      <Text style={[styles.text, { fontSize: s.text }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#f59e0b20", borderRadius: 12 },
  text: { color: "#f59e0b", fontWeight: "bold" },
});
