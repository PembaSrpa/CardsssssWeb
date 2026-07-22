"use client";

import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { StatusBadge } from "./StatusBadge";
import { IELTSSpeakingQuestion } from "../hooks/useIELTSSpeakingData";

interface SpeakingCardProps {
  item: IELTSSpeakingQuestion;
  flipped: boolean;
  onPress: () => void;
}

function partLabel(part: number): string {
  if (part === 2) {
    return "PART 2 - CUE CARD";
  }
  return `PART ${part}`;
}

export function SpeakingCard({ item, flipped, onPress }: SpeakingCardProps): React.JSX.Element {
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
        height: 560,
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
          <StatusBadge label={partLabel(item.part)} />
          <div style={styles.scrollContent}>
            <span style={{ ...styles.question, color: colors.text }}>{item.question}</span>
            {!!item.cueCardPoints && item.cueCardPoints.length > 0 && (
              <div style={styles.cuePoints}>
                <span style={{ ...styles.cueLabel, color: colors.textMuted }}>You should say:</span>
                {item.cueCardPoints.map((point, idx) => (
                  <span key={idx} style={{ ...styles.cueItem, color: colors.textMuted }}>
                    {`\u2022 ${point}`}
                  </span>
                ))}
              </div>
            )}
          </div>
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
          <StatusBadge label="EXAMPLE ANSWER" />
          <div style={styles.scrollContent}>
            <span style={{ ...styles.answer, color: colors.text }}>{item.answer}</span>
          </div>
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
  },
  faceAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
  question: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    lineHeight: "28px",
    whiteSpace: "pre-line",
  },
  cuePoints: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
  },
  cueLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.sm,
    marginBottom: 6,
  },
  cueItem: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: "20px",
    marginBottom: 4,
  },
  hint: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.xs,
    textAlign: "center",
    marginTop: 8,
    display: "block",
  },
  answer: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: "22px",
  },
};
