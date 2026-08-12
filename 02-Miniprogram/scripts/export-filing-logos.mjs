import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const brandDir = path.join(root, "miniprogram", "assets", "brand");
const outputDir = path.join(root, "docs", "filing-assets");

const exports = [
  {
    source: "logo-wavesight-reference-horizontal.svg",
    output: "guanlan-brand-logo.png",
    width: 1620,
    height: 596,
  },
  {
    source: "app-icon-stacked.svg",
    output: "guanlan-miniprogram-logo.png",
    width: 1024,
    height: 1024,
  },
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const item of exports) {
    const svg = await readFile(path.join(brandDir, item.source), "utf8");
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
    await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}svg{display:block;width:100%;height:100%}</style></head><body>${svg}</body></html>`);
    await page.screenshot({ path: path.join(outputDir, item.output), omitBackground: true });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ outputDir, files: exports.map((item) => item.output) }, null, 2));
