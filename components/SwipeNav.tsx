"use client";

import React, { useRef, useState } from "react";

interface SwipeNavProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 60;
const DRAG_CLICK_SUPPRESS_THRESHOLD = 10;

export function SwipeNav({ onSwipeLeft, onSwipeRight, children }: SwipeNavProps): React.JSX.Element {
  const [translateX, setTranslateX] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const origin = useRef<number | null>(null);
  const dragDistance = useRef<number>(0);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    origin.current = event.clientX;
    dragDistance.current = 0;
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (origin.current === null) {
      return;
    }
    const delta = event.clientX - origin.current;
    setTranslateX(delta);
    dragDistance.current = Math.abs(delta);
  };

  const handlePointerUp = (): void => {
    if (origin.current === null) {
      return;
    }
    origin.current = null;
    setDragging(false);
    const delta = translateX;
    setTranslateX(0);

    if (delta < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    } else if (delta > SWIPE_THRESHOLD) {
      onSwipeRight();
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (dragDistance.current > DRAG_CLICK_SUPPRESS_THRESHOLD) {
      event.stopPropagation();
      event.preventDefault();
    }
    dragDistance.current = 0;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        transform: `translateX(${translateX}px)`,
        transition: dragging ? "none" : "transform 250ms ease",
        touchAction: "pan-y",
      }}
    >
      {children}
    </div>
  );
}