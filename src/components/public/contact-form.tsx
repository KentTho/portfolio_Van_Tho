"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionary";

type Status = "idle" | "invalid" | "prepared";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Accessible contact form UI. Submission is NOT wired to delivery yet (Wave 06) —
 * we never falsely claim an email was sent; on valid input we show the honest note.
 */
export function ContactForm({ dict }: { readonly dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = values.name.trim() && EMAIL.test(values.email) && values.message.trim().length >= 5;
    setStatus(valid ? "prepared" : "invalid");
  };

  const field =
    "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl space-y-4">
      <div>
        <label htmlFor="cf-name" className="text-sm text-fg-muted">
          {dict.contact.name}
        </label>
        <input
          id="cf-name"
          name="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="text-sm text-fg-muted">
          {dict.contact.email}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="text-sm text-fg-muted">
          {dict.contact.message}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className={field}
        />
      </div>

      {/* Turnstile guard boundary (visual placeholder; wired in Wave 06). */}
      <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-fg-subtle">
        Cloudflare Turnstile
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-canvas transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        {dict.contact.send}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={status === "invalid" ? "text-sm text-danger" : "text-sm text-fg-subtle"}
      >
        {status === "invalid" ? dict.contact.subtitle : dict.contact.note}
      </p>
    </form>
  );
}
