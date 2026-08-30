import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const page = read("01-SiteV2/site/operations-console.html");
const script = read("01-SiteV2/site/assets/application-analytics.js");
const style = read("01-SiteV2/site/assets/application-analytics.css");

test("OPS owns analytics and the old entry redirects without a duplicate dashboard", () => {
  assert.match(page, /<h1>应用运营<\/h1>/);
  assert.match(page, /data-days="7"/);
  assert.match(page, /data-platform/);
  assert.match(page, /data-kpis/);
  assert.match(page, /data-trend-chart/);
  assert.match(page, /data-funnel/);
  assert.match(page, /meta name="robots" content="noindex,nofollow"/);
  assert.match(page, /data-tab="analytics"/);
  assert.match(page, /data-panel="analytics" data-application-analytics/);
  assert.match(page, /assets\/application-analytics\.js\?v=20260830-ops-readonly/);
  assert.doesNotMatch(page, /data-auth|type="password"|data-exit/);
  const redirect = read("01-SiteV2/site/application-analytics.html");
  assert.match(redirect, /http-equiv="refresh" content="0;url=operations-console\.html#analytics"/);
  assert.doesNotMatch(redirect, /dc-sidebar|data-kpis/);
  for (const file of ["data-center.html", "trend-radar.html", "opportunity-map.html"]) {
    assert.doesNotMatch(read(`01-SiteV2/site/${file}`), /application-analytics\.html|运营统计/);
  }
});

test("dashboard uses passwordless aggregate reads and renders required metrics", () => {
  assert.match(script, /api\/v1\/analytics\/summary/);
  assert.match(script, /credentials: "omit"/);
  assert.match(script, /newRegistrations/);
  assert.match(script, /netRevenueCents/);
  assert.match(script, /registrationRate/);
  assert.match(script, /averageSessionSeconds/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|Authorization|TOKEN_KEY|admin\/analytics/);
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

function dashboardHarness({ active = true } = {}) {
  const elements = new Map();
  const element = (key) => {
    if (!elements.has(key)) {
      const classes = new Set();
      elements.set(key, {
        hidden: false, disabled: false, textContent: "", innerHTML: "", dataset: {}, listeners: {},
        classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) },
        addEventListener(name, handler) { this.listeners[name] = handler; },
        setAttribute(name, value) { this[name] = value; },
      });
    }
    return elements.get(key);
  };
  const dashboard = element("root");
  if (active) dashboard.classList.add("is-active");
  const days = [1, 7, 30, 90].map((day) => { const button = element(`day-${day}`); button.dataset.days = String(day); return button; });
  dashboard.querySelector = element;
  dashboard.querySelectorAll = () => days;
  const requests = [];
  vm.runInNewContext(script, {
    document: { querySelector: () => dashboard },
    fetch(url, options) { return new Promise((resolve, reject) => requests.push({ url, options, resolve, reject })); },
    Intl, AbortController, setTimeout, clearTimeout,
  });
  return { element, dashboard, days, requests };
}

const production = (visitors = 12) => ({
  dataSource: "production", trackingSince: "2026-08-17T15:12:20Z", generatedAt: "2026-08-30T00:00:00Z",
  overview: { visitors, sessions: 5, pageViews: 20, newRegistrations: 2, paidOrders: 1, netRevenueCents: 3000 },
  trend: [], funnel: [], registrationFailures: [], platforms: [], topPages: [], topContent: [],
});
const respond = async (request, data = production(), ok = true) => {
  request.resolve({ ok, json: async () => data });
  await new Promise((resolve) => setImmediate(resolve));
};

test("direct analytics entry loads without credentials and refresh/filter controls work", async () => {
  const app = dashboardHarness();
  assert.equal(app.requests.length, 1);
  assert.match(app.requests[0].url, /days=7&platform=all$/);
  assert.equal(app.requests[0].options.credentials, "omit");
  assert.equal(app.requests[0].options.headers, undefined);
  assert.equal(app.element("[data-content]").hidden, true);
  await respond(app.requests[0]);
  assert.equal(app.element("[data-content]").hidden, false);
  assert.equal(app.element("[data-skeleton]").hidden, true);
  assert.match(app.element("[data-kpis]").innerHTML, /访客数.*12/);
  assert.match(app.element("[data-top-content]").innerHTML, /当前周期暂无数据/);
  app.days[2].listeners.click();
  assert.match(app.requests[1].url, /days=30&platform=all$/);
  await respond(app.requests[1]);
  app.element("[data-platform]").listeners.change({ target: { value: "pc" } });
  assert.match(app.requests[2].url, /days=30&platform=pc$/);
  await respond(app.requests[2]);
  app.element("[data-refresh]").listeners.click();
  await respond(app.requests[3]);
  assert.equal(app.element("[data-refresh]").disabled, false);
});

test("analytics is lazy off-tab and ignores stale responses after a quick filter change", async () => {
  const app = dashboardHarness({ active: false });
  assert.equal(app.requests.length, 0);
  app.dashboard.listeners["analytics:open"]();
  app.dashboard.listeners["analytics:open"]();
  assert.equal(app.requests.length, 1);
  app.days[0].listeners.click();
  await respond(app.requests[1], production(99));
  await respond(app.requests[0], production(1));
  assert.match(app.element("[data-kpis]").innerHTML, /访客数.*99/);
  assert.equal(app.element("[data-content]").hidden, false);
});

test("failed or non-production data stays visibly unavailable and can be retried", async () => {
  const app = dashboardHarness();
  await respond(app.requests[0], { error: { message: "private server error" } }, false);
  assert.equal(app.element("[data-content]").hidden, true);
  assert.equal(app.element("[data-status]").classList.contains("is-error"), true);
  assert.match(app.element("[data-status]").textContent, /刷新重试/);
  assert.doesNotMatch(app.element("[data-status]").textContent, /private/);
  app.element("[data-refresh]").listeners.click();
  await respond(app.requests[1], { ...production(), dataSource: "demo" });
  assert.equal(app.element("[data-content]").hidden, true);
  app.element("[data-refresh]").listeners.click();
  await respond(app.requests[2], production(0));
  assert.equal(app.element("[data-content]").hidden, false);
  assert.equal(app.element("[data-status]").classList.contains("is-error"), false);
});
