"use client";

import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { Pressable } from "./Pressable";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function AppButton({
  label,
  onPress,
  active = false,
  disabled = false,
  style,
}: AppButtonProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        borderWidth: 1.5,
        borderStyle: "solid",
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderColor: disabled ? colors.border : colors.accent,
        backgroundColor: active ? colors.accent : colors.backgroundAlt,
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        ...style,
      })}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHTS.medium,
          fontSize: FONT_SIZES.sm,
          letterSpacing: 0.3,
          color: active ? colors.backgroundAlt : colors.text,
        }}
      >
        {label}
      </span>
    </Pressable>
  );
}
