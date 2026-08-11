import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/public/page-header";
import { SampleBadge } from "@/components/public/sample-badge";

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
    path: "/about",
    title: dict.meta.aboutTitle,
    description: dict.meta.homeDescription,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const repo = getPortfolioRepository();
  const [profile, experience] = await Promise.all([repo.getProfile(), repo.listExperience()]);

  const facts = [
    { label: dict.labels.role, value: pick(profile.role, locale) },
    { label: "Location", value: pick(profile.location, locale) },
    { label: "Education", value: pick(profile.education, locale) },
    { label: "Languages", value: profile.languages.map((lang) => pick(lang, locale)).join(", ") },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <PageHeader eyebrow="About" title={dict.nav.about} />
      <p className="text-lg leading-8 text-fg-muted">{pick(profile.summary, locale)}</p>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-surface px-4 py-4">
            <dt className="text-xs uppercase tracking-wide text-fg-subtle">{fact.label}</dt>
            <dd className="mt-1 text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="experience-heading" className="mt-12">
        <h2 id="experience-heading" className="font-display text-2xl font-bold tracking-tight text-fg">
          {dict.sections.experience}
        </h2>
        <ol className="mt-6 space-y-6 border-l border-border pl-6">
          {experience.map((item) => (
            <li key={item.id} className="relative">
              <span
                className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-medium text-fg">{pick(item.role, locale)}</h3>
                {item.sample ? <SampleBadge label={dict.labels.sample} /> : null}
              </div>
              <p className="text-sm text-fg-subtle">
                {pick(item.org, locale)} · {item.period}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
                {item.highlights.map((h) => (
                  <li key={pick(h, "en")}>{pick(h, locale)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
