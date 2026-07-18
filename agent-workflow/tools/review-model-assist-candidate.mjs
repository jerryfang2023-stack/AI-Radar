#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson } from "./model-assist-v1.mjs";

const root = process.cwd();
const assistRoot = path.join(root, "01-SiteV2", "content", "11-databases", "model-assist-v1");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const candidateId = args.get("candidate");
const reviewer = args.get("reviewer");
const decision = args.get("decision");
const note = args.get("note") || "";

function main() {
  if (!candidateId || !reviewer || !["accept", "reject"].includes(decision)) {
    throw new Error("candidate, reviewer, and decision=accept|reject are required");
  }
  const fileNames = fs.readdirSync(assistRoot).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name)).sort();
  for (const name of fileNames) {
    const file = path.join(assistRoot, name);
    const store = readJson(file);
    const candidate = store?.candidates?.find((item) => item.candidate_id === candidateId);
    if (!candidate) continue;
    if (candidate.task_type !== "entity_resolution" && candidate.task_type !== "qa_repair") {
      throw new Error("only entity_resolution and qa_repair candidates require explicit review");
    }
    candidate.review = { decision, reviewer, reviewed_at: new Date().toISOString(), note };
    candidate.status = decision === "accept" ? "accepted" : "rejected";
    writeJson(file, store);
    if (decision === "accept" && candidate.task_type === "entity_resolution") {
      const decisionsFile = path.join(assistRoot, "entity-resolution-decisions.json");
      const decisions = readJson(decisionsFile, { schema_version: "ENTITY-RESOLUTION-DECISIONS-V1", decisions: [] });
      const row = {
        candidate_id: candidate.candidate_id,
        candidate_name: candidate.proposal.candidate_name || "",
        canonical_name: candidate.proposal.canonical_name || "",
        resolution: candidate.proposal.decision || "unknown",
        evidence: candidate.evidence,
        reviewer,
        reviewed_at: candidate.review.reviewed_at,
        note,
      };
      const index = decisions.decisions.findIndex((item) => item.candidate_id === candidate.candidate_id);
      if (index >= 0) decisions.decisions[index] = row; else decisions.decisions.push(row);
      writeJson(decisionsFile, decisions);
    }
    console.log(JSON.stringify({ ok: true, candidate_id: candidateId, task_type: candidate.task_type, decision, reviewer, file: path.relative(root, file).replace(/\\/gu, "/") }, null, 2));
    return;
  }
  throw new Error(`candidate not found: ${candidateId}`);
}

main();
