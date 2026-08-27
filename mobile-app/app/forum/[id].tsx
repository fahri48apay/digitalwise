import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForum } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { useUpload } from "@/hooks/useUpload";
import { useAppTheme } from "@/providers/ThemeProvider";
import { DwCard, DwChip, DwAvatar, DwIcon } from "@/components/ui";
import { TYPOGRAPHY, SPACING, RADIUS } from "@/lib/constants";

const categoryColors: Record<string, string> = {
  keamanan_siber: "error",
  privasi_data: "primary",
  etika_digital: "tertiary",
  general: "outline",
};

export default function ForumPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { getPost, getComments, createComment, likePost } = useForum();
  const { profile } = useProfile();
  const { pickImage, upload, loading: uploading } = useUpload();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const postData = await getPost(id);
      setPost(postData);
      const commentData = await getComments(id);
      setComments(commentData);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleComment = async () => {
    if (!profile || !newComment.trim() || !id) return;

    let attachmentUrl: string | undefined;
    if (commentImage) {
      const uploaded = await upload(commentImage, profile.id, "forum");
      if (uploaded) attachmentUrl = uploaded.url;
    }

    const { data } = await createComment({
      post_id: id,
      author_id: profile.id,
      content: newComment.trim(),
      attachment_url: attachmentUrl,
    });
    if (data) {
      setComments((prev) => [
        ...prev,
        { ...data, profiles: { display_name: profile.display_name, username: profile.username } },
      ]);
      setNewComment("");
      setCommentImage(null);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    await likePost(id);
    setPost((prev: any) => (prev ? { ...prev, likes_count: prev.likes_count + 1 } : prev));
  };

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result && !result.canceled && result.assets[0]) {
      setCommentImage(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>Memuat...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant }]}>Post tidak ditemukan</Text>
      </View>
    );
  }

  const colorKey = categoryColors[post.category] ?? "outline";
  const postCatColor = (colors as any)[colorKey] || colors.outline;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <DwCard style={styles.postCard}>
            {/* Author row */}
            <View style={styles.authorRow}>
              <DwAvatar
                uri={post.profiles?.avatar_url}
                name={post.profiles?.display_name || "Anonim"}
                size={32}
              />
              <View style={{ flex: 1 }}>
                <Text style={[TYPOGRAPHY.labelLg, { color: colors.onSurface }]}>
                  {post.profiles?.display_name || "Anonim"}
                </Text>
              </View>
              <DwChip label={post.category} color={postCatColor} style={{ borderRadius: 12 }} />
            </View>

            {/* Title */}
            <Text style={[TYPOGRAPHY.titleLg, { color: colors.onSurface, marginTop: SPACING.md }]}>
              {post.title}
            </Text>

            {/* Content */}
            <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant, marginTop: SPACING.sm }]}>
              {post.content}
            </Text>

            {/* Attachment */}
            {post.attachment_url && (
              <Image
                source={{ uri: post.attachment_url }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable onPress={handleLike} style={styles.actionBtn} accessibilityLabel="Suka">
                <Ionicons name="heart-outline" size={18} color={colors.onSurfaceVariant} />
                <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                  {post.likes_count}
                </Text>
              </Pressable>
              <View style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.onSurfaceVariant} />
                <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurfaceVariant }]}>
                  {comments.length}
                </Text>
              </View>
            </View>
          </DwCard>
        }
        renderItem={({ item }) => (
          <DwCard variant="elevated" style={styles.commentCard}>
            {/* Comment author */}
            <View style={styles.commentMeta}>
              <Text style={[TYPOGRAPHY.labelMd, { color: colors.onSurface }]}>
                {item.profiles?.display_name || "Anonim"}
              </Text>
              {item.is_mentor_answer && (
                <DwChip
                  label="Jawaban Mentor"
                  color={colors.success}
                  style={{ borderRadius: 12 }}
                />
              )}
            </View>
            {/* Comment content */}
            <Text style={[TYPOGRAPHY.bodyMd, { color: colors.onSurfaceVariant, marginTop: SPACING.xs }]}>
              {item.content}
            </Text>
            {/* Comment attachment */}
            {item.attachment_url && (
              <Image
                source={{ uri: item.attachment_url }}
                style={styles.commentImage}
                resizeMode="cover"
              />
            )}
          </DwCard>
        )}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xl }}
      />

      {/* Comment input bar */}
      {commentImage && (
        <View style={[styles.imagePreview, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: commentImage }} style={styles.previewImage} />
          <Pressable onPress={() => setCommentImage(null)} accessibilityLabel="Hapus gambar">
            <Ionicons name="close-circle" size={16} color={colors.error} />
          </Pressable>
        </View>
      )}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
        <Pressable onPress={handlePickImage} style={styles.attachBtn} accessibilityLabel="Lampirkan gambar">
          <Ionicons name="image-outline" size={22} color={colors.onSurfaceVariant} />
        </Pressable>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Tulis komentar..."
          placeholderTextColor={colors.outline}
          style={[styles.textInput, TYPOGRAPHY.bodyMd, { color: colors.onSurface }]}
        />
        <Pressable
          onPress={handleComment}
          disabled={(!newComment.trim() && !commentImage) || uploading}
          style={[
            styles.sendBtn,
            {
              backgroundColor:
                newComment.trim() || commentImage ? colors.primary : colors.surfaceContainerHigh,
            },
          ]}
          accessibilityLabel="Kirim komentar"
        >
          <Text
            style={[
              TYPOGRAPHY.labelMd,
              {
                color:
                  newComment.trim() || commentImage ? colors.onPrimary : colors.onSurfaceVariant,
              },
            ]}
          >
            Kirim
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  postCard: { marginBottom: SPACING.md },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.md,
  },
  actions: {
    flexDirection: "row",
    marginTop: SPACING.md,
    gap: SPACING.xl,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  commentCard: { marginBottom: SPACING.sm, borderRadius: RADIUS.sm },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  commentImage: {
    width: "100%",
    height: 120,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.sm,
  },
  imagePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  previewImage: { width: 48, height: 48, borderRadius: RADIUS.xs },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: SPACING.md,
  },
  sendBtn: {
    height: 36,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
});
