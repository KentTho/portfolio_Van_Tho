import { expect, test } from "@playwright/test";

/**
 * E2E-01 — anonymous public journeys. Proves the visitor site loads in both locales, exposes NO
 * admin surface, and (with an empty Neon dev DB) shows truthful empty states rather than any
 * draft/archived/sample-as-real content. Robust to zero published content.
 */
for (const locale of ["vi", "en"] as const) {
  test(`home renders and hides admin surface (${locale})`, async ({ page }) => {
    const res = await page.goto(`/${locale}`);
    expect(res?.status()).toBeLessThan(400);
    // No admin navigation must ever leak onto the public site.
    await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
    await expect(page.locator('a[href*="/admin-login"]')).toHaveCount(0);
  });

  test(`projects list loads without draft/archived leak (${locale})`, async ({ page }) => {
    const res = await page.goto(`/${locale}/projects`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("body")).not.toContainText(/\b(draft|archived)\b/i);
    await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
  });

  test(`articles list loads without draft/archived leak (${locale})`, async ({ page }) => {
    const res = await page.goto(`/${locale}/articles`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("body")).not.toContainText(/\b(draft|archived)\b/i);
  });
}

test("unlocalized root redirects to a locale prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(vi|en)(\/|$)/);
});
