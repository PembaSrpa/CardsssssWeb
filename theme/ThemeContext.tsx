"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Storage from "../lib/storage";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}

const LIGHT: ThemeColors = {
  background: "#FFFFFF",
  backgroundAlt: "#F5F5F5",
  text: "#262626",
  textMuted: "#404040",
  border: "#D4D4D4",
  accent: "#F97316",
};

const DARK: ThemeColors = {
  background: "#000000",
  backgroundAlt: "#171717",
  text: "#E5E5E5",
  textMuted: "#D4D4D4",
  border: "#262626",
  accent: "#FB923C",
};

const STORAGE_KEY = "cards_theme_mode";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function load(): Promise<void> {
      const stored = await Storage.getItem(STORAGE_KEY);
      if (!isMounted) {
        return;
      }
      if (stored === "light" || stored === "dark") {
        setMode(stored);
      } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setMode("dark");
      }
      setIsLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      Storage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const colors = useMemo<ThemeColors>(() => (mode === "dark" ? DARK : LIGHT), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colors, toggleTheme, isLoading }),
    [mode, colors, toggleTheme, isLoading]
  );

  useEffect(() => {
    document.documentElement.style.backgroundColor = colors.background;
    document.body.style.backgroundColor = colors.background;
  }, [colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
