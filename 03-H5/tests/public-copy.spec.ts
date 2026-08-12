import { expect, test } from "@playwright/test";

test.use({ channel: "chrome", viewport: { width: 390, height: 844 } });

test("shows the confirmed financing name without internal copy", async ({ page }, testInfo) => {
  await page.goto(process.env.GUANLAN_H5_URL ?? "/h5/", { waitUntil: "domcontentloaded", timeout: 20_000 });
  await expect(page.locator(".app-header h1")).toHaveText("融资情报", { timeout: 20_000 });
  await expect(page.locator(".bottom-nav")).toContainText("融资");
  await expect(page.locator("body")).not.toContainText("融资终端");
  await expect(page.locator("body")).not.toContainText("多源核验");
  await page.screenshot({ path: testInfo.outputPath("financing-info-mobile.png"), fullPage: true });
});
