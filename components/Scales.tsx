import React from "react";
import { useTheme } from "../theme/ThemeContext";

export type ScalesVariant = "spacious" | "compact" | "large";

const WIDTH_BY_VARIANT: Record<ScalesVariant, number> = {
  spacious: 24,
  compact: 16,
  large: 36,
};

const STRIPE_GAP = 8;

interface ScalesProps {
  variant?: ScalesVariant;
  edges?: Array<"left" | "right" | "bottom">;
}

function stripeBackground(color: string, orientation: "vertical" | "horizontal"): string {
  const angle = orientation === "vertical" ? "45deg" : "45deg";
  return `repeating-linear-gradient(${angle}, transparent 0px, transparent ${STRIPE_GAP - 1}px, ${color} ${STRIPE_GAP - 1}px, ${color} ${STRIPE_GAP}px)`;
}

export function Scales({ variant = "compact", edges = ["left", "right"] }: ScalesProps = {}): React.JSX.Element {
  const { colors } = useTheme();
  const thickness = WIDTH_BY_VARIANT[variant];
  const hasBottom = edges.includes("bottom");
  const verticalBottomInset = hasBottom ? thickness : 0;

  return (
    <>
      {edges.includes("left") && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: verticalBottomInset,
            width: thickness,
            zIndex: 10,
            pointerEvents: "none",
            borderRight: `1px solid ${colors.border}`,
            backgroundImage: stripeBackground(colors.border, "vertical"),
          }}
        />
      )}
      {edges.includes("right") && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: verticalBottomInset,
            width: thickness,
            zIndex: 10,
            pointerEvents: "none",
            borderLeft: `1px solid ${colors.border}`,
            backgroundImage: stripeBackground(colors.border, "vertical"),
          }}
        />
      )}
      {hasBottom && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: thickness,
            zIndex: 10,
            pointerEvents: "none",
            borderTop: `1px solid ${colors.border}`,
            backgroundImage: stripeBackground(colors.border, "horizontal"),
          }}
        />
      )}
    </>
  );
}