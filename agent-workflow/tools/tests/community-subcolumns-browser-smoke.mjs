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
    const type = { ".svg": "image/svg+xml", ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(file)] || "application/octet-stream";
    res.setHeader("Content-Type", `${type}; charset=utf-8`);
    res.end(await fs.readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const baseUrl = process.env.COMMUNITY_TEST_BASE || 'http://127.0.0.1:' + server.address().port + '/';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(baseUrl + 'data-center.html?view=community&source=scys', {waitUntil:'networkidle'});
  assert.equal(await page.locator('.dc-community-sources [aria-current="page"]').innerText(), '生财\n创业案例 · 需求与踩坑 · 实操资料');
  assert.ok((await page.locator('.dc-community-card-meta span:first-child').allTextContents()).every(x=>x==='生财'));
  await page.getByLabel('客户行业',{exact:true}).selectOption('求职招聘');
  assert.ok((await page.locator('.dc-community-grid').innerText()).includes('简历'));
  await page.locator('[data-community-open]').first().click();
  assert.ok((await page.locator('.dc-case-fields').innerText()).includes('9.9 元指作者调研的另一款工具'));
  await page.getByLabel('关闭',{exact:true}).first().click();
  await page.locator('[data-community-view="weekly"]').click();
  assert.equal(await page.locator('.dc-weekly-card').count(),3);
  assert.ok((await page.locator('.dc-weekly-card').allTextContents()).some(x=>x.includes('已处理')));
  await page.getByLabel('数据日期',{exact:true}).selectOption('2026-09-06');
  await page.waitForFunction(()=>document.querySelector('.dc-empty')?.textContent.includes('本周尚无'));
  await page.getByLabel('数据日期',{exact:true}).selectOption('2026-09-12');
  await page.waitForFunction(()=>document.querySelectorAll('.dc-weekly-card').length===3);
  await page.locator('[data-community-view="resources"]').click();
  await page.getByLabel('资料类型',{exact:true}).selectOption('document');
  await page.locator('input[name="q"]').fill('U8exwxmrdiCgQBkP5HtcOJzEnFb');
  await page.locator('[data-community-filter-form] button[type="submit"]').click();
  const href='https://my.feishu.cn/wiki/U8exwxmrdiCgQBkP5HtcOJzEnFb';
  assert.ok((await page.locator('.dc-resource-card a').evaluateAll(a=>a.map(x=>x.href))).includes(href));
  await page.locator('[data-community-clear]').click();
  await page.getByLabel('资料类型',{exact:true}).selectOption('manual');
  assert.ok(await page.locator('.dc-resource-card details').count()>0);
  await page.locator('.dc-resource-card details summary').first().click();
  assert.ok(await page.locator('.dc-resource-card details[open] li').count()>0);
  await page.locator('[data-community-clear]').click();
  await page.locator('[data-community-page="2"]').first().click();
  assert.equal(await page.locator('.dc-pagination [aria-current="page"]').innerText(),'2');
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const out=path.join(process.env.LOCALAPPDATA,'WaveSight/runtime');
  await page.screenshot({path:path.join(out,'community-subcolumns-mobile.png'),fullPage:true});
  await page.locator('.dc-community-sources a').filter({hasText:'AI 破局'}).click();
  await page.waitForSelector('[data-community-view="tool_tip"]');
  assert.ok((await page.locator('.dc-community-card-meta span:first-child').allTextContents()).every(x=>x==='AI 破局'));
  assert.equal(await page.locator('[data-community-view="cases"]').count(),0);
  await page.locator('[data-community-view="links"]').click();
  assert.ok(await page.locator('.dc-community-card').count()>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto(baseUrl+'data-center.html?view=community&source=scys&section=weekly',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.dc-weekly-card').count(),3);
  await page.setViewportSize({width:1280,height:900});
  await page.screenshot({path:path.join(out,'community-subcolumns-desktop.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,sourceIsolation:true,caseFilters:true,weekly:true,resourceHref:href,manualDirectory:true,pagination:true,mobile:true,baseUrl}));
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
