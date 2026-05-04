import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(__filename);
const siteDir = path.resolve(scriptsDir, "..");
const rootDir = path.resolve(siteDir, "..");
const port = Number(process.env.PORT || 8787);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500);
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function readJsonBody(req, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error("数据过大，未保存。"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("提交的数据不是有效 JSON。"));
      }
    });
    req.on("error", reject);
  });
}

function validateRadarData(data) {
  if (!Array.isArray(data.signals)) throw new Error("signals 必须是数组。");
  if (!data.scoring || !Array.isArray(data.scoring.rows)) throw new Error("scoring.rows 必须是数组。");
  if (!Array.isArray(data.trends)) throw new Error("trends 必须是数组。");
  if (!Array.isArray(data.opportunities)) throw new Error("opportunities 必须是数组。");
}

async function saveRadarData(req, res) {
  try {
    const submitted = await readJsonBody(req);
    validateRadarData(submitted);
    const data = {
      ...submitted,
      generatedAt: new Date().toISOString(),
    };
    const dataDir = path.join(siteDir, "data");
    fs.mkdirSync(dataDir, { recursive: true });
    const payload = JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(dataDir, "radar-data.json"), `${payload}\n`, "utf8");
    fs.writeFileSync(path.join(dataDir, "radar-data.js"), `window.AI_RADAR_DATA = ${payload};\n`, "utf8");
    sendJson(res, 200, {
      ok: true,
      generatedAt: data.generatedAt,
      message: `保存完成：${data.signals.length} signals，${data.scoring.rows.length} score rows，${data.trends.length} trends，${data.opportunities.length} opportunities。`,
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || "保存失败。" });
  }
}

async function runSync(res) {
  const previousCwd = process.cwd();
  try {
    process.chdir(rootDir);
    const syncUrl = `${pathToFileURL(path.join(siteDir, "scripts", "sync-data.mjs")).href}?t=${Date.now()}`;
    await import(syncUrl);
    const generated = fs.existsSync(path.join(siteDir, "data", "radar-data.json")) ? JSON.parse(fs.readFileSync(path.join(siteDir, "data", "radar-data.json"), "utf8")) : {};
    sendJson(res, 200, {
      ok: true,
      message: `同步完成：${generated.signals?.length || 0} signals，${generated.scoring?.rows?.length || 0} score rows，${generated.trends?.length || 0} trends，${generated.opportunities?.length || 0} opportunities。`,
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || "同步失败。" });
  } finally {
    process.chdir(previousCwd);
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  if (req.method === "POST" && url.pathname === "/api/sync") {
    runSync(res);
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/save-data") {
    saveRadarData(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.resolve(siteDir, normalized.slice(1));
  if (!filePath.startsWith(siteDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  sendFile(res, filePath);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(port, "127.0.0.1", () => {
    console.log(`AI Business Radar admin server running at http://localhost:${port}/admin.html`);
  });
}

export { server };
