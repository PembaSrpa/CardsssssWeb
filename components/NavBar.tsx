"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";
import { Pressable } from "./Pressable";

interface NavBarProps {
  title?: string;
  right?: React.ReactNode;
}

export function NavBar({ title, right }: NavBarProps): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <div style={styles.bar}>
      <Pressable onPress={() => router.back()} ariaLabel="Go back">
        {({ pressed }) => (
          <div
            style={{
              ...styles.backBtn,
              borderColor: colors.border,
              backgroundColor: colors.backgroundAlt,
              opacity: pressed ? 0.7 : 1,
            }}
          >
            <ArrowLeft size={18} color={colors.text} />
          </div>
        )}
      </Pressable>

      {title ? (
        <span
          style={{
            ...styles.title,
            color: colors.text,
          }}
        >
          {title}
        </span>
      ) : (
        <div />
      )}

      <div style={styles.right}>{right ?? <div style={styles.placeholder} />}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderStyle: "solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.base,
    flex: 1,
    textAlign: "center",
    marginLeft: 8,
    marginRight: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  right: {
    width: 38,
    display: "flex",
    justifyContent: "flex-end",
  },
  placeholder: {
    width: 38,
  },
};
