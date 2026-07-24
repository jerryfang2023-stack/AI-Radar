import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { pathToFileURL } from "node:url";

const repositoryRoot = process.cwd();
const scriptFile = path.join(repositoryRoot, "agent-workflow", "tools", "write-daily-supervision-report.mjs");

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
    "- obsidian_sync_added: 2",
    "- obsidian_sync_groups: 2",
    "- obsidian_sync_files: 2",
    "- publish_status: generated",
    '- publish_error: ""',
    "",
  ].join("\n"), "utf8");
}

function runGit(root, args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

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
    assert.deepEqual(healthy.evidence.obsidianSync, { added: 2, groups: 2, files: 2 });
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
      "- obsidian_sync: success",
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
