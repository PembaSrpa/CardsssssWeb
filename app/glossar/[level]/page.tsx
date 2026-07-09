"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar } from "../../../components/NavBar";
import { Scales } from "../../../components/Scales";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Pressable } from "../../../components/Pressable";
import {
  GLOSSAR_KAPITEL_COUNT,
  GlossarLevel,
  isB2Level,
  getGlossarKapitelWords,
  getGlossarLevelLabel,
} from "../../../hooks/useGlossarData";
import { getGlossarKapitelTitle } from "../../../constants/glossarKapitelTitles";
import { useTheme } from "../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";

export default function GlossarKapitelListPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ level: string }>();
  const level = params.level ?? "";
  const isB2 = isB2Level(level);
  const kapitelCount = GLOSSAR_KAPITEL_COUNT[level as GlossarLevel] ?? 0;

  const kapitelList = useMemo(() => Array.from({ length: kapitelCount }, (_, i) => i + 1), [kapitelCount]);

  const handlePress = (kapitel: number): void => {
    if (isB2) {
      router.push(`/glossar/b2/${kapitel}`);
    } else {
      router.push(`/glossar/${level}/${kapitel}`);
    }
  };

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title={getGlossarLevelLabel(level)} right={<ThemeToggle />} />
        {kapitelList.map((kapitel) => (
          <KapitelRow key={kapitel} level={level} kapitel={kapitel} isB2={isB2} onPress={() => handlePress(kapitel)} />
        ))}
      </div>
    </div>
  );
}

function KapitelRow({
  level,
  kapitel,
  isB2,
  onPress,
}: {
  level: string;
  kapitel: number;
  isB2: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const { colors } = useTheme();
  const [wordCount, setWordCount] = useState<number | null>(null);
  const title = getGlossarKapitelTitle(level, kapitel);

  useEffect(() => {
    if (isB2) return;
    let isMounted = true;
    getGlossarKapitelWords(level, kapitel).then((words) => {
      if (isMounted) setWordCount(words.length);
    });
    return () => {
      isMounted = false;
    };
  }, [level, kapitel, isB2]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <div style={styles.rowTextGroup}>
        <span style={{ ...styles.rowTitle, color: colors.text, display: "block" }}>Kapitel {kapitel}</span>
        {title ? (
          <span
            style={{
              ...styles.rowSubtitle,
              color: colors.textMuted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {title}
          </span>
        ) : null}
      </div>
      <span style={{ ...styles.rowCount, color: colors.textMuted, whiteSpace: "nowrap" }}>
        {isB2 ? "4 modules" : wordCount !== null ? `${wordCount} ${wordCount === 1 ? "word" : "words"}` : "\u2026"}
      </span>
    </Pressable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  rowTextGroup: { flex: 1, marginRight: 12, minWidth: 0 },
  rowTitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.md },
  rowSubtitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs, marginTop: 2 },
  rowCount: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs },
};
