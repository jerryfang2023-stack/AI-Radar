import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync("01-SiteV2/site/assets/operations-auth.js", "utf8");
const page = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8");
const login = fs.readFileSync("01-SiteV2/site/operations-login.html", "utf8");
const nginx = fs.readFileSync("deploy/nginx/wavesight-operations-console.locations.conf", "utf8");
const pagesWorkflow = fs.readFileSync(".github/workflows/github-pages.yml", "utf8");

function harness() {
  const listeners = {};
  const documentListeners = {};
  const shell = { hidden: true, focusCalled: false, focus() { this.focusCalled = true; } };
  const logout = { addEventListener(name, fn) { listeners[name] = fn; } };
  const requests = [];
  const redirects = [];
  class TestEvent { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } }
  const document = {
    cookie: "guanlan_ops_csrf=csrf-cookie-with-enough-entropy",
    querySelector(selector) { return selector === "[data-ops-console]" ? shell : selector === "[data-ops-logout]" ? logout : null; },
    addEventListener(name, fn) { documentListeners[name] = fn; },
    dispatchEvent(event) { documentListeners[event.type]?.(event); },
  };
  vm.runInNewContext(script, {
    document, Event: TestEvent, CustomEvent: TestEvent, decodeURIComponent,
    window: { location: { replace(value) { redirects.push(value); } } },
    fetch(url, options) { return new Promise((resolve) => requests.push({ url, options, resolve })); },
  });
  return { document, shell, listeners, requests, redirects, TestEvent };
}

const respond = async (request, payload, ok = true) => { request.resolve({ ok, json: async () => payload }); await new Promise(setImmediate); };

test("console bootstraps from an HttpOnly-backed same-origin session", async () => {
  const h = harness();
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].url, "/ops/api/session");
  assert.equal(h.requests[0].options.credentials, "same-origin");
  await respond(h.requests[0], { schemaVersion: "OPS-AUTH-V1.0", authenticated: true });
  assert.equal(h.shell.hidden, false);
  assert.equal(h.shell.focusCalled, true);
  assert.deepEqual(h.redirects, []);
  h.listeners.click();
  assert.equal(h.requests[1].url, "/ops/api/logout");
  assert.equal(h.requests[1].options.headers["X-CSRF-Token"], "csrf-cookie-with-enough-entropy");
  assert.equal(h.requests[1].options.credentials, "same-origin");
});

test("console and login surfaces contain no reusable secret storage", () => {
  assert.match(page, /data-ops-console[^>]+hidden/u);
  assert.match(page, /data-ops-logout/u);
  assert.doesNotMatch(page, /data-ops-auth-email|data-mo-admin-email|type="password"/u);
  assert.match(login, /运营后台登录/u);
  assert.match(login, /\/ops\/api\/challenges/u);
  assert.match(login, /location\.replace\("\/ops\/"\)/u);
  assert.doesNotMatch(script + login, /localStorage|sessionStorage|sessionToken\s*=/u);
});

test("VPS protects OPS artifacts and Pages excludes their public copies", () => {
  assert.match(nginx, /location \^~ \/ops\/ \{[\s\S]*auth_request \/ops-auth-check/u);
  assert.match(nginx, /location = \/ops\/login\/[^]*operations-login\.html/u);
  assert.match(nginx, /\/api\/v1\/admin\/auth\/session/u);
  assert.match(nginx, /location = \/ops\/analytics-api\/summary \{[\s\S]*auth_request \/ops-auth-check/u);
  assert.match(nginx, /location = \/ops\/application-membership-summary \{[\s\S]*auth_request \/ops-auth-check/u);
  assert.match(nginx, /location = \/api\/v1\/analytics\/summary \{ return 404; \}/u);
  assert.match(nginx, /location = \/api\/v1\/analytics\/membership\/summary \{ return 404; \}/u);
  for (const artifact of ["operations-console.html", "operations-auth.js", "member-operations.js", "ops-console.json", "local-skill-store.html"]) {
    assert.match(pagesWorkflow, new RegExp(`--exclude=\\"[^\\n]*${artifact.replace(".", "\\.")}`));
  }
});
