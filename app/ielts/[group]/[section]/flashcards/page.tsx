"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as Storage from "../../../../../lib/storage";
import { useTheme } from "../../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../../theme/typography";
import { FlashCard } from "../../../../../components/FlashCard";
import { SpeakingCard } from "../../../../../components/SpeakingCard";
import { AppButton } from "../../../../../components/AppButton";
import { StatChip } from "../../../../../components/StatChip";
import { NavBar } from "../../../../../components/NavBar";
import { ThemeToggle } from "../../../../../components/ThemeToggle";
import { Scales } from "../../../../../components/Scales";
import { Pressable } from "../../../../../components/Pressable";
import { SwipeNav } from "../../../../../components/SwipeNav";
import { useIELTSData } from "../../../../../hooks/useIELTSData";
import { isIELTSSpeakingSection, useIELTSSpeakingData } from "../../../../../hooks/useIELTSSpeakingData";
import { UI_STORAGE_KEYS, ieltsListIndexKey } from "../../../../../store/uiStore";

export default function IELTSFlashcardsPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ group: string; section: string }>();
  const searchParams = useSearchParams();
  const group = params.group ?? "1";
  const section = params.section ?? "";
  const startParam = parseInt(searchParams.get("start") ?? "0", 10);

  const isSpeaking = isIELTSSpeakingSection(section);
  const vocabData = useIELTSData(section);
  const speakingData = useIELTSSpeakingData(section);

  const title = isSpeaking ? speakingData.title : vocabData.title;
  const isLoading = isSpeaking ? speakingData.isLoading : vocabData.isLoading;
  const itemCount = isSpeaking ? speakingData.questions.length : vocabData.words.length;

  const [index, setIndex] = useState<number>(Number.isFinite(startParam) ? startParam : 0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (itemCount > 0 && index > itemCount) {
      setIndex(itemCount);
    }
  }, [itemCount, index]);

  useEffect(() => {
    Storage.setItem(ieltsListIndexKey(section), String(index));
    Storage.setItem(UI_STORAGE_KEYS.LAST_IELTS_SECTION, section);
    Storage.setItem(UI_STORAGE_KEYS.LAST_IELTS_INDEX, String(index));
  }, [section, index]);

  const isFinished = itemCount > 0 && index >= itemCount;
  const currentWord = vocabData.words[index];
  const currentQuestion = speakingData.questions[index];

  const goNext = (): void => {
    setFlipped(false);
    setIndex((prev) => Math.min(prev + 1, itemCount));
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
        <NavBar title={title || section} right={<ThemeToggle />} />

        {itemCount === 0 ? (
          <span style={{ ...styles.empty, color: colors.textMuted }}>no cards found</span>
        ) : isFinished ? (
          <div style={styles.finishedBox}>
            <span style={{ ...styles.finishedTitle, color: colors.text }}>Section complete</span>
            <span style={{ ...styles.finishedScore, color: colors.textMuted }}>
              {itemCount} / {itemCount} reviewed
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
                onPress={() => router.push(`/ielts/${group}/${section}`)}
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
              <StatChip label="CARD" value={`${index + 1}/${itemCount}`} />
            </div>

            <div style={styles.cardArea}>
              <SwipeNav onSwipeLeft={goNext} onSwipeRight={goPrev}>
                {isSpeaking ? (
                  <SpeakingCard item={currentQuestion} flipped={flipped} onPress={() => setFlipped((f) => !f)} />
                ) : (
                  <FlashCard word={currentWord} flipped={flipped} onPress={() => setFlipped((f) => !f)} />
                )}
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