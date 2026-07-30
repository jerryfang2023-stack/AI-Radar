import fs from "node:fs";
import path from "node:path";

const CITATION_ROOT = "60-知识资产/来源引用";
const RELATION_INDEX = "60-知识资产/证据关系索引.md";
const EVIDENCE_MANIFEST = ".guanlan-evidence.json";
const EVIDENCE_START = "<!-- guanlan-evidence:start -->";
const EVIDENCE_END = "<!-- guanlan-evidence:end -->";
const EVIDENCE_FIELDS = new Set([
  "evidence_status",
  "evidence_source_refs",
  "evidence_claim_refs",
  "evidence_event_refs",
  "evidence_entity_refs",
  "evidence_report_refs",
  "evidence_source_urls",
  "original_body_storage",
]);

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  } catch {
    return fallback;
  }
}

function listJsonDateRoots(root) {
  const databaseRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  if (!fs.existsSync(databaseRoot)) return [];
  return fs.readdirSync(databaseRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => path.join(databaseRoot, entry.name))
    .sort();
}

function rows(file) {
  const payload = readJson(file, []);
  if (Array.isArray(payload)) return payload;
  for (const key of ["items", "records", "data"]) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function unique(values) {
  return [...new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))];
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    url.hash = "";
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/u, "");
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|source$|mc_)/iu.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    return url.toString().replace(/\/$/u, "");
  } catch {
    return "";
  }
}

function urlsFromMarkdown(content) {
  const urls = [];
  for (const match of content.matchAll(/https?:\/\/[^\s<>)\]"']+/gu)) {
    const normalized = normalizeUrl(match[0].replace(/[.,;:!?，。；：！？]+$/u, ""));
    if (normalized) urls.push(normalized);
  }
  return unique(urls);
}

function markdownFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(file);
    }
  }
  return files.sort();
}

function isKnowledgeAsset(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (normalized.startsWith(`${CITATION_ROOT}/`) || normalized === RELATION_INDEX) return false;
  if (normalized.startsWith("30-应用中心/行业报告档案/")) return true;
  if (!normalized.startsWith("60-知识资产/")) return false;
  return normalized.split("/").length >= 3;
}

function titleOf(content, fallback) {
  const yaml = content.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
  const yamlTitle = yaml.match(/^title:\s*(.+)$/mu)?.[1]?.trim();
  const heading = content.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  return yamlTitle || heading || fallback;
}

function yamlArray(values) {
  return `[${unique(values).map((value) => JSON.stringify(value)).join(", ")}]`;
}

function withEvidenceFields(content, evidence) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  const fields = [
    `evidence_status: ${evidence.status}`,
    `evidence_source_refs: ${yamlArray(evidence.sourceRefs)}`,
    `evidence_claim_refs: ${yamlArray(evidence.claimRefs)}`,
    `evidence_event_refs: ${yamlArray(evidence.eventRefs)}`,
    `evidence_entity_refs: ${yamlArray(evidence.entityRefs)}`,
    `evidence_report_refs: ${yamlArray(evidence.reportRefs)}`,
    `evidence_source_urls: ${yamlArray(evidence.urls)}`,
    "original_body_storage: private_evidence_store_only",
  ];
  let body = content;
  if (frontmatter) {
    const kept = frontmatter[1]
      .split(/\r?\n/u)
      .filter((line) => !EVIDENCE_FIELDS.has(line.match(/^([A-Za-z0-9_-]+):/u)?.[1] || ""));
    body = `---\n${[...kept, ...fields].join("\n")}\n---\n${content.slice(frontmatter[0].length)}`;
  } else {
    body = `---\n${fields.join("\n")}\n---\n${content}`;
  }
  return body.replace(
    new RegExp(`${EVIDENCE_START}[\\s\\S]*?${EVIDENCE_END}\\s*`, "gu"),
    "",
  ).trimEnd();
}

function safeFilename(value) {
  return String(value || "source")
    .replace(/^https?:\/\//u, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/gu, "-")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/[. -]+$/gu, "")
    .slice(0, 72) || "source";
}

function noteLink(relativePath, title) {
  return `[[${relativePath.replaceAll("\\", "/").replace(/\.md$/u, "")}|${String(title).replaceAll("|", "／")}]]`;
}

function sourceLabel(source) {
  try {
    return source.publisher || new URL(source.canonical_url || source.source_url).hostname;
  } catch {
    return source.publisher || source.source_artifact_id;
  }
}

function loadEvidenceGraph(root) {
  const sources = new Map();
  const raws = new Map();
  const claims = new Map();
  const events = new Map();
  const entities = new Map();
  for (const dateRoot of listJsonDateRoots(root)) {
    for (const item of rows(path.join(dateRoot, "source-artifacts.json"))) {
      if (item.source_artifact_id) sources.set(item.source_artifact_id, item);
    }
    for (const item of rows(path.join(dateRoot, "raw-documents.json"))) {
      if (item.raw_id) raws.set(item.raw_id, item);
    }
    for (const item of rows(path.join(dateRoot, "claims.json"))) {
      if (item.claim_id && item.verification_status === "accepted") claims.set(item.claim_id, item);
    }
    for (const item of rows(path.join(dateRoot, "canonical-events.json"))) {
      if (item.event_id && item.publication_status !== "rejected") events.set(item.event_id, item);
    }
    for (const item of rows(path.join(dateRoot, "entities.json"))) {
      if (item.entity_id) entities.set(item.entity_id, item);
    }
  }

  const claimToSource = new Map();
  for (const claim of claims.values()) {
    const sourceRef = raws.get(claim.raw_id)?.source_artifact_id;
    if (sourceRef) claimToSource.set(claim.claim_id, sourceRef);
  }
  const bySource = new Map();
  for (const source of sources.values()) {
    bySource.set(source.source_artifact_id, {
      source,
      claimRefs: [],
      eventRefs: [],
      entityRefs: [],
    });
  }
  for (const [claimId, sourceRef] of claimToSource) {
    if (bySource.has(sourceRef)) bySource.get(sourceRef).claimRefs.push(claimId);
  }
  for (const event of events.values()) {
    const sourceRefs = unique([
      ...(event.source_refs || []),
      ...(event.claim_refs || []).map((claimRef) => claimToSource.get(claimRef)),
    ]);
    for (const sourceRef of sourceRefs) {
      const relation = bySource.get(sourceRef);
      if (!relation) continue;
      relation.eventRefs.push(event.event_id);
      relation.claimRefs.push(...(event.claim_refs || []).filter((claimRef) => claimToSource.get(claimRef) === sourceRef));
      relation.entityRefs.push(...(event.entities || []));
    }
  }
  for (const relation of bySource.values()) {
    relation.claimRefs = unique(relation.claimRefs);
    relation.eventRefs = unique(relation.eventRefs);
    relation.entityRefs = unique(relation.entityRefs);
  }
  return { sources, claims, events, entities, bySource };
}

function writeManaged(vaultRoot, relativePath, content) {
  const target = path.resolve(vaultRoot, relativePath);
  if (!target.startsWith(`${path.resolve(vaultRoot)}${path.sep}`)) {
    throw new Error(`Evidence projection path escapes the Vault: ${relativePath}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${content.trimEnd()}\n`, "utf8");
}

export function syncGuanlanEvidence({
  root,
  vaultRoot,
  generatedAt = new Date().toISOString(),
  maxCitationCards = 120,
}) {
  const graph = loadEvidenceGraph(root);
  const sourceIdsByUrl = new Map();
  for (const source of graph.sources.values()) {
    for (const value of [source.canonical_url, source.source_url]) {
      const url = normalizeUrl(value);
      if (!url) continue;
      if (!sourceIdsByUrl.has(url)) sourceIdsByUrl.set(url, []);
      sourceIdsByUrl.get(url).push(source.source_artifact_id);
    }
  }

  const allAssets = markdownFiles(vaultRoot)
    .map((file) => ({
      file,
      relativePath: path.relative(vaultRoot, file).replaceAll("\\", "/"),
      content: fs.readFileSync(file, "utf8"),
    }))
    .filter((asset) => isKnowledgeAsset(asset.relativePath))
    .map((asset) => ({
      ...asset,
      title: titleOf(asset.content, path.basename(asset.file, ".md")),
      urls: urlsFromMarkdown(asset.content),
    }));

  const reportRefsBySource = new Map();
  for (const asset of allAssets.filter((item) => item.relativePath.startsWith("30-应用中心/行业报告档案/"))) {
    for (const url of asset.urls) {
      for (const sourceRef of sourceIdsByUrl.get(url) || []) {
        if (!reportRefsBySource.has(sourceRef)) reportRefsBySource.set(sourceRef, []);
        reportRefsBySource.get(sourceRef).push(asset.relativePath);
      }
    }
  }

  const assetLinks = [];
  for (const asset of allAssets) {
    const sourceRefs = unique(asset.urls.flatMap((url) => sourceIdsByUrl.get(url) || []));
    const relations = sourceRefs.map((sourceRef) => graph.bySource.get(sourceRef)).filter(Boolean);
    const reportRefs = unique([
      ...(asset.relativePath.startsWith("30-应用中心/行业报告档案/") ? [asset.relativePath] : []),
      ...sourceRefs.flatMap((sourceRef) => reportRefsBySource.get(sourceRef) || []),
    ]);
    assetLinks.push({
      ...asset,
      status: sourceRefs.length ? "linked" : asset.urls.length ? "url_only" : "missing",
      sourceRefs,
      claimRefs: unique(relations.flatMap((item) => item.claimRefs)),
      eventRefs: unique(relations.flatMap((item) => item.eventRefs)),
      entityRefs: unique(relations.flatMap((item) => item.entityRefs)),
      reportRefs,
    });
  }

  const sourceAssets = new Map();
  for (const asset of assetLinks) {
    for (const sourceRef of asset.sourceRefs) {
      if (!sourceAssets.has(sourceRef)) sourceAssets.set(sourceRef, []);
      sourceAssets.get(sourceRef).push(asset);
    }
  }
  const rankedSources = [...sourceAssets.keys()]
    .map((sourceRef) => {
      const relation = graph.bySource.get(sourceRef);
      const assets = sourceAssets.get(sourceRef) || [];
      const reportCount = assets.filter((asset) => asset.relativePath.startsWith("30-应用中心/行业报告档案/")).length;
      return {
        sourceRef,
        relation,
        assets,
        score: (relation?.eventRefs.length || 0) * 5
          + (relation?.claimRefs.length || 0) * 2
          + reportCount * 4
          + assets.length,
      };
    })
    .filter((item) => item.relation && (item.relation.claimRefs.length || item.relation.eventRefs.length))
    .sort((left, right) => right.score - left.score || left.sourceRef.localeCompare(right.sourceRef))
    .slice(0, Math.max(0, Number(maxCitationCards) || 0));

  const citationPathBySource = new Map();
  for (const item of rankedSources) {
    const source = item.relation.source;
    const label = sourceLabel(source);
    const relativePath = `${CITATION_ROOT}/${item.sourceRef}--${safeFilename(label)}.md`;
    citationPathBySource.set(item.sourceRef, relativePath);
  }

  for (const asset of assetLinks) {
    const evidence = {
      ...asset,
      reportRefs: asset.reportRefs,
    };
    const sourceCardLinks = asset.sourceRefs
      .filter((sourceRef) => citationPathBySource.has(sourceRef))
      .map((sourceRef) => noteLink(citationPathBySource.get(sourceRef), sourceRef));
    const sourceLinks = sourceCardLinks.length
      ? sourceCardLinks.map((link) => `- ${link}`).join("\n")
      : asset.urls.length
        ? asset.urls.map((url) => `- [原始来源](${url})`).join("\n")
        : "- 尚无可解析的来源链接；需人工补证。";
    const body = `${withEvidenceFields(asset.content, evidence)}

${EVIDENCE_START}
## 证据链

${sourceLinks}

- SourceArtifact：${asset.sourceRefs.length ? asset.sourceRefs.join("、") : "未解析"}
- Claim：${asset.claimRefs.length ? asset.claimRefs.join("、") : "未解析"}
- 事件：${asset.eventRefs.length ? asset.eventRefs.join("、") : "未解析"}
- 公司／实体：${asset.entityRefs.length ? asset.entityRefs.join("、") : "未解析"}
- 报告：${asset.reportRefs.length ? asset.reportRefs.map((ref) => noteLink(ref, titleOf(fs.readFileSync(path.join(vaultRoot, ref), "utf8"), path.basename(ref, ".md")))).join("、") : "未关联"}
- 原文边界：生产快照留在仓库并复制到私有证据备份；Vault 只保存定位信息。
${EVIDENCE_END}`;
    writeManaged(vaultRoot, asset.relativePath, body);
  }

  const generatedCitationFiles = [];
  for (const item of rankedSources) {
    const source = item.relation.source;
    const relativePath = citationPathBySource.get(item.sourceRef);
    const reportAssets = item.assets.filter((asset) => asset.relativePath.startsWith("30-应用中心/行业报告档案/"));
    const otherAssets = item.assets.filter((asset) => !asset.relativePath.startsWith("30-应用中心/行业报告档案/"));
    const sourceUrl = source.canonical_url || source.source_url || "";
    const snapshotRefs = unique(source.snapshot_refs || []);
    const relationLinks = [
      ...item.relation.claimRefs.map((id) => `[[60-知识资产/证据关系索引#${id}|${id}]]`),
      ...item.relation.eventRefs.map((id) => `[[60-知识资产/证据关系索引#${id}|${id}]]`),
      ...item.relation.entityRefs.map((id) => `[[60-知识资产/证据关系索引#${id}|${id}]]`),
    ];
    writeManaged(vaultRoot, relativePath, `---
title: ${item.sourceRef} · ${sourceLabel(source)}
asset_type: source-citation
status: current
updated: ${generatedAt.slice(0, 10)}
source_artifact_id: ${item.sourceRef}
content_hash: ${source.content_hash || ""}
evidence_claim_refs: ${yamlArray(item.relation.claimRefs)}
evidence_event_refs: ${yamlArray(item.relation.eventRefs)}
evidence_entity_refs: ${yamlArray(item.relation.entityRefs)}
evidence_report_refs: ${yamlArray(reportAssets.map((asset) => asset.relativePath))}
original_body_storage: private_evidence_store_only
---
# ${item.sourceRef} · ${sourceLabel(source)}

| 字段 | 内容 |
|---|---|
| 发布者 | ${source.publisher || "未披露"} |
| 抓取时间 | ${source.captured_at || "未披露"} |
| content_hash | \`${source.content_hash || "未披露"}\` |
| 原始网页 | ${sourceUrl ? `[打开来源](${sourceUrl})` : "未披露"} |

## 私有原文定位

${snapshotRefs.length ? snapshotRefs.map((ref) => `- \`${ref}\``).join("\n") : "- 未记录快照路径"}

> 上述路径只用于在私有 WaveSight 证据仓定位原文；本卡不复制完整正文，也不随网站发布。

## 证据对象

${relationLinks.length ? relationLinks.map((link) => `- ${link}`).join("\n") : "- 无已接受的 V4 证据对象"}

## 引用本来源的知识资产

${otherAssets.length ? otherAssets.map((asset) => `- ${noteLink(asset.relativePath, asset.title)}`).join("\n") : "- 暂无"}

## 引用本来源的报告

${reportAssets.length ? reportAssets.map((asset) => `- ${noteLink(asset.relativePath, asset.title)}`).join("\n") : "- 暂无"}
`);
    generatedCitationFiles.push(relativePath);
  }

  const relationLines = ["## 来源"];
  const claimSources = new Map();
  const eventSources = new Map();
  const entitySources = new Map();
  for (const item of rankedSources) {
    const cardLink = noteLink(citationPathBySource.get(item.sourceRef), item.sourceRef);
    relationLines.push(`\n### ${item.sourceRef}\n\n- 来源卡：${cardLink}`);
    for (const claimRef of item.relation.claimRefs) {
      if (!claimSources.has(claimRef)) claimSources.set(claimRef, []);
      claimSources.get(claimRef).push(cardLink);
    }
    for (const eventRef of item.relation.eventRefs) {
      if (!eventSources.has(eventRef)) eventSources.set(eventRef, []);
      eventSources.get(eventRef).push(cardLink);
    }
    for (const entityRef of item.relation.entityRefs) {
      if (!entitySources.has(entityRef)) entitySources.set(entityRef, []);
      entitySources.get(entityRef).push(cardLink);
    }
  }
  relationLines.push("\n## Claim");
  for (const [claimRef, sourceLinks] of [...claimSources].sort()) {
    relationLines.push(`\n### ${claimRef}\n\n- 上游来源：${unique(sourceLinks).join("、")}`);
  }
  relationLines.push("\n## 事件");
  for (const [eventRef, sourceLinks] of [...eventSources].sort()) {
    const event = graph.events.get(eventRef);
    relationLines.push(`\n### ${eventRef}\n\n- 事件：${event?.display_title_zh || eventRef}\n- 上游来源：${unique(sourceLinks).join("、")}`);
  }
  relationLines.push("\n## 公司／实体");
  for (const [entityRef, sourceLinks] of [...entitySources].sort()) {
    const entity = graph.entities.get(entityRef);
    relationLines.push(`\n### ${entityRef}\n\n- 公司／实体：${entity?.canonical_name || entityRef}\n- 上游来源：${unique(sourceLinks).join("、")}`);
  }
  writeManaged(vaultRoot, RELATION_INDEX, `---
title: 证据关系索引
asset_type: evidence-relation-index
status: current
updated: ${generatedAt.slice(0, 10)}
original_body_storage: private_evidence_store_only
---
# 证据关系索引

本页连接来源、Claim、事件、公司／实体、报告与知识资产。完整原文不进入 Vault。

${relationLines.join("\n")}
`);

  const citationRootAbsolute = path.join(vaultRoot, CITATION_ROOT);
  if (fs.existsSync(citationRootAbsolute)) {
    const current = new Set(generatedCitationFiles.map((item) => path.resolve(vaultRoot, item)));
    for (const file of markdownFiles(citationRootAbsolute)) {
      if (!current.has(path.resolve(file))) fs.unlinkSync(file);
    }
  }

  const manifestPath = path.join(vaultRoot, ".guanlan-generated.json");
  const manifest = readJson(manifestPath, { generatedFiles: [] });
  const oldEvidenceFiles = (manifest.generatedFiles || []).filter((relativePath) => (
    relativePath.startsWith(`${CITATION_ROOT}/`)
    || relativePath === RELATION_INDEX
    || relativePath === EVIDENCE_MANIFEST
  ));
  const generatedFiles = unique([
    ...(manifest.generatedFiles || []).filter((relativePath) => !oldEvidenceFiles.includes(relativePath)),
    ...generatedCitationFiles,
    RELATION_INDEX,
    EVIDENCE_MANIFEST,
  ]).sort();
  writeManaged(vaultRoot, EVIDENCE_MANIFEST, JSON.stringify({
    schemaVersion: "GUANLAN-EVIDENCE-PROJECTION-V1.0",
    generatedAt,
    originalBodyStorage: "private_evidence_store_only",
    assets: {
      total: assetLinks.length,
      linked: assetLinks.filter((asset) => asset.status === "linked").length,
      urlOnly: assetLinks.filter((asset) => asset.status === "url_only").length,
      missing: assetLinks.filter((asset) => asset.status === "missing").length,
    },
    citationCards: generatedCitationFiles.length,
    sourceArtifacts: graph.sources.size,
    acceptedClaims: graph.claims.size,
    canonicalEvents: graph.events.size,
    entities: graph.entities.size,
  }, null, 2));
  writeManaged(vaultRoot, ".guanlan-generated.json", JSON.stringify({
    ...manifest,
    evidenceProjection: "GUANLAN-EVIDENCE-PROJECTION-V1.0",
    generatedFiles,
  }, null, 2));

  return {
    assets: {
      total: assetLinks.length,
      linked: assetLinks.filter((asset) => asset.status === "linked").length,
      urlOnly: assetLinks.filter((asset) => asset.status === "url_only").length,
      missing: assetLinks.filter((asset) => asset.status === "missing").length,
    },
    citationCards: generatedCitationFiles.length,
    relations: {
      sources: graph.sources.size,
      claims: graph.claims.size,
      events: graph.events.size,
      entities: graph.entities.size,
    },
  };
}
