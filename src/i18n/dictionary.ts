import type { Locale } from "@/shared/i18n";
import { en } from "@/i18n/dictionaries/en";
import { vi } from "@/i18n/dictionaries/vi";

/** UI chrome strings. Content text comes from the portfolio repository, not here. */
export interface Dictionary {
  nav: Record<
    "home" | "projects" | "articles" | "about" | "resume" | "contact" | "experience" | "skills",
    string
  >;
  actions: Record<
    | "viewProjects"
    | "downloadResume"
    | "contactMe"
    | "viewAll"
    | "readMore"
    | "backHome"
    | "viewSource"
    | "liveDemo"
    | "switchLanguage"
    | "openMenu"
    | "closeMenu",
    string
  >;
  hero: Record<"availability" | "scroll" | "intro" | "focus", string>;
  sections: Record<
    "focus" | "techMatrix" | "featured" | "principles" | "writing" | "experience" | "contactCta",
    string
  >;
  labels: Record<
    | "sample"
    | "empty"
    | "notFoundTitle"
    | "notFoundBody"
    | "techStack"
    | "role"
    | "year"
    | "tableOfContents"
    | "location"
    | "education"
    | "languages",
    string
  >;
  home: Record<"featuredSubtitle" | "techSubtitle" | "principlesSubtitle" | "writingSubtitle", string>;
  caseStudy: Record<
    | "problem"
    | "context"
    | "role"
    | "architecture"
    | "decisions"
    | "tradeoffs"
    | "results"
    | "limitations"
    | "nextStep",
    string
  >;
  contact: Record<"title" | "subtitle" | "name" | "email" | "message" | "send" | "note", string>;
  principles: ReadonlyArray<{ title: string; body: string }>;
  footer: Record<"madeWith" | "rights", string>;
  meta: Record<
    | "homeTitle"
    | "homeDescription"
    | "projectsTitle"
    | "articlesTitle"
    | "aboutTitle"
    | "resumeTitle"
    | "contactTitle",
    string
  >;
}

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
