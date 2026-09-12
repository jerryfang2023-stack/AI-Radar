import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { connectScysMcp } from "./lib/scys-mcp-client.mjs";
import { loadPrivateEvidenceRecord } from "./lib/private-evidence-store.mjs";
import { resourceKeyword, relatedScysResources } from "../../01-SiteV2/site/scripts/collect-scys-mcp.mjs";

// Resume association enrichment from accepted evidence; never re-search/re-read posts.
const root = process.cwd();
const file = path.join(root, "01-SiteV2/site/data/community-intelligence.json");
const payload = JSON.parse(fs.readFileSync(file, "utf8"));
const client = await connectScysMcp({ root });
const cache = new Map();
const checkpointFile = path.join(process.env.LOCALAPPDATA, "WaveSight/runtime", `scys-resources-${payload.meta.date}.json`);
const checkpoint = fs.existsSync(checkpointFile) ? JSON.parse(fs.readFileSync(checkpointFile, "utf8")) : {};
const call = async (tool, args) => {
  const key = crypto.createHash("sha256").update(JSON.stringify({ tool, args })).digest("hex");
  if (checkpoint[key]) return checkpoint[key];
  const result = await client.call(tool, args);
  checkpoint[key] = result;
  fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint));
  return result;
};
let updated = 0;
try {
  for (const item of payload.items.filter((entry) => entry.acquisition === "scys-mcp")) {
    const saved = loadPrivateEvidenceRecord(root, item.bodyRef);
    const raw = JSON.parse(saved.body);
    const keyword = resourceKeyword({ title: item.title, original: raw.articleContent, merged: raw.articleContentContainFeishuDoc }, item.collection);
    if (!cache.has(keyword)) {
      try { cache.set(keyword, await relatedScysResources(call, keyword)); }
      catch (error) { throw new Error(`${error.message}:query=${keyword}:retryAfterSeconds=${error.retryAfterSeconds ?? "unavailable"}`); }
    }
    item.relatedResources = cache.get(keyword);
    updated++;
  }
  payload.meta.resourceEnrichment = { updatedAt: new Date().toISOString(), reusedPrivateEvidence: true, updated, warnings: [...cache.values()].flatMap((resources) => resources.warnings || []) };
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(file, body);
  fs.writeFileSync(path.join(root, `01-SiteV2/site/data/community-intelligence-daily/${payload.meta.date}.json`), body);
  console.log(JSON.stringify({ ok: true, updated, keywords: [...cache.keys()], resources: [...cache.values()].flat().length }));
} finally { client.close(); }
