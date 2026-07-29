#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  buildCollectionTelemetry,
  COLLECTION_TELEMETRY_VERSION,
} from "./lib/collection-telemetry-v1.mjs";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const root = path.resolve(args.get("root") || process.cwd());
const date = args.get("date") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const output = path.resolve(root, args.get("output") || "01-SiteV2/site/data/collection-telemetry-v1.json");
const telemetry = buildCollectionTelemetry({
  root,
  date,
  outcomes: {
    opportunity: args.get("opportunity"),
    trend: args.get("trend"),
    funding: args.get("funding"),
    lenses: args.get("lenses"),
    publication: args.get("publication"),
  },
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(telemetry, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  ok: telemetry.v4_gate.status === "passed",
  version: COLLECTION_TELEMETRY_VERSION,
  date,
  output: path.relative(root, output).replace(/\\/gu, "/"),
  stages: telemetry.stages.map(({ id, status }) => ({ id, status })),
}, null, 2));
if (telemetry.v4_gate.status !== "passed") process.exit(1);
