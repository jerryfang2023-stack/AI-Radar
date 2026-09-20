import test from "node:test";
import assert from "node:assert/strict";
import { BUILDER_FEEDS, fetchBuilderFeed, prepareBuilderIntake } from "../prepare-follow-builders-intake.mjs";

test("afternoon intake fetches only three feeds and preserves source dates and failures", async () => {
  const calls = [];
  const data = await prepareBuilderIntake({ load: async url => {
    calls.push(url);
    if (url === BUILDER_FEEDS.x) throw new Error("request timed out");
    const key = url === BUILDER_FEEDS.blogs ? "blogs" : "podcasts";
    return { generatedAt: "2026-09-18T00:00:00Z", [key]: [{ url: "https://example.com/post", title: "Original", publishedAt: "2026-09-17" }] };
  }});
  assert.deepEqual(calls.sort(), Object.values(BUILDER_FEEDS).sort());
  assert.equal(data.status, "partial");
  assert.deepEqual(data.errors, ["x: request timed out"]);
  assert.equal(data.blogs[0].publishedAt, "2026-09-17");
  assert.equal(data.sources.find(item => item.kind === "blogs").generatedAt, "2026-09-18T00:00:00Z");
});

test("empty and malformed feeds fail closed instead of replacing good intake", async () => {
  await assert.rejects(prepareBuilderIntake({ load: async () => ({}) }), /intake empty/u);
  await assert.rejects(prepareBuilderIntake({ load: async () => ({ x: [], blogs: [], podcasts: [] }) }), /intake empty/u);
});

test("feed request and body read share a deadline; HTTP and JSON errors are not hidden", async () => {
  let signal;
  const result = await fetchBuilderFeed(BUILDER_FEEDS.blogs, { fetchImpl: async (_url, options) => {
    signal = options.signal;
    return { ok: true, text: async () => '{"blogs":[]}' };
  }});
  assert.ok(signal instanceof AbortSignal);
  assert.deepEqual(result, { blogs: [] });
  await assert.rejects(fetchBuilderFeed(BUILDER_FEEDS.blogs, { fetchImpl: async () => ({ ok: false, status: 403 }) }), /HTTP 403/u);
  await assert.rejects(fetchBuilderFeed(BUILDER_FEEDS.blogs, { fetchImpl: async () => ({ ok: true, text: async () => "invalid" }) }), SyntaxError);
});

test("Windows transport fallback is bounded and retains the exact feed URL", { skip: process.platform !== "win32" }, async () => {
  const result = await fetchBuilderFeed(BUILDER_FEEDS.x, {
    fetchImpl: async () => { throw new Error("network timeout"); },
    curl: async (command, args, options) => {
      assert.equal(command, "curl.exe");
      assert.equal(args.at(-1), BUILDER_FEEDS.x);
      assert.ok(args.includes("--max-time"));
      assert.equal(options.timeout, 30000);
      assert.equal(options.windowsHide, true);
      return { stdout: '{"x":[]}' };
    },
  });
  assert.deepEqual(result, { x: [] });
});
