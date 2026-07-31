import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/config/site";

const capabilities = [
  "Software Engineering",
  "Full-Stack Development",
  "Clean Architecture",
  "Database Design",
  "CI/CD and Cloud Deployment",
  "Security and Testing",
];

const foundationStatus = [
  { label: "Framework", value: "Next.js App Router" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "Architecture", value: "Feature-first Clean Architecture" },
  { label: "Design system", value: "Dark navy engineering tokens" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <p className="mb-4 font-mono text-sm text-accent">{SITE.name}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            Engineering evidence platform foundation
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-muted">
            This is the Wave 02 application foundation. Portfolio content — projects,
            case studies, articles and video demos — will be added in later Waves.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
              Admin shell
            </Link>
            <a
              href={SITE.repositoryUrl}
              className={buttonVariants({ variant: "ghost" })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
            </a>
          </div>
        </section>

        <section
          aria-labelledby="capabilities-heading"
          className="mx-auto w-full max-w-5xl px-6 pb-16"
        >
          <h2
            id="capabilities-heading"
            className="text-sm font-semibold uppercase tracking-wider text-fg-subtle"
          >
            Core capabilities
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-fg-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="foundation-heading"
          className="mx-auto w-full max-w-5xl px-6 pb-24"
        >
          <h2
            id="foundation-heading"
            className="text-sm font-semibold uppercase tracking-wider text-fg-subtle"
          >
            Foundation status
          </h2>
          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {foundationStatus.map((row) => (
              <div key={row.label} className="bg-surface px-4 py-4">
                <dt className="text-xs uppercase tracking-wide text-fg-subtle">
                  {row.label}
                </dt>
                <dd className="mt-1 text-fg">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
