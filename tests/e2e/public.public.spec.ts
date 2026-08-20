import { expect, test } from "@playwright/test";

/**
 * E2E-01 — anonymous public journeys for the CV-driven single landing (6-block IA).
 * Proves each locale root renders every landing section, exposes NO admin surface,
 * shows no draft/archived leak, and that the consolidated routes redirect to landing
 * anchors. Robust to an empty Neon dev DB (sections render truthful empty states).
 */
const SECTION_IDS = ["home", "about", "projects", "career", "skills", "contact"] as const;

// route -> landing anchor it consolidates to.
const CONSOLIDATED: ReadonlyArray<readonly [string, string]> = [
  ["projects", "projects"],
  ["about", "about"],
  ["resume", "career"],
  ["contact", "contact"],
  ["articles", "home"], // articles removed from IA — list route returns to landing
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

  test(`navigation active state hands off across all sections with no dead-zone (${locale})`, async ({ page }) => {
    // V2 global nav: brand = Home at the top; each section owns the active capsule
    // as it scrolls into view; Contact stays active through the footer (no dead-zone).
    await page.goto(`/${locale}`);
    await expect(page.locator('header a[aria-current="page"]')).toBeVisible();
    for (const id of ["about", "projects", "career", "skills", "contact"] as const) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: "center" }), id);
      await expect(
        page.locator(`nav[aria-label="Primary"] a[href$="#${id}"][aria-current="location"]`),
      ).toHaveCount(1, { timeout: 4000 });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(
      page.locator('nav[aria-label="Primary"] a[href$="#contact"][aria-current="location"]'),
    ).toHaveCount(1, { timeout: 4000 });
  });

  test(`no hydration or runtime errors on the landing (${locale})`, async ({ page }) => {
    // Regression guard (V2 hydration hardening): the app must produce no hydration
    // mismatch and no uncaught runtime error in a clean browser. Owner-reported
    // warnings were browser-extension DOM mutation, not app defects — this keeps
    // the app side honest going forward.
    const bad: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" && /hydrat/i.test(m.text())) bad.push(m.text());
    });
    page.on("pageerror", (e) => bad.push(`pageerror: ${e.message}`));
    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");
    expect(bad, bad.join("\n")).toEqual([]);
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
