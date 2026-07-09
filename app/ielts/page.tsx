"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "../../components/NavBar";
import { Scales } from "../../components/Scales";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Pressable } from "../../components/Pressable";
import { IELTS_SECTION_GROUPS } from "../../hooks/useIELTSData";
import { useTheme } from "../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../theme/typography";

export default function IELTSSectionPickerPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title="IELTS" right={<ThemeToggle />} />
        {IELTS_SECTION_GROUPS.map((group) => (
          <Pressable
            key={group.id}
            onPress={() => router.push(`/ielts/${group.id}`)}
            style={({ pressed }) => ({
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.border,
              backgroundColor: colors.backgroundAlt,
              borderRadius: 14,
              padding: 18,
              marginBottom: 14,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <span style={{ ...styles.cardLabel, color: colors.textMuted }}>SECTION {group.id}</span>
            <span style={{ ...styles.cardTitle, color: colors.text }}>{group.title}</span>
            {!!group.subtitle && <span style={{ ...styles.cardSubtitle, color: colors.textMuted }}>{group.subtitle}</span>}
          </Pressable>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  cardLabel: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 1.5,
    marginBottom: 6,
    display: "block",
  },
  cardTitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.md, display: "block" },
  cardSubtitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    display: "block",
  },
};
