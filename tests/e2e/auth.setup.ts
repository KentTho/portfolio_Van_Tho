import { test as setup } from "@playwright/test";

/**
 * One-time operator-assisted auth setup. Opens a headed browser at the login boundary; the Owner
 * completes REAL GitHub OAuth (no bypass, no hardcoded credentials). Once redirected to /admin the
 * authenticated storageState is saved locally for the `authenticated` project.
 *
 * The state file is gitignored and MUST NOT be committed, printed, or copied into docs.
 * Run:  pnpm e2e:auth-setup   (headed; complete the GitHub sign-in when the window opens)
 */
const AUTH_STATE = "tests/.auth/owner.json";

setup("authenticate owner via GitHub OAuth", async ({ page }) => {
  setup.setTimeout(200_000);
  await page.goto("/admin-login");
  // The Owner performs the OAuth interaction in the opened window.
  await page.getByRole("button", { name: /github/i }).click().catch(() => {
    // Button label may differ; the Owner can also click manually in the headed window.
  });
  // Wait (long) for the human to finish OAuth and land on the admin dashboard.
  await page.waitForURL(/\/admin(\/|$)/, { timeout: 190_000 });
  await page.context().storageState({ path: AUTH_STATE });
});
