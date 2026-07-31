/**
 * Central, typed technology catalog. `techIds` in portfolio content reference these
 * keys. Brand marks are represented as accessible branded tiles (initials + brand
 * colour); accurate official SVGs (Devicon, MIT, self-hosted) are a license-reviewed
 * follow-up — we do not redraw inaccurate brand marks (design policy §M).
 */
export interface TechnologyMeta {
  /** Display name (brand names are never translated). */
  readonly name: string;
  /** Short label used by the branded-initial fallback tile. */
  readonly short: string;
  /** Brand-ish accent colour for the tile glow. */
  readonly color: string;
  readonly category: "language" | "backend" | "frontend" | "data" | "cloud" | "ai";
}

export const TECHNOLOGY_CATALOG = {
  python: { name: "Python", short: "Py", color: "#3776AB", category: "language" },
  typescript: { name: "TypeScript", short: "TS", color: "#3178C6", category: "language" },
  javascript: { name: "JavaScript", short: "JS", color: "#F7DF1E", category: "language" },
  sql: { name: "SQL", short: "SQL", color: "#336791", category: "language" },
  fastapi: { name: "FastAPI", short: "FA", color: "#009688", category: "backend" },
  django: { name: "Django", short: "Dj", color: "#0C4B33", category: "backend" },
  express: { name: "Express.js", short: "Ex", color: "#68A063", category: "backend" },
  nodejs: { name: "Node.js", short: "No", color: "#5FA04E", category: "backend" },
  react: { name: "React", short: "Re", color: "#61DAFB", category: "frontend" },
  nextjs: { name: "Next.js", short: "Nx", color: "#E5EEF7", category: "frontend" },
  tailwind: { name: "Tailwind CSS", short: "Tw", color: "#38BDF8", category: "frontend" },
  postgresql: { name: "PostgreSQL", short: "Pg", color: "#4169E1", category: "data" },
  mongodb: { name: "MongoDB", short: "Mo", color: "#47A248", category: "data" },
  vectordb: { name: "Vector DB", short: "Ve", color: "#A78BFA", category: "data" },
  git: { name: "Git", short: "Git", color: "#F05032", category: "cloud" },
  github: { name: "GitHub", short: "GH", color: "#E5EEF7", category: "cloud" },
  docker: { name: "Docker", short: "Dk", color: "#2496ED", category: "cloud" },
  vercel: { name: "Vercel", short: "▲", color: "#E5EEF7", category: "cloud" },
  supabase: { name: "Supabase", short: "Sb", color: "#3ECF8E", category: "cloud" },
  neon: { name: "Neon", short: "Ne", color: "#00E599", category: "cloud" },
  linux: { name: "Linux", short: "Lx", color: "#FCC624", category: "cloud" },
  postman: { name: "Postman", short: "Pm", color: "#FF6C37", category: "cloud" },
  airag: { name: "RAG / Agentic AI", short: "AI", color: "#22D3EE", category: "ai" },
} as const satisfies Record<string, TechnologyMeta>;

export type TechId = keyof typeof TECHNOLOGY_CATALOG;

export function isTechId(id: string): id is TechId {
  return Object.prototype.hasOwnProperty.call(TECHNOLOGY_CATALOG, id);
}

export function getTechnology(id: TechId): TechnologyMeta {
  return TECHNOLOGY_CATALOG[id];
}
