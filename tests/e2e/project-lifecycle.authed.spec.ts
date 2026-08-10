import { expect, test } from "@playwright/test";

/**
 * E2E-03 — project draft→publish→unpublish visibility contract, driven through the real admin UI
 * (owner_admin storageState). A draft must never appear on the public site; publishing exposes it;
 * unpublishing hides it again. The spec cleans up by archiving/removing the fixture project.
 *
 * Runs only under the operator-created storageState. Selectors follow the actual VN admin form
 * (name-based inputs; publish/unpublish action buttons).
 */
const slug = `e2e-proj-${Date.now()}`;

test("draft hidden → publish visible → unpublish hidden", async ({ page }) => {
  // Create a draft project.
  await page.goto("/admin/projects/new");
  await page.locator('input[name="slug"]').fill(slug);
  await page.locator('input[name="vi_title"]').fill(`E2E ${slug}`);
  await page.locator('input[name="en_title"]').fill(`E2E ${slug}`).catch(() => {});
  await page.getByRole("button", { name: /lưu|tạo|create|save/i }).first().click();
  await expect(page.locator("body")).toContainText(slug, { timeout: 15_000 });

  // Draft must NOT be visible publicly.
  await page.goto("/vi/projects");
  await expect(page.locator("body")).not.toContainText(slug);

  // Publish, then it must be visible publicly.
  await page.goto("/admin/projects");
  await page.getByRole("link", { name: new RegExp(slug, "i") }).click();
  await page.getByRole("button", { name: /xuất bản|công khai|publish/i }).first().click();
  await page.goto("/vi/projects");
  await expect(page.locator("body")).toContainText(slug, { timeout: 15_000 });

  // Unpublish, then it must be hidden again.
  await page.goto("/admin/projects");
  await page.getByRole("link", { name: new RegExp(slug, "i") }).click();
  await page.getByRole("button", { name: /gỡ|ẩn|unpublish|lưu trữ|archive/i }).first().click();
  await page.goto("/vi/projects");
  await expect(page.locator("body")).not.toContainText(slug);
});
