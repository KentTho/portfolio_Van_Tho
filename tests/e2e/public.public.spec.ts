import { expect, test } from "@playwright/test";

/**
 * E2E-01 — anonymous public journeys for the SINGLE LANDING architecture.
 * Proves each locale root renders every landing section, exposes NO admin
 * surface, shows no draft/archived leak, and that the consolidated routes
 * (/projects /articles /about /resume /contact) redirect to landing anchors.
 * Robust to an empty Neon dev DB (sections render truthful empty states).
 */
const SECTION_IDS = ["home", "about", "projects", "experience", "skills", "articles", "contact"] as const;

const CONSOLIDATED: ReadonlyArray<readonly [string, string]> = [
  ["projects", "projects"],
  ["articles", "articles"],
  ["about", "about"],
  ["resume", "experience"],
  ["contact", "contact"],
];

for (const locale of ["vi", "en"] as const) {
  test(`landing renders all sections and hides admin surface (${locale})`, async ({ page }) => {
    const res = await page.goto(`/${locale}`);
    expect(res?.status()).toBeLessThan(400);

    // No admin navigation must ever leak onto the public site.
    await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
    await expect(page.locator('a[href*="/admin-login"]')).toHaveCount(0);

    // Every anchored landing section is present.
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // No draft/archived content ever leaks to the public landing.
    await expect(page.locator("body")).not.toContainText(/\b(draft|archived)\b/i);
  });

  test(`consolidated routes redirect to landing anchors (${locale})`, async ({ page }) => {
    for (const [route, anchor] of CONSOLIDATED) {
      const res = await page.goto(`/${locale}/${route}`);
      expect(res?.status()).toBeLessThan(400);
      // Landing on the single page means the target section exists in the DOM.
      await expect(page.locator(`#${anchor}`)).toHaveCount(1);
      await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
    }
  });
}

test("unlocalized root redirects to a locale prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(vi|en)(\/|$)/);
});
