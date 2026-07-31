import Link from "next/link";
import { SITE } from "@/config/site";

/** Admin visual shell. Authorization is enforced in the admin layout (Wave 03). */
export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail?: string;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-elevated">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-fg">
              {SITE.shortName}
            </span>
            <span className="rounded-full border border-accent-3/40 bg-accent-3/10 px-2 py-0.5 text-xs text-accent-3">
              Admin
            </span>
            {adminEmail ? (
              <span className="text-xs text-fg-subtle">{adminEmail}</span>
            ) : null}
          </div>
          <Link
            href="/"
            className="rounded-sm text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Back to site
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
