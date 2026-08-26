import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ForumPost {
  id: string;
  author_id: string;
  post_type: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  poll_options: any;
  is_pinned: boolean;
  likes_count: number;
  comment_count: number;
  attachment_url: string | null;
  created_at: string;
  profiles?: { display_name: string; username: string; avatar_url: string | null };
}

interface ForumComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_mentor_answer: boolean;
  likes_count: number;
  attachment_url: string | null;
  created_at: string;
  profiles?: { display_name: string; username: string };
}

export function useForum() {
  const [loading, setLoading] = useState(true);

  const getPosts = useCallback(async (category?: string) => {
    setLoading(true);
    let query = supabase
      .from("forum_posts")
      .select("*, profiles(display_name, username, avatar_url)")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    setLoading(false);
    return (data || []) as ForumPost[];
  }, []);

  const getPost = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("forum_posts")
      .select("*, profiles(display_name, username, avatar_url)")
      .eq("id", id)
      .single();
    return data as ForumPost | null;
  }, []);

  const getComments = useCallback(async (postId: string) => {
    const { data } = await supabase
      .from("forum_comments")
      .select("*, profiles(display_name, username)")
      .eq("post_id", postId)
      .order("is_mentor_answer", { ascending: false })
      .order("created_at", { ascending: true });
    return (data || []) as ForumComment[];
  }, []);

  const createPost = useCallback(async (input: {
    author_id: string;
    post_type: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    attachment_url?: string;
  }) => {
    const { data, error } = await supabase.from("forum_posts").insert(input).select().single();
    return { data, error };
  }, []);

  const createComment = useCallback(async (input: {
    post_id: string;
    author_id: string;
    content: string;
    attachment_url?: string;
  }) => {
    const { data, error } = await supabase.from("forum_comments").insert(input).select().single();
    if (!error) {
      await supabase.rpc("increment_field", {
        table_name: "forum_posts",
        field_name: "comment_count",
        row_id: input.post_id,
      }).catch(() => {});
    }
    return { data, error };
  }, []);

  const likePost = useCallback(async (postId: string) => {
    await supabase.rpc("increment_field", {
      table_name: "forum_posts",
      field_name: "likes_count",
      row_id: postId,
    }).catch(() => {});
  }, []);

  return { getPosts, getPost, getComments, createPost, createComment, likePost, loading };
}
