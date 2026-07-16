import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(siteRoot, "../..");
const morningFile = path.join(siteRoot, "data", "follow-builders-daily.json");
const pointsDir = path.join(projectRoot, "01-SiteV2", "content", "07-points");
const outputFile = path.join(siteRoot, "data", "first-line-viewpoints-v4.json");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function clean(value = "", limit = 3200) {
  return String(value || "").replace(/\s+/gu, " ").trim().slice(0, limit);
}

function field(section = "", name = "") {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return clean(section.match(new RegExp(`^- ${escaped}:\\s*(.+)$`, "mu"))?.[1] || "").replace(/^`|`$/gu, "");
}

function frontmatter(text = "") {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
  return Object.fromEntries(block.split(/\r?\n/u).map((line) => {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/u);
    return match ? [match[1], match[2].replace(/^"|"$/gu, "")] : null;
  }).filter(Boolean));
}

function latestPointsFile() {
  if (!fs.existsSync(pointsDir)) return "";
  return fs.readdirSync(pointsDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}-builders-viewpoints\.md$/u.test(name))
    .sort()
    .at(-1) || "";
}

function personFromSource(sourceName = "", heading = "") {
  const sourcePerson = sourceName.split("/").map((item) => clean(item)).filter(Boolean).at(-1);
  if (sourcePerson) return sourcePerson;
  return clean(heading.replace(/^BP-\d{8}-\d{2}\s*｜\s*/u, "").split("｜")[0] || "Unknown Builder", 100);
}

function handleFromUrl(url = "", fallback = "") {
  try {
    const parsed = new URL(url);
    if (/^(?:www\.)?x\.com$/iu.test(parsed.hostname)) return parsed.pathname.split("/").filter(Boolean)[0] || fallback;
    return fallback;
  } catch {
    return fallback;
  }
}

function parseMetrics(text = "") {
  const value = (name) => Number(text.match(new RegExp(`${name}=(\\d+)`, "iu"))?.[1] || 0);
  return { likes: value("likes"), retweets: value("retweets"), replies: value("replies") };
}

function isAiRelevant(item = {}) {
  if (["Agent", "AI 编程", "AI 基础设施"].includes(item.topic)) return true;
  const text = [
    item.text,
    item.translation,
    item.content,
    item.contentTranslation,
    item.topic
  ].filter(Boolean).join(" ");
  return /\b(?:AI|AGI|LLM|GPT|Claude|Codex|Gemini|OpenAI|Anthropic|xAI|agent(?:ic|s)?|model(?:s)?|MCP|prompt(?:ing|s)?|inference|GPU|compute|token(?:s)?|sandbox|multimodal|open weights?|machine learning|deep learning|neural|vibe coding)\b|人工智能|大模型|智能体|模型推理|算力|多模态|提示词|机器学习|深度学习|AI编程|AI 编程/iu.test(text);
}

function pointBody(section = "") {
  const marker = "原始观点/摘要：";
  const body = section.includes(marker) ? section.slice(section.indexOf(marker) + marker.length) : "";
  return clean(body, 3200);
}

function parseAfternoonFile(fileName) {
  if (!fileName) return { meta: {}, items: [] };
  const file = path.join(pointsDir, fileName);
  const text = fs.readFileSync(file, "utf8");
  const meta = frontmatter(text);
  const items = text.split(/^##\s+/gmu).slice(1).map((section) => {
    const [heading = "", ...bodyLines] = section.split(/\r?\n/u);
    const bodySection = bodyLines.join("\n");
    const url = field(bodySection, "source_url");
    const sourceName = field(bodySection, "source_name");
    const name = personFromSource(sourceName, heading);
    const kind = field(bodySection, "kind") || "unknown";
    const original = pointBody(bodySection);
    const metrics = parseMetrics(original);
    return {
      id: field(bodySection, "stable_id") || clean(heading.split("｜")[0]),
      name,
      handle: handleFromUrl(url, name),
      source: kind,
      sourceType: kind === "x" ? "social" : kind,
      date: field(bodySection, "original_date"),
      createdAt: field(bodySection, "captured_at"),
      url,
      text: original,
      translation: "",
      translationStatus: "unavailable",
      topic: "",
      columnTags: [],
      likes: metrics.likes,
      retweets: metrics.retweets,
      replies: metrics.replies,
      laneCoverage: ["afternoon-skill"],
      publicationStatus: "intake_only"
    };
  }).filter((item) => item.url);
  return {
    meta: {
      date: meta.date || fileName.slice(0, 10),
      generatedAt: meta.generated_at || "",
      declaredCount: Number(meta.builder_items_count || 0),
      file: `01-SiteV2/content/07-points/${fileName}`
    },
    items
  };
}

function buildData() {
  const morning = readJson(morningFile, { meta: {}, stats: {}, builders: [], remarks: [], podcasts: [] });
  const afternoon = parseAfternoonFile(latestPointsFile());
  const afternoonByUrl = new Map(afternoon.items.map((item) => [item.url, item]));
  const morningIntake = (morning.remarks || []).map((item) => {
    const afternoonItem = afternoonByUrl.get(item.url);
    const aiRelevant = isAiRelevant(item);
    return {
      ...item,
      laneCoverage: afternoonItem ? ["morning-rss", "afternoon-skill"] : ["morning-rss"],
      afternoonStableId: afternoonItem?.id || "",
      aiRelevant,
      publicationStatus: aiRelevant ? "published" : "intake_only_non_ai"
    };
  });
  const remarks = morningIntake.filter((item) => item.publicationStatus === "published");
  const morningUrls = new Set(morningIntake.map((item) => item.url));
  const publishedUrls = new Set(remarks.map((item) => item.url));
  const intake = afternoon.items.map((item) => ({
    ...item,
    coveredByMorning: morningUrls.has(item.url),
    publishedViaMorningGate: publishedUrls.has(item.url),
    publicationStatus: publishedUrls.has(item.url) ? "published_via_morning_gate" : "intake_only"
  }));
  const builders = [...new Map(remarks.map((item) => [item.handle || item.name, item])).entries()].map(([handle, item]) => ({
    name: item.name,
    handle,
    role: item.role || "未披露",
    count: remarks.filter((remark) => (remark.handle || remark.name) === handle).length
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
  const latestDate = remarks.map((item) => item.date).filter(Boolean).sort().at(-1) || "";
  const overlapCount = intake.filter((item) => item.coveredByMorning).length;
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      latestDate,
      sourcePolicy: "Morning RSS/X data owns the Chinese translation and public-page gate. Afternoon follow-builders Skill intake is independently preserved, deduplicated by original URL, and cannot bypass the Chinese, AI-relevance, tag, or source gates.",
      lanes: {
        morning: {
          id: "morning-rss",
          dataFile: "01-SiteV2/site/data/follow-builders-daily.json",
          generatedAt: morning.meta?.generatedAt || "",
          collected: morningIntake.length,
          published: remarks.length,
          builders: builders.length
        },
        afternoon: {
          id: "afternoon-skill",
          dataFile: afternoon.meta.file || "",
          generatedAt: afternoon.meta.generatedAt || "",
          date: afternoon.meta.date || "",
          declaredCount: afternoon.meta.declaredCount,
          intakeCount: intake.length,
          overlapCount,
          intakeOnlyCount: intake.length - overlapCount
        }
      }
    },
    stats: {
      builders: builders.length,
      remarks: remarks.length,
      podcasts: (morning.podcasts || []).length,
      morningIntake: morningIntake.length,
      morningPublished: remarks.length,
      afternoonIntake: intake.length,
      dualCovered: overlapCount,
      intakeOnly: intake.length - overlapCount
    },
    builders,
    remarks,
    podcasts: morning.podcasts || [],
    morningIntake,
    intake
  };
}

export function writeFirstLineViewpointsV4Data() {
  const data = buildData();
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return { outputFile, data };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { data } = writeFirstLineViewpointsV4Data();
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(projectRoot, outputFile).replace(/\\/gu, "/"),
    remarks: data.stats.remarks,
    builders: data.stats.builders,
    morningIntake: data.stats.morningIntake,
    afternoonIntake: data.stats.afternoonIntake,
    dualCovered: data.stats.dualCovered,
    intakeOnly: data.stats.intakeOnly
  }, null, 2));
}
