#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || process.env.RUN_DATE || new Date().toISOString().slice(0, 10);
const dataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
const problems = [];
const unique = (values) => [...new Set(values.filter(Boolean))];

if (!fs.existsSync(dataFile)) problems.push("missing Business Signals frontstage data");
const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : {};
const activeDate = data.meta?.activeDate || "";
const allCards = Array.isArray(data.frontstageCards) ? data.frontstageCards : [];
const activeCards = allCards.filter((card) => card?.date === date);
const activeCardIds = new Set(activeCards.map((card) => card?.id).filter(Boolean));
const graph = data.relationshipGraph || {};
const graphEdges = Array.isArray(graph.edges) ? graph.edges : [];
const graphNodes = Array.isArray(graph.nodes) ? graph.nodes : [];

if (activeDate !== date) problems.push(`activeDate ${activeDate || "missing"} does not match ${date}`);
if (!activeCards.length) problems.push("active-date public Card count is 0");
for (const card of activeCards) {
  if (card.type !== "signal_card") problems.push(`non-signal Card entered public Card set: ${card.id || "missing-id"}`);
  if (!["product-service", "product_service", "funding", "case"].includes(card.category)) {
    problems.push(`invalid public Card category ${card.category || "missing"}: ${card.id || "missing-id"}`);
  }
}

if (graph.date !== date) problems.push(`relationship graph date ${graph.date || "missing"} does not match ${date}`);
if (activeCards.length && (!graphNodes.length || !graphEdges.length)) problems.push("relationship graph has no nodes or edges for active Cards");
for (const [index, edge] of graphEdges.entries()) {
  const cardIds = unique(Array.isArray(edge?.cardIds) ? edge.cardIds : []);
  if (!cardIds.length) problems.push(`relationship edge ${index + 1} has no Card evidence`);
  for (const cardId of cardIds) {
    if (!activeCardIds.has(cardId)) problems.push(`relationship edge ${index + 1} references non-active Card ${cardId}`);
  }
}

const result = {
  ok: problems.length === 0,
  date,
  active_date: activeDate || null,
  active_card_count: activeCards.length,
  relationship_node_count: graphNodes.length,
  relationship_edge_count: graphEdges.length,
  problems,
};
console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exit(1);
