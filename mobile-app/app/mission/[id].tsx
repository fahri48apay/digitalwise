import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, Chip } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useXP } from "@/hooks/useXP";

export default function MissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useProfile();
  const { claimXP } = useXP();
  const [mission, setMission] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { loadMission(); }, [id]);

  async function loadMission() {
    if (!id) return;
    const { data } = await supabase.from("missions").select("*").eq("id", id).single();
    if (data) {
      setMission(data);
      if (profile) {
        const { data: c } = await supabase.from("mission_completions").select("id").eq("user_id", profile.id).eq("mission_id", id).single();
        setCompleted(!!c);
      }
    }
  }

  async function handleStart() {
    if (!mission || !profile) return;
    if (mission.mission_type === "quiz") {
      const { data: quiz } = await supabase.from("quizzes").select("id").eq("category", mission.category).eq("is_active", true).limit(1).single();
      if (quiz) router.push(`/quiz/${quiz.id}`);
      else Alert.alert("Info", "Quiz belum tersedia");
    } else {
      const result = await claimXP(mission.xp_reward, "mission", mission.id);
      if (result) {
        await supabase.from("mission_completions").insert({ user_id: profile.id, mission_id: mission.id, xp_earned: mission.xp_reward });
        setCompleted(true);
        Alert.alert("Berhasil!", `+${mission.xp_reward} XP`);
      }
    }
  }

  if (!mission) return <View style={styles.center}><Text>Memuat...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.chips}>
            <Chip compact>{mission.mission_type}</Chip>
            <Chip compact style={{ backgroundColor: "#10b98120" }}>+{mission.xp_reward} XP</Chip>
          </View>
          <Text variant="headlineSmall" style={{ marginTop: 12 }}>{mission.title}</Text>
          {mission.description && <Text variant="bodyMedium" style={{ color: "#767680", marginTop: 8 }}>{mission.description}</Text>}
          <Button mode="contained" onPress={handleStart} disabled={completed} style={{ marginTop: 24 }}>
            {completed ? "Selesai" : "Mulai Misi"}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { margin: 16 },
  chips: { flexDirection: "row", gap: 8 },
});
