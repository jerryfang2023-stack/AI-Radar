import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const port = Number(process.env.SKILL_STORE_OPS_PORT || 8787);
const skillStoreDir = path.resolve(os.homedir(), ".skill-store");
const trashRoot = path.resolve(os.homedir(), ".skill-store-trash");
const dataFile = path.join(root, "01-SiteV2", "site", "data", "local-skill-store-data.js");
const reportsDir = path.join(root, "agent-workflow", "reports");
const usageOverridesPath = path.join(root, "agent-workflow", "skills", "skill-usage-overrides.json");
const cleanupObservationPath = path.join(root, "agent-workflow", "skills", "skill-cleanup-observation.json");

function send(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 128 * 1024) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function loadSkillStoreData() {
  const code = fs.readFileSync(dataFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: dataFile });
  return sandbox.window.WaveSightLocalSkillStore || { skills: [], cleanupQueue: [] };
}

function safeSkillName(name) {
  return typeof name === "string" && /^[A-Za-z0-9._-]+$/.test(name);
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function isInsideOrSame(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function uniqueDestination(baseDir, name) {
  let destination = path.join(baseDir, name);
  let counter = 2;
  while (fs.existsSync(destination)) {
    destination = path.join(baseDir, `${name}-${counter}`);
    counter += 1;
  }
  return destination;
}

function stamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function writeReport({ id, deleted, refused, trashDir }) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${id}-skill-store-delete-ui.md`);
  const lines = [
    "# Skill Store Delete UI Execution",
    "",
    `Run: ${id}`,
    `Trash directory: ${trashDir}`,
    "",
    "## Deleted",
    "",
    deleted.length ? deleted.map((item) => `- ${item.name} -> ${item.destination}`).join("\n") : "- None",
    "",
    "## Refused",
    "",
    refused.length ? refused.map((item) => `- ${item.name}: ${item.reason}`).join("\n") : "- None",
    "",
  ];
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
  return reportPath;
}

function scanDir(base) {
  const stats = { sizeKB: 0, fileCount: 0, modifiedTime: 0 };
  if (!fs.existsSync(base)) return stats;
  const stack = [base];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const item = fs.statSync(full);
      stats.fileCount += 1;
      stats.sizeKB += item.size / 1024;
      if (item.mtimeMs > stats.modifiedTime) stats.modifiedTime = item.mtimeMs;
    }
  }
  stats.sizeKB = Math.round(stats.sizeKB);
  return stats;
}

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDate(date) {
  return formatDateTime(date).slice(0, 10);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function listTrashItems() {
  if (!fs.existsSync(trashRoot)) return [];
  const items = [];
  for (const batch of fs.readdirSync(trashRoot, { withFileTypes: true })) {
    if (!batch.isDirectory()) continue;
    const batchPath = path.join(trashRoot, batch.name);
    const batchStat = fs.statSync(batchPath);
    const children = fs.readdirSync(batchPath, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    if (fs.existsSync(path.join(batchPath, "SKILL.md"))) {
      const stats = scanDir(batchPath);
      items.push({
        id: batch.name,
        name: batch.name,
        batch: "",
        path: batchPath,
        deletedAt: formatDateTime(batchStat.mtime),
        sizeKB: stats.sizeKB,
        fileCount: stats.fileCount,
      });
      continue;
    }
    for (const child of children) {
      const target = path.join(batchPath, child.name);
      const stats = scanDir(target);
      items.push({
        id: `${batch.name}/${child.name}`,
        name: child.name,
        batch: batch.name,
        path: target,
        deletedAt: formatDateTime(batchStat.mtime),
        sizeKB: stats.sizeKB,
        fileCount: stats.fileCount,
      });
    }
  }
  return items.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt) || a.name.localeCompare(b.name, "en"));
}

function safeTrashItemId(id) {
  if (typeof id !== "string") return false;
  const parts = id.split("/");
  if (parts.length < 1 || parts.length > 2) return false;
  return parts.every((part) => /^[A-Za-z0-9._-]+$/.test(part));
}

function writePermanentDeleteReport({ id, deleted, refused }) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${id}-skill-store-permanent-delete-ui.md`);
  const lines = [
    "# Skill Store Permanent Delete UI Execution",
    "",
    `Run: ${id}`,
    `Trash root: ${trashRoot}`,
    "",
    "## Permanently Deleted",
    "",
    deleted.length ? deleted.map((item) => `- ${item.id} -> ${item.path}`).join("\n") : "- None",
    "",
    "## Refused",
    "",
    refused.length ? refused.map((item) => `- ${item.id}: ${item.reason}`).join("\n") : "- None",
    "",
  ];
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
  return reportPath;
}

function rebuildSkillStore() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["run", "build:skill-store-dashboard"], {
    cwd: root,
    stdio: "pipe",
    encoding: "utf8",
  });
}

async function deleteSkills(request, response) {
  const body = await readBody(request);
  const payload = JSON.parse(body || "{}");
  const names = Array.isArray(payload.names) ? [...new Set(payload.names)] : [];
  if (!names.length) return send(response, 400, { ok: false, error: "No skill names supplied" });
  if (names.length > 200) return send(response, 400, { ok: false, error: "Too many skill names" });

  const data = loadSkillStoreData();
  const byName = new Map((data.skills || []).map((skill) => [skill.name, skill]));
  const id = stamp();
  const trashDir = path.join(trashRoot, id);
  const deleted = [];
  const refused = [];

  fs.mkdirSync(trashDir, { recursive: true });

  for (const name of names) {
    if (!safeSkillName(name)) {
      refused.push({ name: String(name), reason: "invalid skill name" });
      continue;
    }
    const skill = byName.get(name);
    if (!skill) {
      refused.push({ name, reason: "not found in Skill Store data" });
      continue;
    }
    if (!skill.cleanup_candidate) {
      refused.push({ name, reason: "not in cleanup list" });
      continue;
    }
    if (skill.current || ["current", "supporting", "governance"].includes(skill.lifecycle)) {
      refused.push({ name, reason: "protected skill" });
      continue;
    }
    const target = path.resolve(skill.localPath || path.join(skillStoreDir, name));
    if (!isInside(skillStoreDir, target)) {
      refused.push({ name, reason: "target outside .skill-store" });
      continue;
    }
    if (!fs.existsSync(target)) {
      refused.push({ name, reason: "local skill folder not found" });
      continue;
    }
    const destination = uniqueDestination(trashDir, name);
    fs.renameSync(target, destination);
    deleted.push({ name, destination });
  }

  const reportPath = writeReport({ id, deleted, refused, trashDir });
  if (deleted.length) rebuildSkillStore();
  return send(response, 200, { ok: true, deleted, refused, trashDir, reportPath });
}

async function permanentlyDeleteTrash(request, response) {
  const body = await readBody(request);
  const payload = JSON.parse(body || "{}");
  const ids = Array.isArray(payload.ids) ? [...new Set(payload.ids)] : [];
  if (!ids.length) return send(response, 400, { ok: false, error: "No trash item ids supplied" });
  if (ids.length > 200) return send(response, 400, { ok: false, error: "Too many trash item ids" });

  const deleted = [];
  const refused = [];
  const id = stamp();

  for (const itemId of ids) {
    if (!safeTrashItemId(itemId)) {
      refused.push({ id: String(itemId), reason: "invalid trash item id" });
      continue;
    }
    const target = path.resolve(trashRoot, ...itemId.split("/"));
    if (target === trashRoot || !isInside(trashRoot, target)) {
      refused.push({ id: itemId, reason: "target outside .skill-store-trash" });
      continue;
    }
    if (!fs.existsSync(target)) {
      refused.push({ id: itemId, reason: "trash item not found" });
      continue;
    }
    if (!fs.statSync(target).isDirectory()) {
      refused.push({ id: itemId, reason: "trash item is not a directory" });
      continue;
    }
    fs.rmSync(target, { recursive: true, force: false });
    deleted.push({ id: itemId, path: target });

    const parent = path.dirname(target);
    if (parent !== trashRoot && isInsideOrSame(trashRoot, parent) && fs.existsSync(parent) && fs.readdirSync(parent).length === 0) {
      fs.rmdirSync(parent);
    }
  }

  const reportPath = writePermanentDeleteReport({ id, deleted, refused });
  return send(response, 200, { ok: true, deleted, refused, reportPath, items: listTrashItems() });
}

async function markSkillsCommon(request, response) {
  const body = await readBody(request);
  const payload = JSON.parse(body || "{}");
  const names = Array.isArray(payload.names) ? [...new Set(payload.names)] : [];
  if (!names.length) return send(response, 400, { ok: false, error: "No skill names supplied" });
  if (names.length > 200) return send(response, 400, { ok: false, error: "Too many skill names" });

  const data = loadSkillStoreData();
  const byName = new Map((data.skills || []).map((skill) => [skill.name, skill]));
  const overrides = readJson(usageOverridesPath, {});
  const observation = readJson(cleanupObservationPath, {});
  const today = formatDate(new Date());
  const updated = [];
  const refused = [];

  for (const name of names) {
    if (!safeSkillName(name)) {
      refused.push({ name: String(name), reason: "invalid skill name" });
      continue;
    }
    const skill = byName.get(name);
    if (!skill) {
      refused.push({ name, reason: "not found in Skill Store data" });
      continue;
    }
    if (!skill.cleanup_candidate) {
      refused.push({ name, reason: "not in cleanup list" });
      continue;
    }
    overrides[name] = {
      last_used: today,
      usage_count: Math.max(1, Number(overrides[name]?.usage_count || 0), Number(skill.usage_count || 0)),
      reason: "Marked as commonly used from Skill Store cleanup management.",
    };
    observation.recommended_cleanup_now = (observation.recommended_cleanup_now || []).filter((item) => item !== name);
    if (observation.reason && typeof observation.reason === "object") delete observation.reason[name];
    updated.push(name);
  }

  if (updated.length) {
    writeJson(usageOverridesPath, overrides);
    writeJson(cleanupObservationPath, observation);
    rebuildSkillStore();
  }
  return send(response, 200, { ok: true, updated, refused, usageOverridesPath });
}

async function markSkillsCleanup(request, response) {
  const body = await readBody(request);
  const payload = JSON.parse(body || "{}");
  const names = Array.isArray(payload.names) ? [...new Set(payload.names)] : [];
  if (!names.length) return send(response, 400, { ok: false, error: "No skill names supplied" });
  if (names.length > 200) return send(response, 400, { ok: false, error: "Too many skill names" });

  const data = loadSkillStoreData();
  const byName = new Map((data.skills || []).map((skill) => [skill.name, skill]));
  const observation = readJson(cleanupObservationPath, {
    baseline_observation_started_at: formatDate(new Date()),
    observe_days: 30,
    recommended_cleanup_now: [],
    reason: {},
  });
  if (!Array.isArray(observation.recommended_cleanup_now)) observation.recommended_cleanup_now = [];
  if (!observation.reason || typeof observation.reason !== "object") observation.reason = {};
  const recommended = new Set(observation.recommended_cleanup_now);
  const updated = [];
  const refused = [];

  for (const name of names) {
    if (!safeSkillName(name)) {
      refused.push({ name: String(name), reason: "invalid skill name" });
      continue;
    }
    const skill = byName.get(name);
    if (!skill) {
      refused.push({ name, reason: "not found in Skill Store data" });
      continue;
    }
    if (skill.current || ["current", "supporting", "governance"].includes(skill.lifecycle)) {
      refused.push({ name, reason: "protected skill" });
      continue;
    }
    recommended.add(name);
    observation.reason[name] = "Manually added from Skill Store detail.";
    updated.push(name);
  }

  if (updated.length) {
    observation.recommended_cleanup_now = [...recommended].sort((a, b) => a.localeCompare(b, "en"));
    writeJson(cleanupObservationPath, observation);
    rebuildSkillStore();
  }
  return send(response, 200, { ok: true, updated, refused, cleanupObservationPath });
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") return send(response, 204, {});
    const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    if (request.method === "GET" && url.pathname === "/health") {
      return send(response, 200, { ok: true, skillStoreDir, trashRoot });
    }
    if (request.method === "GET" && url.pathname === "/skill-store/trash") {
      return send(response, 200, { ok: true, trashRoot, items: listTrashItems() });
    }
    if (request.method === "POST" && url.pathname === "/skill-store/delete") {
      return await deleteSkills(request, response);
    }
    if (request.method === "POST" && url.pathname === "/skill-store/mark-common") {
      return await markSkillsCommon(request, response);
    }
    if (request.method === "POST" && url.pathname === "/skill-store/mark-cleanup") {
      return await markSkillsCleanup(request, response);
    }
    if (request.method === "POST" && url.pathname === "/skill-store/trash/delete") {
      return await permanentlyDeleteTrash(request, response);
    }
    return send(response, 404, { ok: false, error: "Not found" });
  } catch (error) {
    return send(response, 500, { ok: false, error: error.message || String(error) });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Skill Store ops server listening at http://127.0.0.1:${port}`);
});
