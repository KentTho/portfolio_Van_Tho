# Feature modules

Feature-first Clean Architecture. Each feature is a self-contained module with
four layers and a strict inward dependency direction.

```
src/modules/<feature>/
├── domain/          # entities, value objects, repository/service interfaces, errors (framework-free)
├── application/     # use cases, DTOs, ports, policies (depends on domain only)
├── infrastructure/  # concrete repositories + provider adapters (implements ports)
└── presentation/    # components, server actions, view models (composes)
```

## Dependency direction

```
presentation → application → domain
infrastructure → application/domain ports
domain → (no framework/provider dependency)
```

## Rules

- Create a feature folder only when its owning Wave implements the feature
  (do not scaffold empty modules to match a future tree).
- Domain must not import React, Next.js, provider SDKs, or `process.env`.
- Application must not import concrete infrastructure — depend on ports.
- Enforcement: ESLint import-boundary rules + `tests/architecture/dependency-rules.test.ts`.

Planned modules (see `docs/architecture/component-view.md`): `identity, profile,
projects, articles, experience, skills, media, contact, site-settings, revisions, audit`.
