import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Community Intelligence and Follow-Builders are distinct Monday weekly tasks", () => {
  const communityInstaller = read("agent-workflow/tools/install-community-intelligence-task.ps1");
  const buildersInstaller = read("agent-workflow/tools/install-follow-builders-skill-task.ps1");
  const taskContract = read("agent-workflow/tools/assert-windows-automation-tasks.ps1");

  assert.match(communityInstaller, /WaveSight Community Intelligence Weekly/u);
  assert.match(communityInstaller, /New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday/u);
  assert.match(buildersInstaller, /WaveSight Follow-Builders Skill Weekly/u);
  assert.match(buildersInstaller, /New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday/u);
  assert.match(taskContract, /WaveSight Community Intelligence Weekly/u);
  assert.match(taskContract, /WaveSight Follow-Builders Skill Weekly/u);
  assert.match(taskContract, /weekly/u);
});

test("First-Line Viewpoints has an independent weekly cloud schedule", () => {
  const workflow = read(".github/workflows/daily-first-line-viewpoints-pr.yml");
  assert.match(workflow, /schedule:[\s\S]{0,120}cron: ["']0 1 \* \* 1["']/u);
});
