import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Architecture boundary test — scans the real source import graph and asserts
 * Clean Architecture layer rules. Failures name the offending file, target and
 * reason. A synthetic fixture proves the detector actually catches violations
 * (so the suite can never pass vacuously).
 */

const SRC = join(process.cwd(), "src");

type Layer = "domain" | "application" | "infrastructure" | "presentation" | "other";

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function layerOf(rel: string): Layer {
  if (/(^|\/)(shared\/domain|modules\/[^/]+\/domain)(\/|$)/.test(rel)) return "domain";
  if (/(^|\/)(shared\/application|modules\/[^/]+\/application)(\/|$)/.test(rel)) {
    return "application";
  }
  if (/(^|\/)(modules\/[^/]+\/infrastructure|infrastructure)(\/|$)/.test(rel)) {
    return "infrastructure";
  }
  if (/(^|\/)(app|components|modules\/[^/]+\/presentation)(\/|$)/.test(rel)) {
    return "presentation";
  }
  return "other";
}

function importsOf(content: string): string[] {
  const specs: string[] = [];
  const re =
    /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const spec = match[1] ?? match[2];
    if (spec) specs.push(spec);
  }
  return specs;
}

const isFramework = (spec: string): boolean =>
  spec === "react" || spec === "react-dom" || spec === "next" || spec.startsWith("next/");

function violationsFor(layer: Layer, rel: string, content: string): string[] {
  const problems: string[] = [];
  const specs = importsOf(content);

  if (layer === "domain") {
    for (const spec of specs) {
      if (isFramework(spec)) problems.push(`${rel}: domain imports framework "${spec}"`);
      if (spec.startsWith("@/components") || spec.startsWith("@/app")) {
        problems.push(`${rel}: domain imports presentation "${spec}"`);
      }
      if (spec.includes("infrastructure")) {
        problems.push(`${rel}: domain imports infrastructure "${spec}"`);
      }
      if (spec.startsWith("@/config")) {
        problems.push(`${rel}: domain imports config "${spec}"`);
      }
    }
    if (/\bprocess\.env\b/.test(content)) {
      problems.push(`${rel}: domain accesses process.env`);
    }
  }

  if (layer === "application") {
    for (const spec of specs) {
      if (isFramework(spec)) {
        problems.push(`${rel}: application imports framework "${spec}"`);
      }
      if (spec.includes("infrastructure")) {
        problems.push(`${rel}: application imports concrete infrastructure "${spec}"`);
      }
    }
  }

  if (layer === "infrastructure") {
    for (const spec of specs) {
      if (
        spec.startsWith("@/components") ||
        spec.startsWith("@/app") ||
        spec.includes("/presentation")
      ) {
        problems.push(`${rel}: infrastructure imports presentation "${spec}"`);
      }
    }
  }

  if (layer === "presentation") {
    for (const spec of specs) {
      // Presentation must go through the application layer, never reach into a
      // concrete infrastructure implementation directly.
      if (spec.includes("/infrastructure") || spec.startsWith("@/infrastructure")) {
        problems.push(`${rel}: presentation imports concrete infrastructure "${spec}"`);
      }
    }
  }

  return problems;
}

describe("architecture dependency rules", () => {
  const files = walk(SRC).map((full) => ({
    rel: toPosix(relative(SRC, full)),
    content: readFileSync(full, "utf8"),
  }));

  it("analyzes the source tree (guards against a vacuous pass)", () => {
    const domainFiles = files.filter((f) => layerOf(f.rel) === "domain");
    expect(files.length).toBeGreaterThan(0);
    expect(domainFiles.length).toBeGreaterThan(0);
  });

  it("has no Clean Architecture layer violations", () => {
    const all: string[] = [];
    for (const file of files) {
      all.push(...violationsFor(layerOf(file.rel), file.rel, file.content));
    }
    expect(all, `Boundary violations:\n${all.join("\n")}`).toEqual([]);
  });

  it("detects a forbidden domain dependency (fixture)", () => {
    const fixture = `import React from "react";\nconst x = process.env.SECRET;\n`;
    const found = violationsFor("domain", "modules/demo/domain/bad.ts", fixture);
    expect(found.length).toBeGreaterThanOrEqual(2);
    expect(found.join("\n")).toContain("imports framework");
    expect(found.join("\n")).toContain("process.env");
  });

  it("detects application importing concrete infrastructure (fixture)", () => {
    const fixture = `import { DrizzleRepo } from "@/modules/projects/infrastructure/repo";\n`;
    const found = violationsFor("application", "modules/projects/application/uc.ts", fixture);
    expect(found.join("\n")).toContain("concrete infrastructure");
  });

  it("detects infrastructure importing presentation (fixture)", () => {
    const fixture = `import { Button } from "@/components/ui/button";\n`;
    const found = violationsFor("infrastructure", "modules/projects/infrastructure/repo.ts", fixture);
    expect(found.join("\n")).toContain("imports presentation");
  });

  it("detects presentation reaching into concrete infrastructure (fixture)", () => {
    const fixture = `import { db } from "@/infrastructure/database/client";\n`;
    const found = violationsFor("presentation", "app/admin/page.tsx", fixture);
    expect(found.join("\n")).toContain("concrete infrastructure");
  });
});
