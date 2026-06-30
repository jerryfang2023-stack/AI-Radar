import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const followBuildersSkillScript =
  args.get("follow-builders-script") ||
  path.join(process.env.USERPROFILE || "", ".skill-store", "follow-builders", "scripts", "prepare-digest.js");

const contentRoot = path.join(root, "01-SiteV2", "content");
const pointsDir = path.join(contentRoot, "07-points");
const outputFile = path.join(pointsDir, `${date}-builders-viewpoints.md`);

const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

function normalizeDay(dateValue = "") {
  const match = String(dateValue).match(/\d{4}-\d{2}-\d{2}/u);
  return match ? match[0] : "unknown";
}

function repairEncodingArtifacts(text = "") {
  return String(text || "")
    .replace(/([A-Za-z])\ufffd\ufffd([A-Za-z])/gu, "$1’$2")
    .replace(/\ufffd\ufffd([^\ufffd\n]{1,80})\ufffd\ufffd/gu, "“$1”")
    .replace(/\ufffd\ufffd(?=[A-Z@])/gu, " · ")
    .replace(/\ufffd+/gu, "");
}

function cleanText(text = "") {
  return repairEncodingArtifacts(text).replace(/\s+/gu, " ").trim();
}

async function loadSkill() {
  if (!fs.existsSync(followBuildersSkillScript)) {
    throw new Error(`follow-builders skill script not found: ${followBuildersSkillScript}`);
  }
  const { stdout } = await execFileAsync("node", [followBuildersSkillScript], {
    maxBuffer: 120 * 1024 * 1024,
    timeout: 180_000,
  });
  return JSON.parse(stdout);
}

function flattenItems(data) {
  const items = [];
  for (const builder of Array.isArray(data.x) ? data.x : []) {
    for (const tweet of Array.isArray(builder.tweets) ? builder.tweets : []) {
      if (!tweet.url || !tweet.text) continue;
      const tweetText = cleanText(tweet.text);
      const engagement = `likes=${tweet.likes || 0}; retweets=${tweet.retweets || 0}; replies=${tweet.replies || 0}`;
      const builderBio = cleanText(builder.bio);
      items.push({
        kind: "x",
        title: `${builder.name || builder.handle}｜${tweetText.slice(0, 90)}`,
        source_url: tweet.url,
        source_name: `follow-builders / X / ${builder.name || builder.handle}`,
        original_date: normalizeDay(tweet.createdAt || ""),
        captured_at: new Date().toISOString(),
        text: [tweetText, builderBio, engagement].filter(Boolean).join("\n\n").slice(0, 2200),
      });
    }
  }

  for (const blog of Array.isArray(data.blogs) ? data.blogs : []) {
    if (!blog.url || !blog.title) continue;
    items.push({
      kind: "blog",
      title: `${blog.name || "Builder Blog"}｜${cleanText(blog.title)}`,
      source_url: blog.url,
      source_name: `follow-builders / blog / ${blog.name || ""}`.trim(),
      original_date: normalizeDay(blog.publishedAt || ""),
      captured_at: new Date().toISOString(),
      text: cleanText(blog.summary || blog.description || "").slice(0, 2200),
    });
  }

  for (const podcast of Array.isArray(data.podcasts) ? data.podcasts : []) {
    if (!podcast.url || !podcast.title) continue;
    items.push({
      kind: "podcast",
      title: `${podcast.name || "Builder Podcast"}｜${cleanText(podcast.title)}`,
      source_url: podcast.url,
      source_name: `follow-builders / podcast / ${podcast.name || ""}`.trim(),
      original_date: normalizeDay(podcast.publishedAt || ""),
      captured_at: new Date().toISOString(),
      text: cleanText(String(podcast.transcript || "")).slice(0, 2200),
    });
  }

  const seen = new Set();
  return items.filter((item) => {
    const key = item.source_url || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const data = await loadSkill();
  const items = flattenItems(data);
  ensure(pointsDir);

  const lines = [
    "---",
    `date: ${date}`,
    "stage: builders-viewpoints",
    "status: first-line-viewpoint-collected",
    `builder_items_count: ${items.length}`,
    `generated_at: ${new Date().toISOString()}`,
    `follow_builders_script: ${rel(followBuildersSkillScript)}`,
    "---",
    "",
    `# ${date} First-Line Viewpoints Skill Intake`,
    "",
    "说明：本文件直接调用本地 follow-builders skill，收录 Builder 观点/实践线索（discovery 级），作为一线观点 intake 资产沉淀。",
    "注意：社媒/X 观点为观点线索，不作为事实主证据；进入商业信号、变化候选、趋势候选或当前前台链路的事实结论仍需补足 S/A/B 原始来源。",
    "",
  ];

  items.forEach((item, index) => {
    const id = `BP-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    lines.push(
      `## ${id}｜${item.title}`,
      "",
      `- stable_id: \`${id}\``,
      "- source_path: `follow-builders`",
      `- source_url: \`${item.source_url || "no-url"}\``,
      `- source_name: ${item.source_name || "follow-builders"}`,
      `- original_date: ${item.original_date || "unknown"}`,
      `- captured_at: ${item.captured_at || "unknown"}`,
      `- kind: ${item.kind || "unknown"}`,
      "",
      item.text ? `原始观点/摘要：${item.text}` : "原始观点/摘要：本轮未抓到可用文本摘要（可能受限于采集权限或接口）。",
      ""
    );
  });

  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");
  console.log(`generated: ${rel(outputFile)} (${items.length} items)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
