import { defineConfig, devices } from "@playwright/test";

/**
 * Minimal foundation E2E (Wave 05 gate). Two projects:
 *  - `public`     — anonymous journeys (public pages + admin deny). Runnable headless in CI/dev.
 *  - `authenticated` — owner_admin journeys (admin allow + project/article lifecycle). Requires a
 *    locally-created storageState via real GitHub OAuth (see `auth.setup.ts`); never committed.
 *
 * The dev server auto-loads `.env.local` (Next.js), so live Neon reads work at runtime. No secret
 * is passed through Playwright config.
 */
const AUTH_STATE = "tests/.auth/owner.json";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "public",
      testMatch: /\.public\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authenticated",
      testMatch: /\.authed\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: AUTH_STATE },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000/vi",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
