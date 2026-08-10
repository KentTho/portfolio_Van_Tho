import { expect, test } from "@playwright/test";

/**
 * E2E-02 (negative half) — anonymous authorization. An unauthenticated visit to /admin must be
 * denied and routed to the login boundary. The positive half (owner_admin ALLOWED) lives in the
 * authenticated project, which requires a locally-created storageState.
 */
test("anonymous /admin is denied and redirected to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin-login/);
});

test("anonymous /admin/projects is denied", async ({ page }) => {
  await page.goto("/admin/projects");
  await expect(page).toHaveURL(/\/admin-login/);
});
