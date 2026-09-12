import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const READ_TOOLS = new Set([
  "searchTopic", "topicDetail", "projectLibSearch", "searchProjectTools",
  "activitySearch", "activityManualToc",
]);

export function retryAfterSeconds(result) {
  const visit = (value) => {
    if (!value || typeof value !== "object") return undefined;
    if (value.retryAfterSeconds !== undefined && Number.isFinite(Number(value.retryAfterSeconds))) return Number(value.retryAfterSeconds);
    for (const child of Object.values(value)) {
      const found = visit(child);
      if (found !== undefined) return found;
    }
    return undefined;
  };
  const nested = visit(result);
  if (nested !== undefined) return nested;
  const raw = JSON.stringify(result);
  const match = raw.match(/retryAfterSeconds[^\d]{0,12}(\d+(?:\.\d+)?)/i)
    || raw.match(/retry after\s+(\d+(?:\.\d+)?)\s*s/i);
  return match ? Number(match[1]) : undefined;
}

// Local machine settings contain executable paths only. OAuth remains owned by Codex.
export async function connectScysMcp({ root, executable, timeoutMs = 120000 } = {}) {
  if (!executable) {
    const file = path.join(process.env.LOCALAPPDATA || "", "WaveSight", "runtime", "scys-mcp.json");
    executable = JSON.parse(await readFile(file, "utf8")).codexExecutable;
  }
  if (!path.isAbsolute(executable || "")) throw new Error("SCYS_CODEX_ABSOLUTE_PATH_REQUIRED");
  await access(executable);
  const child = spawn(executable, ["app-server"], {
    cwd: root, shell: false, windowsHide: true, stdio: ["pipe", "pipe", "ignore"],
  });
  const pending = new Map();
  let sequence = 0;
  let buffer = "";
  const failAll = () => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(new Error("SCYS_CODEX_PROCESS_CLOSED"));
    }
    pending.clear();
  };
  child.on("error", failAll);
  child.on("close", failAll);
  child.stdin.on("error", failAll);
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      let message;
      try { message = JSON.parse(line); } catch { continue; }
      if (message.method) {
        if (message.id !== undefined) {
          child.stdin.write(`${JSON.stringify({ id: message.id, error: { code: -32601, message: "Unsupported request" } })}\n`);
        }
        continue;
      }
      const entry = pending.get(message.id);
      if (!entry) {
        continue;
      }
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.error) entry.reject(new Error(`SCYS_CODEX_RPC_ERROR:${message.error.code}`));
      else entry.resolve(message.result);
    }
  });
  const rpc = (method, params) => new Promise((resolve, reject) => {
    if (child.exitCode !== null || child.killed) { reject(new Error("SCYS_CODEX_PROCESS_CLOSED")); return; }
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`SCYS_CODEX_TIMEOUT:${method}`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(`${JSON.stringify({ id, method, params })}\n`);
  });
  const close = () => { child.stdin.end(); child.kill(); failAll(); };
  try {
    await rpc("initialize", {
      clientInfo: { name: "wavesight_community", version: "1.0.0" },
      capabilities: { experimentalApi: true },
    });
    child.stdin.write(`${JSON.stringify({ method: "initialized" })}\n`);
    // An ephemeral transport context: no model turn, persisted task or OAuth request.
    const session = await rpc("thread/start", { cwd: root, ephemeral: true, approvalPolicy: "never" });
    const threadId = session.thread.id;
    return {
      close,
      async call(tool, args) {
        if (!READ_TOOLS.has(tool)) throw new Error("SCYS_READ_TOOL_NOT_ALLOWED");
        for (let attempt = 0; attempt < 3; attempt++) {
          const result = await rpc("mcpServer/tool/call", { threadId, server: "scys-mcp", tool, arguments: args });
          const unwrapped = result.result || result;
          const texts = (unwrapped.content || []).filter((entry) => entry.type === "text").map((entry) => entry.text);
          let data = unwrapped.structuredContent;
          if (!data) { try { data = JSON.parse(texts.join("\n")); } catch { /* sanitized error below */ } }
          const limited = Boolean(unwrapped.isError) && /MCP_RATE_LIMITED/.test(JSON.stringify(data || texts));
          const retry = retryAfterSeconds(result);
          if (limited && attempt < 2 && Number.isFinite(retry) && retry >= 0) {
            await new Promise((resolve) => setTimeout(resolve, retry * 1000));
            continue;
          }
          if (unwrapped.isError || !data || limited) {
            const code = texts.join("\n").match(/\b(?:MCP_[A-Z_]+|REMOTE_HTTP_ERROR)\b/)?.[0]
              || (/限指定用户访问|无权限|权限不足|access denied/i.test(texts.join("\n")) ? "ACCESS_DENIED" : "INVALID_RESPONSE");
            const error = new Error(`SCYS_TOOL_FAILED:${tool}:${code}`);
            error.retryAfterSeconds = retry;
            throw error;
          }
          return data;
        }
      },
    };
  } catch (error) { close(); throw error; }
}
