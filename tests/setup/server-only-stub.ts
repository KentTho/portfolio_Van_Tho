// Test stub for the `server-only` guard. The real package throws when bundled into a
// client graph; under Vitest we resolve it to this no-op so server modules (DB client,
// repositories) can be exercised directly in integration tests. It does not weaken the
// production guard — that still applies to the real Next.js build.
export {};
