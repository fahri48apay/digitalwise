import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS } from "@/lib/constants";

interface DwAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DwAvatar({ uri, name = "", size = 48 }: DwAvatarProps) {
  const { colors } = useAppTheme();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primaryContainer,
        },
      ]}
    >
      <Text
        style={{
          color: colors.onPrimaryContainer,
          fontSize: size * 0.38,
          fontWeight: "600",
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {},
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
