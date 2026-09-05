import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

export function refreshRepairWorktree(root, repairRoot, branch) {
  const git = (cwd, args) => execFileSync("git", args, {
    cwd, encoding: "utf8", timeout: 120000, windowsHide: true,
  }).trim();
  try {
    const common = (cwd) => fs.realpathSync(git(cwd, ["rev-parse", "--path-format=absolute", "--git-common-dir"]));
    if (fs.realpathSync(root) === fs.realpathSync(repairRoot) || common(root) !== common(repairRoot)) {
      throw new Error("Repair target must be a separate worktree of this repository.");
    }
    if (git(repairRoot, ["branch", "--show-current"]) !== branch) {
      throw new Error("Repair worktree is on an unexpected branch; preserved without changes.");
    }
    if (git(repairRoot, ["status", "--porcelain", "--untracked-files=all"])) {
      throw new Error("Repair worktree is dirty; preserved without changes.");
    }
    git(root, ["fetch", "origin", "main"]);
    const ancestor = spawnSync("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"], {
      cwd: repairRoot, windowsHide: true, timeout: 30000,
    });
    if (ancestor.error || ancestor.status !== 0) {
      throw new Error("Repair worktree has unique or unverifiable commits; preserved without reset/rebase.");
    }
    git(repairRoot, ["merge", "--ff-only", "origin/main"]);
    return { ok: true, path: repairRoot, branch, base_sha: git(repairRoot, ["rev-parse", "HEAD"]) };
  } catch (error) {
    return { ok: false, path: repairRoot, branch, reason: error.message };
  }
}
