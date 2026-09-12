import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const root = process.cwd();
const site = path.join(root, "01-SiteV2/site");
const payload = JSON.parse(await fs.readFile(path.join(site, "data/community-intelligence.json"), "utf8"));
const server = http.createServer(async (req, res) => {
  const file = path.resolve(site, `.${decodeURIComponent(new URL(req.url, "http://localhost").pathname)}`);
  if (!file.startsWith(site + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const type = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(file)] || "application/octet-stream";
    res.setHeader("Content-Type", `${type}; charset=utf-8`);
    res.end(await fs.readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/data-center.html?view=community`, { waitUntil: "networkidle" });
  const item = payload.items.find((entry) => entry.acquisition === "scys-mcp" && entry.links.length && entry.relatedResources.length)
    || payload.items.find((entry) => entry.acquisition === "scys-mcp" && entry.links.length);
  assert.ok(item, "live fixture includes an MCP document resource");
  await page.locator('input[name="q"]').fill(item.title);
  await page.locator('[data-community-filter-form] button[type="submit"]').click();
  await page.locator(`[data-community-open="${item.id}"]`).click();
  const dialog = page.locator("[data-community-dialog]");
  assert.equal(await dialog.isVisible(), true);
  for (const link of item.links) {
    assert.ok((await dialog.locator("a").evaluateAll((anchors) => anchors.map((a) => a.href))).includes(link.href));
  }
  if (item.relatedResources.length) assert.ok((await dialog.innerText()).includes("同主题案例、工具与手册"));
  assert.deepEqual(errors, []);
  await dialog.getByRole("heading", { name: "原始入口与资料链接" }).scrollIntoViewIfNeeded();
  const screenshot = path.join(process.env.LOCALAPPDATA, "WaveSight/runtime/scys-community-desktop.png");
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await dialog.getByRole("heading", { name: "原始入口与资料链接" }).scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  const mobileScreenshot = path.join(process.env.LOCALAPPDATA, "WaveSight/runtime/scys-community-mobile.png");
  await page.screenshot({ path: mobileScreenshot, fullPage: true });
  console.log(JSON.stringify({ ok: true, itemId: item.id, links: item.links.length, related: item.relatedResources.length, screenshots: [screenshot, mobileScreenshot] }));
} finally { await browser.close(); await new Promise((resolve) => server.close(resolve)); }
