import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading, isAuthenticated, isLoading } = useAuthStore();
  const { setProfile, clearProfile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (data) setProfile(data);
      } else {
        clearProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) router.replace("/(auth)/login");
    else if (isAuthenticated && inAuthGroup) router.replace("/(tabs)");
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}
