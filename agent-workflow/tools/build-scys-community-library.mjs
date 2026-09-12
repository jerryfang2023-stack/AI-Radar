import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeDocumentLinks, buildDocumentIndex, documentKey } from "../../01-SiteV2/site/scripts/community-document-links.mjs";
import "../../01-SiteV2/site/assets/scys-community-model.js";

import { resolveScysOriginalLinks } from "./lib/scys-original-links.mjs";

export function buildLibrary(snapshots, resolutions = []) {
  const { key, version } = globalThis.ScysCommunityModel;
  const byKey = new Map();
  const expectedLinks = new Set();
  for (const { date, payload } of [...snapshots].sort((a, b) => a.date.localeCompare(b.date))) {
    for (const item of payload.items || []) {
      if (item.source !== "scys") continue;
      const previous = byKey.get(key(item));
      const record = {};
      // Explicit public projection: never serialize original bodies or account state.
      for (const field of ["id", "source", "sourceName", "title", "url", "author", "publishedAt", "relativeTime", "summary", "evidence", "excerpt", "bodyRef", "relatedResources", "scene", "industry", "tools", "insightType"])
        if (item[field] !== undefined) record[field] = item[field];
      record.bodyRef ||= previous?.bodyRef;
      record.relatedResources = record.relatedResources?.length ? record.relatedResources : previous?.relatedResources || [];
      record.links = mergeDocumentLinks([...(previous?.links || []), ...(item.links || [])]);
      record.firstSeen = previous?.firstSeen || date;
      record.lastSeen = date;
      byKey.set(key(item), record);
      for (const link of mergeDocumentLinks(item.links || [])) expectedLinks.add(documentKey(link.href));
    }
  }
  const archived = [...byKey.values()].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen) || a.id.localeCompare(b.id));
  const { items, unresolved } = resolveScysOriginalLinks(archived, resolutions);
  const resources = buildDocumentIndex(items);
  const actual = new Set(resources.map((link) => documentKey(link.href)));
  if ([...expectedLinks].some((href) => !actual.has(href))) throw new Error("Historical SCYS resource retention failed");
  return { meta: { columnVersion: version, latestDate: snapshots.map((x) => x.date).sort().at(-1) || "", snapshots: snapshots.length, dateBasis: "collection_snapshot", missingOriginalLinks: unresolved.length }, items, resources, missingOriginalLinkIds: unresolved };
}

export function buildScysLibrary(root = process.cwd(), { check = false } = {}) {
  const dir = path.join(root, "01-SiteV2/site/data/community-intelligence-daily");
  const snapshots = fs.readdirSync(dir).filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map((file) => ({ date: file.slice(0, 10), payload: JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) }));
  const latest = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/community-intelligence.json"), "utf8"));
  const date = latest.meta.date || latest.meta.generatedAt.slice(0, 10);
  const existing = snapshots.find((entry) => entry.date === date);
  if (existing) existing.payload = latest;
  else snapshots.push({ date, payload: latest });
  const resolutionPath = path.join(root, "01-SiteV2/site/data/scys-original-link-resolutions.json");
  const resolutions = fs.existsSync(resolutionPath) ? JSON.parse(fs.readFileSync(resolutionPath, "utf8")).resolutions : [];
  const result = buildLibrary(snapshots, resolutions);
  const body = `${JSON.stringify(result, null, 2)}\n`;
  const target = path.join(root, "01-SiteV2/site/data/scys-community-library.json");
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== body) throw new Error("SCYS library is stale; rebuild from accepted snapshots");
  } else fs.writeFileSync(target, body);
  return { missingOriginalLinks: result.meta.missingOriginalLinks, items: result.items.length, resources: result.resources.length, snapshots: snapshots.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ ok: true, ...buildScysLibrary(process.cwd(), { check: process.argv.includes("--check") }) }));
}
