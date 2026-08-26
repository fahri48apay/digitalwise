import { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter, Slot } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/useProfile";

export default function AdminLayout() {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [profile, loading]);

  if (loading) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  if (profile?.role !== "admin") {
    return <View style={styles.center}><Text>Akses ditolak</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Sidebar (web) */}
      {!isMobile && (
        <View style={styles.sidebar}>
          <Text variant="titleMedium" style={styles.sidebarTitle}>Admin Panel</Text>
          <SidebarItem icon="home" label="Dashboard" onPress={() => router.push("/admin")} />
          <SidebarItem icon="book" label="Materi" onPress={() => router.push("/admin/materials")} />
          <SidebarItem icon="help-circle" label="Quiz" onPress={() => router.push("/admin/quizzes")} />
          <SidebarItem icon="flag" label="Misi" onPress={() => router.push("/admin/missions")} />
          <View style={{ flex: 1 }} />
          <SidebarItem icon="arrow-back" label="Kembali ke App" onPress={() => router.replace("/(tabs)")} />
        </View>
      )}

      {/* Main content */}
      <View style={styles.main}>
        {/* Top bar dengan navigasi (mobile) */}
        <View style={styles.topBar}>
          <Button compact onPress={() => router.replace("/(tabs)")}>
            <Ionicons name="arrow-back" size={16} /> Kembali
          </Button>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>Admin Panel</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <NavBtn icon="home" onPress={() => router.push("/admin")} />
            <NavBtn icon="book" onPress={() => router.push("/admin/materials")} />
            <NavBtn icon="help-circle" onPress={() => router.push("/admin/quizzes")} />
            <NavBtn icon="flag" onPress={() => router.push("/admin/missions")} />
          </View>
        </View>
        <Slot />
      </View>
    </View>
  );
}

function SidebarItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Button
      mode="text"
      icon={icon as any}
      onPress={onPress}
      style={styles.sidebarItem}
      contentStyle={{ justifyContent: "flex-start" }}
    >
      {label}
    </Button>
  );
}

function NavBtn({ icon, onPress }: { icon: string; onPress: () => void }) {
  return (
    <Button compact mode="contained-tonal" onPress={onPress} style={styles.navBtn}>
      <Ionicons name={icon as any} size={18} />
    </Button>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sidebar: { width: 220, backgroundColor: "#fff", borderRightWidth: 1, borderRightColor: "#e5e7eb", padding: 16 },
  sidebarTitle: { fontWeight: "bold", marginBottom: 16, color: "#3e4bbe" },
  sidebarItem: { marginBottom: 4, justifyContent: "flex-start" },
  main: { flex: 1 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  navBtn: { minWidth: 40 },
});
