import { View, Pressable, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, LAYOUT, SPACING } from "@/lib/constants";

export default function NameScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: LAYOUT.screenPadding }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.lg }}>
        <Pressable style={{ width: LAYOUT.touchTarget, height: LAYOUT.touchTarget, alignItems: "center", justifyContent: "center" }} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Kembali">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
        <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface }]}>Nama Tampilan</Text>
      </View>
      <Text style={[TYPOGRAPHY.bodyLg, { color: colors.onSurfaceVariant }]}>Segera hadir</Text>
    </ScrollView>
  );
}
