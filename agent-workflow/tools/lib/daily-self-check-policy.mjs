export function shouldRebuildSkillStore(report) {
  const lane = (report?.lanes || []).find((item) => item.id === "skill_ops");
  if (!lane) return false;
  const evidence = lane.evidence || {};
  if (["missing", "stale"].includes(evidence.registryState)) return true;
  const dashboardErrors = Array.isArray(evidence.dashboardErrors) ? evidence.dashboardErrors : [];
  const semanticErrors = dashboardErrors.filter((error) => !/\bsyncState expected\b|mirror existence flags/iu.test(String(error)));
  if (semanticErrors.length) return true;
  return evidence.dashboardState === "failed" && Number(evidence.syncDrift || 0) === 0;
}

export function shouldSyncSkillStore(report, allowSync) {
  if (!allowSync) return false;
  const lane = (report?.lanes || []).find((item) => item.id === "skill_ops");
  return Number(lane?.evidence?.syncDrift || 0) > 0;
}
