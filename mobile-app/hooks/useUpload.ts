import { useState } from "react";
import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";

interface UploadResult {
  url: string;
  path: string;
}

interface PickerResult {
  canceled: boolean;
  assets: { uri: string; width?: number; height?: number }[];
}

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.8;

function compressWeb(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Gagal load gambar untuk kompressi"));
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.src = dataUrl;
  });
}

async function uriToBlob(uri: string): Promise<{ blob: Blob; ext: string }> {
  let ext = "jpg";

  if (uri.startsWith("data:")) {
    const match = uri.match(/^data:image\/(\w+);base64,/);
    ext = match?.[1] || "jpg";
    const base64 = uri.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: `image/${ext === "jpg" ? "jpeg" : ext}` });
    return { blob, ext: ext === "jpeg" ? "jpg" : ext };
  }

  // Native file:// or http(s)://
  const extMatch = uri.split(".").pop()?.split("?")[0];
  ext = extMatch || "jpg";

  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    return { blob, ext };
  }

  // Native: read file as base64 via expo-file-system
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const mime = ext === "jpg" ? "jpeg" : ext;
  const blob = new Blob([bytes], { type: `image/${mime}` });
  return { blob, ext };
}

export function useUpload() {
  const [loading, setLoading] = useState(false);

  const pickImage = async (): Promise<PickerResult | null> => {
    if (Platform.OS === "web") {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const raw = reader.result as string;
              const compressed = await compressWeb(raw);
              resolve({ canceled: false, assets: [{ uri: compressed }] });
            } catch (err) {
              console.error("Compress error:", err);
              resolve({ canceled: false, assets: [{ uri: reader.result as string }] });
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }
    const ImagePicker = await import("expo-image-picker");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return null;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: QUALITY,
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
    });
    return result as PickerResult;
  };

  const takePhoto = async (): Promise<PickerResult | null> => {
    if (Platform.OS === "web") {
      return pickImage();
    }
    const ImagePicker = await import("expo-image-picker");
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return null;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: QUALITY,
      maxWidth: MAX_WIDTH,
      maxHeight: MAX_HEIGHT,
    });
    return result as PickerResult;
  };

  const upload = async (uri: string, userId: string, folder: string = "uploads"): Promise<UploadResult | null> => {
    setLoading(true);
    try {
      console.log("[Upload] Converting URI to blob...");
      const { blob, ext } = await uriToBlob(uri);
      console.log("[Upload] Blob ready:", blob.size, "bytes, type:", blob.type);

      const fileName = `${folder}/${userId}/${Date.now()}.${ext}`;
      const mime = ext === "jpg" ? "jpeg" : ext;
      console.log("[Upload] Uploading to:", fileName);

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, blob, { contentType: `image/${mime}` });

      if (error) {
        console.error("[Upload] Supabase error:", JSON.stringify(error));
        Alert.alert("Upload Gagal", `Error: ${error.message}\n\n${error.error || ""}`);
        return null;
      }

      console.log("[Upload] Upload OK, path:", data?.path);

      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
      console.log("[Upload] Public URL:", urlData.publicUrl);
      return { url: urlData.publicUrl, path: fileName };
    } catch (err: any) {
      console.error("[Upload] Exception:", err?.message || String(err));
      Alert.alert("Upload Gagal", err?.message || String(err));
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
