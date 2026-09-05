import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

export const CODEX_REPAIR_TIMEOUT_MS = 30 * 60 * 1000;
export const CODEX_REPAIR_HANDOFF_TIMEOUT_MS = CODEX_REPAIR_TIMEOUT_MS + 3 * 60 * 1000;

export function defaultRuntimeDirectory(env = process.env) {
  return path.join(env.LOCALAPPDATA || path.join(os.homedir(), ".local", "state"), "WaveSight", "runtime");
}

function readTail(file, limit) {
  const fd = fs.openSync(file, "r");
  try {
    const size = fs.fstatSync(fd).size;
    const buffer = Buffer.alloc(Math.min(size, limit));
    fs.readSync(fd, buffer, 0, buffer.length, Math.max(0, size - buffer.length));
    return buffer.toString("utf8");
  } finally {
    fs.closeSync(fd);
  }
}

// Long-running agents can emit megabytes before producing their last message.
// File descriptors remove spawnSync's pipe-buffer limit; summaries stay bounded.
export function runLoggedCommand(command, args, {
  logDir, label = "command", maxOutputBytes = 256 * 1024, ...options
}) {
  fs.mkdirSync(logDir, { recursive: true });
  const prefix = `${label.replace(/[^a-z0-9-]/giu, "-").slice(0, 64)}-${randomUUID()}`;
  const stdoutLog = path.join(logDir, `${prefix}.stdout.log`);
  const stderrLog = path.join(logDir, `${prefix}.stderr.log`);
  const stdoutFd = fs.openSync(stdoutLog, "wx", 0o600);
  let stderrFd;
  let result;
  try {
    stderrFd = fs.openSync(stderrLog, "wx", 0o600);
    result = spawnSync(command, args, {
      ...options, windowsHide: true, stdio: ["pipe", stdoutFd, stderrFd],
    });
  } finally {
    fs.closeSync(stdoutFd);
    if (stderrFd !== undefined) fs.closeSync(stderrFd);
  }
  return {
    ...result,
    stdout: readTail(stdoutLog, maxOutputBytes),
    stderr: readTail(stderrLog, maxOutputBytes),
    stdout_log: stdoutLog,
    stderr_log: stderrLog,
  };
}
