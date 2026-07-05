#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const trialStart = args.get("trial-start") || "";
const trialDays = Number.parseInt(args.get("trial-days") || "0", 10);
const writePrompts = ["true", "1", "yes", "on"].includes(String(args.get("write-prompts") || "true").toLowerCase());

const dataPaths = {
  business: "01-SiteV2/site/data/v3-data-observation-desk.json",
  firstLine: "01-SiteV2/site/data/follow-builders-daily.json",
  community: "01-SiteV2/site/data/community-intelligence.json",
  reportsCenter: "01-SiteV2/site/data/intelligence-graph-index.json",
};

const allowedBusinessCategories = new Set(["product_service", "funding", "case"]);
const socialHosts = ["x.com", "twitter.com", "linkedin.com", "reddit.com", "news.ycombinator.com", "facebook.com"];
const placeholderTitlePattern = /original AI event|use case seen in original|purpose see original|linkedin financing|github original title|source-domain|materials show|worth watching|points to/iu;

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateValue);
}

function addDays(yyyyMmDd, days) {
  const parsed = new Date(`${yyyyMmDd}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return shanghaiDate(parsed);
}

function inTrialWindow() {
  if (!trialStart || !Number.isFinite(trialDays) || trialDays <= 0) return true;
  const trialEnd = addDays(trialStart, trialDays - 1);
  return date >= trialStart && date <= trialEnd;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(relativePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
  } catch {
    return fallback;
  }
}

function hostOf(value) {
  try {
    return new URL(value).hostname.replace(/^www\./u, "").toLowerCase();
  } catch {
    return "";
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = selector(item) || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]));
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function severityRank(severity) {
  return { blocker: 3, warning: 2, info: 1 }[severity] || 0;
}

function finding(agent, severity, lane, message, evidence = {}) {
  return { agent, severity, lane, message, evidence };
}

function isSocialUrl(url) {
  const host = hostOf(url);
  return Boolean(host && socialHosts.some((social) => host === social || host.endsWith(`.${social}`)));
}

function hasUsableText(value) {
  return typeof value === "string" && value.trim().length >= 20;
}

function hasAnyUsableText(values) {
  return values.some(hasUsableText);
}

function itemDate(item) {
  return item.date || item.publishedAt || item.createdAt || "";
}

function normalizedBusinessCategory(card) {
  return String(card.category || "").replace(/-/gu, "_");
}

function activeBusinessCards(data) {
  const cards = Array.isArray(data.frontstageCards) ? data.frontstageCards : (Array.isArray(data.cards) ? data.cards : []);
  return cards.filter((card) => card.date === date);
}

function sourceScoutAgent(datasets) {
  const businessCards = datasets.business.activeCards;
  const firstLineRemarks = datasets.firstLine.remarks;
  const communityItems = datasets.community.items;
  const relationshipDirections = datasets.reportsCenter.relationshipDirections;
  const categoryCounts = countBy(businessCards, normalizedBusinessCategory);
  const sourceHosts = unique(businessCards.map((card) => hostOf(card.sourceUrl)));
  const sourceCounts = countBy(businessCards, (card) => hostOf(card.sourceUrl) || card.sourceName || card.source || "unknown");
  const findings = [];

  for (const required of ["product_service", "funding", "case"]) {
    if (!categoryCounts[required]) {
      findings.push(finding("source_scout", "warning", "business_signals", `No active-date ${required} Card; source refill should look for concrete ${required} events.`, { categoryCounts }));
    }
  }
  if (businessCards.length && sourceHosts.length < Math.min(4, businessCards.length)) {
    findings.push(finding("source_scout", "warning", "business_signals", "Active Business Cards have low source diversity.", { sourceHosts, sourceCounts }));
  }
  if (firstLineRemarks.length < 10) {
    findings.push(finding("source_scout", "warning", "first_line_viewpoints", "First-Line Viewpoints remarks are below the trial review floor.", { remarks: firstLineRemarks.length }));
  }
  if (communityItems.length < 12) {
    findings.push(finding("source_scout", "warning", "community_intelligence", "Community Intelligence items are below the publication floor.", { items: communityItems.length }));
  }
  if (!relationshipDirections.length) {
    findings.push(finding("source_scout", "warning", "reports_center", "Reports Center relationship directions are empty; map / graph value may be thin.", {}));
  }

  return {
    id: "source_scout",
    label: "Source Scout",
    status: findings.some((item) => item.severity === "blocker") ? "fail" : (findings.length ? "warning" : "pass"),
    metrics: {
      businessActiveCards: businessCards.length,
      businessCategoryCounts: categoryCounts,
      businessSourceHosts: sourceHosts.length,
      firstLineRemarks: firstLineRemarks.length,
      communityItems: communityItems.length,
      communityLinks: datasets.community.links.length,
      reportsCenterRelationshipDirections: relationshipDirections.length,
    },
    findings,
    recommendations: [
      "Use refill only for concrete launches, funding, customer deployments, procurement, partnerships, pricing, regulatory, lawsuit, or acquisition events.",
      "Keep Source Scout output as candidate URLs / source gaps, not production facts.",
    ],
  };
}

function verifyBusinessCard(card) {
  const failed = [];
  const warnings = [];
  if (!card.sourceUrl || !hostOf(card.sourceUrl)) failed.push("source_auditability");
  if (!allowedBusinessCategories.has(normalizedBusinessCategory(card))) failed.push("business_signal_scope");
  if (isSocialUrl(card.sourceUrl)) failed.push("fact_type_constraints");
  if (!hasAnyUsableText([card.visibleFragment, card.summary, card.translatedFact, ...(Array.isArray(card.originalHighlights) ? card.originalHighlights : [])])) {
    failed.push("evidence_quality");
  }
  if (!card.title || placeholderTitlePattern.test(card.title)) failed.push("public_title_quality");
  if (!card.subject) warnings.push("missing_subject");
  if (!card.evidenceStrength || /weak|thin|low/iu.test(String(card.evidenceStrength))) warnings.push("weak_evidence_strength_label");
  return { failed, warnings };
}

function evidenceVerifierAgent(datasets) {
  const findings = [];
  const businessAnnotations = datasets.business.activeCards.map((card) => {
    const result = verifyBusinessCard(card);
    if (result.failed.length) {
      findings.push(finding("evidence_verifier", "blocker", "business_signals", `Public Card ${card.id} fails evidence checks.`, {
        id: card.id,
        title: card.title,
        failedGates: result.failed,
      }));
    } else if (result.warnings.length) {
      findings.push(finding("evidence_verifier", "warning", "business_signals", `Public Card ${card.id} has evidence warnings.`, {
        id: card.id,
        warnings: result.warnings,
      }));
    }
    return {
      item_id: card.id,
      lane: "business_signals",
      verdict: result.failed.length ? "reject_or_repair" : (result.warnings.length ? "pass_with_warning" : "pass"),
      failed_gates: result.failed,
      warnings: result.warnings,
      source_url: card.sourceUrl || "",
    };
  });

  const firstLineMissingUrl = datasets.firstLine.remarks.filter((remark) => !remark.url);
  const firstLineUntranslated = datasets.firstLine.remarks.filter((remark) => remark.translationStatus !== "translated");
  const firstLineContentWarnings = datasets.firstLine.remarks.filter((remark) => (
    hasUsableText(remark.content) && remark.contentTranslationStatus && remark.contentTranslationStatus !== "translated"
  ));
  if (firstLineMissingUrl.length) {
    findings.push(finding("evidence_verifier", "blocker", "first_line_viewpoints", "First-Line Viewpoints has remarks without original URL.", { count: firstLineMissingUrl.length }));
  }
  if (firstLineUntranslated.length) {
    findings.push(finding("evidence_verifier", "blocker", "first_line_viewpoints", "First-Line Viewpoints has untranslated remarks.", { count: firstLineUntranslated.length }));
  }
  if (firstLineContentWarnings.length) {
    findings.push(finding("evidence_verifier", "warning", "first_line_viewpoints", "First-Line Viewpoints has secondary content translation warnings.", { count: firstLineContentWarnings.length }));
  }

  const communityNoUrl = datasets.community.items.filter((item) => !item.url);
  const communityNoEvidence = datasets.community.items.filter((item) => !hasAnyUsableText([item.evidence, item.excerpt, item.summary]));
  if (communityNoUrl.length) {
    findings.push(finding("evidence_verifier", "warning", "community_intelligence", "Community items without source URL remain leads only.", { count: communityNoUrl.length }));
  }
  if (communityNoEvidence.length) {
    findings.push(finding("evidence_verifier", "warning", "community_intelligence", "Community items without evidence text should not drive decisions.", { count: communityNoEvidence.length }));
  }

  const cardsById = new Set(datasets.reportsCenter.cards.map((card) => card.id));
  const brokenRelationshipRefs = [];
  for (const direction of datasets.reportsCenter.relationshipDirections) {
    for (const ref of direction.supportingCards || []) {
      const id = typeof ref === "string" ? ref : ref.id;
      if (id && !cardsById.has(id)) brokenRelationshipRefs.push({ direction: direction.id, id });
    }
  }
  if (brokenRelationshipRefs.length) {
    findings.push(finding("evidence_verifier", "warning", "reports_center", "Reports Center relationship directions contain missing Card refs.", { refs: brokenRelationshipRefs.slice(0, 20) }));
  }

  return {
    id: "evidence_verifier",
    label: "Evidence Verifier",
    status: findings.some((item) => item.severity === "blocker") ? "fail" : (findings.length ? "warning" : "pass"),
    metrics: {
      businessReviewed: businessAnnotations.length,
      businessPassed: businessAnnotations.filter((item) => item.verdict === "pass").length,
      businessWarnings: businessAnnotations.filter((item) => item.verdict === "pass_with_warning").length,
      businessRepairNeeded: businessAnnotations.filter((item) => item.verdict === "reject_or_repair").length,
      firstLineMissingUrl: firstLineMissingUrl.length,
      firstLineUntranslated: firstLineUntranslated.length,
      firstLineContentTranslationWarnings: firstLineContentWarnings.length,
      communityNoUrl: communityNoUrl.length,
      communityNoEvidence: communityNoEvidence.length,
      brokenRelationshipRefs: brokenRelationshipRefs.length,
    },
    annotations: businessAnnotations,
    findings,
  };
}

function businessAction(card) {
  const category = normalizedBusinessCategory(card);
  if (category === "funding") return "funding";
  const text = `${card.title || ""} ${card.summary || ""} ${card.translatedFact || ""}`.toLowerCase();
  if (/launch|推出|发布|release|beta|公测|ga\b/u.test(text)) return "launch";
  if (/customer|case|deploy|adopt|rollout|客户|部署|采用|落地/u.test(text)) return "deployment";
  if (/partner|partnership|合作|integrat|集成/u.test(text)) return "partnership";
  if (/pricing|price|付费|定价|billing/u.test(text)) return "pricing";
  if (/acqui|merge|收购|并购/u.test(text)) return "acquisition";
  return category || "unknown";
}

function businessAnalystAgent(datasets) {
  const cards = datasets.business.activeCards;
  const highValueCards = cards
    .map((card) => ({
      id: card.id,
      title: card.title,
      category: normalizedBusinessCategory(card),
      subject: card.subject,
      action: businessAction(card),
      importanceScore: Number(card.importanceScore || 0),
      sourceName: card.sourceName || card.source || "",
      why: card.summary || card.translatedFact || card.visibleFragment || "",
    }))
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 10);

  const communityOpportunities = datasets.community.items
    .filter((item) => Number(item.valueScore || 0) >= 80 || Number(item.opportunityScore || 0) >= 50)
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      title: item.title,
      industry: item.industry || "",
      scene: item.scene || "",
      tools: item.tools || [],
      valueScore: item.valueScore || 0,
      opportunityScore: item.opportunityScore || 0,
      route: "community_lead_only",
    }));

  const opportunitySignals = cards.filter((card) => card.opportunitySignals);
  const findings = [];
  if (!highValueCards.length) findings.push(finding("business_analyst", "warning", "business_signals", "No active high-value Business Signal Cards available for analyst review.", {}));
  if (opportunitySignals.length < Math.min(3, cards.length)) {
    findings.push(finding("business_analyst", "warning", "reports_center", "Few active Cards have opportunity_signals; Reports Center maps may lose source-near value.", {
      activeCards: cards.length,
      opportunitySignals: opportunitySignals.length,
    }));
  }

  return {
    id: "business_analyst",
    label: "Business Analyst",
    status: findings.length ? "warning" : "pass",
    metrics: {
      highValueBusinessSignals: highValueCards.length,
      communityOpportunityLeads: communityOpportunities.length,
      opportunitySignalCards: opportunitySignals.length,
    },
    highValueCards,
    communityOpportunities,
    findings,
  };
}

function trendGraphAgent(datasets) {
  const activeCards = datasets.business.activeCards;
  const tagCounts = {};
  for (const card of activeCards) {
    for (const tag of card.flatTags || []) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
  const clusters = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({
      tag,
      count,
      cardIds: activeCards.filter((card) => (card.flatTags || []).includes(tag)).map((card) => card.id).slice(0, 8),
    }));
  const trendCandidates = [
    ...(datasets.business.recentTrendCandidates || []),
    ...(datasets.business.trendCandidates || []),
  ];
  const thinTrends = trendCandidates.filter((trend) => (trend.relatedSignals || []).length < 2);
  const findings = [];
  if (!clusters.length && activeCards.length >= 2) {
    findings.push(finding("trend_graph_agent", "warning", "business_signals", "No repeated same-direction tag clusters from active Cards.", { activeCards: activeCards.length }));
  }
  if (!datasets.reportsCenter.relationshipDirections.length) {
    findings.push(finding("trend_graph_agent", "warning", "reports_center", "No relationship directions available for Reports Center graph review.", {}));
  }
  if (thinTrends.length) {
    findings.push(finding("trend_graph_agent", "warning", "reports_center", "Trend candidates with fewer than 2 related signals should remain internal.", {
      count: thinTrends.length,
      ids: thinTrends.map((trend) => trend.id).slice(0, 10),
    }));
  }

  return {
    id: "trend_graph_agent",
    label: "Trend / Graph Agent",
    status: findings.length ? "warning" : "pass",
    metrics: {
      activeCardClusters: clusters.length,
      relationshipDirections: datasets.reportsCenter.relationshipDirections.length,
      graphCards: datasets.reportsCenter.cards.length,
      trendCandidates: trendCandidates.length,
      thinTrendCandidates: thinTrends.length,
    },
    clusters,
    trendCandidates: trendCandidates.slice(0, 10).map((trend) => ({
      id: trend.id,
      title: trend.title,
      relatedSignals: (trend.relatedSignals || []).length,
      boundary: trend.boundary || "",
    })),
    findings,
  };
}

function redTeamQaAgent(datasets, priorAgents) {
  const findings = [];
  const allPriorFindings = priorAgents.flatMap((agent) => agent.findings || []);
  const blockers = allPriorFindings.filter((item) => item.severity === "blocker");
  const warnings = allPriorFindings.filter((item) => item.severity === "warning");
  const activeBusinessIds = new Set(datasets.business.activeCards.map((card) => card.id));
  const duplicateEvents = Object.entries(countBy(datasets.business.activeCards, (card) => `${card.category}:${String(card.subject || "").toLowerCase()}:${String(card.title || "").toLowerCase().replace(/\s+/gu, " ").slice(0, 80)}`))
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ key, count }));
  const directCommunityInBusiness = datasets.business.activeCards.filter((card) => /community|社群|生财|小红书|reddit|hacker news/iu.test(`${card.sourceName || ""} ${card.source || ""}`));
  const reportRefsOutsideActive = [];
  for (const direction of datasets.reportsCenter.relationshipDirections) {
    for (const ref of direction.supportingCards || []) {
      const id = typeof ref === "string" ? ref : ref.id;
      if (id && !activeBusinessIds.has(id)) reportRefsOutsideActive.push(id);
    }
  }

  if (duplicateEvents.length) {
    findings.push(finding("red_team_qa", "warning", "business_signals", "Possible duplicate active Business Card events.", { duplicates: duplicateEvents.slice(0, 10) }));
  }
  if (directCommunityInBusiness.length) {
    findings.push(finding("red_team_qa", "blocker", "business_signals", "Business Cards appear to use community/social sources directly.", {
      cards: directCommunityInBusiness.map((card) => ({ id: card.id, sourceName: card.sourceName || card.source || "" })),
    }));
  }
  if (reportRefsOutsideActive.length && datasets.business.activeCards.length) {
    findings.push(finding("red_team_qa", "info", "reports_center", "Reports Center relationship directions include non-active historical Cards, acceptable when the map is historical.", {
      refs: unique(reportRefsOutsideActive).slice(0, 20),
    }));
  }

  const gateBlockers = [...blockers, ...findings.filter((item) => item.severity === "blocker")];
  const gateWarnings = [...warnings, ...findings.filter((item) => item.severity === "warning")];
  const checks = [
    { id: "no_red_team_blockers", status: gateBlockers.length ? "fail" : "pass" },
    { id: "public_cards_have_evidence_verifier_pass", status: blockers.some((item) => item.lane === "business_signals") ? "fail" : "pass" },
    { id: "no_community_or_viewpoint_direct_business_fact", status: directCommunityInBusiness.length ? "fail" : "pass" },
    { id: "trend_candidates_have_multiple_signals", status: (priorAgents.find((agent) => agent.id === "trend_graph_agent")?.metrics?.thinTrendCandidates || 0) ? "warning" : "pass" },
  ];

  return {
    id: "red_team_qa",
    label: "Red-Team QA",
    status: gateBlockers.length ? "fail" : (gateWarnings.length ? "warning" : "pass"),
    metrics: {
      inheritedBlockers: blockers.length,
      inheritedWarnings: warnings.length,
      duplicateEventSuspects: duplicateEvents.length,
      directCommunityBusinessCards: directCommunityInBusiness.length,
      reportRefsOutsideActive: unique(reportRefsOutsideActive).length,
    },
    findings,
    review_gate: {
      status: gateBlockers.length ? "fail" : (gateWarnings.length ? "warning" : "pass"),
      blockers: gateBlockers,
      warnings: gateWarnings,
      checks,
    },
  };
}

function buildDatasets() {
  const business = readJson(dataPaths.business, {});
  const firstLine = readJson(dataPaths.firstLine, {});
  const community = readJson(dataPaths.community, {});
  const reportsCenter = readJson(dataPaths.reportsCenter, {});
  return {
    business: {
      raw: business,
      activeDate: business.meta?.activeDate || "",
      activeCards: activeBusinessCards(business),
      cards: Array.isArray(business.cards) ? business.cards : [],
      frontstageCards: Array.isArray(business.frontstageCards) ? business.frontstageCards : [],
      trendCandidates: Array.isArray(business.trendCandidates) ? business.trendCandidates : [],
      recentTrendCandidates: Array.isArray(business.recentTrendCandidates) ? business.recentTrendCandidates : [],
    },
    firstLine: {
      raw: firstLine,
      generatedAt: firstLine.meta?.generatedAt || "",
      remarks: Array.isArray(firstLine.remarks) ? firstLine.remarks : [],
      builders: Array.isArray(firstLine.builders) ? firstLine.builders : [],
      podcasts: Array.isArray(firstLine.podcasts) ? firstLine.podcasts : [],
    },
    community: {
      raw: community,
      generatedAt: community.meta?.generatedAt || "",
      items: Array.isArray(community.items) ? community.items : [],
      links: Array.isArray(community.links) ? community.links : [],
      sources: Array.isArray(community.sources) ? community.sources : [],
    },
    reportsCenter: {
      raw: reportsCenter,
      activeDate: reportsCenter.meta?.activeDate || "",
      cards: Array.isArray(reportsCenter.cards) ? reportsCenter.cards : [],
      coreSignalCards: Array.isArray(reportsCenter.coreSignalCards) ? reportsCenter.coreSignalCards : [],
      relationshipDirections: Array.isArray(reportsCenter.relationshipDirections) ? reportsCenter.relationshipDirections : [],
      tagAssociations: Array.isArray(reportsCenter.tagAssociations) ? reportsCenter.tagAssociations : [],
      trendSignals: Array.isArray(reportsCenter.trendSignals) ? reportsCenter.trendSignals : [],
      observationSeeds: Array.isArray(reportsCenter.observationSeeds) ? reportsCenter.observationSeeds : [],
    },
  };
}

function buildPrompts(payload) {
  const common = [
    "You are a WaveSight data-observation review agent.",
    "You do not edit Raw, Pool, Card, frontstage data, Git files, or scheduled tasks.",
    "You only produce structured review annotations.",
    "Facts must come from original source text or existing accepted data, not search snippets, tags, old summaries, or generated frontstage copy.",
    "Business Signal Card types are only product_service, funding, and case.",
    "Do not use First-Line Viewpoints or Community Intelligence as direct Business Signal facts.",
    "Do not lower evidence gates to increase quantity.",
  ].join("\n");
  const agentInstructions = {
    source_scout: "Find source coverage gaps and refill directions. Output candidate source gaps only, not production facts.",
    evidence_verifier: "Evaluate source auditability, evidence quality, business scope, valid page type, commercial importance, and fact-type constraints.",
    business_analyst: "Assess commercial value, business action, market/customer relevance, confidence, and what to watch next.",
    trend_graph_agent: "Build only multi-card trend or graph observations with evidence boundaries.",
    red_team_qa: "Find blockers, weak evidence, duplicate events, cross-lane contamination, unsupported trend candidates, and regression risks.",
  };
  return Object.entries(agentInstructions).map(([agent, instruction]) => ({
    agent,
    prompt: [
      `# ${agent} instruction`,
      "",
      common,
      "",
      instruction,
      "",
      "Input report:",
      `- ${payload.report_markdown}`,
      "",
      "Return JSON annotations only if invoked manually.",
    ].join("\n"),
  }));
}

function writeOutputs(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-data-observation-agent-review.json`);
  const mdPath = path.join(reportsDir, `${date}-data-observation-agent-review.md`);
  const latestJsonPath = path.join(reportsDir, "data-observation-agent-review-latest.json");
  const latestMdPath = path.join(reportsDir, "data-observation-agent-review-latest.md");
  const promptPath = path.join(reportsDir, `${date}-data-observation-agent-review-prompts.md`);
  payload.report_markdown = rel(mdPath);
  payload.prompts = writePrompts ? buildPrompts(payload) : [];

  const agentSections = payload.agents.map((agent) => [
    `## ${agent.label}`,
    "",
    `- status: ${agent.status}`,
    `- findings: ${(agent.findings || []).length}`,
    "",
    "### Metrics",
    "",
    "```json",
    JSON.stringify(agent.metrics || {}, null, 2),
    "```",
    "",
    "### Findings",
    "",
    markdownFindings(agent.findings || []),
    "",
  ].join("\n"));

  const md = [
    `# Data Observation Agent Review - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- trial: ${payload.trial.enabled ? `${payload.trial.start} + ${payload.trial.days} day(s)` : "disabled"}`,
    `- business_active_cards: ${payload.coverage.business_active_cards}`,
    `- first_line_remarks: ${payload.coverage.first_line_remarks}`,
    `- community_items: ${payload.coverage.community_items}`,
    `- reports_center_cards: ${payload.coverage.reports_center_cards}`,
    "",
    "## Review Gate",
    "",
    `- status: ${payload.review_gate.status}`,
    `- blockers: ${payload.review_gate.blockers.length}`,
    `- warnings: ${payload.review_gate.warnings.length}`,
    "",
    "## Agent Coverage",
    "",
    "| Agent | Status | Findings |",
    "|---|---|---:|",
    ...payload.agents.map((agent) => `| ${agent.label} | ${agent.status} | ${(agent.findings || []).length} |`),
    "",
    ...agentSections,
    "## High-Value Business Signals",
    "",
    markdownList(payload.agents.find((agent) => agent.id === "business_analyst")?.highValueCards || [], (card) => `${card.id}: ${card.title} (${card.action}, score ${card.importanceScore})`),
    "",
    "## Trend / Graph Clusters",
    "",
    markdownList(payload.agents.find((agent) => agent.id === "trend_graph_agent")?.clusters || [], (cluster) => `${cluster.tag}: ${cluster.count} Card(s), refs ${cluster.cardIds.join(", ")}`),
    "",
    "## Boundaries",
    "",
    "- This is a sidecar review report. It does not edit Raw, Pool, Cards, frontstage data, PRs, or deployment state.",
    "- Findings must be fixed through existing lane scripts, gates, or Codex repair tasks if action is needed.",
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  if (writePrompts) {
    fs.writeFileSync(promptPath, payload.prompts.map((item) => item.prompt).join("\n\n---\n\n"), "utf8");
    payload.prompt_report = rel(promptPath);
    fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  }
  return { jsonPath, mdPath, promptPath: writePrompts ? promptPath : "" };
}

function markdownFindings(findings) {
  if (!findings.length) return "- none";
  return findings
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .map((item) => `- **${item.severity}** / ${item.lane}: ${item.message}`)
    .join("\n");
}

function markdownList(items, formatter) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${formatter(item)}`).join("\n");
}

function inactivePayload() {
  return {
    ok: true,
    status: "trial_not_active",
    date,
    generated_at: new Date().toISOString(),
    trial: { enabled: true, start: trialStart, days: trialDays, active: false },
    coverage: {},
    agents: [],
    review_gate: { status: "not_run", blockers: [], warnings: [], checks: [] },
  };
}

function main() {
  let payload;
  if (!inTrialWindow()) {
    payload = inactivePayload();
  } else {
    const datasets = buildDatasets();
    const agents = [];
    agents.push(sourceScoutAgent(datasets));
    agents.push(evidenceVerifierAgent(datasets));
    agents.push(businessAnalystAgent(datasets));
    agents.push(trendGraphAgent(datasets));
    agents.push(redTeamQaAgent(datasets, agents));
    const redTeam = agents.find((agent) => agent.id === "red_team_qa");
    const reviewGate = redTeam.review_gate;
    payload = {
      ok: reviewGate.status !== "fail",
      status: reviewGate.status,
      date,
      generated_at: new Date().toISOString(),
      trial: { enabled: Boolean(trialStart && trialDays > 0), start: trialStart, days: trialDays, active: true },
      data_paths: dataPaths,
      coverage: {
        business_active_date: datasets.business.activeDate,
        business_active_cards: datasets.business.activeCards.length,
        business_total_cards: datasets.business.cards.length,
        first_line_remarks: datasets.firstLine.remarks.length,
        first_line_builders: datasets.firstLine.builders.length,
        community_items: datasets.community.items.length,
        community_links: datasets.community.links.length,
        reports_center_active_date: datasets.reportsCenter.activeDate,
        reports_center_cards: datasets.reportsCenter.cards.length,
        reports_center_relationship_directions: datasets.reportsCenter.relationshipDirections.length,
      },
      agents,
      review_gate: reviewGate,
    };
  }

  const output = writeOutputs(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status: payload.status,
    report: rel(output.jsonPath),
    markdown: rel(output.mdPath),
    prompt_report: output.promptPath ? rel(output.promptPath) : "",
    agents: payload.agents.length,
    blockers: payload.review_gate.blockers.length,
    warnings: payload.review_gate.warnings.length,
  }, null, 2));
}

main();
