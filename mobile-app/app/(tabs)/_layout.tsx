import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#767680",
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 4 },
        headerStyle: { backgroundColor: "#fbf8fe" },
        headerTintColor: "#1a1b21",
      }}
    >
      <Tabs.Screen name="index" options={{
        title: "Beranda",
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="missions" options={{
        title: "Misi",
        tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
      }} />
      <Tabs.Screen name="leaderboard" options={{
        title: "Peringkat",
        tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profil",
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
