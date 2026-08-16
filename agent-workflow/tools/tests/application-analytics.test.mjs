import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const page = read("01-SiteV2/site/application-analytics.html");
const script = read("01-SiteV2/site/assets/application-analytics.js");
const style = read("01-SiteV2/site/assets/application-analytics.css");

test("application center exposes the internal operations analytics dashboard", () => {
  assert.match(page, /<h1>应用运营<\/h1>/);
  assert.match(page, /data-days="7"/);
  assert.match(page, /data-platform/);
  assert.match(page, /data-kpis/);
  assert.match(page, /data-trend-chart/);
  assert.match(page, /data-funnel/);
  assert.match(page, /meta name="robots" content="noindex,nofollow"/);
  for (const file of ["data-center.html", "trend-radar.html", "opportunity-map.html", "application-analytics.html"]) {
    assert.match(read(`01-SiteV2/site/${file}`), /href="application-analytics\.html"[^>]*>运营统计<\/a>/);
  }
});

test("dashboard keeps admin credentials session-only and renders required decision metrics", () => {
  assert.match(script, /sessionStorage\.getItem\(TOKEN_KEY\)/);
  assert.match(script, /Authorization: `Bearer \$\{state\.token\}`/);
  assert.match(script, /newRegistrations/);
  assert.match(script, /netRevenueCents/);
  assert.match(script, /registrationRate/);
  assert.match(script, /averageSessionSeconds/);
  assert.doesNotMatch(script, /localStorage/);
  assert.doesNotMatch(script, /ANALYTICS_ADMIN_TOKEN\s*=/);
});

test("analytics page follows the approved typography table and responsive baseline", () => {
  assert.match(style, /font:\s*600 44px\/58px var\(--aa-serif\)/);
  assert.match(style, /font:\s*600 28px\/36px var\(--aa-mono\)/);
  assert.match(style, /@media \(max-width: 640px\)/);
  assert.match(style, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(style, /font-size:\s*\d+vw/);
  assert.doesNotMatch(style, /font-weight:\s*(7[1-9]\d|[89]\d\d)/);
});

test("client analytics projections do not collect direct identity fields", () => {
  const mini = read("02-Miniprogram/miniprogram/utils/analytics.js");
  for (const source of [mini]) {
    assert.doesNotMatch(source, /phone(Number)?\s*:/i);
    assert.doesNotMatch(source, /openId\s*:/i);
    assert.doesNotMatch(source, /unionId\s*:/i);
    assert.doesNotMatch(source, /remote_addr|X-Forwarded-For/);
  }
});
