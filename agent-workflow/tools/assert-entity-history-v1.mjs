#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const frontstageFile = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
const splitRoot = path.join(root, "01-SiteV2/site/data/data-center-v4");
const reportFile = path.join(root, "agent-workflow/reports/entity-history-v1-gate.json");
const schemaFile = path.join(root, "agent-workflow/product/entity-history-v1.schema.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function unique(values) {
  return new Set(values).size === values.length;
}

function daysBetween(start, end) {
  return Math.floor((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

function evaluate(data) {
  const problems = [];
  const profiles = data.entityProfiles || [];
  const nodes = data.taxonomyNodes || [];
  const relationships = data.entityRelationships || [];
  const entityIds = new Set(profiles.map((item) => item.id));
  const profilesById = new Map(profiles.map((item) => [item.id, item]));
  const nodeIds = new Set(nodes.map((item) => item.id));
  const eventIds = new Set((data.events || []).map((item) => item.id));
  const manifest = data.entityHistoryManifest || {};

  if (data.meta?.productVersion !== "SITE-V4.2.0-entity-history") problems.push("frontstage product version is not SITE-V4.2.0-entity-history");
  if (manifest.entityVersion !== "ENTITY-V1.0") problems.push("entity version is not ENTITY-V1.0");
  if (manifest.relationshipVersion !== "RELATION-V2.0") problems.push("relationship version is not RELATION-V2.0");
  if (!profiles.length) problems.push("entity profiles are empty");
  if (!(data.people || []).length) problems.push("people are missing from the unified entity index");
  if (!unique(profiles.map((item) => item.id))) problems.push("entity ids are not unique");
  if (!unique(nodes.map((item) => item.id))) problems.push("taxonomy node ids are not unique");
  if (!unique(relationships.map((item) => item.relationship_id))) problems.push("relationship ids are not unique");
  if ((data.products || []).some((item) => !/^EN-[a-f0-9]{16}$/u.test(item.id))) problems.push("frontstage products are not using persisted EN ids");
  if ((data.people || []).some((item) => !item.viewpointIds?.length)) problems.push("public people contain no viewpoint lineage");
  if (nodes.some((item) => !["technology", "use_case", "industry"].includes(item.nodeType))) problems.push("taxonomy index contains a non-approved dimension");

  for (const profile of profiles) {
    if (!/^EN-[a-f0-9]{16}$/u.test(profile.id)) problems.push(`invalid entity id ${profile.id}`);
    if (profile.entityType === "person_candidate" && profile.eventIds.length && !profile.datasetScopes.includes("canonical")) problems.push(`viewpoint-only person ${profile.id} entered canonical events`);
    const dates = (profile.timeline || []).map((item) => item.dataDate || item.date).filter(Boolean);
    if (dates.some((value, index) => index && value > dates[index - 1])) problems.push(`timeline is not descending for ${profile.id}`);
  }

  for (const relation of relationships) {
    if (relation.relationship_version !== "RELATION-V2.0") problems.push(`relationship version missing for ${relation.relationship_id}`);
    if (!entityIds.has(relation.subject_ref)) problems.push(`relationship subject does not resolve ${relation.relationship_id}`);
    if (relation.object_type === "entity" && !entityIds.has(relation.object_ref)) problems.push(`relationship object entity does not resolve ${relation.relationship_id}`);
    if (relation.object_type === "taxonomy" && !nodeIds.has(relation.object_ref)) problems.push(`relationship taxonomy object does not resolve ${relation.relationship_id}`);
    if (!eventIds.has(relation.event_id)) problems.push(`relationship event does not resolve ${relation.relationship_id}`);
    if (!relation.claim_refs?.length) problems.push(`relationship has no Claim refs ${relation.relationship_id}`);
    if (!relation.source_refs?.length) problems.push(`relationship has no source refs ${relation.relationship_id}`);
    if (profilesById.get(relation.subject_ref)?.verificationStatus !== "verified") problems.push(`relationship subject is not verified ${relation.relationship_id}`);
    if (relation.object_type === "entity" && profilesById.get(relation.object_ref)?.verificationStatus !== "verified") problems.push(`relationship object is not verified ${relation.relationship_id}`);
  }

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validateSchema = ajv.compile(readJson(schemaFile));
  const schemaPayload = {
    manifest,
    registry: profiles.map(({ timeline, viewpoints, groupedEventIds, relationIds, ...item }) => item),
    profiles,
    taxonomyNodes: nodes,
    relationships
  };
  if (!validateSchema(schemaPayload)) {
    for (const error of validateSchema.errors || []) problems.push(`schema ${error.instancePath || "/"} ${error.message}`);
  }

  const coverageDays = daysBetween(manifest.coverage?.startDate || "", manifest.coverage?.endDate || "");
  if (!Number.isFinite(coverageDays) || coverageDays < 175) problems.push(`entity event-time coverage is below six-month release window (${coverageDays || 0} days)`);
  if ((manifest.coverage?.distinctDataDays || 0) < 50) problems.push("entity history has fewer than 50 accepted data batches");

  const forbidden = ["business_meaning", "why_watch", "why_selected", "importance_score", "opportunity_score", "recommendation"];
  const serialized = JSON.stringify({ profiles, nodes, relationships });
  for (const field of forbidden) if (serialized.includes(`\"${field}\"`)) problems.push(`forbidden field entered entity service: ${field}`);

  for (const file of [
    "manifest.json",
    "indexes/events.json",
    "indexes/entities.json",
    "indexes/fde.json",
    "indexes/hardware.json",
    "details/events.json"
  ]) if (!fs.existsSync(path.join(splitRoot, file))) problems.push(`split frontstage file missing: ${file}`);
  const entityDetailDir = path.join(splitRoot, "entities");
  const taxonomyDetailDir = path.join(splitRoot, "taxonomy");
  const entityDetailFiles = fs.existsSync(entityDetailDir) ? fs.readdirSync(entityDetailDir).filter((file) => file.endsWith(".json")) : [];
  const taxonomyDetailFiles = fs.existsSync(taxonomyDetailDir) ? fs.readdirSync(taxonomyDetailDir).filter((file) => file.endsWith(".json")) : [];
  if (entityDetailFiles.length !== profiles.length) problems.push(`split entity detail count mismatch (${entityDetailFiles.length}/${profiles.length})`);
  if (taxonomyDetailFiles.length !== nodes.length) problems.push(`split taxonomy detail count mismatch (${taxonomyDetailFiles.length}/${nodes.length})`);
  for (const profile of profiles) if (!fs.existsSync(path.join(entityDetailDir, `${profile.id}.json`))) problems.push(`split entity detail missing: ${profile.id}`);
  for (const node of nodes) if (!fs.existsSync(path.join(taxonomyDetailDir, `${node.id}.json`))) problems.push(`split taxonomy detail missing: ${node.id}`);

  return {
    ok: problems.length === 0,
    checkedAt: new Date().toISOString(),
    versions: {
      product: data.meta?.productVersion || "",
      entity: manifest.entityVersion || "",
      relationship: manifest.relationshipVersion || ""
    },
    coverage: { ...manifest.coverage, eventTimeDays: coverageDays },
    counts: manifest.counts || {},
    problems
  };
}

if (!fs.existsSync(frontstageFile)) {
  console.error(JSON.stringify({ ok: false, problems: ["frontstage data is missing; run npm run build:data-center-site"] }, null, 2));
  process.exit(1);
}

const report = evaluate(readJson(frontstageFile));
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, report: path.relative(root, reportFile).replace(/\\/gu, "/") }, null, 2));
if (!report.ok) process.exit(1);
