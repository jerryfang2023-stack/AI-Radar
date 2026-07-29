#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildOpportunityEvidenceData,
  writeOpportunityEvidenceData,
} from "../../../agent-workflow/tools/opportunity-evidence-v2.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, "../../..");

function parseArgs(argv = process.argv.slice(2)) {
  return new Map(argv.map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
}

export function buildIndustryReportsData(
  root = defaultRoot,
  {
    asOf = "",
    windowDays = 30,
    directionFile = path.join(root, "agent-workflow/product/opportunity-direction-cards.json"),
  } = {},
) {
  return buildOpportunityEvidenceData(root, {
    asOf,
    windowDays,
    directionFile,
  });
}

export function writeIndustryReportsData(root = defaultRoot, options = {}) {
  return writeOpportunityEvidenceData(root, options);
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  const root = args.get("root") ? path.resolve(args.get("root")) : defaultRoot;
  const { output, data } = writeIndustryReportsData(root, {
    asOf: args.get("date") || "",
    windowDays: Number(args.get("window-days") || 30),
  });
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, output).replace(/\\/gu, "/"),
    activeDate: data.meta.activeDate,
    evidence: data.evidence.length,
    directionCards: data.directionCards.length,
  }, null, 2));
}
