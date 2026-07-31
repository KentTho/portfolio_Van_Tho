/**
 * A use case is a single application operation with an explicit input and output.
 * Application layer only — must not depend on framework or concrete infrastructure.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput> | TOutput;
}
