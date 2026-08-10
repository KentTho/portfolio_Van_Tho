import { expect, test } from "@playwright/test";

/**
 * E2E-02 (positive half) — an authenticated owner_admin reaches the admin dashboard (no redirect
 * to login). Runs only under the operator-created storageState.
 */
test("owner_admin can load the admin dashboard", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin(\/|$)/);
  await expect(page.getByRole("heading", { name: "Bảng điều khiển" })).toBeVisible();
});
