"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../../components/NavBar";
import { Scales } from "../../components/Scales";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Pressable } from "../../components/Pressable";
import {
  GLOSSAR_LEVELS,
  GLOSSAR_KAPITEL_COUNT,
  GlossarLevel,
  isB2Level,
  getGlossarLevelLabel,
} from "../../hooks/useGlossarData";
import { useTheme } from "../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../theme/typography";

export default function GlossarLevelPage(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title="Deutsch Glossaries" right={<ThemeToggle />} />
        {GLOSSAR_LEVELS.map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}

function LevelCard({ level }: { level: GlossarLevel }): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const kapitelCount = GLOSSAR_KAPITEL_COUNT[level];

  return (
    <Pressable
      onPress={() => router.push(`/glossar/${level}`)}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <span style={{ ...styles.levelCode, color: colors.text }}>{getGlossarLevelLabel(level)}</span>
      <span style={{ ...styles.count, color: colors.textMuted }}>
        {kapitelCount} Kapitel{isB2Level(level) ? " \u00b7 4 Module each" : ""}
      </span>
    </Pressable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  levelCode: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.lg, display: "block" },
  count: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs, marginTop: 8, display: "block" },
};
