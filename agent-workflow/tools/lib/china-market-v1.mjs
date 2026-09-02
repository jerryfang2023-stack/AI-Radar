import fs from "node:fs";
import path from "node:path";

export const CHINA_MARKET_SOURCE_REGISTRY_VERSION = "CHINA-MARKET-SOURCE-REGISTRY-V1.0";
export const CHINA_MARKET_MONITORING_VERSION = "CHINA-MARKET-MONITORING-V1.3";
export const CHINA_MARKET_ENTITY_ALIASES_VERSION = "CHINA-MARKET-ENTITY-ALIASES-V1.0";

const DATABASE_DIR = path.join("01-SiteV2", "content", "11-databases");
const SOURCE_REGISTRY_FILE = "china-market-source-registry-v1.json";
const MONITORING_FILE = "china-market-monitoring-v1.json";
const ENTITY_ALIASES_FILE = "china-market-entity-aliases-v1.json";
const FORBIDDEN_FIELD_NAMES = new Set([
  "source_level",
  "source_weight",
  "weight",
  "score",
  "priority",
  "rank",
  "trust_score",
  "quality_score",
  "confidence_score",
  "boost",
  "bonus",
  "multiplier",
]);
const SOURCE_CATEGORIES = new Set([
  "government_regulator",
  "government_procurement",
  "listed_company_disclosure",
  "research_institution",
  "company_official",
  "industry_media",
  "developer_community",
]);
const INTERFACE_TYPES = new Set(["rss", "public-web", "manual-review"]);

function clean(value) {
  return String(value ?? "").trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNoWeightingFields(value, pointer = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoWeightingFields(item, `${pointer}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert(!FORBIDDEN_FIELD_NAMES.has(key.toLowerCase()), `${pointer}.${key}: weighting/ranking field is forbidden`);
    assertNoWeightingFields(child, `${pointer}.${key}`);
  }
}

function assertUnique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const value = clean(item?.[key]);
    assert(value, `${label} is missing ${key}`);
    assert(!seen.has(value), `${label} has duplicate ${key}: ${value}`);
    seen.add(value);
  }
}

function assertHttpUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} is not a valid URL: ${value}`);
  }
  assert(["http:", "https:"].includes(url.protocol), `${label} must use http or https`);
}

export function validateChinaMarketSourceRegistry(payload) {
  assert(payload?.schema_version === CHINA_MARKET_SOURCE_REGISTRY_VERSION, "Invalid China market source registry version");
  assert(payload?.market_region === "CN", "China market source registry must set market_region=CN");
  assert(payload?.classification_policy?.ranking_or_weighting === "forbidden", "China source registry must forbid ranking and weighting");
  assertNoWeightingFields(payload);
  const sources = Array.isArray(payload.sources) ? payload.sources : [];
  assert(sources.length > 0, "China market source registry has no sources");
  assertUnique(sources, "source_id", "China market source");
  for (const source of sources) {
    assert(clean(source.name), `${source.source_id}: name is required`);
    assert(SOURCE_CATEGORIES.has(source.source_category), `${source.source_id}: unsupported source_category`);
    assert(INTERFACE_TYPES.has(source.interface_type), `${source.source_id}: unsupported interface_type`);
    assertHttpUrl(source.endpoint_or_url, `${source.source_id}.endpoint_or_url`);
    assert(Array.isArray(source.publisher_domains) && source.publisher_domains.length > 0, `${source.source_id}: publisher_domains are required`);
    assert(Array.isArray(source.collection_scope) && source.collection_scope.length > 0, `${source.source_id}: collection_scope is required`);
    assert(typeof source.enabled_default === "boolean", `${source.source_id}: enabled_default must be boolean`);
    for (const prefix of source.match_url_prefixes || []) {
      assertHttpUrl(prefix, `${source.source_id}.match_url_prefixes`);
    }
  }
  return payload;
}

export function validateChinaMarketMonitoring(payload) {
  assert(payload?.schema_version === CHINA_MARKET_MONITORING_VERSION, "Invalid China market monitoring version");
  assert(payload?.market_region === "CN", "China market monitoring must set market_region=CN");
  assert(payload?.policy?.ranking_or_weighting === "forbidden", "China market monitoring must forbid ranking and weighting");
  assertNoWeightingFields(payload);
  const queries = Array.isArray(payload.search_queries) ? payload.search_queries : [];
  assert(queries.length > 0, "China market monitoring has no search queries");
  assertUnique(queries, "query_id", "China market query");
  for (const query of queries) {
    assert(query.enabled === undefined || typeof query.enabled === "boolean", `${query.query_id}: enabled must be boolean when present`);
    assert(clean(query.query), `${query.query_id}: query is required`);
    assert(clean(query.query_theme), `${query.query_id}: query_theme is required`);
    assert(Array.isArray(query.lanes) && query.lanes.length > 0, `${query.query_id}: lanes are required`);
    assert(Array.isArray(query.search_paths) && query.search_paths.length > 0, `${query.query_id}: search_paths are required`);
    assert(query.market_region === "CN", `${query.query_id}: market_region must be CN`);
  }
  return payload;
}

export function validateChinaMarketEntityAliases(payload) {
  assert(payload?.schema_version === CHINA_MARKET_ENTITY_ALIASES_VERSION, "Invalid China market entity aliases version");
  assert(payload?.market_region === "CN", "China market entity aliases must set market_region=CN");
  assertNoWeightingFields(payload);
  const entities = Array.isArray(payload.entities) ? payload.entities : [];
  assert(entities.length > 0, "China market entity aliases has no entities");
  assertUnique(entities, "canonical_name", "China market entity");
  const aliases = new Map();
  for (const entity of entities) {
    assert(entity.entity_type === "organization", `${entity.canonical_name}: only organization aliases are supported in V1`);
    const names = [...(entity.aliases || []), ...(entity.legal_names || [])].map(clean).filter(Boolean);
    assert(names.length >= 2, `${entity.canonical_name}: at least two aliases/legal names are required`);
    for (const name of names) {
      const key = name.toLocaleLowerCase();
      const existing = aliases.get(key);
      assert(!existing || existing === entity.canonical_name, `${entity.canonical_name}: alias conflicts with ${existing}: ${name}`);
      aliases.set(key, entity.canonical_name);
    }
  }
  return payload;
}

export function loadChinaMarketConfig(root) {
  const sourceRegistryPath = path.join(root, DATABASE_DIR, SOURCE_REGISTRY_FILE);
  const monitoringPath = path.join(root, DATABASE_DIR, MONITORING_FILE);
  const entityAliasesPath = path.join(root, DATABASE_DIR, ENTITY_ALIASES_FILE);
  return {
    sourceRegistryPath,
    monitoringPath,
    entityAliasesPath,
    sourceRegistry: validateChinaMarketSourceRegistry(readJson(sourceRegistryPath)),
    monitoring: validateChinaMarketMonitoring(readJson(monitoringPath)),
    entityAliases: validateChinaMarketEntityAliases(readJson(entityAliasesPath)),
  };
}

export function mergeChinaMarketSources(baseSources = [], sourceRegistry = {}) {
  const chinaSources = (sourceRegistry.sources || [])
    .filter((source) => source.enabled_default !== false)
    .map((source) => ({
      source_id: source.source_id,
      name: source.name,
      source_type: source.source_category,
      source_category: source.source_category,
      interface_type: source.interface_type,
      endpoint_or_url: source.endpoint_or_url,
      publisher_domains: source.publisher_domains,
      match_url_prefixes: source.match_url_prefixes || [],
      language: source.language,
      collection_scope: source.collection_scope,
      enabled_default: source.enabled_default,
      registry_scope: "china_market",
      source_region: "CN",
    }));
  return [...baseSources, ...chinaSources];
}

export function chinaMarketLaneQueries(monitoring = {}, lane) {
  return (monitoring.search_queries || [])
    .filter((query) => query.enabled !== false && query.lanes.includes(lane))
    .map((query) => ({
      query: query.query,
      query_theme: query.query_theme,
      keyword_group: query.keyword_group || query.query_theme,
      search_paths: query.search_paths,
      market_region: "CN",
      china_market_query_id: query.query_id,
    }));
}

export function chinaMarketOrganizationAliases(entityAliases = {}) {
  return (entityAliases.entities || [])
    .filter((entity) => entity.entity_type === "organization")
    .map((entity) => ({
      canonicalName: entity.canonical_name,
      aliases: [...new Set([
        ...(entity.aliases || []),
        ...(entity.legal_names || []),
      ].map(clean).filter(Boolean))],
    }));
}

export function selectChinaMarketIntakeDocuments(documents = []) {
  const sourceDocuments = documents.filter((document) => document.market_scope?.source_region === "CN");
  const marketDocuments = documents.filter((document) => (
    document.market_scope?.market_region === "CN"
    || document.market_scope?.china_market_match === true
  ));
  return {
    sourceDocuments,
    marketDocuments,
    invalidSourceDocuments: sourceDocuments.filter(
      (document) => !clean(document.market_scope?.source_registry_id),
    ),
    invalidMarketDocuments: marketDocuments.filter((document) => (
      document.market_scope?.market_region !== "CN"
      || document.market_scope?.china_market_match !== true
      || !clean(document.market_scope?.china_market_match_basis)
    )),
  };
}

export function chinaMarketMatch(item = {}, entityAliases = {}) {
  const summary = clean(item.summary).replace(/\s*\/\s*query=[\s\S]*$/iu, "");
  const text = [
    item.title,
    summary,
    item.source,
  ].map(clean).filter(Boolean).join("\n");
  const explicitMatch = text.match(
    /中国市场|中国企业|中国公司|国内(?:市场|企业|厂商|大模型|人工智能)|国产(?:大模型|AI|芯片|算力)|国家网信办|工业和信息化部|工信部|生成式人工智能服务.*备案|算法备案|智算中心/iu
  );
  if (explicitMatch) {
    return { matched: true, basis: `explicit_market_term:${explicitMatch[0]}` };
  }

  const legalEntityMatch = text.match(/[\u3400-\u9fff]{2,36}(?:有限责任公司|股份有限公司|有限公司)/u);
  if (legalEntityMatch) {
    return { matched: true, basis: `china_legal_entity:${legalEntityMatch[0]}` };
  }

  const aliases = chinaMarketOrganizationAliases(entityAliases)
    .flatMap((entity) => entity.aliases.map((alias) => ({
      canonicalName: entity.canonicalName,
      alias,
    })))
    .sort((a, b) => b.alias.length - a.alias.length);
  const hit = aliases.find((entry) => {
    if (/[\u3400-\u9fff]/u.test(entry.alias)) return text.includes(entry.alias);
    const escaped = entry.alias.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?:$|[^A-Za-z0-9])`, "iu").test(text);
  });
  if (hit) {
    return { matched: true, basis: `china_entity:${hit.canonicalName}:${hit.alias}` };
  }
  return { matched: false, basis: "no_china_market_subject" };
}

export function chinaMarketBasisType(value = "") {
  const basis = clean(value);
  if (basis.startsWith("china_entity:")) return "actor_origin";
  if (basis.startsWith("china_legal_entity:")) return "actor_origin";
  if (/国家网信办|工业和信息化部|工信部|备案|算法/u.test(basis)) return "regulatory_jurisdiction";
  if (/落地|部署|客户案例|智算中心/u.test(basis)) return "deployment_location";
  if (basis) return "event_market";
  return "";
}

export function scopeChinaMarketItems(items = [], entityAliases = {}) {
  const included = [];
  const excluded = [];
  for (const item of items) {
    const match = chinaMarketMatch(item, entityAliases);
    const scoped = {
      ...item,
      china_market_match: match.matched,
      china_market_match_basis: match.basis,
    };
    if (match.matched) {
      included.push({ ...scoped, market_region: "CN" });
    } else {
      delete scoped.market_region;
      excluded.push(scoped);
    }
  }
  return { included, excluded };
}
