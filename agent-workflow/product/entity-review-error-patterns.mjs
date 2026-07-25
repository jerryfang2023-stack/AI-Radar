const clean = (value = "") => String(value || "").replace(/\s+/gu, " ").trim();
const key = (value = "") => clean(value).normalize("NFKC").toLocaleLowerCase();

function looksLikeVersionAlias(currentName = "", canonicalName = "") {
  const current = clean(currentName);
  const canonical = clean(canonicalName);
  if (!current || !canonical || key(current) === key(canonical)) return false;
  const escaped = canonical.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`^${escaped}\\s+v?\\d+(?:\\.\\d+)+$`, "iu").test(current);
}

function looksLikeExtractionNoise(value = "") {
  const name = clean(value);
  return /(?:\breport|报告)$/iu.test(name)
    || /^(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:\d{1,2}|\d{4})$/iu.test(name)
    || /\b(?:announces?|releases?|launches?|introducing|enter(?:s|ed)?|achiev(?:e|es|ed)|powering|grows?|replacing)\b/iu.test(name)
    || /^(?:US AI|Company Announcement|Enterprise IT|Blog|News|Research|Home|Set|Learn)$/iu.test(name);
}

export const ENTITY_REVIEW_ERROR_PATTERNS = [
  "name_extraction_fragment",
  "version_alias",
  "entity_type_misclassification",
  "duplicate_entity",
  "ownership_attribution",
  "insufficient_claim_evidence",
  "generic_or_non_entity",
  "legacy_correction_retained"
];

export function classifyEntityReviewErrorPatterns(decision = {}) {
  if (decision.action === "confirm") return [];
  const patterns = new Set();
  const current = decision.current || {};
  const canonical = decision.canonical || {};

  if (decision.action === "merge") {
    patterns.add(looksLikeVersionAlias(current.name, canonical.name) ? "version_alias" : "duplicate_entity");
  }
  if (key(current.name) !== key(canonical.name)) patterns.add("name_extraction_fragment");
  if (current.catalog_type !== canonical.catalog_type && canonical.catalog_type !== "other") patterns.add("entity_type_misclassification");
  if (JSON.stringify([...(current.company_names || [])].map(key).sort()) !== JSON.stringify([...(canonical.company_names || [])].map(key).sort())) {
    patterns.add("ownership_attribution");
  }
  if (decision.action === "quarantine") {
    patterns.add(looksLikeExtractionNoise(current.name) ? "name_extraction_fragment" : "generic_or_non_entity");
    if (!(decision.evidence?.claim_refs || []).length) patterns.add("insufficient_claim_evidence");
  }
  if (!patterns.size) patterns.add("legacy_correction_retained");
  return [...patterns];
}

export function annotateEntityReviewErrorPatterns(decisions = []) {
  for (const decision of decisions) decision.error_patterns = classifyEntityReviewErrorPatterns(decision);
  return decisions;
}
