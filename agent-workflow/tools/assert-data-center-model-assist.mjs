#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { evaluateModelAssistCandidate, readJson } from "./model-assist-v1.mjs";

const require = createRequire(import.meta.url);
const Ajv = require("ajv/dist/2020");
const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const assistRoot = path.join(root, "01-SiteV2", "content", "11-databases", "model-assist-v1");
const schema = readJson(path.join(root, "agent-workflow", "product", "model-assist-v1.schema.json"));
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function files() {
  if (!fs.existsSync(assistRoot)) return [];
  return fs.readdirSync(assistRoot).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name)).sort()
    .filter((name) => !args.get("date") || name === `${args.get("date")}.json`);
}

function main() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const problems = [];
  let candidates = 0;
  const statuses = {};
  for (const name of files()) {
    const store = readJson(path.join(assistRoot, name));
    if (!validate(store)) problems.push(`${name}:schema:${ajv.errorsText(validate.errors)}`);
    const raws = readJson(path.join(bundleRoot, store?.data_date || "", "raw-documents.json"), []);
    const rawById = new Map(raws.map((raw) => [raw.raw_id, raw]));
    for (const candidate of store?.candidates || []) {
      candidates += 1;
      statuses[candidate.status] = (statuses[candidate.status] || 0) + 1;
      const raw = rawById.get(candidate.raw_id);
      if (!raw) {
        problems.push(`${candidate.candidate_id}:raw_not_found`);
        continue;
      }
      const evaluation = evaluateModelAssistCandidate(candidate, raw.body_clean || "");
      if (["accepted", "requires_review"].includes(candidate.status) && evaluation.length) {
        problems.push(`${candidate.candidate_id}:${evaluation.join("|")}`);
      }
      if (candidate.task_type === "entity_resolution" && candidate.status !== "requires_review" && !["rejected", "stale"].includes(candidate.status)
          && !(candidate.status === "accepted" && candidate.review?.decision === "accept" && candidate.review?.reviewer)) {
        problems.push(`${candidate.candidate_id}:entity_candidate_not_isolated`);
      }
    }
  }
  console.log(JSON.stringify({ ok: !problems.length, files: files().length, candidates, statuses, problems: problems.slice(0, 50) }, null, 2));
  if (problems.length) process.exit(1);
}

main();
