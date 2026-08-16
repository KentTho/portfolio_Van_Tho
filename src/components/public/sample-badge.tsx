/** Marks illustrative placeholder content (content authority §N). */
export function SampleBadge({ label }: { readonly label: string }) {
  return (
    <span className="rounded-full border border-accent-3/40 bg-accent-3/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-3">
      {label}
    </span>
  );
}
