import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("entity catalog judgment routes use the Pro model unless explicitly overridden", () => {
  for (const relativePath of [
    "agent-workflow/tools/audit-entity-catalog-with-deepseek.mjs",
    "agent-workflow/tools/research-entity-catalog-secondary-sources.mjs",
  ]) {
    const text = source(relativePath);
    assert.match(text, /process\.env\.DEEPSEEK_PRO_MODEL/u);
    assert.match(text, /deepSeekModels\(\)\.pro/u);
    assert.doesNotMatch(text, /process\.env\.DEEPSEEK_MODEL/u);
  }
  const auditSource = source("agent-workflow/tools/audit-entity-catalog-with-deepseek.mjs");
  assert.match(auditSource, /settlementQueue = settlementQueue\.then\(\(\) => onSettled/u);
});

test("source-title integrity only requires Chinese output when translation is needed", () => {
  const text = source("agent-workflow/tools/assert-source-title-integrity.mjs");
  assert.match(
    text,
    /if \(sourceTitleNeedsChineseTranslation\(original\) && !translationLooksUsable\)/u,
  );
  assert.doesNotMatch(text, /if \(!chinese \|\|/u);
  assert.match(text, /item\.data_date === mapping\.card_date/u);
  assert.match(text, /titleKey\(item\.title_zh\) === titleKey\(cardTitle\)/u);
  assert.match(text, /titleKey\(item\.title_original \|\| item\.title\) === titleKey\(cardSourceTitle\)/u);
});

test("entity review finalization does not retain stale Entire claim ids", () => {
  const text = source("agent-workflow/tools/finalize-current-entity-catalog-review.mjs");
  assert.doesNotMatch(text, /CL-f449cdd84412379e|CL-b967f75e7c42d240/u);
  assert.match(text, /entireLaunchClaimRefs/u);
  assert.match(text, /EN-8da473e7fc7e1edf/u);
  assert.match(text, /EN-d9b1d7819af92e77/u);
  assert.match(text, /EN-6ef7552b4631e789/u);
  assert.match(text, /EN-16fe95bd48dbf178/u);
});
