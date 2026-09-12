import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildOpportunityEvidenceData } from "../opportunity-evidence-v2.mjs";

test("opportunity uses served reviewed entity scope instead of a short-window alias", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "funding-scope-"));
  const write = (file, data) => { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(data)); };
  const base = "01-SiteV2/content/11-databases/data-center-v4/2026-09-12/";
  write(`${base}canonical-events.json`, [{ event_id: "E", event_type: "funding", publication_status: "verified", claim_refs: ["C"], source_refs: ["S"], entities: ["OLD"] }]);
  write(`${base}claims.json`, [{ claim_id: "C", subject: "Company", verification_status: "accepted", source_quote: "Company received financing.", raw_id: "R" }]);
  write(`${base}source-artifacts.json`, [{ source_artifact_id: "S", source_url: "https://example.org/funding" }]);
  write(`${base}entities.json`, [{ entity_id: "OLD", canonical_name: "Company", entity_type: "organization_candidate" }]);
  write("01-SiteV2/site/data/data-center-v4-frontstage.json", { events: [{ id: "E", classifications: [{ dimensionId: "product_form", id: "model", name: "模型", entityIds: ["REVIEWED"], provenance: "reviewed_funding_insight", reviewRef: "REC" }] }] });
  try {
    const data = buildOpportunityEvidenceData(root);
    assert.equal(data.evidence.length, 1);
    assert.deepEqual(data.evidence[0].classifications.map(item => item.entity_ids), [["REVIEWED"]]);
    assert.equal(data.evidence[0].classifications[0].assertion_ref, "REC");
  } finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith("funding-scope-"));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
