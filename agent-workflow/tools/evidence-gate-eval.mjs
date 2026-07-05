import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);
const date = args.get("date") || new Date().toISOString().slice(0, 10);

const deprecatedEvidenceIssues = [
  "evidence_quality:raw_qc_not_allow",
  "evidence_quality:missing_full_text",
  "evidence_quality:low_readability",
  "evidence_quality:weak_extraction_quality",
  "evidence_quality:incomplete_evidence_object",
  "evidence_quality:degradation_reason_blocks_core",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`[evidence-gate-eval] FAIL: ${message}`);
    process.exitCode = 1;
  }
}

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) return "";
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next > start ? next : source.length);
}

const generator = read("agent-workflow/tools/generate-asset-cards-from-pool.mjs");
const cardability = extractFunction(generator, "cardabilitySemanticIssues");
assert(cardability.includes("evidenceStrengthBlocksCard"), "cardability gate must use unified evidence strength");
for (const issue of deprecatedEvidenceIssues) {
  assert(!cardability.includes(issue.split(":").at(-1)), `deprecated blocker remains in cardabilitySemanticIssues: ${issue}`);
}

const qualityGate = read("agent-workflow/tools/guanlan-monitor-quality-gate.mjs");
const deprecatedQualityGateTerms = [
  "legacyRawCoverageLogKey",
  "legacyPoolCoverageLogKey",
  "legacyRawCoverageGateKey",
  "legacyPoolCoverageGateKey",
  "core_missing_full_text",
  "core_low_readability",
  "core_readability_score_min",
  "coreMissingFullText",
  "coreLowReadability",
];
assert(qualityGate.includes("coreEvidenceStrengthDistribution"), "quality gate must report evidence_strength distribution");
for (const term of deprecatedQualityGateTerms) {
  assert(!qualityGate.includes(term), `deprecated quality-gate judgment remains: ${term}`);
}

const poolPath = path.join("01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
if (fs.existsSync(path.join(root, poolPath))) {
  const pool = read(poolPath);
  const tierCounts = [...pool.matchAll(/^- evidence_strength: ([a-z_]+)/gmu)]
    .reduce((acc, match) => {
      acc[match[1]] = (acc[match[1]] || 0) + 1;
      return acc;
    }, {});
  assert(Object.values(tierCounts).reduce((sum, count) => sum + count, 0) > 0, `${poolPath} must include evidence_strength rows`);
  console.log(`[evidence-gate-eval] pool evidence_strength: ${JSON.stringify(tierCounts)}`);
} else {
  assert(false, `${poolPath} is missing; rerun daily monitor before eval`);
}

const manifestPath = path.join("agent-workflow", "reports", `${date}-frontstage-manifest.json`);
if (fs.existsSync(path.join(root, manifestPath))) {
  const manifestText = read(manifestPath);
  for (const issue of deprecatedEvidenceIssues) {
    assert(!manifestText.includes(issue), `manifest contains deprecated evidence issue: ${issue}`);
  }
  const manifest = JSON.parse(manifestText);
  const manifestSignalCount = manifest.signal_asset_count ?? manifest.signalAssetCount ?? manifest.signal_card_assets?.length ?? "unknown";
  console.log(`[evidence-gate-eval] manifest signal assets: ${manifestSignalCount}`);
} else {
  assert(false, `${manifestPath} is missing; rerun card generation before eval`);
}

const cardDirs = [
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"),
  path.join(root, "01-SiteV2", "content", "04-business-signals", "cards"),
];
const cardFiles = cardDirs.flatMap((cardsDir) => (
  fs.existsSync(cardsDir)
    ? fs.readdirSync(cardsDir, { recursive: true })
      .filter((file) => String(file).endsWith(".md") && String(file).includes(date))
      .map((file) => path.join(cardsDir, file))
    : []
));
assert(cardFiles.length > 0, `no ${date} Signal Card files found`);
let missingEvidenceStrength = 0;
let corporateCapexFundingCards = 0;
let publisherNamedFundingCards = 0;
for (const file of cardFiles) {
  const body = fs.readFileSync(file, "utf8");
  if (!/\n  evidence_strength: (?:blocked|traceable_summary|source_backed_event|rich_evidence)\n/u.test(body)) {
    missingEvidenceStrength += 1;
  }
  if (/signal_type:\s*funding/iu.test(body) && /blog\.google\/innovation-and-ai\/infrastructure-and-cloud\/global-network\/[^"\s]*investment/iu.test(body)) {
    corporateCapexFundingCards += 1;
  }
  if (/signal_type:\s*funding/iu.test(body) && /\nsignal_owner:\s*"(?:Blog|Theaiinsider|Techcrunch|Fundraiseinsider)"\n/iu.test(body)) {
    publisherNamedFundingCards += 1;
  }
}
assert(missingEvidenceStrength === 0, `${missingEvidenceStrength} Signal Card file(s) are missing primary_raw.evidence_strength`);
assert(corporateCapexFundingCards === 0, `${corporateCapexFundingCards} corporate capex/community investment item(s) were promoted as funding Cards`);
assert(publisherNamedFundingCards === 0, `${publisherNamedFundingCards} funding Card(s) use publisher label Blog as signal_owner`);
console.log(`[evidence-gate-eval] checked Signal Cards: ${cardFiles.length}`);

if (!process.exitCode) {
  console.log("[evidence-gate-eval] PASS");
}
