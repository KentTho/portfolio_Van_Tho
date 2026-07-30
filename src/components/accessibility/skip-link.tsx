/** Keyboard skip link — visually hidden until focused. Targets the page main region. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-accent px-4 py-2 font-medium text-canvas focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      Skip to main content
    </a>
  );
}
