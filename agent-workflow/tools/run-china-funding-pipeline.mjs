#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mergeSourceIntakes } from "./lib/source-intake-v1.mjs";
import { buildChinaFundingHealth } from "./lib/china-funding-health.mjs";

export function chinaFundingPlan(date, sourceDir) {
  const tool = (name, ...args) => [`agent-workflow/tools/${name}.mjs`, ...args];
  const site = (name) => [`01-SiteV2/site/scripts/${name}.mjs`];
  return [
    { id: "capture", commands: [tool("run-guanlan-daily-monitor", `--date=${date}`, `--source-artifact-dir=${sourceDir}`, "--use-source-artifacts=true", "--targeted-source-artifacts=true", "--merge-existing-intake=true", "--raw-min=1", "--raw-max=168", "--raw-target=168"), tool("backup-private-evidence"), tool("migrate-private-evidence-source", "--delete-public-originals=true"), tool("assert-public-evidence-boundary"), tool("assert-private-evidence-backup", `--date=${date}`)] },
    { id: "facts", commands: [tool("build-data-center-v4", `--date=${date}`), tool("generate-data-center-model-assist", `--date=${date}`, "--write=true", "--concurrency=2", "--reuse-existing=true"), tool("assert-data-center-model-assist", `--date=${date}`), tool("backfill-source-title-translations", `--date=${date}`, "--write=true", "--concurrency=3"), tool("build-data-center-v4", `--date=${date}`), tool("assert-data-center-v4", `--date=${date}`), tool("assert-china-market-v1", `--date=${date}`, "--stage=bundle")] },
    { id: "projections", commands: [tool("sync-light-data-lake", "--v4-only=true", "--duckdb=skip"), tool("assert-data-lake-v4", "--duckdb=skip"), site("build-data-center-v4-frontstage"), tool("materialize-entity-history-v1"), tool("assert-entity-history-v1"), tool("generate-funding-insights-deepseek", `--date=${date}`, "--write=true"), tool("assert-funding-insights-v1", `--date=${date}`), site("build-funding-insights-frontstage"), tool("translate-public-structured-fields-deepseek", "--write=true"), tool("classify-funding-taxonomy-v4-1", "--write=true", "--apply=true"), tool("project-funding-taxonomy-to-events-v4-1"), site("build-funding-insights-frontstage"), tool("build-investment-institutions-v1"), tool("assert-investment-institutions-v1"), site("build-data-center-v4-frontstage"), tool("materialize-entity-history-v1"), tool("assert-entity-history-v1"), site("build-trend-radar-frontstage"), tool("assert-trend-radar-v1"), site("build-industry-reports-frontstage"), tool("sync-light-data-lake", "--v4-only=true", "--duckdb=skip"), tool("assert-data-lake-v4", "--duckdb=skip"), tool("assert-funding-insights-v1", "--all=true", "--frontstage=true"), tool("assert-taxonomy-consistency-v4-1"), tool("assert-public-evidence-boundary")] },
  ];
}

function main() {
  const args = new Map(process.argv.slice(2).map((arg) => { const [key, ...rest] = arg.replace(/^--/u, "").split("="); return [key, rest.join("=")]; }));
  const root = process.cwd();
  const date = args.get("date") || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error("Invalid date");
  const laneDir = `agent-workflow/reports/china-funding/${date}`;
  const sourceDir = args.get("source-dir") || laneDir;
  const read = (file, fallback = null) => fs.existsSync(path.resolve(root, file)) ? JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8")) : fallback;
  const write = (file, payload) => { const target = path.resolve(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`); };
  const plan = chinaFundingPlan(date, sourceDir);
  if (args.get("dry-run") === "true") { console.log(JSON.stringify(plan, null, 2)); return; }
  const discovery = read(`${sourceDir}/china-funding-source-intake-candidates.json`);
  if (discovery?.date !== date) throw new Error("Missing same-date China funding discovery");
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
      if (!result.error && args[0].endsWith("/generate-data-center-model-assist.mjs")) {
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
        if (stage.id === "capture" && previous.stages?.some((item) => item.id === "capture" && item.status === "passed") && read(acceptedFile)) {
          const accepted = read(acceptedFile);
          // The freshly checked-out main wins for shared IDs; the independent intake adds new IDs.
          write(intakeFile, mergeSourceIntakes(accepted, read(intakeFile) || accepted));
          state.reused = true;
          command(["agent-workflow/tools/assert-private-evidence-backup.mjs", `--date=${date}`]);
        } else {
          for (const args of stage.commands) command(args);
          if (stage.id === "capture") {
            const intake = read(intakeFile);
            const urls = new Set(discovery.items.map((item) => String(item.url).replace(/[?#].*$/u, "").replace(/\/$/u, "")));
            const sourceArtifacts = intake.source_artifacts.filter((item) => [item.source_url, item.canonical_url].some((url) => urls.has(String(url || "").replace(/[?#].*$/u, "").replace(/\/$/u, ""))));
            const ids = new Set(sourceArtifacts.map((item) => item.source_artifact_id));
            const rawDocuments = intake.raw_documents.filter((item) => ids.has(item.source_artifact_id));
            if (!rawDocuments.some((item) => item.body_length > 0 && item.body_ref?.startsWith("evidence://"))) throw new Error("No captured original evidence for China funding candidates");
            write(acceptedFile, mergeSourceIntakes({ ...intake, source_artifacts: sourceArtifacts, raw_documents: rawDocuments }));
          }
        }
        state.status = "passed";
      } catch (error) { state.status = "failed"; state.error = error.message; throw error; }
      finally { state.finished_at = new Date().toISOString(); write(statusFile, { date, stages }); }
    }
  } catch (error) { failed = error; }
  const bundle = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  const health = buildChinaFundingHealth({ date, discovery, stages: failed && !stages.length ? [{ id: "discovery", status: "failed", error: failed.message }] : stages,
    raw: read(`${bundle}/raw-documents.json`, []), artifacts: read(`${bundle}/source-artifacts.json`, []), claims: read(`${bundle}/claims.json`, []), events: read(`${bundle}/canonical-events.json`, []), entities: read(`${bundle}/entities.json`, []), cards: read("01-SiteV2/site/data/funding-insights-v1.json", {}).cards || [] });
  write(`${laneDir}/health.json`, health);
  write("01-SiteV2/site/data/china-funding-health-v1.json", health);
  command(["agent-workflow/tools/build-ops-console-data.mjs"]);
  if (failed) { console.error(failed.message); process.exitCode = 1; }
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
