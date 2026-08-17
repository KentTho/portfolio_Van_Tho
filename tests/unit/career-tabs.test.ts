import { describe, expect, it } from "vitest";
import { careerTabKeys, careerHasTabs, formatPeriod } from "@/components/public/sections/career-tabs";

/**
 * Career state machine (pure): tabs appear ONLY when both datasets exist; with a
 * single dataset the section shows that one timeline (no empty tab). Experience is
 * the default when both are present. Period formatting handles ongoing/closed rows.
 */
describe("career state machine", () => {
  it("education-only → single 'education' key, no tabs", () => {
    expect(careerTabKeys(false, true)).toEqual(["education"]);
    expect(careerHasTabs(false, true)).toBe(false);
  });

  it("experience-only → single 'experience' key, no tabs", () => {
    expect(careerTabKeys(true, false)).toEqual(["experience"]);
    expect(careerHasTabs(true, false)).toBe(false);
  });

  it("both datasets → [experience, education] tabs, experience default first", () => {
    expect(careerTabKeys(true, true)).toEqual(["experience", "education"]);
    expect(careerHasTabs(true, true)).toBe(true);
    expect(careerTabKeys(true, true)[0]).toBe("experience");
  });

  it("neither → no keys, no tabs", () => {
    expect(careerTabKeys(false, false)).toEqual([]);
    expect(careerHasTabs(false, false)).toBe(false);
  });
});

describe("formatPeriod", () => {
  it("ongoing row uses the locale present word", () => {
    expect(formatPeriod("2022", "", true, "Hiện tại")).toBe("2022 — Hiện tại");
    expect(formatPeriod("2022", "", true, "Present")).toBe("2022 — Present");
  });
  it("closed row shows the end year", () => {
    expect(formatPeriod("2019", "2023", false, "Present")).toBe("2019 — 2023");
  });
  it("start-only row shows just the start year", () => {
    expect(formatPeriod("2020", "", false, "Present")).toBe("2020");
  });
  it("no start year → empty", () => {
    expect(formatPeriod("", "", false, "Present")).toBe("");
  });
});
