#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const viewpointsFile = path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json");
const catalogLedgerFile = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json");
const outputFile = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json");
const write = process.argv.includes("--write=true");

const REVIEWED_AT = "2026-07-18T10:00:00.000Z";
const HUMAN_RATIONALE = "来源名称、账号标识及公开身份描述共同指向单一自然人。";

const decisions = [
  ["EN-52279415a0ac4fc4", "confirm", "Aaron Levie", "https://x.com/levie", HUMAN_RATIONALE],
  ["EN-743d4ac3b9f15131", "confirm", "Aditya Agarwal", "https://x.com/adityaag", HUMAN_RATIONALE],
  ["EN-533f53e43380451e", "confirm", "Alex Albert", "https://x.com/alexalbert__", HUMAN_RATIONALE],
  ["EN-cc1a23ffcf54716a", "confirm", "Amanda Askell", "https://x.com/AmandaAskell", HUMAN_RATIONALE],
  ["EN-fd67ab47893c5a98", "confirm", "Amjad Masad", "https://x.com/amasad", HUMAN_RATIONALE],
  ["EN-752ced3f98f1640f", "confirm", "Andrej Karpathy", "https://x.com/karpathy", HUMAN_RATIONALE],
  ["EN-d484d2e08da596c3", "quarantine", "Ben's Bites AI Newsletter", "https://www.bensbites.com/", "新闻简报是出版物账号，不是自然人。"],
  ["EN-42f537bd07ee93cb", "confirm", "Boris Cherny", "https://x.com/bcherny", HUMAN_RATIONALE],
  ["EN-e9ea0665d1a026eb", "confirm", "Cat Wu", "https://x.com/_catwu", HUMAN_RATIONALE],
  ["EN-1507c47a9a4e05f0", "quarantine", "Claude", "https://x.com/claudeai", "Claude 是 Anthropic 的产品账号，不是自然人。"],
  ["EN-1d82ae06a3fa99ce", "confirm", "Dan Shipper", "https://x.com/danshipper", HUMAN_RATIONALE],
  ["EN-71b3600726f06291", "quarantine", "Dataiku Blog", "https://www.dataiku.com/stories/blog/", "Dataiku Blog 是企业博客，不是自然人。"],
  ["EN-e3ab81e0f7bb06ad", "confirm", "Garry Tan", "https://x.com/garrytan", HUMAN_RATIONALE],
  ["EN-ef10bc996692b317", "quarantine", "Google Labs", "https://x.com/GoogleLabs", "Google Labs 是组织品牌账号，不是自然人。"],
  ["EN-f9ab81cacb3507bd", "confirm", "Guillermo Rauch", "https://x.com/rauchg", HUMAN_RATIONALE],
  ["EN-a1b944b37228d951", "correct", "Jack Clark", "https://importai.substack.com/", "Import AI 是出版物名称，署名作者为 Jack Clark；人物实体规范化为作者，原名称保留为别名。"],
  ["EN-a8646a9a88322548", "correct", "Nathan Lambert", "https://www.interconnects.ai/", "Interconnects 是出版物名称，署名作者为 Nathan Lambert；人物实体规范化为作者，原名称保留为别名。"],
  ["EN-76a2a0c598ae1389", "confirm", "Josh Woodward", "https://x.com/joshwoodward", HUMAN_RATIONALE],
  ["EN-972fbd396c3dd087", "correct", "Lilian Weng", "https://lilianweng.github.io/", "监测标签是 Lilian Weng 的个人博客；人物实体规范化为作者，原名称保留为别名。"],
  ["EN-3c67e51edcaf55f3", "confirm", "Madhu Guru", "https://x.com/realmadhuguru", HUMAN_RATIONALE],
  ["EN-676aad90b3894e45", "confirm", "Matt Turck", "https://x.com/mattturck", HUMAN_RATIONALE],
  ["EN-2b8001c620ee14ca", "confirm", "Nan Yu", "https://x.com/thenanyu", HUMAN_RATIONALE],
  ["EN-49d19fe95c451ea1", "confirm", "Nikunj Kothari", "https://x.com/nikunj", HUMAN_RATIONALE],
  ["EN-f8f429ddacf2ce3d", "confirm", "Peter Steinberger", "https://x.com/steipete", HUMAN_RATIONALE],
  ["EN-e2d7cabe3bc550db", "confirm", "Peter Yang", "https://x.com/petergyang", HUMAN_RATIONALE],
  ["EN-6e8f210aa5e3e45b", "confirm", "Ryo Lu", "https://x.com/ryolu_", HUMAN_RATIONALE],
  ["EN-3ed55c0c72931e4b", "confirm", "Sam Altman", "https://x.com/sama", HUMAN_RATIONALE],
  ["EN-dbfd4a508f68f76f", "correct", "Simon Willison", "https://simonwillison.net/", "监测标签是 Simon Willison 的个人博客；人物实体规范化为作者，原名称保留为别名。"],
  ["EN-3e399b77ab76c3b0", "confirm", "Swyx", "https://x.com/swyx", HUMAN_RATIONALE],
  ["EN-fc3f9c93082da9e8", "confirm", "Thariq", "https://x.com/trq212", HUMAN_RATIONALE],
  ["EN-f97e56489ceee4ba", "confirm", "Thibault Sottiaux", "https://x.com/thsottiaux", HUMAN_RATIONALE],
  ["EN-69379eabbf1b664b", "quarantine", "Tigera Blog (Calico / AI Security)", "https://www.tigera.io/blog/", "Tigera Blog 是企业博客，不是自然人。"],
  ["EN-35b7023525acffef", "quarantine", "TLDR AI Newsletter", "https://tldr.tech/ai", "TLDR AI Newsletter 是新闻简报，不是自然人。"],
  ["EN-f41223b7e1ce4931", "confirm", "Zara Zhang", "https://x.com/zarazhangrui", HUMAN_RATIONALE]
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function key(value = "") {
  return clean(value).normalize("NFKC").toLocaleLowerCase();
}

function personId(handle = "", name = "") {
  const digest = crypto.createHash("sha256").update(`person|${key(handle || name)}`).digest("hex").slice(0, 16);
  return `EN-${digest}`;
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

const viewpointData = readJson(viewpointsFile);
const catalogLedger = readJson(catalogLedgerFile);
const buildersByKey = new Map((viewpointData.builders || []).map((builder) => [key(builder.handle || builder.name), builder]));
const remarksByKey = new Map();
for (const remark of viewpointData.remarks || []) {
  const sourceKey = key(remark.handle || remark.name);
  if (!sourceKey) continue;
  if (!remarksByKey.has(sourceKey)) remarksByKey.set(sourceKey, []);
  remarksByKey.get(sourceKey).push(remark);
}
const viewpointCandidates = [...remarksByKey.entries()].map(([sourceKey, remarks]) => {
  const latest = [...remarks].sort((a, b) => String(b.date || b.createdAt || "").localeCompare(String(a.date || a.createdAt || "")))[0] || {};
  const builder = buildersByKey.get(sourceKey) || {};
  const name = clean(latest.name || builder.name || latest.handle || builder.handle);
  const handle = clean(latest.handle || builder.handle);
  return {
    id: personId(handle, name),
    name,
    handle,
    role: clean(latest.role || builder.role),
    viewpointIds: remarks.map((remark) => remark.id).filter(Boolean)
  };
});
const profilesById = new Map(viewpointCandidates.map((profile) => [profile.id, profile]));
const inheritedPersonDecisions = (catalogLedger.decisions || []).filter((decision) => decision.canonical?.catalog_type === "person");
const policyIds = new Set(decisions.map(([entityId]) => entityId));
const problems = [];

if (viewpointCandidates.length !== 34) problems.push(`expected 34 viewpoint person/account candidates, found ${viewpointCandidates.length}`);
if (inheritedPersonDecisions.length !== 3) problems.push(`expected 3 inherited person decisions, found ${inheritedPersonDecisions.length}`);
if (decisions.length !== 34 || policyIds.size !== 34) problems.push("person/account policy must contain 34 unique new decisions");
for (const profile of viewpointCandidates) if (!policyIds.has(profile.id)) problems.push(`missing person/account decision: ${profile.id}:${profile.name}`);
for (const entityId of policyIds) if (!profilesById.has(entityId)) problems.push(`decision does not resolve to a current candidate: ${entityId}`);
if (problems.length) throw new Error(`person_account_review_build_failed:\n- ${problems.join("\n- ")}`);

const outputDecisions = decisions.map(([entityId, action, canonicalName, sourceUrl, rationale]) => {
  const profile = profilesById.get(entityId);
  return {
    entity_id: entityId,
    current: {
      name: profile.name,
      catalog_type: "person",
      company_names: []
    },
    action,
    merge_into_entity_id: "",
    canonical: {
      name: canonicalName,
      catalog_type: action === "quarantine" ? "other" : "person",
      company_names: []
    },
    evidence: {
      claim_refs: [],
      secondary_sources: [{
        source_id: `PERSON-SOURCE-${entityId.slice(3)}`,
        source_url: sourceUrl,
        quote: [profile.name, profile.handle ? `@${profile.handle}` : "", profile.role].filter(Boolean).join(" | ")
      }]
    },
    rationale,
    review_status: "accepted",
    reviewer: "codex-person-account-review",
    reviewed_at: REVIEWED_AT
  };
});

const ledger = {
  schema_version: "ENTITY-PERSON-ACCOUNT-REVIEW-V1",
  review_version: "PERSON-REVIEW-V1.0",
  reviewed_at: REVIEWED_AT,
  scope: "SITE-V4.2 unified person index candidates from canonical entities and First-Line Viewpoints",
  summary: {
    candidates: 37,
    inherited_catalog_decisions: inheritedPersonDecisions.length,
    new_decisions: outputDecisions.length,
    confirmed: outputDecisions.filter((item) => item.action === "confirm").length,
    corrected: outputDecisions.filter((item) => item.action === "correct").length,
    quarantined: outputDecisions.filter((item) => item.action === "quarantine").length,
    expected_public_natural_people: 31
  },
  decisions: outputDecisions
};

if (write) writeJsonAtomic(outputFile, ledger);
console.log(JSON.stringify({ ok: true, write, output: path.relative(root, outputFile).replace(/\\/gu, "/"), summary: ledger.summary }, null, 2));
