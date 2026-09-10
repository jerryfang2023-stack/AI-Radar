import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { randomUUID } from "node:crypto";

const script = fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8").split("// Token management uses")[1];
function harness() {
  const elements = new Map(), docEvents = {}, parentEvents = {}, calls = [];
  const el = (name) => {
    if (!elements.has(name)) elements.set(name, { value: "season-2", innerHTML: "", textContent: "", events: {}, addEventListener(name, fn) { this.events[name] = fn; }, setAttribute() {}, removeAttribute() {} });
    return elements.get(name);
  };
  const root = el("root"); root.querySelector = el;
  vm.runInNewContext("// Token management uses" + script, {
    document: { querySelector: (name) => name === "[data-mo-token]" ? root : { addEventListener: (name, fn) => { parentEvents[name] = fn; } }, addEventListener: (name, fn) => { docEvents[name] = fn; } },
    window: { confirm: () => true }, crypto: { randomUUID },
    fetch: (url, options) => new Promise((resolve) => calls.push({ url, options, resolve })),
  });
  const click = (selector) => root.events.click({ target: { closest: (query) => query === selector ? {} : null } });
  return { el, docEvents, parentEvents, calls, click };
}
const config = { id: "season-2", label: "第二季", start: "2026-09-14", end: "", enabled: false, revision: 1, eligibleTypes: [], provider: "<script>bad</script>", unit: "Token", amount: 0, rules: "" };
const payload = { seasons: [config], batches: [], activityTypes: [], audits: [] };
const respond = async (request, result, status = 200) => { request.resolve({ ok: status === 200, status, json: async () => result }); await new Promise(setImmediate); };

test("Token operations is lazy, authenticated, escaped, CSRF protected and clears on logout", async () => {
  const h = harness();
  h.parentEvents["membership:open"]({ detail: { view: "membership-token" } });
  assert.equal(h.calls.length, 0);
  h.docEvents["operations:authenticated"]({ detail: { csrfToken: "test-token-1234567890123456" } });
  assert.equal(h.calls[0].options.credentials, "same-origin");
  await respond(h.calls[0], payload);
  assert.match(h.el("[data-token-content]").innerHTML, /&lt;script&gt;/);
  assert.doesNotMatch(h.el("[data-token-content]").innerHTML, /<script>/);
  h.click("[data-token-calculate]");
  assert.match(h.calls[1].url, /season-2\/preview$/);
  assert.ok(h.calls[1].options.headers["X-CSRF-Token"]);
  const body = JSON.parse(h.calls[1].options.body);
  assert.ok(body.operationId);
  h.docEvents["operations:logout"]();
  await respond(h.calls[1], { config, allocations: [], remaining: 0, previewHash: "stale" });
  assert.equal(h.el("[data-token-preview]").innerHTML, "");
  assert.equal(h.el("[data-token-content]").innerHTML, "");
});
