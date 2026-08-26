import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
  key_takeaways: string[] | null;
  xp_reward: number;
  duration_min: number;
  sort_order: number;
  is_active: boolean;
}

interface MaterialProgress {
  id: string;
  material_id: string;
  completed: boolean;
  watch_time_sec: number;
  xp_earned: number;
}

export function useMaterials() {
  const [loading, setLoading] = useState(true);

  const getMaterials = useCallback(async (category?: string) => {
    setLoading(true);
    let query = supabase.from("learning_materials").select("*").eq("is_active", true).order("sort_order");
    if (category) query = query.eq("category", category);
    const { data } = await query;
    setLoading(false);
    return (data || []) as Material[];
  }, []);

  const getMaterial = useCallback(async (id: string) => {
    const { data } = await supabase.from("learning_materials").select("*").eq("id", id).single();
    return data as Material | null;
  }, []);

  const getProgress = useCallback(async (userId: string, materialId: string) => {
    const { data } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("material_id", materialId)
      .single();
    return data as MaterialProgress | null;
  }, []);

  const markComplete = useCallback(async (userId: string, materialId: string, xpReward: number) => {
    const { data: existing } = await supabase
      .from("learning_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("material_id", materialId)
      .single();

    if (existing) {
      await supabase.from("learning_progress").update({ completed: true, completed_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("learning_progress").insert({
        user_id: userId,
        material_id: materialId,
        completed: true,
        xp_earned: xpReward,
        completed_at: new Date().toISOString(),
      });
    }
  }, []);

  return { getMaterials, getMaterial, getProgress, markComplete, loading };
}
