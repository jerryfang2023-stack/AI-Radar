import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  applyIntakeTitleMetadata,
  buildSourceIntake,
  hasActiveHistoricalDuplicate,
  loadSourceIntakeEntries,
  mergeSourceIntakes,
  normalizeSourceIntakeMarketScopes,
  readSourceIntake,
  SOURCE_INTAKE_VERSION,
  sourceIntakePath,
} from "../lib/source-intake-v1.mjs";
import { selectImmutableSourceSnapshot } from "../lib/immutable-source-snapshot-v1.mjs";
import { normalizeSourceIntakeTitles } from "../normalize-source-intake-titles.mjs";
import { regenerateSourceTitleTranslations } from "../regenerate-source-title-translations-deepseek.mjs";
import { titleTranslationKey, titleTranslationLooksUsable } from "../source-title-translation-generator.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value)}\n`, "utf8");
}

test("monitor quality wrapper help exits before reading config or starting collection", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-monitor-help-"));
  try {
    const script = path.resolve("agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs");
    const output = execFileSync(process.execPath, [script, "--help"], {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.match(output, /Show this help without starting collection/u);
    assert.equal(fs.existsSync(path.join(root, "agent-workflow")), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("source title translation keys normalize spaced dash variants", () => {
  const hyphen = "Deploying and Scaling Enterprise AI Agents - Eloquent AI";
  const emDash = "Deploying and Scaling Enterprise AI Agents — Eloquent AI";
  const enDash = "Deploying and Scaling Enterprise AI Agents – Eloquent AI";
  assert.equal(titleTranslationKey(emDash), titleTranslationKey(hyphen));
  assert.equal(titleTranslationKey(enDash), titleTranslationKey(hyphen));
});

test("manually reviewed source-title translations satisfy the integrity contract", () => {
  const title = "MAI-Image-2.6 launches at No. 2 on Arena ahead of Google， Meta and xAI";
  const translation = "MAI-Image-2.6 在 Arena 排名第 2，领先 Google、Meta 和 xAI";
  assert.ok(titleTranslationLooksUsable(title, translation));
});

test("resumed source intake reuses an approved translation across dash variants", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-title-dash-"));
  const date = "2026-08-03";
  const stored = "Deploying and Scaling Enterprise AI Agents - Eloquent AI";
  const captured = "Deploying and Scaling Enterprise AI Agents — Eloquent AI";
  const translated = "部署与扩展企业级 AI 智能体 - Eloquent AI";
  try {
    writeJson(path.join(root, "01-SiteV2/content/11-databases/source-title-translations.json"), {
      version: "source-title-translations-v1",
      translations: [{
        sourceTitle: stored,
        zhTitle: translated,
        generatedBy: "deepseek_title_translation",
        generatedModel: "deepseek-v4-flash",
      }],
    });
    writeJson(path.join(root, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`), {
      raw_documents: [{ title_original: captured, title_zh: "" }],
    });
    const sourceIndex = path.join(root, "01-SiteV2/content/01-raw/source-index.jsonl");
    fs.mkdirSync(path.dirname(sourceIndex), { recursive: true });
    fs.writeFileSync(sourceIndex, `${JSON.stringify({
      data_date: date,
      title_original: captured,
      title_zh: "",
    })}\n`, "utf8");

    const result = normalizeSourceIntakeTitles(root, date);
    assert.equal(result.repaired_documents, 1);
    assert.equal(result.repaired_source_index_rows, 1);
    const repairedIntake = JSON.parse(fs.readFileSync(
      path.join(root, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`),
      "utf8",
    ));
    assert.equal(repairedIntake.raw_documents[0].title_zh, translated);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("resumed source intake restores DeepSeek Chinese source-title translations", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-title-resume-"));
  const date = "2026-08-01";
  const original = "Example removes its AI feature one day after launch";
  const translated = "Example 在上线一天后撤下其 AI 功能";
  try {
    writeJson(path.join(root, "01-SiteV2/content/11-databases/source-title-translations.json"), {
      version: "source-title-translations-v1",
      translations: [{
        sourceTitle: original,
        zhTitle: translated,
        generatedBy: "deepseek_title_translation",
        generatedModel: "deepseek-v4-flash",
      }],
    });
    writeJson(path.join(root, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`), {
      raw_documents: [{ title_original: original, title_zh: "" }],
    });
    const sourceIndex = path.join(root, "01-SiteV2/content/01-raw/source-index.jsonl");
    fs.mkdirSync(path.dirname(sourceIndex), { recursive: true });
    fs.writeFileSync(sourceIndex, `${JSON.stringify({
      data_date: date,
      title_original: original,
      title_zh: "",
    })}\n`, "utf8");

    assert.deepEqual(normalizeSourceIntakeTitles(root, date), {
      date,
      repaired_documents: 1,
      repaired_source_index_rows: 1,
      intake_file: `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`,
    });
    const repairedIntake = JSON.parse(fs.readFileSync(
      path.join(root, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`),
      "utf8",
    ));
    assert.equal(repairedIntake.raw_documents[0].title_zh, translated);
    assert.equal(repairedIntake.raw_documents[0].title_translation_status, "translated");
    assert.equal(repairedIntake.raw_documents[0].title_translation_method, "source_title_translation_db");
    const row = JSON.parse(fs.readFileSync(sourceIndex, "utf8").trim());
    assert.equal(row.title_zh, translated);
    assert.equal(row.title_translation_method, "source_title_translation_db");

    fs.writeFileSync(sourceIndex, `${JSON.stringify({
      data_date: date,
      title_original: original,
      title_zh: translated,
      title_translation_status: "needs_ingestion_translation",
      title_translation_method: "title_translation_generator_failed",
    })}\n`, "utf8");
    assert.deepEqual(normalizeSourceIntakeTitles(root, date), {
      date,
      repaired_documents: 0,
      repaired_source_index_rows: 1,
      intake_file: `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`,
    });
    const provenanceRepairedRow = JSON.parse(fs.readFileSync(sourceIndex, "utf8").trim());
    assert.equal(provenanceRepairedRow.title_translation_status, "translated");
    assert.equal(provenanceRepairedRow.title_translation_method, "source_title_translation_db");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("manual source-title entries are atomically regenerated with DeepSeek provenance", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-title-regenerate-"));
  const file = path.join(root, "source-title-translations.json");
  const sourceTitle = "Example launches a new AI platform for enterprise teams";
  try {
    writeJson(file, {
      version: "source-title-translations-v1",
      translations: [{
        sourceTitle,
        zhTitle: "Example 为企业团队推出新 AI 平台",
        generatedBy: "manual_reviewed_source_title_translation",
      }],
    });
    const result = await regenerateSourceTitleTranslations({
      file,
      write: true,
      generator: async () => ({
        titleZh: "Example 为企业团队推出全新 AI 平台",
        status: "translated",
        method: "deepseek_title_translation",
        model: "deepseek-v4-flash",
      }),
    });
    assert.deepEqual(result, { eligible: 1, regenerated: 1, written: true });
    const entry = JSON.parse(fs.readFileSync(file, "utf8")).translations[0];
    assert.equal(entry.generatedBy, "deepseek_title_translation");
    assert.equal(entry.generatedModel, "deepseek-v4-flash");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("SOURCE-INTAKE-V1 preserves stable source identity and immutable body references", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-intake-"));
  const date = "2026-07-29";
  const jsonPath = path.join(root, "01-SiteV2/content/01-raw/originals/2026-07-29/source.json");
  const markdownPath = jsonPath.replace(/\.json$/u, ".md");
  const record = {
    original_url: "https://example.test/release",
    canonical_url: "https://example.test/release",
    source_name: "Example",
    title: "Example AI release",
    clean_text: "Example released a dated AI product for enterprise users with source-bounded facts.",
    content_hash: "content-hash-1",
    published_at: "2026-07-28T12:00:00.000Z",
    collected_at: "2026-07-29T01:00:00.000Z",
    source_registry_id: "cn-example-official",
    source_region: "CN",
    market_region: "CN",
    china_market_match: true,
    china_market_match_basis: "china_entity:Example",
    pool_routes: ["core_pool"],
    key_excerpts: [{
      type: "product_update",
      text: "Example released a dated AI product.",
      supports: ["signal_card_candidate", "trend_candidate_context"],
      importance: "high",
      confidence: "high",
    }],
  };
  writeJson(jsonPath, record);
  fs.writeFileSync(markdownPath, record.clean_text, "utf8");

  const intake = buildSourceIntake({
    root,
    date,
    generatedAt: "2026-07-29T02:00:00.000Z",
    entries: [
      { record, jsonPath, markdownPath, pooled: true },
      { record, jsonPath, markdownPath, pooled: true },
    ],
  });
  assert.equal(intake.schema_version, SOURCE_INTAKE_VERSION);
  assert.equal(intake.counts.source_artifacts, 1);
  assert.equal(intake.counts.raw_documents, 1);
  assert.equal(intake.counts.eligible_documents, 1);
  assert.match(intake.source_artifacts[0].source_artifact_id, /^SA-[a-f0-9]{16}$/u);
  assert.match(intake.raw_documents[0].raw_id, /^RAW-[a-f0-9]{16}$/u);
  assert.equal(intake.raw_documents[0].source_artifact_id, intake.source_artifacts[0].source_artifact_id);
  assert.equal(intake.raw_documents[0].body_ref, path.relative(root, jsonPath).replace(/\\/gu, "/"));
  assert.equal(intake.raw_documents[0].intake_diagnostics.eligible_for_v4_extraction, true);
  assert.deepEqual(intake.raw_documents[0].market_scope, {
    source_registry_id: "cn-example-official",
    source_region: "CN",
    market_region: "CN",
    china_market_match: true,
    china_market_match_basis: "china_entity:Example",
  });
  assert.deepEqual(intake.raw_documents[0].intake_diagnostics.key_excerpts, [{
    type: "product_update",
    text: "Example released a dated AI product.",
    confidence: "high",
  }]);
  assert.equal("pool_routes" in intake.raw_documents[0].intake_diagnostics, false);
  intake.raw_documents[0].title_original = "Example AI release";
  intake.raw_documents[0].title_zh = "Example AI 产品发布";

  writeJson(sourceIntakePath(root, date), intake);
  assert.equal(readSourceIntake(root, date).payload.data_date, date);
  const loaded = loadSourceIntakeEntries(root, date);
  assert.equal(loaded.entries.length, 1);
  assert.equal(loaded.entries[0].raw.original_url, record.original_url);
  assert.equal(loaded.entries[0].raw.source_url, intake.raw_documents[0].source_url);
  assert.equal(loaded.entries[0].raw.canonical_url, intake.raw_documents[0].canonical_url);
  assert.equal(loaded.entries[0].raw.content_hash, intake.raw_documents[0].content_hash);
  assert.equal(loaded.entries[0].raw.title, intake.raw_documents[0].title_original);
  assert.equal(loaded.entries[0].raw.title_zh, intake.raw_documents[0].title_zh);
  assert.equal(loaded.entries[0].raw.published_at, record.published_at);
  assert.equal(loaded.entries[0].intake_document.body_ref, intake.raw_documents[0].body_ref);
});

test("SOURCE-INTAKE-V1 rejects body references outside the repository", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-intake-root-"));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-source-intake-outside-"));
  const date = "2026-07-29";
  writeJson(path.join(outside, "source.json"), { original_url: "https://example.test" });
  writeJson(sourceIntakePath(root, date), {
    schema_version: SOURCE_INTAKE_VERSION,
    data_date: date,
    source_artifacts: [],
    raw_documents: [{ raw_id: "RAW-1", body_ref: path.join(outside, "source.json") }],
  });
  assert.throws(() => loadSourceIntakeEntries(root, date), /does not resolve inside the repository/u);
});

test("SOURCE-INTAKE-V1 clears query-only CN scope from unmatched restored documents", () => {
  const normalized = normalizeSourceIntakeMarketScopes({
    raw_documents: [
      {
        raw_id: "RAW-unmatched",
        market_scope: {
          source_registry_id: "",
          source_region: "",
          market_region: "CN",
          china_market_match: false,
          china_market_match_basis: "",
        },
      },
      {
        raw_id: "RAW-matched",
        market_scope: {
          source_registry_id: "cn-example",
          source_region: "CN",
          market_region: "CN",
          china_market_match: true,
          china_market_match_basis: "china_entity:Example",
        },
      },
    ],
  });

  assert.equal(normalized.changed, 1);
  assert.equal(normalized.payload.raw_documents[0].market_scope.market_region, "");
  assert.equal(normalized.payload.raw_documents[1].market_scope.market_region, "CN");
});

test("historical duplicate gate ignores provider hits already merged before Raw selection", () => {
  assert.equal(hasActiveHistoricalDuplicate({
    duplicate_status: "merged_provider_duplicates",
    duplicate_of: "merged 3 duplicate provider hit(s) before Raw selection",
  }), false);
  assert.equal(hasActiveHistoricalDuplicate({
    duplicate_status: "duplicate",
    duplicate_of: "01-SiteV2/content/01-raw/originals/2026-07-29/source.json",
  }), true);
});

test("structured source intakes merge supplemental market sources without changing identity", () => {
  const base = {
    schema_version: SOURCE_INTAKE_VERSION,
    data_date: "2026-07-31",
    generated_at: "2026-07-31T01:00:00.000Z",
    source_artifacts: [{ source_artifact_id: "SA-global" }],
    raw_documents: [{
      raw_id: "RAW-global",
      source_artifact_id: "SA-global",
      intake_diagnostics: { eligible_for_v4_extraction: true },
    }],
  };
  const supplemental = {
    schema_version: SOURCE_INTAKE_VERSION,
    data_date: "2026-07-31",
    generated_at: "2026-07-31T02:00:00.000Z",
    source_artifacts: [{ source_artifact_id: "SA-cn" }],
    raw_documents: [{
      raw_id: "RAW-cn",
      source_artifact_id: "SA-cn",
      intake_diagnostics: { eligible_for_v4_extraction: false },
    }],
  };

  const merged = mergeSourceIntakes(base, supplemental);
  assert.deepEqual(merged.counts, {
    source_artifacts: 2,
    raw_documents: 2,
    eligible_documents: 1,
  });
  assert.equal(merged.generated_at, supplemental.generated_at);
});

test("source snapshots are reused immutably and content changes get a stable versioned path", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-immutable-source-"));
  const baseName = "r-001-example";
  const first = { canonical_url: "https://example.test/release", content_hash: "hash-1" };
  const firstSelection = selectImmutableSourceSnapshot({ directory, baseName, record: first });
  assert.equal(firstSelection.reused, false);
  writeJson(firstSelection.jsonPath, first);

  const repeated = selectImmutableSourceSnapshot({ directory, baseName, record: first });
  assert.equal(repeated.reused, true);
  assert.equal(repeated.jsonPath, firstSelection.jsonPath);

  const changed = { canonical_url: first.canonical_url, content_hash: "hash-2" };
  const changedSelection = selectImmutableSourceSnapshot({ directory, baseName, record: changed });
  assert.equal(changedSelection.reused, false);
  assert.match(path.basename(changedSelection.jsonPath), /^r-001-example-[a-f0-9]{16}\.json$/u);
  writeJson(changedSelection.jsonPath, changed);

  const changedRepeated = selectImmutableSourceSnapshot({ directory, baseName, record: changed });
  assert.equal(changedRepeated.reused, true);
  assert.equal(changedRepeated.jsonPath, changedSelection.jsonPath);
});

test("AI Funding Tracker insights are enabled in the daily RSS collection lane", () => {
  const projectRoot = process.cwd();
  const registry = JSON.parse(fs.readFileSync(
    path.join(projectRoot, "01-SiteV2/content/11-databases/source-registry-v2.json"),
    "utf8",
  ));
  const source = registry.sources.find((item) => item.source_id === "ai-funding-tracker-insights");
  assert.ok(source, "AI Funding Tracker source must be registered");
  assert.equal(source.endpoint_or_url, "https://aifundingtracker.com/feed/");
  assert.equal(source.interface_type, "rss");
  assert.equal(source.source_type, "funding");
  assert.equal(source.enabled_default, true);

  const workflow = fs.readFileSync(
    path.join(projectRoot, ".github/workflows/daily-persistent-assets-pr.yml"),
    "utf8",
  );
  assert.match(workflow, /\(aihot keyword gdelt rss funding\)/u);
  assert.match(
    workflow,
    /run-guanlan-daily-monitor-with-qc\.mjs[\s\S]*--merge-existing-intake=true/u,
    "same-day reruns must preserve previously accepted intake while current gates re-evaluate it",
  );
});

test("all discovery channels persist original-source fetch status for routed-pool gating", () => {
  const projectRoot = process.cwd();
  const monitor = fs.readFileSync(
    path.join(projectRoot, "agent-workflow/tools/run-guanlan-daily-monitor.mjs"),
    "utf8",
  );
  assert.match(
    monitor,
    /origin_fetch_status:\s*originFetchStatus\(item\.snapshot\)/u,
    "RSS and keyword captures with readable source text must be eligible for routed-pool gating",
  );
  assert.doesNotMatch(
    monitor,
    /origin_fetch_status:\s*item\.acquisition_channel\s*===\s*["']aihot["']/u,
    "original-source fetch status must not be limited to AIHot discoveries",
  );
});

test("source-title backfill hydrates private evidence without mutating accepted public intake", () => {
  const projectRoot = process.cwd();
  const backfill = fs.readFileSync(
    path.join(projectRoot, "agent-workflow/tools/backfill-source-title-translations.mjs"),
    "utf8",
  );
  assert.match(backfill, /const capturedPayload = privateEvidence\?\.raw \|\| payload/u);
  assert.doesNotMatch(backfill, /document\.title_original = repair\.sourceTitle/u);
  assert.doesNotMatch(backfill, /row\.title_original = repair\.sourceTitle/u);

  const acceptedDocument = {
    title_original: "Wonderful Raises $550 Million Series C to Scale the AI Operating ...",
    title_zh: "Wonderful 融资",
    source_url: "https://wonderful.ai/example",
    canonical_url: "https://wonderful.ai/example",
    content_hash: "abc123",
  };
  const acceptedBefore = structuredClone(acceptedDocument);
  const hydrated = applyIntakeTitleMetadata({
    title: "Wonderful Raises $550 Million Series C to Scale the AI Operating System for the Enterprise",
    title_zh: "Wonderful 完成 5.5 亿美元 C 轮融资，加速扩展企业 AI 操作系统",
    clean_text: "source body",
  }, acceptedDocument);

  assert.equal(hydrated.title, "Wonderful Raises $550 Million Series C to Scale the AI Operating System for the Enterprise");
  assert.equal(hydrated.title_zh, "Wonderful 完成 5.5 亿美元 C 轮融资，加速扩展企业 AI 操作系统");
  assert.deepEqual(acceptedDocument, acceptedBefore);
});

test("source-title backfill updates private metadata while public intake and index stay byte-identical", () => {
  const projectRoot = process.cwd();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-title-backfill-public-"));
  const privateRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-title-backfill-private-"));
  const date = "2026-09-04";
  const hash = "aa6b2aca03901a9f";
  const truncated = "Wonderful Raises $550 Million Series C to Scale the AI Operating ...";
  const complete = "Wonderful Raises $550 Million Series C to Scale the AI Operating System for the Enterprise";
  const translated = "Wonderful 完成 5.5 亿美元 C 轮融资，以扩展企业级 AI 操作系统";
  const snapshotRef = `01-SiteV2/content/01-raw/originals/${date}/r-001.json`;
  const recordRef = `records/${date}/r-001.json`;
  const objectRef = `objects/${hash.slice(0, 2)}/${hash}.txt`;
  try {
    writeJson(path.join(tempRoot, ".evidence-backup.json"), { backupRoot: privateRoot });
    writeJson(path.join(privateRoot, "manifest.json"), { schemaVersion: "PRIVATE-EVIDENCE-STORE-V2.0" });
    writeJson(path.join(privateRoot, recordRef), {
      title: truncated,
      original_url: "https://wonderful.ai/news",
      canonical_url: "https://wonderful.ai/news",
      content_hash: hash,
    });
    fs.mkdirSync(path.dirname(path.join(privateRoot, objectRef)), { recursive: true });
    fs.writeFileSync(path.join(privateRoot, objectRef), `${complete}\nBody evidence.`, "utf8");
    fs.writeFileSync(path.join(privateRoot, "catalog.jsonl"), `${JSON.stringify({
      snapshot_ref: snapshotRef,
      content_hash: hash,
      evidence_ref: `evidence://${hash}`,
      object_ref: objectRef,
      record_ref: recordRef,
      source_url: "https://wonderful.ai/news",
      data_date: date,
    })}\n`, "utf8");

    const dateRoot = path.join(tempRoot, `01-SiteV2/content/11-databases/data-center-v4/${date}`);
    writeJson(path.join(dateRoot, "raw-documents.json"), [{
      raw_id: "RAW-1",
      source_artifact_id: "SA-1",
      title_original: truncated,
      body_ref: `evidence://${hash}`,
    }]);
    writeJson(path.join(dateRoot, "source-artifacts.json"), [{
      source_artifact_id: "SA-1",
      snapshot_refs: [snapshotRef],
    }]);
    writeJson(path.join(dateRoot, "canonical-events.json"), []);
    writeJson(path.join(tempRoot, "01-SiteV2/content/11-databases/source-title-translations.json"), {
      version: "source-title-translations-v1",
      translations: [{
        sourceTitle: complete,
        zhTitle: translated,
        generatedBy: "deepseek_title_translation",
        generatedModel: "deepseek-v4-flash",
      }],
    });
    const intakeFile = path.join(tempRoot, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`);
    writeJson(intakeFile, { raw_documents: [{ raw_id: "RAW-1", title_original: truncated }] });
    const indexFile = path.join(tempRoot, "01-SiteV2/content/01-raw/source-index.jsonl");
    fs.mkdirSync(path.dirname(indexFile), { recursive: true });
    fs.writeFileSync(indexFile, `${JSON.stringify({ data_date: date, content_hash: hash, title_original: truncated })}\n`, "utf8");
    const intakeBefore = fs.readFileSync(intakeFile);
    const indexBefore = fs.readFileSync(indexFile);

    execFileSync(process.execPath, [
      path.join(projectRoot, "agent-workflow/tools/backfill-source-title-translations.mjs"),
      `--date=${date}`,
      "--write=true",
    ], {
      cwd: tempRoot,
      // CI has a production evidence path in its job environment. A child
      // process must only read/write this test's private fixture store.
      env: { ...process.env, GUANLAN_EVIDENCE_BACKUP_ROOT: privateRoot },
      encoding: "utf8",
      timeout: 10_000,
    });

    assert.deepEqual(fs.readFileSync(intakeFile), intakeBefore);
    assert.deepEqual(fs.readFileSync(indexFile), indexBefore);
    const repairedPrivate = JSON.parse(fs.readFileSync(path.join(privateRoot, recordRef), "utf8"));
    assert.equal(repairedPrivate.title, complete);
    assert.equal(repairedPrivate.title_zh, translated);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    fs.rmSync(privateRoot, { recursive: true, force: true });
  }
});
