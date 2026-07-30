# Component view (C4 Level 3)

Each feature module (`src/modules/<feature>/`) contains four layers:

```
<feature>/
  domain/          entities, value-objects, repository/service interfaces, errors  (framework-free)
  application/     use-cases, dto, ports, policies                                 (depends on domain)
  infrastructure/  concrete repositories, provider adapters, mappers               (implements ports)
  presentation/    components, server actions, view-models                         (composes)
```

## Modules
`identity, profile, projects, articles, experience, skills, media, contact, site-settings, revisions, audit`.

## Example — `projects` module
- **domain:** `Project`, `ProjectSection`, `ProjectStatus` VO, `ProjectRepository` interface, `ProjectPublishError`.
- **application:** `PublishProject`, `ListPublishedProjects`, `CreateProject` use-cases; `ProjectRepositoryPort`; publish policy (must have ≥1 translation).
- **infrastructure:** `DrizzleProjectRepository` implementing the port; row↔entity mappers.
- **presentation:** admin project form (server action), public case-study view model.

## Shared kernel (`src/shared/`)
`Entity`, `ValueObject`, `DomainError`, `Result`, `UseCase`, pagination, `Clock`, validation, types, utils.

## Enforcement
Boundaries validated by ESLint import rules, dependency-cruiser, and `tests/architecture/`. Domain unit-tested in isolation.
