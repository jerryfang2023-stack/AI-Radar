#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { normalizeFundingAmount, readJson } from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const shouldWrite = process.argv.includes("--write=true");
const fundingRoot = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
const projectionPaths = [
  path.join(root, "01-SiteV2/content/11-databases/investment-institutions-v1.json"),
  path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"),
  path.join(root, "01-SiteV2/site/data/data-center-v4/investors"),
];

function normalizedAmount(original, current) {
  if (current?.currency !== "CNY") return current;
  const normalized = normalizeFundingAmount(original);
  return normalized.currency === "CNY" ? normalized : current;
}

function normalizeCnyProjection(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeCnyProjection);
  }
  if (!value || typeof value !== "object") return value;

  const output = Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, normalizeCnyProjection(nested)]),
  );
  if (output.currency !== "CNY" || typeof output.display_zh !== "string") return output;
  return {
    ...output,
    display_zh: output.display_zh
      .replace(/(?:\s*人民币|\s*CNY|\s*RMB)/gu, "元")
      .replace(/元元/gu, "元"),
  };
}

function jsonFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  if (fs.statSync(targetPath).isFile()) return [targetPath];
  return fs.readdirSync(targetPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(targetPath, file));
}

function main() {
  const files = fs.readdirSync(fundingRoot)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
    .sort();
  const changedFiles = [];
  let changedAmounts = 0;

  for (const file of files) {
    const fullPath = path.join(fundingRoot, file);
    const bundle = readJson(fullPath, {});
    const cards = (bundle.cards || []).map((card) => {
      const financing = card.financing || {};
      const amountNormalized = normalizedAmount(financing.amount, financing.amount_normalized);
      const totalRaisedNormalized = normalizedAmount(financing.total_raised, financing.total_raised_normalized);
      if (
        JSON.stringify(amountNormalized) === JSON.stringify(financing.amount_normalized)
        && JSON.stringify(totalRaisedNormalized) === JSON.stringify(financing.total_raised_normalized)
      ) return card;
      changedAmounts += Number(JSON.stringify(amountNormalized) !== JSON.stringify(financing.amount_normalized));
      changedAmounts += Number(JSON.stringify(totalRaisedNormalized) !== JSON.stringify(financing.total_raised_normalized));
      return {
        ...card,
        financing: {
          ...financing,
          amount_normalized: amountNormalized,
          total_raised_normalized: totalRaisedNormalized,
        },
      };
    });
    const output = { ...bundle, cards };
    const serialized = `${JSON.stringify(output, null, 2)}\n`;
    if (serialized === fs.readFileSync(fullPath, "utf8")) continue;
    changedFiles.push(file);
    if (shouldWrite) fs.writeFileSync(fullPath, serialized, "utf8");
  }

  for (const fullPath of projectionPaths.flatMap(jsonFiles)) {
    const input = readJson(fullPath, {});
    const output = normalizeCnyProjection(input);
    const serialized = `${JSON.stringify(output, null, 2)}\n`;
    if (serialized === fs.readFileSync(fullPath, "utf8")) continue;
    changedFiles.push(path.relative(root, fullPath));
    if (shouldWrite) fs.writeFileSync(fullPath, serialized, "utf8");
  }

  console.log(JSON.stringify({
    ok: true,
    mode: shouldWrite ? "write" : "dry-run",
    files: files.length,
    changedFiles: changedFiles.length,
    changedAmounts,
  }, null, 2));
}

main();
