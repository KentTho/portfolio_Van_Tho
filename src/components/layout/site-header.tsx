import Link from "next/link";
import { MainNav } from "@/components/navigation/main-nav";
import { SITE } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="rounded-sm font-mono text-sm font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {SITE.shortName}
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
