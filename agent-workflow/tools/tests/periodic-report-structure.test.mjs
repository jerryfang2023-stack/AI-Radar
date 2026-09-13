import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { REPORT_SECTIONS, parseNumberedReportSections, reportStructureProblems, visibleReportText } from "../lib/periodic-report-structure.mjs";
import { evidenceManifest } from "../generate-periodic-report-deepseek.mjs";

test("reader-visible length excludes metadata, citations and link URLs", () => {
  const text = "---\ntitle: 内部标题\n---\nSignals: 200 | Opinions: 10 | Community: 30\n## 1. 判断\n客户使用[来源](https://example.com/very-long-url) [E:EV-1234567890]";
  assert.equal(visibleReportText(text), "1.判断客户使用来源");
  const sections = REPORT_SECTIONS.monthly.map((title, index) => ({ number: index + 1, title, content: "短稿" + "[E:EV-1234567890123456789]".repeat(500) }));
  assert.ok(reportStructureProblems("monthly", sections).includes("monthly_visible_body_below_6000"));
});

test("new weekly structure accepts five sections and rejects restored removed modules", () => {
  const sections = REPORT_SECTIONS.weekly.map((title, index) => ({ number: index + 1, title, content: "有具体证据的分析。" }));
  assert.deepEqual(reportStructureProblems("weekly", sections), []);
  const markdown = sections.map(s => `## ${s.number}. ${s.title}\n\n${s.content}`).join("\n\n");
  assert.deepEqual(parseNumberedReportSections(markdown), sections);
  assert.ok(reportStructureProblems("weekly", [...sections, { number: 6, title: "观察清单", content: "观察事项" }]).includes("weekly_removed_module_present"));
});

test("long monthly conclusion does not hide an incomplete analysis section", () => {
  const sections = REPORT_SECTIONS.monthly.map((title, index) => ({ number: index + 1, title, content: "分析".repeat(1200) }));
  assert.deepEqual(reportStructureProblems("monthly", sections), []);
  sections[1].content = "只有一条摘要。";
  assert.ok(reportStructureProblems("monthly", sections).includes("monthly_section_2_underdeveloped"));
});

test("manifest retains late-month evidence, deduplicates events and preserves planned status and accepted quotes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "report-evidence-test-"));
  try {
    for (const date of ["2026-08-01", "2026-08-31"]) {
      const dir = path.join(root, "01-SiteV2/content/11-databases/data-center-v4", date);
      fs.mkdirSync(dir, { recursive: true });
      const rows = Array.from({ length: 181 }, (_, i) => ({ event_id: `EV-${i}`, publication_status: "verified", event_status: "planned", display_title_zh: "计划部署", claim_refs: ["CL-a", "CL-b"] }));
      if (date.endsWith("31")) rows.push({ event_id: "EV-month-end", publication_status: "partial", event_status: "planned", display_title_zh: "月底计划", claim_refs: ["CL-a"] });
      rows.push({ event_id: "EV-rejected", publication_status: "rejected" });
      fs.writeFileSync(path.join(dir, "canonical-events.json"), JSON.stringify(rows));
      fs.writeFileSync(path.join(dir, "claims.json"), JSON.stringify([{ claim_id: "CL-a", verification_status: "accepted", source_quote: "Plans to deploy." }, { claim_id: "CL-b", verification_status: "rejected", source_quote: "Unsupported result." }]));
    }
    const manifest = evidenceManifest(root, "2026-08-01", "2026-08-31");
    assert.equal(manifest.counts.Signals, 182);
    assert.equal(manifest.events.at(-1).id, "EV-month-end");
    assert.equal(manifest.events.at(-1).status, "planned");
    assert.deepEqual(manifest.events[0].facts, [{ id: "CL-a", quote: "Plans to deploy." }]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
