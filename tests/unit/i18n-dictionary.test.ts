import { describe, expect, it } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { vi } from "@/i18n/dictionaries/vi";
import { DEFAULT_LOCALE, isLocale, LOCALES, pick } from "@/shared/i18n";

/** Collect dotted key paths; arrays are represented by their length marker. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return [`${prefix}[len:${value.length}]`, ...value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .flatMap((k) => keyPaths((value as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe("locale primitives", () => {
  it("recognises supported locales and rejects others", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  it("defaults to vi and lists both locales", () => {
    expect(DEFAULT_LOCALE).toBe("vi");
    expect([...LOCALES]).toEqual(["vi", "en"]);
  });

  it("pick resolves the requested locale", () => {
    expect(pick({ vi: "xin chào", en: "hello" }, "en")).toBe("hello");
    expect(pick({ vi: "xin chào", en: "hello" }, "vi")).toBe("xin chào");
  });
});

describe("dictionary key parity", () => {
  it("vi and en expose identical key structures (no missing translation keys)", () => {
    expect(keyPaths(vi)).toEqual(keyPaths(en));
  });

  it("has no empty string values", () => {
    const emptyEn = keyPaths(en).filter((p) => p.endsWith("[len:0]"));
    expect(emptyEn).toEqual([]);
  });
});
