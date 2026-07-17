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
const cases = [
  ["data-center.html?view=events", "data-center.html?view=events"],
  ["data-center.html?view=community", "data-center.html?view=community"],
  ["data-center.html?view=viewpoints", "data-center.html?view=viewpoints"],
  ["data-center.html?view=index", "data-center.html?view=index"],
  ["intelligence-map.html", "intelligence-map.html"],
  ["weekly-ai-business-change-radar.html", "weekly-ai-business-change-radar.html"],
  ["monthly-business-structure-2026-06.html", "monthly-business-structure-2026-06.html"],
  ["v3-data-observation.html?date=2026-07-17#detail", "data-center.html"],
  ["follow-builders.html", "data-center.html"],
  ["community-intelligence.html", "data-center.html"],
  ["reports.html", "intelligence-map.html"],
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
        const metrics = await page.evaluate(() => ({
          title: document.title,
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelector("h1")?.textContent?.trim() || "",
          v4Sidebar: Boolean(document.querySelector(".dc-sidebar")),
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
          && errors.length === 0;
        results.push({ viewport: viewport.name, route, finalUrl: page.url(), status: response?.status(), ...metrics, errors, ok });

        if (viewport.name === "desktop" && [
          "intelligence-map.html",
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
