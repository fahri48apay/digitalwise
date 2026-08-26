import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

interface UploadResult {
  url: string;
  path: string;
}

export function useUpload() {
  const [loading, setLoading] = useState(false);

  const pickImage = async (): Promise<ImagePicker.ImagePickerResult | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return null;
    }
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
    });
  };

  const takePhoto = async (): Promise<ImagePicker.ImagePickerResult | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return null;
    }
    return await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
    });
  };

  const upload = async (uri: string, userId: string, folder: string = "uploads"): Promise<UploadResult | null> => {
    setLoading(true);
    try {
      const ext = uri.split(".").pop() || "jpg";
      const fileName = `${folder}/${userId}/${Date.now()}.${ext}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from("uploads")
        .upload(fileName, blob, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }

      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
      return { url: data.publicUrl, path: fileName };
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadMultiple = async (uris: string[], userId: string, folder: string = "uploads"): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    for (const uri of uris) {
      const result = await upload(uri, userId, folder);
      if (result) results.push(result);
    }
    return results;
  };

  return { pickImage, takePhoto, upload, uploadMultiple, loading };
}
