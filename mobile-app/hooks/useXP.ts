import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/stores/profileStore";

interface ClaimXPResult {
  leveled_up: boolean;
  new_level: number;
  new_total_xp: number;
  new_weekly_xp: number;
}

export function useXP() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ClaimXPResult | null>(null);
  const { profile, addXP, setLevel, updateStreak } = useProfileStore();

  const claimXP = useCallback(
    async (amount: number, source: string, sourceId?: string) => {
      if (!profile) return null;
      setLoading(true);

      const { data, error } = await supabase.rpc("claim_xp", {
        p_user_id: profile.id,
        p_amount: amount,
        p_source: source,
        p_source_id: sourceId ?? null,
      });

      setLoading(false);
      if (error || !data) return null;

      addXP(amount);
      if (data.leveled_up) {
        setLevel(data.new_level);
        setLastResult(data);
      }

      return data;
    },
    [profile?.id]
  );

  const clearLastResult = useCallback(() => setLastResult(null), []);

  const checkStreak = useCallback(async () => {
    if (!profile) return null;

    const { data, error } = await supabase.rpc("update_streak", {
      p_user_id: profile.id,
    });

    if (error || !data) return null;

    updateStreak(data.streak_count);
    return data;
  }, [profile?.id]);

  return { claimXP, checkStreak, lastResult, clearLastResult, loading };
}
