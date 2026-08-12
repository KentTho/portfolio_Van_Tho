import { publicEnv } from "@/config/env";

export const SITE = {
  name: "portfolio_Van_Tho",
  /** Human display name — used as a graceful fallback for the hero/header when the
   *  Neon profile has not been filled via Admin yet (established repo identity, not
   *  fabricated content). The Owner's real profile overrides this once authored. */
  owner: "Van Tho",
  shortName: "VT",
  description:
    "Personal engineering evidence platform — projects, case studies and technical writing by Van Tho.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  defaultLocale: publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE,
  repositoryUrl: "https://github.com/KentTho/portfolio_Van_Tho",
} as const;

export type Site = typeof SITE;
