// Safe environment key-presence checker.
// Prints KEY_NAME + STATUS + SCOPE only. NEVER prints values. No dependencies.
// Usage: node scripts/check-env.mjs
import { existsSync, readFileSync } from "node:fs";

/** Parse a dotenv-style file into Map<key, isEmpty>. Values are inspected only
 *  to determine emptiness — they are never returned or printed. */
function keyMap(file) {
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (m) map.set(m[1], m[2].trim().length === 0);
  }
  return map;
}

const expected = [...keyMap(".env.example").keys()];
const local = keyMap(".env.local");

let missing = 0;
console.log("KEY_NAME".padEnd(38) + "STATUS".padEnd(9) + "SCOPE");
for (const key of expected) {
  let status;
  if (!local.has(key)) {
    status = "MISSING";
    missing += 1;
  } else {
    status = local.get(key) ? "EMPTY" : "PRESENT";
  }
  const scope = key.startsWith("NEXT_PUBLIC_") ? "PUBLIC" : "SERVER";
  console.log(key.padEnd(38) + status.padEnd(9) + scope);
}
console.log(`\n(${expected.length} expected, ${missing} missing — values never read)`);
