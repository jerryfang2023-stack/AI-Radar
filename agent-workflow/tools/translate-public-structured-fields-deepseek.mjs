#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepSeekJsonCompletion, deepSeekModels } from "./deepseek-translation-client.mjs";
import {
  PUBLIC_ZH_TRANSLATION_VERSION,
  collectPublicTranslationCandidates,
  readPublicTranslationRegistry,
} from "./public-zh-translation-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const write = process.argv.includes("--write=true");
const batchSize = Math.max(1, Number(process.argv.find((arg) => arg.startsWith("--batch-size="))?.split("=")[1] || 20));
const maxBatches = Math.max(0, Number(process.argv.find((arg) => arg.startsWith("--max-batches="))?.split("=")[1] || 0));
const registryFile = path.join(root, "01-SiteV2/content/11-databases/public-zh-translations-v1.json");

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function uniqueCandidates() {
  const funding = readJson(path.join(root, "01-SiteV2/site/data/funding-insights-v1.json"), { cards: [] });
  const fundingBundleDir = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
  const fundingBundles = fs.existsSync(fundingBundleDir)
    ? fs.readdirSync(fundingBundleDir)
      .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name))
      .flatMap((name) => readJson(path.join(fundingBundleDir, name), { cards: [] }).cards || [])
    : [];
  const dataCenter = readJson(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"), {});
  const institutions = readJson(path.join(root, "01-SiteV2/content/11-databases/investment-institutions-v1.json"), { institutions: [] });
  const candidates = [
    ...collectPublicTranslationCandidates(funding.cards || [], { entityType: "funding_card", basePath: "cards" }),
    ...collectPublicTranslationCandidates(fundingBundles, { entityType: "funding_card", basePath: "funding_bundles" }),
    ...collectPublicTranslationCandidates(dataCenter.companies || [], { entityType: "company", basePath: "companies" }),
    ...collectPublicTranslationCandidates(dataCenter.products || [], { entityType: "product", basePath: "products" }),
    ...collectPublicTranslationCandidates(dataCenter.people || [], { entityType: "person", basePath: "people" }),
    ...collectPublicTranslationCandidates(dataCenter.investmentInstitutionRegistry?.institutions || [], { entityType: "institution", basePath: "institutions" }),
    ...collectPublicTranslationCandidates(institutions.institutions || [], { entityType: "institution", basePath: "institution_registry" }),
  ];
  const byKey = new Map();
  for (const item of candidates) {
    const key = `${item.field_name}|${item.source_hash}`;
    if (!byKey.has(key)) byKey.set(key, item);
  }
  return [...byKey.values()];
}

function registryKey(item) {
  return `${item.entity_type}|${item.field_path}|${item.source_hash}`;
}

async function translateBatch(batch, model) {
  const payload = batch.map((item, index) => ({ id: index, field: item.field_name, text: item.source_text }));
  const response = await deepSeekJsonCompletion({
    model,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: [
          "Translate structured AI company, investor and person descriptions into concise natural Simplified Chinese.",
          "Preserve official company, institution, person, product and model names; preserve SaaS, API, GPU, LLM and other standard acronyms.",
          "Preserve every number, amount, date, version and URL exactly. Translate job titles, locations, product functions, customer types, industries and scenarios.",
          "Do not add facts or commentary. Return JSON only as {\"items\":[{\"id\":0,\"text\":\"...\",\"review_required\":false}]}.",
        ].join(" "),
      },
      { role: "user", content: JSON.stringify({ items: payload }) },
    ],
  });
  return Array.isArray(response?.payload?.items) ? response.payload.items : [];
}

async function main() {
  const registry = readPublicTranslationRegistry(root);
  const discoveredCandidates = uniqueCandidates();
  const discoveredKeys = new Set(discoveredCandidates.map((item) => `${item.field_name}|${item.source_hash}`));
  for (const [key, entry] of Object.entries(registry.entries || {})) {
    if (entry.status === "failed" && !discoveredKeys.has(`${entry.field_name}|${entry.source_hash}`)) delete registry.entries[key];
  }
  const existing = new Set(Object.values(registry.entries || {})
    .filter((entry) => ["translated", "review_required"].includes(entry.status))
    .map((entry) => `${entry.field_name}|${entry.source_hash}`));
  const allCandidates = discoveredCandidates.filter((item) => !existing.has(`${item.field_name}|${item.source_hash}`));
  const candidates = maxBatches ? allCandidates.slice(0, maxBatches * batchSize) : allCandidates;
  const models = deepSeekModels();
  for (let offset = 0; offset < candidates.length; offset += batchSize) {
    const batch = candidates.slice(offset, offset + batchSize);
    try {
      let modelUsed = models.flash;
      let translations = await translateBatch(batch, models.flash);
      if (translations.length !== batch.length) {
        modelUsed = models.pro;
        translations = await translateBatch(batch, models.pro);
      }
      for (const [index, item] of batch.entries()) {
        const translated = translations.find((entry) => Number(entry.id) === index);
        const text = String(translated?.text || "").trim();
        const hasChinese = /[\u3400-\u9fff]/u.test(text);
        const protectedNameOnly = Boolean(text) && !hasChinese;
        registry.entries[registryKey(item)] = {
          ...item,
          text: hasChinese ? text : (protectedNameOnly ? item.source_text : ""),
          provider: "deepseek",
          model: modelUsed,
          translated_at: new Date().toISOString(),
          status: translated?.review_required || protectedNameOnly ? "review_required" : (hasChinese ? "translated" : "failed"),
        };
      }
    } catch (error) {
      for (const item of batch) {
        registry.entries[registryKey(item)] = {
          ...item,
          text: "",
          provider: "deepseek",
          model: models.flash,
          translated_at: new Date().toISOString(),
          status: "failed",
          error: String(error.message || error).slice(0, 300),
        };
      }
    }
  }
  registry.schema_version = PUBLIC_ZH_TRANSLATION_VERSION;
  registry.generated_at = new Date().toISOString();
  if (write) {
    fs.mkdirSync(path.dirname(registryFile), { recursive: true });
    fs.writeFileSync(registryFile, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  }
  const counts = Object.values(registry.entries || {}).reduce((output, entry) => {
    output[entry.status] = (output[entry.status] || 0) + 1;
    return output;
  }, {});
  console.log(JSON.stringify({ ok: true, write, candidates: candidates.length, counts, registry: path.relative(root, registryFile) }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
