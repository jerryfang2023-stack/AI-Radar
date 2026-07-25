#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, "../../..");
const mapFields = [
  "buyer_or_user",
  "team_or_function",
  "specific_task",
  "pain_or_constraint",
  "product_form",
  "delivery_model",
  "business_action",
];
const taxonomyCache = new Map();
const opportunitySignalPriority = {
  business_action: [
    "customer_deployment",
    "funding_round",
    "product_launch",
    "partnership_integration",
    "procurement_signal",
    "pricing_change",
    "acquisition",
    "open_source_release",
    "governance_requirement",
    "research_benchmark",
    "failure_postmortem",
    "hiring_fde",
  ],
};

function parseArgs(argv = process.argv.slice(2)) {
  return new Map(argv.map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(file);
    return entry.isFile() && entry.name.endsWith(".md") ? [file] : [];
  });
}

function frontmatter(text = "") {
  return text.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
}

function scalarValue(raw = "") {
  const value = String(raw).trim();
  if (!value) return "";
  try {
    return JSON.parse(value);
  } catch {
    return value.replace(/^["']|["']$/gu, "");
  }
}

function scalar(fm = "", name = "") {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return scalarValue(fm.match(new RegExp(`^${escaped}:\\s*(.*)$`, "mu"))?.[1] || "");
}

function nestedBlock(fm = "", name = "") {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line === `${name}:`);
  if (start < 0) return "";
  const rows = [];
  for (const line of lines.slice(start + 1)) {
    if (line && !/^\s/u.test(line)) break;
    rows.push(line);
  }
  return rows.join("\n");
}

function nestedScalar(fm = "", block = "", name = "") {
  const text = nestedBlock(fm, block);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return scalarValue(text.match(new RegExp(`^\\s+${escaped}:\\s*(.*)$`, "mu"))?.[1] || "");
}

function nestedList(fm = "", block = "", name = "") {
  const value = nestedScalar(fm, block, name);
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .replace(/^\[|\]$/gu, "")
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/gu, ""))
    .filter(Boolean);
}

function sourceName(sourceUrl = "") {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function cardSubject(owner = "", title = "", source = "") {
  const normalizedOwner = String(owner || "").trim();
  if (normalizedOwner && normalizedOwner !== title) return normalizedOwner;
  return String(source || "").split(".")[0] || normalizedOwner || title;
}

function cardFromFile(file) {
  const fm = frontmatter(fs.readFileSync(file, "utf8"));
  const sourceUrl = nestedScalar(fm, "primary_raw", "source_url");
  const title = scalar(fm, "title");
  const source = sourceName(sourceUrl);
  return {
    id: scalar(fm, "id"),
    type: scalar(fm, "type"),
    title,
    category: scalar(fm, "signal_type"),
    date: scalar(fm, "date"),
    status: scalar(fm, "status"),
    assetLevel: scalar(fm, "asset_level"),
    sourceUrl,
    sourceName: source,
    subject: cardSubject(scalar(fm, "signal_owner"), title, source),
    sourceExcerpt: nestedScalar(fm, "opportunity_signals", "source_excerpt")
      || nestedScalar(fm, "frontend", "sourceExcerpt"),
    opportunitySignals: Object.fromEntries(mapFields.map((field) => [
      field,
      nestedList(fm, "opportunity_signals", field),
    ])),
  };
}

export function acceptedCards(root) {
  const dir = path.join(root, "01-SiteV2/knowledge/01-Signal-Cards");
  const cardsByEvidence = new Map();
  for (const file of listMarkdownFiles(dir).sort()) {
    const card = cardFromFile(file);
    if (
      card.id
      && card.type === "signal_card"
      && card.status === "published"
      && card.assetLevel === "frontstage"
      && ["product_service", "funding", "case"].includes(card.category)
      && card.date
      && card.title
      && card.sourceName
    ) {
      const evidenceKey = `${card.date}|${card.sourceUrl || card.title}`;
      if (!cardsByEvidence.has(evidenceKey)) cardsByEvidence.set(evidenceKey, card);
    }
  }
  return [...new Map([...cardsByEvidence.values()].map((card) => [card.id, card])).values()];
}

function dateDistance(later, earlier) {
  const end = Date.parse(`${later}T00:00:00Z`);
  const start = Date.parse(`${earlier}T00:00:00Z`);
  return Number.isFinite(end) && Number.isFinite(start) ? Math.floor((end - start) / 86400000) : Number.POSITIVE_INFINITY;
}

function signalValues(card, field) {
  const source = card.opportunitySignals || {};
  const camel = field.replace(/_([a-z])/gu, (_, char) => char.toUpperCase());
  const raw = source.labels?.[field] || source[field] || source[camel] || [];
  return Array.isArray(raw)
    ? [...new Set(raw.map((item) => item?.id || item).filter(Boolean))]
    : [];
}

function orderedSignalValues(taxonomyFile, card, field) {
  if (!taxonomyCache.has(taxonomyFile)) {
    taxonomyCache.set(taxonomyFile, JSON.parse(fs.readFileSync(taxonomyFile, "utf8")));
  }
  const order = Object.keys(taxonomyCache.get(taxonomyFile).fields?.[field]?.values || {});
  const allowed = new Set(order);
  const priority = opportunitySignalPriority[field] || [];
  return signalValues(card, field)
    .filter((value) => allowed.has(value))
    .sort((a, b) => {
      const aIndex = priority.includes(a) ? priority.indexOf(a) : 999;
      const bIndex = priority.includes(b) ? priority.indexOf(b) : 999;
      return aIndex - bIndex || a.localeCompare(b);
    })
    .slice(0, 3);
}

function readDirectionCardConfig(file) {
  if (!fs.existsSync(file)) return { schema_version: "direction-cards-v1", cards: [] };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function buildDirectionCards(file, cards, sourceCards) {
  const config = readDirectionCardConfig(file);
  const cardsById = new Map(cards.map((card) => [card.id, card]));
  const sourceCardsById = new Map(sourceCards.map((card) => [card.id, card]));
  return (config.cards || []).flatMap((direction) => {
    const evidence = [...new Set(direction.evidence_card_ids || [])]
      .map((id) => cardsById.get(id))
      .filter(Boolean)
      .map((card) => ({
        id: card.id,
        title: card.title,
        category: card.category,
        categoryLabel: card.categoryLabel,
        date: card.date,
        sourceUrl: card.sourceUrl,
        sourceName: card.sourceName,
        subject: card.subject,
        sourceExcerpt: sourceCardsById.get(card.id)?.sourceExcerpt || "",
      }));
    const minimum = Number(direction.minimum_evidence || 2);
    if (!direction.id || !direction.title || evidence.length < minimum) return [];
    return [{
      id: direction.id,
      title: direction.title,
      judgment: direction.judgment || "",
      hypothesis: direction.hypothesis,
      status: direction.status,
      buyer: direction.buyer,
      task: direction.task,
      pain: direction.pain,
      productWedge: direction.product_wedge,
      currentAlternatives: direction.current_alternatives,
      whyNow: direction.why_now,
      counterSignal: direction.counter_signal || "",
      unknowns: direction.unknowns || [],
      validationAction: direction.validation_action,
      reviewedAt: direction.reviewed_at || "",
      evidenceCount: evidence.length,
      actorCount: new Set(evidence.map((card) => card.subject).filter(Boolean)).size,
      evidence,
    }];
  });
}

export function buildIndustryReportsData(
  root = defaultRoot,
  {
    taxonomyFile = path.join(root, "agent-workflow/product/opportunity-signal-taxonomy.json"),
    directionFile = path.join(root, "agent-workflow/product/opportunity-direction-cards.json"),
  } = {},
) {
  const allCards = acceptedCards(root);
  const activeDate = allCards.map((card) => card.date).sort().at(-1) || "";
  const cards = allCards
    .filter((card) => dateDistance(activeDate, card.date) >= 0 && dateDistance(activeDate, card.date) < 30)
    .sort((a, b) => b.date.localeCompare(a.date) || a.category.localeCompare(b.category))
    .map((card) => ({
      id: card.id,
      title: card.title,
      category: card.category === "product_service" ? "product-service" : card.category,
      categoryLabel: {
        product_service: "产品",
        funding: "融资",
        case: "案例",
      }[card.category] || "",
      date: card.date,
      sourceUrl: card.sourceUrl,
      sourceName: card.sourceName || "",
      subject: card.subject || "",
      opportunitySignals: {
        labels: Object.fromEntries(mapFields.map((field) => [field, orderedSignalValues(taxonomyFile, card, field)])),
      },
    }));
  const directionCards = buildDirectionCards(directionFile, cards, allCards);

  return {
    meta: {
      schemaVersion: "OPPORTUNITY-MAP-FRONTSTAGE-V1.1",
      siteVersion: "SITE-V4.2.0-entity-history",
      applicationVersion: "OMAP-V1.1.0-direction-cards",
      opportunityMapVersion: "OMAP-V1.1.0-direction-cards",
      directionCardVersion: "DIRECTION-CARD-V1.1-deepseek-pro-reviewed",
      activeDate,
      generatedAt: `${activeDate}T00:00:00.000Z`,
      windowDays: 30,
      cardCount: cards.length,
      directionCardCount: directionCards.length,
      sourceAdapter: "accepted-signal-card-assets",
    },
    cards,
    directionCards,
  };
}

export function writeIndustryReportsData(root = defaultRoot) {
  const output = path.join(root, "01-SiteV2/site/data/industry-reports-frontstage.json");
  const data = buildIndustryReportsData(root);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return { output, data };
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  const root = args.get("root") ? path.resolve(args.get("root")) : defaultRoot;
  const { output, data } = writeIndustryReportsData(root);
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, output).replace(/\\/gu, "/"),
    activeDate: data.meta.activeDate,
    cards: data.cards.length,
    directionCards: data.directionCards.length,
  }, null, 2));
}
