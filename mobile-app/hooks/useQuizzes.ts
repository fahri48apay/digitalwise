import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useQuizzes() {
  const [loading, setLoading] = useState(false);

  async function getQuiz(id: string) {
    setLoading(true);
    const { data } = await supabase.from("quizzes").select("*").eq("id", id).single();
    setLoading(false);
    return data;
  }

  return { getQuiz, loading };
}
