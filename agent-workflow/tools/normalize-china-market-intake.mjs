#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizeSourceIntakeMarketScopes,
  readSourceIntake,
} from "./lib/source-intake-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const date = process.argv.find((value) => value.startsWith("--date="))?.slice("--date=".length) || "";
if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
  throw new Error(`Invalid China market intake normalization date: ${date || "missing"}`);
}

const intake = readSourceIntake(root, date);
if (!intake) throw new Error(`Structured source intake is missing for ${date}`);
const normalized = normalizeSourceIntakeMarketScopes(intake.payload);
if (normalized.changed) {
  fs.writeFileSync(intake.file, `${JSON.stringify(normalized.payload, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  ok: true,
  date,
  normalized_documents: normalized.changed,
  file: path.relative(root, intake.file).replaceAll("\\", "/"),
}, null, 2));
