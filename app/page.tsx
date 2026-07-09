"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import * as Storage from "../lib/storage";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { ThemeToggle } from "../components/ThemeToggle";
import { Scales } from "../components/Scales";
import { Pressable } from "../components/Pressable";
import { UI_STORAGE_KEYS } from "../store/uiStore";
import { getSectionGroupId } from "../hooks/useIELTSData";

interface LastPosition {
  ieltsSection: string | null;
  ieltsIndex: number;
  germanLevel: string | null;
  germanIndex: number;
  germanScore: number;
  germanStreak: number;
  glossarLevel: string | null;
  glossarKapitel: string | null;
  glossarModule: string | null;
  glossarIndex: number;
}

const EMPTY_POSITION: LastPosition = {
  ieltsSection: null,
  ieltsIndex: 0,
  germanLevel: null,
  germanIndex: 0,
  germanScore: 0,
  germanStreak: 0,
  glossarLevel: null,
  glossarKapitel: null,
  glossarModule: null,
  glossarIndex: 0,
};

export default function HomePage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const [lastPos, setLastPos] = useState<LastPosition>(EMPTY_POSITION);

  useEffect(() => {
    let isMounted = true;

    async function loadLastPos(): Promise<void> {
      const [
        ieltsSection,
        ieltsIndexRaw,
        germanLevel,
        germanIndexRaw,
        germanScoreRaw,
        germanStreakRaw,
        glossarLevel,
        glossarKapitel,
        glossarModule,
        glossarIndexRaw,
      ] = await Promise.all([
        Storage.getItem(UI_STORAGE_KEYS.LAST_IELTS_SECTION),
        Storage.getItem(UI_STORAGE_KEYS.LAST_IELTS_INDEX),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_LEVEL),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_INDEX),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_SCORE),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GERMAN_STREAK),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GLOSSAR_LEVEL),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GLOSSAR_KAPITEL),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GLOSSAR_MODULE),
        Storage.getItem(UI_STORAGE_KEYS.LAST_GLOSSAR_INDEX),
      ]);
      if (isMounted) {
        setLastPos({
          ieltsSection,
          ieltsIndex: ieltsIndexRaw ? parseInt(ieltsIndexRaw, 10) : 0,
          germanLevel,
          germanIndex: germanIndexRaw ? parseInt(germanIndexRaw, 10) : 0,
          germanScore: germanScoreRaw ? parseInt(germanScoreRaw, 10) : 0,
          germanStreak: germanStreakRaw ? parseInt(germanStreakRaw, 10) : 0,
          glossarLevel,
          glossarKapitel,
          glossarModule,
          glossarIndex: glossarIndexRaw ? parseInt(glossarIndexRaw, 10) : 0,
        });
      }
    }

    loadLastPos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={{ ...styles.title, color: colors.text }}>Cardsssss</span>
          <div style={styles.headerControls}>
            <Pressable onPress={() => router.push("/creators")} ariaLabel="View creators">
              {({ pressed }) => (
                <div
                  style={{
                    ...styles.creatorsBtn,
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundAlt,
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  <Users size={18} color={colors.text} />
                </div>
              )}
            </Pressable>
            <ThemeToggle />
          </div>
        </div>

        <span style={{ ...styles.sectionLabel, color: colors.textMuted }}>MODULE 01</span>
        <ModuleCard
          title="IELTS"
          description="flashcards"
          onBrowse={() => router.push("/ielts")}
          continueLabel={lastPos.ieltsSection ? `Continue ${lastPos.ieltsSection}` : null}
          onContinue={() =>
            router.push(
              `/ielts/${getSectionGroupId(lastPos.ieltsSection ?? "")}/${lastPos.ieltsSection}/flashcards?start=${lastPos.ieltsIndex}`
            )
          }
        />

        <span style={{ ...styles.sectionLabel, color: colors.textMuted }}>MODULE 02</span>
        <ModuleCard
          title="Deutsch Artikel"
          description="swipecards"
          browseLabel="Choose"
          onBrowse={() => router.push("/german")}
          continueLabel={lastPos.germanLevel ? `Continue ${lastPos.germanLevel}` : null}
          onContinue={() =>
            router.push(
              `/german/${lastPos.germanLevel}?resumeIndex=${lastPos.germanIndex}&resumeScore=${lastPos.germanScore}&resumeStreak=${lastPos.germanStreak}`
            )
          }
        />

        <span style={{ ...styles.sectionLabel, color: colors.textMuted }}>MODULE 03</span>
        <ModuleCard
          title="Deutsch Glossaries"
          description="flashcards"
          onBrowse={() => router.push("/glossar")}
          continueLabel={
            lastPos.glossarLevel && lastPos.glossarKapitel
              ? `Continue ${lastPos.glossarLevel} K${lastPos.glossarKapitel}`
              : null
          }
          onContinue={() =>
            router.push(
              lastPos.glossarModule
                ? `/glossar/b2/${lastPos.glossarKapitel}/${lastPos.glossarModule}/flashcards?start=${lastPos.glossarIndex}`
                : `/glossar/${lastPos.glossarLevel}/${lastPos.glossarKapitel}/flashcards?start=${lastPos.glossarIndex}`
            )
          }
        />
      </div>
    </div>
  );
}

function ModuleCard({
  title,
  description,
  onBrowse,
  browseLabel = "Browse",
  continueLabel,
  onContinue,
}: {
  title: string;
  description: string;
  onBrowse: () => void;
  browseLabel?: string;
  continueLabel: string | null;
  onContinue: () => void;
}): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onBrowse}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 16,
        overflow: "hidden",
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <span style={{ ...styles.moduleTitle, color: colors.text }}>{title}</span>
      <span style={{ ...styles.moduleDesc, color: colors.textMuted }}>{description}</span>
      <div style={{ ...styles.moduleFooter, borderTopColor: colors.border }}>
        <Pressable
          onPress={onBrowse}
          style={({ pressed }) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.border,
            borderRadius: 8,
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 12,
            paddingRight: 12,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <span style={{ ...styles.footerBtnLabel, color: colors.text }}>{browseLabel}</span>
        </Pressable>
        {continueLabel && (
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => ({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.accent,
              borderRadius: 8,
              paddingTop: 7,
              paddingBottom: 7,
              paddingLeft: 12,
              paddingRight: 12,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <span style={{ ...styles.footerBtnLabel, color: colors.accent }}>{continueLabel}</span>
          </Pressable>
        )}
      </div>
    </Pressable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
  },
  content: {
    maxWidth: 640,
    margin: "0 auto",
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xxl,
  },
  headerControls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creatorsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderStyle: "solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 1.5,
    marginTop: 28,
    marginBottom: 8,
    display: "block",
  },
  moduleTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    display: "block",
    paddingLeft: 18,
    paddingTop: 18,
  },
  moduleDesc: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    display: "block",
    paddingLeft: 18,
    paddingTop: 4,
    paddingBottom: 16,
  },
  moduleFooter: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    padding: 12,
    gap: 8,
  },
  footerBtnLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xs,
  },
};
