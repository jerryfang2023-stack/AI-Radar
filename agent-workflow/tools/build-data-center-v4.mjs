#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const outputRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");

const VERSION = Object.freeze({
  product: "SITE-V4.0-data-center",
  raw: "RAW-V3.0",
  event: "EVENT-V1.0",
  fde: "FDE-V2.0",
  hardware: "HARDWARE-V1.0",
  tag: "TAG-V4.0"
});

const EVENT_RULES = [
  ["acquisition", /\b(?:acquires?|acquired|acquisition|merges? with|merged with)\b|收购|并购|合并/iu],
  ["lawsuit_settlement", /\b(?:sues?|sued|lawsuit|settles?|settlement|antitrust action|trademark dispute|legal challenge|court ruled)\b|起诉|诉讼|和解|反垄断|商标纠纷|败诉|驳回注册/iu],
  ["funding", /\b(?:raises?|raised|closes?|closed|funding round|financing round|series [a-z]|launch(?:es|ed)? with [$€£¥]\s?\d)\b|\b(?:secures?|secured)\b(?=.{0,60}\b(?:funding|financing|investment|series|seed|round)\b|.{0,60}[$€£¥]\s?\d)|融资|获投|募资|完成.*轮/iu],
  ["partnership", /\b(?:partners? with|partnership|collaborat(?:es?|ion)|alliance|integrat(?:es?|ion)\s+with)\b|合作|伙伴关系|结盟|接入/iu],
  ["procurement_contract", /\b(?:procurement|contract(?:ed|s)?|tender|awarded? .*contract|selected .*provider)\b|采购|招标|中标|合同/iu],
  ["hardware_capacity", /\b(?:fab capacity|manufacturing capacity|production capacity|wafer capacity)\b|晶圆产能|制造产能|扩产/iu],
  ["hardware_supply", /\b(?:chip supply|gpu supply|semiconductor supply|ships? .*(?:chips?|gpus?|accelerators?)|deliver(?:s|ed) .*(?:chips?|gpus?|accelerators?))\b|芯片供应|GPU供应|出货.*(?:芯片|GPU)|交付.*(?:芯片|GPU)/iu],
  ["hardware_deployment", /\b(?:deploys?|deployed|installs?|installed)\b.{0,80}\b(?:gpu|accelerator|server|cluster|data cent(?:er|re))\b|部署.{0,40}(?:GPU|芯片|服务器|集群|数据中心)/iu],
  ["pricing_change", /\b(?:price|pricing|subscription|billing)\b.{0,40}\b(?:changes?|changed|increases?|decreases?|cuts?|launches?)\b|调价|定价|计费变化|降价|涨价/iu],
  ["policy_regulation", /\b(?:regulator|regulation|policy|executive order|approved by|banned by)\b|监管|法规|政策|行政令|批准|禁令|(?:网信|监管|政府|有关部门).{0,50}(?:备案|公告|公布)|备案信息/iu],
  ["deployment", /\b(?:deploys?|deployed|rolls? out|rolled out|implements?|implemented|goes? live|pilots|piloted)\b|部署|上线|落地|试点|实施/iu],
  ["research_result", /\b(?:study|research|benchmark|paper|report)\b.{0,70}\b(?:finds?|shows?|reports?|achieves?|usage|gap)\b|(?:研究(?!员)|论文|基准|报告).{0,50}(?:显示|表明|达到|结果|差距|用量|增长|下降|登顶|占比)/iu],
  ["organization_people", /\b(?:appoints?|appointed|hires?|hired|joins?|joined|resigns?|leaves?|depart(?:s|ed)?)\b|任命|加入|离职|辞任|聘任/iu],
  ["model_release", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|open[- ]sources?)\b.{0,90}\b(?:model|llm|foundation model)\b|发布.{0,40}(?:模型|大模型)|推出.{0,40}(?:模型|大模型)|开源.{0,50}(?:模型|大模型)|(?:模型|大模型).{0,30}开源/iu],
  ["hardware_product", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|ships?|shipped|debuts?)\b.{0,90}\b(?:gpus?|chips?|processors?|accelerators?|servers?|computers?|devices?|robots?|glasses|keyboards?|npus?|chiplets?)\b|发布.{0,40}(?:芯片|GPU|服务器|计算机|设备|机器人|眼镜|键盘|NPU|芯粒|工作站)|(?:硬件|键盘|设备|计算机|工作站).{0,40}(?:登场|亮相)/iu],
  ["service_change", /\b(?:discontinues?|discontinued|shuts? down|sunsets?|removes?|removed)\b|停止服务|关闭服务|下线|移除功能/iu],
  ["product_release", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|adds?|added|open[- ]sources?)\b|发布|推出|上线新|新增|宣布开源|开源.{0,50}(?:工具|框架|软件)/iu]
];

const SPECIAL_EVENT_RULES = [
  ["hardware_product", /(?:发布|推出|亮相|launch(?:es|ed)?|release[sd]?).{0,50}(?:AI|人工智能).{0,20}(?:智能)?硬件|(?:AI|人工智能).{0,20}(?:智能)?硬件.{0,40}(?:发布|推出|亮相|launch(?:es|ed)?|release[sd]?)/iu],
  ["funding", /完成.{0,30}(?:融资|募资)|\bcompleted\b.{0,40}\b(?:funding|financing)\b/iu],
  ["partnership", /合资成立|\b(?:forms?|creates?|establishes?)\b.{0,40}\bjoint venture\b|\bjoint venture\b/iu],
  ["product_release", /(?:桌面端|客户端|工作台).{0,30}(?:焕新|升级|更新)|\b(?:desktop|client|workbench)\b.{0,30}\b(?:refresh|upgrade|update)\b/iu],
  ["policy_regulation", /(?:推出|发布|制定|设立|成立).{0,30}(?:人工智能|AI).{0,20}(?:标准|规范|办公室|监管机构)|(?:人工智能|AI).{0,20}(?:标准|规范|办公室|监管机构).{0,30}(?:推出|发布|制定|设立|成立)|\b(?:launch|establish|create|publish)\b.{0,50}\bAI\b.{0,30}\b(?:standard|standards|office|regulator)\b/iu]
];

const LEAD_EVENT_RULES = [
  ["product_release", /\b(?:a new (?:ios|android|web )?app|the app['’]s launch|a new product|a new service)\b|一款新(?:应用|产品|服务)/iu]
];

const OPINION_ONLY = /\b(?:says?|warns?|predicts?|criticizes?|argues?|believes?|interview)\b|表示|认为|警告|预测|直言|批评|访谈/iu;
const PROPOSAL_ONLY = /\b(?:predicts?|proposes?|suggests?|calls? for)\b|预言|提议|建议设立|呼吁设立/iu;
const RUMOR = /\b(?:rumou?r|reportedly|leak(?:ed)?)\b|传闻|爆料|泄露|据称/iu;
const DISPUTE = /\b(?:disputes?|disputed|denies?|denied|not (?:be )?final|could change)\b|否认|有争议|尚未最终确定|可能变化/iu;
const IN_PROGRESS = /\b(?:in talks|in discussions|negotiating|seeking to)\b|洽谈|讨论中|正在谈判/iu;
const PLANNED = /\b(?:plans? to|expected to|will|intends? to|proposed|to (?:launch|release|deploy|ship|introduce))\b|计划|预计|将|拟/iu;
const WITHDRAWN = /\b(?:withdrawn|withdraws?|cancelled|canceled)\b|撤回|取消/iu;
const COMPLETED = /\b(?:completed|closed|acquired|merged|raised|secured|launched|released|introduced|unveiled|shipped|deployed|implemented|appointed|joined|left)\b|完成|收购|合并|获得|融资|发布|推出|出货|部署|上线|任命|加入|离职/iu;
const BOILERPLATE_LINE = /^(?:topics?|most popular|related articles?|view bio|register now|loading the next article|error loading|when you purchase through links|back to top|cookie settings?|스크롤 이동|상태바|기사본문)\b/iu;
const BOILERPLATE_TEXT = /(?:most popular|loading the next article|error loading the next article|register now|cookie settings|when you purchase through links|스크롤 이동|상태바|기사본문|the body content)/iu;
const EXPLICIT_AI_EVIDENCE = /\b(?:ai|artificial intelligence|generative ai|genai|ai[- ](?:native|powered|generated|coding|assistant|assistants|agent|agents|model|models|system|systems|service|services|platform|platforms|tool|tools|chip|chips|hardware|infrastructure|workload|workloads|research|video)|agentic(?:\s+ai)?|large language models?|foundation models?|vision[- ]language(?:[- ]action)? models?|multimodal(?:\s+moe)?|machine learning|deep learning|neural (?:network|networks|processing)|llms?|chatbots?|model inference|model training|open[- ]weight|npus?|edge ai|physical ai|embodied ai|computer vision|natural language processing)\b|人工智能|生成式\s*(?:人工智能|AI)|AI\s*(?:智能体|模型|系统|平台|服务|产品|工具|编程|助手|芯片|硬件|基础设施|应用|研究|视频|办公|手机|短剧|生产力|推理|训练)|智能体|大模型|基础模型|多模态|机器学习|深度学习|神经网络|生成模型|推理模型|世界模型|具身(?:智能|模型)|端侧生成式人工智能|模型服务|模型券|算力(?:集群|基础设施)/iu;
const NAMED_AI_EVIDENCE = /\b(?:OpenAI|Anthropic|ChatGPT|Claude|Gemini|DeepMind|DeepSeek|Qwen|Grok|xAI|Mistral(?: AI)?|Llama|Hugging Face|OpenRouter|Codex|Bedrock AgentCore|Thinking Machines Lab|FuriosaAI|InstaLILY|C3 AI|MiniMax)\b|豆包|混元|千问|灵犀专业版|WPS Comate/iu;
const GENERIC_VERTICAL_AI_PUBLICITY = /(?:我国|国内|全球)(?:首个|首款|首套).{0,80}(?:智慧|智能).{0,30}(?:大模型|系统)|(?:水风光|流域|气象|水文).{0,60}(?:智慧运营|大模型)/iu;
const ADMINISTRATIVE_AI_SUPPORT_PROGRAM = /(?:模型券|算力券|数据券).{0,100}(?:补贴|补助|申领|发放|优惠|兑付|平台)|(?:补贴|补助|申领|发放|优惠|兑付).{0,100}(?:模型券|算力券|数据券)/iu;
const AI_NATIVE_ORGANIZATIONS = new Set([
  "Anthropic",
  "C3 AI",
  "DeepSeek",
  "FuriosaAI",
  "Google DeepMind",
  "InstaLILY",
  "MiniMax",
  "Mistral AI",
  "OpenAI",
  "Thinking Machines Lab",
  "xAI"
].map((value) => value.toLocaleLowerCase()));
const JUDGMENT_KEYS = new Set([
  "importance", "importance_score", "importance_type", "value", "value_score", "impact", "impact_score",
  "opportunity", "opportunity_score", "pain_score", "trend_relevance", "trend_state", "trend_maturity",
  "business_meaning", "why_selected", "why_watch", "recommendation", "advice", "usable_for", "pool_routes",
  "emerging_signal_score", "guanlan_relevance", "interview_priority"
]);

const ORGANIZATION_ALIASES = [
  ["Accenture", ["Accenture"]],
  ["Adapter", ["Startup Adapter"]],
  ["Alibaba", ["Alibaba", "阿里巴巴", "阿里", "Qwen"]],
  ["Alipay", ["Alipay", "支付宝"]],
  ["Amazon", ["Amazon", "Amazon Bedrock"]],
  ["Anthropic", ["Anthropic", "Claude Code", "Claude"]],
  ["Apptio", ["Apptio"]],
  ["Apple", ["Apple", "苹果", "Apple Intelligence"]],
  ["Baidu AI Cloud", ["Baidu AI Cloud", "百度智能云"]],
  ["Beijing E-Town", ["北京亦庄"]],
  ["Broadcom", ["Broadcom"]],
  ["ByteDance", ["ByteDance", "字节跳动", "豆包"]],
  ["C3 AI", ["C3 AI"]],
  ["Canva", ["Canva"]],
  ["Crusoe", ["Crusoe"]],
  ["DeepSeek", ["DeepSeek"]],
  ["Emergent", ["Emergent"]],
  ["FuriosaAI", ["FuriosaAI"]],
  ["Gaode", ["高德"]],
  ["Google DeepMind", ["Google DeepMind", "谷歌 DeepMind", "谷歌DeepMind", "DeepMind"]],
  ["Google", ["Google", "谷歌", "Gemini"]],
  ["Hadrius", ["Hadrius"]],
  ["Hinge", ["Hinge"]],
  ["IBM", ["IBM"]],
  ["InstaLILY", ["InstaLILY", "Instalily AI", "Instalily"]],
  ["Innovation Labs", ["Innovation Labs"]],
  ["JD Cloud", ["京东云", "JD Cloud"]],
  ["Kingsoft Office", ["金山办公"]],
  ["LMSYS", ["LMSYS"]],
  ["Mandiant", ["Mandiant"]],
  ["Meta", ["Meta"]],
  ["Microsoft", ["Microsoft", "微软"]],
  ["MiniMax", ["MiniMax"]],
  ["Mistral AI", ["Mistral AI"]],
  ["Mitsubishi Heavy Industries", ["Mitsubishi Heavy Industries", "三菱重工"]],
  ["Nokia", ["Nokia", "诺基亚"]],
  ["Nubia", ["Nubia", "努比亚"]],
  ["NVIDIA", ["NVIDIA", "Nvidia", "英伟达"]],
  ["OpenAI", ["OpenAI", "GPT-5", "GPT-5.6", "Codex"]],
  ["OPPO", ["OPPO"]],
  ["Orthogonal", ["Orthogonal"]],
  ["PixVerse", ["PixVerse"]],
  ["PrismML", ["PrismML"]],
  ["Rime", ["Rime"]],
  ["Rubrik", ["Rubrik"]],
  ["Salesforce", ["Salesforce"]],
  ["Samsung", ["Samsung", "三星"]],
  ["Samsung SDS", ["Samsung SDS"]],
  ["ServiceNow", ["ServiceNow"]],
  ["SGLang", ["SGLang"]],
  ["Shell", ["Shell"]],
  ["Sierra", ["Sierra"]],
  ["Soofi", ["Soofi"]],
  ["SoftBank", ["SoftBank", "软银"]],
  ["Soul", ["Soul"]],
  ["SpaceX", ["SpaceX"]],
  ["Spotify", ["Spotify"]],
  ["StepFun", ["StepFun", "阶跃星辰", "阶跃"]],
  ["Sunrun", ["Sunrun"]],
  ["Tencent", ["Tencent", "腾讯", "腾讯混元"]],
  ["Thinking Machines Lab", ["Thinking Machines Lab", "TML", "Inkling"]],
  ["Thira", ["Thira"]],
  ["TYLsemi", ["TYLsemi"]],
  ["Valarian", ["Valarian"]],
  ["Volcano Engine", ["Volcano Engine", "火山引擎"]],
  ["Whatnot", ["Whatnot"]],
  ["Work Louder", ["Work Louder"]],
  ["xAI", ["xAI", "Grok"]],
  ["Xiaomi", ["Xiaomi", "小米"]],
  ["ZTE", ["ZTE", "中兴"]]
].map(([canonicalName, aliases]) => ({ canonicalName, aliases }));

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function hash(value, length = 16) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, length);
}

function cleanString(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
}

function normalizeSpace(value) {
  return cleanString(value).replace(/\s+/gu, " ");
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value));
}

function normalizeEventTitle(value) {
  return normalizeSpace(value)
    .replace(/\s*(?:\||<)\s*(?:semiconductor|기사본문)\b.*$/iu, "")
    .replace(/\s+[|—-]\s+(?:techcrunch|the elec inc\.?|reuters|bloomberg)\s*$/iu, "")
    .trim();
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function availableDates() {
  if (!fs.existsSync(rawRoot)) return [];
  return fs.readdirSync(rawRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function trimBoilerplate(text) {
  const normalized = cleanString(text).replace(/\r\n?/gu, "\n");
  const lines = normalized.split("\n");
  const kept = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (kept.join("\n").length > 20 && BOILERPLATE_LINE.test(trimmed)) break;
    if (/^(?:image credits?|photo credits?):/iu.test(trimmed)) continue;
    kept.push(line.trimEnd());
  }
  return kept.join("\n").replace(/\n{3,}/gu, "\n\n").trim();
}

function sourceArtifact(raw, file) {
  const sourceUrl = cleanString(raw.original_url || raw.canonical_url || raw.source_url || raw.url || raw.link || raw.discovery_record?.origin_url);
  return {
    source_artifact_id: `SA-${hash(sourceUrl || file)}`,
    source_url: sourceUrl,
    canonical_url: cleanString(raw.canonical_url || sourceUrl),
    publisher: cleanString(raw.source_name),
    capture_method: cleanString(raw.extraction_method || raw.fetch_status),
    captured_at: cleanString(raw.collected_at || raw.last_seen_at),
    snapshot_refs: [raw.markdown_snapshot_path, raw.json_snapshot_path, raw.html_snapshot_path, raw.screenshot_path]
      .map(cleanString).filter(Boolean),
    content_hash: cleanString(raw.content_hash || raw.full_text_hash || hash(raw.clean_text || raw.full_text)),
    _legacy_path: rel(file)
  };
}

function documentType(raw) {
  const value = cleanString(raw.source_type).toLowerCase();
  if (value) return value;
  return "article";
}

function findEventRule(title, lead = "") {
  if (/[；;].*(?:发布|推出|开源|融资|收购|合作|备案|集成|上线)/iu.test(title)) return null;
  if (/(?:代码库|codebase).{0,30}(?:中|里)?.{0,30}(?:发现|came across|discovered)/iu.test(`${title}\n${lead}`)) return null;
  if (!/\b(?:report|research|study)\b|报告|研究/iu.test(title)
      && /(?:上线|发布).{0,15}(?:一周|一月|一个月).{0,60}(?:调用量|用量|排名)|(?:调用量|用量).{0,40}(?:增长|登顶|排名)/iu.test(title)) return null;
  for (const [eventType, pattern] of SPECIAL_EVENT_RULES) {
    if (pattern.test(title)) return { eventType, pattern };
  }
  for (const [eventType, pattern] of EVENT_RULES) {
    if (!pattern.test(title)) continue;
    if (eventType === "product_release" && /\b(?:whitepaper|report|guide)\b|白皮书|报告|指南/iu.test(title)) return null;
    return { eventType, pattern };
  }
  for (const [eventType, pattern] of LEAD_EVENT_RULES) {
    if (pattern.test(lead)) return { eventType, pattern };
  }
  return null;
}

function eventStatus(title, lead, eventType = "") {
  const text = `${title}\n${lead}`;
  if (WITHDRAWN.test(text)) return "withdrawn";
  if (RUMOR.test(title)) return "rumored";
  if (DISPUTE.test(title) || (eventType === "funding" && DISPUTE.test(lead))) return "disputed";
  if (IN_PROGRESS.test(title)) return "in_progress";
  if (PLANNED.test(title)) return "planned";
  if (COMPLETED.test(title)) return "completed";
  return "announced";
}

function publicationStatus(status, sourceRole, claimCount) {
  if (status === "withdrawn") return "withdrawn";
  if (["rumored", "disputed"].includes(status)) return "disputed";
  if (!claimCount || ["planned", "in_progress"].includes(status)) return "partial";
  return /original_source|primary_source/iu.test(sourceRole) ? "verified" : "partial";
}

function actionMatch(title, pattern) {
  const match = title.match(pattern);
  if (!match) {
    const leadingSubject = title.match(/^([A-Z][A-Za-z0-9.&/-]*)\s/u)?.[1] || "undisclosed_subject";
    return { subject: leadingSubject, action: "", object: title };
  }
  const start = match.index || 0;
  let subject = normalizeSpace(title.slice(0, start).replace(/^[\[【(（].*?[\]】)）]\s*/u, "").replace(/\b(?:in talks to|plans? to|expected to|intends? to)\s*$/iu, ""));
  const action = normalizeSpace(match[0]);
  const object = normalizeSpace(title.slice(start + match[0].length));
  if (!subject) {
    subject = object.match(/^(?:that\s+)?([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})(?:'s|\s|$)/u)?.[1] || "undisclosed_subject";
  }
  return { subject, action, object };
}

function splitEntityNames(subject) {
  return subject
    .split(/\s+(?:and|with)\s+|、|与|和/iu)
    .map((value) => normalizeSpace(value).replace(/^["'“”‘’]|["'“”‘’:：,，-]+$/gu, ""))
    .filter((value) => value !== "undisclosed_subject" && value.length >= 2 && value.length <= 100)
    .slice(0, 4);
}

function cleanOrganizationCandidate(value) {
  let candidate = normalizeSpace(value)
    .replace(/^(?:exclusive:\s*)/iu, "")
    .replace(/^(?:the\s+)?founder of\s+/iu, "")
    .replace(/^(?:(?:sovereign|custom)\s+AI\s+[^,]{0,50}?\s+startup|AI\s+[^,]{0,50}?\s+startup|startup)\s+/iu, "")
    .replace(/(?:'s|\u2019s)\s+founder(?:\s+just)?$/iu, "")
    .replace(/\s+(?:in talks to|plans? to|expected to|intends? to|to)$/iu, "")
    .replace(/(?:研究员|首席执行官|CEO|创始人|员工|高管|团队).*/u, "")
    .replace(/[，,:：].*$/u, "")
    .replace(/(?:将|拟|正寻求|计划|宣布)$/u, "")
    .trim();
  if (/^(?:\d+|数十|多名|员工|出版商|作者|研究员|私募巨头|我国首个|一图看懂|澳大利亚|中国|美国|日本|印度|欧洲)/u.test(candidate)) return "";
  if (/(?:发布|推出|上线|融资|获投|起诉|诉讼|回应|呼吁|提议|加入|离职|成立|中标|增长|模型|手表|平台|工作台|方案|服务|指南|报告)/u.test(candidate)) return "";
  if (/\b(?:employees?|researchers?|publishers?|authors?|founder|guide|model|platform|service|report|cost|forward|didn['’]t)\b/iu.test(candidate)) return "";
  if (/[$€£¥]|\b\d+(?:\.\d+)?(?:m|b|million|billion)?\b/iu.test(candidate)) return "";
  if (containsChinese(candidate) ? candidate.length > 16 : candidate.split(/\s+/u).length > 5) return "";
  return candidate;
}

function organizationMentions(title, parsed, eventType) {
  const hits = [];
  for (const entry of ORGANIZATION_ALIASES) {
    for (const alias of [...entry.aliases].sort((a, b) => b.length - a.length)) {
      const index = title.toLocaleLowerCase().indexOf(alias.toLocaleLowerCase());
      if (index < 0) continue;
      hits.push({ canonicalName: entry.canonicalName, mentionText: title.slice(index, index + alias.length), start: index, verified: true });
      break;
    }
  }
  hits.sort((a, b) => a.start - b.start || b.mentionText.length - a.mentionText.length);

  const selected = [];
  const canonical = new Set();
  for (const hit of hits) {
    if (canonical.has(hit.canonicalName.toLocaleLowerCase())) continue;
    const end = hit.start + hit.mentionText.length;
    if (selected.some((item) => hit.start >= item.start && end <= item.start + item.mentionText.length)) continue;
    selected.push(hit);
    canonical.add(hit.canonicalName.toLocaleLowerCase());
  }

  if (!selected.length && eventType !== "organization_people") {
    for (const rawCandidate of splitEntityNames(parsed.subject)) {
      const candidate = cleanOrganizationCandidate(rawCandidate);
      if (!candidate || canonical.has(candidate.toLocaleLowerCase())) continue;
      const start = Math.max(0, title.indexOf(candidate));
      selected.push({ canonicalName: candidate, mentionText: candidate, start, verified: false });
      canonical.add(candidate.toLocaleLowerCase());
    }
  }
  return selected.slice(0, 6);
}

function sentenceSpans(body) {
  const spans = [];
  const regex = /[^\n。！？!?]+[。！？!?]?/gu;
  for (const match of body.matchAll(regex)) {
    const quote = normalizeSpace(match[0]);
    if (quote.length < 20 || BOILERPLATE_TEXT.test(quote)) continue;
    const rawStart = match.index || 0;
    const leading = match[0].search(/\S/u);
    const start = rawStart + Math.max(0, leading);
    const end = start + match[0].trim().length;
    spans.push({ quote, start, end });
  }
  return spans;
}

function metricValues(text) {
  return [...text.matchAll(/(?:[$€£¥]\s?\d[\d,.]*\s?(?:million|billion|trillion|m|b|t|bn)?|\d[\d,.]*\s?(?:%|million|billion|trillion|gpus?|chips?|servers?|accelerators?|万|亿|万元|亿元|台|枚|颗))/giu)]
    .map((match) => match[0]).slice(0, 12);
}

function locations(text) {
  const known = ["United States", "US", "U.S.", "China", "Europe", "India", "Japan", "Korea", "Singapore", "美国", "中国", "欧洲", "印度", "日本", "韩国", "新加坡"];
  return [...new Set(known.filter((name) => new RegExp(`(?:^|\\W)${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}(?:$|\\W)`, "iu").test(text)))];
}

function buildClaim(rawId, eventType, source, parsed, index, status) {
  return {
    claim_id: `CL-${hash(`${rawId}|${source.start}|${source.quote}`)}`,
    raw_id: rawId,
    claim_type: eventType,
    subject: parsed.subject,
    predicate: eventType,
    object: parsed.object || source.quote,
    qualifiers: { event_status: status, sequence: index + 1 },
    source_span: { raw_id: rawId, start: source.start, end: source.end },
    source_quote: source.quote,
    extraction_method: "deterministic_source_span",
    extraction_confidence: index === 0 ? 0.9 : 0.82,
    verification_status: ["rumored", "disputed"].includes(status) ? "disputed" : "accepted"
  };
}

function claimCandidates(body, title, rule, subject = "") {
  const all = sentenceSpans(body);
  const titleTokens = normalizeSpace(title).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((value) => value.length >= 3).slice(0, 8);
  const subjectTokens = normalizeSpace(subject).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((value) => value.length >= 3);
  const direct = all.filter((span) => rule.pattern.test(span.quote)).filter((span) => {
    if (span.start < 900) return true;
    return subjectTokens.some((token) => span.quote.toLowerCase().includes(token));
  });
  const related = all.filter((span) => titleTokens.filter((token) => span.quote.toLowerCase().includes(token)).length >= 2);
  const merged = [...direct, ...related].filter((span, index, list) => list.findIndex((item) => item.start === span.start) === index);
  return merged.slice(0, 4);
}

function evidencePattern(term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return /\p{Script=Han}/u.test(term)
    ? new RegExp(escaped, "iu")
    : new RegExp(`(?:^|[^\\p{L}\\p{N}_])${escaped}(?:$|[^\\p{L}\\p{N}_])`, "iu");
}

function definitionMatcher(definition) {
  return {
    definition,
    patterns: definition.includes.map(evidencePattern),
    exclusions: definition.excludes.map(evidencePattern)
  };
}

function taxonomyMatchers(taxonomy) {
  return taxonomy.tags.filter((tag) => tag.status === "active").map(definitionMatcher);
}

function facetMatchers(taxonomy) {
  return taxonomy.facets.flatMap((facet) => facet.values
    .filter((value) => value.status === "active")
    .map((value) => ({
      ...definitionMatcher(value),
      facet
    })));
}

function matchesDefinition(text, matcher) {
  return matcher.patterns.some((pattern) => pattern.test(text))
    && !matcher.exclusions.some((pattern) => pattern.test(text));
}

function textSupportsEventObject(claim, evidenceText = claim.source_quote) {
  const object = normalizeSpace(claim.object).toLocaleLowerCase();
  const quote = normalizeSpace(evidenceText).toLocaleLowerCase();
  const tokens = object
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => /\p{Script=Han}/u.test(token) ? [...token].length >= 2 : token.length >= 4)
    .filter((token) => !["with", "from", "that", "this", "will", "about"].includes(token));
  return !tokens.length || tokens.some((token) => quote.includes(token));
}

function tagAssertionsForClaim(claim, matchers) {
  const out = [];
  for (const matcher of matchers) {
    if (!matchesDefinition(claim.source_quote, matcher)) continue;
    out.push({
      asset_id: claim.claim_id,
      tag_id: matcher.definition.id,
      evidence_ref: claim.claim_id,
      source_span: claim.source_span,
      assignment_method: "rule",
      confidence: 0.9,
      taxonomy_version: VERSION.tag,
      status: "active"
    });
  }
  return out;
}

function facetAssertionsForClaim(claim, matchers) {
  const out = [];
  for (const matcher of matchers) {
    const evidenceSegments = claim.source_quote.split(/(?<=[.!?。！？;；])\s+|\n+/u).filter(Boolean);
    const matchedSegments = evidenceSegments.filter((segment) => matchesDefinition(segment, matcher));
    if (!matchedSegments.length) continue;
    if (matcher.facet.id === "product_form" && !matchedSegments.some((segment) => textSupportsEventObject(claim, segment))) continue;
    out.push({
      asset_id: claim.claim_id,
      dimension_id: matcher.facet.id,
      value_id: matcher.definition.id,
      evidence_ref: claim.claim_id,
      source_span: claim.source_span,
      assignment_method: "rule",
      confidence: 0.88,
      taxonomy_version: VERSION.tag,
      status: "active"
    });
  }
  return out;
}

export function eventAiRelevanceEvidence({ title = "", claims: eventClaims = [], entityNames = [], eventType = "" } = {}) {
  const claimQuotes = eventClaims.map((claim) => typeof claim === "string" ? claim : claim?.source_quote || "");
  const evidenceText = [title, ...claimQuotes].filter(Boolean).join("\n");
  const administrativeSupportMatch = evidenceText.match(ADMINISTRATIVE_AI_SUPPORT_PROGRAM);
  if (administrativeSupportMatch) {
    return {
      accepted: false,
      basis: "administrative_ai_support_program",
      evidence: administrativeSupportMatch[0],
      event_type: eventType
    };
  }
  const namedMatch = evidenceText.match(NAMED_AI_EVIDENCE);
  if (namedMatch) return { accepted: true, basis: "named_ai_technology", evidence: namedMatch[0] };
  const nativeOrganization = entityNames.find((name) => AI_NATIVE_ORGANIZATIONS.has(String(name || "").toLocaleLowerCase()));
  if (nativeOrganization) return { accepted: true, basis: "ai_native_organization", evidence: nativeOrganization };
  const explicitMatch = evidenceText.match(EXPLICIT_AI_EVIDENCE);
  if (explicitMatch && GENERIC_VERTICAL_AI_PUBLICITY.test(evidenceText)) {
    return { accepted: false, basis: "outside_ai_industry_event_scope", evidence: explicitMatch[0], event_type: eventType };
  }
  if (explicitMatch) return { accepted: true, basis: "explicit_source_text", evidence: explicitMatch[0] };
  return { accepted: false, basis: "no_ai_event_evidence", evidence: "" };
}

function componentType(text) {
  const entries = [
    ["gpu", /\bGPU(?:s)?\b|图形处理器/iu],
    ["ai_accelerator", /\baccelerator(?:s)?\b|AI加速器|人工智能加速器/iu],
    ["semiconductor", /\b(?:chip|chips|semiconductor|processor)\b|芯片|半导体|处理器/iu],
    ["server", /\bservers?\b|服务器/iu],
    ["input_device", /\bkeyboard\b|键盘/iu],
    ["robot", /\brobots?\b|机器人/iu],
    ["smart_glasses", /\b(?:smart|AI) glasses\b|智能眼镜|AI眼镜/iu],
    ["ai_device", /\bAI (?:device|hardware)\b|AI\s*智能硬件|人工智能硬件/iu],
    ["data_center", /\bdata cent(?:er|re)\b|数据中心/iu]
  ];
  return entries.find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function hardwareProjection(event, claims, entities) {
  const allowed = new Set(["hardware_product", "hardware_capacity", "hardware_supply", "hardware_deployment"]);
  if (!allowed.has(event.event_type) || !["verified", "partial"].includes(event.publication_status)) return null;
  const text = claims.map((claim) => claim.source_quote).join(" ");
  const component = componentType(text);
  if (!component) return null;
  const metric = metricValues(text)[0] || "";
  const capacity = metric ? Number(metric.replace(/[^\d.]/gu, "")) : null;
  return {
    hardware_record_id: `HW-${hash(event.event_id)}`,
    event_id: event.event_id,
    hardware_event_type: event.event_type,
    component_type: component,
    compute_layer: /edge|on-device|端侧|设备端/iu.test(text) ? "edge" : /data cent(?:er|re)|cloud|数据中心|云/iu.test(text) ? "data_center" : "",
    manufacturing_stage: /fab|wafer|foundry|晶圆|代工/iu.test(text) ? "manufacturing" : "",
    process_node: text.match(/\b\d+(?:\.\d+)?\s?nm\b/iu)?.[0] || "",
    capacity: Number.isFinite(capacity) ? capacity : null,
    capacity_unit: metric.replace(/[\d.,\s]/gu, ""),
    supplier: ["hardware_product", "hardware_capacity", "hardware_supply", "product_release"].includes(event.event_type) ? entities[0]?.canonical_name || "" : "",
    customer: "",
    deployment_site: "",
    region: event.locations[0] || "",
    contract_value: /[$€£¥]|亿元|亿美元/iu.test(metric) ? metric : "",
    shipment_date: /ship|deliver|出货|交付/iu.test(text) ? event.event_time : "",
    claim_refs: event.claim_refs,
    source_refs: event.source_refs
  };
}

function fdeProjection(event, claims, entities) {
  const allowed = new Set(["deployment", "procurement_contract", "partnership"]);
  if (!allowed.has(event.event_type) || !["verified", "partial"].includes(event.publication_status)) return null;
  const text = claims.map((claim) => claim.source_quote).join(" ");
  if (!/\b(?:deploy|implement|rollout|go live|customer|workflow|integrat)\w*\b|部署|上线|客户|工作流|集成|实施/iu.test(text)) return null;
  const reportedMetrics = metricValues(text);
  const outcomes = claims.filter((claim) => /\b(?:reduced|increased|improved|saved|achieved)\b|降低|提升|节省|达到/iu.test(claim.source_quote)).map((claim) => claim.source_quote);
  const delivery = claims.filter((claim) => /\b(?:deployed|implemented|integrated|rolled out)\b|部署|实施|集成|上线/iu.test(claim.source_quote)).map((claim) => claim.source_quote);
  const record = {
    fde_id: `FDE-${hash(event.event_id)}`,
    event_id: event.event_id,
    customer: ["deployment", "procurement_contract"].includes(event.event_type) ? entities[0]?.canonical_name || "" : "",
    vendor: "",
    industry: "",
    use_case: event.object,
    workflow_before: "",
    workflow_after: "",
    deployment_stage: event.event_status,
    delivery_model: "",
    team_composition: "",
    systems_integrated: [],
    data_requirements: [],
    governance_controls: [],
    timeline: event.event_time,
    reported_metrics: reportedMetrics,
    metric_attribution: reportedMetrics.length ? "source_reported" : "",
    reported_need: "",
    reported_delivery_components: delivery,
    reported_outcomes: outcomes,
    undisclosed_fields: [],
    claim_refs: event.claim_refs,
    source_refs: event.source_refs
  };
  for (const field of ["customer", "vendor", "industry", "workflow_before", "workflow_after", "delivery_model", "team_composition", "reported_need"]) {
    if (!record[field]) record.undisclosed_fields.push(field);
  }
  if (!record.systems_integrated.length) record.undisclosed_fields.push("systems_integrated");
  if (!record.data_requirements.length) record.undisclosed_fields.push("data_requirements");
  if (!record.governance_controls.length) record.undisclosed_fields.push("governance_controls");
  if (!record.reported_outcomes.length) record.undisclosed_fields.push("reported_outcomes");
  return record;
}

function cleanForCluster(value) {
  return normalizeSpace(value).toLowerCase().replace(/\b(?:announces?|launches?|releases?|introduces?|the|a|an|new)\b/gu, " ").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").slice(0, 14).join(" ");
}

function normalizedFundingMetric(value) {
  const text = normalizeSpace(value).toLowerCase().replace(/,/gu, "");
  const western = text.match(/([$€£¥])\s*(\d+(?:\.\d+)?)\s*(billion|million|bn|mn|b|m)?\b/u);
  if (western) {
    const unit = western[3] || "";
    const multiplier = /^(?:billion|bn|b)$/u.test(unit) ? 1000 : /^(?:million|mn|m)$/u.test(unit) ? 1 : 0.000001;
    return `${western[1]}:${Number(western[2]) * multiplier}:million`;
  }
  const chinese = text.match(/(\d+(?:\.\d+)?)\s*(亿|万)?\s*(美元|欧元|英镑|元)/u);
  if (chinese) {
    const multiplier = chinese[2] === "亿" ? 100 : chinese[2] === "万" ? 0.01 : 0.000001;
    return `${chinese[3]}:${Number(chinese[1]) * multiplier}:million`;
  }
  return text;
}

function clusterEvents(candidates) {
  const clusters = new Map();
  for (const candidate of candidates) {
    const identity = candidate.event_type === "funding" && candidate.metrics[0]
      ? normalizedFundingMetric(candidate.metrics[0])
      : cleanForCluster(candidate.object || candidate.action);
    const key = `${candidate.event_type}|${candidate.entities[0] || "unknown"}|${identity}`;
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key).push(candidate);
  }
  const canonicalEvents = [];
  const conflicts = [];
  for (const [key, items] of clusters.entries()) {
    const statuses = [...new Set(items.map((item) => item.event_status))];
    const conflictRows = statuses.length > 1 ? [{ conflict_id: `CF-${hash(key)}`, field: "event_status", values: statuses, source_refs: [...new Set(items.flatMap((item) => item.source_refs))] }] : [];
    conflicts.push(...conflictRows.map((row) => ({ ...row, event_id: `EV-${hash(key)}` })));
    const base = items[0];
    const { event_candidate_id: _eventCandidateId, ...canonicalBase } = base;
    const publication = conflictRows.length ? "disputed" : items.some((item) => item.publication_status === "verified") ? "verified" : base.publication_status;
    canonicalEvents.push({
      ...canonicalBase,
      event_id: `EV-${hash(key)}`,
      entities: [...new Set(items.flatMap((item) => item.entities))],
      metrics: [...new Set(items.flatMap((item) => item.metrics))],
      locations: [...new Set(items.flatMap((item) => item.locations))],
      claim_refs: [...new Set(items.flatMap((item) => item.claim_refs))],
      source_refs: [...new Set(items.flatMap((item) => item.source_refs))],
      conflicts: conflictRows.map((row) => row.conflict_id),
      update_history: items.map((item) => ({ source_ref: item.source_refs[0], disclosed_at: item.disclosed_at, status: item.event_status })),
      publication_status: publication
    });
  }
  return { canonicalEvents, conflicts };
}

function compatibilityCardType(eventType) {
  if (eventType === "funding") return "funding";
  if (["deployment", "procurement_contract", "partnership"].includes(eventType)) return "case";
  return "product_service";
}

function forbiddenKeys(value, trail = "", out = []) {
  if (Array.isArray(value)) value.forEach((item, index) => forbiddenKeys(item, `${trail}[${index}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (JUDGMENT_KEYS.has(key)) out.push(`${trail}.${key}`);
      forbiddenKeys(item, `${trail}.${key}`, out);
    }
  }
  return out;
}

export function buildBundle(rawEntries, taxonomy, date, generatedAt = new Date().toISOString()) {
  const sourceArtifacts = [];
  const rawDocuments = [];
  const claims = [];
  const entities = new Map();
  const entityMentions = [];
  const eventCandidates = [];
  const tagAssertions = [];
  const facetAssertions = [];
  const qaQueue = [];
  const legacyMappings = [];
  const matchers = taxonomyMatchers(taxonomy);
  const structuredMatchers = facetMatchers(taxonomy);

  for (const { raw, file } of rawEntries) {
    const artifact = sourceArtifact(raw, file);
    const rawId = `RAW-${hash(`${date}|${artifact.source_artifact_id}`)}`;
    const bodyOriginal = cleanString(raw.clean_text || raw.full_text);
    const bodyClean = trimBoilerplate(bodyOriginal);
    const titleOriginal = cleanString(raw.title || raw.title_zh);
    const title = normalizeEventTitle(titleOriginal);
    const rule = findEventRule(title, bodyClean.slice(0, 1200));
    const opinionOnly = (OPINION_ONLY.test(title) && !rule) || PROPOSAL_ONLY.test(title);
    const extractionStatus = !artifact.source_url || bodyClean.length < 20 || /\ufffd/gu.test(bodyClean) ? "quarantined" : bodyClean.length < 300 ? "partial" : "accepted";
    const doc = {
      schema_version: VERSION.raw,
      raw_id: rawId,
      source_artifact_id: artifact.source_artifact_id,
      source_url: artifact.source_url,
      canonical_url: artifact.canonical_url,
      publisher: artifact.publisher,
      author: cleanString(raw.author),
      published_at: cleanString(raw.published_at),
      updated_at: cleanString(raw.last_seen_at || raw.published_at),
      captured_at: artifact.captured_at,
      language: cleanString(raw.language),
      document_type: documentType(raw),
      title_original: titleOriginal,
      title_zh: cleanString(raw.title_zh),
      body_original: bodyOriginal,
      body_clean: bodyClean,
      content_hash: artifact.content_hash,
      capture_method: artifact.capture_method,
      extraction_status: extractionStatus,
      source_update_history: raw.update_detected ? [{ detected_at: cleanString(raw.last_seen_at), previous_ref: cleanString(raw.duplicate_of) }] : [],
      claim_ids: [],
      entity_mention_ids: [],
      event_candidate_ids: []
    };
    delete artifact._legacy_path;
    sourceArtifacts.push(artifact);

    if (extractionStatus === "quarantined") {
      qaQueue.push({ qa_id: `QA-${hash(rawId)}`, asset_id: rawId, reason: "raw_document_not_auditable", status: "open", source_ref: artifact.source_artifact_id });
    } else if (!rule || opinionOnly) {
      qaQueue.push({ qa_id: `QA-${hash(`${rawId}|no-event`)}`, asset_id: rawId, reason: opinionOnly ? "opinion_without_source_bounded_event" : "no_source_bounded_event", status: "review_optional", source_ref: artifact.source_artifact_id });
    } else {
      const parsed = actionMatch(title, rule.pattern);
      const status = eventStatus(title, bodyClean.slice(0, 1600), rule.eventType);
      const spans = claimCandidates(bodyClean, title, rule, parsed.subject);
      const eventClaimRows = spans.map((span, index) => buildClaim(rawId, rule.eventType, span, parsed, index, status));
      const entityNames = organizationMentions(title, parsed, rule.eventType);
      const aiRelevance = eventAiRelevanceEvidence({
        title,
        claims: eventClaimRows,
        entityNames: entityNames.map((item) => item.canonicalName),
        eventType: rule.eventType
      });
      if (!aiRelevance.accepted) {
        const reason = aiRelevance.basis === "outside_ai_industry_event_scope"
          ? "event_outside_ai_industry_scope"
          : aiRelevance.basis === "administrative_ai_support_program"
            ? "administrative_ai_support_program_not_commercial_event"
            : "event_not_ai_relevant";
        qaQueue.push({
          qa_id: `QA-${hash(`${rawId}|ai-relevance`)}`,
          asset_id: rawId,
          reason,
          status: "review_optional",
          source_ref: artifact.source_artifact_id
        });
        rawDocuments.push(doc);
        legacyMappings.push({ legacy_raw_id: cleanString(raw.raw_id), legacy_path: rel(file), raw_id: rawId, event_candidate_id: "", event_id: "" });
        continue;
      }

      claims.push(...eventClaimRows);
      doc.claim_ids.push(...eventClaimRows.map((claim) => claim.claim_id));
      for (const claim of eventClaimRows) {
        tagAssertions.push(...tagAssertionsForClaim(claim, matchers));
        facetAssertions.push(...facetAssertionsForClaim(claim, structuredMatchers));
      }

      const entityIds = [];
      for (const entityMatch of entityNames) {
        const name = entityMatch.canonicalName;
        const entityId = `EN-${hash(name.toLowerCase())}`;
        entityIds.push(entityId);
        if (!entities.has(entityId)) {
          entities.set(entityId, {
            entity_id: entityId,
            canonical_name: name,
            entity_type: "organization_candidate",
            aliases: entityMatch.mentionText !== name ? [entityMatch.mentionText] : [],
            verification_status: entityMatch.verified ? "verified" : "candidate"
          });
        } else if (entityMatch.mentionText !== name) {
          const entity = entities.get(entityId);
          entity.aliases = [...new Set([...entity.aliases, entityMatch.mentionText])];
          if (entityMatch.verified) entity.verification_status = "verified";
        }
        const titleOffset = Math.max(0, entityMatch.start);
        const mentionId = `EM-${hash(`${rawId}|${entityId}|${titleOffset}`)}`;
        entityMentions.push({
          mention_id: mentionId,
          entity_id: entityId,
          raw_id: rawId,
          text: entityMatch.mentionText,
          source: "title_original",
          start: titleOffset,
          end: titleOffset + entityMatch.mentionText.length,
          verification_status: entityMatch.verified ? "verified" : "candidate"
        });
        doc.entity_mention_ids.push(mentionId);
      }

      if (eventClaimRows.length) {
        const candidateId = `EC-${hash(`${rawId}|${rule.eventType}`)}`;
        doc.event_candidate_ids.push(candidateId);
        eventCandidates.push({
          event_candidate_id: candidateId,
          event_type: rule.eventType,
          event_status: status,
          event_time: cleanString(raw.published_at),
          disclosed_at: cleanString(raw.published_at || raw.collected_at),
          entities: entityIds,
          action: parsed.action || rule.eventType,
          object: parsed.object || title,
          metrics: metricValues(eventClaimRows.map((claim) => claim.source_quote).join(" ")),
          locations: locations(eventClaimRows.map((claim) => claim.source_quote).join(" ")),
          claim_refs: eventClaimRows.map((claim) => claim.claim_id),
          source_refs: [artifact.source_artifact_id],
          conflicts: [],
          missing_fields: [!entityIds.length ? "entities" : "", !parsed.object ? "object" : ""].filter(Boolean),
          update_history: [],
          publication_status: publicationStatus(status, cleanString(raw.source_role), eventClaimRows.length)
        });
        legacyMappings.push({ legacy_raw_id: cleanString(raw.raw_id), legacy_path: rel(file), raw_id: rawId, event_candidate_id: candidateId, event_id: "" });
      }
    }
    rawDocuments.push(doc);
    if (!legacyMappings.some((mapping) => mapping.raw_id === rawId)) legacyMappings.push({ legacy_raw_id: cleanString(raw.raw_id), legacy_path: rel(file), raw_id: rawId, event_candidate_id: "", event_id: "" });
  }

  const clustered = clusterEvents(eventCandidates);
  const candidateToEvent = new Map();
  for (const event of clustered.canonicalEvents) {
    for (const claimRef of event.claim_refs) candidateToEvent.set(claimRef, event.event_id);
  }
  for (const mapping of legacyMappings) {
    const doc = rawDocuments.find((item) => item.raw_id === mapping.raw_id);
    mapping.event_id = doc?.claim_ids.map((id) => candidateToEvent.get(id)).find(Boolean) || "";
  }

  const entityRows = [...entities.values()];
  const claimsById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  const entitiesById = new Map(entityRows.map((entity) => [entity.entity_id, entity]));
  const fdeRecords = [];
  const hardwareRecords = [];
  for (const event of clustered.canonicalEvents) {
    const eventClaims = event.claim_refs.map((id) => claimsById.get(id)).filter(Boolean);
    const eventEntities = event.entities.map((id) => entitiesById.get(id)).filter(Boolean);
    const fde = fdeProjection(event, eventClaims, eventEntities);
    const hardware = hardwareProjection(event, eventClaims, eventEntities);
    if (fde) fdeRecords.push(fde);
    if (hardware) hardwareRecords.push(hardware);
  }

  const eventSources = clustered.canonicalEvents.flatMap((event) => event.source_refs.map((sourceRef) => ({ event_id: event.event_id, source_artifact_id: sourceRef })));
  const eventClaims = clustered.canonicalEvents.flatMap((event) => event.claim_refs.map((claimRef) => ({ event_id: event.event_id, claim_id: claimRef })));
  const relationships = clustered.canonicalEvents.flatMap((event) => event.claim_refs.map((claimRef) => claimsById.get(claimRef)).filter(Boolean).map((claim) => ({
    relationship_id: `REL-${hash(`${event.event_id}|${claim.claim_id}`)}`,
    event_id: event.event_id,
    subject: claim.subject,
    predicate: claim.predicate,
    object: claim.object,
    claim_ref: claim.claim_id,
    source_refs: event.source_refs
  })));
  const rawBySource = new Map(rawDocuments.map((document) => [document.source_artifact_id, document]));
  const compatibilityCards = clustered.canonicalEvents.flatMap((event) => {
    const document = event.source_refs.map((id) => rawBySource.get(id)).find(Boolean);
    const displayTitle = normalizeEventTitle(document?.title_zh || document?.title_original || `${event.action} ${event.object}`.trim());
    const eventClaimRows = event.claim_refs.map((id) => claimsById.get(id)).filter(Boolean);
    const firstClaim = eventClaimRows.find((claim) => normalizeEventTitle(claim.source_quote).toLowerCase() !== displayTitle.toLowerCase());
    if (!firstClaim) {
      qaQueue.push({ qa_id: `QA-${hash(`${event.event_id}|card-fact`)}`, asset_id: event.event_id, reason: "compatibility_card_distinct_fact_missing", status: "open", source_ref: event.source_refs[0] });
      return [];
    }
    return [{
      card_id: `CARD-${hash(event.event_id)}`,
      event_id: event.event_id,
      card_type: compatibilityCardType(event.event_type),
      title: displayTitle,
      fact: firstClaim?.source_quote || "",
      event_status: event.event_status,
      publication_status: event.publication_status,
      event_time: event.event_time,
      claim_refs: event.claim_refs,
      source_refs: event.source_refs,
      conflicts: event.conflicts,
      missing_fields: event.missing_fields
    }];
  });
  const files = {
    source_artifacts: sourceArtifacts,
    raw_documents: rawDocuments,
    claims,
    entities: entityRows,
    entity_mentions: entityMentions,
    canonical_events: clustered.canonicalEvents,
    compatibility_cards: compatibilityCards,
    event_sources: eventSources,
    event_claims: eventClaims,
    relationships,
    event_conflicts: clustered.conflicts,
    tag_assertions: tagAssertions,
    facet_assertions: facetAssertions,
    fde_records: fdeRecords,
    hardware_records: hardwareRecords,
    qa_queue: qaQueue,
    legacy_asset_mappings: legacyMappings
  };
  const manifest = {
    product_version: VERSION.product,
    raw_version: VERSION.raw,
    event_version: VERSION.event,
    fde_version: VERSION.fde,
    hardware_version: VERSION.hardware,
    tag_version: VERSION.tag,
    date,
    generated_at: generatedAt,
    source_of_truth: "source_artifact_raw_claim_event",
    legacy_page_compatibility: "v3_pipeline_unchanged",
    counts: Object.fromEntries(Object.entries(files).map(([name, rows]) => [name, rows.length])),
    forbidden_field_hits: forbiddenKeys(files)
  };
  return { manifest, ...files };
}

export function writeBundle(bundle, date, destination = path.join(outputRoot, date)) {
  fs.mkdirSync(destination, { recursive: true });
  for (const [name, value] of Object.entries(bundle)) {
    writeJson(path.join(destination, `${name.replace(/_/gu, "-")}.json`), value);
  }
  return destination;
}

function loadRawEntries(date) {
  const dir = path.join(rawRoot, date);
  if (!fs.existsSync(dir)) throw new Error(`Raw originals directory not found: ${rel(dir)}`);
  return fs.readdirSync(dir).filter((name) => name.endsWith(".json")).sort().map((name) => {
    const file = path.join(dir, name);
    return { raw: readJson(file), file };
  });
}

function main() {
  const date = arg("date", availableDates().at(-1));
  if (!date) throw new Error("No Raw date is available. Pass --date=YYYY-MM-DD.");
  const taxonomy = readJson(taxonomyPath);
  if (taxonomy.taxonomy_version !== VERSION.tag) throw new Error(`Expected ${VERSION.tag}, received ${taxonomy.taxonomy_version}`);
  const bundle = buildBundle(loadRawEntries(date), taxonomy, date);
  const destination = writeBundle(bundle, date);
  console.log(JSON.stringify({ ok: true, date, output: rel(destination), counts: bundle.manifest.counts, forbidden_field_hits: bundle.manifest.forbidden_field_hits }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

export { VERSION, JUDGMENT_KEYS, trimBoilerplate, normalizeEventTitle, findEventRule, eventStatus, forbiddenKeys };
