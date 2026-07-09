"use client";

import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { GlossarWord } from "../hooks/useGlossarData";

interface GlossarCardProps {
  word: GlossarWord;
  flipped: boolean;
  onPress: () => void;
}

export function GlossarCard({ word, flipped, onPress }: GlossarCardProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div
      onClick={onPress}
      role="button"
      tabIndex={0}
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        aspectRatio: 0.72,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        perspective: 1200,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transition: "transform 300ms ease",
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
        }}
      >
        <div
          style={{
            ...styles.face,
            borderColor: colors.border,
            backgroundColor: colors.backgroundAlt,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <span style={{ ...styles.word, color: colors.text }}>{word.word}</span>
          {!!word.plural && <span style={{ ...styles.plural, color: colors.textMuted }}>Pl. {word.plural}</span>}
          <span style={{ ...styles.hint, color: colors.textMuted }}>tap to flip</span>
        </div>

        <div
          style={{
            ...styles.face,
            ...styles.faceAbsolute,
            borderColor: colors.border,
            backgroundColor: colors.backgroundAlt,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span style={{ ...styles.meaning, color: colors.text }}>{word.meaning}</span>
          {!!word.example && <span style={{ ...styles.example, color: colors.textMuted }}>{word.example}</span>}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  face: {
    position: "absolute",
    inset: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  faceAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  word: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xl,
    textAlign: "center",
  },
  plural: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    textAlign: "center",
    marginTop: 6,
  },
  hint: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.xs,
    textAlign: "center",
    marginTop: 12,
  },
  meaning: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.md,
    textAlign: "center",
  },
  example: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontStyle: "italic",
    fontSize: FONT_SIZES.sm,
    marginTop: 12,
    lineHeight: "20px",
    textAlign: "center",
  },
};
