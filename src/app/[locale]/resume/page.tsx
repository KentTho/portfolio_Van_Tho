import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { getTechnology, isTechId } from "@/config/technology-catalog";
import { buildLocaleMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/public/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildLocaleMetadata({
    locale,
    path: "/resume",
    title: dict.meta.resumeTitle,
    description: dict.meta.homeDescription,
  });
}

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const repo = getPortfolioRepository();
  const [profile, groups, experience] = await Promise.all([
    repo.getProfile(),
    repo.getTechGroups(),
    repo.listExperience(),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <PageHeader eyebrow="Résumé" title={pick(profile.role, locale)} subtitle={pick(profile.summary, locale)} />

      <p className="text-sm text-fg-subtle">
        {pick(profile.location, locale)} · {pick(profile.education, locale)} ·{" "}
        {profile.languages.map((lang) => pick(lang, locale)).join(", ")}
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          {dict.sections.techMatrix}
        </h2>
        <div className="mt-4 space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="font-medium text-fg">{pick(group.title, locale)}:</span>
              <span className="text-fg-muted">
                {group.techIds
                  .map((id) => (isTechId(id) ? getTechnology(id).name : id))
                  .join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          {dict.sections.experience}
        </h2>
        <ul className="mt-4 space-y-4">
          {experience.map((item) => (
            <li key={item.id}>
              <p className="font-medium text-fg">
                {pick(item.role, locale)} — {pick(item.org, locale)}
              </p>
              <p className="text-sm text-fg-muted">{pick(item.highlights[0] ?? item.role, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm text-fg-subtle">
        {dict.labels.empty} (PDF)
      </p>
    </div>
  );
}
