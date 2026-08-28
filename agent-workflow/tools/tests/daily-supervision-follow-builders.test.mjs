import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { pathToFileURL } from "node:url";

const repositoryRoot = process.cwd();
const scriptFile = path.join(repositoryRoot, "agent-workflow", "tools", "write-daily-supervision-report.mjs");
const dataGateFile = path.join(repositoryRoot, "agent-workflow", "tools", "assert-follow-builders-data.mjs");

function shanghaiDate(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function addDay(date) {
  const value = new Date(`${date}T00:00:00+08:00`);
  value.setUTCDate(value.getUTCDate() + 1);
  return shanghaiDate(value);
}

async function loadSupervisor(root, args, cacheKey) {
  process.chdir(root);
  process.argv = [process.execPath, path.join(root, "test-harness.mjs"), ...args];
  return import(`${pathToFileURL(scriptFile).href}?test=${cacheKey}`);
}

function writeHealthyFixture(root, date) {
  const outputFile = path.join(root, "01-SiteV2", "content", "07-points", `${date}-builders-viewpoints.md`);
  const reportFile = path.join(root, "agent-workflow", "reports", `${date}-follow-builders-skill-local-publish.md`);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(outputFile, [
    "---",
    `date: ${date}`,
    "builder_items_count: 2",
    "---",
    "",
    `## BP-${date.replaceAll("-", "")}-01 First`,
    "",
    `## BP-${date.replaceAll("-", "")}-02 Second`,
    "",
  ].join("\n"), "utf8");
  fs.writeFileSync(reportFile, [
    `# ${date} Follow-Builders Skill Local Publish`,
    "",
    "- builder_items_count: 2",
    "- guanlan_vault_projection: local_after_main_sync",
    "- publish_status: generated",
    '- publish_error: ""',
    "",
  ].join("\n"), "utf8");
}

function runGit(root, args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test("first-line recovery gate rejects previous-day data for the requested date", () => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-first-line-date-gate-"));
  try {
    const sourceData = path.join(repositoryRoot, "01-SiteV2", "site", "data", "follow-builders-daily.json");
    const fixtureData = path.join(fixtureRoot, "follow-builders-daily.json");
    const payload = JSON.parse(fs.readFileSync(sourceData, "utf8"));
    fs.writeFileSync(fixtureData, `${JSON.stringify(payload)}\n`, "utf8");
    const generatedDate = shanghaiDate(payload.meta.generatedAt);
    const commonArgs = [
      dataGateFile,
      `--data-file=${fixtureData}`,
      `--reports-dir=${fixtureRoot}`,
      "--max-generated-age-hours=100000",
      "--max-feed-age-hours=100000",
      "--max-fallback-feed-age-hours=100000",
      "--max-remark-age-hours=100000",
    ];

    const stale = spawnSync(process.execPath, [...commonArgs, `--date=${addDay(generatedDate)}`], {
      cwd: repositoryRoot,
      encoding: "utf8",
      windowsHide: true,
    });
    assert.equal(stale.status, 1, stale.stderr || stale.stdout);
    assert.match(stale.stdout, /"status": "failed"/u);
    const staleReport = fs.readFileSync(path.join(fixtureRoot, `${addDay(generatedDate)}-follow-builders-data-gate.md`), "utf8");
    assert.match(staleReport, new RegExp(`builders data date is ${generatedDate}, expected ${addDay(generatedDate)}`, "u"));

    const current = spawnSync(process.execPath, [...commonArgs, `--date=${generatedDate}`], {
      cwd: repositoryRoot,
      encoding: "utf8",
      windowsHide: true,
    });
    assert.equal(current.status, 0, current.stderr || current.stdout);
    assert.match(current.stdout, /"status": "passed"/u);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("forced afternoon supervision fails missing artifacts and passes count-consistent artifacts", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-follow-builders-supervision-"));
  const date = "2026-07-24";
  try {
    const supervisor = await loadSupervisor(
      fixtureRoot,
      [`--date=${date}`, "--force-afternoon-window=true", "--github=off", "--scheduled-task=off", "--hermes=off"],
      "forced",
    );
    const missing = supervisor.buildFollowBuildersSkillLane();
    assert.equal(missing.status, "manual_required");
    assert.ok(missing.problems.some((item) => /missing follow-builders skill output file/u.test(item.message)));
    assert.ok(missing.problems.some((item) => /no same-date follow-builders skill publish report/u.test(item.message)));

    writeHealthyFixture(fixtureRoot, date);
    const healthy = supervisor.buildFollowBuildersSkillLane();
    assert.equal(healthy.status, "passed");
    assert.equal(healthy.evidence.itemCount, 2);
    assert.equal(healthy.evidence.reportCount, 2);
    assert.equal(healthy.evidence.guanlanVaultProjection, "local_after_main_sync");
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("pre-window afternoon supervision reports waiting instead of passed", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-follow-builders-window-"));
  try {
    const supervisor = await loadSupervisor(
      fixtureRoot,
      ["--date=2099-01-01", "--github=off", "--scheduled-task=off", "--hermes=off"],
      "prewindow",
    );
    const lane = supervisor.buildFollowBuildersSkillLane();
    assert.equal(lane.status, "waiting");
    assert.equal(lane.problems.length, 0);
    assert.equal(lane.waiting.length, 1);
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("afternoon supervision reads exact-date artifacts from origin/main when the worktree is stale", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-follow-builders-origin-"));
  const date = "2026-07-24";
  try {
    writeHealthyFixture(fixtureRoot, date);
    runGit(fixtureRoot, ["init"]);
    runGit(fixtureRoot, ["add", "."]);
    runGit(fixtureRoot, [
      "-c", "user.name=Test",
      "-c", "user.email=test@example.com",
      "commit", "-m", "fixture",
    ]);
    runGit(fixtureRoot, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
    fs.rmSync(path.join(fixtureRoot, "01-SiteV2"), { recursive: true, force: true });
    fs.rmSync(path.join(fixtureRoot, "agent-workflow"), { recursive: true, force: true });

    const supervisor = await loadSupervisor(
      fixtureRoot,
      [`--date=${date}`, "--force-afternoon-window=true", "--github=off", "--scheduled-task=off", "--hermes=off"],
      "origin",
    );
    const lane = supervisor.buildFollowBuildersSkillLane();
    assert.equal(lane.status, "passed");
    assert.equal(lane.evidence.dataSource, "origin/main");
    assert.match(lane.evidence.outputFile, /^origin\/main:/u);
    assert.match(lane.evidence.reportFile, /^origin\/main:/u);
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("historical morning health uses its exact-date gate and manifest", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-first-line-history-"));
  const date = "2026-07-23";
  try {
    const dataFile = path.join(fixtureRoot, "01-SiteV2", "site", "data", "follow-builders-daily.json");
    const reportDir = path.join(fixtureRoot, "agent-workflow", "reports");
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify({
      meta: { generatedAt: "2026-07-24T01:00:00.000Z" },
      stats: { remarks: 20, builders: 10 },
    }), "utf8");
    fs.writeFileSync(path.join(reportDir, `${date}-follow-builders-data-gate.md`), [
      "# Follow Builders Data Gate",
      "",
      "- status: passed",
      "",
    ].join("\n"), "utf8");
    fs.writeFileSync(path.join(reportDir, `${date}-first-line-viewpoints-manifest.md`), [
      `# ${date} First-Line Viewpoints Manifest`,
      "",
      "- builders_data: success",
      "- builders_gate: success",
      "",
    ].join("\n"), "utf8");

    const supervisor = await loadSupervisor(
      fixtureRoot,
      [`--date=${date}`, "--github=off", "--scheduled-task=off", "--hermes=off"],
      "history",
    );
    const lane = supervisor.buildFirstLineLane();
    assert.equal(lane.evidence.historicalEvidenceHealthy, true);
    assert.equal(lane.evidence.localDataHealthy, true);
    assert.equal(lane.problems.length, 0);
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("morning supervision keeps published data paired with its published gate", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-first-line-published-gate-"));
  const date = "2026-07-24";
  try {
    const dataFile = path.join(fixtureRoot, "01-SiteV2", "site", "data", "follow-builders-daily.json");
    const reportDir = path.join(fixtureRoot, "agent-workflow", "reports");
    const gateFile = path.join(reportDir, `${date}-follow-builders-data-gate.md`);
    const manifestFile = path.join(reportDir, `${date}-first-line-viewpoints-manifest.md`);
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify({
      meta: { generatedAt: "2026-07-24T01:00:00.000Z" },
      stats: { remarks: 20, builders: 10 },
    }), "utf8");
    fs.writeFileSync(gateFile, "# Follow Builders Data Gate\n\n- status: passed\n", "utf8");
    fs.writeFileSync(manifestFile, [
      `# ${date} First-Line Viewpoints Manifest`,
      "",
      "- builders_data: success",
      "- builders_gate: success",
      "",
    ].join("\n"), "utf8");
    runGit(fixtureRoot, ["init"]);
    runGit(fixtureRoot, ["add", "."]);
    runGit(fixtureRoot, [
      "-c", "user.name=Test",
      "-c", "user.email=test@example.com",
      "commit", "-m", "published fixture",
    ]);
    runGit(fixtureRoot, ["update-ref", "refs/remotes/origin/main", "HEAD"]);

    fs.writeFileSync(dataFile, JSON.stringify({
      meta: { generatedAt: "2026-07-23T01:00:00.000Z" },
      stats: { remarks: 20, builders: 10 },
    }), "utf8");
    fs.writeFileSync(gateFile, "# Follow Builders Data Gate\n\n- status: failed\n", "utf8");
    fs.writeFileSync(manifestFile, "# stale local manifest\n", "utf8");

    const supervisor = await loadSupervisor(
      fixtureRoot,
      [`--date=${date}`, "--github=off", "--scheduled-task=off", "--hermes=off"],
      "published-gate",
    );
    const lane = supervisor.buildFirstLineLane();
    assert.equal(lane.evidence.dataSource, "origin/main");
    assert.equal(lane.evidence.gateStatus, "passed");
    assert.match(lane.evidence.gateReport, /^origin\/main:/u);
    assert.match(lane.evidence.manifest, /^origin\/main:/u);
    assert.equal(lane.evidence.localDataHealthy, true);
    assert.equal(lane.problems.length, 0);
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("morning supervision waits while same-date First-Line Viewpoints workflow is active", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-first-line-active-workflow-"));
  const date = "2026-07-24";
  try {
    const dataFile = path.join(fixtureRoot, "01-SiteV2", "site", "data", "follow-builders-daily.json");
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify({
      meta: { generatedAt: "2026-07-23T01:00:00.000Z" },
      stats: { remarks: 20, builders: 10 },
    }), "utf8");

    const supervisor = await loadSupervisor(
      fixtureRoot,
      [`--date=${date}`, "--github=off", "--scheduled-task=off", "--hermes=off"],
      "active-workflow",
    );
    const lane = supervisor.buildFirstLineLane({
      github: {
        available: true,
        latest_run: { status: "in_progress" },
        prs: [],
        pr_warning: "",
      },
    });
    assert.equal(lane.status, "waiting");
    assert.equal(lane.problems.length, 0);
    assert.equal(lane.waiting.length, 1);
    assert.match(lane.waiting[0].message, /workflow is in_progress/u);
    assert.ok(lane.warnings.some((item) => /first-line data date is 2026-07-23, expected 2026-07-24; First-Line Viewpoints workflow is in_progress/u.test(item)));
    assert.ok(!lane.actions.some((item) => /send Codex/u.test(item)));
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("confirmed Community Intelligence publication prevents recurring task-result noise", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-community-task-result-"));
  try {
    const supervisor = await loadSupervisor(
      fixtureRoot,
      ["--date=2026-07-27", "--github=off", "--scheduled-task=off", "--hermes=off"],
      "community-task-result",
    );
    assert.equal(supervisor.classifyCommunityTaskResult({
      lastResult: 1,
      dataHealthy: true,
      publicationConfirmed: true,
    }), "published");
    assert.deepEqual(supervisor.classifyCommunityStages({
      communityDataHealthy: true,
      localWindowPassed: true,
      published: true,
      publicationWaiting: false,
      publishWindowPassed: true,
      taskAvailable: true,
      lastTaskResult: 1,
      taskState: "Ready",
      loginState: "healthy",
      publicationConfirmed: true,
    }), {
      data: "healthy",
      publication: "published",
      task_execution: "passed",
      login: "healthy",
    });
    assert.equal(supervisor.classifyCommunityTaskResult({
      lastResult: 1,
      dataHealthy: true,
      publicationConfirmed: false,
    }), "warning");
    assert.equal(supervisor.classifyCommunityTaskResult({
      lastResult: 1,
      dataHealthy: false,
      publicationConfirmed: true,
    }), "problem");
    assert.equal(supervisor.classifyCommunityTaskResult({
      lastResult: 267009,
      dataHealthy: false,
      publicationConfirmed: false,
      taskState: "Running",
    }), "running");
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
