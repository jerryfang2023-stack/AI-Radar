// CLI flags travel with the controller into an origin/main repair worktree.
// Do not rely on that worktree already containing the local model migration.
export const repairModel = { model: "gpt-6-astra", effort: "high" };

export function repairModelArgs() {
  return ["--model", repairModel.model, "--config", `model_reasoning_effort="${repairModel.effort}"`];
}

export function defaultRepairArgs(repairPath, outputPath) {
  return ["--ask-for-approval", "never", "exec", ...repairModelArgs(),
    "--sandbox", "danger-full-access", "--output-last-message", outputPath, "--cd", repairPath, "-"];
}
