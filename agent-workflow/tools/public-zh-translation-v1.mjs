import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const PUBLIC_ZH_TRANSLATION_VERSION = "PUBLIC-ZH-TRANSLATION-V1.0";

const translatableKeys = new Set([
  "summary", "companySummary", "description", "headquarters", "role", "roleTitle",
  "industry", "use_case", "useCase", "scenario", "features", "target_customers",
  "targetCustomers", "customer_type", "customerType", "market_description",
  "marketDescription", "sector_description", "sectorDescription", "label",
]);

export function publicTranslationHash(value = "") {
  return crypto.createHash("sha256").update(String(value).normalize("NFKC")).digest("hex");
}

export function isPublicTranslationCandidate(key, value) {
  if (!translatableKeys.has(String(key))) return false;
  const text = String(value || "").trim();
  if (!text || /^https?:\/\//iu.test(text)) return false;
  if (/^(?:SaaS|API|GPU|CPU|LLM|MCP|RAG|AI|ML|B2B|B2C|CI\/CD)$/u.test(text)) return false;
  const latin = (text.match(/[A-Za-z]/gu) || []).length;
  const chinese = (text.match(/[\u3400-\u9fff]/gu) || []).length;
  return latin >= 3 && latin > chinese;
}

export function readPublicTranslationRegistry(projectRoot) {
  const file = path.join(projectRoot, "01-SiteV2/content/11-databases/public-zh-translations-v1.json");
  if (!fs.existsSync(file)) {
    return { schema_version: PUBLIC_ZH_TRANSLATION_VERSION, generated_at: "", entries: {} };
  }
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

export function collectPublicTranslationCandidates(value, {
  entityType = "public",
  basePath = "",
  output = [],
} = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPublicTranslationCandidates(item, {
      entityType,
      basePath: `${basePath}[${index}]`,
      output,
    }));
    return output;
  }
  if (!value || typeof value !== "object") return output;
  for (const [key, item] of Object.entries(value)) {
    const fieldPath = basePath ? `${basePath}.${key}` : key;
    if (typeof item === "string" && isPublicTranslationCandidate(key, item)) {
      output.push({
        entity_type: entityType,
        field_name: key,
        field_path: fieldPath,
        source_text: item.trim(),
        source_hash: publicTranslationHash(item.trim()),
      });
    } else if (Array.isArray(item)) {
      item.forEach((arrayItem, itemIndex) => {
        const arrayPath = `${fieldPath}[${itemIndex}]`;
        if (typeof arrayItem === "string" && isPublicTranslationCandidate(key, arrayItem)) {
          output.push({
            entity_type: entityType,
            field_name: key,
            field_path: arrayPath,
            source_text: arrayItem.trim(),
            source_hash: publicTranslationHash(arrayItem.trim()),
          });
        } else {
          collectPublicTranslationCandidates(arrayItem, { entityType, basePath: arrayPath, output });
        }
      });
    } else {
      collectPublicTranslationCandidates(item, { entityType, basePath: fieldPath, output });
    }
  }
  return output;
}

function translatedEntryIndex(registry) {
  const index = new Map();
  for (const entry of Object.values(registry.entries || {})) {
    if (entry.status !== "translated" || !entry.text) continue;
    index.set(`${entry.field_name}|${entry.source_hash}`, entry);
  }
  return index;
}

export function applyPublicZhTranslations(value, registry, {
  entityType = "public",
  basePath = "",
  translationMap = {},
} = {}) {
  const index = translatedEntryIndex(registry);
  const clone = structuredClone(value);
  const visit = (current, currentPath) => {
    if (Array.isArray(current)) {
      current.forEach((item, arrayIndex) => visit(item, `${currentPath}[${arrayIndex}]`));
      return;
    }
    if (!current || typeof current !== "object") return;
    for (const [key, item] of Object.entries(current)) {
      const fieldPath = currentPath ? `${currentPath}.${key}` : key;
      if (typeof item === "string" && isPublicTranslationCandidate(key, item)) {
        const sourceHash = publicTranslationHash(item.trim());
        const entry = index.get(`${key}|${sourceHash}`);
        if (!entry) continue;
        current[key] = entry.text;
        translationMap[fieldPath] = {
          text: entry.text,
          source_hash: sourceHash,
          provider: entry.provider,
          model: entry.model,
          translated_at: entry.translated_at,
          status: entry.status,
        };
      } else if (Array.isArray(item)) {
        item.forEach((arrayItem, itemIndex) => {
          const arrayPath = `${fieldPath}[${itemIndex}]`;
          if (typeof arrayItem === "string" && isPublicTranslationCandidate(key, arrayItem)) {
            const sourceHash = publicTranslationHash(arrayItem.trim());
            const entry = index.get(`${key}|${sourceHash}`);
            if (!entry) return;
            item[itemIndex] = entry.text;
            translationMap[arrayPath] = {
              text: entry.text,
              source_hash: sourceHash,
              provider: entry.provider,
              model: entry.model,
              translated_at: entry.translated_at,
              status: entry.status,
            };
          } else {
            visit(arrayItem, arrayPath);
          }
        });
      } else {
        visit(item, fieldPath);
      }
    }
  };
  visit(clone, basePath);
  if (clone && typeof clone === "object" && !Array.isArray(clone) && Object.keys(translationMap).length) {
    clone.translations = { ...(clone.translations || {}), "zh-CN": translationMap };
  }
  return clone;
}
