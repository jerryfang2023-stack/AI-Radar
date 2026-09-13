import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { mergeApprovedHistory } from "../backfill-first-line-viewpoints-history.mjs";
import { unionPublishedRows } from "../preserve-published-checkpoint-state.mjs";

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
  const mostlyEnglish = { ...old, text: "An AI model still needs independent evaluation before production. 中",
    translation: "An AI model still needs independent evaluation before production. 中" };
  assert.deepEqual(mergeApprovedHistory([mostlyEnglish], []), []);
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
  assert.match(workflow, /refresh-data-center-viewpoints-adapter\.mjs[\s\S]+npm run translate:public-structured-fields\s+node agent-workflow\/tools\/refresh-data-center-viewpoints-adapter\.mjs\s+node --test agent-workflow\/tools\/tests\/public-zh-translation-v1\.test\.mjs/u);
  assert.match(workflow, /stage_if_exists "01-SiteV2\/content\/11-databases\/public-zh-translations-v1\.json"/u);
});

test("serialized publication lanes resolve their branch after acquiring the shared lock", () => {
  for (const file of ["daily-first-line-viewpoints-pr.yml", "daily-persistent-assets-pr.yml"]) {
    const workflow = fs.readFileSync(`.github/workflows/${file}`, "utf8");
    assert.match(workflow, /name: Check out repository\s+uses: actions\/checkout@v6\s+with:[\s\S]*?ref: \$\{\{ github\.ref \}\}\s+fetch-depth: 0/u);
  }
  const business = fs.readFileSync(".github/workflows/daily-persistent-assets-pr.yml", "utf8");
  assert.match(business, /cp -a "\$resume_dir\/artifact\/\." \.[\s\S]+merge-source-intake-v1\.mjs --date="\$\{RUN_DATE\}" --git-ref=HEAD/u);
  assert.match(business, /generate-funding-insights-deepseek\.mjs \\\s+--recover-from-git-ref=HEAD/u);
  assert.match(business, /preserve-published-checkpoint-state\.mjs --git-ref=HEAD/u);
});

test("checkpoint ledger union retains both lanes and preserves the published review on collisions", () => {
  const old = [{ id: "shared", value: "checkpoint" }, { id: "overseas", value: "accepted" }];
  const published = [{ id: "shared", value: "published" }, { id: "domestic", value: "accepted" }];
  const result = unionPublishedRows(old, published, (row) => row.id);
  assert.deepEqual(result, [published[0], old[1], published[1]]);
  assert.deepEqual(unionPublishedRows(result, published, (row) => row.id), result);
  assert.equal(old[0].value, "checkpoint");
  assert.throws(() => unionPublishedRows([{}], [], (row) => row.id), /stable identity/u);
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
