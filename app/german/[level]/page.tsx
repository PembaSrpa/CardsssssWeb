"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as Storage from "../../../lib/storage";
import { NavBar } from "../../../components/NavBar";
import { Scales } from "../../../components/Scales";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Pressable } from "../../../components/Pressable";
import { ArtikelCard, FeedbackState } from "../../../components/ArtikelCard";
import { GermanArtikel, GermanWord, getGermanLevelWords, shuffleGermanWords } from "../../../hooks/useGermanData";
import { useProgress } from "../../../hooks/useProgress";
import { useTheme } from "../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";
import { UI_STORAGE_KEYS } from "../../../store/uiStore";

export default function GermanGamePage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ level: string }>();
  const searchParams = useSearchParams();
  const level = params.level;

  const { recordGermanAnswer } = useProgress();

  const [words, setWords] = useState<GermanWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getGermanLevelWords(level).then((levelWords) => {
      if (!isMounted) return;
      const shuffled = shuffleGermanWords(levelWords);
      setWords(shuffled);

      const resumeIndex = parseInt(searchParams.get("resumeIndex") ?? "0", 10);
      const resumeScore = parseInt(searchParams.get("resumeScore") ?? "0", 10);
      const resumeStreak = parseInt(searchParams.get("resumeStreak") ?? "0", 10);

      setIndex(Number.isFinite(resumeIndex) && resumeIndex < shuffled.length ? resumeIndex : 0);
      setScore(Number.isFinite(resumeScore) ? resumeScore : 0);
      setStreak(Number.isFinite(resumeStreak) ? resumeStreak : 0);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const currentWord = words[index];

  const persistPosition = async (nextIndex: number, nextScore: number, nextStreak: number): Promise<void> => {
    await Promise.all([
      Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_LEVEL, level),
      Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_INDEX, String(nextIndex)),
      Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_SCORE, String(nextScore)),
      Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_STREAK, String(nextStreak)),
    ]);
  };

  const handleSwipe = (chosenArtikel: GermanArtikel): void => {
    if (!currentWord || feedback !== "idle") return;

    const wasCorrect = chosenArtikel === currentWord.artikel;
    setFeedback(wasCorrect ? "correct" : "incorrect");
    recordGermanAnswer(currentWord.id, wasCorrect);

    const nextScore = wasCorrect ? score + 1 : score;
    const nextStreak = wasCorrect ? streak + 1 : 0;

    setTimeout(() => {
      const nextIndex = index + 1;
      setScore(nextScore);
      setStreak(nextStreak);
      setIndex(nextIndex);
      setFeedback("idle");
      persistPosition(nextIndex, nextScore, nextStreak);
    }, 500);
  };

  const restart = (): void => {
    const shuffled = shuffleGermanWords(words);
    setWords(shuffled);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback("idle");
    persistPosition(0, 0, 0);
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.root, backgroundColor: colors.background }}>
        <div style={styles.content}>
          <NavBar title={level} right={<ThemeToggle />} />
        </div>
      </div>
    );
  }

  const isFinished = index >= words.length;

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title={level} right={<ThemeToggle />} />

        <div style={styles.statsRow}>
          <StatChip label="SCORE" value={`${score}`} colors={colors} />
          <StatChip label="STREAK" value={`${streak}`} colors={colors} />
          <StatChip label="CARD" value={`${Math.min(index + 1, words.length)}/${words.length}`} colors={colors} />
        </div>

        {isFinished ? (
          <div style={styles.finishedBox}>
            <span style={{ ...styles.finishedTitle, color: colors.text }}>Deck complete</span>
            <span style={{ ...styles.finishedScore, color: colors.textMuted }}>
              {score} / {words.length} correct
            </span>
            <div style={styles.finishedActions}>
              <Pressable
                onPress={restart}
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
                <span style={{ ...styles.finishedBtnLabel, color: colors.accent }}>Play again</span>
              </Pressable>
              <Pressable
                onPress={() => router.push("/german")}
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
                <span style={{ ...styles.finishedBtnLabel, color: colors.text }}>Choose level</span>
              </Pressable>
            </div>
          </div>
        ) : (
          currentWord && (
            <ArtikelCard
              word={currentWord.word}
              meaning={currentWord.meaning}
              correctArtikel={currentWord.artikel}
              feedbackState={feedback}
              onSwipe={handleSwipe}
            />
          )
        )}
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: { border: string; backgroundAlt: string; textMuted: string; text: string };
}): React.JSX.Element {
  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.xs, color: colors.textMuted, letterSpacing: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.md, color: colors.text, marginTop: 2 }}>
        {value}
      </span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 480, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  statsRow: { display: "flex", flexDirection: "row", gap: 10, marginBottom: 28 },
  finishedBox: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 60 },
  finishedTitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.xl },
  finishedScore: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.md, marginTop: 8 },
  finishedActions: { display: "flex", flexDirection: "row", gap: 12, marginTop: 28 },
  finishedBtnLabel: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.sm },
};
