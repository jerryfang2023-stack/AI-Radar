import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { syncGuanlanEvidence } from "../lib/guanlan-evidence-projection.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, "utf8");
}

test("Guanlan evidence projection links assets to V4 evidence without copying original bodies", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-evidence-root-"));
  const vaultRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-evidence-vault-"));
  const dateRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4/2026-07-30");
  const sourceUrl = "https://example.test/product-launch";
  const privateBody = "PRIVATE ORIGINAL BODY MUST NEVER ENTER THE VAULT";
  const assetRelative = "60-知识资产/企业 AI 案例/example.md";
  const reportRelative = "30-应用中心/行业报告档案/example-report.md";

  writeJson(path.join(dateRoot, "source-artifacts.json"), [{
    source_artifact_id: "SA-example",
    source_url: sourceUrl,
    canonical_url: sourceUrl,
    publisher: "Example",
    captured_at: "2026-07-30T01:00:00.000Z",
    snapshot_refs: [
      "01-SiteV2/content/01-raw/originals/2026-07-30/example.json",
      "01-SiteV2/content/01-raw/originals/2026-07-30/example.md",
    ],
    content_hash: "hash-example",
  }]);
  writeJson(path.join(dateRoot, "raw-documents.json"), [{
    raw_id: "RAW-example",
    source_artifact_id: "SA-example",
    canonical_url: sourceUrl,
    body_ref: "01-SiteV2/content/01-raw/originals/2026-07-30/example.json",
    content_hash: "hash-example",
  }]);
  writeJson(path.join(dateRoot, "claims.json"), [{
    claim_id: "CL-example",
    raw_id: "RAW-example",
    verification_status: "accepted",
    source_quote: "Example launched the product.",
  }]);
  writeJson(path.join(dateRoot, "canonical-events.json"), [{
    event_id: "EV-example",
    entities: ["EN-example"],
    claim_refs: ["CL-example"],
    source_refs: ["SA-example"],
    publication_status: "verified",
    display_title_zh: "示例公司发布产品",
  }]);
  writeJson(path.join(dateRoot, "entities.json"), [{
    entity_id: "EN-example",
    canonical_name: "Example Company",
    entity_type: "organization",
  }]);
  writeJson(
    path.join(root, "01-SiteV2/content/01-raw/originals/2026-07-30/example.json"),
    { canonical_url: sourceUrl, content_hash: "hash-example", clean_text: privateBody },
  );
  writeText(
    path.join(root, "01-SiteV2/content/01-raw/originals/2026-07-30/example.md"),
    privateBody,
  );
  writeText(
    path.join(vaultRoot, assetRelative),
    `---\ntitle: 示例资产\nstatus: current\n---\n# 示例资产\n\n[原始来源](${sourceUrl})\n`,
  );
  writeText(
    path.join(vaultRoot, reportRelative),
    `---\ntitle: 示例报告\nstatus: published\n---\n# 示例报告\n\n证据：[来源](${sourceUrl})\n`,
  );
  writeJson(path.join(vaultRoot, ".guanlan-generated.json"), {
    generatedFiles: [assetRelative, reportRelative, ".guanlan-generated.json"],
  });

  const result = syncGuanlanEvidence({
    root,
    vaultRoot,
    generatedAt: "2026-07-30T02:00:00.000Z",
    maxCitationCards: 10,
  });

  assert.equal(result.assets.total, 2);
  assert.equal(result.assets.linked, 2);
  assert.equal(result.citationCards, 1);

  const asset = fs.readFileSync(path.join(vaultRoot, assetRelative), "utf8");
  assert.match(asset, /evidence_status: linked/u);
  assert.match(asset, /evidence_source_refs: \["SA-example"\]/u);
  assert.match(asset, /evidence_claim_refs: \["CL-example"\]/u);
  assert.match(asset, /evidence_event_refs: \["EV-example"\]/u);
  assert.match(asset, /evidence_entity_refs: \["EN-example"\]/u);
  assert.match(asset, /original_body_storage: private_evidence_store_only/u);
  assert.match(asset, /\[\[60-知识资产\/来源引用\/SA-example--/u);

  const citationDir = path.join(vaultRoot, "60-知识资产/来源引用");
  const citationFile = fs.readdirSync(citationDir).find((name) => name.startsWith("SA-example--"));
  assert.ok(citationFile);
  const citation = fs.readFileSync(path.join(citationDir, citationFile), "utf8");
  assert.match(citation, /\[\[60-知识资产\/企业 AI 案例\/example\|示例资产\]\]/u);
  assert.match(citation, /\[\[30-应用中心\/行业报告档案\/example-report\|示例报告\]\]/u);
  assert.match(citation, /CL-example/u);
  assert.match(citation, /EV-example/u);
  assert.match(citation, /EN-example/u);
  assert.doesNotMatch(citation, new RegExp(privateBody, "u"));

  const relationIndex = fs.readFileSync(
    path.join(vaultRoot, "60-知识资产/证据关系索引.md"),
    "utf8",
  );
  assert.match(relationIndex, /SA-example/u);
  assert.match(relationIndex, /CL-example/u);
  assert.match(relationIndex, /EV-example/u);
  assert.match(relationIndex, /EN-example/u);

  const manifest = JSON.parse(
    fs.readFileSync(path.join(vaultRoot, ".guanlan-generated.json"), "utf8"),
  );
  assert.ok(manifest.generatedFiles.includes(`60-知识资产/来源引用/${citationFile}`));
  assert.ok(manifest.generatedFiles.includes("60-知识资产/证据关系索引.md"));
});
