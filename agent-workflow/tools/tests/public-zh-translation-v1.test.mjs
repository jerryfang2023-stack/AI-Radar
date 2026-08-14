import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyPublicZhTranslations,
  collectPublicTranslationCandidates,
  publicTranslationHash,
  readPublicTranslationRegistry,
} from "../public-zh-translation-v1.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("public translation candidates exclude official names and standard acronyms", () => {
  const value = {
    name: "OpenAI",
    headquarters: "San Francisco, CA",
    industry: "SaaS",
    description: "Enterprise workflow automation platform",
  };
  const candidates = collectPublicTranslationCandidates(value, { entityType: "company" });
  assert.deepEqual(candidates.map((item) => item.field_name).sort(), ["description", "headquarters"]);
});

test("public translation projection preserves the source hash and exposes zh-CN metadata", () => {
  const source = "Co-Founder and Chief Executive Officer";
  const registry = {
    entries: {
      role: {
        field_name: "role",
        source_hash: publicTranslationHash(source),
        text: "联合创始人兼首席执行官",
        provider: "deepseek",
        model: "deepseek-v4-flash",
        translated_at: "2026-08-14T00:00:00.000Z",
        status: "translated",
      },
    },
  };
  const result = applyPublicZhTranslations({ name: "Ada", role: source }, registry, { entityType: "person" });
  assert.equal(result.name, "Ada");
  assert.equal(result.role, "联合创始人兼首席执行官");
  assert.equal(result.translations["zh-CN"].role.source_hash, publicTranslationHash(source));
});

test("public company, product, institution, person and funding descriptions have no unregistered pure-English copy", () => {
  const funding = JSON.parse(fs.readFileSync(path.join(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json"), "utf8"));
  const dataCenter = JSON.parse(fs.readFileSync(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4-frontstage.json"), "utf8"));
  const registry = readPublicTranslationRegistry(projectRoot);
  const statuses = new Map(Object.values(registry.entries || {}).map((entry) => [
    `${entry.field_name}|${entry.source_hash}`,
    entry.status,
  ]));
  const publicCollections = [
    ["funding_card", funding.cards],
    ["company", dataCenter.companies],
    ["product", dataCenter.products],
    ["person", dataCenter.people],
    ["institution", dataCenter.investmentInstitutionRegistry?.institutions],
  ];
  const unresolved = publicCollections
    .flatMap(([entityType, value]) => collectPublicTranslationCandidates(value || [], { entityType }))
    .filter((item) => !/[\u3400-\u9fff]/u.test(item.source_text))
    .filter((item) => !["translated", "review_required"].includes(statuses.get(`${item.field_name}|${item.source_hash}`)));
  assert.deepEqual(unresolved, []);
});
