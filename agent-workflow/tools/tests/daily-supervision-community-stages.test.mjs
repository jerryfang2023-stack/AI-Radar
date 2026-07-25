import test from "node:test";
import assert from "node:assert/strict";
import { classifyCommunityStages } from "../write-daily-supervision-report.mjs";

test("healthy data plus a non-zero task exit is an execution anomaly, not data failure", () => {
  const stages = classifyCommunityStages({
    communityDataHealthy: true,
    localWindowPassed: true,
    published: false,
    publicationWaiting: true,
    publishWindowPassed: true,
    taskAvailable: true,
    lastTaskResult: 3221225786,
    taskState: "Ready",
    loginState: "healthy",
  });
  assert.deepEqual(stages, {
    data: "healthy",
    publication: "waiting",
    task_execution: "anomaly_after_data_success",
    login: "healthy",
  });
});

test("expired login is carried as an independent manual state", () => {
  const stages = classifyCommunityStages({
    communityDataHealthy: false,
    localWindowPassed: true,
    published: false,
    publicationWaiting: false,
    publishWindowPassed: true,
    taskAvailable: true,
    lastTaskResult: 1,
    taskState: "Ready",
    loginState: "manual_relogin_required",
  });
  assert.equal(stages.data, "failed");
  assert.equal(stages.publication, "failed");
  assert.equal(stages.task_execution, "failed");
  assert.equal(stages.login, "manual_relogin_required");
});
