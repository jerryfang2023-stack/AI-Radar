import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

test("production Token panel supports configure, preview, confirm, receipt and mobile layout", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
    const html = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8");
    const panel = html.match(/<section class="panel" data-panel="membership-token">[\s\S]*?(?=<section class="panel" data-panel="membership-schedule">)/)[0];
    const css = html.match(/<style>([\s\S]*?)<\/style>/)[1] + fs.readFileSync("01-SiteV2/site/assets/member-operations.css", "utf8");
    const script = "// Token management uses" + fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8").split("// Token management uses")[1];
    const config = { id: "season-2", label: "第二季", revision: 1, start: "2026-09-14", end: "", eligibleTypes: [], enabled: false, amount: 0, provider: "", unit: "Token", rules: "" };
    const data = { seasons: [config], batches: [], activityTypes: [{ id: "sharing", label: "分享互动" }], audits: [] };
    const actions = [];
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (request.url() === "https://token-test.local/") {
        return route.fulfill({ contentType: "text/html; charset=utf-8", body: '<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>' + css + '.panel{display:block!important}</style></head><body><main data-member-operations>' + panel + '</main></body></html>' });
      }
      if (!request.url().includes("/ops/member-api/token-benefits")) return route.abort();
      let result = data;
      if (request.method() === "POST") {
        assert.equal(request.headers()["x-csrf-token"], "test-session-csrf-1234567890");
        const body = request.postDataJSON(), action = request.url().split("/").at(-1);
        actions.push(action);
        assert.ok(body.operationId);
        if (action === "configure") Object.assign(config, body.config, { revision: 2 });
        if (action === "preview") result = { config: { ...config }, allocations: [{ memberId: 7, name: "测试成员", points: 20, amount: 100 }], remaining: 0, previewHash: "synthetic-preview-hash" };
        if (action === "confirm") {
          assert.equal(body.previewHash, "synthetic-preview-hash");
          data.batches = [{ config: { ...config }, allocations: [{ memberId: 7, name: "测试成员", points: 20, amount: 100 }], remaining: 0 }];
        }
        if (action === "receipt") {
          assert.equal(body.memberId, 7);
          data.batches[0].allocations[0].receipt = { receipt: body.receipt };
        }
      }
      return route.fulfill({ contentType: "application/json", body: JSON.stringify(result) });
    });
    // Every request is fulfilled by the test; no live service or account is used.
    await page.goto("https://token-test.local/");
    await page.addScriptTag({ content: script });
    await page.evaluate(() => {
      document.querySelector("[data-member-operations]").dispatchEvent(new CustomEvent("membership:open", { detail: { view: "membership-token" } }));
      document.dispatchEvent(new CustomEvent("operations:authenticated", { detail: { csrfToken: "test-session-csrf-1234567890" } }));
    });
    await page.locator('[name="provider"]').fill("测试供应方");
    await page.locator('[name="amount"]').fill("100");
    await page.locator('[name="rules"]').fill("测试规则：按有效积分占比分配。");
    await page.locator('[name="type"]').check();
    await page.locator('[name="enabled"]').check();
    await page.getByRole("button", { name: "保存设置" }).click();
    await page.locator('[data-token-status]').filter({ hasText: "设置已保存" }).waitFor();
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 960 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "configuration must fit viewport");
      if (process.env.TOKEN_REVIEW_DIR) {
        fs.mkdirSync(process.env.TOKEN_REVIEW_DIR, { recursive: true });
        await page.screenshot({ path: process.env.TOKEN_REVIEW_DIR + "/token-ops-" + width + ".png", fullPage: true });
      }
    }
    await page.getByRole("button", { name: "预览分配" }).click();
    await page.getByRole("button", { name: "确认本季分配" }).waitFor();
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "确认本季分配" }).click();
    await page.getByPlaceholder("实际发放凭据编号").fill("test-receipt-001");
    await page.getByRole("button", { name: "登记发放", exact: true }).click();
    await page.getByText("已登记 · test-receipt-001").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "allocation table must stay inside its scroller");
    assert.deepEqual(actions, ["configure", "preview", "confirm", "receipt"]);
    assert.equal(await page.locator('[name="provider"]').isDisabled(), true);
    await page.evaluate(() => document.dispatchEvent(new CustomEvent("operations:logout")));
    assert.equal(await page.locator("[data-token-records]").textContent(), "");
  } finally { await browser.close(); }
});
