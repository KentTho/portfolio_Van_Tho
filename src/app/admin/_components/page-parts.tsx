import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/** Standard admin page header with an optional primary action link. */
export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-fg">{title}</h1>
        {description ? <p className="mt-2 text-sm text-fg-muted">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={buttonVariants({ variant: "primary", size: "sm" })}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** Empty-state placeholder for a list with no rows yet. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-fg-muted">
      {message}
    </div>
  );
}

/** Error banner for a failed load. */
export function LoadError({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-8 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
      {message}
    </p>
  );
}

const badge = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

/** Small status pill (visible / hidden / draft / published / archived). */
export function StatusBadge({ kind, label }: { kind: "on" | "off" | "warn"; label: string }) {
  const tone =
    kind === "on"
      ? "border border-success/40 bg-success/10 text-success"
      : kind === "warn"
        ? "border border-warning/40 bg-warning/10 text-warning"
        : "border border-border bg-surface text-fg-subtle";
  return <span className={`${badge} ${tone}`}>{label}</span>;
}
