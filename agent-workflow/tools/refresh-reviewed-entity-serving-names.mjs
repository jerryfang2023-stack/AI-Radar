#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRoot = path.resolve(__dirname, "../..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function canonicalNames(root) {
  const files = [
    "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json",
    "01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json"
  ];
  const names = new Map();
  for (const relativeFile of files) {
    const ledger = readJson(path.join(root, relativeFile));
    for (const decision of ledger.decisions || []) {
      if (decision.review_status !== "accepted"
        || !["confirm", "correct"].includes(decision.action)
        || !decision.canonical?.name) continue;
      names.set(decision.entity_id, decision.canonical.name);
    }
  }
  return names;
}

function refreshEntity(entity, names) {
  if (!entity?.id || !names.has(entity.id) || typeof entity.name !== "string") return false;
  const canonicalName = names.get(entity.id);
  if (entity.name === canonicalName) return false;
  entity.name = canonicalName;
  return true;
}

function refreshRelationship(relationship, names) {
  let changed = false;
  if (typeof relationship?.subjectName === "string"
    && names.has(relationship.subject_ref)
    && relationship.subjectName !== names.get(relationship.subject_ref)) {
    relationship.subjectName = names.get(relationship.subject_ref);
    changed = true;
  }
  if (typeof relationship?.objectName === "string"
    && names.has(relationship.object_ref)
    && relationship.objectName !== names.get(relationship.object_ref)) {
    relationship.objectName = names.get(relationship.object_ref);
    changed = true;
  }
  return changed;
}

function writeIfChanged(file, data, changedFiles, changed) {
  if (!changed) return;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  changedFiles.push(file);
}

export function refreshReviewedEntityServingNames(root = defaultRoot) {
  const names = canonicalNames(root);
  const dataRoot = path.join(root, "01-SiteV2/site/data");
  const splitRoot = path.join(dataRoot, "data-center-v4");
  const changedFiles = [];

  const frontstageFile = path.join(dataRoot, "data-center-v4-frontstage.json");
  const frontstage = readJson(frontstageFile);
  let changed = false;
  for (const key of ["companies", "products", "people", "entityProfiles"]) {
    for (const entity of frontstage[key] || []) changed = refreshEntity(entity, names) || changed;
  }
  writeIfChanged(frontstageFile, frontstage, changedFiles, changed);

  const entityIndexFile = path.join(splitRoot, "indexes/entities.json");
  const entityIndex = readJson(entityIndexFile);
  changed = false;
  for (const key of ["companies", "products", "people"]) {
    for (const entity of entityIndex[key] || []) changed = refreshEntity(entity, names) || changed;
  }
  writeIfChanged(entityIndexFile, entityIndex, changedFiles, changed);

  for (const directory of ["entities", "taxonomy"]) {
    const absoluteDirectory = path.join(splitRoot, directory);
    for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
      if (!entry.isFile() || path.extname(entry.name) !== ".json") continue;
      const file = path.join(absoluteDirectory, entry.name);
      const data = readJson(file);
      changed = refreshEntity(data.entity, names);
      for (const entity of [...(data.relatedEntities || []), ...(data.entities || [])]) {
        changed = refreshEntity(entity, names) || changed;
      }
      for (const relationship of data.relationships || []) {
        changed = refreshRelationship(relationship, names) || changed;
      }
      writeIfChanged(file, data, changedFiles, changed);
    }
  }

  for (const relativeFile of ["indexes/relationships.json", "details/relationships.json"]) {
    const file = path.join(splitRoot, relativeFile);
    const data = readJson(file);
    changed = false;
    for (const relationship of data.relationships || []) {
      changed = refreshRelationship(relationship, names) || changed;
    }
    writeIfChanged(file, data, changedFiles, changed);
  }

  return {
    ok: true,
    reviewedNames: names.size,
    changedFiles: changedFiles.map((file) => path.relative(root, file).replace(/\\/gu, "/"))
  };
}

function main() {
  console.log(JSON.stringify(refreshReviewedEntityServingNames(), null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main();
