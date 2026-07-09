"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { Pressable } from "./Pressable";

export function ThemeToggle(): React.JSX.Element {
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <Pressable onPress={toggleTheme} ariaLabel="Toggle theme">
      {({ pressed }) => (
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.border,
            backgroundColor: colors.backgroundAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          }}
        >
          {mode === "dark" ? <Moon size={18} color={colors.text} /> : <Sun size={18} color={colors.text} />}
        </div>
      )}
    </Pressable>
  );
}
