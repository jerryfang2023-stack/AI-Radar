import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "04-Site", "data", "radar-data.json");
const reportDir = path.join(root, "agent-workflow", "reports");
const today = new Date().toISOString().slice(0, 10);

const forbiddenAliases = new Map(
  Object.entries({
    "AI创业机会": "泛标签，只能历史兼容，不能作为有效筛选标签",
    "AI-Agent": "应归并为 AI Agent",
    "AI编程": "应归并为 AI Coding",
    "AI-Coding": "应归并为 AI Coding",
    "AI增长": "应归并为 AI营销",
    "Voice-AI": "应归并为 AI客服",
    "企业知识库": "应归并为 企业数据智能",
    "企业数据": "应归并为 企业数据智能",
    "AI企业服务": "应归并为 企业工作流",
    "AI数据智能": "应归并为 企业数据智能",
    "AI治理与安全": "应归并为 AI治理",
    "营销增长": "应归并为 市场营销",
    "销售/客服": "应拆分或归并为 销售 / 客服售后",
    "投标支持": "应归并为 采购投标",
    "合规风控": "应归并为 法务合规",
    "运营效率": "应归并为 运营流程",
    "机会早期": "应归并为 观察",
    "验证期机会": "应归并为 新出现",
    "成熟机会": "应归并为 成熟化",
  })
);

const officialPublicTags = new Set([
  "AI Agent",
  "AI Coding",
  "企业工作流",
  "企业数据智能",
  "AI营销",
  "AI客服",
  "AI治理",
  "AI基础设施",
  "具身智能",
  "医疗AI",
  "专业服务AI",
  "销售",
  "市场营销",
  "客服售后",
  "运营流程",
  "财务",
  "法务合规",
  "采购投标",
  "工程研发",
  "文档流程",
  "知识库问答",
  "工单与质检",
  "销售日报",
  "标书响应",
  "临床影像辅助",
  "Agent 权限治理",
  "建造者观点",
  "中小企业",
  "大中型企业",
  "政府 / 国企",
  "开发团队",
  "医疗机构",
  "重资产行业",
  "融资证据",
  "客户采用",
  "产品发布",
  "收入增长",
  "监管政策",
  "招投标 / 采购",
  "新出现",
  "升温",
  "分化",
  "成熟化",
  "风险变量",
  "观察",
  "全球",
  "中国适配",
  "美国",
  "欧洲",
  "一手来源",
  "商业媒体",
  "产业数据",
  "社媒线索",
  "播客",
  "技术博客",
  "AI Coding 观点",
  "Agent 工作流观点",
  "模型基础设施观点",
  "产品策略观点",
  "AI 安全治理观点",
]);

const collections = ["signals", "scoring", "trends", "opportunities", "points", "pointSources", "pointTopics"];

const itemsFor = (data, collection) => {
  const value = data[collection];
  if (Array.isArray(value)) return value;
  if (collection === "scoring" && Array.isArray(value?.rows)) return value.rows;
  return [];
};

const countTags = (data) => {
  const counts = new Map();
  const offenders = [];
  const unknowns = [];
  for (const collection of collections) {
    for (const item of itemsFor(data, collection)) {
      for (const tag of item.tags || item.topics || []) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
        if (forbiddenAliases.has(tag)) {
          offenders.push({
            collection,
            id: item.id || item.slug || item.title || "",
            title: item.title || item.name || "",
            tag,
            reason: forbiddenAliases.get(tag),
          });
        }
        if (!officialPublicTags.has(tag)) {
          unknowns.push({
            collection,
            id: item.id || item.slug || item.title || "",
            title: item.title || item.name || "",
            tag,
          });
        }
      }
    }
  }
  return { counts, offenders, unknowns };
};

if (!fs.existsSync(dataPath)) {
  console.error(`Missing ${path.relative(root, dataPath)}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const { counts, offenders, unknowns } = countTags(data);
const topTags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans")).slice(0, 80);

const lines = [
  "---",
  `title: Tag Quality Check ${today}`,
  `date: ${today}`,
  "owner: data-agent",
  "type: tag-quality-report",
  `status: ${offenders.length ? "needs_review" : "passed"}`,
  "---",
  "",
  "# Tag Quality Check",
  "",
  "## Summary",
  "",
  `- checked_collections: ${collections.join(", ")}`,
  `- unique_tags: ${counts.size}`,
  `- forbidden_alias_hits: ${offenders.length}`,
  `- unknown_public_tag_hits: ${unknowns.length}`,
  "",
  "## Forbidden Alias Hits",
  "",
  offenders.length
    ? "| collection | id | tag | reason |\n|---|---|---|---|\n" +
        offenders.map((item) => `| ${item.collection} | ${item.id} | ${item.tag} | ${item.reason} |`).join("\n")
    : "None.",
  "",
  "## Unknown Public Tags",
  "",
  unknowns.length
    ? "| collection | id | tag |\n|---|---|---|\n" +
        unknowns.slice(0, 200).map((item) => `| ${item.collection} | ${item.id} | ${item.tag} |`).join("\n")
    : "None.",
  "",
  "## Top Tags",
  "",
  "| tag | count |",
  "|---|---:|",
  ...topTags.map(([tag, count]) => `| ${tag} | ${count} |`),
  "",
].join("\n");

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, `tag-quality-check-${today}.md`), lines, "utf8");
fs.writeFileSync(path.join(reportDir, "tag-quality-check-latest.md"), lines, "utf8");

console.log(`Tag check complete: ${counts.size} unique tags, ${offenders.length} forbidden alias hits, ${unknowns.length} unknown public tag hits`);
if (offenders.length) {
  console.log(`Report: ${path.relative(root, path.join(reportDir, "tag-quality-check-latest.md"))}`);
}
