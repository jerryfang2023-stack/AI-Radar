import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const projectRoot = path.resolve(siteRoot, "..", "..");
const dataDir = path.join(siteRoot, "data");
const bundleRoot = path.join(projectRoot, "01-SiteV2", "content", "11-databases", "data-center-v4");

async function readJson(file, fallback = {}) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function recentV4Days() {
  let entries = [];
  try {
    entries = await readdir(bundleRoot, { withFileTypes: true });
  } catch {
    return [];
  }
  const dates = entries
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse()
    .slice(0, 7);
  return Promise.all(dates.map(async (date) => {
    const manifest = await readJson(path.join(bundleRoot, date, "manifest.json"), {});
    const counts = manifest.counts || {};
    return {
      date,
      label: date.replaceAll("-", "."),
      shortLabel: date.slice(5).replace("-", "."),
      discovered: Number(counts.source_artifacts || 0),
      captured: Number(counts.raw_documents || 0),
      claims: Number(counts.claims || 0),
      events: Number(counts.canonical_events || 0),
      entities: Number(counts.entities || 0),
      relationships: Number(counts.relationships || 0),
      conflicts: Number(counts.event_conflicts || 0),
      qaQueue: Number(counts.qa_queue || 0),
    };
  }));
}

const telemetryFile = path.join(dataDir, "collection-telemetry-v1.json");
const telemetry = await readJson(telemetryFile, {});
const days = await recentV4Days();
const latest = days[0] || {};
const payload = {
  meta: {
    version: "OPS-V2.0.0-v4-telemetry",
    generatedAt: new Date().toISOString(),
    dateRange: days.length ? { start: days.at(-1).date, end: days[0].date } : null,
    source: "Data Center V4 manifest + collection-telemetry-v1",
    telemetryVersion: telemetry?.meta?.version || "",
  },
  stages: Array.isArray(telemetry.stages) ? telemetry.stages : [],
  latest: {
    ...latest,
    telemetryDate: telemetry?.meta?.data_date || "",
    collection: telemetry.collection || {},
    factBuild: telemetry.fact_build || {},
    applicationProjection: telemetry.application_projection || {},
    publication: telemetry.publication || {},
  },
  days,
  totals: days.reduce((acc, day) => {
    for (const key of ["discovered", "captured", "claims", "events", "entities", "relationships", "conflicts", "qaQueue"]) {
      acc[key] = (acc[key] || 0) + Number(day[key] || 0);
    }
    return acc;
  }, {}),
  v4Gate: telemetry.v4_gate || {},
  compatibility: telemetry.deprecated_compatibility || {
    status: "deprecated_non_blocking",
    warnings: ["collection telemetry has not been generated"],
  },
};

await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "pipeline-dashboard.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
await writeFile(path.join(dataDir, "pipeline-dashboard.js"), `window.WaveSightPipelineDashboard = ${JSON.stringify(payload, null, 2)};\n`, "utf8");
console.log(`Generated ${path.relative(projectRoot, path.join(dataDir, "pipeline-dashboard.json"))}`);
