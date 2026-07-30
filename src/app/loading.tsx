export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 items-center justify-center py-24 text-fg-muted"
    >
      Loading…
    </div>
  );
}
