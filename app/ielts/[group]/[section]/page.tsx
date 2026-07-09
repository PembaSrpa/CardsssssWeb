"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Storage from "../../../../lib/storage";
import { NavBar } from "../../../../components/NavBar";
import { Scales } from "../../../../components/Scales";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { AppButton } from "../../../../components/AppButton";
import { Pressable } from "../../../../components/Pressable";
import { useIELTSData } from "../../../../hooks/useIELTSData";
import { ieltsListIndexKey } from "../../../../store/uiStore";
import { useTheme } from "../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../theme/typography";

export default function IELTSVocabularyListPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ group: string; section: string }>();
  const group = params.group ?? "1";
  const section = params.section ?? "";

  const { words, title, isLoading } = useIELTSData(section);
  const [resumeIndex, setResumeIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    Storage.getItem(ieltsListIndexKey(section)).then((raw) => {
      if (!isMounted) return;
      const parsed = raw ? parseInt(raw, 10) : 0;
      setResumeIndex(parsed > 0 ? parsed : null);
    });
    return () => {
      isMounted = false;
    };
  }, [section]);

  const goToFlashcards = (start: number): void => {
    router.push(`/ielts/${group}/${section}/flashcards?start=${start}`);
  };

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.inner}>
        <NavBar title={title || section} right={<ThemeToggle />} />

        {resumeIndex !== null ? (
          <AppButton
            label={`Continue (${resumeIndex + 1} / ${words.length})`}
            onPress={() => goToFlashcards(resumeIndex)}
            active
            style={styles.startButton}
          />
        ) : (
          <AppButton label="Start Flashcards" onPress={() => goToFlashcards(0)} active style={styles.startButton} />
        )}

        <div style={styles.listContent}>
          {!isLoading && words.length === 0 && <span style={{ ...styles.empty, color: colors.textMuted }}>no words found</span>}
          {words.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => goToFlashcards(index)}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: colors.border,
                backgroundColor: colors.backgroundAlt,
                borderRadius: 10,
                padding: 14,
                marginBottom: 10,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <span
                style={{
                  ...styles.wordText,
                  color: colors.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {item.word}
              </span>
            </Pressable>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  inner: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56 },
  startButton: { marginTop: 8, marginBottom: 16, paddingTop: 22, paddingBottom: 22 },
  listContent: { paddingBottom: 40 },
  wordText: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.sm },
  empty: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.base, textAlign: "center", marginTop: 40, display: "block" },
};
