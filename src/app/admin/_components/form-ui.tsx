"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { FormState } from "@/app/admin/_lib/form-state";

/** Inline banner reflecting the current action state (success / typed error). */
export function FormStatus({ state }: { state: FormState }) {
  if (state.status === "success") {
    return (
      <p role="status" className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
        {state.message}
      </p>
    );
  }
  if (state.status === "error") {
    return (
      <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
        {state.message}
      </p>
    );
  }
  return null;
}

/** Submit button that disables + relabels itself while the action is pending. */
export function SubmitButton({ children, pendingLabel = "Đang lưu…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonVariants({ variant: "primary" })}>
      {pending ? pendingLabel : children}
    </button>
  );
}

const fieldInput =
  "mt-1 w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Labelled text input. */
export function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-fg-muted">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={fieldInput}
      />
    </label>
  );
}

/** Labelled multiline input. */
export function TextArea({
  name,
  label,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="text-fg-muted">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={cn(fieldInput, "resize-y")} />
    </label>
  );
}

/** Labelled select. */
export function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-sm">
      <span className="text-fg-muted">{label}</span>
      <select name={name} defaultValue={defaultValue} className={fieldInput}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Labelled checkbox (present in FormData only when checked → value "on"). */
export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-fg-muted">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-border" />
      {label}
    </label>
  );
}
