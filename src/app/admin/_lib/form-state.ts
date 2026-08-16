/**
 * Client-safe form state shared by admin Server Actions and the client forms that consume
 * them via useActionState. No server-only imports here so `"use client"` forms can import it.
 * The server-only action runner lives in `./admin-action`.
 */
export type FormState =
  | { readonly status: "idle" }
  | { readonly status: "success"; readonly message: string; readonly id?: string }
  | {
      readonly status: "error";
      readonly message: string;
      readonly code?: string;
      readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
    };

export const idleState: FormState = { status: "idle" };

export function success(message: string, id?: string): FormState {
  return id ? { status: "success", message, id } : { status: "success", message };
}

export function failure(message: string, code?: string): FormState {
  return { status: "error", message, code };
}
