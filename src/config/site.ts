import { publicEnv } from "@/config/env";

export const SITE = {
  name: "portfolio_Van_Tho",
  shortName: "VT",
  description:
    "Personal engineering evidence platform — projects, case studies and technical writing by Van Tho.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  defaultLocale: publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE,
  repositoryUrl: "https://github.com/KentTho/portfolio_Van_Tho",
} as const;

export type Site = typeof SITE;
