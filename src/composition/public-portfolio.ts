import type { PortfolioRepository } from "@/modules/public-portfolio/application/ports/portfolio-repository";
import { StaticPortfolioRepository } from "@/modules/public-portfolio/infrastructure/static-portfolio-repository";

/**
 * Composition root for the public portfolio. Presentation imports from here, never
 * from a concrete repository. Swap the implementation (e.g. Neon-backed) in one place.
 */
let repository: PortfolioRepository | undefined;

export function getPortfolioRepository(): PortfolioRepository {
  repository ??= new StaticPortfolioRepository();
  return repository;
}
