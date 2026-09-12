import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

test("historical quality distinguishes incomplete work and renders all months on desktop and mobile", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", (route) => route.fulfill({ contentType: "text/html", body: fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<link\b[^>]*>/g, "") }));
    await page.goto("https://ops-test.local/#quality");
    const history = JSON.parse(fs.readFileSync("01-SiteV2/site/data/china-funding-history-quality-v1.json", "utf8"));
    await page.evaluate((history) => {
      window.WaveSightOpsConsole = { quality: { chinaFunding: { sources: [] }, chinaFundingHistory: history } };
      document.querySelector("[data-ops-console]").hidden = false;
    }, { ...history, status: "processed_with_gaps" });
    await page.addScriptTag({ content: fs.readFileSync("01-SiteV2/site/assets/operations-console.js", "utf8") });
    await page.evaluate(() => document.dispatchEvent(new CustomEvent("operations:authenticated", { detail: { csrfToken: "synthetic-read-only" } })));
    const panel = page.locator("[data-china-funding-quality]");
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 960 });
      assert.match(await panel.innerText(), /本轮已处理，仍有证据缺口/);
      for (const month of history.months) assert.match(await panel.innerText(), new RegExp(month.month));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `horizontal overflow at ${width}`);
      if (process.env.CHINA_FUNDING_OPS_IMAGE_DIR) await page.screenshot({ path: `${process.env.CHINA_FUNDING_OPS_IMAGE_DIR}/china-funding-ops-${width}.png`, fullPage: true });
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
