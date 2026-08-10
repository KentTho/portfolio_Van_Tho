import { expect, test } from "@playwright/test";

/**
 * E2E-04 — article draft→publish visibility contract through the real admin UI (owner_admin
 * storageState). A published article produces a revision snapshot and an audit record (both proven
 * at the unit/integration layer; here we assert the public visibility transition end-to-end).
 *
 * Runs only under the operator-created storageState.
 */
const slug = `e2e-art-${Date.now()}`;

test("article draft hidden → publish visible", async ({ page }) => {
  await page.goto("/admin/articles/new");
  await page.locator('input[name="slug"]').fill(slug);
  await page.locator('input[name="vi_title"]').fill(`E2E ${slug}`);
  await page.getByRole("button", { name: /lưu|tạo|create|save/i }).first().click();
  await expect(page.locator("body")).toContainText(slug, { timeout: 15_000 });

  // Draft hidden publicly.
  await page.goto("/vi/articles");
  await expect(page.locator("body")).not.toContainText(slug);

  // Publish → visible publicly.
  await page.goto("/admin/articles");
  await page.getByRole("link", { name: new RegExp(slug, "i") }).click();
  await page.getByRole("button", { name: /xuất bản|công khai|publish/i }).first().click();
  await page.goto("/vi/articles");
  await expect(page.locator("body")).toContainText(slug, { timeout: 15_000 });
});
