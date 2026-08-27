import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps, Pressable, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/lib/constants";

interface DwInputProps extends TextInputProps {
  label: string;
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onTrailingIconPress?: () => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export function DwInput({
  label,
  trailingIcon,
  onTrailingIconPress,
  error,
  containerStyle,
  ...props
}: DwInputProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.outline;

  return (
    <View style={containerStyle}>
      <Text
        style={[
          TYPOGRAPHY.labelMd,
          { color: error ? colors.error : colors.onSurfaceVariant, marginBottom: SPACING.xs },
        ]}
      >
        {label}
      </Text>
      <View style={[styles.inputWrap, { borderColor, backgroundColor: colors.surface }]}>
        <TextInput
          style={[
            TYPOGRAPHY.bodyLg,
            styles.input,
            trailingIcon && { paddingRight: 48 },
            { color: colors.onSurface },
          ]}
          placeholderTextColor={colors.onSurfaceVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {trailingIcon && (
          <Pressable
            onPress={onTrailingIconPress}
            style={styles.trailingIcon}
            accessibilityLabel="Toggle password visibility"
          >
            <MaterialCommunityIcons
              name={trailingIcon}
              size={22}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[TYPOGRAPHY.labelSm, { color: colors.error, marginTop: SPACING.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: RADIUS.sm,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    height: 52,
  },
  trailingIcon: {
    position: "absolute",
    right: SPACING.sm,
    padding: SPACING.sm,
  },
});
