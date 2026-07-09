"use client";

import { useEffect, useState } from "react";

export type GermanArtikel = "der" | "die" | "das";

export interface GermanWord {
  id: string;
  word: string;
  artikel: GermanArtikel;
  meaning: string;
}

export interface GermanLevelData {
  level: string;
  words: GermanWord[];
}

export interface UseGermanDataResult {
  words: GermanWord[];
  level: string;
  isLoading: boolean;
}

const GERMAN_DATA_MAP: Record<string, () => Promise<GermanLevelData>> = {
  A1: () => import("../data/german_A1.json").then((m) => m.default as GermanLevelData),
  A2: () => import("../data/german_A2.json").then((m) => m.default as GermanLevelData),
  B1: () => import("../data/german_B1.json").then((m) => m.default as GermanLevelData),
};

export const AVAILABLE_GERMAN_LEVELS: string[] = Object.keys(GERMAN_DATA_MAP);

const levelCache: { [key: string]: GermanLevelData } = {};

async function loadLevel(level: string): Promise<GermanLevelData | null> {
  if (levelCache[level]) {
    return levelCache[level];
  }

  const loader = GERMAN_DATA_MAP[level];
  if (!loader) {
    return null;
  }

  const data = await loader();
  levelCache[level] = data;
  return data;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export async function getGermanLevelWords(level: string): Promise<GermanWord[]> {
  const data = await loadLevel(level);
  return data?.words ?? [];
}

export function shuffleGermanWords<T>(items: T[]): T[] {
  return shuffle(items);
}

export function useGermanData(level: string): UseGermanDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [words, setWords] = useState<GermanWord[]>([]);
  const [resolvedLevel, setResolvedLevel] = useState<string>(level);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadLevel(level).then((data) => {
      if (!isMounted) {
        return;
      }
      setWords(shuffle(data?.words ?? []));
      setResolvedLevel(data?.level ?? level);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [level]);

  return {
    words,
    level: resolvedLevel,
    isLoading,
  };
}
