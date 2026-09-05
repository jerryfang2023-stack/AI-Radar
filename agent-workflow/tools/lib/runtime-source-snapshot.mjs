import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export function runtimeSourceSnapshot(root, date) {
  const directory = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
  if (!fs.existsSync(path.join(directory, "manifest.json"))) return "";
  const head = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", timeout: 10000, windowsHide: true });
  const digest = crypto.createHash("sha256").update(head.status === 0 ? head.stdout.trim() : "uncommitted-fixture");
  for (const name of fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()) {
    digest.update(name).update("\0").update(fs.readFileSync(path.join(directory, name))).update("\0");
  }
  return digest.digest("hex");
}
