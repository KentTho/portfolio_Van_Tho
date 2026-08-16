import type { PortfolioRepository } from "@/modules/public-portfolio/application/ports/portfolio-repository";
import { NeonPortfolioRepository } from "@/modules/public-portfolio/infrastructure/neon-portfolio-repository";

/**
 * Composition root for the public portfolio. Presentation imports from here, never from a
 * concrete repository. Wave 05 swaps the runtime authority to the live Neon read model
 * (published/visible/public only) behind the same port — no presentation change. The
 * Wave-04 `StaticPortfolioRepository` (SAMPLE fixtures) is retained in the tree for reference
 * and tests but is no longer the runtime source.
 */
let repository: PortfolioRepository | undefined;

export function getPortfolioRepository(): PortfolioRepository {
  repository ??= new NeonPortfolioRepository();
  return repository;
}
