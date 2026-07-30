import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-2xl font-semibold text-fg">Sign-in failed</h1>
      <p className="mt-3 text-fg-muted">
        The sign-in link was invalid or has expired. Please try again.
      </p>
      <Link href="/admin-login" className={`mt-8 ${buttonVariants({ variant: "outline" })}`}>
        Back to sign in
      </Link>
    </main>
  );
}
