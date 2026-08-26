import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface LeaderboardEntry {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  current_level: number;
  total_xp: number;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, current_level, total_xp")
      .order("total_xp", { ascending: false })
      .limit(50);

    if (data) setEntries(data);
    setLoading(false);
  }, []);

  return { entries, loading, refetch: fetchLeaderboard };
}
