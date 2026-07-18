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

function parseArgs(argv = process.argv.slice(2)) {
  return new Map(argv.map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

export function buildIndustryReportsData(root = defaultRoot) {
  const input = path.join(root, "01-SiteV2/site/data/v3-data-observation-desk.json");
  const payload = readJson(input);
  const allCards = (payload.cards || []).filter((card) => card.category !== "opinion" && card.date);
  const activeDate = payload.meta?.activeDate || allCards.map((card) => card.date).sort().at(-1) || "";
  const cards = allCards
    .filter((card) => dateDistance(activeDate, card.date) >= 0 && dateDistance(activeDate, card.date) < 30)
    .map((card) => ({
      id: card.id,
      title: card.title,
      category: card.category,
      categoryLabel: card.categoryLabel || "",
      date: card.date,
      sourceName: card.sourceName || "",
      subject: card.subject || "",
      opportunitySignals: {
        labels: Object.fromEntries(mapFields.map((field) => [field, signalValues(card, field)])),
      },
    }));

  return {
    meta: {
      schemaVersion: "INDUSTRY-REPORTS-FRONTSTAGE-V1.0",
      siteVersion: "SITE-V4.2.0-entity-history",
      applicationVersion: "OMAP-V1.0.0-independent-column",
      opportunityMapVersion: "OMAP-V1.0.0-independent-column",
      activeDate,
      generatedAt: payload.meta?.generatedAt || `${activeDate}T00:00:00.000Z`,
      windowDays: 30,
      cardCount: cards.length,
    },
    cards,
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
  }, null, 2));
}
