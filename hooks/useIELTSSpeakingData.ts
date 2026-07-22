"use client";

import { useEffect, useState } from "react";

export type SpeakingPart = 1 | 2 | 3;

export interface IELTSSpeakingQuestion {
  id: string;
  part: SpeakingPart;
  question: string;
  cueCardPoints?: string[];
  answer: string;
}

export interface IELTSSpeakingTopicData {
  section: string;
  title: string;
  questions: IELTSSpeakingQuestion[];
}

export interface UseIELTSSpeakingDataResult {
  questions: IELTSSpeakingQuestion[];
  title: string;
  section: string;
  isLoading: boolean;
}

const IELTS_SPEAKING_DATA_MAP: Record<string, () => Promise<IELTSSpeakingTopicData>> = {
  "5A": () => import("../data/ielts_speaking_5A.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5B": () => import("../data/ielts_speaking_5B.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5C": () => import("../data/ielts_speaking_5C.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5D": () => import("../data/ielts_speaking_5D.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5E": () => import("../data/ielts_speaking_5E.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5F": () => import("../data/ielts_speaking_5F.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5G": () => import("../data/ielts_speaking_5G.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5H": () => import("../data/ielts_speaking_5H.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5I": () => import("../data/ielts_speaking_5I.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5J": () => import("../data/ielts_speaking_5J.json").then((m) => m.default as IELTSSpeakingTopicData),
};

export const AVAILABLE_IELTS_SPEAKING_TOPICS: string[] = Object.keys(IELTS_SPEAKING_DATA_MAP);

export function isIELTSSpeakingSection(section: string): boolean {
  return section in IELTS_SPEAKING_DATA_MAP;
}

const speakingCache: { [key: string]: IELTSSpeakingTopicData } = {};

async function loadTopic(section: string): Promise<IELTSSpeakingTopicData | null> {
  if (speakingCache[section]) {
    return speakingCache[section];
  }

  const loader = IELTS_SPEAKING_DATA_MAP[section];
  if (!loader) {
    return null;
  }

  const data = await loader();
  speakingCache[section] = data;
  return data;
}

export function useIELTSSpeakingData(section: string): UseIELTSSpeakingDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IELTSSpeakingTopicData | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadTopic(section).then((result) => {
      if (!isMounted) {
        return;
      }
      setData(result);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [section]);

  return {
    questions: data?.questions ?? [],
    title: data?.title ?? "",
    section: data?.section ?? section,
    isLoading,
  };
}
