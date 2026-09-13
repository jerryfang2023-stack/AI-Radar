export function auditNavigationContracts({ actionIndex, experienceRules, opsVersion, governedCount }) {
  const problems = [];
  if (!actionIndex.includes("version-ledger.md#current-version")) problems.push("action index must link the current version ledger");
  for (const match of actionIndex.matchAll(/OPS-V[\w.-]+/gu)) {
    if (match[0] !== opsVersion) problems.push(`action index has stale OPS version: ${match[0]}`);
  }
  if (!experienceRules.includes("../agent-workflow/skills/skill-registry.md")) problems.push("experience rules must link the governed Skill registry");
  for (const match of experienceRules.matchAll(/all\s+(\d+)\s+active governed Skills/giu)) {
    if (Number(match[1]) !== governedCount) problems.push(`experience rules have stale governed Skill count: ${match[1]}`);
  }
  return problems;
}
