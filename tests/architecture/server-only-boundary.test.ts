import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Server-only boundary test (CLAUDE.md §10, §14). Proves the browser bundle can
 * never obtain the storage service secret: no Client Component may import the
 * server env, the service storage client, the database, the composition root,
 * or reference a secret env name. A fixture guards against a vacuous pass.
 */

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
  }
  return files;
}

const toPosix = (p: string): string => p.replace(/\\/g, "/");

/** A module is a Client Component only if "use client" is its first statement. */
const isClientModule = (content: string): boolean =>
  /^﻿?\s*["']use client["']/.test(content);

const FORBIDDEN_IMPORTS = [
  "@/config/env.server",
  "server-only",
  "/infrastructure/database",
  "/storage-client",
  "supabase-storage-uploader",
  "@/composition/",
];

const FORBIDDEN_TOKENS = ["SUPABASE_SECRET_KEY", "DATABASE_URL", "SUPABASE_SERVICE"];

function clientViolations(rel: string, content: string): string[] {
  const problems: string[] = [];
  const importRe = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(content)) !== null) {
    const spec = m[1] ?? "";
    for (const bad of FORBIDDEN_IMPORTS) {
      if (spec.includes(bad)) problems.push(`${rel}: client imports server-only "${spec}"`);
    }
  }
  for (const token of FORBIDDEN_TOKENS) {
    if (content.includes(token)) problems.push(`${rel}: client references secret token "${token}"`);
  }
  return problems;
}

describe("server-only boundary", () => {
  const files = walk(SRC).map((full) => ({
    rel: toPosix(relative(SRC, full)),
    content: readFileSync(full, "utf8"),
  }));

  it("finds client modules to analyze (guards against a vacuous pass)", () => {
    expect(files.some((f) => isClientModule(f.content))).toBe(true);
  });

  it("no Client Component can reach the service secret", () => {
    const all: string[] = [];
    for (const f of files) {
      if (isClientModule(f.content)) all.push(...clientViolations(f.rel, f.content));
    }
    expect(all, `Server-only boundary violations:\n${all.join("\n")}`).toEqual([]);
  });

  it("every server env / service-client importer also imports server-only", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const usesSecret =
        /from\s*['"]@\/config\/env\.server['"]/.test(f.content) ||
        /from\s*['"][^'"]*storage-client['"]/.test(f.content);
      if (usesSecret && !/["']server-only["']/.test(f.content)) {
        offenders.push(f.rel);
      }
    }
    expect(offenders, `Missing server-only guard:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("detects a leaking Client Component (fixture)", () => {
    const fixture = `"use client";\nimport { serverEnv } from "@/config/env.server";\n`;
    const found = clientViolations("app/leak/page.tsx", fixture);
    expect(found.join("\n")).toContain("server-only");
  });
});
