#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { isBusinessSignalsProductionReady } from "./lib/daily-production-chain-state.mjs";

const date = process.argv.find((arg) => arg.startsWith("--date="))?.slice(7) || "";
if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error("A production --date=YYYY-MM-DD is required");
let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "agent-workflow/reports", `${date}-persistent-asset-manifest.json`), "utf8"));
} catch { /* Missing or malformed evidence cannot suppress collection. */ }
const ok = isBusinessSignalsProductionReady(manifest, date);
console.log(JSON.stringify({ ok, date, stage: "business_signals_completion", reason: ok
  ? "Same-date general Business Signals intake and factual production completed"
  : "No accepted general Business Signals completion receipt; shared V4 data alone is insufficient" }));
if (!ok) process.exitCode = 1;
