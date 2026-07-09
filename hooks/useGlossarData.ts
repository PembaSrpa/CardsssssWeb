"use client";

import { useEffect, useState } from "react";

export interface GlossarWord {
  id: string;
  word: string;
  plural?: string;
  meaning: string;
  example?: string;
}

export interface GlossarKapitelData {
  level: string;
  kapitel: number;
  moduleId?: string;
  words: GlossarWord[];
}

export const GLOSSAR_LEVELS = ["A1", "A1_OLD", "A2", "B1", "B2"] as const;
export type GlossarLevel = (typeof GLOSSAR_LEVELS)[number];

export const GLOSSAR_KAPITEL_COUNT: Record<GlossarLevel, number> = {
  A1: 12,
  A1_OLD: 12,
  A2: 12,
  B1: 12,
  B2: 10,
};

export const GLOSSAR_LEVEL_LABELS: Partial<Record<string, string>> = {
  A1_OLD: "A1 (old)",
};

export function getGlossarLevelLabel(level: string): string {
  return GLOSSAR_LEVEL_LABELS[level] ?? level;
}

export function isB2Level(level: string): boolean {
  return level === "B2";
}

const GLOSSAR_DATA_MAP: Record<string, () => Promise<GlossarKapitelData>> = {
  "A1_K1": () => import("../data/glossar_A1_K1.json").then((m) => m.default as GlossarKapitelData),
  "A1_K2": () => import("../data/glossar_A1_K2.json").then((m) => m.default as GlossarKapitelData),
  "A1_K3": () => import("../data/glossar_A1_K3.json").then((m) => m.default as GlossarKapitelData),
  "A1_K4": () => import("../data/glossar_A1_K4.json").then((m) => m.default as GlossarKapitelData),
  "A1_K5": () => import("../data/glossar_A1_K5.json").then((m) => m.default as GlossarKapitelData),
  "A1_K6": () => import("../data/glossar_A1_K6.json").then((m) => m.default as GlossarKapitelData),
  "A1_K7": () => import("../data/glossar_A1_K7.json").then((m) => m.default as GlossarKapitelData),
  "A1_K8": () => import("../data/glossar_A1_K8.json").then((m) => m.default as GlossarKapitelData),
  "A1_K9": () => import("../data/glossar_A1_K9.json").then((m) => m.default as GlossarKapitelData),
  "A1_K10": () => import("../data/glossar_A1_K10.json").then((m) => m.default as GlossarKapitelData),
  "A1_K11": () => import("../data/glossar_A1_K11.json").then((m) => m.default as GlossarKapitelData),
  "A1_K12": () => import("../data/glossar_A1_K12.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K1": () => import("../data/glossar_A1_OLD_K1.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K2": () => import("../data/glossar_A1_OLD_K2.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K3": () => import("../data/glossar_A1_OLD_K3.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K4": () => import("../data/glossar_A1_OLD_K4.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K5": () => import("../data/glossar_A1_OLD_K5.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K6": () => import("../data/glossar_A1_OLD_K6.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K7": () => import("../data/glossar_A1_OLD_K7.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K8": () => import("../data/glossar_A1_OLD_K8.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K9": () => import("../data/glossar_A1_OLD_K9.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K10": () => import("../data/glossar_A1_OLD_K10.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K11": () => import("../data/glossar_A1_OLD_K11.json").then((m) => m.default as GlossarKapitelData),
  "A1_OLD_K12": () => import("../data/glossar_A1_OLD_K12.json").then((m) => m.default as GlossarKapitelData),
  "A2_K1": () => import("../data/glossar_A2_K1.json").then((m) => m.default as GlossarKapitelData),
  "A2_K2": () => import("../data/glossar_A2_K2.json").then((m) => m.default as GlossarKapitelData),
  "A2_K3": () => import("../data/glossar_A2_K3.json").then((m) => m.default as GlossarKapitelData),
  "A2_K4": () => import("../data/glossar_A2_K4.json").then((m) => m.default as GlossarKapitelData),
  "A2_K5": () => import("../data/glossar_A2_K5.json").then((m) => m.default as GlossarKapitelData),
  "A2_K6": () => import("../data/glossar_A2_K6.json").then((m) => m.default as GlossarKapitelData),
  "A2_K7": () => import("../data/glossar_A2_K7.json").then((m) => m.default as GlossarKapitelData),
  "A2_K8": () => import("../data/glossar_A2_K8.json").then((m) => m.default as GlossarKapitelData),
  "A2_K9": () => import("../data/glossar_A2_K9.json").then((m) => m.default as GlossarKapitelData),
  "A2_K10": () => import("../data/glossar_A2_K10.json").then((m) => m.default as GlossarKapitelData),
  "A2_K11": () => import("../data/glossar_A2_K11.json").then((m) => m.default as GlossarKapitelData),
  "A2_K12": () => import("../data/glossar_A2_K12.json").then((m) => m.default as GlossarKapitelData),
  "B1_K1": () => import("../data/glossar_B1_K1.json").then((m) => m.default as GlossarKapitelData),
  "B1_K2": () => import("../data/glossar_B1_K2.json").then((m) => m.default as GlossarKapitelData),
  "B1_K3": () => import("../data/glossar_B1_K3.json").then((m) => m.default as GlossarKapitelData),
  "B1_K4": () => import("../data/glossar_B1_K4.json").then((m) => m.default as GlossarKapitelData),
  "B1_K5": () => import("../data/glossar_B1_K5.json").then((m) => m.default as GlossarKapitelData),
  "B1_K6": () => import("../data/glossar_B1_K6.json").then((m) => m.default as GlossarKapitelData),
  "B1_K7": () => import("../data/glossar_B1_K7.json").then((m) => m.default as GlossarKapitelData),
  "B1_K8": () => import("../data/glossar_B1_K8.json").then((m) => m.default as GlossarKapitelData),
  "B1_K9": () => import("../data/glossar_B1_K9.json").then((m) => m.default as GlossarKapitelData),
  "B1_K10": () => import("../data/glossar_B1_K10.json").then((m) => m.default as GlossarKapitelData),
  "B1_K11": () => import("../data/glossar_B1_K11.json").then((m) => m.default as GlossarKapitelData),
  "B1_K12": () => import("../data/glossar_B1_K12.json").then((m) => m.default as GlossarKapitelData),
};

const kapitelCache: { [key: string]: GlossarKapitelData } = {};

export async function getGlossarKapitelWords(level: string, kapitel: number): Promise<GlossarWord[]> {
  const key = `${level}_K${kapitel}`;
  if (!kapitelCache[key]) {
    const loader = GLOSSAR_DATA_MAP[key];
    if (!loader) return [];
    kapitelCache[key] = await loader();
  }
  return kapitelCache[key].words ?? [];
}

export function useGlossarKapitel(level: string, kapitel: number): { words: GlossarWord[]; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [words, setWords] = useState<GlossarWord[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getGlossarKapitelWords(level, kapitel).then((result) => {
      if (!isMounted) return;
      setWords(result);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [level, kapitel]);

  return { words, isLoading };
}

export interface GlossarB2Module {
  id: string;
  title: string;
}

export interface GlossarB2MetaData {
  level: "B2";
  kapitel: number;
  modules: GlossarB2Module[];
}

const GLOSSAR_B2_META_MAP: Record<string, () => Promise<GlossarB2MetaData>> = {
  "1": () => import("../data/glossar_B2_K1_meta.json").then((m) => m.default as GlossarB2MetaData),
  "2": () => import("../data/glossar_B2_K2_meta.json").then((m) => m.default as GlossarB2MetaData),
  "3": () => import("../data/glossar_B2_K3_meta.json").then((m) => m.default as GlossarB2MetaData),
  "4": () => import("../data/glossar_B2_K4_meta.json").then((m) => m.default as GlossarB2MetaData),
  "5": () => import("../data/glossar_B2_K5_meta.json").then((m) => m.default as GlossarB2MetaData),
  "6": () => import("../data/glossar_B2_K6_meta.json").then((m) => m.default as GlossarB2MetaData),
  "7": () => import("../data/glossar_B2_K7_meta.json").then((m) => m.default as GlossarB2MetaData),
  "8": () => import("../data/glossar_B2_K8_meta.json").then((m) => m.default as GlossarB2MetaData),
  "9": () => import("../data/glossar_B2_K9_meta.json").then((m) => m.default as GlossarB2MetaData),
  "10": () => import("../data/glossar_B2_K10_meta.json").then((m) => m.default as GlossarB2MetaData),
};

const b2MetaCache: { [key: string]: GlossarB2MetaData } = {};

export async function getGlossarB2Meta(kapitel: number): Promise<GlossarB2MetaData | null> {
  const key = String(kapitel);
  if (!b2MetaCache[key]) {
    const loader = GLOSSAR_B2_META_MAP[key];
    if (!loader) return null;
    b2MetaCache[key] = await loader();
  }
  return b2MetaCache[key];
}

export function useGlossarB2Meta(kapitel: number): { modules: GlossarB2Module[]; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modules, setModules] = useState<GlossarB2Module[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getGlossarB2Meta(kapitel).then((result) => {
      if (!isMounted) return;
      setModules(result?.modules ?? []);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [kapitel]);

  return { modules, isLoading };
}

const GLOSSAR_B2_MODULE_MAP: Record<string, () => Promise<GlossarKapitelData>> = {
  "K1_m1": () => import("../data/glossar_B2_K1_M1.json").then((m) => m.default as GlossarKapitelData),
  "K1_m2": () => import("../data/glossar_B2_K1_M2.json").then((m) => m.default as GlossarKapitelData),
  "K1_m3": () => import("../data/glossar_B2_K1_M3.json").then((m) => m.default as GlossarKapitelData),
  "K1_m4": () => import("../data/glossar_B2_K1_M4.json").then((m) => m.default as GlossarKapitelData),
  "K2_m1": () => import("../data/glossar_B2_K2_M1.json").then((m) => m.default as GlossarKapitelData),
  "K2_m2": () => import("../data/glossar_B2_K2_M2.json").then((m) => m.default as GlossarKapitelData),
  "K2_m3": () => import("../data/glossar_B2_K2_M3.json").then((m) => m.default as GlossarKapitelData),
  "K2_m4": () => import("../data/glossar_B2_K2_M4.json").then((m) => m.default as GlossarKapitelData),
  "K3_m1": () => import("../data/glossar_B2_K3_M1.json").then((m) => m.default as GlossarKapitelData),
  "K3_m2": () => import("../data/glossar_B2_K3_M2.json").then((m) => m.default as GlossarKapitelData),
  "K3_m3": () => import("../data/glossar_B2_K3_M3.json").then((m) => m.default as GlossarKapitelData),
  "K3_m4": () => import("../data/glossar_B2_K3_M4.json").then((m) => m.default as GlossarKapitelData),
  "K4_m1": () => import("../data/glossar_B2_K4_M1.json").then((m) => m.default as GlossarKapitelData),
  "K4_m2": () => import("../data/glossar_B2_K4_M2.json").then((m) => m.default as GlossarKapitelData),
  "K4_m3": () => import("../data/glossar_B2_K4_M3.json").then((m) => m.default as GlossarKapitelData),
  "K4_m4": () => import("../data/glossar_B2_K4_M4.json").then((m) => m.default as GlossarKapitelData),
  "K5_m1": () => import("../data/glossar_B2_K5_M1.json").then((m) => m.default as GlossarKapitelData),
  "K5_m2": () => import("../data/glossar_B2_K5_M2.json").then((m) => m.default as GlossarKapitelData),
  "K5_m3": () => import("../data/glossar_B2_K5_M3.json").then((m) => m.default as GlossarKapitelData),
  "K5_m4": () => import("../data/glossar_B2_K5_M4.json").then((m) => m.default as GlossarKapitelData),
  "K6_m1": () => import("../data/glossar_B2_K6_M1.json").then((m) => m.default as GlossarKapitelData),
  "K6_m2": () => import("../data/glossar_B2_K6_M2.json").then((m) => m.default as GlossarKapitelData),
  "K6_m3": () => import("../data/glossar_B2_K6_M3.json").then((m) => m.default as GlossarKapitelData),
  "K6_m4": () => import("../data/glossar_B2_K6_M4.json").then((m) => m.default as GlossarKapitelData),
  "K7_m1": () => import("../data/glossar_B2_K7_M1.json").then((m) => m.default as GlossarKapitelData),
  "K7_m2": () => import("../data/glossar_B2_K7_M2.json").then((m) => m.default as GlossarKapitelData),
  "K7_m3": () => import("../data/glossar_B2_K7_M3.json").then((m) => m.default as GlossarKapitelData),
  "K7_m4": () => import("../data/glossar_B2_K7_M4.json").then((m) => m.default as GlossarKapitelData),
  "K8_m1": () => import("../data/glossar_B2_K8_M1.json").then((m) => m.default as GlossarKapitelData),
  "K8_m2": () => import("../data/glossar_B2_K8_M2.json").then((m) => m.default as GlossarKapitelData),
  "K8_m3": () => import("../data/glossar_B2_K8_M3.json").then((m) => m.default as GlossarKapitelData),
  "K8_m4": () => import("../data/glossar_B2_K8_M4.json").then((m) => m.default as GlossarKapitelData),
  "K9_m1": () => import("../data/glossar_B2_K9_M1.json").then((m) => m.default as GlossarKapitelData),
  "K9_m2": () => import("../data/glossar_B2_K9_M2.json").then((m) => m.default as GlossarKapitelData),
  "K9_m3": () => import("../data/glossar_B2_K9_M3.json").then((m) => m.default as GlossarKapitelData),
  "K9_m4": () => import("../data/glossar_B2_K9_M4.json").then((m) => m.default as GlossarKapitelData),
  "K10_m1": () => import("../data/glossar_B2_K10_M1.json").then((m) => m.default as GlossarKapitelData),
  "K10_m2": () => import("../data/glossar_B2_K10_M2.json").then((m) => m.default as GlossarKapitelData),
  "K10_m3": () => import("../data/glossar_B2_K10_M3.json").then((m) => m.default as GlossarKapitelData),
  "K10_m4": () => import("../data/glossar_B2_K10_M4.json").then((m) => m.default as GlossarKapitelData),
};

const b2ModuleCache: { [key: string]: GlossarKapitelData } = {};

export async function getGlossarB2ModuleWords(kapitel: number, moduleId: string): Promise<GlossarWord[]> {
  const key = `K${kapitel}_${moduleId}`;
  if (!b2ModuleCache[key]) {
    const loader = GLOSSAR_B2_MODULE_MAP[key];
    if (!loader) return [];
    b2ModuleCache[key] = await loader();
  }
  return b2ModuleCache[key].words ?? [];
}

export function useGlossarB2Module(kapitel: number, moduleId: string): { words: GlossarWord[]; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [words, setWords] = useState<GlossarWord[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getGlossarB2ModuleWords(kapitel, moduleId).then((result) => {
      if (!isMounted) return;
      setWords(result);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [kapitel, moduleId]);

  return { words, isLoading };
}
