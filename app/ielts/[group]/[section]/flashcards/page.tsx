"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import * as Storage from "../../../../../lib/storage";
import { useTheme } from "../../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../../theme/typography";
import { FlashCard } from "../../../../../components/FlashCard";
import { AppButton } from "../../../../../components/AppButton";
import { NavBar } from "../../../../../components/NavBar";
import { ThemeToggle } from "../../../../../components/ThemeToggle";
import { Scales } from "../../../../../components/Scales";
import { SwipeNav } from "../../../../../components/SwipeNav";
import { useIELTSData } from "../../../../../hooks/useIELTSData";
import { UI_STORAGE_KEYS, ieltsListIndexKey } from "../../../../../store/uiStore";

export default function IELTSFlashcardsPage(): React.JSX.Element {
  const { colors } = useTheme();
  const params = useParams<{ group: string; section: string }>();
  const searchParams = useSearchParams();
  const section = params.section ?? "";
  const startParam = parseInt(searchParams.get("start") ?? "0", 10);

  const { words, title, isLoading } = useIELTSData(section);

  const [index, setIndex] = useState<number>(Number.isFinite(startParam) ? startParam : 0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (words.length > 0 && index > words.length - 1) {
      setIndex(words.length - 1);
    }
  }, [words.length, index]);

  useEffect(() => {
    Storage.setItem(ieltsListIndexKey(section), String(index));
    Storage.setItem(UI_STORAGE_KEYS.LAST_IELTS_SECTION, section);
    Storage.setItem(UI_STORAGE_KEYS.LAST_IELTS_INDEX, String(index));
  }, [section, index]);

  const currentWord = words[index];

  const goNext = (): void => {
    setFlipped(false);
    setIndex((prev) => Math.min(prev + 1, words.length - 1));
  };

  const goPrev = (): void => {
    setFlipped(false);
    setIndex((prev) => Math.max(prev - 1, 0));
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

        {currentWord ? (
          <>
            <div style={styles.navRow}>
              <span style={{ ...styles.progressLabel, color: colors.textMuted }}>
                {index + 1} / {words.length}
              </span>
            </div>

            <div style={styles.cardArea}>
              <SwipeNav onSwipeLeft={goNext} onSwipeRight={goPrev}>
                <FlashCard word={currentWord} flipped={flipped} onPress={() => setFlipped((f) => !f)} />
              </SwipeNav>
            </div>

            <div style={styles.actionRow}>
              <AppButton label="&larr; prev" onPress={goPrev} disabled={index === 0} style={styles.actionButton} />
              <AppButton
                label="next &rarr;"
                onPress={goNext}
                disabled={index === words.length - 1}
                style={styles.actionButton}
              />
            </div>
          </>
        ) : (
          <span style={{ ...styles.empty, color: colors.textMuted }}>no cards found</span>
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
  navRow: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  progressLabel: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.sm, textAlign: "center" },
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
};
