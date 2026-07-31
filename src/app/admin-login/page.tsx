"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/infrastructure/supabase/browser-client";
import { buttonVariants } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGitHub() {
    setPending(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError("Sign-in could not start. Please try again.");
      setPending(false);
    }
  }

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-2xl font-semibold text-fg">Admin sign in</h1>
      <p className="mt-3 text-fg-muted">
        Access is restricted to the site owner. Public sign-up is disabled.
      </p>
      <button
        type="button"
        onClick={signInWithGitHub}
        disabled={pending}
        className={`mt-8 ${buttonVariants({ variant: "primary" })}`}
      >
        {pending ? "Redirecting…" : "Sign in with GitHub"}
      </button>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </main>
  );
}
