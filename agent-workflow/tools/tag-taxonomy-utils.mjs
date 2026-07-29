import fs from "node:fs";
import path from "node:path";

export const tagGroups = ["track", "opinion"];

const taxonomyRelativePath = path.join("agent-workflow", "product", "column-tag-taxonomy-v1.json");

export function readTagTaxonomy(root = process.cwd()) {
  const taxonomyPath = path.join(root, taxonomyRelativePath);
  const payload = JSON.parse(fs.readFileSync(taxonomyPath, "utf8"));
  if (payload.taxonomy_version !== "COLUMN-TAG-V1.0" || payload.canonical_fact_input !== false || !Array.isArray(payload.tags)) {
    throw new Error("invalid First-Line Viewpoints column tag taxonomy");
  }
  return payload.tags.map((tag) => ({
    ...tag,
    aliases: Array.isArray(tag.aliases) ? tag.aliases : [],
    status: "active",
    merge_to: null,
  }));
}

export function buildTagIndex(tags) {
  const byId = new Map();
  const byAlias = new Map();
  for (const tag of tags) {
    byId.set(tag.id, tag);
    byAlias.set(tag.id.toLowerCase(), tag.id);
    if (tag.name) byAlias.set(tag.name.toLowerCase(), tag.id);
    for (const alias of tag.aliases || []) byAlias.set(String(alias).toLowerCase(), tag.id);
  }
  return { byId, byAlias };
}

export function toSiteTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    group: tag.group,
    aliases: tag.aliases || [],
  };
}
