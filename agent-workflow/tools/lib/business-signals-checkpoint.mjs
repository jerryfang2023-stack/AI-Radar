// Step conclusions can hide continue-on-error failures. Only the non-optional
// private-evidence boundary proves that a public locator artifact is recoverable.
export function isReusableBusinessSignalsRun(run = {}) {
  if (run.workflowName !== "WaveSight Business Signals PR"
      || !["failure", "cancelled", "timed_out"].includes(run.conclusion)) return false;
  const steps = (run.jobs || []).flatMap((job) => job.steps || []);
  const passed = (name) => steps.some((step) => step.name === name && step.conclusion === "success");
  return passed("Persist originals privately and enforce the public boundary")
    && (passed("Collect source raw artifacts") || passed("Restore accepted source intake from failed run"));
}
