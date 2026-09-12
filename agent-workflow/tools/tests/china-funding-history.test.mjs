import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { historyWindows, collectHistory, historicalSearch } from "../collect-china-funding-history.mjs";
import { historicalFundingAuthorized } from "../build-data-center-v4.mjs";
import { deepSeekJsonCompletion } from "../deepseek-translation-client.mjs";
import { chinaFundingSourceDate } from "../lib/china-funding-source-date.mjs";

test("Chinese article bylines retain the explicit historical disclosure date", () => {
  assert.equal(chinaFundingSourceDate({ acquisition_channel: "china-funding", clean_text: "融资文章\n作者·2026年02月02日 08:00\n正文" }), "2026-02-02T08:00:00+08:00");
  assert.equal(chinaFundingSourceDate({ acquisition_channel: "china-funding", clean_text: "正文中谈到2026年02月02日市场行情" }), "");
});

test("historical windows cover the requested partial months and reject future ranges", () => {
  const windows = historyWindows("2026-01-01", "2026-09-12", "2026-09-12");
  assert.equal(windows.length, 9);
  assert.equal(windows[1].to, "2026-02-28");
  assert.equal(windows.at(-1).to, "2026-09-12");
  assert.throws(() => historyWindows("2026-02-30", "2026-09-12", "2026-09-12"));
  assert.throws(() => historyWindows("2026-01-01", "2026-09-13", "2026-09-12"));
});

test("historical discovery checkpoints all source/month queries without inventing factual dates", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cn-history-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "01-SiteV2/content/11-databases/china-funding-monitor-v1.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ results_per_query: 10, query_terms: ["人工智能 融资", "机器人 融资"], sources: [{ id: "pedaily", registry_id: "cn-pedaily", name: "投资界", domains: ["pedaily.cn"] }] }));
  let calls = 0;
  const search = async () => { calls += 1; return [{ url: "https://news.pedaily.cn/202601/123456.shtml", title: "某公司完成AI机器人天使轮融资", published_at: "2026-01-01" }]; };
  const options = { root, from: "2026-01-01", to: "2026-02-28", date: "2026-09-12", search };
  const result = await collectHistory(options);
  assert.equal(calls, 8);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].published_at, "");
  assert.equal(result.history.models.claim_extraction, "deepseek-v4-flash");
  await collectHistory(options);
  assert.equal(calls, 8, "a restart reuses every completed query");
});

test("domestic search does not inherit English international discovery filters", async () => {
  let body;
  await historicalSearch("中文融资", 10, async (_url, options) => {
    body = JSON.parse(options.body);
    return { ok: true, json: async () => ({ results: [] }) };
  }, { ANYSEARCH_API_KEY: "test-key" });
  assert.deepEqual(body, { query: "中文融资", max_results: 10 });
});

test("historical age exception is limited to explicitly authorized domestic source IDs and dates", () => {
  const raw = { acquisition_channel: "china-funding", published_at: "2026-01-08T09:00:00+08:00" };
  const artifact = { source_artifact_id: "SA-authorized" };
  const policy = { schema_version: "CHINA-FUNDING-HISTORY-AUTHORIZATION-V1.0", from: "2026-01-01", to: "2026-09-12", source_refs: ["SA-authorized"] };
  assert.equal(historicalFundingAuthorized(raw, artifact, policy), true);
  assert.equal(historicalFundingAuthorized(raw, { source_artifact_id: "SA-other" }, policy), false);
  assert.equal(historicalFundingAuthorized({ ...raw, acquisition_channel: "funding" }, artifact, policy), false);
  assert.equal(historicalFundingAuthorized({ ...raw, published_at: "2025-12-31" }, artifact, policy), false);
  assert.equal(historicalFundingAuthorized({ ...raw, published_at: "" }, artifact, policy), false);
});

test("Flash extraction retries remain on Flash and preserve actual model provenance", async (t) => {
  const prior = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = "test-key";
  t.after(() => { if (prior === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = prior; });
  const models = [];
  const result = await deepSeekJsonCompletion({ model: "deepseek-v4-flash", fallbackModel: "deepseek-v4-flash", fetchImpl: async (_url, options) => {
    models.push(JSON.parse(options.body).model);
    return { ok: true, json: async () => ({ choices: [{ message: { content: models.length === 1 ? "invalid" : '{"claims":[]}' } }] }) };
  } });
  assert.deepEqual(models, ["deepseek-v4-flash", "deepseek-v4-flash"]);
  assert.equal(result.model, "deepseek-v4-flash");
  assert.equal(result.attempts, 2);
});
