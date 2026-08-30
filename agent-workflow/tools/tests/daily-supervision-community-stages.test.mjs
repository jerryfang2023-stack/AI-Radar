import test from "node:test";
import assert from "node:assert/strict";
import {
  communityPublicationMissingIsProblem,
  classifyCommunityPublication,
  classifyCommunityStages,
  communityTaskPending,
} from "../write-daily-supervision-report.mjs";

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
  assert.equal(stages.publication, "blocked_on_data");
  assert.equal(stages.task_execution, "failed");
  assert.equal(stages.login, "manual_relogin_required");
});

test("an unhealthy local gate blocks downstream missing-publication escalation", () => {
  assert.equal(communityPublicationMissingIsProblem({
    communityDataHealthy: false,
    publicationReady: false,
    publishWindowPassed: true,
    taskPending: false,
  }), false);
  assert.equal(communityPublicationMissingIsProblem({
    communityDataHealthy: true,
    publicationReady: false,
    publishWindowPassed: true,
    taskPending: false,
  }), true);
});

test("a running scheduled task is waiting even while Task Scheduler reports 0x41301", () => {
  const stages = classifyCommunityStages({
    communityDataHealthy: false,
    localWindowPassed: true,
    published: false,
    publicationWaiting: false,
    publishWindowPassed: true,
    taskAvailable: true,
    lastTaskResult: 267009,
    taskState: "Running",
    loginState: "unknown",
  });
  assert.equal(stages.task_execution, "running");
});

test("a same-date running task defers stale data and missing publication failures", () => {
  const taskPending = communityTaskPending({
    targetDate: "2026-08-23",
    currentDate: "2026-08-23",
    taskAvailable: true,
    taskState: "Running",
    lastRunTime: "/Date(1787477249000)/",
  });
  assert.equal(taskPending, true);

  const stages = classifyCommunityStages({
    communityDataHealthy: false,
    dataWaiting: taskPending,
    localWindowPassed: true,
    published: false,
    publicationWaiting: taskPending,
    publishWindowPassed: true,
    taskAvailable: true,
    lastTaskResult: 267009,
    taskState: "Running",
    loginState: "unknown",
  });
  assert.equal(stages.data, "waiting");
  assert.equal(stages.publication, "waiting");
  assert.equal(stages.task_execution, "running");
});

test("a running task from another date does not hide a current data failure", () => {
  assert.equal(
    communityTaskPending({
      targetDate: "2026-08-23",
      currentDate: "2026-08-23",
      taskAvailable: true,
      taskState: "Running",
      lastRunTime: "2026-08-22T00:30:00.000Z",
    }),
    false,
  );
});

test("a same-date queued task is waiting before its first run timestamp exists", () => {
  assert.equal(
    communityTaskPending({
      targetDate: "2026-08-23",
      currentDate: "2026-08-23",
      taskAvailable: true,
      taskState: "Queued",
      lastRunTime: "",
    }),
    true,
  );
});

test("same-date data on origin/main confirms publication without a dedicated workflow run", () => {
  assert.deepEqual(
    classifyCommunityPublication({
      targetDate: "2026-07-28",
      originGeneratedDate: "2026-07-28",
    }),
    {
      publishedOnOriginMain: true,
      ready: true,
      confirmed: true,
    },
  );
});
