"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side error boundary. Observability wiring is added in a later Wave.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-3xl font-semibold text-fg">Something went wrong</h1>
      <p className="mt-4 text-fg-muted">
        An unexpected error occurred. You can try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className={`mt-8 ${buttonVariants({ variant: "outline" })}`}
      >
        Try again
      </button>
    </main>
  );
}
