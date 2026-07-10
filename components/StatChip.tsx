import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";

interface StatChipProps {
  label: string;
  value: string;
}

export function StatChip({ label, value }: StatChipProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHTS.medium,
          fontSize: FONT_SIZES.xs,
          color: colors.textMuted,
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHTS.bold,
          fontSize: FONT_SIZES.md,
          color: colors.text,
          marginTop: 2,
        }}
      >
        {value}
      </span>
    </div>
  );
}