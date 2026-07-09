"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { NavBar } from "../../../../components/NavBar";
import { Scales } from "../../../../components/Scales";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { Pressable } from "../../../../components/Pressable";
import { useGlossarB2Meta } from "../../../../hooks/useGlossarData";
import { getGlossarKapitelTitle } from "../../../../constants/glossarKapitelTitles";
import { useTheme } from "../../../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../../../theme/typography";

export default function GlossarB2ModuleListPage(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams<{ kapitel: string }>();
  const kapitel = params.kapitel ? parseInt(params.kapitel, 10) : 1;

  const { modules, isLoading } = useGlossarB2Meta(kapitel);
  const kapitelTitle = getGlossarKapitelTitle("B2", kapitel);
  const navTitle = kapitelTitle ? `B2 \u00b7 Kapitel ${kapitel} \u00b7 ${kapitelTitle}` : `B2 \u00b7 Kapitel ${kapitel}`;

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title={navTitle} right={<ThemeToggle />} />
        {isLoading ? (
          <span style={{ ...styles.loading, color: colors.textMuted }}>loading&hellip;</span>
        ) : (
          modules.map((mod) => (
            <Pressable
              key={mod.id}
              onPress={() => router.push(`/glossar/b2/${kapitel}/${mod.id}`)}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: colors.border,
                backgroundColor: colors.backgroundAlt,
                borderRadius: 14,
                padding: 18,
                marginBottom: 14,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <span style={{ ...styles.title, color: colors.text }}>{mod.title}</span>
              <span style={{ ...styles.type, color: colors.textMuted }}>flashcards</span>
            </Pressable>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  loading: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.base, marginTop: 40, textAlign: "center", display: "block" },
  title: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.md },
  type: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.regular, fontSize: FONT_SIZES.xs, letterSpacing: 0.5 },
};
