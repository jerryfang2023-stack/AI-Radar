#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const siteDir = path.join(root, "01-SiteV2/site");
const port = Number(process.env.WAVESIGHT_SMOKE_PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;
const screenshotDir = path.join(os.tmpdir(), "wavesight-v4-smoke");
const entityIndex = JSON.parse(fs.readFileSync(path.join(siteDir, "data/data-center-v4/indexes/entities.json"), "utf8"));
const smokeEntity = entityIndex.companies?.[0] || entityIndex.products?.[0] || entityIndex.people?.[0];
const smokeFounder = entityIndex.people?.find((person) => person.fundingInsightIds?.length);
const smokeTaxonomy = entityIndex.taxonomyNodes?.[0];
const cases = [
  ["index.html", "funding-insights.html"],
  ["data-center.html?view=events", "data-center.html?view=events"],
  ["data-center.html?view=events&theme=fde", "data-center.html?view=events"],
  ["data-center.html?view=events&theme=hardware", "data-center.html?view=events"],
  ["data-center.html?view=events&theme=fde", "data-center.html?view=events&theme=fde"],
  ["data-center.html?view=hardware", "data-center.html?view=hardware"],
  ["data-center.html?view=community", "data-center.html?view=community"],
  ["data-center.html?view=viewpoints", "data-center.html?view=viewpoints"],
  ["data-center.html?view=index", "data-center.html?view=index"],
  ["data-center.html?view=relations", "data-center.html?view=relations"],
  [`data-center.html?view=index&detail=entity&id=${encodeURIComponent(smokeEntity.id)}`, "data-center.html?view=index"],
  [`data-center.html?view=index&detail=entity&id=${encodeURIComponent(smokeFounder.id)}`, "data-center.html?view=index"],
  [`data-center.html?view=index&detail=taxonomy&id=${encodeURIComponent(smokeTaxonomy.id)}`, "data-center.html?view=index"],
  ["intelligence-map.html", "intelligence-map.html"],
  ["funding-insights.html", "funding-insights.html"],
  ["opportunity-map.html", "opportunity-map.html"],
  ["trend-radar.html", "trend-radar.html"],
  ["weekly-ai-business-change-radar.html", "weekly-ai-business-change-radar.html"],
  ["monthly-business-structure-2026-06.html", "monthly-business-structure-2026-06.html"],
  ["v3-data-observation.html?date=2026-07-17#detail", "data-center.html"],
  ["follow-builders.html", "data-center.html"],
  ["community-intelligence.html", "data-center.html"],
  ["reports.html", "intelligence-map.html"],
  ["pipeline-dashboard.html?from=legacy#status", "operations-console.html"],
];

function contentType(file) {
  return ({
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
  })[path.extname(file).toLocaleLowerCase()] || "application/octet-stream";
}

function createStaticServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url || "/", baseUrl).pathname);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const file = path.resolve(siteDir, `.${requested}`);
    if (!file.startsWith(`${path.resolve(siteDir)}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": contentType(file), "cache-control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const server = createStaticServer();
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, "127.0.0.1", resolve);
    });
    browser = await chromium.launch({ headless: true });
    const results = [];
    for (const viewport of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "laptop", width: 1280, height: 900 },
      { name: "mobile", width: 390, height: 844 },
    ]) {
      const context = await browser.newContext({ viewport });
      for (const [route, expected] of cases) {
        const page = await context.newPage();
        const errors = [];
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });
        page.on("pageerror", (error) => errors.push(error.message));
        const response = await page.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(250);
        let fundingDialog = null;
        let fundingMarketCategoryFilter = null;
        let founderProfile = null;
        if (route === "funding-insights.html") {
          const marketCategorySelect = page.locator('select[name="market_category"]');
          const marketCategoryOptions = await marketCategorySelect.locator("option").evaluateAll((options) => options
            .map((option) => ({ value: option.value, label: option.textContent?.trim() || "" }))
            .filter((option) => option.value));
          if (marketCategoryOptions.length) {
            const selected = marketCategoryOptions[0];
            await marketCategorySelect.selectOption(selected.value);
            const visibleCategories = await page.locator(".fi-card-meta span:first-child").allTextContents();
            fundingMarketCategoryFilter = visibleCategories.length > 0
              && visibleCategories.every((label) => label.trim().startsWith(`${selected.label} ·`));
            await marketCategorySelect.selectOption("");
          } else {
            fundingMarketCategoryFilter = false;
          }
          const firstCard = page.locator("[data-open-id]").first();
          if (await firstCard.count()) {
            await firstCard.click();
            await page.waitForFunction(() => document.querySelector("[data-dialog]")?.open === true);
            const text = await page.locator("[data-dialog-content]").innerText();
            fundingDialog = [
              "创始团队",
              "投资逻辑",
              "机构公开理由",
              "产品",
              "目标客户",
              "客户案例",
              "关键数据",
              "竞争坐标",
              "融资历史",
              "来源证据",
            ].every((token) => text.includes(token))
              && !["尚待验证问题", "产品与买方", "客户与关键数据"].some((token) => text.includes(token));
            if (viewport.name === "desktop" || viewport.name === "mobile") {
              await page.screenshot({
                path: path.join(screenshotDir, `funding-insights-detail-${viewport.name}.png`),
                fullPage: false,
              });
              await page.locator(".fi-investment-section").scrollIntoViewIfNeeded();
              await page.screenshot({
                path: path.join(screenshotDir, `funding-insights-detail-body-${viewport.name}.png`),
                fullPage: false,
              });
              await page.locator("[data-dialog]").evaluate((element) => {
                element.scrollTop = 0;
              });
            }
            await page.locator("[data-dialog-close]").click();
          } else {
            fundingDialog = false;
          }
        }
        if (route.includes(`id=${encodeURIComponent(smokeFounder.id)}`)) {
          const text = await page.locator("main").innerText();
          founderProfile = ["创始关联", "融资档案", "创始人证据"].every((token) => text.includes(token))
            && await page.locator('a[href^="funding-insights.html?id="]').count() > 0
            && await page.locator('a[target="_blank"][rel*="noopener"]').count() > 0;
        }
        const metrics = await page.evaluate(() => ({
          title: document.title,
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelector("h1")?.textContent?.trim() || "",
          v4Sidebar: Boolean(document.querySelector(".dc-sidebar")),
          reportFeatureAlignment: (() => {
            if (window.innerWidth <= 1000) return null;
            const cards = [...document.querySelectorAll(".report-feature-card")];
            if (cards.length !== 2) return null;
            const cardBottoms = cards.map((card) => card.getBoundingClientRect().bottom);
            const linkBottoms = cards.map((card) => card.querySelector(".report-link")?.getBoundingClientRect().bottom || 0);
            return {
              cardBottomDelta: Math.abs(cardBottoms[0] - cardBottoms[1]),
              linkBottomDelta: Math.abs(linkBottoms[0] - linkBottoms[1]),
            };
          })(),
          reportSectionHeadAlignment: (() => {
            const heads = [...document.querySelectorAll(".report-section-head")];
            if (!heads.length) return null;
            const rows = heads.map((head) => {
              const title = head.querySelector("h2")?.getBoundingClientRect();
              const note = head.querySelector("p, span")?.getBoundingClientRect();
              return {
                titleTop: Math.round(title?.top || 0),
                titleRight: Math.round(title?.right || 0),
                noteTop: Math.round(note?.top || 0),
                noteLeft: Math.round(note?.left || 0),
                ok: Boolean(title && note)
                  && note.top >= title.top - 1
                  && note.top < title.bottom
                  && note.left >= title.right,
              };
            });
            return { count: rows.length, rows, ok: rows.length === 2 && rows.every((row) => row.ok) };
          })(),
          eventMobileFilters: (() => {
            if (window.innerWidth > 780 || document.body.dataset.dcView !== "events") return null;
            const button = document.querySelector(".dc-toolbar > .dc-button");
            const theme = document.querySelector('.dc-toolbar > .dc-select[name="theme"]');
            const type = document.querySelector('.dc-toolbar > .dc-select[name="type"]');
            const tag = document.querySelector('.dc-toolbar > .dc-select[name="tag"]');
            const more = document.querySelector(".dc-toolbar > .dc-more");
            const widths = Object.fromEntries(Object.entries({ button, theme, type, tag, more })
              .map(([key, element]) => [key, Math.round(element?.getBoundingClientRect().width || 0)]));
            return {
              ...widths,
              buttonWhiteSpace: button ? getComputedStyle(button).whiteSpace : "",
              ok: widths.button >= 104
                && widths.theme >= 200
                && widths.type >= 330
                && widths.tag >= 330
                && widths.more >= 104
                && getComputedStyle(button).whiteSpace === "nowrap",
            };
          })(),
          overflowers: [...document.querySelectorAll("body *")]
            .map((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return {
                tag: element.tagName.toLocaleLowerCase(),
                className: String(element.className || ""),
                width: Math.round(rect.width),
                right: Math.round(rect.right),
                minWidth: style.minWidth,
                whiteSpace: style.whiteSpace,
              };
            })
            .filter((item) => item.right > document.documentElement.clientWidth + 1)
            .sort((a, b) => b.right - a.right)
            .slice(0, 8),
          scrollers: [document.documentElement, document.body, ...document.querySelectorAll("body *")]
            .map((element) => ({
              tag: element.tagName.toLocaleLowerCase(),
              className: String(element.className || ""),
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
              overflowX: getComputedStyle(element).overflowX,
            }))
            .filter((item) => item.scrollWidth > item.clientWidth + 1)
            .sort((a, b) => (b.scrollWidth - b.clientWidth) - (a.scrollWidth - a.clientWidth))
            .slice(0, 10),
        }));
        const ok = response?.ok() !== false
          && page.url().includes(expected)
          && metrics.scrollWidth <= metrics.width + 1
          && (!metrics.reportFeatureAlignment || (metrics.reportFeatureAlignment.cardBottomDelta <= 1 && metrics.reportFeatureAlignment.linkBottomDelta <= 1))
          && metrics.reportSectionHeadAlignment?.ok !== false
          && metrics.eventMobileFilters?.ok !== false
          && fundingDialog !== false
          && fundingMarketCategoryFilter !== false
          && founderProfile !== false
          && errors.length === 0;
        results.push({
          viewport: viewport.name,
          route,
          finalUrl: page.url(),
          status: response?.status(),
          ...metrics,
          fundingDialog,
          fundingMarketCategoryFilter,
          founderProfile,
          errors,
          ok,
        });

        if (viewport.name === "desktop" && [
          "index.html",
          "intelligence-map.html",
          "funding-insights.html",
          "opportunity-map.html",
          "trend-radar.html",
          "weekly-ai-business-change-radar.html",
          "monthly-business-structure-2026-06.html",
        ].includes(route)) {
          await page.screenshot({
            path: path.join(screenshotDir, `${route.replace(/[^a-z0-9]+/giu, "-")}.png`),
            fullPage: false,
          });
        }
        if (viewport.name === "mobile" && route === "weekly-ai-business-change-radar.html") {
          await page.locator("[data-nav-toggle]").click();
          await page.waitForFunction(() => {
            const sidebar = document.querySelector("[data-sidebar]");
            return sidebar?.dataset.open === "true"
              && getComputedStyle(sidebar).transform === "matrix(1, 0, 0, 1, 0, 0)";
          });
          await page.screenshot({ path: path.join(screenshotDir, "weekly-mobile-nav.png"), fullPage: false });
        }
        if (viewport.name === "mobile" && route === "funding-insights.html") {
          await page.screenshot({ path: path.join(screenshotDir, "funding-insights-mobile.png"), fullPage: false });
        }
        if (viewport.name === "mobile" && route === "data-center.html?view=events") {
          await page.screenshot({ path: path.join(screenshotDir, "event-library-mobile.png"), fullPage: false });
        }
        const mobileAuditScreenshots = new Map([
          ["data-center.html?view=community", "community-intelligence-mobile.png"],
          ["data-center.html?view=viewpoints", "first-line-viewpoints-mobile.png"],
          ["data-center.html?view=index", "entity-library-mobile.png"],
          ["trend-radar.html", "trend-radar-mobile.png"],
          ["intelligence-map.html", "guanlan-research-mobile.png"],
        ]);
        if (viewport.name === "mobile" && mobileAuditScreenshots.has(route)) {
          await page.screenshot({
            path: path.join(screenshotDir, mobileAuditScreenshots.get(route)),
            fullPage: false,
          });
        }
        await page.close();
      }
      await context.close();
    }

    const result = { ok: results.every((item) => item.ok), results, screenshots: screenshotDir };
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
