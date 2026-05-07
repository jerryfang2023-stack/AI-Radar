import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "04-Site", "data", "signal-lab-data.json");
const jsPath = path.join(root, "04-Site", "data", "signal-lab-data.js");
const requiredContent = [
  "06-content/01-raw/2026-05-05-raw-candidates.md",
  "06-content/02-pool/2026-05-05-signal-pool.md",
  "06-content/03-structured-signals/2026-05-05-structured-signals.md",
  "06-content/04-selected-signals/2026-05-05-front-signals.md",
  "06-content/08-opportunities/deep-dive/2026-05-05-opportunity-deep-dive.md",
  "06-content/05-trend-chain/2026-05-05-trend-classification.md",
  "06-content/10-databases/trends/trend-database.md",
];

function fail(message) {
  console.error(`[signal-lab] ${message}`);
  process.exit(1);
}

for (const relative of requiredContent) {
  if (!fs.existsSync(path.join(root, relative))) fail(`missing content file: ${relative}`);
}

if (!fs.existsSync(dataPath)) fail("missing signal-lab-data.json");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const summary = data.summary || {};

if (summary.rawCount < 30 || summary.rawCount > 50) fail("rawCount must be 30-50");
if (summary.poolCount < 10 || summary.poolCount > 15) fail("poolCount must be 10-15");
if (summary.structuredCount < 5 || summary.structuredCount > 8) fail("structuredCount must be 5-8");
if (summary.frontCount !== 3 || data.frontSignals?.length !== 3) fail("front signals must be exactly 3");
if (summary.deepDiveCount > 1) fail("deep dive count must be at most 1");

for (const signal of data.frontSignals || []) {
  if (!Array.isArray(signal.secondarySearch) || signal.secondarySearch.length < 3) {
    fail(`${signal.id} must include at least 3 secondary sources`);
  }
  if (!Array.isArray(signal.sixDimensions) || signal.sixDimensions.length !== 6) {
    fail(`${signal.id} must include 6 dimensions`);
  }
}

if (!data.deepDive?.actionMap) fail("deep dive must include actionMap");
if (!Array.isArray(data.trends) || data.trends.length < 1) fail("trend classification is required");

fs.writeFileSync(jsPath, `window.SIGNAL_LAB_DATA = ${JSON.stringify(data, null, 2)};\n`, "utf8");
console.log(`[signal-lab] synced ${data.frontSignals.length} front signals to ${path.relative(root, jsPath)}`);
