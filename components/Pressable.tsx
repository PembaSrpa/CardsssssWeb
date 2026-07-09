"use client";

import React, { useState } from "react";

interface PressableRenderState {
  pressed: boolean;
}

type StyleProp = React.CSSProperties | ((state: PressableRenderState) => React.CSSProperties);
type ChildrenProp = React.ReactNode | ((state: PressableRenderState) => React.ReactNode);

export interface PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp;
  children?: ChildrenProp;
  ariaLabel?: string;
}

export function Pressable({
  onPress,
  disabled = false,
  style,
  children,
  ariaLabel,
}: PressableProps): React.JSX.Element {
  const [pressed, setPressed] = useState<boolean>(false);

  const resolvedStyle: React.CSSProperties =
    typeof style === "function" ? style({ pressed }) : style ?? {};

  const resolvedChildren = typeof children === "function" ? children({ pressed }) : children;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) {
          onPress?.();
        }
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onPress?.();
        }
      }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        cursor: disabled ? "default" : "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        ...resolvedStyle,
      }}
    >
      {resolvedChildren}
    </div>
  );
}
