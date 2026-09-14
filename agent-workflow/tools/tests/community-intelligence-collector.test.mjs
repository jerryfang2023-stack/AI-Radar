import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  communityCollectionProblems,
  communityCollectionFailure,
} from "../../../01-SiteV2/site/scripts/collect-community-intelligence.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("community rejection preserves source, stage and login marker for recovery", () => {
  const error = communityCollectionFailure({
    meta: { errors: [{ source: "aipoju", mode: "home", message: "COMMUNITY_LOGIN_REQUIRED: AI破局 login expired" }] },
  }, ["1 blocking collector error(s)"]);
  assert.match(error.message, /COMMUNITY_COLLECTION_REJECTED/);
  assert.match(error.message, /aipoju\/home: COMMUNITY_LOGIN_REQUIRED/);
  assert.match(communityCollectionFailure({ meta: { errors: [{ source: "scys", mode: "home", message: "navigation timeout" }] } }, ["failed"]).message, /scys\/home: navigation timeout/);
});

test("all shared production writers retain multiple pending lanes", () => {
  for (const file of ["daily-persistent-assets-pr.yml", "daily-first-line-viewpoints-pr.yml", "china-funding-pr.yml", "china-funding-history-pr.yml"]) {
    const workflow = fs.readFileSync(path.join(root, ".github/workflows", file), "utf8");
    assert.match(workflow, /group: wavesight-data-center-publication\s+cancel-in-progress: false\s+queue: max/u, file);
  }
});

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
  assert.equal(normalizeCard('scys',{...card,url:'https://scys.com/'},{keyword:'AI',mode:'search'}).url,'');
  const url='https://scys.com/articleDetail/xq_topic/123';
  const known={...missing,url};
  assert.equal(mergeItems([known,missing])[0].url,url);
});
