"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { NavBar } from "../../components/NavBar";
import { Scales } from "../../components/Scales";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Pressable } from "../../components/Pressable";
import { useTheme } from "../../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../../theme/typography";

interface Creator {
  name: string;
  nickname: string;
  url: string;
}

const CREATORS: Creator[] = [
  { name: "Pemba", nickname: "arttfolio", url: "https://artt-folio.vercel.app" },
  { name: "Pranay", nickname: "frankeinstein", url: "https://github.com/Frankenstein489" },
];

interface OtherProject {
  title: string;
  url: string;
}

const OTHER_PROJECTS: OtherProject[] = [
  { title: "Schatten Lesen", url: "https://schatten-lesen.vercel.app/" },
  { title: "Memento Mori", url: "https://memento-mori-jet.vercel.app/" },
  { title: "Want A Resume?", url: "https://want-a-resume.vercel.app/" },
];

export default function CreatorsPage(): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div style={{ ...styles.root, backgroundColor: colors.background }}>
      <Scales variant="compact" edges={["left", "right"]} />
      <div style={styles.content}>
        <NavBar title="View Creators" right={<ThemeToggle />} />

        {CREATORS.map((creator) => (
          <Pressable
            key={creator.name}
            onPress={() => window.open(creator.url, "_blank", "noopener,noreferrer")}
            style={({ pressed }) => ({
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.border,
              backgroundColor: colors.backgroundAlt,
              borderRadius: 16,
              padding: 18,
              marginBottom: 12,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <span style={{ ...styles.creatorName, color: colors.text }}>{creator.name}</span>
            <span style={{ ...styles.creatorNickname, color: colors.textMuted }}>@{creator.nickname}</span>
          </Pressable>
        ))}

        <span style={{ ...styles.sectionLabel, color: colors.textMuted }}>
          OTHER PROJECTS FROM CREATOR: PEMBA
        </span>

        {OTHER_PROJECTS.map((project) => (
          <Pressable
            key={project.title}
            onPress={() => window.open(project.url, "_blank", "noopener,noreferrer")}
            style={({ pressed }) => ({
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.border,
              backgroundColor: colors.backgroundAlt,
              borderRadius: 12,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 16,
              paddingRight: 16,
              marginBottom: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <span style={{ ...styles.projectTitle, color: colors.text }}>{project.title}</span>
            <ExternalLink size={16} color={colors.textMuted} />
          </Pressable>
        ))}

        <Pressable onPress={() => window.open("https://artt-folio.vercel.app/projects", "_blank", "noopener,noreferrer")}>
          <span style={{ ...styles.note, color: colors.textMuted }}>See more on ArttFolio &rarr;</span>
        </Pressable>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh" },
  content: { maxWidth: 640, margin: "0 auto", paddingLeft: 32, paddingRight: 32, paddingTop: 56, paddingBottom: 40 },
  creatorName: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.lg, display: "block" },
  creatorNickname: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
    display: "block",
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
  projectTitle: { fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHTS.medium, fontSize: FONT_SIZES.md },
  note: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 16,
    textAlign: "center",
    display: "block",
  },
};
