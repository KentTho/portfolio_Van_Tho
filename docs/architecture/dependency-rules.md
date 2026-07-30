# Dependency rules

## Allowed direction
```
presentation → application → domain
infrastructure → application (ports) , domain (contracts)
domain → (only shared/domain primitives)
```

## Forbidden imports by layer
| Layer | MUST NOT import |
|---|---|
| `domain` | `next/*`, `react`, `drizzle`, postgres client, `@supabase/*`, Vercel/Cloudflare SDK, `process.env`, browser APIs, Node `fs`, UI components |
| `application` | concrete Neon repositories, Supabase client, Next request/response, React |
| `infrastructure` | presentation components |
| `presentation` | another module's `infrastructure` internals (use its application layer) |

## Ports & adapters
Application defines **ports** (interfaces): `ProjectRepositoryPort`, `AuthPort`, `StoragePort`, `EmailPort`, `TurnstilePort`, `LoggerPort`, `AuditPort`, `ClockPort`. Infrastructure provides adapters. Composition happens in presentation/infrastructure wiring, never in domain.

## Enforcement mechanisms
1. **ESLint** `no-restricted-imports` / import-boundary plugin per layer glob.
2. **dependency-cruiser** rules (`scripts/check-architecture.ts` / `.dependency-cruiser`), run in CI.
3. **Architecture tests** in `tests/architecture/` asserting the import graph.
4. **Domain unit tests** run with no framework/provider available.

## Rationale
Keeps business rules portable and testable, allows swapping providers (e.g., extracting a future Python/RAG service behind a port) without touching domain/application, and prevents accidental leakage of secrets/framework concerns into pure logic.
