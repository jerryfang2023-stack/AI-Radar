#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildSourceIntake, mergeSourceIntakes } from "./lib/source-intake-v1.mjs";
import { loadPrivateEvidenceEntries, loadPrivateEvidenceStore, loadPrivateEvidenceRecord } from "./lib/private-evidence-store.mjs";
import { buildChinaFundingHealth } from "./lib/china-funding-health.mjs";
import { historyWindows } from "./collect-china-funding-history.mjs";

const urlKey = (url) => String(url || "").replace(/[?#].*$/u, "").replace(/\/$/u, "");
export function uncapturedChinaFundingItems(discovery, accepted) {
  const captured = new Set((accepted?.source_artifacts || []).flatMap((item) => [item.source_url, item.canonical_url]).filter(Boolean).map(urlKey));
  return (discovery.items || []).filter((item) => !captured.has(urlKey(item.url)));
}
export function selectChinaFundingIntake(intake, discovery) {
  const urls = new Set(discovery.items.map((item) => urlKey(item.url)));
  const sourceArtifacts = intake.source_artifacts.filter((item) => [item.source_url, item.canonical_url].some((url) => urls.has(urlKey(url))));
  const ids = new Set(sourceArtifacts.map((item) => item.source_artifact_id));
  const rawDocuments = intake.raw_documents.filter((item) => ids.has(item.source_artifact_id));
  // SOURCE-INTAKE-V1.1 has no body_length; that field belongs to the built RAW-V4 bundle.
  if (!rawDocuments.some((item) => ["accepted", "partial"].includes(item.extraction_status) && item.body_ref?.startsWith("evidence://"))) throw new Error("No accepted private original evidence for China funding candidates");
  return mergeSourceIntakes({ ...intake, source_artifacts: sourceArtifacts, raw_documents: rawDocuments });
}

function recoverPrivateIntake(root, date, discovery, allDates = false) {
  const urls = new Set(discovery.items.map((item) => urlKey(item.url)));
  const originals = allDates ? loadPrivateEvidenceStore(root).catalog.filter((entry) => urls.has(urlKey(entry.source_url))).map((entry) => {
    const loaded = loadPrivateEvidenceRecord(root, entry.snapshot_ref, entry.content_hash);
    return { raw: loaded.raw, file: loaded.logicalFile };
  }) : loadPrivateEvidenceEntries(root, date);
  const entries = originals
    .filter(({ raw }) => [raw.original_url, raw.canonical_url, raw.source_url].some((url) => urls.has(urlKey(url))))
    .map(({ raw, file }) => ({ record: raw, jsonPath: file, pooled: (raw.pool_routes || []).length > 0 }));
  const intake = buildSourceIntake({ root, date, entries });
  for (const document of intake.raw_documents) document.body_ref = `evidence://${document.content_hash}`;
  for (const artifact of intake.source_artifacts) artifact.snapshot_refs = [`evidence://${artifact.content_hash}`];
  return selectChinaFundingIntake(intake, discovery);
}

export function chinaFundingPlan(date, sourceDir, { rawLimit = 168 } = {}) {
  const tool = (name, ...args) => [`agent-workflow/tools/${name}.mjs`, ...args];
  const site = (name) => [`01-SiteV2/site/scripts/${name}.mjs`];
  return [
    { id: "capture", commands: [tool("run-guanlan-daily-monitor", `--date=${date}`, `--source-artifact-dir=${sourceDir}`, "--use-source-artifacts=true", "--targeted-source-artifacts=true", "--merge-existing-intake=true", "--raw-min=1", `--raw-max=${rawLimit}`, `--raw-target=${rawLimit}`), tool("backup-private-evidence"), tool("migrate-private-evidence-source", "--delete-public-originals=true"), tool("assert-public-evidence-boundary"), tool("assert-private-evidence-backup", `--date=${date}`)] },
    { id: "facts", commands: [tool("build-data-center-v4", `--date=${date}`), tool("generate-data-center-model-assist", `--date=${date}`, "--write=true", "--concurrency=2", "--reuse-existing=true"), tool("assert-data-center-model-assist", `--date=${date}`), tool("backfill-source-title-translations", `--date=${date}`, "--write=true", "--concurrency=3"), tool("build-data-center-v4", `--date=${date}`), tool("assert-data-center-v4", `--date=${date}`), tool("assert-china-market-v1", `--date=${date}`, "--stage=bundle")] },
    { id: "projections", commands: [tool("sync-light-data-lake", "--v4-only=true", "--duckdb=skip"), tool("assert-data-lake-v4", "--duckdb=skip"), site("build-data-center-v4-frontstage"), tool("materialize-entity-history-v1"), tool("assert-entity-history-v1"), tool("generate-funding-insights-deepseek", `--date=${date}`, "--write=true"), tool("assert-funding-insights-v1", `--date=${date}`), site("build-funding-insights-frontstage"), tool("translate-public-structured-fields-deepseek", "--write=true"), tool("classify-funding-taxonomy-v4-1", "--write=true", "--apply=true"), tool("project-funding-taxonomy-to-events-v4-1"), tool("sync-light-data-lake", "--v4-only=true", "--duckdb=skip"), tool("assert-data-lake-v4", "--duckdb=skip"), site("build-funding-insights-frontstage"), tool("build-investment-institutions-v1"), tool("assert-investment-institutions-v1"), site("build-data-center-v4-frontstage"), tool("materialize-entity-history-v1"), tool("assert-entity-history-v1"), site("build-trend-radar-frontstage"), tool("assert-trend-radar-v1"), site("build-industry-reports-frontstage"), tool("sync-light-data-lake", "--v4-only=true", "--duckdb=skip"), tool("assert-data-lake-v4", "--duckdb=skip"), tool("assert-funding-insights-v1", "--all=true", "--frontstage=true"), tool("assert-taxonomy-consistency-v4-1"), tool("assert-public-evidence-boundary")] },
  ];
}

function main() {
  const args = new Map(process.argv.slice(2).map((arg) => { const [key, ...rest] = arg.replace(/^--/u, "").split("="); return [key, rest.join("=")]; }));
  const root = process.cwd();
  const date = args.get("date") || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error("Invalid date");
  const historyFrom = args.get("history-from") || "";
  const historyTo = args.get("history-to") || "";
  if (historyFrom || historyTo) historyWindows(historyFrom, historyTo, date);
  if (historyFrom) {
    process.env.MODEL_ASSIST_MODEL = "gpt-5.6-terra";
    process.env.MODEL_ASSIST_SOURCE_REFS_FILE = path.join(root, `01-SiteV2/content/11-databases/data-center-v4/${date}/historical-funding-authorization.json`);
  }
  const laneDir = historyFrom ? `agent-workflow/reports/china-funding-history/${historyFrom}_${historyTo}` : `agent-workflow/reports/china-funding/${date}`;
  const sourceDir = args.get("source-dir") || laneDir;
  const read = (file, fallback = null) => fs.existsSync(path.resolve(root, file)) ? JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8")) : fallback;
  const write = (file, payload) => { const target = path.resolve(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`); };
  const plan = chinaFundingPlan(date, sourceDir, { rawLimit: historyFrom ? 1260 : 168 });
  if (historyFrom) for (const stage of plan) for (const command of stage.commands) {
    if (command[0].endsWith("/generate-data-center-model-assist.mjs")) command.splice(0, command.length, "agent-workflow/tools/extract-china-funding-history.mjs", `--date=${date}`);
    if (command[0].endsWith("/generate-funding-insights-deepseek.mjs")) command.push("--market-region=CN", `--checkpoint-dir=${laneDir}/card-checkpoints`);
    if (command[0].endsWith("/migrate-private-evidence-source.mjs")) command.push(`--date=${date}`);
    if (command[0].endsWith("/run-guanlan-daily-monitor.mjs")) command.push(`--monitor-log-file=${laneDir}/capture-log.md`);
  }
  if (historyFrom) {
    const facts = plan.find((stage) => stage.id === "facts");
    facts.commands.splice(1, 0, ["agent-workflow/tools/repair-china-funding-source-dates.mjs", `--date=${date}`], ["agent-workflow/tools/build-data-center-v4.mjs", `--date=${date}`]);
  }
  if (args.get("dry-run") === "true") { console.log(JSON.stringify(plan, null, 2)); return; }
  const discovery = read(`${sourceDir}/china-funding-source-intake-candidates.json`);
  if (discovery?.date !== date) throw new Error("Missing same-date China funding discovery");
  if (historyFrom && (discovery.history?.from !== historyFrom || discovery.history?.to !== historyTo)) throw new Error("Historical discovery does not match the authorized range");
  const intakeFile = `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`;
  const acceptedFile = `${laneDir}/accepted-intake.json`;
  const statusFile = `${laneDir}/pipeline.json`;
  const previous = read(statusFile, {});
  const stages = [];
  const command = (args) => {
    console.log(`China funding: ${args.join(" ")}`);
    const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit", windowsHide: true });
    if (result.status !== 0 || result.error) {
      // Match the overseas contract: isolated model candidate failures are quarantined.
      // The immediately following strict model-assist assertion still gates accepted facts.
      if (!historyFrom && !result.error && args[0].endsWith("/generate-data-center-model-assist.mjs")) {
        console.warn("Model assist reported candidate failures; validating the accepted subset next.");
        return;
      }
      throw new Error(`Command failed: ${args[0]} (${result.status ?? result.error?.message})`);
    }
  };
  let failed = null;
  try {
    if (!discovery.items?.length) throw new Error("No source candidates: retain last-good factual data; inspect per-source status");
    for (const stage of plan) {
      const state = { id: stage.id, status: "running", started_at: new Date().toISOString() };
      stages.push(state);
      try {
        if (stage.id === "facts" && historyFrom) {
          const authorizationFile = `01-SiteV2/content/11-databases/data-center-v4/${date}/historical-funding-authorization.json`;
          const previousAuthorization = read(authorizationFile, {});
          const accepted = read(acceptedFile);
          if (previousAuthorization.from && (previousAuthorization.from !== historyFrom || previousAuthorization.to !== historyTo)) throw new Error("Historical authorization range conflict; preserve prior accepted policy");
          write(authorizationFile, { schema_version: "CHINA-FUNDING-HISTORY-AUTHORIZATION-V1.0", from: historyFrom, to: historyTo,
            reuse_existing_private_originals: true,
            preserve_published_source_refs: previousAuthorization.preserve_published_source_refs || [],
            authorized_by: "explicit_user_request_2026_china_funding_backfill", created_at: previousAuthorization.created_at || new Date().toISOString(),
            source_refs: [...new Set([...(previousAuthorization.source_refs || []), ...accepted.source_artifacts.map((item) => item.source_artifact_id)])].sort() });
        }
        if (stage.id === "capture" && previous.stages?.some((item) => item.id === "capture")) {
          // A failed handoff can still have durable private originals. Hydrate those offline.
          const priorAccepted = read(acceptedFile) || recoverPrivateIntake(root, date, discovery);
          const accepted = historyFrom && args.get("append-new-sources") === "true"
            ? mergeSourceIntakes(recoverPrivateIntake(root, date, discovery, true), priorAccepted) : priorAccepted;
          write(acceptedFile, accepted);
          // The freshly checked-out main wins for shared IDs; the independent intake adds new IDs.
          write(intakeFile, mergeSourceIntakes(accepted, read(intakeFile) || accepted));
          state.reused = true;
          const delta = uncapturedChinaFundingItems(discovery, accepted);
          if (delta.length && args.get("append-new-sources") === "true") {
            const deltaDir = `${laneDir}/capture-delta`;
            write(`${deltaDir}/china-funding-source-intake-candidates.json`, { ...discovery, items: delta, source_item_count: delta.length, discovered_count: delta.length });
            state.source_stage_reason = "explicit_user_systematic_backfill_new_sources_only";
            state.reused_source_count = accepted.source_artifacts.length;
            state.new_candidate_count = delta.length;
            for (const original of stage.commands) command(original.map((arg) => arg.startsWith("--source-artifact-dir=") ? `--source-artifact-dir=${deltaDir}` : arg));
            write(acceptedFile, selectChinaFundingIntake(read(intakeFile), discovery));
            state.status = "passed";
            if (args.get("stop-after") === stage.id) break;
            continue;
          }
          const capturePassed = previous.stages.some((item) => item.id === "capture" && item.status === "passed") && fs.existsSync(path.resolve(root, acceptedFile));
          if (capturePassed) {
            state.reused_accepted_capture = true;
            state.status = "passed";
            if (args.get("stop-after") === stage.id) break;
            continue;
          }
          // Last-good rollback also restores the public locator index. Rebuild it offline.
          command(["agent-workflow/tools/migrate-private-evidence-source.mjs", "--delete-public-originals=true", ...(historyFrom ? [`--date=${date}`] : [])]);
          command(["agent-workflow/tools/assert-public-evidence-boundary.mjs"]);
          command(["agent-workflow/tools/assert-private-evidence-backup.mjs", `--date=${date}`]);
          write(acceptedFile, selectChinaFundingIntake(accepted, discovery));
        } else {
          for (const args of stage.commands) command(args);
          if (stage.id === "capture") {
            const intake = read(intakeFile);
            write(acceptedFile, selectChinaFundingIntake(intake, discovery));
          }
        }
        state.status = "passed";
        if (args.get("stop-after") === stage.id) break;
      } catch (error) { state.status = "failed"; state.error = error.message; throw error; }
      finally { state.finished_at = new Date().toISOString(); write(statusFile, { date, stages }); }
    }
  } catch (error) { failed = error; }
  const bundle = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  const health = buildChinaFundingHealth({ date, discovery, stages: failed && !stages.length ? [{ id: "discovery", status: "failed", error: failed.message }] : stages,
    raw: read(`${bundle}/raw-documents.json`, []), artifacts: read(`${bundle}/source-artifacts.json`, []), claims: read(`${bundle}/claims.json`, []), events: read(`${bundle}/canonical-events.json`, []), entities: read(`${bundle}/entities.json`, []), cards: read("01-SiteV2/site/data/funding-insights-v1.json", {}).cards || [] });
  if (historyFrom) health.history = { from: historyFrom, to: historyTo, mode: "historical_backfill", models: discovery.history.models };
  write(`${laneDir}/health.json`, health);
  write(`01-SiteV2/site/data/china-funding${historyFrom ? "-history" : ""}-health-v1.json`, health);
  if (historyFrom) command(["agent-workflow/tools/build-china-funding-history-quality.mjs"]);
  command(["agent-workflow/tools/build-ops-console-data.mjs"]);
  if (failed) { console.error(failed.message); process.exitCode = 1; }
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
