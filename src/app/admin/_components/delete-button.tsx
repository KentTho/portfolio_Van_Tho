"use client";

import { useFormStatus } from "react-dom";

function Inner({ confirmLabel }: { confirmLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmLabel)) e.preventDefault();
      }}
      className="rounded-md px-2 py-1 text-xs text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
    >
      {pending ? "Đang xoá…" : "Xoá"}
    </button>
  );
}

/**
 * Delete control bound to a void Server Action. Confirms before submit. `id` is posted as a
 * hidden field so the action can resolve the target row.
 */
export function DeleteButton({
  action,
  id,
  confirmLabel = "Xoá mục này? Hành động không thể hoàn tác.",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmLabel?: string;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <Inner confirmLabel={confirmLabel} />
    </form>
  );
}
