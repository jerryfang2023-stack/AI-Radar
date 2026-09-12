import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  communityCollectionProblems,
} from "../../../01-SiteV2/site/scripts/collect-community-intelligence.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("community collector accepts a complete candidate before publication", () => {
  const payload = {
    meta: { errors: [] },
    items: Array.from({ length: 12 }, (_, index) => ({ id: index })),
    links: Array.from({ length: 3 }, (_, index) => ({ href: `https://example.com/${index}` })),
  };

  assert.deepEqual(communityCollectionProblems(payload), []);
});

test("community collector rejects incomplete or errored candidates before publication", () => {
  const payload = {
    meta: { errors: [{ source: "aipoju", message: "timeout" }] },
    items: [],
    links: [],
  };

  assert.deepEqual(communityCollectionProblems(payload), [
    "1 blocking collector error(s)",
    "0/12 required items",
    "0/3 required links",
  ]);
});

test("community collector validates the candidate before replacing published files", () => {
  const source = fs.readFileSync(
    path.join(root, "01-SiteV2/site/scripts/collect-community-intelligence.mjs"),
    "utf8",
  );
  const validation = source.indexOf("const problems = communityCollectionProblems(payload");
  assert.ok(validation >= 0);
  assert.ok(source.indexOf("await writeSnapshotFiles(payload)", validation) > validation);
  assert.ok(source.indexOf("await writeFile(outputPath", validation) > validation);
});

test("SCYS normalization never replaces a missing original link with its homepage", async () => {
  const {normalizeCard,mergeItems}=await import('../../../01-SiteV2/site/scripts/collect-community-intelligence.mjs');
  const card={title:'用 AI 自动化进行客户资料交付实战案例',author:'测试作者',excerpt:'客户资料交付流程',links:[]};
  const missing=normalizeCard('scys',card,{keyword:'AI',mode:'search'});
  assert.equal(missing.url,'');
  const url='https://scys.com/articleDetail/xq_topic/123';
  const known={...missing,url};
  assert.equal(mergeItems([known,missing])[0].url,url);
});
