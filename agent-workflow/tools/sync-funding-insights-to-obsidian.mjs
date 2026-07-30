#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SYNC_OWNER = "guanlan-funding-insight-obsidian-sync";
const DEFAULT_INPUT = "01-SiteV2/site/data/funding-insights-v1.json";
const DEFAULT_OUTPUT = "01-SiteV2/knowledge/04-Funding-Insights";
const SITE_BASE = "https://jerryfang2023-stack.github.io/AI-Radar";

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function yaml(value = "") {
  return JSON.stringify(clean(value));
}

function safeFilePart(value = "") {
  return clean(value)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/gu, "-")
    .replace(/[. ]+$/gu, "")
    .replace(/-+/gu, "-")
    .slice(0, 72)
    || "未命名公司";
}

function markdownLink(label, url) {
  const text = clean(label).replace(/[[\]]/gu, "");
  return url ? `[${text || url}](<${url}>)` : text;
}

function quoteBlock(value) {
  return String(value || "")
    .trim()
    .split(/\r?\n/gu)
    .map((line) => `> ${line}`)
    .join("\n");
}

function listLines(items, render) {
  return (Array.isArray(items) ? items : [])
    .map(render)
    .filter(Boolean);
}

function evidenceRefs(card) {
  const refs = new Map();
  function visit(value) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== "object") return;
    const sourceId = clean(value.source_id);
    const quote = clean(value.quote);
    if (sourceId && quote) refs.set(`${sourceId}\u0000${quote}`, { source_id: sourceId, quote });
    for (const nested of Object.values(value)) visit(nested);
  }
  visit(card);
  return [...refs.values()].sort((left, right) => left.source_id.localeCompare(right.source_id)
    || left.quote.localeCompare(right.quote));
}

function cardDate(card) {
  return clean(card.financing?.announced_at || card.as_of_date || card.published_at).slice(0, 10) || "undated";
}

function cardTitle(card) {
  const company = clean(card.company?.full_name || card.company?.name || card.funding_insight_id);
  const amount = clean(card.financing?.amount);
  const round = clean(card.financing?.round);
  return [company, amount, round].filter(Boolean).join("｜");
}

function cardRelativePath(card) {
  const date = cardDate(card);
  const month = /^\d{4}-\d{2}/u.test(date) ? date.slice(0, 7) : "undated";
  const company = safeFilePart(card.company?.full_name || card.company?.name);
  return path.posix.join("cards", month, `${date}--${company}--${card.funding_insight_id}.md`);
}

function webUrl(relativeUrl) {
  const value = clean(relativeUrl);
  if (!value) return "";
  if (/^https?:\/\//iu.test(value)) return value;
  return `${SITE_BASE}/${value.replace(/^\/+/u, "")}`;
}

function vaultLink(vaultRoot, file) {
  return path.relative(vaultRoot, file).replace(/\\/gu, "/").replace(/\.md$/u, "");
}

function renderCard(card, sourcePath, eventTargets) {
  const financing = card.financing || {};
  const company = card.company || {};
  const analysis = card.analysis || {};
  const sources = Array.isArray(card.research_sources) ? card.research_sources : [];
  const sourceById = new Map(sources.map((source) => [source.source_id, source]));
  const evidence = evidenceRefs(card);
  const date = cardDate(card);
  const title = cardTitle(card);
  const lines = [
    "---",
    "type: funding_insight_card",
    `sync_owner: ${SYNC_OWNER}`,
    `schema_version: ${yaml(card.schema_version)}`,
    `funding_insight_id: ${yaml(card.funding_insight_id)}`,
    `event_id: ${yaml(card.triggered_by_event_id)}`,
    `as_of_date: ${yaml(card.as_of_date)}`,
    `announced_at: ${yaml(financing.announced_at)}`,
    `company: ${yaml(company.full_name || company.name)}`,
    `company_entity_id: ${yaml(company.entity_id)}`,
    `round: ${yaml(financing.round)}`,
    `amount: ${yaml(financing.amount)}`,
    `sector: ${yaml(analysis.sector)}`,
    `publication_status: ${yaml(card.publication_status)}`,
    `source_count: ${sources.length}`,
    `source: ${yaml(sourcePath)}`,
    "tags:",
    "  - funding-insight",
    "  - application-center",
    "---",
    "",
    `# ${title}`,
    "",
  ];

  if (company.summary) {
    lines.push("> [!summary] 公司概况", quoteBlock(company.summary), "");
  }

  lines.push(
    "## 融资概览",
    "",
    `- **融资轮次**：${clean(financing.round) || "未披露"}`,
    `- **本轮金额**：${clean(financing.amount) || "未披露"}`,
    `- **累计融资**：${clean(financing.total_raised) || "未披露"}`,
    `- **公布日期**：${clean(financing.announced_at) || date}`,
    "",
    "### 投资方",
    "",
    ...listLines(financing.investors, (investor) => {
      const name = clean(investor.name);
      return name ? `- **${name}**${investor.role ? ` — ${clean(investor.role)}` : ""}` : "";
    }),
    "",
    "## 公司与团队",
    "",
    `- **公司**：${clean(company.full_name || company.name) || "未披露"}`,
    `- **总部**：${clean(company.headquarters) || "未披露"}`,
  );
  if (company.website) lines.push(`- **官网**：${markdownLink(company.website, company.website)}`);
  if (company.team_size?.value) {
    lines.push(`- **团队规模**：${clean(company.team_size.value)}${company.team_size.observed_at ? `（${clean(company.team_size.observed_at)}）` : ""}`);
  }
  if (company.founders?.length) {
    lines.push("", "### 创始团队", "", ...listLines(company.founders, (founder) => {
      const name = clean(founder.name);
      return name ? `- **${name}**${founder.role ? ` — ${clean(founder.role)}` : ""}` : "";
    }));
  }
  lines.push("");

  if (card.products?.length) {
    lines.push("## 产品", "");
    for (const product of card.products) {
      lines.push(`### ${clean(product.name) || "未命名产品"}`, "");
      if (product.description) lines.push(clean(product.description), "");
      if (product.target_customers) lines.push(`- **目标客户**：${clean(product.target_customers)}`);
      if (product.features?.length) lines.push("- **关键能力**：", ...product.features.map((item) => `  - ${clean(item)}`));
      lines.push("");
    }
  }

  if (card.customers?.length) {
    lines.push("## 客户与应用", "");
    for (const customer of card.customers) {
      const details = [clean(customer.industry), clean(customer.use_case)].filter(Boolean).join("；");
      lines.push(`- **${clean(customer.name) || "未披露客户"}**${details ? ` — ${details}` : ""}`);
    }
    lines.push("");
  }

  if (card.metrics?.length) {
    lines.push("## 关键指标", "");
    for (const metric of card.metrics) {
      const observedAt = clean(metric.observed_at);
      lines.push(`- **${clean(metric.label) || "指标"}**：${clean(metric.value) || "未披露"}${observedAt ? `（${observedAt}）` : ""}`);
    }
    lines.push("");
  }

  lines.push("## 资本判断", "");
  if (analysis.capital_judgment) {
    lines.push("> [!analysis] 应用层判断", quoteBlock(analysis.capital_judgment), "");
  }
  if (analysis.validated_signals?.length) {
    lines.push("### 已验证信号", "", ...analysis.validated_signals.map((item) => `- ${clean(item)}`), "");
  }
  if (analysis.risks?.length) {
    lines.push("### 证据边界与风险", "", ...analysis.risks.map((item) => `- ${clean(item)}`), "");
  }
  if (analysis.investment_rationale?.length) {
    lines.push("### 投资机构公开理由", "");
    for (const item of analysis.investment_rationale) {
      const attribution = [clean(item.institution), clean(item.speaker), clean(item.speaker_role)].filter(Boolean).join(" · ");
      lines.push(`#### ${attribution || "公开投资理由"}`, "");
      if (item.rationale) lines.push(clean(item.rationale), "");
      if (item.quote) lines.push(quoteBlock(item.quote), "");
    }
  }

  if (card.comparisons?.length) {
    lines.push("## 同类对照", "");
    for (const comparison of card.comparisons) {
      lines.push(`### ${clean(comparison.name) || "未命名对照"}`, "");
      if (comparison.product) lines.push(`- **产品/方案**：${clean(comparison.product)}`);
      if (comparison.scenario) lines.push(`- **场景**：${clean(comparison.scenario)}`);
      if (comparison.target_customer) lines.push(`- **目标客户**：${clean(comparison.target_customer)}`);
      if (comparison.funding_summary) lines.push(`- **融资概况**：${clean(comparison.funding_summary)}`);
      if (comparison.core_difference) lines.push(`- **核心差异**：${clean(comparison.core_difference)}`);
      lines.push("");
    }
  }

  if (card.quotes?.length) {
    lines.push("## 公开引语", "");
    for (const item of card.quotes) {
      lines.push(`### ${clean(item.speaker) || "未署名"}`, "", quoteBlock(item.quote), "");
    }
  }

  if (card.funding_history?.length) {
    lines.push("## 融资历史", "");
    for (const item of card.funding_history) {
      const target = eventTargets.get(item.event_id);
      const label = [clean(item.date), clean(item.title), clean(item.amount)].filter(Boolean).join("｜");
      lines.push(target
        ? `- [[${target.replace(/\.md$/u, "")}|${label}]]`
        : `- ${label || clean(item.event_id)}`);
    }
    lines.push("");
  }

  if (sources.length) {
    lines.push("## 研究来源", "");
    for (const source of sources) {
      const label = clean(source.title || source.publisher || source.source_id);
      lines.push(`- ${markdownLink(label, source.source_url)} · \`${clean(source.source_id)}\`${source.publisher ? ` · ${clean(source.publisher)}` : ""}`);
    }
    lines.push("");
  }

  if (evidence.length) {
    lines.push("## 证据原文", "");
    let currentSource = "";
    for (const ref of evidence) {
      if (ref.source_id !== currentSource) {
        currentSource = ref.source_id;
        const source = sourceById.get(currentSource);
        lines.push(`### ${source ? markdownLink(source.title || currentSource, source.source_url) : `\`${currentSource}\``}`, "");
      }
      lines.push(quoteBlock(ref.quote), "");
    }
  }

  const relatedLinks = [
    ["公司档案", webUrl(card.links?.company)],
    ["关系图谱", webUrl(card.links?.relation_map)],
    ["融资事件", webUrl(card.links?.funding_event)],
    ["相关方向", webUrl(card.links?.direction)],
    ["融资透视页面", `${SITE_BASE}/funding-insights.html`],
  ].filter(([, url]) => url);
  lines.push("## 关联入口", "", ...relatedLinks.map(([label, url]) => `- ${markdownLink(label, url)}`), "");

  return `${lines.join("\n").replace(/\n{3,}/gu, "\n\n").trimEnd()}\n`;
}

function renderMonthIndex(month, cards, targets, sourcePath, generatedAt) {
  const lines = [
    "---",
    "type: funding_insight_month_index",
    `sync_owner: ${SYNC_OWNER}`,
    `month: ${yaml(month)}`,
    `card_count: ${cards.length}`,
    `updated_at: ${yaml(generatedAt)}`,
    `source: ${yaml(sourcePath)}`,
    "---",
    "",
    `# ${month} 融资透视`,
    "",
    `本月共同步 **${cards.length}** 张已通过自动发布门禁的融资卡片。`,
    "",
    ...cards.map((card) => {
      const target = targets.get(card.triggered_by_event_id);
      const label = [cardDate(card), clean(card.company?.full_name || card.company?.name), clean(card.financing?.amount), clean(card.financing?.round)]
        .filter(Boolean)
        .join(" · ");
      return `- [[${target}|${label}]]`;
    }),
    "",
  ];
  return lines.join("\n");
}

function renderRootIndex(monthGroups, sourcePath, generatedAt, cardCount, vaultOutputPath) {
  const lines = [
    "---",
    "type: funding_insight_index",
    `sync_owner: ${SYNC_OWNER}`,
    `card_count: ${cardCount}`,
    `updated_at: ${yaml(generatedAt)}`,
    `source: ${yaml(sourcePath)}`,
    "---",
    "",
    "# 融资透视索引",
    "",
    `当前同步 **${cardCount}** 张已通过证据门禁的融资卡片。卡片按月份归档，内容来自 Funding Insights 公开投影。`,
    "",
    "## 月度索引",
    "",
    ...[...monthGroups.entries()].map(([month, cards]) => `- [[${vaultOutputPath}/cards/${month}/${month}|${month}]] · ${cards.length} 张`),
    "",
    "## 说明",
    "",
    "- 这里只同步 `publication_status=auto_published` 且自动发布门禁通过的卡片。",
    "- 资本判断、比较和方向关联属于下游应用研究，不写回 Data Center V4 事实表。",
    "- 每条研究事实保留来源链接及 exact-quote 证据原文。",
    "",
  ];
  return lines.join("\n");
}

function renderReadme(sourcePath, vaultOutputPath) {
  return [
    "# Funding Insights Obsidian Archive",
    "",
    "本目录由融资透视同步脚本维护：",
    "",
    `- 数据源：\`${sourcePath}\``,
    `- 根索引：[[${vaultOutputPath}/Funding Insights Index|Funding Insights Index]]`,
    "- 卡片目录：`cards/YYYY-MM/`",
    "- 同步命令：`npm run sync:funding-insights-obsidian`",
    "",
    "逐卡笔记是下游应用研究档案，不是 Data Center V4 规范事实表。请不要手工修改带有",
    `\`sync_owner: ${SYNC_OWNER}\` 的生成文件；下一次同步会按公开投影重建它们。`,
    "",
  ].join("\n");
}

function writeIfChanged(file, content, dryRun, stats) {
  const previous = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (previous === content) {
    stats.unchanged += 1;
    return;
  }
  if (!dryRun) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, "utf8");
  }
  if (previous === null) stats.created += 1;
  else stats.updated += 1;
}

function generatedMarkdownFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...generatedMarkdownFiles(file));
    else if (entry.isFile() && entry.name.endsWith(".md")) {
      const head = fs.readFileSync(file, "utf8").slice(0, 512);
      if (head.includes(`sync_owner: ${SYNC_OWNER}`)) files.push(file);
    }
  }
  return files;
}

export function syncFundingInsightsToObsidian({
  root = process.cwd(),
  input = DEFAULT_INPUT,
  output = DEFAULT_OUTPUT,
  dryRun = false,
} = {}) {
  const inputFile = path.resolve(root, input);
  const outputRoot = path.resolve(root, output);
  // Keep generated links stable in local Obsidian vaults and GitHub Actions.
  // A parent `.obsidian` directory is an environment detail, not repository data.
  const vaultRoot = path.resolve(root);
  const vaultOutputPath = path.relative(vaultRoot, outputRoot).replace(/\\/gu, "/");
  const sourcePath = path.relative(root, inputFile).replace(/\\/gu, "/");
  const data = JSON.parse(fs.readFileSync(inputFile, "utf8").replace(/^\uFEFF/u, ""));
  const allCards = Array.isArray(data.cards) ? data.cards : [];
  const cards = allCards
    .filter((card) => card.publication_status === "auto_published" && card.auto_publish_gate?.passed === true)
    .sort((left, right) => cardDate(right).localeCompare(cardDate(left))
      || left.funding_insight_id.localeCompare(right.funding_insight_id));
  const cardIds = new Set();
  const eventIds = new Set();
  for (const card of cards) {
    if (!clean(card.funding_insight_id) || !clean(card.triggered_by_event_id)) throw new Error("funding_insight_identity_missing");
    if (cardIds.has(card.funding_insight_id)) throw new Error(`duplicate_funding_insight_id:${card.funding_insight_id}`);
    if (eventIds.has(card.triggered_by_event_id)) throw new Error(`duplicate_funding_event_id:${card.triggered_by_event_id}`);
    cardIds.add(card.funding_insight_id);
    eventIds.add(card.triggered_by_event_id);
  }

  const relativeTargets = new Map(cards.map((card) => [card.triggered_by_event_id, cardRelativePath(card)]));
  const targets = new Map([...relativeTargets].map(([eventId, relative]) => [
    eventId,
    vaultLink(vaultRoot, path.resolve(outputRoot, relative)),
  ]));
  const monthGroups = new Map();
  for (const card of cards) {
    const month = path.posix.dirname(relativeTargets.get(card.triggered_by_event_id)).split("/").at(-1);
    if (!monthGroups.has(month)) monthGroups.set(month, []);
    monthGroups.get(month).push(card);
  }
  const sortedMonthGroups = new Map([...monthGroups.entries()].sort(([left], [right]) => right.localeCompare(left)));
  const generatedAt = clean(data.meta?.generated_at || data.meta?.latest_date);
  const expected = new Set();
  const stats = { created: 0, updated: 0, unchanged: 0, deleted: 0 };

  for (const card of cards) {
    const relative = relativeTargets.get(card.triggered_by_event_id);
    expected.add(path.resolve(outputRoot, relative));
    writeIfChanged(path.resolve(outputRoot, relative), renderCard(card, sourcePath, targets), dryRun, stats);
  }
  for (const [month, monthCards] of sortedMonthGroups) {
    const relative = path.posix.join("cards", month, `${month}.md`);
    expected.add(path.resolve(outputRoot, relative));
    writeIfChanged(
      path.resolve(outputRoot, relative),
      renderMonthIndex(month, monthCards, targets, sourcePath, generatedAt),
      dryRun,
      stats,
    );
  }
  const rootIndex = path.join(outputRoot, "Funding Insights Index.md");
  const readme = path.join(outputRoot, "README.md");
  expected.add(path.resolve(rootIndex));
  expected.add(path.resolve(readme));
  writeIfChanged(
    rootIndex,
    renderRootIndex(sortedMonthGroups, sourcePath, generatedAt, cards.length, vaultOutputPath),
    dryRun,
    stats,
  );
  writeIfChanged(readme, renderReadme(sourcePath, vaultOutputPath), dryRun, stats);

  const stale = generatedMarkdownFiles(outputRoot).filter((file) => !expected.has(path.resolve(file)));
  for (const file of stale) {
    if (!dryRun) fs.unlinkSync(file);
    stats.deleted += 1;
  }

  return {
    ok: true,
    dry_run: dryRun,
    source: sourcePath,
    output: path.relative(root, outputRoot).replace(/\\/gu, "/"),
    source_cards: allCards.length,
    synced_cards: cards.length,
    skipped_cards: allCards.length - cards.length,
    months: sortedMonthGroups.size,
    files: expected.size,
    ...stats,
  };
}

function parseArgs(argv) {
  return new Map(argv.map((value) => {
    const [key, ...rest] = value.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = syncFundingInsightsToObsidian({
    input: args.get("input") || DEFAULT_INPUT,
    output: args.get("output") || DEFAULT_OUTPUT,
    dryRun: args.get("dry-run") === "true",
  });
  console.log(JSON.stringify(result, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
