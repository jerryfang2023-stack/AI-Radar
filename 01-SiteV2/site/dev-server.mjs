import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const skillStoreDashboard = path.join(os.homedir(), ".skill-store", "dashboard", "index.html");

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "application/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".svg": "image/svg+xml;charset=utf-8",
};

function responseHeaders(contentType) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
  };
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

createServer(async (request, response) => {
  const rawPath = decodeURIComponent((request.url || "/").split("?")[0]);

  if (rawPath === "/local-skill-store" || rawPath === "/local-skill-store/") {
    try {
      const body = await readFile(skillStoreDashboard);
      response.writeHead(200, responseHeaders("text/html;charset=utf-8"));
      response.end(enhanceSkillStoreDashboard(body));
    } catch {
      response.writeHead(404);
      response.end("Skill Store dashboard not found");
    }
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
    response.writeHead(200, responseHeaders(types[path.extname(filePath)] || "text/plain;charset=utf-8"));
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
