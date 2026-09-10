import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

test("production Token panel supports configure, preview, confirm, receipt and mobile layout", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
    const html = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8");
    const css = html.match(/<style>([\s\S]*?)<\/style>/)[1] + fs.readFileSync("01-SiteV2/site/assets/member-operations.css", "utf8");
    const script = "// Token management uses" + fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8").split("// Token management uses")[1];
    const config = { id: "season-2", label: "第二季", revision: 1, start: "2026-09-14", end: "", eligibleTypes: [], enabled: false, amount: 0, provider: "", unit: "Token", rules: "" };
    const data = { seasons: [config], batches: [], activityTypes: [{ id: "sharing", label: "分享互动" }], audits: [] };
    const actions = [];
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (request.url() === "https://token-test.local/") {
        // Keep the real sidebar and content container: panel-only tests missed field overflow.
        const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<link\b[^>]*>/g, "").replace("</head>", '<style>' + css + '</style></head>');
        return route.fulfill({ contentType: "text/html; charset=utf-8", body });
      }
      if (!request.url().includes("/ops/member-api/token-benefits")) return route.abort();
      let result = data;
      if (request.method() === "POST") {
        assert.equal(request.headers()["x-csrf-token"], "test-session-csrf-1234567890");
        const body = request.postDataJSON(), action = request.url().split("/").at(-1);
        actions.push(action);
        assert.ok(body.operationId);
        if (action === "configure") {
          if (body.config.distributionMode === "season_total") {
            assert.deepEqual(body.config.eligibleTypes, []);
            assert.match(body.config.rules, /测试赞助商/);
            assert.match(body.config.rules, /100 DeepSeek-V4\.1-Flash Token/);
          } else {
            assert.equal(body.config.distributionMode, "custom");
            assert.deepEqual(body.config.eligibleTypes, ["sharing"]);
            assert.equal(body.config.rules, "只按分享互动积分分配。");
          }
          Object.assign(config, body.config, { revision: config.revision + 1 });
        }
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
    await page.goto("https://token-test.local/#membership-token");
    await page.addScriptTag({ content: script });
    await page.addScriptTag({ content: fs.readFileSync("01-SiteV2/site/assets/operations-console.js", "utf8") });
    await page.evaluate(() => {
      document.querySelector("[data-ops-console]").hidden = false;
      document.dispatchEvent(new CustomEvent("operations:authenticated", { detail: { csrfToken: "test-session-csrf-1234567890" } }));
    });
    assert.equal(await page.locator('[name="distributionMode"]').inputValue(), "season_total");
    assert.equal(await page.locator('[data-token-custom]').isVisible(), false);
    assert.equal(await page.locator('[name="rules"]').getAttribute("readonly"), "");
    assert.match(await page.locator('[name="rules"]').inputValue(), /赛季总积分/);
    await page.locator('[name="distributionMode"]').selectOption("custom");
    assert.equal(await page.locator('[data-token-custom]').isVisible(), true);
    await page.getByRole("button", { name: "保存设置" }).click();
    await page.getByText("请至少选择一个计分类别", { exact: true }).waitFor();
    assert.deepEqual(actions, []);
    await page.locator('[name="type"]').check();
    await page.locator('[name="rules"]').fill("只按分享互动积分分配。");
    await page.getByRole("button", { name: "保存设置" }).click();
    await page.locator('[data-token-status]').filter({ hasText: "设置已保存" }).waitFor();
    assert.equal(await page.locator('[name="distributionMode"]').inputValue(), "custom");
    assert.equal(await page.locator('[name="rules"]').inputValue(), "只按分享互动积分分配。");
    await page.locator('[name="distributionMode"]').selectOption("season_total");
    assert.equal(await page.locator('[data-token-custom]').isVisible(), false);
    await page.getByLabel("赞助商", { exact: true }).fill("测试赞助商");
    await page.locator('[name="amount"]').fill("100");
    await page.locator('[name="model"]').fill("DeepSeek-V4.1-Flash");
    await page.locator('[name="rewardRankLimit"]').fill("20");
    assert.match(await page.locator('[name="rules"]').inputValue(), /第 20 名同分者全部纳入/);
    assert.match(await page.locator('[name="rules"]').inputValue(), /100 DeepSeek-V4\.1-Flash Token/);
    await page.getByRole("button", { name: "预览分配" }).click();
    await page.getByText("设置已修改，请先保存再预览分配", { exact: true }).waitFor();
    assert.deepEqual(actions, ["configure"]);
    await page.locator('[name="enabled"]').check();
    await page.getByRole("button", { name: "保存设置" }).click();
    await page.locator('[data-token-status]').filter({ hasText: "设置已保存" }).waitFor();
    for (const width of [1600, 1280, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 960 });
      await page.waitForFunction(() => { const rules = document.querySelector('[name="rules"]'); return rules.scrollHeight <= rules.clientHeight + 1; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "configuration must fit viewport");
      const fields = await page.locator('.mo-token-fields input').evaluateAll((elements) => elements.map((element) => {
        const r = element.getBoundingClientRect(), parent = element.parentElement.getBoundingClientRect();
        return { top: r.top, inside: r.left >= parent.left && r.right <= parent.right + 1 };
      }));
      assert.equal(fields.length, 5);
      assert.ok(fields.every((field) => field.inside), "all five controls must remain inside their own grid cells");
      if (width >= 1280) assert.ok(Math.max(...fields.map((field) => field.top)) - Math.min(...fields.map((field) => field.top)) < 2, "all five fields must occupy one desktop row");
      assert.equal(await page.locator('[name="rules"]').evaluate((element) => element.scrollHeight <= element.clientHeight + 1), true, "generated rules must be fully readable without an inner scrollbar");
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
    assert.deepEqual(actions, ["configure", "configure", "preview", "confirm", "receipt"]);
    assert.equal(await page.locator('[name="provider"]').isDisabled(), true);
    await page.evaluate(() => document.dispatchEvent(new CustomEvent("operations:logout")));
    assert.equal(await page.locator("[data-token-records]").textContent(), "");
  } finally { await browser.close(); }
});
