export const DEFAULT_CONTROLLER_RUNNING_LEASE_MS = 1_800_000;
export const DEFAULT_CONTROLLER_CLOCK_SKEW_MS = 60_000;

export function inspectControllerReportLiveness(report, {
  phase,
  date,
  now = Date.now(),
  runningLeaseMs = DEFAULT_CONTROLLER_RUNNING_LEASE_MS,
  clockSkewMs = DEFAULT_CONTROLLER_CLOCK_SKEW_MS,
} = {}) {
  const validIdentity = report?.date === date && report?.phase === phase;
  const hasActions = Array.isArray(report?.actions) && report.actions.length > 0;
  const generatedAt = Date.parse(report?.generated_at || "");
  const ageMs = now - generatedAt;
  const runningFresh = report?.status !== "running"
    || (Number.isFinite(generatedAt) && ageMs >= -clockSkewMs && ageMs <= runningLeaseMs);
  return {
    validIdentity,
    hasActions,
    runningFresh,
    observable: validIdentity && hasActions && runningFresh,
  };
}

export function controllerRecoveryOwnershipReason({ scheduledRun, report, liveness }) {
  if (!scheduledRun) return "manual Closure invocation";
  if (!report) return "missing Recovery report";
  if (!liveness.validIdentity) return "identity-invalid Recovery report";
  if (!liveness.hasActions) return "actionless Recovery report";
  if (!liveness.runningFresh) return "expired or clock-skewed Recovery running marker";
  if (report.status === "running") return "concurrent Recovery running marker";
  if (report.status === "superseded") return "superseded Recovery report";
  return "";
}
