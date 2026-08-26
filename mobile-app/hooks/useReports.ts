import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ReportInput {
  category: string;
  title: string;
  description: string;
  evidence_urls?: string[];
}

export function useReports() {
  const [loading, setLoading] = useState(false);

  const submitReport = useCallback(async (input: ReportInput, reporterId: string) => {
    setLoading(true);
    const { error } = await supabase.from("reports").insert({
      reporter_id: reporterId,
      category: input.category,
      title: input.title,
      description: input.description,
      evidence_urls: input.evidence_urls || [],
    });
    setLoading(false);
    return { error };
  }, []);

  const getMyReports = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("reporter_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  }, []);

  return { submitReport, getMyReports, loading };
}
