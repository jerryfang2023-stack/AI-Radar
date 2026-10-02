#!/usr/bin/env node
import { isMainModule } from "./lib/module-entry.mjs";
import fs from "node:fs";
import { createSearchGateway } from "./lib/search-gateway.mjs";
import { planFundingResearch, fundingResearchCoverage, independentResearchSources } from "./lib/funding-research-plan.mjs";
import path from "node:path";
import { readOriginalPage } from '../financing/original-page.mjs';
import { publicationHold } from '../financing/catalog.mjs';
import { createOriginalReader } from '../financing/original-reader.mjs';
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";
import {
  FUNDING_INDUSTRY_IDS,
  FUNDING_INSIGHT_GATE_VERSION,
  FUNDING_INSIGHT_PROMPT_VERSION,
  FUNDING_INSIGHT_VERSION,
  FUNDING_TARGET_USER_IDS,
  FUNDING_USE_CASE_IDS,
  FUNDING_MARKET_SUBCATEGORY_PARENTS,
  clean,
  canonicalFundingEventAmount,
  ensureCanonicalFundingEvidence,
  ensureNamedCompanyEvidence,
  entityResolver,
  fundingEventCardConsistencyProblems,
  fundingTrancheDisclosureNeedsReview,
  fundingCombinedRoundsNeedReview,
  fundingInsightProblems,
  isEligibleFundingInsightEvent,
  latestDataDate,
  loadDailyBundle,
  normalizeFundingInsightCard,
  normalizeFundingAmount,
  normalizeFundingRound,
  readJson,
  referencedSourceIds,
  researchPayloadProblems,
  sanitizeResearchPayload,
  stableId,
  subjectCompanyForEvent,
  writeJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || latestDataDate(root);
const write = args.get("write") === "true";
const force = args.get("force") === "true";
const limit = Math.max(0, Number(args.get("limit") || 0));
const eventId = clean(args.get("event-id") || "");
const eventIds = new Set([
  eventId,
  ...clean(args.get("event-ids") || "").split(",").map(clean),
].filter(Boolean));
const selectedOnly = args.get("selected-only") === "true";
const recoverFromGitRef = clean(args.get("recover-from-git-ref") || "");
const concurrency = Math.max(1, Math.min(4, Number(args.get("concurrency") || 2)));
const output = path.resolve(args.get("output")
  || path.join(root, "01-SiteV2/content/12-applications/funding-insights", `${date}.json`));
const model = deepSeekModels().pro;

// Explicit operator discovery can replace unavailable search APIs. Seeds are
// URL metadata only: capturePage must still fetch the original, and all normal
// identity, exact-quote, source-count and publication gates remain in force.
export function reviewedResearchSeeds(manifest, event, company) {
  if (!manifest || manifest.schema_version !== "FUNDING-RESEARCH-SEEDS-V1") throw new Error("invalid_research_seed_manifest");
  const entry = manifest.events?.find((row) => row.event_id === event.event_id);
  if (!entry || entry.company_name !== company.canonical_name) throw new Error("research_seed_identity_mismatch");
  if (!entry.discovery_provider || !entry.queries?.length) throw new Error("research_seed_discovery_missing");
  const seen = new Set();
  return (entry.sources || []).map((source) => {
    const url = new URL(source.url);
    if (url.protocol !== "https:" || url.username || url.password || /^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/u.test(url.hostname)) throw new Error("invalid_research_seed_url");
    return { url: url.href, title: clean(source.title), provider: entry.discovery_provider, provider_body: "", source_class: sourceClass(url.href, company.canonical_name), intent: "funding", query: entry.queries.join("; ") };
  }).filter((source) => !seen.has(source.url) && seen.add(source.url));
}

export function selectFundingEventsForGeneration(events = [], {
  currentCards = [],
  publishedCards = [],
  force: forceGeneration = false,
  eventAggregationKey = () => "",
  allowAggregationReuse = () => true,
  publishedCardMatchesEvent = () => true,
} = {}) {
  if (forceGeneration) return { pending: [...events], reused: [], deduplicated: [] };
  const currentEventIds = new Set(currentCards.map((card) => card.triggered_by_event_id).filter(Boolean));
  const publishedEventIds = new Set(publishedCards
    .flatMap((card) => card.source_event_ids || [card.triggered_by_event_id])
    .filter(Boolean));
  const publishedAggregationKey = (card) => (
    card.aggregation?.key
    || `${card.company?.entity_id || clean(card.company?.name).toLowerCase()}|${normalizeFundingRound(card.financing?.round_original || card.financing?.round).code}`
  );
  return events.reduce((selection, event) => {
    const aggregationKey = eventAggregationKey(event);
    if (currentEventIds.has(event.event_id)) selection.reused.push(event);
    else if (publishedEventIds.has(event.event_id)
      || (allowAggregationReuse(event) && aggregationKey && publishedCards.some((card) =>
        publishedAggregationKey(card) === aggregationKey && publishedCardMatchesEvent(event, card)))) selection.deduplicated.push(event);
    else selection.pending.push(event);
    return selection;
  }, { pending: [], reused: [], deduplicated: [] });
}

export function checkpointCardMatchesSelection(eventId, selectedEventIds = new Set()) {
  return selectedEventIds.size === 0 || selectedEventIds.has(eventId);
}

export function sameFundingDisclosureForReuse(event, card, claims = []) {
  const amount = normalizeFundingAmount(canonicalFundingEventAmount(event, claims));
  const previous = normalizeFundingAmount(card.financing?.amount_original || card.financing?.amount);
  if (!amount.currency || amount.status === "undisclosed") return false;
  if (!["currency", "status", "value", "min_value", "max_value"].every((key) => amount[key] === previous[key])) return false;
  const date = Date.parse(event.disclosed_at || event.event_time || "");
  const previousDate = Date.parse(card.financing?.announced_at || "");
  return Number.isFinite(date) && Number.isFinite(previousDate) && Math.abs(date - previousDate) <= 3 * 86400000;
}

export function fundingEventAggregationKey(event, bundle, entityIndex = {}) {
  const company = subjectCompanyForEvent(event, bundle.entities, entityIndex, bundle.claims);
  if (!company?.entity_id) return "";
  const claimById = new Map(bundle.claims.map((claim) => [claim.claim_id, claim]));
  const roundEvidence = [
    event.object,
    event.display_title_zh,
    ...(event.claim_refs || []).map((claimId) => claimById.get(claimId)?.source_quote),
  ].filter(Boolean).join(" ");
  return `${company.entity_id}|${normalizeFundingRound(roundEvidence).code}`;
}

function publishedFundingCards(projectRoot, excludedOutput = "") {
  const bundleRoot = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights");
  if (!fs.existsSync(bundleRoot)) return [];
  return fs.readdirSync(bundleRoot)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
    .filter((file) => path.resolve(bundleRoot, file) !== path.resolve(excludedOutput || "__none__"))
    .flatMap((file) => readJson(path.join(bundleRoot, file), { cards: [] }).cards || []);
}

export function recoveryCardsFromGit(ref, outputFile, projectRoot = root) {
  if (!ref) return [];
  const repositoryPath = path.relative(projectRoot, outputFile).replace(/\\/gu, "/");
  if (repositoryPath.startsWith("../") || path.isAbsolute(repositoryPath)) {
    throw new Error(`funding_recovery_output_outside_repository:${repositoryPath}`);
  }
  try {
    const options = {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    };
    const commit = execFileSync("git", ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`], options).trim();
    // First production of a date has no previous card bundle. Only absence in a
    // verified commit is optional; invalid refs, I/O and corrupt data still fail.
    const entry = execFileSync("git", ["ls-tree", "--name-only", commit, "--", repositoryPath], options).trim();
    if (!entry) return [];
    const payload = JSON.parse(execFileSync("git", ["show", `${commit}:${repositoryPath}`], options));
    if (!Array.isArray(payload.cards)) throw new Error("funding_recovery_cards_invalid");
    return payload.cards;
  } catch (error) {
    throw new Error(`funding_recovery_ref_unavailable:${ref}:${error.message}`);
  }
}

function decodeHtml(value = "") {
  const named = new Map([
    ["amp", "&"], ["lt", "<"], ["gt", ">"], ["quot", "\""], ["apos", "'"], ["nbsp", " "],
  ]);
  return String(value || "")
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/giu, (match, name) => named.get(name.toLowerCase()) ?? match);
}

function htmlToText(html = "") {
  return clean(decodeHtml(String(html || "")
    .replace(/<(?:script|style|noscript|svg|template)[^>]*>[\s\S]*?<\/(?:script|style|noscript|svg|template)>/giu, " ")
    .replace(/<br\s*\/?\s*>/giu, "\n")
    .replace(/<\/(?:p|div|li|section|article|h[1-6])>/giu, "\n")
    .replace(/<[^>]+>/gu, " ")));
}

function hostFor(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./u, "").toLowerCase();
  } catch {
    return "";
  }
}

function normalizedUrlKey(url = "") {
  try {
    const parsed = new URL(url);
    return `${hostFor(url)}${parsed.pathname.replace(/\/+$/u, "") || "/"}`.toLowerCase();
  } catch {
    return clean(url).replace(/[?#].*$/u, "").replace(/\/$/u, "").toLowerCase();
  }
}

const secondaryDomains = /(?:^|\.)(?:techcrunch\.com|reuters\.com|bloomberg\.com|forbes\.com|theverge\.com|crunchbase\.com|linkedin\.com|wikipedia\.org|businesswire\.com|prnewswire\.com|globenewswire\.com|36kr\.com)$/iu;

function sourceClass(url, companyName) {
  const host = hostFor(url);
  if (!host || secondaryDomains.test(host)) return "secondary";
  const key = clean(companyName).toLowerCase().replace(/[^a-z0-9]/gu, "");
  const hostKey = host.replace(/[^a-z0-9]/gu, "");
  return key.length >= 4 && (hostKey.includes(key) || key.includes(host.split(".")[0].replace(/[^a-z0-9]/gu, "")))
    ? "official_candidate"
    : "independent";
}

const fundingSearchGateway = createSearchGateway({
  cacheDir: path.join(process.env.GUANLAN_RUNTIME_DIR || path.join(root, "agent-workflow/reports"), "funding-search-cache"),
  maxRequests: Number(args.get("search-request-budget") || 120), timeoutMs: 25000,
});

export function reusableResearchCapture(cached = {}, url = '') {
  const originalCapture = cached.capture_method === 'direct_fetch'
    || (cached.capture_method === 'web_open_excerpt'
      && cached.review?.tool === 'web.run.open'
      && cached.review?.source_url === url
      && Boolean(cached.review?.reviewer)
      && Number.isFinite(Date.parse(cached.review?.reviewed_at)));
  return cached.source_url === url && originalCapture
    && cached.body_clean?.length >= 300
    && cached.content_hash === sourceTextHash(cached.body_clean);
}

async function capturePage(result) {
  const privateCache = args.get("research-seeds") ? path.join(resolvePrivateEvidenceBackupRoot(root, { required: true }), "funding-research", stableId("FISRC", result.url) + ".json") : "";
  if (privateCache && fs.existsSync(privateCache)) {
    const cached = readJson(privateCache, {});
    if (reusableResearchCapture(cached, result.url)) return cached;
  }
  let page;
  try {
    const backupRoot=resolvePrivateEvidenceBackupRoot(root,{required:false});
    const reader=backupRoot?createOriginalReader({directory:path.join(backupRoot,'financing-monitor-state','original-reader'),date}):null;
    page=await readOriginalPage(result.url,{reader,timeoutMs:30000});
  } catch { return null; }
  const title=page.title||result.title,body=page.body,method=page.method==='original_http'?'direct_fetch':page.method;
  const source = {
    source_id: stableId("FISRC", result.url),
    source_url: result.url,
    title,
    publisher: hostFor(result.url),
    source_class: result.source_class,
    capture_method: method,
    captured_at: new Date().toISOString(),
    content_hash: sourceTextHash(body.slice(0, 18000)),
    body_clean: body.slice(0, 18000),
    publication_date_evidence: page.date_evidence,
    links: page.links || [],
  };
  if (privateCache) writeJson(privateCache, source);
  return source;
}

export function canonicalSources(bundle, event) {
  const artifactById = new Map(bundle.sourceArtifacts.map((item) => [item.source_artifact_id, item]));
  const rawByArtifact = new Map(bundle.rawDocuments.map((item) => [item.source_artifact_id, item]));
  const claimsById = new Map((bundle.claims || []).map((item) => [item.claim_id, item]));
  return (event.source_refs || []).map((sourceRef) => {
    const artifact = artifactById.get(sourceRef);
    const raw = rawByArtifact.get(sourceRef);
    const acceptedClaimQuotes = (event.claim_refs || [])
      .map((claimId) => claimsById.get(claimId))
      .filter((claim) => claim?.raw_id === raw?.raw_id
        && claim.claim_type === "funding"
        && claim.verification_status === "accepted"
        && clean(claim.source_quote))
      .map((claim) => clean(claim.source_quote));
    if (!artifact || (!raw?.body_clean && !acceptedClaimQuotes.length)) return null;
    return {
      source_id: stableId("FISRC", artifact.source_url),
      source_url: artifact.source_url,
      title: raw?.title_zh || raw?.title_original || artifact.title || artifact.title_original,
      title_original: raw?.title_original || artifact.title_original,
      publisher: artifact.publisher || hostFor(artifact.source_url),
      source_class: "canonical_event_source",
      capture_method: "data_center_v4_source_artifact",
      captured_at: artifact.captured_at,
      content_hash: artifact.content_hash,
      // Private evidence may be unavailable in the runner, but accepted V4
      // claim spans remain authoritative and are sufficient for citation.
      body_clean: clean(raw?.body_clean || acceptedClaimQuotes.join("\n")).slice(0, 18000),
      source_artifact_id: sourceRef,
      raw_id: raw.raw_id,
    };
  }).filter(Boolean);
}

export function canonicalSourceQuoteBodies(bundle, event, acceptedIntakeDocuments = []) {
  const claimById = new Map((bundle.claims || []).map((claim) => [claim.claim_id, claim]));
  const acceptedFundingClaims = (event.claim_refs || [])
    .map((claimId) => claimById.get(claimId))
    .filter((claim) => claim?.claim_type === "funding" && claim?.verification_status === "accepted")
  const acceptedRawIds = new Set(acceptedFundingClaims.map((claim) => claim.raw_id).filter(Boolean));
  const eventSourceUrls = new Set((bundle.sourceArtifacts || [])
    .filter((artifact) => (event.source_refs || []).includes(artifact.source_artifact_id))
    .map((artifact) => normalizedUrlKey(artifact.source_url || artifact.canonical_url))
    .filter(Boolean));
  const eventSourceArtifactIds = new Set(event.source_refs || []);
  const sourceDocuments = [...(bundle.rawDocuments || []), ...acceptedIntakeDocuments];
  const claimBoundRaw = sourceDocuments.filter((raw) => acceptedRawIds.has(raw.raw_id)
    || eventSourceArtifactIds.has(raw.source_artifact_id)
    || eventSourceUrls.has(normalizedUrlKey(raw.source_url || raw.canonical_url)));
  const normalizedTitleKey = (value) => clean(value).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const titleAnchors = [
    ...acceptedFundingClaims.map((claim) => claim.source_quote),
    event.display_title_zh,
  ].map(normalizedTitleKey).filter((title) => title.length >= 24);
  // V4 events can expose only a short editorial headline while the accepted
  // intake checkpoint retains the full publisher title. Use that short title
  // only when it uniquely identifies one accepted article; ambiguity stays
  // fail-closed below.
  const shortEventTitle = normalizedTitleKey(event.display_title_zh);
  if (shortEventTitle.length >= 5 && shortEventTitle.length < 24) titleAnchors.push(shortEventTitle);
  const titleBoundAcceptedDocuments = new Map();
  for (const titleAnchor of titleAnchors) {
    const titleMatches = acceptedIntakeDocuments.filter((raw) => {
      const documentTitle = normalizedTitleKey(raw.title_original || raw.title_zh);
      return documentTitle.includes(titleAnchor);
    });
    if (titleMatches.length !== 1) continue;
    const raw = titleMatches[0];
    titleBoundAcceptedDocuments.set(raw.raw_id || normalizedUrlKey(raw.source_url || raw.canonical_url), raw);
  }
  const acceptedQuoteAnchors = acceptedFundingClaims
    .map((claim) => normalizedTitleKey(claim.source_quote))
    .filter((quote) => quote.length >= 12);
  for (const quoteAnchor of acceptedQuoteAnchors) {
    const quoteMatches = acceptedIntakeDocuments.filter((raw) => {
      const excerpts = (raw.intake_diagnostics?.key_excerpts || []).map((excerpt) => excerpt.text);
      return [raw.body_clean, ...excerpts]
        .map(normalizedTitleKey)
        .some((sourceText) => sourceText.includes(quoteAnchor));
    });
    if (quoteMatches.length !== 1) continue;
    const raw = quoteMatches[0];
    titleBoundAcceptedDocuments.set(raw.raw_id || normalizedUrlKey(raw.source_url || raw.canonical_url), raw);
  }
  claimBoundRaw.push(...titleBoundAcceptedDocuments.values());
  // The accepted Claim's raw_id is a second canonical path to its source body.
  // During same-day China intake, the accepted article may still live in the
  // intake checkpoint while the V4 RawDocument/source_refs projection is being
  // assembled. Join that excerpt by its raw/artifact ID or exact source URL, or
  // by a unique accepted-intake article whose title contains a full headline or whose
  // excerpt uniquely contains an accepted Claim quote. A short event title is
  // also sufficient only when it binds to exactly one accepted intake article.
  const rawQuotes = claimBoundRaw.flatMap((raw) => [
    raw.body_clean,
    ...(raw.intake_diagnostics?.key_excerpts || []).map((excerpt) => excerpt.text),
  ]);
  return [...new Set([
    ...canonicalSources(bundle, event).map((source) => clean(source.body_clean)),
    ...rawQuotes.map(clean),
  ].filter(Boolean))];
}

export function fundingResearchNameMatches(text, companyName) {
  const normalize = (value) => clean(value).normalize("NFKC").toLowerCase().replace(/\s+/gu, "");
  const name = normalize(companyName);
  const names = [name];
  // A source-bound bilingual name may be shortened in discovery results. This
  // admits a research candidate only, never an entity alias or financing fact.
  if (/\p{Script=Han}/u.test(name) && /\([a-z][a-z0-9 ._-]*\)/iu.test(name)) {
    const chineseName = name.replace(/\([a-z][a-z0-9 ._-]*\)/giu, "");
    if ((chineseName.match(/\p{Script=Han}/gu) || []).length >= 2) names.push(chineseName);
  }
  const lead = normalize(text);
  return names.some((candidate) => candidate.length >= 2 && lead.includes(candidate));
}

function scoreCandidate(result, companyName, identitySubject = "") {
  const text = clean(`${result.title} ${result.url}`).toLowerCase();
  const body = clean(result.provider_body).toLowerCase();
  const name = clean(companyName).toLowerCase();
  const identityKey = clean(identitySubject).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const resultKey = `${text} ${body}`.replace(/[^\p{L}\p{N}]+/gu, "");
  let score = result.source_class === "official_candidate" ? 10 : result.source_class === "secondary" ? 4 : 6;
  if (fundingResearchNameMatches(text, name)) score += 4;
  if (identityKey && resultKey.includes(identityKey)) score += 6;
  if (/\b(?:funding|raises|series|seed|investor|product|customer|case study|about|team|pricing)\b/iu.test(text)) score += 3;
  if (result.intent === "investor_rationale" && body.includes(name) && /\b(?:invest|investment|portfolio)\b/iu.test(body)) score += 5;
  return score;
}

function canonicalResearchProblems(payload, company, sources) {
  const problems = [];
  const canonicalSources = sources.filter((source) => source.source_class === "canonical_event_source");
  const citedSourceIds = referencedSourceIds(payload);
  if (!canonicalSources.some((source) => citedSourceIds.has(source.source_id))) {
    problems.push("canonical_event_source_not_cited");
  }
  const canonicalName = clean(company.canonical_name);
  const fullName = clean(payload.company?.full_name);
  if (
    /^[A-Za-z0-9.&'-]{2,6}$/u.test(canonicalName)
    && fullName
    && fullName.toLowerCase() !== canonicalName.toLowerCase()
    && !canonicalSources.some((source) => source.body_clean.toLowerCase().includes(fullName.toLowerCase()))
  ) {
    problems.push("ambiguous_company_full_name_not_in_canonical_source");
  }
  return problems;
}

export function supplementalQuote(source, company, payload) {
  const body = String(source?.body_clean || "");
  const names = [company?.canonical_name, ...(company?.aliases || []), payload?.company?.full_name, payload?.company?.name]
    .map(clean)
    .filter((value, index, list) => value && list.indexOf(value) === index);
  const fundingSignal = /(?:funding|raised|raises|seed|series|venture funding|\$[\d,.]+|融资|筹集|募资)/iu;
  const productSignal = /(?:AI|platform|product|service|cloud|compute|factory|agent|model|enterprise|manufacturing|数据中心|平台|产品|服务|工厂|算力)/iu;
  for (const name of names) {
    let from = 0;
    while (from < body.length) {
      const index = body.indexOf(name, from);
      if (index < 0) break;
      const start = Math.max(
        body.lastIndexOf(".", index - 1),
        body.lastIndexOf("!", index - 1),
        body.lastIndexOf("?", index - 1),
        body.lastIndexOf("。", index - 1),
        body.lastIndexOf("！", index - 1),
        body.lastIndexOf("？", index - 1),
        body.lastIndexOf("\n", index - 1),
      ) + 1;
      const ends = [".", "!", "?", "。", "！", "？", "\n"]
        .map((marker) => body.indexOf(marker, index + name.length))
        .filter((value) => value >= 0);
      const end = ends.length ? Math.min(...ends) + 1 : Math.min(body.length, index + name.length + 360);
      const quote = body.slice(start, end).trim();
      if (quote.length >= 40 && quote.length <= 500 && (fundingSignal.test(quote) || productSignal.test(quote))) {
        return quote;
      }
      from = index + name.length;
    }
  }
  return "";
}

function ensureSecondSourceEvidence(payload, company, sources) {
  const cited = referencedSourceIds(payload);
  if (cited.size >= 2) return payload;
  for (const source of sources) {
    if (!source?.source_id || cited.has(source.source_id)) continue;
    const quote = supplementalQuote(source, company, payload);
    if (!quote) continue;
    payload.quotes = [
      ...(payload.quotes || []),
      {
        speaker: source.publisher || "source",
        quote,
        evidence_refs: [{ source_id: source.source_id, quote }],
      },
    ];
    return payload;
  }
  return payload;
}

export function modelCorrectionProblem(problem = "") {
  if (["market_subcategory_id_unknown", "market_subcategory_parent_mismatch"].includes(problem)) {
    return `${problem}:analysis.market_subcategory_id must use an exact key in ${JSON.stringify(Object.fromEntries(FUNDING_MARKET_SUBCATEGORY_PARENTS))}; the value is its required market_category_id. Do not copy industry_ids such as legal_services or use_case_ids such as legal_compliance into this field.`;
  }
  if (problem === "physical_ai_product_form_mismatch") {
    return "physical_ai_product_form_mismatch:ai_device_must_choose_a_non_physical_market_category_and_its_valid_subcategory_application_hierarchy";
  }
  return problem;
}

export function domesticFundingResearchQueries(companyName, amountHint, disclosedAt = "") {
  return planFundingResearch({ company: { canonical_name: companyName }, amountHint, event: { disclosed_at: disclosedAt }, chinese: true });
}

async function researchSources(bundle, event, company) {
  const captured = canonicalSources(bundle, event);
  if (args.get("research-seeds")) {
    const manifest = readJson(path.resolve(root, args.get("research-seeds")), null);
    const seeds = reviewedResearchSeeds(manifest, event, company);
    const attempts = [];
    for (const seed of seeds) {
      if (captured.some((source) => normalizedUrlKey(source.source_url) === normalizedUrlKey(seed.url))) continue;
      const source = await capturePage(seed);
      attempts.push({ provider: seed.provider, query: seed.query, url: seed.url, status: source ? "completed" : "failed", error: source ? "" : "original_capture_failed" });
      if (source) captured.push(source);
      if (captured.length >= 8) break;
    }
    return { sources: captured, queries: [...new Set(seeds.map((seed) => seed.query))], attempts };
  }
  const linkedHosts = [...new Set(captured
    .flatMap((source) => source.body_clean.match(/https?:\/\/[^\s<>"')\]]+/giu) || [])
    .map((url) => hostFor(url))
    .filter((host) => host && !secondaryDomains.test(host)))];
  const companyKey = clean(company.canonical_name).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const companyHost = linkedHosts.find((host) => (
    companyKey.length >= 4
    && host.replace(/[^\p{L}\p{N}]+/gu, "").includes(companyKey)
  )) || "";
  const amountHint = canonicalFundingEventAmount(event, bundle.claims);
  const identityHint = clean(captured[0]?.title_original || event.object || event.display_title_zh);
  const describedSubject = clean(identityHint.match(/^(.{2,50}?)(?:\s+开发商|\s+(?:maker|creator|developer)\b)/iu)?.[1]);
  const identitySubject = describedSubject.replace(/([a-z0-9])([A-Z])/gu, "$1 $2");
  // Query language follows the evidenced company name as well as verified
  // market scope. This does not promote an unverified geography to CN.
  const chineseQueries = event.market_scope?.china_market_match === true || /\p{Script=Han}/u.test(company.canonical_name);
  const plan = planFundingResearch({ company, event, amountHint, officialHost: companyHost, chinese: chineseQueries });
  const attempts=[],queries=[],seen=new Set(captured.map(s=>normalizedUrlKey(s.source_url)));
  let captures=0;
  for(const {intent,query} of plan) {
    if(captured.length>=8)break;
    if(fundingResearchCoverage(captured,company)[intent]) { attempts.push({provider:'planner',query,status:'skipped',reason:'accepted_originals_cover_gap'});continue; }
    queries.push(query);
    const start=fundingSearchGateway.attempts.length;
    let found=[];
    try { found=await fundingSearchGateway.search(query,8); }
    catch(error){attempts.push({provider:'gateway',query,status:'failed',error:error.message});}
    attempts.push(...fundingSearchGateway.attempts.slice(start).filter(attempt=>attempt.query===query));
    const candidates=found.map(result=>({...result,intent,query,source_class:sourceClass(result.url,company.canonical_name),discovery_snippet:result.snippet,provider_body:''}))
      .filter(result=>!seen.has(normalizedUrlKey(result.url)))
      .filter(result=>[company.canonical_name,...(company.aliases||[])].some(name=>fundingResearchNameMatches(result.title+' '+result.discovery_snippet,name)) || result.source_class==='official_candidate')
      .sort((a,b)=>scoreCandidate(b,company.canonical_name,identitySubject)-scoreCandidate(a,company.canonical_name,identitySubject));
    let added=0;
    for(const result of candidates) {
      if(captures>=24||captured.length>=8||added>=2)break;
      captures++;seen.add(normalizedUrlKey(result.url));
      const source=await capturePage(result);
      if(!source) {attempts.push({provider:'original',url:result.url,status:'failed',reason:'original_capture_failed'});continue;}
      if(![company.canonical_name,...(company.aliases||[])].some(name=>fundingResearchNameMatches(source.body_clean,name))) {attempts.push({provider:'original',url:result.url,status:'excluded',reason:'company_not_in_original'});continue;}
      captured.push(source);added++;
    }
  }
  return {sources:captured,queries,attempts,independent_source_count:independentResearchSources(captured).length,coverage:fundingResearchCoverage(captured,company)};
}

function directionManifest() {
  const file = path.join(root, "01-SiteV2/site/data/opportunity-evidence-v2.json");
  return (readJson(file, {})?.directionCards || []).map((card) => ({ id: card.id, title: card.title }));
}

export function promptFor(event, company, sources, directions) {
  const sourceText = sources.map((source) => [
    `SOURCE_ID: ${source.source_id}`,
    `SOURCE_URL: ${source.source_url}`,
    `SOURCE_CLASS: ${source.source_class}`,
    `TITLE: ${source.title}`,
    `BODY: ${source.body_clean}`,
  ].join("\n")).join("\n\n---\n\n");
  return [
    "你是观澜AI融资透视研究员。只使用下方已抓取SOURCE正文，不得使用模型记忆、搜索摘要或常识补写事实。",
    "任务：基于一个已验证融资事件，完成公司、产品、投资方、客户、关键数据、竞争比较和投资逻辑的结构化二次研究。投资方必须明确列出；无法从来源确认投资方时，返回空数组，系统会阻止发布。",
    "每个事实对象必须附evidence_refs。quote必须逐字复制SOURCE正文中的连续短片段，不得改写。缺失信息用空字符串或空数组，不得猜测。",
    "除公司、产品、人名、金额、轮次等专有名词外，summary、description、use_case、比较字段、sector、capital_judgment、risks等面向读者的内容必须使用简体中文。",
    "financing.amount写round所覆盖轮次的金额；若round同时覆盖多轮，则写多轮合计。total_raised写截至本次披露的累计融资额，不得混用。",
    "financing.investors只列本轮明确披露且有具体名称的投资方，role必须用中文标注“本轮领投”“本轮联合领投”或“本轮参投”。历史轮次、既有但未确认本轮继续参与、轮次语境不明的投资方不得混入investors，改放other_round_investors并保留原始轮次语境。若来源确认发生融资但只写基金、产业资本等泛称而未披露具体名称，返回空investors并将investor_disclosure_status设为not_disclosed；不得把泛称伪造成机构名称。若列出具体投资方则设为disclosed。",
    "当规范事件来源使用“投资者包括”“参与投资的机构包括”等措辞列出具体名称时，这些名称属于本轮投资方，必须逐一写入financing.investors并引用该完整原句；不得误放到other_round_investors或遗漏。机构名或个人姓名必须是明确专名；“某集团创始人”等只有职务、未披露自然人姓名的描述不得作为investors.name或投资关系实体，只保留在原文证据引文中，不得推测姓名。",
    "comparisons是应用层比较集合，不代表事实关系。只收录来源明确支持具体产品或方案、应用场景、目标客户、融资信息或商业路径的竞品；如果来源只说“同类公司”或“起点不同”，不要输出该条。product写具体产品或方案，scenario写具体工作流，缺失融资金额时funding_summary留空；core_difference必须逐字段比较已经证实的差异，不得写“起点不同”“各有优势”等机械句式。",
    "analysis.investment_rationale只收录本轮投资机构或其投资人的公开原话。institution必须与financing.investors中的机构名一致；speaker和speaker_role写公开归属；rationale用中文概括机构为何投资；quote逐字复制机构或投资人原文。没有机构原话时返回空数组，不得用公司创始人、媒体或模型判断冒充。",
    "金额和承诺主体必须精确归属：客户的基础设施投资计划、采购预算或建设投入，不得改写为被提及供应商的合同金额、收入、订单或保底现金流；只有来源明确披露交易双方及已签合同/收入时才可这样描述。媒体推断必须标成媒体分析，不得写作投资方或公司公开陈述。",
    "analysis.capital_judgment必须回答资本押注的核心变量、当前估值或融资所依赖的已验证信号，以及判断的证据边界；不得使用“知名机构参与表明看好”“商业化前景广阔”等空泛模板。validated_signals只写来源已验证的业务信号。risks至少一项，用于约束资本判断，不单独扩展成问题清单。",
    "analysis.product_form_id必须选择公司主要面向客户或用户提供的一种核心产品形态。先判断客户实际购买或用户直接使用什么，再判断交付界面；不得因为产品采用某种模型、芯片、机器人或安全技术，或者计划进入某个行业，就把底层技术或未来场景当成主分类。允许值：model、model_api_service、developer_tool、end_user_application、enterprise_software_platform、ai_infrastructure_software、security_software、ai_device、robotic_system、chip_accelerator、ai_compute_system、compute_cloud_service。",
    "若具身智能公司的当前核心交付是VLA模型、软件栈或工具链，而不是完整机器人本体，product_form_id应使用model或ai_infrastructure_software，market_category_id应使用infrastructure_compute；只有交付完整机器人、车辆或自主机器系统时才使用robotic_system与physical_ai。",
    "analysis.taxonomy_version固定为TAG-V4.1。analysis.market_category_id采用CB Insights AI 100 2026四类框架：infrastructure_compute、enterprise_applications、industry_applications、physical_ai。只有当前产品是实际作用于物理世界的机器人、车辆或自主机器时才用physical_ai；世界模型或未来机器人计划不算。基础模型、数据、开发部署、芯片算力、可观测评估和模型安全属于infrastructure_compute。跨行业企业职能属于enterprise_applications；围绕单一行业专业数据、监管或工作流的产品属于industry_applications。",
    "analysis.market_subcategory_id必须与市场母类一致：基础设施与算力使用data、development_deployment、hardware_computing或observability_evaluation；企业级应用使用customer_support、cyber_physical_security、hr、marketing、productivity_enterprise_workflows、sales或software_development_coding；行业应用使用financial_services、healthcare_life_sciences、industrials、legal或consumer_retail；Physical AI留空。基础设施与算力还必须填写analysis.market_application_id，允许值为synthetic_data、data_preparation_curation、vector_databases、models、ai_development_orchestration、model_deployment、monetization、chips、servers、computing_infrastructure、ai_observability_governance、model_agent_security、fine_tuning、llm_benchmarking_routing；其他母类留空。",
    "analysis.use_case_ids、industry_ids和target_user_ids只在来源支持时填写。industry_ids不得把technology或software当成默认行业；target_user_ids至少一项。",
    `analysis.use_case_ids only accepts these exact IDs: ${JSON.stringify([...FUNDING_USE_CASE_IDS])}.`,
    `analysis.industry_ids only accepts these exact IDs: ${JSON.stringify([...FUNDING_INDUSTRY_IDS])}. Use [] when no industry is source-supported.`,
    `analysis.target_user_ids only accepts these exact IDs and must contain at least one item: ${JSON.stringify([...FUNDING_TARGET_USER_IDS])}.`,
    "related_direction_id只能从DIRECTION_OPTIONS选择；没有合适方向时返回空字符串。",
    "返回一个JSON对象，不要代码围栏。Schema:",
    "Whole-card evidence rule: cite at least two distinct SOURCE_ID values. Prefer the canonical funding source plus a captured company, investor, or credible independent source. Never add an irrelevant citation merely to reach two sources.",
    "The CANONICAL_FUNDING_EVENT and every SOURCE_CLASS=canonical_event_source are authoritative. The card must describe that exact company and event, must cite a canonical event source, and must never switch to a same-name company. financing.amount and financing.announced_at are fixed from the canonical event; contradictory search results must be discarded.",
    "An AI interface, wearable, headset, or other user-operated AI device is product_form_id=ai_device, not robotic_system. It must not use market_category_id=physical_ai unless the current product is itself an autonomous robot, vehicle, or machine that senses, decides, and acts in the physical world.",
    "Keep the JSON concise: at most 3 products, 5 customers, 5 comparisons, 8 metrics, 5 quotes, and 5 investment-rationale items. Omit an optional item instead of returning a partial object.",
    JSON.stringify({
      company: {
        full_name: "string",
        website: "string",
        summary: "string",
        headquarters: "string",
        founders: [{ name: "string", role: "string", evidence_refs: [{ source_id: "string", quote: "string" }] }],
        team_size: { value: "string", observed_at: "YYYY-MM-DD|string", evidence_refs: [{ source_id: "string", quote: "string" }] },
        evidence_refs: [{ source_id: "string", quote: "string" }],
      },
      financing: {
        round: "string",
        amount: "string",
        total_raised: "string",
        announced_at: "YYYY-MM-DD|string",
        investor_disclosure_status: "disclosed|not_disclosed",
        investors: [{ name: "string", role: "lead|participant|string", evidence_refs: [{ source_id: "string", quote: "string" }] }],
        other_round_investors: [{ name: "string", role: "string", evidence_refs: [{ source_id: "string", quote: "string" }] }],
        evidence_refs: [{ source_id: "string", quote: "string" }],
      },
      products: [{
        name: "string",
        description: "string",
        target_customers: "string",
        features: ["string"],
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      customers: [{
        name: "string",
        industry: "string",
        use_case: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      comparisons: [{
        name: "string",
        product: "string",
        scenario: "string",
        target_customer: "string",
        funding_summary: "string",
        core_difference: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      metrics: [{
        label: "string",
        value: "string",
        observed_at: "YYYY-MM-DD|string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      quotes: [{
        speaker: "string",
        quote: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      analysis: {
        investment_rationale: [{
          institution: "string",
          speaker: "string",
          speaker_role: "string",
          rationale: "string",
          quote: "exact source quote",
          evidence_refs: [{ source_id: "string", quote: "string" }],
        }],
        capital_judgment: "string",
        validated_signals: ["string"],
        risks: ["string"],
        related_direction_id: "string",
        taxonomy_version: "TAG-V4.1",
        product_form_id: "model|model_api_service|developer_tool|end_user_application|enterprise_software_platform|ai_infrastructure_software|security_software|ai_device|robotic_system|chip_accelerator|ai_compute_system|compute_cloud_service",
        market_category_id: "infrastructure_compute|enterprise_applications|industry_applications|physical_ai",
        market_subcategory_id: "string",
        market_application_id: "string",
        use_case_ids: ["string"],
        industry_ids: ["string"],
        target_user_ids: ["string"],
        sector: "string",
      },
    }),
    `CANONICAL_FUNDING_EVENT:\n${JSON.stringify({
      event_id: event.event_id,
      title: event.display_title_zh,
      event_time: event.event_time,
      action: event.action,
      object: event.object,
      metrics: event.metrics,
      company_entity_id: company.entity_id,
      company_name: company.canonical_name,
    })}`,
    `DIRECTION_OPTIONS:\n${JSON.stringify(directions)}`,
    `CAPTURED_SOURCES:\n${sourceText}`,
  ].join("\n\n");
}

function publicSource(source) {
  return {
    source_id: source.source_id,
    source_url: source.source_url,
    title: source.title,
    publisher: source.publisher,
    source_class: source.source_class,
    capture_method: source.capture_method,
    captured_at: source.captured_at,
    content_hash: source.content_hash,
    source_artifact_id: source.source_artifact_id || null,
    raw_id: source.raw_id || null,
  };
}

function linkObject(kind, relationType, item, resolver) {
  const allowed = kind === "product" ? ["产品/服务"] : kind === "person" ? ["人物"] : ["公司/机构"];
  const resolved = resolver(item.name, allowed);
  return {
    relation_type: relationType,
    target_kind: kind,
    research_name: item.name,
    canonical_entity_id: resolved?.id || null,
    canonical_name: resolved?.name || "",
    evidence_refs: item.evidence_refs || [],
  };
}

export function fundingHistory(companyId, projectRoot = root) {
  const dataRoot = path.join(projectRoot, "01-SiteV2/content/11-databases/data-center-v4");
  const seen = new Set();
  const history = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true }).sort((a, b) => b.name.localeCompare(a.name))) {
    if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/u.test(entry.name)) continue;
    const events = readJson(path.join(dataRoot, entry.name, "canonical-events.json"), []);
    const claims = readJson(path.join(dataRoot, entry.name, "claims.json"), []);
    const entities = readJson(path.join(dataRoot, entry.name, "entities.json"), []);
    for (const event of events) {
      if (seen.has(event.event_id)) continue;
      seen.add(event.event_id);
      if (event.event_type !== "funding" || !(event.entities || []).includes(companyId)) continue;
      // Mentioned investors, comparisons and uncompleted rounds are not this
      // company's financing history. Use the same subject/amount admission.
      const subject = subjectCompanyForEvent(event, entities, {}, claims);
      const entity = entities.find((item) => item.entity_id === companyId);
      const nameKey = (name) => clean(name).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
      const names = new Set([entity?.canonical_name, ...(entity?.aliases || [])].map(nameKey).filter(Boolean));
      const subjectBound = claims.some((claim) => (event.claim_refs || []).includes(claim.claim_id)
        && claim.claim_type === "funding" && claim.verification_status === "accepted"
        && names.has(nameKey(claim.subject)));
      if (!isEligibleFundingInsightEvent(event, claims) || subject?.entity_id !== companyId
        || !subjectBound || !names.has(nameKey(subject.canonical_name))) continue;
      history.push({
        event_id: event.event_id,
        date: String(event.event_time || event.disclosed_at || "").slice(0, 10),
        title: event.display_title_zh,
        amount: canonicalFundingEventAmount(event, claims),
        source_refs: event.source_refs || [],
      });
    }
  }
  return history.sort((left, right) => right.date.localeCompare(left.date));
}

function buildCard(event, company, payload, sources, result, resolver, entityIndex, entityDecisions, companyIdentityReview) {
  const founders = (payload.company.founders || []).map((founder) => {
    const resolved = resolver(founder.name, ["人物"]);
    return { ...founder, entity_id: resolved?.id || null };
  });
  const investors = payload.financing.investors.map((investor) => {
    const resolved = resolver(investor.name, ["公司/机构"]);
    return { ...investor, entity_id: resolved?.id || null };
  });
  const products = payload.products.map((product) => {
    const resolved = resolver(product.name, ["产品/服务"]);
    return { ...product, entity_id: resolved?.id || null };
  });
  const entityLinks = [
    ...products.map((item) => linkObject("product", "product_of", item, resolver)),
    ...founders.map((item) => linkObject("person", "founded_by", item, resolver)),
    ...investors.map((item) => linkObject("organization", "invested_in_round", item, resolver)),
    ...(payload.customers || []).map((item) => linkObject("organization", "public_customer_case", item, resolver)),
    ...(payload.comparisons || []).map((item) => linkObject("organization", "compared_with", item, resolver)),
  ];
  const publishedAt = result.generatedAt;
  return normalizeFundingInsightCard({
    schema_version: FUNDING_INSIGHT_VERSION,
    funding_insight_id: stableId("FI", event.event_id),
    triggered_by_event_id: event.event_id,
    as_of_date: date,
    company: {
      entity_id: company.entity_id,
      name: company.canonical_name,
      full_name: payload.company.full_name,
      website: payload.company.website,
      summary: payload.company.summary,
      headquarters: payload.company.headquarters,
      founders,
      team_size: payload.company.team_size || {},
      evidence_refs: payload.company.evidence_refs,
    },
    financing: {
      round: payload.financing.round,
      amount: payload.financing.amount,
      total_raised: payload.financing.total_raised,
      announced_at: payload.financing.announced_at,
      investor_disclosure_status: payload.financing.investor_disclosure_status,
      investors,
      other_round_investors: payload.financing.other_round_investors || [],
      evidence_refs: payload.financing.evidence_refs,
    },
    products,
    customers: payload.customers || [],
    comparisons: payload.comparisons || [],
    metrics: payload.metrics || [],
    quotes: payload.quotes || [],
    analysis: payload.analysis,
    entity_links: entityLinks,
    funding_history: fundingHistory(company.entity_id),
    research_sources: sources.filter((source) => referencedSourceIds(payload).has(source.source_id)).map(publicSource),
    model_provenance: {
      provider: result.provider,
      model: result.model,
      attempts: result.attempts,
      prompt_version: FUNDING_INSIGHT_PROMPT_VERSION,
      generated_at: result.generatedAt,
    },
    auto_publish_gate: {
      passed: true,
      problems: [],
      gate_version: FUNDING_INSIGHT_GATE_VERSION,
    },
    publication_status: "auto_published",
    published_at: publishedAt,
  }, entityIndex, entityDecisions, companyIdentityReview);
}

async function processEvent(bundle, event, entityIndex, entityDecisions, companyIdentityReview) {
  const acceptedIntake = readJson(
    path.join(root, "agent-workflow/reports/china-funding", bundle.date, "accepted-intake.json"),
    { raw_documents: [] },
  );
  const eventSourceQuotes = canonicalSourceQuoteBodies(bundle, event, acceptedIntake.raw_documents || []);
  const company = subjectCompanyForEvent(event, bundle.entities, entityIndex, bundle.claims, eventSourceQuotes);
  const sourceResolutionDiagnostics = () => {
    const claimById = new Map((bundle.claims || []).map((claim) => [claim.claim_id, claim]));
    const eventClaims = (event.claim_refs || []).map((claimId) => claimById.get(claimId)).filter(Boolean);
    const acceptedClaimRawIds = new Set(eventClaims
      .filter((claim) => claim.claim_type === "funding" && claim.verification_status === "accepted")
      .map((claim) => claim.raw_id).filter(Boolean));
    const eventSourceRefs = new Set(event.source_refs || []);
    const normalizeText = (value) => clean(value).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
    const eventTitle = normalizeText(event.display_title_zh);
    return {
      event_title: clean(event.display_title_zh),
      event_source_refs: [...eventSourceRefs],
      event_claim_refs: [...(event.claim_refs || [])],
      event_entities: (event.entities || []).map((entityId) => {
        const entity = (bundle.entities || []).find((candidate) => candidate.entity_id === entityId);
        return { entity_id: entityId, canonical_name: entity?.canonical_name || "" };
      }),
      event_metrics: event.metrics || [],
      accepted_funding_claims: eventClaims
        .filter((claim) => claim.claim_type === "funding" && claim.verification_status === "accepted")
        .map((claim) => ({
          claim_id: claim.claim_id,
          raw_id: claim.raw_id || "",
          subject: claim.subject || "",
          object: claim.object || "",
          source_quote_length: normalizeText(claim.source_quote).length,
        })),
      intake_documents: (acceptedIntake.raw_documents || []).map((raw) => {
        const title = normalizeText(raw.title_original || raw.title_zh);
        const excerpts = (raw.intake_diagnostics?.key_excerpts || []).map((excerpt) => normalizeText(excerpt.text));
        const quoteAnchors = eventClaims
          .filter((claim) => claim.claim_type === "funding" && claim.verification_status === "accepted")
          .map((claim) => normalizeText(claim.source_quote)).filter((quote) => quote.length >= 12);
        return {
          raw_id: raw.raw_id || "",
          source_artifact_id: raw.source_artifact_id || "",
          title: clean(raw.title_original || raw.title_zh).slice(0, 180),
          matched_by_claim_raw_id: acceptedClaimRawIds.has(raw.raw_id),
          matched_by_event_source_ref: eventSourceRefs.has(raw.source_artifact_id),
          matched_by_event_title: eventTitle.length >= 5 && title.includes(eventTitle),
          matched_by_claim_quote: quoteAnchors.some((anchor) => [raw.body_clean, ...excerpts]
            .map(normalizeText).some((sourceText) => sourceText.includes(anchor))),
        };
      }),
      source_quote_count: eventSourceQuotes.length,
      resolved_company: company?.canonical_name || "",
    };
  };
  if (!company) return {
    event_id: event.event_id,
    status: "blocked",
    problems: ["subject_company_unresolved"],
    source_resolution: sourceResolutionDiagnostics(),
  };
  const research = await researchSources(bundle, event, company);
  if (research.sources.length < 2 || independentResearchSources(research.sources).length < 2) {
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "blocked",
      problems: [research.sources.length < 2 ? "research_sources_insufficient" : "research_independent_sources_insufficient"],
      source_resolution: sourceResolutionDiagnostics(),
      queries: research.queries,
      attempts: research.attempts,
    };
  }
  const directions = directionManifest();
  try {
    let acceptedPayload = null;
    const result = await deepSeekJsonCompletion({
      model,
      messages: [
        { role: "system", content: "输出严格受来源正文约束的融资项目研究JSON；事实必须逐项引用原文，缺失时留空。" },
        { role: "user", content: promptFor(event, company, research.sources, directions) },
      ],
      maxTokens: Math.max(9000, Math.min(16000, Number(args.get("max-output-tokens") || 9000))),
      temperature: 0.1,
      timeoutMs: 180000,
      validate: (payload) => {
        acceptedPayload = sanitizeResearchPayload(payload, research.sources);
        ensureNamedCompanyEvidence(acceptedPayload, company, research.sources);
        ensureCanonicalFundingEvidence(acceptedPayload, bundle, event, research.sources);
        ensureSecondSourceEvidence(acceptedPayload, company, research.sources);
        return [
          ...researchPayloadProblems(acceptedPayload, research.sources, directions.map((item) => item.id)),
          ...canonicalResearchProblems(acceptedPayload, company, research.sources),
        ].map(modelCorrectionProblem);
      },
    });
    const payload = acceptedPayload || sanitizeResearchPayload(result.payload, research.sources);
    ensureNamedCompanyEvidence(payload, company, research.sources);
    ensureCanonicalFundingEvidence(payload, bundle, event, research.sources);
    ensureSecondSourceEvidence(payload, company, research.sources);
    const card = buildCard(
        event,
        company,
        payload,
        research.sources,
        result,
        entityResolver(entityIndex),
        entityIndex,
        entityDecisions,
        companyIdentityReview,
      );
    const cardProblems = [
      ...fundingInsightProblems(card),
      ...fundingEventCardConsistencyProblems(card, event, bundle.claims, bundle.entities),
    ];
    if (cardProblems.length) {
      return {
        event_id: event.event_id,
        company_name: company.canonical_name,
        status: "blocked",
        problems: [...new Set(cardProblems)],
        queries: research.queries,
        attempts: research.attempts,
      };
    }
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "auto_published",
      card,
      queries: research.queries,
      attempts: research.attempts,
    };
  } catch (error) {
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "blocked",
      problems: [clean(error.message)],
      queries: research.queries,
      attempts: research.attempts,
    };
  }
}

async function mapConcurrent(items, worker, size) {
  const outputItems = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      outputItems[index] = await worker(items[index]);
      console.log(JSON.stringify({
        progress: `${index + 1}/${items.length}`,
        event_id: items[index].event_id,
        status: outputItems[index].status,
      }));
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return outputItems;
}

async function main() {
  if (!date) throw new Error("funding_insight_date_missing");
  const bundle = loadDailyBundle(root, date);
  const entityIndex = readJson(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const entityDecisions = readJson(
    path.join(root, "01-SiteV2/content/12-applications/funding-insights/entity-link-decisions.json"),
    {},
  );
  const companyIdentityReview = readJson(
    path.join(root, "01-SiteV2/content/12-applications/funding-insights/company-identity-decisions.json"),
    {},
  );
  const existing = readJson(output, { cards: [], queue: [] });
  const eventById = new Map(bundle.events.map((event) => [event.event_id, event]));
  const amountKey = (value) => clean(value).toLowerCase()
    .replace(/\bmillions?\b/gu, "m")
    .replace(/\bbillions?\b/gu, "b")
    .replace(/[\s,]/gu, "");
  const existingByEvent = new Map((existing.cards || [])
    .map((card) => {
      const repaired = structuredClone(card);
      ensureCanonicalFundingEvidence(
        repaired,
        bundle,
        eventById.get(repaired.triggered_by_event_id),
        [],
      );
      return normalizeFundingInsightCard(repaired, entityIndex, entityDecisions, companyIdentityReview);
    })
    .filter((card) => fundingInsightProblems(card).length === 0)
    .filter((card) => (card.research_sources || []).some((source) => source.source_class === "canonical_event_source"))
    .filter((card) => {
      const event = eventById.get(card.triggered_by_event_id);
      const canonicalAmount = canonicalFundingEventAmount(event, bundle.claims);
      const eventAmount = normalizeFundingAmount(canonicalAmount);
      return !canonicalAmount
        || !eventAmount.currency
        || amountKey(card.financing?.amount) === amountKey(canonicalAmount);
    })
    .filter((card) => fundingEventCardConsistencyProblems(
      card,
      eventById.get(card.triggered_by_event_id),
      bundle.claims,
      bundle.entities,
    ).length === 0)
    .map((card) => [card.triggered_by_event_id, card]));
  const recoveredCards = recoveryCardsFromGit(recoverFromGitRef, output)
    .map((card) => {
      const repaired = structuredClone(card);
      ensureCanonicalFundingEvidence(
        repaired,
        bundle,
        eventById.get(repaired.triggered_by_event_id),
        [],
      );
      return normalizeFundingInsightCard(repaired, entityIndex, entityDecisions, companyIdentityReview);
    })
    .filter((card) => fundingInsightProblems(card).length === 0)
    .filter((card) => fundingEventCardConsistencyProblems(
      card,
      eventById.get(card.triggered_by_event_id),
      bundle.claims,
      bundle.entities,
    ).length === 0);
  for (const card of recoveredCards) {
    if (!existingByEvent.has(card.triggered_by_event_id)) existingByEvent.set(card.triggered_by_event_id, card);
  }
  const checkpointDir = args.get("checkpoint-dir") ? path.resolve(root, args.get("checkpoint-dir")) : "";
  if (checkpointDir && fs.existsSync(checkpointDir)) for (const file of fs.readdirSync(checkpointDir).filter((name) => /^EV-[a-f0-9]+\.json$/u.test(name))) {
    const result = readJson(path.join(checkpointDir, file), {});
    const card = result.card;
    const event = eventById.get(result.event_id);
    if (!card || !event || card.triggered_by_event_id !== event.event_id
      || !checkpointCardMatchesSelection(event.event_id, eventIds)
      || existingByEvent.has(event.event_id)) continue;
    const normalized = normalizeFundingInsightCard(card, entityIndex, entityDecisions, companyIdentityReview);
    if (!fundingInsightProblems(normalized).length && !fundingEventCardConsistencyProblems(normalized, event, bundle.claims, bundle.entities).length) existingByEvent.set(event.event_id, normalized);
  }
  // Keep eligibility in lockstep with the inspector: a verified announced
  // disclosure is publishable even before the event is marked completed.
  let eligibleEvents = bundle.events.filter((event) => isEligibleFundingInsightEvent(event, bundle.claims));
  const eligibleEventIds = new Set(eligibleEvents.map((event) => event.event_id));
  const missingEventIds = [...eventIds].filter((id) => !eligibleEventIds.has(id));
  if (missingEventIds.length) throw new Error(`funding_event_not_found:${missingEventIds.join(",")}`);
  const events = eligibleEvents;
  let selectedEvents = eventIds.size
    ? eligibleEvents.filter((event) => eventIds.has(event.event_id))
    : events;
  if (args.get("market-region") === "CN") selectedEvents = selectedEvents.filter((event) => event.market_scope?.china_market_match === true);
  if (args.get("reuse-only") === "true") selectedEvents = selectedEvents.filter((event) => existingByEvent.has(event.event_id));
  const publicationReview = readJson(path.join(root, "01-SiteV2/content/12-applications/funding-insights/publication-review.json"), null);
  selectedEvents = selectedEvents.filter(event => !publicationHold({ triggered_by_event_id: event.event_id }, publicationReview));
  if (limit) {
    selectedEvents = selectedEvents.slice(0, limit);
  }
  const historySourceIds = new Set(readJson(path.join(root, "01-SiteV2/content/11-databases/data-center-v4", date, "historical-funding-authorization.json"), {}).source_refs || []);
  const generationSelection = selectFundingEventsForGeneration(selectedEvents, {
    currentCards: [...existingByEvent.values()],
    publishedCards: publishedFundingCards(root, output),
    force,
    eventAggregationKey: (event) => fundingEventAggregationKey(event, bundle, entityIndex),
    // Historical rounds need their own evidence and disclosure references.
    // A company/round label alone does not establish that this is the old event.
    allowAggregationReuse: (event) => !(event.source_refs || []).some((id) => historySourceIds.has(id)),
    // An additional seed investment is not the old seed round merely because
    // company and round match. Missing or changed amount/date requires research.
    publishedCardMatchesEvent: (event, card) => sameFundingDisclosureForReuse(event, card, bundle.claims),
  });
  const pending = generationSelection.pending;
  if (!write) {
    console.log(JSON.stringify({
      ok: true,
      mode: "dry-run",
      date,
      eligible_funding_events: eligibleEvents.length,
      funding_events: events.length,
      selected_events: selectedEvents.length,
      selected_only: selectedOnly,
      reused: generationSelection.reused.length,
      deduplicated: generationSelection.deduplicated.length,
      pending: pending.length,
      pending_event_ids: pending.map((event) => event.event_id),
      recovered_from_git: recoveredCards.length,
      search_gateway: fundingSearchGateway.status(),
      providers: {
        tavily: Boolean(process.env.TAVILY_API_KEY) && process.env.TAVILY_DISABLED !== "true",
        exa: Boolean(process.env.EXA_API_KEY),
        deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
      },
    }, null, 2));
    return;
  }
  if (pending.length && !process.env.DEEPSEEK_API_KEY) {
    throw new Error("deepseek_key_missing_for_funding_insight");
  }
  // The shared gateway supports configured providers and a bounded free RSS fallback.
  // Provider health is decided by the actual response, not a two-key legacy preflight.
  const results = pending.length
    ? await mapConcurrent(
      pending,
      async (event) => {
        const result = await processEvent(bundle, event, entityIndex, entityDecisions, companyIdentityReview);
        if (checkpointDir) writeJson(path.join(checkpointDir, `${event.event_id}.json`), result);
        return result;
      },
      concurrency,
    )
    : [];
  for (const result of results) {
    if (result.card) existingByEvent.set(result.event_id, result.card);
    else if (force && existingByEvent.has(result.event_id)) result.retained_existing = true;
  }
  const queueByEvent = new Map((existing.queue || []).map((item) => [item.event_id, item]));
  for (const event of generationSelection.reused) {
    const card = existingByEvent.get(event.event_id);
    queueByEvent.set(event.event_id, {
      ...(queueByEvent.get(event.event_id) || {}),
      event_id: event.event_id,
      company_name: card?.company?.name || "",
      status: "auto_published",
      problems: [],
      queries: queueByEvent.get(event.event_id)?.queries || [],
      attempts: queueByEvent.get(event.event_id)?.attempts || [],
      updated_at: new Date().toISOString(),
    });
  }
  for (const event of generationSelection.deduplicated) {
    queueByEvent.set(event.event_id, {
      event_id: event.event_id,
      company_name: "",
      status: "deduplicated",
      problems: [],
      queries: [],
      attempts: [],
      updated_at: new Date().toISOString(),
    });
  }
  for (const result of results) {
    if (result.retained_existing) continue;
    queueByEvent.set(result.event_id, {
      event_id: result.event_id,
      company_name: result.company_name || "",
      status: result.status,
      problems: result.problems || [],
      queries: result.queries || [],
      attempts: result.attempts || [],
      updated_at: new Date().toISOString(),
    });
  }
  const cards = [...existingByEvent.values()]
    .filter((card) => events.some((event) => event.event_id === card.triggered_by_event_id))
    .filter((card) => fundingInsightProblems(card).length === 0)
    .filter((card) => fundingEventCardConsistencyProblems(
      card,
      eventById.get(card.triggered_by_event_id),
      bundle.claims,
      bundle.entities,
    ).length === 0)
    .sort((left, right) => right.published_at.localeCompare(left.published_at));
  const queue = events.map((event) => queueByEvent.get(event.event_id)
    || {
      event_id: event.event_id,
      company_name: "",
      status: existingByEvent.has(event.event_id) ? "auto_published" : "pending",
      problems: [],
      queries: [],
      attempts: [],
      updated_at: "",
    });
  // Keep the audit reason after a factual rebuild withdraws a former candidate.
  for (const event of bundle.events.filter((item) => fundingTrancheDisclosureNeedsReview(item, bundle.claims) || fundingCombinedRoundsNeedReview(item, bundle.claims))) {
    queue.push({
      ...(queueByEvent.get(event.event_id) || {}),
      event_id: event.event_id,
      status: "blocked",
      problems: [fundingTrancheDisclosureNeedsReview(event, bundle.claims) ? "funding_capped_tranche_requires_review" : "funding_combined_rounds_requires_review"],
    });
  }
  // It stays outside generation and public cards on every subsequent retry.
  for (const item of existing.queue || []) {
    if (eventById.get(item.event_id)?.event_status !== "withdrawn") continue;
    queue.push({ ...item, status: "blocked", problems: ["funding_event_not_completed"] });
  }
  const value = {
    meta: {
      schema_version: FUNDING_INSIGHT_VERSION,
      date,
      generated_at: new Date().toISOString(),
      trigger: "accepted_financing_event_research",
      research_provider: args.get("research-seeds") ? "reviewed-discovery+direct-fetch+deepseek" : "search-gateway+direct-original+deepseek",
      model,
      human_review_required: false,
      auto_publish_gate: FUNDING_INSIGHT_GATE_VERSION,
      counts: {
        funding_events: queue.length,
        auto_published: cards.length,
        blocked: queue.filter((item) => item.status === "blocked").length,
        pending: queue.filter((item) => item.status === "pending").length,
        deduplicated: queue.filter((item) => item.status === "deduplicated").length,
      },
    },
    cards,
    queue,
  };
  writeJson(output, value);
  console.log(JSON.stringify({
    ok: true,
    mode: "write",
    output: path.relative(root, output).replace(/\\/gu, "/"),
    reused: generationSelection.reused.length,
    deduplicated: generationSelection.deduplicated.length,
    processed: pending.length,
    recovered_from_git: recoveredCards.length,
    counts: value.meta.counts,
  }, null, 2));
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
