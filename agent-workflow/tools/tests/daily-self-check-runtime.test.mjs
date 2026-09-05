import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const toolsDir = path.resolve("agent-workflow/tools");

test("safe scheduled Skill repair builds and checks runtime without touching release files", (t) => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-self-check-"));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const targetTools = path.join(fixture, "agent-workflow/tools");
  const runtime = path.join(fixture, "runtime with spaces");
  fs.mkdirSync(path.join(targetTools, "lib"), { recursive: true });
  fs.mkdirSync(runtime);
  for (const file of ["run-daily-self-check.mjs", "lib/daily-self-check-policy.mjs", "lib/report-command.mjs", "lib/logged-command.mjs"]) {
    fs.copyFileSync(path.join(toolsDir, file), path.join(targetTools, file));
  }
  const releaseFiles = ["agent-workflow/skills/skill-registry.md", "01-SiteV2/site/data/local-skill-store-data.js"];
  for (const file of releaseFiles) {
    fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
    fs.writeFileSync(path.join(fixture, file), "existing release content");
  }
  fs.writeFileSync(path.join(targetTools, "write-daily-supervision-report.mjs"), `
    import fs from 'node:fs'; import path from 'node:path';
    const output = process.argv.find(x => x.startsWith('--output-dir=')).slice(13);
    const ready = fs.existsSync(path.join(output, 'local-skill-store-data.js'));
    const lane = {id:'skill_ops', status:ready?'passed':'failed',
      evidence:{discoveryState:ready?'passed':'stale'},
      problems:ready?[]:[{message:'Skill discovery summary is stale'}], warnings:[]};
    fs.writeFileSync(path.join(output, '2026-08-31-daily-supervision-report.json'),
      JSON.stringify({status:ready?'passed':'failed',lanes:[lane]}));
  `);
  fs.writeFileSync(path.join(targetTools, "build-skill-store-dashboard.mjs"), `
    import fs from 'node:fs';
    const output = process.argv.find(x => x.startsWith('--output='));
    if (!output) throw new Error('runtime output missing');
    fs.writeFileSync(output.slice(9), 'runtime snapshot');
  `);
  fs.writeFileSync(path.join(targetTools, "check-skill-ops.mjs"), `
    import fs from 'node:fs';
    const dashboard = process.argv.find(x => x.startsWith('--dashboard='));
    if (!dashboard || fs.readFileSync(dashboard.slice(12), 'utf8') !== 'runtime snapshot')
      throw new Error('gate must read the exact runtime producer output');
  `);
  const result = spawnSync(process.execPath, [path.join(targetTools, "run-daily-self-check.mjs"),
    "--date=2026-08-31", "--repair=safe", `--runtime-dir=${runtime}`,
  ], { cwd: fixture, encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const report = JSON.parse(fs.readFileSync(path.join(runtime, "2026-08-31-daily-self-check.json"), "utf8"));
  assert.equal(report.status, "passed");
  assert.equal(report.repair_attempts.length, 2);
  assert.ok(report.repair_attempts.every(attempt => attempt.ok));
  for (const file of releaseFiles) assert.equal(fs.readFileSync(path.join(fixture, file), "utf8"), "existing release content");
  const localAppData = path.join(fixture, "local-app-data");
  const manual = spawnSync(process.execPath, [path.join(targetTools, "run-daily-self-check.mjs"),
    "--date=2026-08-31", "--repair=safe",
  ], { cwd: fixture, encoding: "utf8", env: { ...process.env, LOCALAPPDATA: localAppData } });
  assert.equal(manual.status, 0, manual.stdout + manual.stderr);
  const manualReport = JSON.parse(fs.readFileSync(path.join(localAppData, "WaveSight", "runtime", "2026-08-31-daily-self-check.json"), "utf8"));
  assert.equal(manualReport.status, "passed");
  assert.equal(manualReport.repair_attempts.length, 2);
  for (const file of releaseFiles) assert.equal(fs.readFileSync(path.join(fixture, file), "utf8"), "existing release content");
});

test("controller and supervision pass the runtime dashboard to the read-only gate", () => {
  const controller = fs.readFileSync(path.join(toolsDir, "run-daily-automation-controller.mjs"), "utf8");
  assert.match(controller, /Skill Ops preflight[^]*?--dashboard=\$\{path.join\(reportsDir, "local-skill-store-data.js"\)\}/u);
  const supervision = fs.readFileSync(path.join(toolsDir, "write-daily-supervision-report.mjs"), "utf8");
  assert.match(supervision, /args.has\("output-dir"\) && exists\(runtimeDashboard\)/u);
  assert.match(supervision, /check-skill-ops.mjs", "--json", \.\.\.dashboardArgs/u);
});
