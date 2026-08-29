#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { V3_RETIRED_COMPATIBILITY } from "./lib/collection-telemetry-v1.mjs";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function updateStage(stages, status, evidence) {
  return (Array.isArray(stages) ? stages : []).map((stage) => (
    stage.id === "publication"
      ? { ...stage, status, deployment: evidence }
      : stage
  ));
}

export function finalizeOpsPublicationData({
  root,
  status = "passed",
  commit = "",
  runUrl = "",
  deployedAt = new Date().toISOString(),
}) {
  const dataDir = path.join(root, "01-SiteV2", "site", "data");
  const evidence = {
    status,
    phase: "artifact_ready_for_deployment",
    authoritative: false,
    commit,
    run_url: runUrl,
    deployed_at: deployedAt,
  };

  const telemetryFile = path.join(dataDir, "collection-telemetry-v1.json");
  const telemetry = readJson(telemetryFile);
  telemetry.publication = evidence;
  telemetry.stages = updateStage(telemetry.stages, status, evidence);
  telemetry.deprecated_compatibility = {
    ...V3_RETIRED_COMPATIBILITY,
    warnings: [],
  };
  writeJson(telemetryFile, telemetry);

  const pipelineFile = path.join(dataDir, "pipeline-dashboard.json");
  const pipeline = readJson(pipelineFile);
  pipeline.meta = { ...pipeline.meta, deployment: evidence };
  pipeline.stages = updateStage(pipeline.stages, status, evidence);
  pipeline.latest = {
    ...pipeline.latest,
    publication: evidence,
  };
  writeJson(pipelineFile, pipeline);
  fs.writeFileSync(
    path.join(dataDir, "pipeline-dashboard.js"),
    `window.WaveSightPipelineDashboard = ${JSON.stringify(pipeline, null, 2)};\n`,
    "utf8",
  );

  const opsFile = path.join(dataDir, "ops-console.json");
  const ops = readJson(opsFile);
  ops.meta = { ...ops.meta, deployment: evidence };
  ops.tasks = {
    ...ops.tasks,
    stages: updateStage(ops.tasks?.stages, status, evidence),
  };
  ops.quality = {
    ...ops.quality,
    pipelineMeta: {
      ...ops.quality?.pipelineMeta,
      deployment: evidence,
    },
    latest: {
      ...ops.quality?.latest,
      publication: evidence,
    },
    telemetry: {
      ...ops.quality?.telemetry,
      publication: evidence,
      compatibility: {
        ...V3_RETIRED_COMPATIBILITY,
        warnings: [],
      },
    },
  };
  writeJson(opsFile, ops);
  fs.writeFileSync(
    path.join(dataDir, "ops-console.js"),
    `window.WaveSightOpsConsole = ${JSON.stringify(ops, null, 2)};\n`,
    "utf8",
  );

  return evidence;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/u, "$1"));
if (isDirectRun) {
  const args = new Map(process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
  const evidence = finalizeOpsPublicationData({
    root: path.resolve(args.get("root") || process.cwd()),
    status: args.get("status") || "passed",
    commit: args.get("commit") || "",
    runUrl: args.get("run-url") || "",
  });
  console.log(JSON.stringify({ ok: true, publication: evidence }, null, 2));
}
