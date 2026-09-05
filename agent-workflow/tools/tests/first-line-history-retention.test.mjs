import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { mergeApprovedHistory } from "../backfill-first-line-viewpoints-history.mjs";

function remark(id, date) {
  const text = "AI 编程工具需要在真实工作任务中验证模型能力，并保留可核查的原始证据。";
  return { id, date, url: `https://example.test/${id}`, name: "示例分享者", topic: "AI 编程",
    text, translation: text, translationStatus: "translated", translationMethod: "source_chinese",
    columnTags: [{ id: "opinion-ai-coding", group: "opinion" }] };
}

test("daily history preserves approved past records with no Git history or translation cache", () => {
  const old = remark("old", "2026-07-17");
  assert.deepEqual(mergeApprovedHistory([], [old]), [old]);
  const yesterday = remark("yesterday", "2026-09-02");
  const today = remark("today", "2026-09-04");
  assert.deepEqual(mergeApprovedHistory([today], mergeApprovedHistory([yesterday], [old])), [today, yesterday, old]);
});

test("history deduplicates by URL and unapproved replacements cannot destroy approved translations", () => {
  const old = remark("same", "2026-09-02");
  const invalid = { ...old, translation: "", translationStatus: "pending_translation" };
  assert.deepEqual(mergeApprovedHistory([invalid], [old]), [old]);
  const newer = { ...old, likes: 42 };
  assert.deepEqual(mergeApprovedHistory([newer], [old]), [newer]);
  assert.deepEqual(mergeApprovedHistory([], [invalid]), []);
});

test("daily publication archives accepted morning history before gating and stages the archive", () => {
  const workflow = fs.readFileSync(".github/workflows/daily-first-line-viewpoints-pr.yml", "utf8");
  assert.ok(workflow.indexOf("backfill-first-line-viewpoints-history.mjs --translate=false")
    < workflow.indexOf("- name: Run first-line viewpoints data gate"));
  assert.match(workflow, /stage_if_exists "01-SiteV2\/site\/data\/first-line-viewpoints-history\.json"/u);
  assert.match(workflow, /stage_if_exists "01-SiteV2\/site\/data\/data-center-v4"/u);
  assert.ok(workflow.indexOf("sync-light-data-lake.mjs --v4-only=true --duckdb=skip")
    < workflow.indexOf("node agent-workflow/tools/refresh-data-center-viewpoints-adapter.mjs"));
  const adapter = fs.readFileSync("agent-workflow/tools/refresh-data-center-viewpoints-adapter.mjs", "utf8");
  assert.match(adapter, /writeFrontstageData\(root\)/u);
});

test("recovered September viewpoint remains in history and the person's dated profile", () => {
  const history = JSON.parse(fs.readFileSync("01-SiteV2/site/data/first-line-viewpoints-history.json", "utf8"));
  const entity = JSON.parse(fs.readFileSync(
    "01-SiteV2/site/data/data-center-v4/entities/EN-3c67e51edcaf55f3.json", "utf8")).entity;
  assert.ok(history.remarks.some((item) => item.id === "2095174463696589223"));
  assert.ok(entity.viewpointIds.includes("2095174463696589223"));
  assert.ok(entity.lastSeen >= "2026-09-02");
  assert.match(entity.role, /[\u3400-\u9fff]/u);
});
