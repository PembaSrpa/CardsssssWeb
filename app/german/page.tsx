"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Storage from "../../lib/storage";
import { NavBar } from "../../components/NavBar";
import { Scales } from "../../components/Scales";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Pressable } from "../../components/Pressable";
import { AVAILABLE_GERMAN_LEVELS, useGermanData } from "../../hooks/useGermanData";
import { useProgress } from "../../hooks/useProgress";
import { useTheme } from "../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../theme/typography";
import { UI_STORAGE_KEYS } from "../../store/uiStore";

export default function GermanLevelPage(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title="Deutsch Artikel" right={<ThemeToggle />} />
        {AVAILABLE_GERMAN_LEVELS.map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>
    </div>
  );
}

interface ResumeState {
  index: number;
  score: number;
  streak: number;
}

function LevelCard({ level }: { level: string }): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const { words } = useGermanData(level);
  const { getGermanScore } = useProgress();
  const ids = words.map((w) => w.id);
  const score = getGermanScore(level, ids);
  const total = score.correct + score.incorrect;
  const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : null;

  const [resume, setResume] = useState<ResumeState | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const [lastLevel, indexRaw, scoreRaw, streakRaw] = await Promise.all([
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_LEVEL),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_INDEX),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_SCORE),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_STREAK),
      ]);
      if (!isMounted) return;
      const index = indexRaw ? parseInt(indexRaw, 10) : 0;
      if (lastLevel === level && index > 0) {
        setResume({ index, score: scoreRaw ? parseInt(scoreRaw, 10) : 0, streak: streakRaw ? parseInt(streakRaw, 10) : 0 });
      } else {
        setResume(null);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [level]);

  const startFresh = async (): Promise<void> => {
    await Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_LEVEL, level);
    await Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_INDEX, "0");
    await Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_SCORE, "0");
    await Storage.setItem(UI_STORAGE_KEYS.LAST_GERMAN_STREAK, "0");
    router.push(`/german/${level}`);
  };

  const continuePrevious = (): void => {
    if (!resume) return;
    router.push(
      `/german/${level}?resumeIndex=${resume.index}&resumeScore=${resume.score}&resumeStreak=${resume.streak}`
    );
  };

  return (
    <div style={{ ...styles.card, borderColor: colors.border, backgroundColor: colors.backgroundAlt }}>
      <Pressable onPress={resume ? continuePrevious : startFresh}>
        {({ pressed }) => (
          <div style={{ opacity: pressed ? 0.75 : 1 }}>
            <div style={styles.cardTop}>
              <span style={{ ...styles.levelCode, color: colors.text }}>{level}</span>
              <span style={{ ...styles.accuracy, color: colors.textMuted }}>
                {accuracy !== null ? `${accuracy}% accuracy` : "not started"}
              </span>
            </div>
            <span style={{ ...styles.count, color: colors.textMuted }}>{words.length} words</span>
          </div>
        )}
      </Pressable>

      {resume && (
        <div style={{ ...styles.resumeRow, borderTopColor: colors.border }}>
          <Pressable
            onPress={continuePrevious}
            style={({ pressed }) => ({
              flex: 1,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.accent,
              borderRadius: 8,
              paddingTop: 8,
              paddingBottom: 8,
              textAlign: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <span style={{ ...styles.resumeBtnLabel, color: colors.accent }}>Continue (word {resume.index + 1})</span>
          </Pressable>
          <Pressable
            onPress={startFresh}
            style={({ pressed }) => ({
              flex: 1,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.border,
              borderRadius: 8,
              paddingTop: 8,
              paddingBottom: 8,
              textAlign: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <span style={{ ...styles.resumeBtnLabel, color: colors.textMuted }}>Start over</span>
          </Pressable>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  card: { borderWidth: 1, borderStyle: "solid", borderRadius: 14, padding: 18, marginBottom: 14 },
  cardTop: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  levelCode: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.lg },
  accuracy: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs },
  count: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs, marginTop: 8, display: "block" },
  resumeRow: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopStyle: "solid",
  },
  resumeBtnLabel: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.xs },
};
