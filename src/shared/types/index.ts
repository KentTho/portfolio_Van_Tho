/** Nominal typing helper for domain identifiers and branded primitives. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type Nullable<T> = T | null;

export type Locale = "vi" | "en";
