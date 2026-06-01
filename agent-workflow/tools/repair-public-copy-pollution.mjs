import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const date = args.get("date") || "";
const dryRun = args.get("dry-run") === "true";
const reportsDir = path.join(root, "agent-workflow", "reports");
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const signalTargets = [
  "01-SiteV2/content/04-business-signals/signals",
  "01-SiteV2/knowledge/01-Signal-Cards",
];
const opinionDir = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards");

function listMarkdown(target) {
  const abs = path.join(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return abs.endsWith(".md") ? [abs] : [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "10-Templates" || entry.name === "99-Archive") continue;
      const next = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(next);
      } else if (entry.name.endsWith(".md") && (!date || entry.name.startsWith(date))) {
        files.push(next);
      }
    }
  };
  walk(abs);
  return files;
}

function cleanSignalCopy(text) {
  return text
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注销售和收入团队流程/gu, "融资$1，做销售线索和收入团队协作")
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注采购下单流程/gu, "融资$1，做采购下单自动化")
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注模型部署和算力调用/gu, "融资$1，做模型部署和算力服务")
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注地产开发和建筑设计流程/gu, "融资$1，做地产和建筑设计工作流")
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注企业智能体协作流程/gu, "融资$1，做企业 Agent 协作平台")
    .replace(/融资(\s+[$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)?，押注客服和客户体验流程/gu, "融资$1，做客服和客户体验自动化")
    .replace(/融资，押注([^"｜\n。]+)/gu, "融资，做$1")
    .replace(/([A-Za-z0-9_. '’&+\-$]+)\s+宣布([$€£]?\s?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?)\s*融资，材料把资金用途指向([^。；，]+)[。；，]?/gu, "$1 融资 $2，用于$3。")
    .replace(/([A-Za-z0-9_. '’&+\-$]+)\s+宣布融资，材料把资金用途指向([^。；，]+)[。；，]?/gu, "$1 融资，用于$2。")
    .replace(/(.+?)\s+发布新的 AI 能力，材料显示它面向([^。；，]+)[。；，]?/gu, "$1 发布 AI 能力，面向$2。")
    .replace(/(.+?)\s+把 AI 放进([^。；，]+)，材料显示它已经对应到具体任务或客户环境[。；，]?/gu, "$1 把 AI 用进$2。")
    .replace(/(.+?)\s+部署 AI 到([^。；，]+)[。；，]?/gu, "$1 把 AI 用进$2。")
    .replace(/这条材料把 AI 从通用能力拉回到([^，。；]+)，可以观察客户是否愿意为流程结果、交付速度或团队协作付费。?/gu, "这条变化值得看，因为竞争点已经落到$1：客户是否买单，要看流程结果、交付速度和团队协作有没有实际改善。")
    .replace(/后续判断重点不是模型参数，而是客户流程、采购预算、交付责任和团队岗位是否因此调整。?/gu, "企业评估这类产品时，不应只看模型能力，还要看它接入哪个流程、由谁买单、出了问题谁负责。")
    .replace(/当前材料保留了原始链接、全文和哈希；真实客户规模、长期留存和效果指标仍需要继续(?:补证|补充验证)。?/gu, "目前能确认事件方向；客户规模、留存和效果指标仍需后续材料验证。");
}

function yamlValue(text, key) {
  return text.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "mu"))?.[1]?.trim() || "";
}

function nestedYamlValue(text, key) {
  return text.match(new RegExp(`^  ${key}:\\s*"?([^"\\n]+)"?`, "mu"))?.[1]?.trim() || "";
}

function hasFrontstageOpinionTitleQuality(title = "") {
  const text = String(title || "").trim();
  if (!text || text.length > 44) return false;
  if (/[<>{}\[\]]|https?:\/\/|t\.co\/|@\s?\w|#\w/iu.test(text)) return false;
  if (/[⚽️😂😅🔥🚀]/u.test(text)) return false;
  if (!/(AI|Agent|智能体|Codex|Claude|OpenAI|Anthropic|Cursor|模型|API|Gateway|Vercel|自动审阅|Auto.?review|编程|工程|workflow|工作流|tokens?|代币)/iu.test(text)) return false;
  if (/(更|和|与|在|为|的|：|:|,|，)$/u.test(text)) return false;
  if (/[A-Za-z][A-Za-z0-9'’,-]*(?:\s+[A-Za-z][A-Za-z0-9'’,-]*){6,}/u.test(text)) return false;
  if (/(投票|保险专员|建筑热潮|在印度|平坦的循环|终极教育|运送最好的产品|lfg|dank memes|plain annoying|gassing me up|business insider|current streak|api key spend caps|更多信息见原文|未抓到可用文本摘要|我最喜欢的两个人|清真寺|圣地亚哥)/iu.test(text)) return false;
  if (/：.+(总裁兼首席执行官|首席执行官|当前连胜|支$|执$|cra$|c$)/u.test(text)) return false;
  return true;
}

function downgradeBadOpinion(text) {
  if (yamlValue(text, "type") !== "opinion_card") return text;
  if (!/^publish_status:\s*frontstage_/mu.test(text)) return text;
  const title = nestedYamlValue(text, "displayTitle") || yamlValue(text, "title");
  if (hasFrontstageOpinionTitleQuality(title)) return text;
  return text
    .replace(/^type:\s*opinion_card\s*$/mu, "type: opinion_intake")
    .replace(/^publish_status:\s*frontstage_(feature|sidebar)\s*$/mu, "publish_status: internal_archive")
    .replace(/^opinion_tier:\s*(feature|sidebar)\s*$/mu, "opinion_tier: archive")
    .replace(/^display_lane:\s*(daily_feature|signal_sidebar)\s*$/mu, "display_lane: archive_only");
}

function writeIfChanged(file, next, changed, kind) {
  const before = fs.readFileSync(file, "utf8");
  if (before === next) return;
  changed.push({ file: rel(file), kind });
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
}

const changed = [];
for (const file of signalTargets.flatMap(listMarkdown)) {
  const before = fs.readFileSync(file, "utf8");
  writeIfChanged(file, cleanSignalCopy(before), changed, "signal_copy");
}

if (fs.existsSync(opinionDir)) {
  for (const name of fs.readdirSync(opinionDir).filter((item) => item.endsWith(".md") && (!date || item.startsWith(date)))) {
    const file = path.join(opinionDir, name);
    const before = fs.readFileSync(file, "utf8");
    writeIfChanged(file, downgradeBadOpinion(before), changed, "opinion_downgrade");
  }
}

fs.mkdirSync(reportsDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
const reportPath = path.join(reportsDir, `public-copy-pollution-repair-${date || "all"}-${stamp}.md`);
fs.writeFileSync(reportPath, [
  "# Public Copy Pollution Repair",
  "",
  `- date: ${date || "all"}`,
  `- dry_run: ${dryRun}`,
  `- changed_count: ${changed.length}`,
  "",
  "## Changed",
  "",
  changed.length ? changed.map((item) => `- ${item.kind}｜${item.file}`).join("\n") : "- none",
  "",
].join("\n"), "utf8");

console.log(JSON.stringify({
  ok: true,
  date: date || "all",
  dry_run: dryRun,
  changed_count: changed.length,
  report: rel(reportPath),
}, null, 2));
