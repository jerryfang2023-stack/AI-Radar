#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { collectAIHotFeed } from "./lib/aihot-feed.mjs";
const args = new Map(process.argv.slice(2).map((v) => { const [k,...r] = v.replace(/^--/u, "").split("="); return [k,r.join("=")]; }));
if (!args.get("output")) throw new Error("--output=<private-runtime-directory> required");
const dir = path.resolve(args.get("output")); fs.mkdirSync(dir, { recursive: true });
const result = await collectAIHotFeed({ window: args.get("window") || "7d", maxPages: Number(args.get("max-pages") || 100),
  onPage: (page) => fs.writeFileSync(path.join(dir, `page-${page.page}.json`), JSON.stringify(page)) });
fs.writeFileSync(path.join(dir, "funding-leads.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, items: undefined, funding_leads: result.items.length, output: dir }, null, 2));
if (!result.complete) process.exitCode = 1;
