import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mini = path.join(root, "miniprogram");
const app = JSON.parse(fs.readFileSync(path.join(mini, "app.json"), "utf8"));
const project = JSON.parse(fs.readFileSync(path.join(root, "project.config.json"), "utf8"));
const failures = [];

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) {
    failures.push(`invalid JSON: ${file}\n${error.message}`);
    return {};
  }
}

if (project.miniprogramRoot !== "miniprogram/") failures.push("project.config.json miniprogramRoot mismatch");
if (project.appid !== "touristappid" && !/^wx[0-9a-f]{16}$/i.test(project.appid || "")) {
  failures.push("project.config.json must use touristappid or a valid WeChat AppID");
}

for (const page of app.pages || []) {
  for (const ext of ["js", "json", "wxml", "wxss"]) {
    const file = path.join(mini, `${page}.${ext}`);
    if (!fs.existsSync(file)) failures.push(`missing page file: ${file}`);
  }
  const pageJsonFile = path.join(mini, `${page}.json`);
  if (fs.existsSync(pageJsonFile)) {
    const pageJson = readJson(pageJsonFile);
    for (const componentPath of Object.values(pageJson.usingComponents || {})) {
      const base = path.join(mini, componentPath.replace(/^\//, ""));
      for (const ext of ["js", "json", "wxml", "wxss"]) {
        if (!fs.existsSync(`${base}.${ext}`)) failures.push(`missing component file: ${base}.${ext}`);
      }
    }
  }
}

for (const item of app.tabBar?.list || []) {
  if (!app.pages.includes(item.pagePath)) failures.push(`tabBar page is not registered: ${item.pagePath}`);
}

if (!fs.existsSync(path.join(mini, app.sitemapLocation || ""))) failures.push("sitemapLocation does not resolve inside miniprogramRoot");

const jsFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) jsFiles.push(full);
  }
}
walk(mini);
for (const file of jsFiles) {
  try { execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }); }
  catch (error) { failures.push(`syntax error: ${file}\n${error.stderr?.toString() || error.message}`); }
}

const packageBytes = jsFiles.concat([]).reduce((sum, file) => sum + fs.statSync(file).size, 0);
if (packageBytes > 1_800_000) failures.push(`JavaScript package budget exceeded: ${packageBytes} bytes`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ pages: app.pages.length, jsFiles: jsFiles.length, jsBytes: packageBytes }, null, 2));
