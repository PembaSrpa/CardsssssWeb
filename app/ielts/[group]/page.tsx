"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar } from "../../../components/NavBar";
import { Scales } from "../../../components/Scales";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { Pressable } from "../../../components/Pressable";
import { IELTS_SECTION_GROUPS, useIELTSData } from "../../../hooks/useIELTSData";
import { useTheme } from "../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";

export default function IELTSCategoryPickerPage(): React.JSX.Element {
  const { colors } = useTheme();
  const params = useParams<{ group: string }>();
  const group = IELTS_SECTION_GROUPS.find((g) => g.id === params.group);

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title={group ? `Section ${group.id}` : "Section"} right={<ThemeToggle />} />
        {group?.categories.map((code) => (
          <CategoryRow key={code} groupId={group.id} code={code} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ groupId, code }: { groupId: string; code: string }): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const { words, title } = useIELTSData(code);

  return (
    <Pressable
      onPress={() => router.push(`/ielts/${groupId}/${code}`)}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <span
        style={{
          ...styles.rowTitle,
          color: colors.text,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title || code}
      </span>
      <span style={{ ...styles.rowCount, color: colors.textMuted }}>
        {words.length} {words.length === 1 ? "word" : "words"}
      </span>
    </Pressable>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  rowTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
    marginBottom: 6,
  },
  rowCount: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.sm, display: "block" },
};
