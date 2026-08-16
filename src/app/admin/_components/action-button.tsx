"use client";

import { useFormStatus } from "react-dom";

function Inner({ label, pendingLabel, danger }: { label: string; pendingLabel: string; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
        danger ? "text-danger hover:bg-danger/10" : "text-fg-muted hover:bg-surface hover:text-fg"
      }`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * Small button bound to a void Server Action that posts an id and (optionally) a row_version
 * for optimistic-concurrency-safe lifecycle transitions (publish / unpublish / archive).
 */
export function ActionButton({
  action,
  id,
  rowVersion,
  label,
  pendingLabel = "…",
  danger,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  rowVersion?: number;
  label: string;
  pendingLabel?: string;
  danger?: boolean;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      {rowVersion !== undefined ? <input type="hidden" name="rowVersion" value={rowVersion} /> : null}
      <Inner label={label} pendingLabel={pendingLabel} danger={danger} />
    </form>
  );
}
