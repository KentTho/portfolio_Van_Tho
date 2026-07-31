import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-fg">Page not found</h1>
      <p className="mt-4 text-fg-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <Link href="/" className={`mt-8 ${buttonVariants({ variant: "outline" })}`}>
        Back to home
      </Link>
    </main>
  );
}
