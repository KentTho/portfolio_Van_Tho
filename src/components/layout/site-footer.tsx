import { SITE } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          {SITE.name} — engineering evidence platform.
        </p>
        <a
          href={SITE.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          GitHub repository
        </a>
      </div>
    </footer>
  );
}
