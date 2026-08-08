#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "../../..");

export const HOMEPAGE_FRONTSTAGE_VERSION = "HOMEPAGE-FRONTSTAGE-V1.0";

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function isoDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function dateText(date) {
  return date.toISOString().slice(0, 10);
}

function mondayOf(value) {
  const date = isoDate(value);
  if (!date) return null;
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return date;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function weeklyFinancingCounts(cards, latestDate, weeks = 8) {
  const latest = mondayOf(latestDate);
  if (!latest) return [];
  return Array.from({ length: weeks }, (_, index) => {
    const start = addDays(latest, (index - weeks + 1) * 7);
    const end = addDays(start, 6);
    const startText = dateText(start);
    const endText = dateText(end);
    const count = cards.filter((card) => {
      const announcedAt = card.financing?.announced_at || "";
      return announcedAt >= startText && announcedAt <= endText;
    }).length;
    return {
      start: startText,
      end: endText,
      label: startText.slice(5).replace("-", "."),
      count,
    };
  });
}

function latestDeals(cards, limit = 8) {
  return [...cards]
    .sort((left, right) => (
      String(right.financing?.announced_at || "").localeCompare(String(left.financing?.announced_at || ""))
      || String(right.published_at || "").localeCompare(String(left.published_at || ""))
    ))
    .slice(0, limit)
    .map((card) => ({
      company: card.company?.full_name || card.company?.name || "",
      round: card.financing?.round || "轮次未披露",
      amount_original: card.financing?.amount_original || card.financing?.amount || "",
      amount_display: card.financing?.amount_normalized?.display_zh || "金额未披露",
      announced_at: card.financing?.announced_at || "",
      investor_disclosure_status: card.financing?.investor_disclosure_status || "unknown",
      investors: (card.financing?.investors || []).slice(0, 4).map((item) => ({
        name: item.name,
        role: item.role || "本轮投资方",
      })),
      additional_investor_count: Math.max(0, (card.financing?.investors || []).length - 4),
      source_count: (card.research_sources || []).length,
      market_category: card.market_category?.name || "",
      link: `funding-insights.html?id=${encodeURIComponent(card.funding_insight_id)}`,
    }));
}

function featuredInvestors(institutions, limit = 6) {
  return institutions
    .filter((item) => item.collection_status === "evidence_backed" && item.current_round_count > 0)
    .slice(0, limit)
    .map((item) => ({
      name: item.name,
      investor_kind: item.investor_kind_label,
      current_round_count: item.current_round_count,
      portfolio_company_count: item.portfolio_company_count,
      latest_disclosed_at: item.latest_disclosed_at,
      link: `data-center.html?view=index&detail=investor&id=${encodeURIComponent(item.id)}`,
    }));
}

export function buildHomepageFrontstage(projectRoot = root) {
  const funding = readJson(path.join(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json"), { meta: {}, cards: [] });
  const registry = readJson(path.join(projectRoot, "01-SiteV2/content/11-databases/investment-institutions-v1.json"), { meta: {}, institutions: [] });
  const cards = funding.cards || [];
  const institutions = registry.institutions || [];
  const latestDate = funding.meta?.latest_date
    || cards.map((card) => card.financing?.announced_at || "").filter(Boolean).sort().at(-1)
    || "";
  return {
    meta: {
      schema_version: HOMEPAGE_FRONTSTAGE_VERSION,
      site_version: "SITE-V4.6.0-research-homepage",
      generated_at: funding.meta?.generated_at || registry.meta?.generated_at || "",
      latest_date: latestDate,
      aggregation_boundary: "融资事件数量按已聚合公开卡计数；金额保留原币种，不进行跨币种求和",
    },
    metrics: {
      verified_financing_events: cards.length,
      evidence_backed_investor_subjects: registry.meta?.evidence_backed_count || 0,
      current_round_activities: registry.meta?.current_round_activity_count || 0,
      duplicate_disclosures_merged: funding.meta?.duplicate_rounds_removed || 0,
    },
    weekly_financing_counts: weeklyFinancingCounts(cards, latestDate),
    latest_deals: latestDeals(cards),
    featured_investors: featuredInvestors(institutions),
  };
}

export function writeHomepageFrontstage(projectRoot = root) {
  const data = buildHomepageFrontstage(projectRoot);
  const output = path.join(projectRoot, "01-SiteV2/site/data/homepage-v1.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(projectRoot, output).replace(/\\/gu, "/"),
    financing_events: data.metrics.verified_financing_events,
    investor_subjects: data.metrics.evidence_backed_investor_subjects,
    current_round_activities: data.metrics.current_round_activities,
  }, null, 2));
  return data;
}

if (path.resolve(process.argv[1] || "") === __filename) writeHomepageFrontstage(root);
