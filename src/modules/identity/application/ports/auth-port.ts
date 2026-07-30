export interface AuthIdentity {
  readonly supabaseUserId: string;
  readonly email: string;
}

/** Port over the identity provider (Supabase Auth). Implemented in infrastructure. */
export interface AuthPort {
  getCurrentIdentity(): Promise<AuthIdentity | null>;
}
