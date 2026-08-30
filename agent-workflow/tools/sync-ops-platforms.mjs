import fs from "node:fs";
import path from "node:path";
import { publicVersionSources, sanitizeVersionResponse } from "./lib/ops-platforms.mjs";

// Only these public, read-only endpoints are allowed. Never persist raw responses.
const target = path.resolve("agent-workflow/reports/ops-platform-versions.json");
let previous = {};
try { previous = JSON.parse(fs.readFileSync(target, "utf8")); } catch { /* First sync. */ }
const sources = await Promise.all(publicVersionSources.map(async (source) => {
  const checkedAt = new Date().toISOString();
  const prior = previous.sources?.find((item) => item.id === source.id);
  try {
    const response = await fetch(source.url, { signal: AbortSignal.timeout(15000), redirect: "error" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const values = sanitizeVersionResponse(source, await response.json());
    return { id: source.id, status: "verified", checkedAt, verifiedAt: checkedAt, values };
  } catch {
    // Retain last verified values, explicitly mark the new attempt as unavailable.
    return { id: source.id, status: "unavailable", checkedAt, verifiedAt: prior?.verifiedAt || "", values: prior?.values || {} };
  }
}));
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify({ schemaVersion: 1, sources }, null, 2)}\n`);
for (const item of sources) console.log(`${item.id}: ${item.status}`);
if (sources.some((item) => item.status !== "verified")) process.exitCode = 1;
