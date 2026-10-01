#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const profileFile = path.join(root, "01-SiteV2/content/11-databases/public-entity-profile-coverage-v1.json");
const profiles = JSON.parse(fs.readFileSync(profileFile, "utf8"));
const investorProfiles = {
  ...profiles.institutions,
  ...Object.fromEntries(Object.entries(profiles.people || {}).filter(([id]) => id.startsWith("INV-")))
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const file = path.join(root, relativePath);
  const next = `${JSON.stringify(value, null, 2)}\n`;
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== next) fs.writeFileSync(file, next, 'utf8');
}

function addProfile(rows = [], profileById = {}) {
  return rows.map((row) => profileById[row.id] ? { ...row, public_profile: profileById[row.id] } : row);
}

const investmentDbPath = "01-SiteV2/content/11-databases/investment-institutions-v1.json";
const investmentDb = readJson(investmentDbPath);
investmentDb.institutions = addProfile(investmentDb.institutions, investorProfiles);
writeJson(investmentDbPath, investmentDb);

const frontstagePath = "01-SiteV2/site/data/data-center-v4-frontstage.json";
const frontstage = readJson(frontstagePath);
frontstage.people = addProfile(frontstage.people, profiles.people);
frontstage.entityProfiles = addProfile(frontstage.entityProfiles, profiles.people);
frontstage.investors = addProfile(frontstage.investors, investorProfiles);
if (frontstage.investmentInstitutionRegistry) {
  frontstage.investmentInstitutionRegistry.institutions = addProfile(frontstage.investmentInstitutionRegistry.institutions, investorProfiles);
}
writeJson(frontstagePath, frontstage);

const indexPath = "01-SiteV2/site/data/data-center-v4/indexes/entities.json";
const index = readJson(indexPath);
index.people = addProfile(index.people, profiles.people);
index.investors = addProfile(index.investors, investorProfiles);
writeJson(indexPath, index);

const materializedInvestors = new Set((index.investors || []).map((row) => row.id));
const materializedPeople = new Set((index.people || []).map((row) => row.id));
const deferredDetails = [];
for (const [id, profile] of Object.entries(investorProfiles)) {
  const detailPath = path.join(root, "01-SiteV2/site/data/data-center-v4/investors", `${id}.json`);
  // The registry/profile stage precedes the next frontstage materialization.
  // New or retired profiles have no current detail yet. Preserve their source
  // profile; the next build joins it from the registry. Missing indexed details
  // remain a real integrity error rather than being silently skipped.
  if (!materializedInvestors.has(id)) { deferredDetails.push(id); continue; }
  if (!fs.existsSync(detailPath)) throw new Error(`missing_institution_detail:${id}`);
  const detail = JSON.parse(fs.readFileSync(detailPath, "utf8"));
  detail.institution.public_profile = profile;
  writeJson(path.relative(root, detailPath), detail);
}
for (const [id, profile] of Object.entries(profiles.people)) {
  const detailPath = path.join(root, "01-SiteV2/site/data/data-center-v4/entities", `${id}.json`);
  if (!materializedPeople.has(id)) { deferredDetails.push(id); continue; }
  if (!fs.existsSync(detailPath)) throw new Error(`missing_person_detail:${id}`);
  const detail = JSON.parse(fs.readFileSync(detailPath, "utf8"));
  detail.entity.public_profile = profile;
  writeJson(path.relative(root, detailPath), detail);
}

console.log(JSON.stringify({ ok: true, institutions: Object.keys(profiles.institutions).length, people: Object.keys(profiles.people).length, deferred_details_until_materialization: deferredDetails }, null, 2));
