import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
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

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value)}\n`, "utf8");
}

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
  assert.equal(loaded.entries[0].raw.title, intake.raw_documents[0].title_original);
  assert.equal(loaded.entries[0].raw.title_zh, intake.raw_documents[0].title_zh);
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
  assert.match(workflow, /\(aihot keyword gdelt rss\)/u);
});
