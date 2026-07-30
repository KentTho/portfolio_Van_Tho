import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok } from "@/shared/domain/result";
import { DomainError } from "@/shared/domain/domain-error";
import { Entity } from "@/shared/domain/entity";

class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";
  constructor() {
    super("resource not found");
  }
}

class UserId extends Entity<string> {
  static of(id: string): UserId {
    return new UserId(id);
  }
  private constructor(id: string) {
    super(id);
  }
}

describe("Result", () => {
  it("narrows to Ok and exposes the value", () => {
    const result = ok(42);
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
    if (isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it("narrows to Err and exposes the error", () => {
    const result = err(new NotFoundError());
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.code).toBe("NOT_FOUND");
      expect(result.error.name).toBe("NotFoundError");
    }
  });
});

describe("Entity", () => {
  it("is equal by identity", () => {
    expect(UserId.of("a").equals(UserId.of("a"))).toBe(true);
    expect(UserId.of("a").equals(UserId.of("b"))).toBe(false);
    expect(UserId.of("a").equals(null)).toBe(false);
  });
});
