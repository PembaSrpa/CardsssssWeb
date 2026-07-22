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
  "5K": () => import("../data/ielts_speaking_5K.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5L": () => import("../data/ielts_speaking_5L.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5M": () => import("../data/ielts_speaking_5M.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5N": () => import("../data/ielts_speaking_5N.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5O": () => import("../data/ielts_speaking_5O.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5P": () => import("../data/ielts_speaking_5P.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5Q": () => import("../data/ielts_speaking_5Q.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5R": () => import("../data/ielts_speaking_5R.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5S": () => import("../data/ielts_speaking_5S.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5T": () => import("../data/ielts_speaking_5T.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5U": () => import("../data/ielts_speaking_5U.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5V": () => import("../data/ielts_speaking_5V.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5W": () => import("../data/ielts_speaking_5W.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5X": () => import("../data/ielts_speaking_5X.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5Y": () => import("../data/ielts_speaking_5Y.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5Z": () => import("../data/ielts_speaking_5Z.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AA": () => import("../data/ielts_speaking_5AA.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AB": () => import("../data/ielts_speaking_5AB.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AC": () => import("../data/ielts_speaking_5AC.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AD": () => import("../data/ielts_speaking_5AD.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AE": () => import("../data/ielts_speaking_5AE.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AF": () => import("../data/ielts_speaking_5AF.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AG": () => import("../data/ielts_speaking_5AG.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AH": () => import("../data/ielts_speaking_5AH.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AI": () => import("../data/ielts_speaking_5AI.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AJ": () => import("../data/ielts_speaking_5AJ.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AK": () => import("../data/ielts_speaking_5AK.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AL": () => import("../data/ielts_speaking_5AL.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AM": () => import("../data/ielts_speaking_5AM.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AN": () => import("../data/ielts_speaking_5AN.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AO": () => import("../data/ielts_speaking_5AO.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AP": () => import("../data/ielts_speaking_5AP.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AQ": () => import("../data/ielts_speaking_5AQ.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AR": () => import("../data/ielts_speaking_5AR.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AS": () => import("../data/ielts_speaking_5AS.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AT": () => import("../data/ielts_speaking_5AT.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AU": () => import("../data/ielts_speaking_5AU.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AV": () => import("../data/ielts_speaking_5AV.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AW": () => import("../data/ielts_speaking_5AW.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AX": () => import("../data/ielts_speaking_5AX.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AY": () => import("../data/ielts_speaking_5AY.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5AZ": () => import("../data/ielts_speaking_5AZ.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BA": () => import("../data/ielts_speaking_5BA.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BB": () => import("../data/ielts_speaking_5BB.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BC": () => import("../data/ielts_speaking_5BC.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BD": () => import("../data/ielts_speaking_5BD.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BE": () => import("../data/ielts_speaking_5BE.json").then((m) => m.default as IELTSSpeakingTopicData),
  "5BF": () => import("../data/ielts_speaking_5BF.json").then((m) => m.default as IELTSSpeakingTopicData),
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
