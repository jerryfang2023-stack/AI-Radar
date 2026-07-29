import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("V4.3 schema contains no V3 compatibility interface", () => {
  const schema = JSON.parse(read("agent-workflow/product/data-center-v4.schema.json"));
  assert.ok(!(schema.required || []).includes("compatibility_cards"));
  assert.equal("compatibility_cards" in schema.properties, false);
  assert.equal("compatibilityCard" in schema.$defs, false);
});

test("retired V3 assets and archive payloads are absent", () => {
  for (const relative of [
    "01-SiteV2/knowledge/01-Signal-Cards",
    "01-SiteV2/site/data/v3-data-observation-desk.json",
    "01-SiteV2/site/data/intelligence-graph-index.json",
    "01-SiteV2/site/data/site-content.json",
    "01-SiteV2/site/data/site-content.js",
    "archive/v3-compat/signal-cards",
    "archive/v3-compat/frontstage/v3-data-observation-desk.json",
    "archive/v3-compat/frontstage/intelligence-graph-index.json",
    "archive/v3-compat/frontstage/site-content.json",
    "archive/v3-compat/frontstage/site-content.js",
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), false, relative);
  }
});

test("daily workflows cannot invoke V3 producers", () => {
  const text = [
    read(".github/workflows/daily-persistent-assets-pr.yml"),
    read(".github/workflows/daily-production-chain-dry-run.yml"),
  ].join("\n");
  for (const forbidden of [
    "generate-asset-cards-from-pool.mjs",
    "assert-pool-to-card-generation.mjs",
    "assert-business-signals-editorial.mjs",
    "build-v3-data-observation-desk.mjs",
    "assert-business-signals-frontstage.mjs",
  ]) {
    assert.doesNotMatch(text, new RegExp(forbidden.replaceAll(".", "\\."), "u"));
  }
  assert.match(text, /data-center-v4\/intake-v1/u);
  assert.match(text, /compatibilityRetired=true/u);
});

test("historical weekly HTML remains outside the V4.3 version rewrite", () => {
  const historical = fs.readdirSync(path.join(root, "01-SiteV2/site"))
    .filter((name) => /^weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}\.html$/u.test(name));
  assert.ok(historical.length > 0);
  for (const name of historical) {
    assert.doesNotMatch(read(`01-SiteV2/site/${name}`), /SITE-V4\.3\.0-compatibility-retired/u);
  }
});

test("V4 production no longer depends on active legacy mappings or a public V3 pipeline page", () => {
  for (const file of [
    "agent-workflow/tools/build-data-center-v4.mjs",
    "agent-workflow/tools/assert-source-title-integrity.mjs",
    "agent-workflow/tools/backfill-source-title-translations.mjs",
  ]) {
    const text = read(file);
    assert.doesNotMatch(text, /legacy-card-event-mappings\.json|readJson\(path\.join\(dir, "legacy-asset-mappings\.json"\)\)/u, file);
  }
  const pipeline = read("01-SiteV2/site/pipeline-dashboard.html");
  assert.match(pipeline, /url=operations-console\.html/u);
  assert.doesNotMatch(pipeline, /Signal Cards|Raw\s*(?:→|->)\s*Pool/u);
});

test("Pages deployment watches V4 gate, schema, and version-only changes", () => {
  const workflow = read(".github/workflows/github-pages.yml");
  for (const trigger of [
    "agent-workflow/tools/**",
    "agent-workflow/product/**",
    "context/version-ledger.md",
    "package.json",
  ]) assert.ok(workflow.includes(`"${trigger}"`), trigger);
  assert.doesNotMatch(workflow, /v3-data-observation-desk|intelligence-graph-index|site-content\.json/u);
});
