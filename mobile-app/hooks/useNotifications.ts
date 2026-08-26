import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [loading, setLoading] = useState(true);

  const getNotifications = useCallback(async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    setLoading(false);
    return (data || []) as Notification[];
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }, []);

  const markAllAsRead = useCallback(async (userId: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  }, []);

  const getUnreadCount = useCallback(async (userId: string) => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    return count || 0;
  }, []);

  return { getNotifications, markAsRead, markAllAsRead, getUnreadCount, loading };
}
