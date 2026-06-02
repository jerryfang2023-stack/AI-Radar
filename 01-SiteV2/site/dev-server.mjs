import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const skillStoreDashboard = path.join(os.homedir(), ".skill-store", "dashboard", "index.html");
const notebookLmCli = path.join(
  os.homedir(),
  "Documents",
  "Codex",
  "2026-05-24",
  "github-notebooklm-py",
  ".venv",
  "Scripts",
  "notebooklm.exe"
);
const jobs = new Map();

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "application/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".svg": "image/svg+xml;charset=utf-8",
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json;charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function runCommand(args, options = {}) {
  return new Promise((resolve) => {
    const timeoutMs = options.timeoutMs || 20 * 60 * 1000;
    const child = spawn(notebookLmCli, args, {
      cwd: root,
      windowsHide: true,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      stderr = `${stderr}\nCommand timed out after ${Math.round(timeoutMs / 1000)} seconds.`.trim();
      child.kill("SIGTERM");
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ ok: false, code: -1, stdout, stderr: `${stderr}\n${error.message}`.trim() });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

function parseJsonOutput(result) {
  try {
    return JSON.parse(result.stdout || "{}");
  } catch {
    return null;
  }
}

function buildTopicSource(topic = {}) {
  const refs = Array.isArray(topic.source_refs) ? topic.source_refs : [];
  const evidenceRefs = Array.isArray(topic.evidence_refs) ? topic.evidence_refs : [];
  const angles = Array.isArray(topic.content_angles) ? topic.content_angles : [];
  return [
    `标题：${topic.title || ""}`,
    `来源类型：${topic.source_type || ""}`,
    `选题类型：${topic.topic_type || ""}`,
    `目标读者：${topic.audience || ""}`,
    `核心问题：${topic.core_question || ""}`,
    `商业相关性：${topic.business_relevance || ""}`,
    `关键判断：${topic.key_insight || ""}`,
    `为什么现在：${topic.why_now || ""}`,
    `证据摘要：${topic.evidence_summary || ""}`,
    `评分：${topic.score?.total || ""}`,
    "",
    "来源：",
    ...refs.map((ref, index) => `${index + 1}. ${ref.title || ref.label || ""} ${ref.url || ""}`.trim()),
    "",
    "证据：",
    ...evidenceRefs.map((ref, index) => `${index + 1}. ${ref.label || ""} ${ref.note || ""}`.trim()),
    "",
    "可写角度：",
    ...angles.map((angle, index) => `${index + 1}. ${angle.title || ""}\n${angle.note || ""}`.trim()),
  ].join("\n");
}

function outputPrompt(output, topic = {}) {
  const title = topic.title || "当前选题";
  if (output === "article") {
    return `围绕《${title}》生成一篇中文商业观察文章。只使用材料中的公开事实；先写事件和冲突，再写它改变了哪类企业判断；避免内部生产术语；给出可发布标题、摘要和正文。`;
  }
  if (output === "ppt") {
    return `围绕《${title}》生成一份中文内参简报 PPT。结构：事件、关键冲突、产业位置、证据边界、机会判断、风险、行动建议。控制在 8 页左右，适合选题会或客户简报。`;
  }
  return `围绕《${title}》生成一段中文商业情报播客。采用双人对谈；先讲事件，再拆商业冲突，最后给企业操盘手判断。不要泛泛讲 AI 技术。`;
}

function generationStartArgs(output, notebookId, topic) {
  const prompt = outputPrompt(output, topic);
  if (output === "article") {
    return ["generate", "report", prompt, "--notebook", notebookId, "--format", "custom", "--language", "zh_Hans", "--json"];
  }
  if (output === "ppt") {
    return ["generate", "slide-deck", prompt, "--notebook", notebookId, "--format", "detailed", "--length", "default", "--language", "zh_Hans", "--json"];
  }
  return ["generate", "audio", prompt, "--notebook", notebookId, "--format", "deep-dive", "--length", "default", "--language", "zh_Hans", "--json"];
}

function generationTimeoutSeconds(output) {
  if (output === "podcast") return 1200;
  if (output === "ppt") return 900;
  return 600;
}

function enhanceSkillStoreDashboard(buffer) {
  const source = buffer.toString("utf8");
  const style = `
<style data-wavesight-embed>
  html, body { overflow: visible !important; }
  body { padding: 22px 24px 34px !important; background: transparent !important; }
  .header .actions { display: none !important; }
  .shell {
    max-width: none !important;
    border: 1px solid rgba(7, 24, 39, 0.1);
    border-radius: 12px;
    padding: 22px;
    background: rgba(255, 253, 248, 0.72);
  }
  .layout { align-items: flex-start !important; }
  .sidebar { top: 12px !important; }
  .signal-card {
    background:
      linear-gradient(135deg, rgba(200, 167, 102, 0.2), rgba(255, 253, 248, 0.82)),
      linear-gradient(90deg, rgba(200, 167, 102, 0.13) 1px, transparent 1px) !important;
    background-size: auto, 28px 28px !important;
    color: #071827 !important;
    border: 1px solid rgba(200, 167, 102, 0.42) !important;
    box-shadow: none !important;
  }
  .signal-card .label,
  .signal-card p,
  .signal-card span { color: rgba(7, 24, 39, 0.62) !important; }
  .signal-card strong,
  .signal-card b,
  .signal-card h2,
  .signal-card h3 { color: #071827 !important; }
</style>`;
  const script = `
<script data-wavesight-embed>
(() => {
  const postHeight = () => {
    requestAnimationFrame(() => {
      const shell = document.querySelector(".shell");
      const rect = shell ? shell.getBoundingClientRect() : document.body.getBoundingClientRect();
      const height = Math.ceil(rect.top + rect.height + 36);
      parent.postMessage({ type: "wavesight-skill-store-height", height }, "*");
    });
  };
  document.addEventListener("click", (event) => {
    const item = event.target.closest(".cat-item");
    if (!item) return;
    setTimeout(postHeight, 80);
  }, true);
  window.addEventListener("load", () => setTimeout(postHeight, 80));
  window.addEventListener("resize", postHeight);
  const observer = new MutationObserver(postHeight);
  window.addEventListener("load", () => {
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  });
})();
</script>`;
  return source.replace("</head>", `${style}\n</head>`).replace("</body>", `${script}\n</body>`);
}

async function runNotebookLmJob(job) {
  try {
    job.status = "running";
    job.stage = "检查 NotebookLM 授权";
    job.updatedAt = new Date().toISOString();
    const auth = await runCommand(["auth", "check", "--test", "--json"], { timeoutMs: 120000 });
    job.logs.push({ stage: job.stage, ok: auth.ok, stderr: auth.stderr });
    if (!auth.ok) {
      const detail = parseJsonOutput(auth)?.details?.error || auth.stderr;
      throw new Error(detail || "NotebookLM 授权不可用，请重新登录。");
    }

    job.stage = "创建内容工厂笔记";
    job.updatedAt = new Date().toISOString();
    const created = await runCommand(["create", `观澜内容工厂 - ${job.topic.title || "未命名选题"}`.slice(0, 80), "--json"], { timeoutMs: 120000 });
    job.logs.push({ stage: job.stage, ok: created.ok, stderr: created.stderr });
    const createdJson = parseJsonOutput(created);
    const notebookId = createdJson?.id || createdJson?.notebook?.id;
    if (!created.ok || !notebookId) throw new Error(created.stderr || "NotebookLM 笔记创建失败。");
    job.notebookId = notebookId;

    job.stage = "写入选题材料";
    job.updatedAt = new Date().toISOString();
    const source = await runCommand([
      "source",
      "add",
      buildTopicSource(job.topic),
      "--notebook",
      notebookId,
      "--type",
      "text",
      "--title",
      `${job.topic.title || "选题材料"} - 观澜内容工厂`.slice(0, 100),
      "--json",
    ], { timeoutMs: 180000 });
    job.logs.push({ stage: job.stage, ok: source.ok, stderr: source.stderr });
    const sourceJson = parseJsonOutput(source);
    const sourceId = sourceJson?.source?.id || sourceJson?.id;
    if (!source.ok) throw new Error(source.stderr || "选题材料写入 NotebookLM 失败。");
    if (!sourceId) throw new Error("NotebookLM source id missing after source add.");

    job.stage = "等待素材处理完成";
    job.updatedAt = new Date().toISOString();
    const sourceReady = await runCommand([
      "source",
      "wait",
      sourceId,
      "--notebook",
      notebookId,
      "--timeout",
      "180",
      "--interval",
      "2",
      "--json",
    ], { timeoutMs: 240000 });
    job.logs.push({ stage: job.stage, ok: sourceReady.ok, stderr: sourceReady.stderr });
    if (!sourceReady.ok) throw new Error(sourceReady.stderr || "NotebookLM 素材仍未处理完成，请稍后重试。");

    job.stage = "启动内容生成任务";
    job.updatedAt = new Date().toISOString();
    const generated = await runCommand(generationStartArgs(job.output, notebookId, job.topic), { timeoutMs: 120000 });
    job.logs.push({ stage: job.stage, ok: generated.ok, stderr: generated.stderr });
    if (!generated.ok) throw new Error(generated.stderr || "NotebookLM 生成任务启动失败。");
    const generatedJson = parseJsonOutput(generated);
    const artifactId = generatedJson?.task_id || generatedJson?.artifact_id || generatedJson?.id || generatedJson?.artifact?.id;
    if (!artifactId) throw new Error("NotebookLM generation task id missing.");
    job.artifactId = artifactId;

    job.stage = "等待内容生成完成";
    job.updatedAt = new Date().toISOString();
    const waitTimeout = generationTimeoutSeconds(job.output);
    const generatedReady = await runCommand([
      "artifact",
      "wait",
      artifactId,
      "--notebook",
      notebookId,
      "--timeout",
      String(waitTimeout),
      "--interval",
      "3",
      "--json",
    ], { timeoutMs: (waitTimeout + 60) * 1000 });
    job.logs.push({ stage: job.stage, ok: generatedReady.ok, stderr: generatedReady.stderr });
    if (!generatedReady.ok) throw new Error(generatedReady.stderr || "NotebookLM 内容生成超时或失败。");

    job.status = "done";
    job.stage = "生成完成";
    job.result = parseJsonOutput(generatedReady) || generatedJson || { stdout: generatedReady.stdout };
    job.updatedAt = new Date().toISOString();
  } catch (error) {
    job.status = "error";
    job.stage = "生成失败";
    job.error = error.message;
    job.updatedAt = new Date().toISOString();
  }
}

createServer(async (request, response) => {
  const rawPath = decodeURIComponent((request.url || "/").split("?")[0]);

  if (rawPath === "/local-skill-store" || rawPath === "/local-skill-store/") {
    try {
      const body = await readFile(skillStoreDashboard);
      response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      response.end(enhanceSkillStoreDashboard(body));
    } catch {
      response.writeHead(404);
      response.end("Skill Store dashboard not found");
    }
    return;
  }

  if (rawPath === "/api/notebooklm/auth" && request.method === "POST") {
    const result = await runCommand(["auth", "check", "--test", "--json"], { timeoutMs: 120000 });
    sendJson(response, result.ok ? 200 : 500, {
      ok: result.ok,
      data: parseJsonOutput(result),
      stderr: result.stderr,
    });
    return;
  }

  if (rawPath === "/api/notebooklm/generate" && request.method === "POST") {
    try {
      const body = await readJsonBody(request);
      if (!body.topic || !body.topic.title) {
        sendJson(response, 400, { ok: false, error: "缺少选题内容。" });
        return;
      }
      const output = ["podcast", "article", "ppt"].includes(body.output) ? body.output : "podcast";
      const job = {
        id: randomUUID(),
        status: "queued",
        stage: "等待启动",
        output,
        topic: body.topic,
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      jobs.set(job.id, job);
      runNotebookLmJob(job);
      sendJson(response, 202, { ok: true, job });
    } catch (error) {
      sendJson(response, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (rawPath.startsWith("/api/notebooklm/jobs/") && request.method === "GET") {
    const id = rawPath.split("/").pop();
    const job = jobs.get(id);
    sendJson(response, job ? 200 : 404, job ? { ok: true, job } : { ok: false, error: "任务不存在。" });
    return;
  }

  const requestedPath = rawPath === "/" || rawPath === "" ? "/index.html" : rawPath;
  const urlPath = requestedPath.endsWith("/")
    ? `${requestedPath}index.html`
    : path.extname(requestedPath) ? requestedPath : `${requestedPath}/index.html`;
  const filePath = path.join(root, urlPath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain;charset=utf-8" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
