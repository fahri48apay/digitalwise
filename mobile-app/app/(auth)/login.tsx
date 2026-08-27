import { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { DwButton, DwInput } from "@/components/ui";
import { useAppTheme } from "@/providers/ThemeProvider";
import { SPACING, TYPOGRAPHY } from "@/lib/constants";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* ── Logo Shield ── */}
      <View style={styles.hero}>
        <View
          style={[
            styles.shield,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          {/* Shield SVG */}
          <View style={[styles.shieldInner, { backgroundColor: colors.primary }]}>
            <View style={[styles.shieldCheck, { borderColor: colors.onPrimary }]} />
          </View>
        </View>
      </View>

      {/* ── Wordmark ── */}
      <Text style={[TYPOGRAPHY.displayLg, styles.wordmark]}>
        Digital
        <Text style={{ color: colors.primary }}>Wise</Text>
      </Text>

      {/* ── Tagline ── */}
      <Text
        style={[
          TYPOGRAPHY.bodyMd,
          { color: colors.onSurfaceVariant, textAlign: "center", maxWidth: 280 },
        ]}
      >
        Belajar, main, dan menang melawan kejahatan siber di media sosial.
      </Text>

      {/* ── Form ── */}
      <View style={styles.form}>
        <DwInput
          label="Email atau nama pengguna"
          placeholder="nama@contoh.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          trailingIcon="mail"
        />

        <DwInput
          label="Kata sandi"
          placeholder="Minimal 8 karakter"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          trailingIcon={showPass ? "eye-off" : "eye"}
          onTrailingIconPress={() => setShowPass(!showPass)}
        />

        <DwButton label="Masuk" onPress={handleLogin} loading={loading} disabled={loading} />

        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text
              style={[
                TYPOGRAPHY.labelLg,
                { color: colors.primary, textAlign: "center", marginTop: SPACING.lg },
              ]}
            >
              Belum punya akun? Daftar sekarang
            </Text>
          </Pressable>
        </Link>

        <Text
          style={[
            TYPOGRAPHY.labelMd,
            {
              color: colors.onSurfaceVariant,
              textAlign: "center",
              marginTop: SPACING.xxl,
              lineHeight: 20,
            },
          ]}
        >
          Dengan masuk, kamu menyetujui{"\n"}Syarat Layanan dan Kebijakan Privasi kami.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { alignItems: "center", paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xxl },
  hero: { marginTop: SPACING.xxxxl, marginBottom: SPACING.lg, alignItems: "center" },
  shield: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldInner: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldCheck: {
    width: 27,
    height: 19,
    borderWidth: 5,
    borderRadius: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    transform: [{ rotate: "45deg" }],
  },
  wordmark: {
    fontWeight: "800",
    letterSpacing: -0.02,
    marginBottom: SPACING.sm,
  },
  form: { width: "100%", gap: SPACING.lg, marginTop: SPACING.xxxxl },
});
