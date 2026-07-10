"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as Storage from "../../../../../lib/storage";
import { useTheme } from "../../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../../theme/typography";
import { GlossarCard } from "../../../../../components/GlossarCard";
import { AppButton } from "../../../../../components/AppButton";
import { StatChip } from "../../../../../components/StatChip";
import { NavBar } from "../../../../../components/NavBar";
import { ThemeToggle } from "../../../../../components/ThemeToggle";
import { Scales } from "../../../../../components/Scales";
import { Pressable } from "../../../../../components/Pressable";
import { SwipeNav } from "../../../../../components/SwipeNav";
import { useGlossarKapitel, getGlossarLevelLabel } from "../../../../../hooks/useGlossarData";
import { UI_STORAGE_KEYS, glossarListIndexKey } from "../../../../../store/uiStore";

export default function GlossarFlashcardsPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ level: string; kapitel: string }>();
  const searchParams = useSearchParams();
  const level = params.level ?? "";
  const kapitel = params.kapitel ? parseInt(params.kapitel, 10) : 1;
  const startParam = parseInt(searchParams.get("start") ?? "0", 10);

  const { words, isLoading } = useGlossarKapitel(level, kapitel);

  const [index, setIndex] = useState<number>(Number.isFinite(startParam) ? startParam : 0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (words.length > 0 && index > words.length) {
      setIndex(words.length);
    }
  }, [words.length, index]);

  useEffect(() => {
    Storage.setItem(glossarListIndexKey(level, kapitel), String(index));
    Storage.setItem(UI_STORAGE_KEYS.LAST_GLOSSAR_LEVEL, level);
    Storage.setItem(UI_STORAGE_KEYS.LAST_GLOSSAR_KAPITEL, String(kapitel));
    Storage.removeItem(UI_STORAGE_KEYS.LAST_GLOSSAR_MODULE);
    Storage.setItem(UI_STORAGE_KEYS.LAST_GLOSSAR_INDEX, String(index));
  }, [level, kapitel, index]);

  const isFinished = words.length > 0 && index >= words.length;
  const currentWord = words[index];

  const goNext = (): void => {
    setFlipped(false);
    setIndex((prev) => Math.min(prev + 1, words.length));
  };

  const goPrev = (): void => {
    setFlipped(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const reviewAgain = (): void => {
    setFlipped(false);
    setIndex(0);
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.root, backgroundColor: colors.background }}>
        <span style={{ ...styles.loading, color: colors.textMuted }}>loading&hellip;</span>
      </div>
    );
  }

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.inner}>
        <NavBar title={`${getGlossarLevelLabel(level)} \u00b7 Kapitel ${kapitel}`} right={<ThemeToggle />} />

        {words.length === 0 ? (
          <span style={{ ...styles.empty, color: colors.textMuted }}>no cards found</span>
        ) : isFinished ? (
          <div style={styles.finishedBox}>
            <span style={{ ...styles.finishedTitle, color: colors.text }}>Kapitel complete</span>
            <span style={{ ...styles.finishedScore, color: colors.textMuted }}>
              {words.length} / {words.length} reviewed
            </span>
            <div style={styles.finishedActions}>
              <Pressable
                onPress={reviewAgain}
                style={({ pressed }) => ({
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: colors.accent,
                  borderRadius: 8,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <span style={{ ...styles.finishedBtnLabel, color: colors.accent }}>Review again</span>
              </Pressable>
              <Pressable
                onPress={() => router.push(`/glossar/${level}/${kapitel}`)}
                style={({ pressed }) => ({
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <span style={{ ...styles.finishedBtnLabel, color: colors.text }}>Back to list</span>
              </Pressable>
            </div>
          </div>
        ) : (
          <>
            <div style={styles.statsRow}>
              <StatChip label="CARD" value={`${index + 1}/${words.length}`} />
            </div>

            <div style={styles.cardArea}>
              <SwipeNav onSwipeLeft={goNext} onSwipeRight={goPrev}>
                <GlossarCard word={currentWord} flipped={flipped} onPress={() => setFlipped((f) => !f)} />
              </SwipeNav>
            </div>

            <div style={styles.actionRow}>
              <AppButton label="&larr; prev" onPress={goPrev} disabled={index === 0} style={styles.actionButton} />
              <AppButton label="next &rarr;" onPress={goNext} style={styles.actionButton} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  inner: {
    maxWidth: 640,
    margin: "0 auto",
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 56,
    paddingBottom: 24,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  loading: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.base, marginTop: 40, textAlign: "center", display: "block" },
  statsRow: { display: "flex", flexDirection: "row", gap: 10, marginBottom: 16, maxWidth: 200, marginLeft: "auto", marginRight: "auto", width: "100%" },
  cardArea: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  actionRow: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    marginTop: 16,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  actionButton: { flex: 1 },
  empty: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.base, textAlign: "center", marginTop: 60, display: "block" },
  finishedBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  finishedTitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.xl },
  finishedScore: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.md, marginTop: 8 },
  finishedActions: { display: "flex", flexDirection: "row", gap: 12, marginTop: 28 },
  finishedBtnLabel: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.sm },
};