"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Admin navigation groups. Functional CMS only — no public/marketing links here. */
const NAV_GROUPS: ReadonlyArray<{ label: string; items: ReadonlyArray<{ href: string; label: string }> }> = [
  {
    label: "Tổng quan",
    items: [
      { href: "/admin", label: "Bảng điều khiển" },
      { href: "/admin/profile", label: "Hồ sơ" },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/admin/projects", label: "Dự án" },
      { href: "/admin/articles", label: "Bài viết" },
    ],
  },
  {
    label: "Sự nghiệp",
    items: [
      { href: "/admin/experience", label: "Kinh nghiệm" },
      { href: "/admin/education", label: "Học vấn" },
      { href: "/admin/certifications", label: "Chứng chỉ" },
    ],
  },
  {
    label: "Phân loại",
    items: [
      { href: "/admin/skills", label: "Kỹ năng" },
      { href: "/admin/technologies", label: "Công nghệ" },
      { href: "/admin/tags", label: "Thẻ" },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { href: "/admin/media", label: "Media" },
      { href: "/admin/messages", label: "Tin nhắn" },
      { href: "/admin/settings", label: "Cài đặt" },
      { href: "/admin/revisions", label: "Phiên bản" },
      { href: "/admin/audit", label: "Nhật ký" },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quản trị" className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            {group.label}
          </p>
          <ul className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-accent/15 font-medium text-accent"
                        : "text-fg-muted hover:bg-surface hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
