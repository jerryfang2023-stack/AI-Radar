#!/usr/bin/env node
// Publish committed, accepted assets only; local working-tree changes are never uploaded.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run=true");
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", windowsHide: true, ...options });
  if (result.status !== 0 || result.error) throw new Error(`${command} failed: ${result.stderr || result.error?.message}`);
  return result.stdout;
}
if (!dryRun) run("git", ["fetch", "origin", "main"]);
const sha = run("git", ["rev-parse", "origin/main"]).trim();
if (!/^[a-f0-9]{40}$/u.test(sha)) throw new Error("Invalid accepted main commit");
const files = ["operations-console.html", "assets/operations-console.js", "assets/member-operations.js", "assets/application-analytics.js", "assets/operations-auth.js", "data/ops-console.js", "data/ops-console.json", "data/local-skill-store-data.js"];
const receipt = { sourceCommit: sha, checkedAt: new Date().toISOString(), files: {}, authenticatedProductionBrowserVerified: false };
const staging = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-ops-"));
try {
  for (const file of files) {
    const blob = run("git", ["show", `${sha}:01-SiteV2/site/${file}`], { encoding: null, maxBuffer: 20 * 1024 * 1024 });
    const target = path.join(staging, "ops", file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, blob);
    receipt.files[`ops/${file}`] = crypto.createHash("sha256").update(blob).digest("hex");
  }
  const ops = JSON.parse(fs.readFileSync(path.join(staging, "ops/data/ops-console.json"), "utf8"));
  receipt.chinaFunding = ops.quality?.chinaFunding || null;
  if (dryRun) { console.log(JSON.stringify({ ...receipt, dryRun: true }, null, 2)); }
  else {
    const id = `ops-${sha.slice(0, 12)}-${Date.now()}`;
    receipt.release = `/var/www/wavesight-ops/releases/${id}`;
    const manifest = Object.entries(receipt.files).map(([file, hash]) => `${hash}  ${file}`).join("\n") + "\n";
    fs.writeFileSync(path.join(staging, "SHA256SUMS"), manifest);
    fs.writeFileSync(path.join(staging, "release-receipt.json"), JSON.stringify(receipt, null, 2));
    const archive = path.join(staging, "release.tar");
    run("tar", ["-cf", archive, "-C", staging, "ops", "SHA256SUMS", "release-receipt.json"]);
    run("scp", ["-q", archive, `hermes-vps:/tmp/${id}.tar`]);
    const script = `set -eu
exec 9>/var/www/wavesight-ops/.publication.lock
flock -w 120 9
previous=$(readlink -f /var/www/wavesight-ops/current)
case "$previous" in /var/www/wavesight-ops/releases/*) ;; *) echo 'Invalid current release' >&2; exit 1;; esac
mkdir '${receipt.release}'
cp -a "$previous/." '${receipt.release}/'
tar -xf '/tmp/${id}.tar' -C '${receipt.release}'
cd '${receipt.release}'
sha256sum -c SHA256SUMS
chmod -R a+rX ops
nginx -t
ln -s '${receipt.release}' '/var/www/wavesight-ops/${id}.next'
mv -Tf '/var/www/wavesight-ops/${id}.next' /var/www/wavesight-ops/current
rm '/tmp/${id}.tar'
printf 'PREVIOUS=%s\n' "$previous"
`;
    const output = run("ssh", ["-o", "BatchMode=yes", "hermes-vps", "sudo -n sh -s"], { input: script });
    receipt.previous = output.match(/PREVIOUS=(.+)/u)?.[1] || null;
    receipt.remoteHashesVerified = true;
    receipt.nginxConfigurationValid = true;
    receipt.httpChecks = [];
    for (const [urlPath, expected] of [["/ops/", 302], ["/ops/assets/operations-console.js", 302], ["/ops/data/ops-console.js", 302], ["/ops/login/", 200], ["/api/v1/health", 200]]) {
      const response = await fetch(`https://www.zkdlj.vip${urlPath}`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
      const check = { path: urlPath, status: response.status, location: response.headers.get("location") };
      receipt.httpChecks.push(check);
      if (response.status !== expected || (expected === 302 && !check.location?.includes("/ops/login/"))) throw new Error(`OPS HTTP verification failed: ${JSON.stringify(check)}`);
    }
    const outputFile = path.resolve(process.env.LOCALAPPDATA || os.tmpdir(), "GuanlanAI", "runtime", "ops-publication.json");
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(receipt, null, 2) + "\n");
    console.log(JSON.stringify({ ...receipt, receiptFile: outputFile }, null, 2));
  }
} finally {
  // mkdtemp created this exact task-owned path; no user directories are traversed.
  fs.rmSync(staging, { recursive: true, force: true });
}
