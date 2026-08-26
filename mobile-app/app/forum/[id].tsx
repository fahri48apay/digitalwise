import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Text, Card, TextInput, Button, Chip, IconButton } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForum } from "@/hooks/useForum";
import { useProfile } from "@/hooks/useProfile";
import { useUpload } from "@/hooks/useUpload";

const categoryColors: Record<string, string> = {
  keamanan_siber: "#ef4444",
  privasi_data: "#3b82f6",
  etika_digital: "#8b5cf6",
  general: "#767680",
};

export default function ForumPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost, getComments, createComment, likePost } = useForum();
  const { profile } = useProfile();
  const { pickImage, takePhoto, upload, loading: uploading } = useUpload();
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
      setComments(prev => [...prev, { ...data, profiles: { display_name: profile.display_name, username: profile.username } }]);
      setNewComment("");
      setCommentImage(null);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    await likePost(id);
    setPost((prev: any) => prev ? { ...prev, likes_count: prev.likes_count + 1 } : prev);
  };

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result && !result.canceled && result.assets[0]) {
      setCommentImage(result.assets[0].uri);
    }
  };

  if (loading) {
    return <View style={styles.center}><Text>Memuat...</Text></View>;
  }

  if (!post) {
    return <View style={styles.center}><Text>Post tidak ditemukan</Text></View>;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Post */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Card style={styles.postCard}>
            <Card.Content>
              <View style={styles.meta}>
                <Ionicons name="person-circle" size={20} color="#3e4bbe" />
                <Text variant="labelMedium">{post.profiles?.display_name || "Anonim"}</Text>
                <Chip compact style={{ backgroundColor: (categoryColors[post.category] || "#767680") + "20" }}>
                  <Text style={{ color: categoryColors[post.category] || "#767680", fontSize: 10 }}>{post.category}</Text>
                </Chip>
              </View>
              <Text variant="titleLarge" style={{ fontWeight: "bold", marginTop: 8 }}>{post.title}</Text>
              <Text variant="bodyMedium" style={{ marginTop: 8 }}>{post.content}</Text>
              {post.attachment_url && (
                <Image source={{ uri: post.attachment_url }} style={styles.postImage} resizeMode="cover" />
              )}
              <View style={styles.actions}>
                <Button compact icon="heart" onPress={handleLike}>{post.likes_count}</Button>
                <Button compact icon="chatbubble">{comments.length}</Button>
              </View>
            </Card.Content>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={[styles.commentCard, item.is_mentor_answer && styles.mentorCard]}>
            <Card.Content>
              <View style={styles.commentMeta}>
                <Text variant="labelMedium">{item.profiles?.display_name || "Anonim"}</Text>
                {item.is_mentor_answer && <Chip compact style={{ backgroundColor: "#22c55e20" }}><Text style={{ color: "#22c55e", fontSize: 10 }}>Jawaban Mentor</Text></Chip>}
              </View>
              <Text variant="bodyMedium" style={{ marginTop: 4 }}>{item.content}</Text>
              {item.attachment_url && (
                <Image source={{ uri: item.attachment_url }} style={styles.commentImage} resizeMode="cover" />
              )}
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      />

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        {commentImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: commentImage }} style={styles.previewImage} />
            <IconButton icon="close-circle" size={16} iconColor="#ef4444" onPress={() => setCommentImage(null)} />
          </View>
        )}
        <View style={styles.inputRow}>
          <IconButton icon="image" size={20} onPress={handlePickImage} />
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Tulis komentar..."
            mode="outlined"
            style={styles.input}
            dense
          />
          <Button mode="contained" onPress={handleComment} disabled={(!newComment.trim() && !commentImage) || uploading} style={styles.sendBtn}>
            Kirim
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf8fe" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  postCard: { marginBottom: 12 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8 },
  postImage: { width: "100%", height: 200, borderRadius: 8, marginTop: 12 },
  actions: { flexDirection: "row", marginTop: 12 },
  commentCard: { marginBottom: 8 },
  mentorCard: { borderColor: "#22c55e", borderWidth: 1 },
  commentMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  commentImage: { width: "100%", height: 120, borderRadius: 8, marginTop: 8 },
  inputContainer: { backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e5e7eb", padding: 8 },
  imagePreview: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingBottom: 4 },
  previewImage: { width: 48, height: 48, borderRadius: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  input: { flex: 1 },
  sendBtn: { marginTop: 0 },
});
