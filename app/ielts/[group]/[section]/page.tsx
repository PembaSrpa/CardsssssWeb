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
import { isIELTSSpeakingSection, useIELTSSpeakingData } from "../../../../hooks/useIELTSSpeakingData";
import { ieltsListIndexKey } from "../../../../store/uiStore";
import { useTheme } from "../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../theme/typography";

export default function IELTSVocabularyListPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ group: string; section: string }>();
  const group = params.group ?? "1";
  const section = params.section ?? "";

  const isSpeaking = isIELTSSpeakingSection(section);
  const vocabData = useIELTSData(section);
  const speakingData = useIELTSSpeakingData(section);

  const title = isSpeaking ? speakingData.title : vocabData.title;
  const isLoading = isSpeaking ? speakingData.isLoading : vocabData.isLoading;
  const itemCount = isSpeaking ? speakingData.questions.length : vocabData.words.length;

  const rows = isSpeaking
    ? speakingData.questions.map((q) => ({
        id: q.id,
        label: q.question,
        badge: q.part === 2 ? "PART 2" : `PART ${q.part}`,
      }))
    : vocabData.words.map((w) => ({ id: w.id, label: w.word, badge: undefined as string | undefined }));

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
            label={`Continue (${resumeIndex + 1} / ${itemCount})`}
            onPress={() => goToFlashcards(resumeIndex)}
            active
            style={styles.startButton}
          />
        ) : (
          <AppButton label="Start Flashcards" onPress={() => goToFlashcards(0)} active style={styles.startButton} />
        )}

        <div style={styles.listContent}>
          {!isLoading && rows.length === 0 && (
            <span style={{ ...styles.empty, color: colors.textMuted }}>
              {isSpeaking ? "no questions found" : "no words found"}
            </span>
          )}
          {rows.map((item, index) => (
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
              {!!item.badge && (
                <span style={{ ...styles.badge, color: colors.textMuted, display: "block" }}>{item.badge}</span>
              )}
              <span
                style={{
                  ...styles.wordText,
                  color: colors.text,
                  whiteSpace: isSpeaking ? "normal" : "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {item.label}
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
  badge: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.xs, letterSpacing: 1, marginBottom: 4 },
  wordText: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.sm },
  empty: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.base, textAlign: "center", marginTop: 40, display: "block" },
};
