import Link from "next/link";
import { isOk, type Result } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { getProjectAdminUseCases } from "@/composition/projects";
import { getArticleAdminUseCases } from "@/composition/articles";
import { getCareerAdminUseCases } from "@/composition/career";
import { getSkillAdminUseCases } from "@/composition/skills";
import { getTechnologyUseCases } from "@/composition/technologies";
import { getTagUseCases } from "@/composition/tags";

export const dynamic = "force-dynamic";

/** Count from a list use-case Result; a failure renders as "—" rather than crashing the page. */
async function count<T>(p: Promise<Result<readonly T[], unknown>>): Promise<number | null> {
  try {
    const r = await p;
    return isOk(r) ? r.value.length : null;
  } catch {
    return null;
  }
}

const fmt = (n: number | null) => (n === null ? "—" : String(n));

async function loadStats(admin: AdminUser) {
  const [projects, articles, experiences, skills, technologies, tags] = await Promise.all([
    count(getProjectAdminUseCases().list.execute({ admin })),
    count(getArticleAdminUseCases().list.execute({ admin })),
    count(getCareerAdminUseCases().experiences.list.execute({ admin })),
    count(getSkillAdminUseCases().list.execute({ admin })),
    count(getTechnologyUseCases().list.execute({ admin })),
    count(getTagUseCases().list.execute({ admin })),
  ]);
  return { projects, articles, experiences, skills, technologies, tags };
}

const CARDS: ReadonlyArray<{ key: keyof Awaited<ReturnType<typeof loadStats>>; label: string; href: string }> = [
  { key: "projects", label: "Dự án", href: "/admin/projects" },
  { key: "articles", label: "Bài viết", href: "/admin/articles" },
  { key: "experiences", label: "Kinh nghiệm", href: "/admin/experience" },
  { key: "skills", label: "Kỹ năng", href: "/admin/skills" },
  { key: "technologies", label: "Công nghệ", href: "/admin/technologies" },
  { key: "tags", label: "Thẻ", href: "/admin/tags" },
];

export default async function AdminDashboardPage() {
  const admin = await getAdminOrRedirect();
  const stats = await loadStats(admin);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">Bảng điều khiển</h1>
      <p className="mt-2 text-sm text-fg-muted">
        Quản lý toàn bộ nội dung portfolio. Mọi thao tác đi qua tầng ứng dụng (authz + kiểm tra +
        audit), không truy cập cơ sở dữ liệu trực tiếp.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-lg border border-border bg-elevated p-4 transition-colors hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="text-2xl font-semibold text-fg">{fmt(stats[card.key])}</div>
            <div className="mt-1 text-sm text-fg-muted">{card.label}</div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-fg-subtle">
        Đăng nhập với vai trò <span className="font-medium text-fg-muted">{admin.role}</span> ·{" "}
        {admin.email}
      </p>
    </div>
  );
}
