"use client";

import { useEffect, useState } from "react";

export interface IELTSWord {
  id: string;
  word: string;
  type: string;
  category: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

export interface IELTSSectionData {
  section: string;
  title: string;
  words: IELTSWord[];
}

export interface UseIELTSDataResult {
  words: IELTSWord[];
  title: string;
  section: string;
  isLoading: boolean;
}

const IELTS_DATA_MAP: Record<string, () => Promise<IELTSSectionData>> = {
  "1A": () => import("../data/ielts_1A.json").then((m) => m.default as IELTSSectionData),
  "1B": () => import("../data/ielts_1B.json").then((m) => m.default as IELTSSectionData),
  "1C": () => import("../data/ielts_1C.json").then((m) => m.default as IELTSSectionData),
  "1D": () => import("../data/ielts_1D.json").then((m) => m.default as IELTSSectionData),
  "2A": () => import("../data/ielts_2A.json").then((m) => m.default as IELTSSectionData),
  "2B": () => import("../data/ielts_2B.json").then((m) => m.default as IELTSSectionData),
  "2C": () => import("../data/ielts_2C.json").then((m) => m.default as IELTSSectionData),
  "2D": () => import("../data/ielts_2D.json").then((m) => m.default as IELTSSectionData),
  "2E": () => import("../data/ielts_2E.json").then((m) => m.default as IELTSSectionData),
  "2F": () => import("../data/ielts_2F.json").then((m) => m.default as IELTSSectionData),
  "3A": () => import("../data/ielts_3A.json").then((m) => m.default as IELTSSectionData),
  "3B": () => import("../data/ielts_3B.json").then((m) => m.default as IELTSSectionData),
  "3C": () => import("../data/ielts_3C.json").then((m) => m.default as IELTSSectionData),
  "3D": () => import("../data/ielts_3D.json").then((m) => m.default as IELTSSectionData),
  "3E": () => import("../data/ielts_3E.json").then((m) => m.default as IELTSSectionData),
  "3F": () => import("../data/ielts_3F.json").then((m) => m.default as IELTSSectionData),
  "3G": () => import("../data/ielts_3G.json").then((m) => m.default as IELTSSectionData),
  "4A": () => import("../data/ielts_4A.json").then((m) => m.default as IELTSSectionData),
  "4B": () => import("../data/ielts_4B.json").then((m) => m.default as IELTSSectionData),
  "4C": () => import("../data/ielts_4C.json").then((m) => m.default as IELTSSectionData),
  "4D": () => import("../data/ielts_4D.json").then((m) => m.default as IELTSSectionData),
  "4E": () => import("../data/ielts_4E.json").then((m) => m.default as IELTSSectionData),
  "4F": () => import("../data/ielts_4F.json").then((m) => m.default as IELTSSectionData),
};

export const AVAILABLE_IELTS_SECTIONS: string[] = Object.keys(IELTS_DATA_MAP);

export interface IELTSSectionGroup {
  id: string;
  title: string;
  subtitle: string;
  categories: string[];
}

export const IELTS_SECTION_GROUPS: IELTSSectionGroup[] = [
  {
    id: "1",
    title: "Core Academic Vocabulary",
    subtitle: "General Logic & Argumentation",
    categories: ["1A", "1B", "1C", "1D"],
  },
  {
    id: "2",
    title: "Trend, Data & Diagram Language",
    subtitle: "Writing Task 1",
    categories: ["2A", "2B", "2C", "2D", "2E", "2F"],
  },
  {
    id: "3",
    title: "Topic-Specific Modules",
    subtitle: "Thematic Vocabulary",
    categories: ["3A", "3B", "3C", "3D", "3E", "3F", "3G"],
  },
  {
    id: "4",
    title: "Structural, Functional & Idiomatic Language",
    subtitle: "",
    categories: ["4A", "4B", "4C", "4D", "4E", "4F"],
  },
  {
    id: "5",
    title: "Speaking Topics",
    subtitle: "Part 1, 2 & 3 Practice Questions",
    categories: ["5A", "5B", "5C", "5D", "5E", "5F", "5G", "5H", "5I", "5J", "5K", "5L", "5M", "5N", "5O", "5P", "5Q", "5R", "5S", "5T", "5U", "5V", "5W", "5X", "5Y", "5Z", "5AA", "5AB", "5AC", "5AD", "5AE", "5AF", "5AG", "5AH", "5AI", "5AJ", "5AK", "5AL", "5AM", "5AN", "5AO", "5AP", "5AQ", "5AR", "5AS", "5AT", "5AU", "5AV", "5AW", "5AX", "5AY", "5AZ", "5BA", "5BB", "5BC", "5BD", "5BE", "5BF"],
  },
];

export function getSectionGroupId(section: string): string {
  const match = section.match(/^\d+/);
  return match ? match[0] : "1";
}

const sectionCache: { [key: string]: IELTSSectionData } = {};

async function loadSection(section: string): Promise<IELTSSectionData | null> {
  if (sectionCache[section]) {
    return sectionCache[section];
  }

  const loader = IELTS_DATA_MAP[section];
  if (!loader) {
    return null;
  }

  const data = await loader();
  sectionCache[section] = data;
  return data;
}

export function useIELTSData(section: string): UseIELTSDataResult {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IELTSSectionData | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadSection(section).then((result) => {
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
    words: data?.words ?? [],
    title: data?.title ?? "",
    section: data?.section ?? section,
    isLoading,
  };
}
