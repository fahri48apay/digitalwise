import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace("/(tabs)");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>DigitalWise</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Masuk ke akunmu</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
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
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          >
            Masuk
          </Button>
          <Link href="/(auth)/register" asChild>
            <Button mode="text">Belum punya akun? Daftar</Button>
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
