import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";
import { OPS_VERSION } from "../lib/collection-telemetry-v1.mjs";

test("sidebar aligns and folds; member save closes only on success", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const member = { id: 88, name: "测试成员", city: "上海", company: "示例公司", role: "产品", contact: "", status: "approved", cohort: 2, communityState: "joined", joinedOn: "2026-09-04", points: 42, miniProgram: { accountOpened: true, userId: 7 } };
    const payload = { schemaVersion: "COMMUNITY-MEMBER-ADMIN-V1.0", member, members: [member], cohorts: [2], stateCounts: { joined: 1 }, page: { number: 1, total: 1, totalPages: 1 } };
    let rejectSave = true;
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => {
      const request = route.request();
      if (request.url().startsWith("https://ops-test.local/?")) return route.abort();
      if (request.url() === "https://ops-test.local/") {
        let html = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<link\b[^>]*>/g, "");
        html = html.replace("</head>", "<style>" + fs.readFileSync("01-SiteV2/site/assets/member-operations.css", "utf8") + "</style></head>");
        return route.fulfill({ contentType: "text/html", body: html });
      }
      if (request.url().includes("/community-directory")) {
        if (request.method() === "POST") {
          assert.ok(request.headers()["x-csrf-token"]);
          if (rejectSave) return route.fulfill({ status: 400, json: { error: { message: "测试保存失败" } } });
        }
        return route.fulfill({ json: payload });
      }
      return route.fulfill({ status: 200, json: {} });
    });
    await page.goto("https://ops-test.local/#membership-community");
    await page.addScriptTag({ content: fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8") });
    await page.addScriptTag({ content: fs.readFileSync("01-SiteV2/site/assets/operations-console.js", "utf8") });
    await page.evaluate(() => {
      document.querySelector("[data-ops-console]").hidden = false;
      document.dispatchEvent(new CustomEvent("operations:authenticated", { detail: { csrfToken: "synthetic-csrf-for-browser-test" } }));
    });
    assert.equal(await page.locator(".brand small").innerText(), OPS_VERSION.replace("OPS-V", "OPS V").split("-")[0]);
    const parent = page.locator('[data-membership-nav] > button');
    const children = page.locator('#membership-subnav');
    const child = children.locator('button').first();
    assert.equal((await parent.boundingBox()).x, (await child.boundingBox()).x);
    assert.notEqual(await parent.evaluate(e => getComputedStyle(e).backgroundColor), await child.evaluate(e => getComputedStyle(e).backgroundColor));
    await parent.click();
    assert.equal(await children.isVisible(), false);
    assert.equal(await parent.getAttribute("aria-expanded"), "false");
    await parent.click();
    assert.equal(await children.isVisible(), true);
    await child.click();
    await page.locator('[data-mo-community-id="88"]').click();
    const save = page.getByRole("button", { name: "保存成员状态", exact: true });
    await save.click();
    await page.getByText("测试保存失败", { exact: true }).waitFor();
    assert.equal(await save.isVisible(), true);
    rejectSave = false;
    await save.click();
    await page.getByText(/成员状态已保存，详情已收起/).waitFor();
    assert.equal(await page.locator('[data-mo-community-detail]').innerHTML(), "");
    assert.equal(await page.locator('[data-mo-community-state] option').count(), 4);
    await page.locator('[data-mo-community-id="88"]').click();
    await save.waitFor();
    if (process.env.OPS_REVIEW_IMAGE) await page.screenshot({ path: process.env.OPS_REVIEW_IMAGE });
    await page.setViewportSize({ width: 390, height: 844 });
    await parent.click();
    assert.equal(await children.isVisible(), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
