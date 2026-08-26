import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMissions() {
    setLoading(true);
    const { data } = await supabase
      .from("missions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setMissions(data || []);
    setLoading(false);
  }

  return { missions, loading, refetch: fetchMissions };
}
