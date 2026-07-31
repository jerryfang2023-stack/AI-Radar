#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  mergeSourceIntakes,
  readSourceIntake,
  sourceIntakePath,
} from "./lib/source-intake-v1.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = String(args.get("date") || "").trim();
const gitRef = String(args.get("git-ref") || "").trim();

if (!/^\d{4}-\d{2}-\d{2}$/u.test(date) || !gitRef) {
  throw new Error("Usage: merge-source-intake-v1.mjs --date=YYYY-MM-DD --git-ref=<ref>");
}

const current = readSourceIntake(root, date);
if (!current) throw new Error(`Current structured source intake is missing for ${date}`);
const repositoryPath = path.relative(root, sourceIntakePath(root, date)).replaceAll("\\", "/");
const historical = JSON.parse(execFileSync(
  "git",
  ["show", `${gitRef}:${repositoryPath}`],
  { cwd: root, encoding: "utf8", windowsHide: true },
));
const merged = mergeSourceIntakes(historical, current.payload);
fs.writeFileSync(current.file, `${JSON.stringify(merged, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  ok: true,
  date,
  git_ref: gitRef,
  counts: merged.counts,
}, null, 2));
