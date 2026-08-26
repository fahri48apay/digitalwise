import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!username || !email || !password) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Berhasil", "Akun sudah dibuat! Silakan login.");
      router.replace("/(auth)/login");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>DigitalWise</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Buat akun baru</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
          >
            Daftar
          </Button>
          <Link href="/(auth)/login" asChild>
            <Button mode="text">Sudah punya akun? Masuk</Button>
          </Link>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  content: { padding: 24, justifyContent: "center", flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 32 },
  title: { fontWeight: "bold", color: "#3e4bbe" },
  subtitle: { color: "#767680", marginTop: 4 },
  card: { elevation: 2 },
  cardContent: { gap: 16, padding: 8 },
});
