import React, { useEffect, useRef } from "react";
import { View, Pressable, Animated, StyleSheet } from "react-native";
import { useAppTheme } from "@/providers/ThemeProvider";
import { RADIUS } from "@/lib/constants";

export interface SwitchProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/**
 * M3-style switch. Track 52x32, thumb 24x24. ON → primary track / onPrimary thumb;
 * OFF → surfaceContainerHighest track / outline thumb. Thumb animates translateX 0→24.
 */
export function Switch({
  value,
  onValueChange,
  disabled,
  accessibilityLabel,
}: SwitchProps) {
  const { colors } = useAppTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        styles.hit,
        { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: value
              ? colors.primary
              : colors.surfaceContainerHighest,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: value ? colors.onPrimary : colors.outline,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minHeight: 48,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: 52,
    height: 32,
    borderRadius: RADIUS.full,
    padding: 4,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
  },
});
