#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const input = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
const tables = path.join(root, "data-lake/tables");

if (!fs.existsSync(input)) throw new Error("Frontstage entity projection is missing. Run npm run build:data-center-site first.");
const data = JSON.parse(fs.readFileSync(input, "utf8").replace(/^\uFEFF/u, ""));
const registry = (data.entityProfiles || []).map(({ timeline, viewpoints, groupedEventIds, relationIds, ...entity }) => entity);
const outputs = {
  entity_registry: registry,
  entity_profiles: data.entityProfiles || [],
  taxonomy_nodes: data.taxonomyNodes || [],
  entity_relationships: data.entityRelationships || []
};

fs.mkdirSync(tables, { recursive: true });
for (const [name, rows] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(tables, `${name}.jsonl`), rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
}

console.log(JSON.stringify({
  ok: true,
  entityVersion: data.meta?.entityVersion || "",
  relationshipVersion: data.meta?.relationshipVersion || "",
  tables: Object.fromEntries(Object.entries(outputs).map(([name, rows]) => [name, rows.length]))
}, null, 2));
