#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { writeFrontstageData } from "../../01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs";

const root = process.cwd();
const frontstageFile = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function main() {
  const frontstage = readJson(frontstageFile);
  if (!Array.isArray(frontstage.entityProfiles)) {
    throw new Error("Data Center frontstage entity profiles are required before refreshing viewpoints");
  }

  const previousCount = Array.isArray(frontstage.viewpoints) ? frontstage.viewpoints.length : 0;
  // Viewpoint lists and person profiles/last-seen indexes are one publication.
  // The caller materializes and gates the current V4 data lake first.
  const { data } = writeFrontstageData(root);

  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, frontstageFile).replace(/\\/gu, "/"),
    previousCount,
    viewpoints: data.viewpoints.length,
  }, null, 2));
}

main();
