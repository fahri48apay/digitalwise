import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore, type Profile } from "@/stores/profileStore";

export function useProfile() {
  const { session } = useAuthStore();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      clearProfile();
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (data) setProfile(data as Profile);
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { profile, loading, refetch: fetchProfile };
}
