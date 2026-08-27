import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { COLORS } from "@/lib/constants";

interface XPBadgeProps {
  amount: number;
  show?: boolean;
}

export function XPBadge({ amount, show = false }: XPBadgeProps) {
  if (!show) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>+{amount} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: `${COLORS.success}20`, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  text: { color: COLORS.success, fontWeight: "bold", fontSize: 13 },
});
