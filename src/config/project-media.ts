/**
 * Centralized Project Media Manifest (§17, §39, §42).
 *
 * OWNER DIRECTIVE:
 * - Decouple MEDIA_RUNTIME_ASSET from PROJECT_CONTENT_DATA.
 * - Do not mutate the Neon production schema without a domain migration ticket.
 * - Map verified media assets to stable project slugs here.
 *
 * STATUS:
 * - PENDING_ADMIN_PROJECT_MEDIA_DOMAIN_EXPANSION (until Admin CMS natively manages project video uploads)
 */

export interface ProjectMediaEntry {
  readonly slug: string;
  readonly videoSrc?: string;
  readonly posterSrc?: string;
  readonly isVerifiedOwnerUrl: boolean;
  readonly liveUrl?: string;
  readonly githubUrl?: string;
  readonly title: {
    readonly vi: string;
    readonly en: string;
  };
  readonly summary: {
    readonly vi: string;
    readonly en: string;
  };
  readonly techStack: readonly string[];
  readonly category: string;
  readonly year: number;
}

export const VERIFIED_PROJECT_MEDIA: readonly ProjectMediaEntry[] = [
  {
    slug: "bbotech-platform",
    videoSrc: "/media/projects/bbotech-platform-preview.webm",
    isVerifiedOwnerUrl: true,
    liveUrl: "https://bbotech.vercel.app/",
    githubUrl: "https://github.com/KentTho",
    title: {
      vi: "BBO Tech — Nền tảng Tự động hóa & Trợ lý AI",
      en: "BBO Tech — AI Automation & Agentic Workflow Platform",
    },
    summary: {
      vi: "Hệ thống landing page và cổng dịch vụ tự động hóa ứng dụng AI, tối ưu hóa tỷ lệ chuyển đổi và luồng tương tác khách hàng.",
      en: "High-conversion landing page and AI automation services platform with reactive micro-interactions and low-latency delivery.",
    },
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    category: "AI & AUTOMATION",
    year: 2026,
  },
  {
    slug: "bbotech-vegetarian-restaurant",
    videoSrc: "/media/projects/bbotech-vegetarian-preview.webm",
    isVerifiedOwnerUrl: true,
    liveUrl: "https://bbotech-vegetarian-restaurant.vercel.app/",
    githubUrl: "https://github.com/KentTho",
    title: {
      vi: "Nhà hàng Chay — Trải nghiệm Thực đơn & Đặt bàn Trực tuyến",
      en: "Organic Vegetarian Restaurant — Digital Menu & Dining Reservation",
    },
    summary: {
      vi: "Nền tảng giới thiệu ẩm thực chay hữu cơ với giao diện ẩm thực thanh lịch, trực quan hóa thực đơn theo danh mục và đặt bàn nhanh chóng.",
      en: "Clean culinary web experience featuring categorized gourmet vegetarian menus, dynamic ambiance showcase, and streamlined reservation.",
    },
    techStack: ["React", "TypeScript", "Tailwind CSS", "Responsive UI", "Vercel"],
    category: "CULINARY & HOSPITALITY",
    year: 2026,
  },
  {
    slug: "photomau-bbotech",
    videoSrc: "/media/projects/photomau-bbotech-preview.webm",
    isVerifiedOwnerUrl: true,
    liveUrl: "https://photomaubbotech.vercel.app/",
    githubUrl: "https://github.com/KentTho",
    title: {
      vi: "Photo Anh Đức — Không gian Nghệ thuật Nhiếp ảnh & Studio",
      en: "Photo Anh Duc — Fine Art Photography & Studio Showcase",
    },
    summary: {
      vi: "Không gian trưng bày nhiếp ảnh điện ảnh, tối ưu hóa tải ảnh độ phân giải cao và bảng giá gói dịch vụ studio chuyên nghiệp.",
      en: "Cinematic photography portfolio with responsive high-resolution image galleries, masonry showcases, and transparent package tiers.",
    },
    techStack: ["React", "Next.js", "Tailwind CSS", "Media Optimization", "Vercel"],
    category: "STUDIO & MEDIA",
    year: 2026,
  },
];

export function getProjectMedia(slug: string): ProjectMediaEntry | undefined {
  return VERIFIED_PROJECT_MEDIA.find((p) => p.slug === slug);
}
