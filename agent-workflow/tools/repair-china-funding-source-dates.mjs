#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chinaFundingArticleHtml } from "./lib/china-funding-html.mjs";

export function publisherDateObservation(html, url) {
  for (const match of html.matchAll(/<meta\b[^>]*>/giu)) {
    const attrs = Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/gu)].map((item) => [item[1].toLowerCase(), item[2]]));
    if (!/^(?:article:published_time|pubdate|publishdate|publish_date|publication_date|datepublished|date)$/iu.test(attrs.property || attrs.name || "")) continue;
    const value = (attrs.content || "").trim();
    if (!/^20\d{2}[-/]\d{2}[-/]\d{2}/u.test(value)) continue;
    const normalized = value.replace(/\//gu, "-").replace(" ", "T");
    const stamp = /(?:Z|[+-]\d{2}:?\d{2})$/u.test(normalized) ? normalized : `${normalized.length === 10 ? `${normalized}T00:00:00` : normalized}+08:00`;
    if (!Number.isNaN(Date.parse(stamp))) return { published_at: stamp, method: "publisher_publication_meta", evidence: match[0] };
  }
  const visible = chinaFundingArticleHtml(html, url);
  return visible?.published_at ? { published_at: visible.published_at, method: visible.method, evidence: visible.published_at } : null;
}

async function main() {
  const root = process.cwd();
  const date = process.argv.find((arg) => arg.startsWith("--date="))?.slice(7) || "2026-09-12";
  const base = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const policy = read(`${base}/historical-funding-authorization.json`);
  const authorized = new Set(policy.source_refs);
  const lane = `agent-workflow/reports/china-funding-history/${policy.from}_${policy.to}`;
  const file = `${lane}/publication-date-repairs.json`;
  const prior = fs.existsSync(file) ? read(file).items : [];
  const observations = new Map(prior.map((item) => [item.raw_id, item]));
  const rows = read(`${base}/raw-documents.json`).filter((raw) => authorized.has(raw.source_artifact_id) && !raw.published_at && !observations.has(raw.raw_id)
    && !/\/company\/|\/invest\/|pitchhub\./u.test(raw.source_url));
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < rows.length) {
      const raw = rows[cursor++];
      let record;
      try {
        const response = await fetch(raw.source_url, { signal: AbortSignal.timeout(25000), headers: { "user-agent": "Mozilla/5.0 (compatible; WaveSight source-date verification)" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const observation = publisherDateObservation(await response.text(), raw.source_url);
        record = { status: observation ? "verified" : "unresolved", ...observation };
      } catch (error) { record = { status: "failed", reason: error.message }; }
      observations.set(raw.raw_id, { raw_id: raw.raw_id, source_ref: raw.source_artifact_id, source_url: raw.source_url, original_content_hash: raw.content_hash, checked_at: new Date().toISOString(), ...record });
      fs.writeFileSync(file, JSON.stringify({ schema_version: "CHINA-FUNDING-PUBLICATION-DATE-REPAIRS-V1.0", items: [...observations.values()] }, null, 2) + "\n");
    }
  }));
  let applied = 0;
  for (const intakeFile of [`01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`, `${lane}/accepted-intake.json`]) {
    const intake = read(intakeFile);
    for (const doc of intake.raw_documents || []) {
      const observation = [...observations.values()].find((item) => item.source_ref === doc.source_artifact_id && item.original_content_hash === doc.content_hash && item.status === "verified");
      if (doc.published_at || !observation) continue;
      doc.published_at = observation.published_at;
      applied++;
    }
    fs.writeFileSync(intakeFile, JSON.stringify(intake, null, 2) + "\n");
  }
  console.log(JSON.stringify({ checked: rows.length, verified: [...observations.values()].filter((item) => item.status === "verified").length, applied }));
}
if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
