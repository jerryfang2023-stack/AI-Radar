import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8");
function harness(active = true) {
  const elements = new Map();
  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { innerHTML: "", textContent: "", listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; } });
    return elements.get(selector);
  };
  const root = element("root");
  root.querySelector = element;
  root.classList = { contains: () => active };
  const requests = [];
  vm.runInNewContext(script, { document: { querySelector: () => root }, Intl, Date, AbortController, setTimeout, clearTimeout,
    fetch(url, options) { return new Promise((resolve, reject) => requests.push({ url, options, resolve, reject })); },
  });
  return { element, root, requests };
}
const metrics = { joinedMembers: 12, newJoinedMembers: 2, awaitingJoin: 0, participants: 3, speakers: 1, participations: 4, issues: 2, unresolvedParticipants: 1, expiring7d: null, renewals: null, accounts: 9, newAccounts: 1, activeEntitlements: 3, trialAccounts: 2, firstPaidAccounts: 1, repeatPaidAccounts: 0, engagedAccounts: 2, redemptions: 1, redeemingAccounts: 1, redeemedPoints: 300, offlineClaims: null };
const payload = (source, days = 30) => ({ schemaVersion: "MEMBER-OPS-V1.0", source, dataSource: "production", generatedAt: "2026-08-30T00:00:00Z", window: { days }, metrics, tiers: { monthly: 1, half_year: 0, annual: 2, other: 0 }, pointBuckets: { zero: 1, low: 2, mid: 3, high: 4 } });
const respond = async (req, data, ok = true) => { req.resolve({ ok, json: async () => data }); await new Promise(setImmediate); };

test("membership loads lazily, uses no credentials and survives partial failure", async () => {
  const h = harness(false);
  assert.equal(h.requests.length, 0);
  h.root.listeners["membership:open"]();
  assert.equal(h.requests.length, 2);
  for (const request of h.requests) { assert.equal(request.options.credentials, "omit"); assert.equal(request.options.method, "GET"); }
  await respond(h.requests[0], payload("community"));
  await respond(h.requests[1], {}, false);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /12/);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /待接入/);
  assert.match(h.element('[data-mo-content="application"]').innerHTML, /不代表人数为零/);
});

test("filters discard stale responses and refresh retries both sources", async () => {
  const h = harness();
  h.element("[data-mo-days]").listeners.change({ target: { value: "7" } });
  assert.equal(h.requests.length, 4);
  await respond(h.requests[2], payload("community", 7));
  const current = h.element('[data-mo-content="community"]').innerHTML;
  await respond(h.requests[0], { ...payload("community"), metrics: { ...metrics, joinedMembers: 999 } });
  assert.equal(h.element('[data-mo-content="community"]').innerHTML, current);
  await respond(h.requests[1], payload("application"));
  await respond(h.requests[3], payload("application", 7));
  h.element("[data-mo-refresh]").listeners.click();
  assert.equal(h.requests.length, 6);
  await respond(h.requests[4], payload("community", 7));
  await respond(h.requests[5], payload("application", 7));
});

test("invalid or non-production payloads fail closed without rendering arbitrary fields", async () => {
  const h = harness();
  await respond(h.requests[0], { ...payload("community"), metrics: { ...metrics, participants: "<script>" } });
  await respond(h.requests[1], { ...payload("application"), dataSource: "test", name: "PRIVATE" });
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /暂不可用/);
  assert.doesNotMatch(h.element('[data-mo-content="application"]').innerHTML, /PRIVATE/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|Authorization|\.metrics\s*\)|Object\.entries\(payload/);
});
