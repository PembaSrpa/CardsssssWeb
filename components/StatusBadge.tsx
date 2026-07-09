import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from "../theme/typography";

interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <div
      style={{
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        backgroundColor: colors.backgroundAlt,
        alignSelf: "flex-start",
        display: "inline-flex",
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHTS.medium,
          fontSize: FONT_SIZES.xs,
          letterSpacing: 0.5,
          color: colors.textMuted,
        }}
      >
        {label.toUpperCase()}
      </span>
    </div>
  );
}
