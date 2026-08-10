import type {
  ArticleDetail,
  ExperienceItem,
  Profile,
  ProjectDetail,
  TechGroup,
} from "@/modules/public-portfolio/domain/types";

/**
 * Wave 04 content source. Profile + capability data below is VERIFIED Owner content.
 * Projects/articles/experience marked `sample: true` are illustrative placeholders
 * (labelled in the UI) that the Owner replaces via the admin CMS in Wave 05 — they
 * are never presented as verified fact. No BBO TECH history is fabricated here
 * (content authority: CLAUDE.md §2/§N — requires explicit Owner-approved wording).
 */

export const profile: Profile = {
  name: "Van Tho",
  role: {
    vi: "Kỹ sư Phần mềm · Lập trình viên Web Full-Stack",
    en: "Software Engineer · Full-Stack Web Developer",
  },
  headline: {
    vi: "Xây dựng sản phẩm web đáng tin cậy với Python, TypeScript và kiến trúc sạch.",
    en: "I build reliable web products with Python, TypeScript and clean architecture.",
  },
  summary: {
    vi: "Tập trung vào Python core, phát triển Web và phân tích dữ liệu — chú trọng kiến trúc rõ ràng, kiểm thử và vận hành an toàn.",
    en: "Focused on Python core, web development and data analysis — with an emphasis on clear architecture, testing and safe operations.",
  },
  location: { vi: "TP. Hồ Chí Minh, Việt Nam", en: "Ho Chi Minh City, Vietnam" },
  education: { vi: "Cử nhân Công nghệ Thông tin", en: "B.Sc. in Information Technology" },
  focusAreas: [
    { vi: "Python Core", en: "Python Core" },
    { vi: "Phát triển Web", en: "Web Development" },
    { vi: "Phân tích dữ liệu", en: "Data Analysis" },
    { vi: "AI ứng dụng (RAG / Agentic)", en: "Applied AI (RAG / Agentic)" },
  ],
  languages: [{ vi: "Tiếng Anh — TOEIC 510", en: "English — TOEIC 510" }],
  socials: [
    { kind: "github", label: "GitHub", href: "https://github.com/KentTho" },
    { kind: "email", label: "Email", href: "mailto:aitreviet@gmail.com" },
  ],
};

export const techGroups: readonly TechGroup[] = [
  {
    id: "languages",
    title: { vi: "Ngôn ngữ", en: "Languages" },
    caption: { vi: "Ngôn ngữ lập trình chủ lực", en: "Core programming languages" },
    techIds: ["python", "typescript", "javascript", "sql"],
  },
  {
    id: "backend",
    title: { vi: "Backend", en: "Backend" },
    caption: { vi: "API & dịch vụ máy chủ", en: "APIs & server services" },
    techIds: ["fastapi", "django", "express", "nodejs"],
  },
  {
    id: "frontend",
    title: { vi: "Frontend", en: "Frontend" },
    caption: { vi: "Giao diện Web hiện đại", en: "Modern web interfaces" },
    techIds: ["react", "nextjs", "tailwind"],
  },
  {
    id: "data",
    title: { vi: "Cơ sở dữ liệu", en: "Databases" },
    caption: { vi: "Quan hệ, tài liệu & vector", en: "Relational, document & vector" },
    techIds: ["postgresql", "mongodb", "vectordb"],
  },
  {
    id: "cloud",
    title: { vi: "Công cụ & Cloud", en: "Tooling & Cloud" },
    caption: { vi: "Quản lý mã, triển khai, kiểm thử", en: "Source, deploy, testing" },
    techIds: ["git", "github", "docker", "vercel", "supabase", "neon", "linux", "postman"],
  },
  {
    id: "ai",
    title: { vi: "AI tích hợp", en: "Applied AI" },
    caption: { vi: "Truy xuất & tổng hợp thông minh", en: "Retrieval & agentic systems" },
    techIds: ["airag"],
  },
];

export const projects: readonly ProjectDetail[] = [
  {
    slug: "engineering-evidence-platform",
    title: {
      vi: "Nền tảng bằng chứng kỹ thuật (portfolio này)",
      en: "Engineering evidence platform (this portfolio)",
    },
    summary: {
      vi: "Modular monolith Next.js + Clean Architecture, Neon Postgres, Supabase Auth/Storage, CI/CD — chính website này là bằng chứng.",
      en: "A Next.js modular monolith with Clean Architecture, Neon Postgres, Supabase Auth/Storage and CI/CD — this very site is the evidence.",
    },
    techIds: ["nextjs", "typescript", "postgresql", "supabase", "vercel"],
    status: "published",
    sample: true,
    year: 2026,
    repoUrl: "https://github.com/KentTho/portfolio_Van_Tho",
    coverAlt: { vi: "Sơ đồ kiến trúc nền tảng portfolio", en: "Portfolio platform architecture diagram" },
    problem: {
      vi: "Cần một cách để nhà tuyển dụng xác minh năng lực kỹ thuật nhanh, có bằng chứng thật.",
      en: "Recruiters need to verify engineering capability quickly, with real evidence.",
    },
    context: {
      vi: "Dự án cá nhân, một người vận hành, tối ưu chi phí và tính minh bạch.",
      en: "A solo-operated personal project optimised for cost and transparency.",
    },
    role: { vi: "Thiết kế & phát triển toàn bộ", en: "End-to-end design & development" },
    architecture: {
      vi: "Feature-first modular monolith; ranh giới presentation → application → domain enforce bằng test.",
      en: "Feature-first modular monolith; presentation → application → domain boundaries enforced by tests.",
    },
    decisions: [
      { vi: "Neon là DB chính duy nhất; Supabase chỉ Auth/Storage.", en: "Neon as the single primary DB; Supabase for Auth/Storage only." },
      { vi: "Ủy quyền storage phía máy chủ (không tin client).", en: "Server-mediated storage authorization (never trust the client)." },
    ],
    tradeoffs: [
      { vi: "Monolith đơn giản, đánh đổi việc tách service AI về sau qua ports.", en: "Monolith simplicity, trading later AI-service extraction via ports." },
    ],
    results: {
      vi: "CI xanh trên main; DB dev migrate + smoke; upload có chữ ký kiểm chứng.",
      en: "CI green on main; dev DB migrated + smoke-tested; signed uploads verified.",
    },
    limitations: {
      vi: "Chưa có dữ liệu dự án thật; nội dung mẫu được gắn nhãn rõ.",
      en: "No real project data yet; sample content is clearly labelled.",
    },
    nextStep: {
      vi: "Admin CMS (Wave 05) để nạp dự án, hình ảnh, video thật.",
      en: "Admin CMS (Wave 05) to load real projects, images and video.",
    },
  },
  {
    slug: "rag-knowledge-assistant",
    title: { vi: "Trợ lý tri thức RAG (mẫu)", en: "RAG knowledge assistant (sample)" },
    summary: {
      vi: "Dịch vụ hỏi-đáp truy xuất tài liệu bằng FastAPI + vector database. Nội dung mẫu.",
      en: "A document retrieval Q&A service with FastAPI + a vector database. Sample content.",
    },
    techIds: ["python", "fastapi", "vectordb", "airag"],
    status: "published",
    sample: true,
    year: 2026,
    coverAlt: { vi: "Sơ đồ luồng RAG", en: "RAG pipeline diagram" },
    problem: { vi: "Tra cứu tài liệu nội bộ chính xác, có trích dẫn.", en: "Accurate, cited lookup over internal documents." },
    context: { vi: "Mẫu minh hoạ năng lực AI ứng dụng.", en: "A sample illustrating applied-AI capability." },
    role: { vi: "Thiết kế pipeline & API", en: "Pipeline & API design" },
    architecture: { vi: "Ingest → embed → vector store → retrieve → tổng hợp.", en: "Ingest → embed → vector store → retrieve → synthesise." },
    decisions: [{ vi: "Tách embedding và truy vấn để dễ kiểm thử.", en: "Separate embedding and query paths for testability." }],
    tradeoffs: [{ vi: "Độ trễ truy xuất đổi lấy độ chính xác trích dẫn.", en: "Retrieval latency traded for citation accuracy." }],
    results: { vi: "(Mẫu — chưa có số liệu thật.)", en: "(Sample — no real metrics.)" },
    limitations: { vi: "Nội dung mẫu, không phải dự án đã triển khai.", en: "Sample content, not a shipped project." },
    nextStep: { vi: "Owner thay bằng dự án thật.", en: "Owner replaces with a real project." },
  },
];

export const articles: readonly ArticleDetail[] = [
  {
    slug: "server-mediated-storage",
    title: { vi: "Ủy quyền lưu trữ phía máy chủ", en: "Server-mediated storage authorization" },
    summary: {
      vi: "Vì sao mọi lượt ghi file nên đi qua một seam ủy quyền ở máy chủ.",
      en: "Why every file write should pass through a single server-side authorization seam.",
    },
    tags: ["architecture", "security", "storage"],
    publishedAt: "2026-07-31",
    sample: true,
    body: {
      vi: "## Bối cảnh\n\nClient không bao giờ được cầm khóa dịch vụ. Máy chủ xác minh phiên, kiểm tra vai trò trong Neon, rồi cấp URL upload có chữ ký ngắn hạn.\n\n> Nội dung mẫu — Owner thay bằng bài viết thật.",
      en: "## Context\n\nThe client must never hold the service key. The server verifies the session, checks the role in Neon, then issues a short-lived signed upload URL.\n\n> Sample content — Owner replaces with a real article.",
    },
  },
];

export const experience: readonly ExperienceItem[] = [
  {
    id: "education",
    org: { vi: "Đại học (CNTT)", en: "University (IT)" },
    role: { vi: "Cử nhân Công nghệ Thông tin", en: "B.Sc. in Information Technology" },
    period: "—",
    highlights: [
      { vi: "Nền tảng khoa học máy tính, cấu trúc dữ liệu, giải thuật.", en: "Computer-science foundations, data structures, algorithms." },
    ],
    sample: false,
  },
  {
    id: "sample-role",
    org: { vi: "Kinh nghiệm (sẽ bổ sung)", en: "Experience (to be added)" },
    role: { vi: "Owner bổ sung vai trò đã kiểm chứng", en: "Owner adds verified roles" },
    period: "—",
    highlights: [
      { vi: "Mục nhập mẫu — thay bằng kinh nghiệm thật.", en: "Sample entry — replace with real experience." },
    ],
    sample: true,
  },
];
