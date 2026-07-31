/**
 * Base class for domain errors. Framework-free. Concrete errors declare a
 * stable machine-readable `code` used by the application error taxonomy.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
