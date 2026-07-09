"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { GermanArtikel } from "../hooks/useGermanData";

export type FeedbackState = "idle" | "correct" | "incorrect";

const FEEDBACK_CORRECT = "#22c55e";
const FEEDBACK_INCORRECT = "#ef4444";

const GENDER_COLORS: Record<GermanArtikel, string> = {
  der: "#3b82f6",
  die: "#ef4444",
  das: "#22c55e",
};

interface ArtikelCardProps {
  word: string;
  meaning: string;
  correctArtikel: GermanArtikel;
  feedbackState: FeedbackState;
  onSwipe: (artikel: GermanArtikel) => void;
}

const SWIPE_THRESHOLD = 100;

export function ArtikelCard({
  word,
  meaning,
  correctArtikel,
  feedbackState,
  onSwipe,
}: ArtikelCardProps): React.JSX.Element {
  const { colors } = useTheme();

  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [borderVisible, setBorderVisible] = useState<boolean>(false);

  const dragOrigin = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (feedbackState !== "idle") {
      setBorderVisible(true);
      const hideTimer = setTimeout(() => setBorderVisible(false), 600);
      setTranslate({ x: 0, y: 0 });
      return () => clearTimeout(hideTimer);
    }
  }, [feedbackState]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (feedbackState !== "idle") {
      return;
    }
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!dragOrigin.current) {
      return;
    }
    setTranslate({
      x: event.clientX - dragOrigin.current.x,
      y: event.clientY - dragOrigin.current.y,
    });
  };

  const handlePointerUp = (): void => {
    if (!dragOrigin.current) {
      return;
    }
    dragOrigin.current = null;
    setDragging(false);

    const { x, y } = translate;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > SWIPE_THRESHOLD && absX > absY) {
      const direction: GermanArtikel = x > 0 ? "das" : "der";
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 800;
      setTranslate({ x: x > 0 ? screenWidth : -screenWidth, y });
      onSwipe(direction);
    } else if (y > SWIPE_THRESHOLD && absY > absX) {
      setTranslate({ x, y: 600 });
      onSwipe("die");
    } else {
      setTranslate({ x: 0, y: 0 });
    }
  };

  const isCorrect = feedbackState === "correct";
  const rotation = translate.x / 20;

  return (
    <div style={styles.wrapper}>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          ...styles.card,
          backgroundColor: colors.backgroundAlt,
          borderColor: colors.border,
          transform: `translate(${translate.x}px, ${translate.y}px) rotate(${rotation}deg)`,
          transition: dragging ? "none" : "transform 250ms ease",
          touchAction: "none",
          cursor: feedbackState === "idle" ? "grab" : "default",
        }}
      >
        <div
          style={{
            ...styles.feedbackBorder,
            opacity: borderVisible ? 1 : 0,
            borderColor: isCorrect ? FEEDBACK_CORRECT : FEEDBACK_INCORRECT,
            transition: "opacity 600ms ease",
          }}
        />
        <span style={{ ...styles.word, color: colors.text }}>{word}</span>
        <span style={{ ...styles.meaning, color: colors.textMuted }}>{meaning}</span>
        {feedbackState !== "idle" && (
          <>
            <span
              style={{
                ...styles.resultMark,
                color: isCorrect ? FEEDBACK_CORRECT : FEEDBACK_INCORRECT,
              }}
            >
              {isCorrect ? "\u2713" : "\u2715"}
            </span>
            <span style={{ ...styles.answerLabel, color: GENDER_COLORS[correctArtikel] }}>
              {correctArtikel} {word}
            </span>
          </>
        )}
      </div>

      <div style={styles.hintRow}>
        <span
          style={{
            ...styles.hintLabel,
            color: GENDER_COLORS.der,
            borderColor: feedbackState !== "idle" && correctArtikel === "der" ? GENDER_COLORS.der : colors.border,
          }}
        >
          &larr; der
        </span>
        <span
          style={{
            ...styles.hintLabel,
            color: GENDER_COLORS.die,
            borderColor: feedbackState !== "idle" && correctArtikel === "die" ? GENDER_COLORS.die : colors.border,
          }}
        >
          &darr; die
        </span>
        <span
          style={{
            ...styles.hintLabel,
            color: GENDER_COLORS.das,
            borderColor: feedbackState !== "idle" && correctArtikel === "das" ? GENDER_COLORS.das : colors.border,
          }}
        >
          das &rarr;
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    width: "100%",
    aspectRatio: 0.9,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    userSelect: "none",
  },
  feedbackBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: "solid",
    pointerEvents: "none",
  },
  word: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xxl,
    textAlign: "center",
  },
  meaning: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    textAlign: "center",
    marginTop: 8,
  },
  resultMark: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xl,
    marginTop: 16,
  },
  answerLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.md,
    marginTop: 8,
    letterSpacing: 1,
  },
  hintRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  hintLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
};
