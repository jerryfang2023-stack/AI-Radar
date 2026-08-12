import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(root, "..");
const require = createRequire(import.meta.url);
const sourceDir = path.join(workspace, "02-Miniprogram", "miniprogram", "data");
const targetDir = path.join(root, "public", "data");

const sources = {
  "funding-index.json": "funding-index.js",
  "funding-details.json": "funding-details.js",
  "report-index.json": "report-index.js",
  "report-details.json": "report-details.js",
};

fs.mkdirSync(targetDir, { recursive: true });

let synced = 0;
let preserved = 0;
for (const [target, source] of Object.entries(sources)) {
  const sourceFile = path.join(sourceDir, source);
  const targetFile = path.join(targetDir, target);
  if (!fs.existsSync(sourceFile)) {
    if (!fs.existsSync(targetFile)) {
      throw new Error(`Missing both source and bundled H5 data: ${sourceFile}`);
    }
    preserved += 1;
    continue;
  }
  delete require.cache[require.resolve(sourceFile)];
  fs.writeFileSync(targetFile, `${JSON.stringify(require(sourceFile))}\n`, "utf8");
  synced += 1;
}

console.log(JSON.stringify({ files: Object.keys(sources).length, synced, preserved, output: targetDir }, null, 2));
