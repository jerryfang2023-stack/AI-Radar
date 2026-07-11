#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const sourceFile = "01-SiteV2/site/data/follow-builders-daily.json";
const timelineRoot = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Timelines");
const peopleRoot = path.join(timelineRoot, "people");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const from = args.get("from") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const to = args.get("to") || from;
const dryRun = args.get("dry-run") === "true";
const pointsFile = args.get("points-file") || "";

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function writeText(file, text) {
  ensure(path.dirname(file));
  if (!dryRun) fs.writeFileSync(file, text, "utf8");
}

function git(argsList) {
  return execFileSync("git", argsList, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 200 * 1024 * 1024,
  });
}

function dayRange(start, end) {
  const days = [];
  const cursor = new Date(`${start}T00:00:00.000Z`);
  const stop = new Date(`${end}T00:00:00.000Z`);
  while (cursor <= stop) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function parseDay(value) {
  const parsed = new Date(value || "");
  if (Number.isNaN(parsed.valueOf())) return "";
  return parsed.toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value || "unknown-builder")
    .normalize("NFKD")
    .replace(/['’]/gu, "")
    .replace(/&/gu, " ")
    .replace(/[^a-zA-Z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .toLowerCase() || "unknown-builder";
}

function clean(value, limit = 2400) {
  return String(value || "")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, limit);
}

function yamlQuote(value) {
  return JSON.stringify(String(value || ""));
}

function blockquote(value) {
  const text = clean(value, 1800);
  if (!text) return "> 未提供可用文本。";
  return text.split(/\r?\n/u).map((line) => `> ${line}`).join("\n");
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) return {};
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const item = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/u);
    if (item) frontmatter[item[1]] = item[2].replace(/^"|"$/gu, "");
  }
  return frontmatter;
}

function stripInlineCode(value = "") {
  return String(value || "").trim().replace(/^`|`$/gu, "").trim();
}

function pointField(section = "", key = "") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = section.match(new RegExp(`^- ${escaped}:\\s*(.+)$`, "mu"));
  return match ? stripInlineCode(match[1]) : "";
}

function pointBody(section = "") {
  const lines = section.split(/\r?\n/u);
  const kindIndex = lines.findIndex((line) => /^- kind:/u.test(line));
  const bodyLines = kindIndex >= 0 ? lines.slice(kindIndex + 1) : lines.slice(1);
  return clean(bodyLines.join("\n").replace(/^\s+/u, ""), 2200);
}

function pointPersonName(sourceName = "", heading = "") {
  const fromSource = String(sourceName || "").split("/").map((item) => item.trim()).filter(Boolean).at(-1);
  if (fromSource) return fromSource;
  const withoutId = String(heading || "").replace(/^BP-\d{8}-\d{2}\S*\s*/u, "").trim();
  const match = withoutId.match(/^([^锝]+)锝/u);
  return clean(match?.[1] || withoutId || "Unknown Builder", 80);
}

function pointTitle(heading = "", body = "") {
  const withoutId = String(heading || "").replace(/^BP-\d{8}-\d{2}\S*\s*/u, "").trim();
  return clean(withoutId || body || "Untitled", 220);
}

function collectPointRecords() {
  const absolutePointsFile = path.resolve(root, pointsFile);
  const text = readText(absolutePointsFile);
  if (!text) throw new Error(`points file not found or empty: ${pointsFile}`);
  const frontmatter = parseFrontmatter(text);
  const snapshotDate = frontmatter.date || from;
  const records = [];
  const seenKeys = collectExistingKeys();
  const sections = text.split(/^##\s+/gmu).slice(1);
  for (const section of sections) {
    const [headingLine = "", ...rest] = section.split(/\r?\n/u);
    const bodySection = rest.join("\n");
    const url = pointField(bodySection, "source_url");
    const stableId = pointField(bodySection, "stable_id") || headingLine.match(/^BP-\d{8}-\d{2}/u)?.[0] || "";
    const key = String(url || stableId || headingLine).trim();
    if (!key || seenKeys.has(key)) continue;
    seenKeys.add(key);
    const sourceName = pointField(bodySection, "source_name");
    const day = parseDay(pointField(bodySection, "original_date") || snapshotDate) || snapshotDate;
    const body = pointBody(bodySection);
    const title = pointTitle(headingLine, body);
    records.push({
      id: stableId,
      name: pointPersonName(sourceName, headingLine),
      handle: pointPersonName(sourceName, headingLine),
      day,
      date: day,
      url,
      source: pointField(bodySection, "kind") || "follow-builders-skill",
      text: title,
      content: body,
      translation: title,
      contentTranslation: body,
      snapshotDate,
      snapshotHash: `points-file:${path.basename(absolutePointsFile)}`,
      columnTags: [],
      sourceType: "social",
    });
  }
  records.sort((a, b) => {
    const byDay = b.day.localeCompare(a.day);
    if (byDay) return byDay;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return records;
}

function replaceFrontmatterValue(text, key, value) {
  const line = `${key}: ${value}`;
  if (new RegExp(`^${key}:`, "mu").test(text)) {
    return text.replace(new RegExp(`^${key}:.*$`, "mu"), line);
  }
  return text.replace(/^---\r?\n/u, `---\n${line}\n`);
}

function countHeadings(text) {
  return [...text.matchAll(/^###\s+\d{4}-\d{2}-\d{2}\b/gmu)].length;
}

function latestHeadingDate(text) {
  return [...text.matchAll(/^###\s+(\d{4}-\d{2}-\d{2})\b/gmu)]
    .map((match) => match[1])
    .sort()
    .at(-1) || "";
}

function timelineFiles(personDir) {
  if (!fs.existsSync(personDir)) return [];
  return fs.readdirSync(personDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/u.test(name))
    .map((name) => path.join(personDir, name));
}

function collectExistingKeys() {
  const keys = new Set();
  if (!fs.existsSync(peopleRoot)) return keys;
  const stack = [peopleRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(file);
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const text = readText(file);
      for (const match of text.matchAll(/https?:\/\/[^\s`)>\]]+/giu)) {
        keys.add(match[0].replace(/[.,;，。；]+$/u, ""));
      }
    }
  }
  return keys;
}

function currentSnapshot() {
  const file = path.join(root, sourceFile);
  if (!fs.existsSync(file)) return null;
  try {
    const payload = JSON.parse(fs.readFileSync(file, "utf8"));
    const generatedAt = payload.meta?.generatedAt || payload.generatedAt || new Date().toISOString();
    return {
      hash: "working-tree",
      date: parseDay(generatedAt) || new Date().toISOString().slice(0, 10),
      remarks: Array.isArray(payload.remarks) ? payload.remarks : [],
    };
  } catch (error) {
    console.warn(`skip working tree ${sourceFile}: ${error.message}`);
    return null;
  }
}

function snapshotCommits() {
  const log = git(["log", "--date=short", "--pretty=format:%H\t%ad\t%s", "--", sourceFile])
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...subject] = line.split("\t");
      return { hash, date, subject: subject.join("\t") };
    });
  return log.filter((commit) => commit.date >= from && commit.date <= to);
}

function loadSnapshot(commit) {
  const raw = git(["show", `${commit.hash}:${sourceFile}`]);
  const payload = JSON.parse(raw);
  return Array.isArray(payload.remarks) ? payload.remarks : [];
}

function columnTags(record) {
  if (!Array.isArray(record.columnTags)) return "未标注";
  const names = record.columnTags.map((tag) => tag?.name).filter(Boolean);
  return names.length ? names.join(" / ") : "未标注";
}

function sourceLabel(record) {
  const person = record.name || record.handle || "unknown";
  if (record.source === "x") return `follow-builders / X / ${person}`;
  if (record.source === "blog") return `follow-builders / blog / ${person}`;
  if (record.source === "podcast") return `follow-builders / podcast / ${person}`;
  return `follow-builders / ${record.source || "unknown"} / ${person}`;
}

function entryMarkdown(record) {
  const title = clean(record.translation || record.text || record.content || "Untitled", 140);
  const original = record.content || record.text || "";
  const translation = record.contentTranslation || record.translation || "";
  return [
    `### ${record.day} · ${title}`,
    "",
    `- 原始来源: ${record.url || record.id || "no-url"}`,
    `- 来源类型: ${record.source || "unknown"}`,
    `- 同步来源: follow-builders-daily.json @ ${record.snapshotDate} / ${record.snapshotHash.slice(0, 7)}`,
    "- 当前档位: intake / first_line_viewpoint",
    `- 来源标记: ${sourceLabel(record)}`,
    `- 观澜标签: ${columnTags(record)}`,
    "<!-- opinion-card-detail:start -->",
    "#### 观点详情",
    "",
    `- 标题: ${clean(record.text || record.translation || "Untitled", 220)}`,
    `- 人物: ${record.name || record.handle || "Unknown Builder"}`,
    `- 原始日期: ${record.day}`,
    `- 原始来源: ${record.url || record.id || "no-url"}`,
    "- 当前档位: intake / first_line_viewpoint",
    "",
    "**中文翻译**",
    "",
    blockquote(translation),
    "",
    "**原文摘录**",
    "",
    blockquote(original),
    "",
    "<!-- opinion-card-detail:end -->",
    "",
  ].join("\n");
}

function collectRecords() {
  if (pointsFile) return collectPointRecords();

  const wantedDays = new Set(dayRange(from, to));
  const seenKeys = collectExistingKeys();
  const snapshots = [];
  const current = currentSnapshot();
  if (current && current.date >= from && current.date <= to) snapshots.push(current);
  snapshots.push(...snapshotCommits());

  const records = [];
  for (const snapshot of snapshots) {
    let remarks = [];
    try {
      remarks = snapshot.remarks || loadSnapshot(snapshot);
    } catch (error) {
      console.warn(`skip ${snapshot.hash.slice(0, 7)}: ${error.message}`);
      continue;
    }
    for (const remark of remarks) {
      const day = parseDay(remark.createdAt || remark.date);
      if (!wantedDays.has(day)) continue;
      const key = String(remark.url || remark.id || `${remark.name}:${remark.text}:${day}`).trim();
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      records.push({
        ...remark,
        day,
        snapshotDate: snapshot.date,
        snapshotHash: snapshot.hash,
      });
    }
  }

  records.sort((a, b) => {
    const byDay = b.day.localeCompare(a.day);
    if (byDay) return byDay;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return records;
}

function insertDateEntries(file, personName, day, entries) {
  const body = entries.map(entryMarkdown).join("\n");
  let text = readText(file);
  if (!text) {
    text = [
      "---",
      "type: opinion_person_day_timeline",
      `person_name: ${yamlQuote(personName)}`,
      `date: ${day}`,
      "opinion_count: 0",
      "---",
      "",
      `# ${personName} · ${day}`,
      "",
    ].join("\n");
  }

  const titleMatch = text.match(/^#\s+.+$/mu);
  if (titleMatch) {
    const insertAt = titleMatch.index + titleMatch[0].length;
    text = `${text.slice(0, insertAt)}\n\n${body}${text.slice(insertAt).replace(/^\s*/u, "\n")}`;
  } else {
    text = `${text.trimEnd()}\n\n${body}`;
  }

  text = replaceFrontmatterValue(text, "opinion_count", String(countHeadings(text)));
  writeText(file, `${text.trimEnd()}\n`);
}

function updatePersonReadme(personDir, personName) {
  const rows = timelineFiles(personDir).sort().reverse().map((file) => {
    const text = readText(file);
    return {
      label: path.basename(file, ".md"),
      count: countHeadings(text),
      latest: latestHeadingDate(text),
    };
  });
  const count = rows.reduce((sum, item) => sum + item.count, 0);
  const latest = rows.map((item) => item.latest).filter(Boolean).sort().at(-1) || "unknown";
  const lines = [
    "---",
    "type: opinion_person_timeline",
    `person_name: ${yamlQuote(personName)}`,
    `opinion_count: ${count}`,
    `latest_date: ${latest}`,
    "---",
    "",
    `# ${personName} 观点时间线`,
    `共 ${count} 条观点，按人物 + 日期文件聚合。`,
    "## 日期",
    "",
    ...rows.map((item) => `- [${item.label}](./${item.label}.md)`),
    "",
  ];
  writeText(path.join(personDir, "README.md"), lines.join("\n"));
  return { count, latest };
}

function rebuildIndex() {
  const rows = [];
  if (!fs.existsSync(peopleRoot)) return { people: 0, opinions: 0 };
  for (const entry of fs.readdirSync(peopleRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const personDir = path.join(peopleRoot, entry.name);
    const fm = parseFrontmatter(readText(path.join(personDir, "README.md")));
    const personName = fm.person_name || entry.name;
    const files = timelineFiles(personDir);
    const count = files.reduce((sum, file) => sum + countHeadings(readText(file)), 0);
    const latest = files.map((file) => latestHeadingDate(readText(file))).filter(Boolean).sort().at(-1) || "unknown";
    rows.push({ slug: entry.name, personName, count, latest });
  }

  rows.sort((a, b) => {
    const byLatest = String(b.latest).localeCompare(String(a.latest));
    if (byLatest) return byLatest;
    return b.count - a.count;
  });

  const opinions = rows.reduce((sum, item) => sum + item.count, 0);
  const lines = [
    "---",
    "type: opinion_timelines_index",
    `people_count: ${rows.length}`,
    `opinion_count: ${opinions}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    "# 前沿观点 · 人物时间线目录",
    "这个目录是 Obsidian 浏览视图：观点按人物和日期文件聚合，便于每日同步、检索和回滚。",
    "每条观点保留来源链接、原文摘录、中文翻译和同步来源；Builder 观点仅作为一线观点资产，不作为商业信号事实证据。",
    "",
    "## 人物",
    "",
    ...rows.map((item) => `- [${item.personName}](people/${item.slug}/README.md) · ${item.count} 条 · 最新 ${item.latest}`),
    "",
  ];
  writeText(path.join(timelineRoot, "README.md"), lines.join("\n"));
  return { people: rows.length, opinions };
}

function readableBlockquote(value) {
  const text = clean(value, 1800);
  if (!text) return "> 未提供可用文本。";
  return text.split(/\r?\n/u).map((line) => `> ${line}`).join("\n");
}

function readableFormalTags(record) {
  if (!Array.isArray(record.columnTags)) return "未标注";
  const names = record.columnTags.map((tag) => tag?.name).filter(Boolean);
  return names.length ? names.join(" / ") : "未标注";
}

function readableEntryMarkdown(record) {
  const title = clean(record.translation || record.text || record.content || "Untitled", 140);
  const original = record.content || record.text || "";
  const translation = record.contentTranslation || record.translation || "";
  return [
    `### ${record.day} - ${title}`,
    "",
    `- 原始来源: ${record.url || record.id || "no-url"}`,
    `- 来源类型: ${record.source || "unknown"}`,
    `- 同步来源: follow-builders-daily.json @ ${record.snapshotDate} / ${record.snapshotHash.slice(0, 7)}`,
    "- 当前档位: intake / first_line_viewpoint",
    `- 来源标记: ${sourceLabel(record)}`,
    `- 观点标签: ${readableFormalTags(record)}`,
    "<!-- opinion-card-detail:start -->",
    "#### 观点详情",
    "",
    `- 标题: ${clean(record.text || record.translation || "Untitled", 220)}`,
    `- 人物: ${record.name || record.handle || "Unknown Builder"}`,
    `- 原始日期: ${record.day}`,
    `- 原始来源: ${record.url || record.id || "no-url"}`,
    "- 当前档位: intake / first_line_viewpoint",
    "",
    "**中文翻译**",
    "",
    readableBlockquote(translation),
    "",
    "**原文摘录**",
    "",
    readableBlockquote(original),
    "",
    "<!-- opinion-card-detail:end -->",
    "",
  ].join("\n");
}

function insertReadableDateEntries(file, personName, day, entries) {
  const body = entries.map(readableEntryMarkdown).join("\n");
  let text = readText(file);
  if (!text) {
    text = [
      "---",
      "type: opinion_person_day_timeline",
      `person_name: ${yamlQuote(personName)}`,
      `date: ${day}`,
      "opinion_count: 0",
      "---",
      "",
      `# ${personName} - ${day}`,
      "",
    ].join("\n");
  }

  const titleMatch = text.match(/^#\s+.+$/mu);
  if (titleMatch) {
    const insertAt = titleMatch.index + titleMatch[0].length;
    text = `${text.slice(0, insertAt)}\n\n${body}${text.slice(insertAt).replace(/^\s*/u, "\n")}`;
  } else {
    text = `${text.trimEnd()}\n\n${body}`;
  }

  text = replaceFrontmatterValue(text, "opinion_count", String(countHeadings(text)));
  writeText(file, `${text.trimEnd()}\n`);
}

function updateReadablePersonReadme(personDir, personName) {
  const rows = timelineFiles(personDir).sort().reverse().map((file) => {
    const text = readText(file);
    return {
      label: path.basename(file, ".md"),
      count: countHeadings(text),
      latest: latestHeadingDate(text),
    };
  });
  const count = rows.reduce((sum, item) => sum + item.count, 0);
  const latest = rows.map((item) => item.latest).filter(Boolean).sort().at(-1) || "unknown";
  const lines = [
    "---",
    "type: opinion_person_timeline",
    `person_name: ${yamlQuote(personName)}`,
    `opinion_count: ${count}`,
    `latest_date: ${latest}`,
    "---",
    "",
    `# ${personName} 观点时间线`,
    `共 ${count} 条观点，按人物 + 日期文件聚合。`,
    "## 日期",
    "",
    ...rows.map((item) => `- [${item.label}](./${item.label}.md)`),
    "",
  ];
  writeText(path.join(personDir, "README.md"), lines.join("\n"));
  return { count, latest };
}

function rebuildReadableIndex() {
  const rows = [];
  if (!fs.existsSync(peopleRoot)) return { people: 0, opinions: 0 };
  for (const entry of fs.readdirSync(peopleRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const personDir = path.join(peopleRoot, entry.name);
    const fm = parseFrontmatter(readText(path.join(personDir, "README.md")));
    const personName = fm.person_name || entry.name;
    const files = timelineFiles(personDir);
    const count = files.reduce((sum, file) => sum + countHeadings(readText(file)), 0);
    const latest = files.map((file) => latestHeadingDate(readText(file))).filter(Boolean).sort().at(-1) || "unknown";
    rows.push({ slug: entry.name, personName, count, latest });
  }

  rows.sort((a, b) => {
    const byLatest = String(b.latest).localeCompare(String(a.latest));
    if (byLatest) return byLatest;
    return b.count - a.count;
  });

  const opinions = rows.reduce((sum, item) => sum + item.count, 0);
  const lines = [
    "---",
    "type: opinion_timelines_index",
    `people_count: ${rows.length}`,
    `opinion_count: ${opinions}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    "# 前沿观点 - 人物时间线目录",
    "这个目录是 Obsidian 浏览视图：观点按人物和日期文件聚合，便于每日同步、检索和回滚。",
    "每条观点保留来源链接、原文摘录、中文翻译和同步来源；Builder 观点仅作为一线观点资产，不作为商业信号事实证据。",
    "",
    "## 人物",
    "",
    ...rows.map((item) => `- [${item.personName}](people/${item.slug}/README.md) - ${item.count} 条 - 最新 ${item.latest}`),
    "",
  ];
  writeText(path.join(timelineRoot, "README.md"), lines.join("\n"));
  return { people: rows.length, opinions };
}

function main() {
  ensure(peopleRoot);
  const records = collectRecords();
  const groups = new Map();

  for (const record of records) {
    const personName = record.name || record.handle || "Unknown Builder";
    const slug = slugify(personName);
    const key = `${slug}/${record.day}`;
    if (!groups.has(key)) groups.set(key, { personName, slug, day: record.day, entries: [] });
    groups.get(key).entries.push(record);
  }

  for (const group of groups.values()) {
    insertReadableDateEntries(
      path.join(peopleRoot, group.slug, `${group.day}.md`),
      group.personName,
      group.day,
      group.entries
    );
  }

  for (const group of groups.values()) {
    updateReadablePersonReadme(path.join(peopleRoot, group.slug), group.personName);
  }

  const index = rebuildReadableIndex();
  console.log(JSON.stringify({
    ok: true,
    from,
    to,
    dryRun,
    added: records.length,
    groups: groups.size,
    people: index.people,
    opinions: index.opinions,
    files: [...groups.values()].map((group) => rel(path.join(peopleRoot, group.slug, `${group.day}.md`))),
  }, null, 2));
}

main();
