import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonPath = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");

const forbiddenKeys = new Set([
  "eventLine",
  "keyExcerpts",
  "rawRefs",
  "poolRefs",
  "cardPath",
  "rawRef",
  "rawTitle",
  "rawArchive",
  "rawJson",
  "assetPath",
  "business_meaning",
  "why_selected",
  "watch_reason",
  "frontendWhy",
  "whyForming",
  "publicBoundary",
]);

const forbiddenTextPatterns = [
  /这条材料的价值在于/u,
  /这条变化值得看/u,
  /客户是否买单/u,
  /后续判断重点不是模型参数/u,
  /涉及流程[：:]/u,
  /涉及角色[：:]/u,
  /涉及产品\/技术[：:]/u,
  /主体包括\s*、、/u,
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function walk(value, trail = "$", issues = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${trail}[${index}]`, issues));
    return issues;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.has(key)) issues.push(`${trail}.${key} exposes retired/internal field`);
      walk(child, `${trail}.${key}`, issues);
    }
    return issues;
  }
  if (typeof value === "string") {
    for (const pattern of forbiddenTextPatterns) {
      if (pattern.test(value)) issues.push(`${trail} contains retired/generated wording: ${value.slice(0, 120)}`);
    }
  }
  return issues;
}

if (!fs.existsSync(jsonPath)) {
  console.error(JSON.stringify({ ok: false, status: "failed", reason: `missing ${rel(jsonPath)}` }, null, 2));
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
} catch (error) {
  console.error(JSON.stringify({ ok: false, status: "failed", reason: `invalid JSON: ${error.message}` }, null, 2));
  process.exit(1);
}

const issues = walk(payload);
const cards = Array.isArray(payload.cards) ? payload.cards : [];
for (const card of cards) {
  if (!card.title || !card.date || !card.sourceName) {
    issues.push(`card ${card.id || "(missing id)"} missing title/date/sourceName`);
  }
  if (!card.translatedFact && !(card.originalHighlights || []).length && !card.visibleFragment) {
    issues.push(`card ${card.id || "(missing id)"} has no source-facing fact/highlight/fragment`);
  }
}

const result = {
  ok: issues.length === 0,
  status: issues.length === 0 ? "passed" : "failed",
  checked_file: rel(jsonPath),
  card_count: cards.length,
  issue_count: issues.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
