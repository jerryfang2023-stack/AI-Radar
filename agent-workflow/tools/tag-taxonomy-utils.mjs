import fs from "node:fs";
import path from "node:path";

export const tagGroups = [
  "track",
  "function",
  "scenario",
  "customer",
  "evidence",
  "stage",
  "region",
  "source",
  "opinion",
];

export const tagIdPattern = new RegExp(`\\b(?:${tagGroups.join("|")})-[a-z0-9-]+\\b`, "gu");

const taxonomyRelativePath = path.join("agent-workflow", "product", "tag-taxonomy.md");

function splitTableRow(line) {
  return line
    .replace(/^\s*\|/u, "")
    .replace(/\|\s*$/u, "")
    .split("|")
    .map((cell) => cell.trim());
}

function cleanCell(cell = "") {
  return cell
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim();
}

function parseAliases(cell = "") {
  const cleaned = cleanCell(cell);
  if (!cleaned || cleaned === "-") return [];
  return cleaned
    .split(/[、,，]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseTagTaxonomyMarkdown(markdown) {
  const tags = [];
  let currentGroup = "";

  for (const rawLine of String(markdown || "").split(/\r?\n/u)) {
    const heading = rawLine.match(/^###\s+([a-z-]+)\s*$/u);
    if (heading) {
      currentGroup = tagGroups.includes(heading[1]) ? heading[1] : "";
      continue;
    }
    if (/^#/u.test(rawLine)) {
      currentGroup = "";
      continue;
    }

    if (!currentGroup || !rawLine.trim().startsWith("|")) continue;
    if (/^\|\s*-+/u.test(rawLine) || /\|\s*tag_id\s*\|/iu.test(rawLine)) continue;

    const [idCell, nameCell, aliasesCell, descriptionCell] = splitTableRow(rawLine);
    const id = cleanCell(idCell);
    if (!tagIdPattern.test(id)) {
      tagIdPattern.lastIndex = 0;
      continue;
    }
    tagIdPattern.lastIndex = 0;

    tags.push({
      id,
      tag_id: id,
      name: cleanCell(nameCell),
      group: currentGroup,
      aliases: parseAliases(aliasesCell),
      description: cleanCell(descriptionCell),
      status: "active",
      merge_to: null,
    });
  }

  return tags;
}

export function readTagTaxonomy(root = process.cwd()) {
  const taxonomyPath = path.join(root, taxonomyRelativePath);
  const markdown = fs.readFileSync(taxonomyPath, "utf8");
  return parseTagTaxonomyMarkdown(markdown);
}

export function buildTagIndex(tags) {
  const byId = new Map();
  const byAlias = new Map();
  for (const tag of tags) {
    byId.set(tag.id, tag);
    byAlias.set(tag.id.toLowerCase(), tag.id);
    if (tag.name) byAlias.set(tag.name.toLowerCase(), tag.id);
    for (const alias of tag.aliases || []) {
      byAlias.set(String(alias).toLowerCase(), tag.id);
    }
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
