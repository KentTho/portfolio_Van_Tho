// Local visual-QA helper (Prompt 12 section-by-section browser QA loop).
// Usage: node scripts/qa-screenshot.mjs <url> <out.png> [width] [height] [selector]
// Captures a full-page screenshot (or a single element when a selector is given)
// after motion settles. Output lands in .qa-shots/ (gitignored).
import { chromium } from "@playwright/test";

const [, , url, out, width = "1440", height = "900", selector] = process.argv;
if (!url || !out) {
  console.error("usage: node scripts/qa-screenshot.mjs <url> <out.png> [w] [h] [selector]");
  process.exit(1);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: Number(width), height: Number(height) },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1000); // allow entrance motion to complete
  if (selector) {
    const el = page.locator(selector).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: out });
  } else {
    await page.screenshot({ path: out, fullPage: true });
  }
  console.log("saved", out);
} finally {
  await browser.close();
}
