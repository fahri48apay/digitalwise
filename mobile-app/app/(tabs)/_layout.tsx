import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { TYPOGRAPHY, LAYOUT, RADIUS, SPACING } from "@/lib/constants";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          height: LAYOUT.navHeight,
          backgroundColor: colors.surfaceContainerHighest,
          borderTopWidth: 0,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.sm + 2,
        },
        tabBarLabelStyle: {
          ...TYPOGRAPHY.labelSm,
          marginTop: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primaryContainer,
          borderRadius: 15,
          height: 32,
          marginHorizontal: SPACING.lg,
          marginBottom: SPACING.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Misi",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-check" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Peringkat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
