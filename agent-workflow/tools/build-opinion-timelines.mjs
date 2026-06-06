import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const cardsDir = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards");
const outputDir = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Timelines");

function stripQuotes(value = "") {
  return String(value).trim().replace(/^["']|["']$/g, "");
}

function parseFrontmatter(text = "") {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/u);
    if (!item) continue;
    data[item[1]] = stripQuotes(item[2]);
  }
  return data;
}

function slugify(value = "") {
  const slug = String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return slug || "unknown-builder";
}

function titleFromFile(name = "") {
  return name
    .replace(/^\d{4}-\d{2}-\d{2}--frontier-opinion--/u, "")
    .replace(/\.md$/u, "")
    .replace(/-/gu, " ")
    .trim();
}

function relativeMarkdownLink(fromFile, toFile) {
  return path.relative(path.dirname(fromFile), toFile).replaceAll("\\", "/");
}

function monthKey(date = "") {
  const value = String(date || "");
  return /^\d{4}-\d{2}/u.test(value) ? value.slice(0, 7) : "unknown-date";
}

function comparableDate(date = "") {
  const value = String(date || "");
  return /^\d{4}-\d{2}-\d{2}/u.test(value) ? value.slice(0, 10) : "";
}

function effectiveDate(originalDate = "", date = "") {
  return comparableDate(originalDate) || comparableDate(date);
}

function sortCards(a, b) {
  const dateCompare = effectiveDate(b.originalDate, b.date).localeCompare(effectiveDate(a.originalDate, a.date));
  if (dateCompare) return dateCompare;
  return String(a.title).localeCompare(String(b.title));
}

async function collectCards() {
  const names = (await readdir(cardsDir)).filter((name) => name.endsWith(".md") && !name.includes("frontier-opinion-index"));
  const cards = [];
  for (const name of names) {
    const filePath = path.join(cardsDir, name);
    const text = await readFile(filePath, "utf8");
    const fm = parseFrontmatter(text);
    const person = stripQuotes(fm.person_name || "Unknown Builder");
    const title = stripQuotes(fm.title || titleFromFile(name));
    cards.push({
      id: fm.id || "",
      person,
      slug: slugify(person),
      title,
      date: fm.date || "",
      originalDate: effectiveDate(fm.original_date, fm.date),
      tier: fm.opinion_tier || "",
      status: fm.publish_status || fm.status || "",
      sourceName: fm.source_name || "",
      sourceUrl: fm.source_url || "",
      filePath,
      fileName: name,
    });
  }
  return cards.sort(sortCards);
}

function timelineEntry(card, targetFile) {
  const cardHref = relativeMarkdownLink(targetFile, card.filePath);
  const lines = [
    `### ${card.originalDate || card.date || "未知日期"} · ${card.title}`,
    "",
    `- 原观点卡：[${card.fileName}](${cardHref})`,
  ];
  if (card.sourceUrl) lines.push(`- 原始来源：${card.sourceUrl}`);
  if (card.tier || card.status) lines.push(`- 当前档位：${[card.tier, card.status].filter(Boolean).join(" / ")}`);
  if (card.sourceName) lines.push(`- 来源标记：${card.sourceName}`);
  lines.push("");
  return lines.join("\n");
}

async function writePersonTimeline(person, cards) {
  const personDir = path.join(outputDir, "people", person.slug);
  await mkdir(personDir, { recursive: true });
  const byMonth = new Map();
  for (const card of cards) {
    const key = monthKey(card.originalDate || card.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(card);
  }

  const months = [...byMonth.keys()].sort((a, b) => b.localeCompare(a));
  const readmePath = path.join(personDir, "README.md");
  const readme = [
    "---",
    "type: opinion_person_timeline",
    `person_name: "${person.name}"`,
    `opinion_count: ${cards.length}`,
    `latest_date: ${cards[0]?.originalDate || cards[0]?.date || ""}`,
    "---",
    "",
    `# ${person.name} 观点时间线`,
    "",
    `共 ${cards.length} 条观点，按月份聚合。`,
    "",
    "## 月份",
    "",
    ...months.map((month) => `- [${month}](./${month}.md)`),
    "",
  ].join("\n");
  await writeFile(readmePath, readme, "utf8");

  for (const month of months) {
    const targetFile = path.join(personDir, `${month}.md`);
    const monthCards = byMonth.get(month).sort(sortCards);
    const content = [
      "---",
      "type: opinion_person_month_timeline",
      `person_name: "${person.name}"`,
      `month: ${month}`,
      `opinion_count: ${monthCards.length}`,
      "---",
      "",
      `# ${person.name} · ${month}`,
      "",
      ...monthCards.map((card) => timelineEntry(card, targetFile)),
    ].join("\n");
    await writeFile(targetFile, content, "utf8");
  }
}

async function writeRootIndex(people) {
  const indexPath = path.join(outputDir, "README.md");
  const content = [
    "---",
    "type: opinion_timelines_index",
    `people_count: ${people.length}`,
    `opinion_count: ${people.reduce((sum, person) => sum + person.cards.length, 0)}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    "# 前沿观点 · 人物时间线目录",
    "",
    "这个目录是 Obsidian 浏览视图：原始观点卡仍保留在 `../02-Opinion-Cards/`，这里按人物和月份聚合，便于连续阅读。",
    "",
    "## 人物",
    "",
    ...people.map((person) => {
      const href = `people/${person.slug}/README.md`;
      const latest = person.cards[0]?.originalDate || person.cards[0]?.date || "";
      return `- [${person.name}](${href}) · ${person.cards.length} 条 · 最新 ${latest}`;
    }),
    "",
  ].join("\n");
  await writeFile(indexPath, content, "utf8");
}

async function main() {
  const cards = await collectCards();
  const byPerson = new Map();
  for (const card of cards) {
    if (!byPerson.has(card.slug)) {
      byPerson.set(card.slug, { name: card.person, slug: card.slug, cards: [] });
    }
    byPerson.get(card.slug).cards.push(card);
  }
  const people = [...byPerson.values()]
    .map((person) => ({ ...person, cards: person.cards.sort(sortCards) }))
    .sort((a, b) => {
      const latestCompare = effectiveDate(b.cards[0]?.originalDate, b.cards[0]?.date).localeCompare(effectiveDate(a.cards[0]?.originalDate, a.cards[0]?.date));
      if (latestCompare) return latestCompare;
      return a.name.localeCompare(b.name);
    });

  const resolvedOutput = path.resolve(outputDir);
  if (!resolvedOutput.startsWith(path.join(root, "01-SiteV2", "knowledge"))) {
    throw new Error(`Refusing to rebuild unsafe output path: ${resolvedOutput}`);
  }
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(path.join(outputDir, "people"), { recursive: true });

  await writeRootIndex(people);
  for (const person of people) {
    await writePersonTimeline(person, person.cards);
  }
  console.log(`Built ${path.relative(root, outputDir)} for ${people.length} people and ${cards.length} opinions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
