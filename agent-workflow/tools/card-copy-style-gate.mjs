import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawArgs = process.argv.slice(2);
const flags = new Map(
  rawArgs
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const date = flags.get("date") || new Date().toISOString().slice(0, 10);
const strict = flags.get("strict") !== "false";
const requireGateFields = flags.get("require-gates") === "true";
const reportsDir = path.join(root, "agent-workflow", "reports");
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const defaultTargets = [
  "01-SiteV2/knowledge/03-Asset-Candidates/change",
  "01-SiteV2/knowledge/03-Asset-Candidates/scene",
  "01-SiteV2/knowledge/01-Signal-Cards/case",
  "01-SiteV2/knowledge/01-Signal-Cards/product-service",
  "01-SiteV2/knowledge/01-Signal-Cards/funding",
  "01-SiteV2/knowledge/02-Opinion-Cards",
  "01-SiteV2/knowledge/03-Asset-Candidates/trend",
  "01-SiteV2/content/04-business-signals/signals",
  "01-SiteV2/content/05-frontier-opinions",
  "01-SiteV2/content/06-asset-candidates/change",
  "01-SiteV2/content/06-asset-candidates/scene",
  "01-SiteV2/content/06-asset-candidates/trend",
];

const targets = flags.has("path")
  ? flags.get("path").split(",").map((item) => item.trim()).filter(Boolean)
  : defaultTargets;

const bannedPhrases = [
  "首先",
  "其次",
  "最后",
  "值得注意的是",
  "显而易见",
  "不可否认",
  "总而言之",
  "综上所述",
  "由此可见",
  "核心在于",
  "这意味着",
  "赋能",
  "重构",
  "闭环",
  "底座",
  "抓手",
  "价值链路",
  "数智化升级",
  "一站式",
  "未来已来",
  "效率革命",
  "产业级机会",
  "值得关注",
];

const internalTerms = [
  "Raw",
  "Pool",
  "source-router",
  "guanlan-daily-monitor",
  "入库",
  "纳入趋势",
  "进入内参",
  "证据链",
  "强证据",
  "核心证据",
  "watchlist",
  "usable_for",
  "pool_routes",
  "evidence_level",
];

const abstractTitleParts = [
  "前提",
  "底座",
  "路线图",
  "新范式",
  "能力边界",
  "深水区",
  "门槛",
  "门禁",
  "围栏",
  "抓手",
];

const weakTitleStarts = [
  "账单开始",
  "围栏成了",
  "门禁进入",
  "采用率开始",
  "能力开始",
  "流程开始",
];

const abstractSuffixPattern = /[\u4e00-\u9fa5A-Za-z0-9]{2,}(感|性|化)/g;
const abstractAllowList = new Set(["变化", "转化", "消化", "分化", "淡化", "强化", "公开化", "自动化"]);

const publicSectionNames = new Set([
  "事实底稿",
  "观点底稿",
  "信号底稿",
  "候选底稿",
  "变化假设",
  "场景底稿",
  "趋势候选",
  "发生了什么",
  "这个案例是谁",
  "它支撑的变化",
  "一句解释",
  "为什么值得看",
  "商业含义",
  "技术路线 / 方法变化",
  "产品 / 项目做法",
  "客户与场景",
  "同类产品 / 相邻案例",
  "继续观察",
  "中文转述",
  "观澜解读",
  "对人物时间线的意义",
  "前台展示文案",
]);

const ignoredSectionPattern = /^(原始出处与证据|数据来源|关联资产|证据缺口|事实主张校验|Tags|后台结构化主张|人物 \/ 机构|发表时间与出处|原文摘录|可信边界)/u;

const cardTypes = new Set([
  "signal_card",
  "change_card",
  "case_card",
  "opinion_card",
  "trend_card",
  "change_candidate",
  "scene_candidate",
  "trend_candidate",
]);

const generatedFrontmatterFields = new Map([
  ["signal_card", ["event", "business_meaning", "why_selected", "signal_type", "watch_reason"]],
  ["change_card", ["event", "business_meaning", "why_selected", "technical_route_business_meaning", "same_or_adjacent_cases"]],
  ["case_card", ["case_event", "case_value", "supported_change", "customer_or_scene", "business_model", "same_or_adjacent_cases"]],
  ["opinion_card", ["impact_reason", "structured_claim", "opinion_object", "opinion_tendency", "opinion_status"]],
  ["trend_card", ["trend_status"]],
  ["change_candidate", ["change_hypothesis", "supporting_signals", "before_after", "business_variable", "watch_window"]],
  ["scene_candidate", ["industry_or_department", "user_or_role", "workflow_or_task", "ai_changed_step", "evidence_gap"]],
  ["trend_candidate", ["trend_hypothesis", "supporting_changes", "supporting_scenes", "source_types", "risk_boundary", "follow_up_variables"]],
]);

const protectedFrontmatterFields = new Set([
  "raw_ref",
  "raw_archive",
  "raw_json",
  "source_url",
  "original_url",
  "canonical_url",
  "url",
  "full_text_hash",
  "source_level",
  "extraction_quality",
  "has_full_text",
  "published_at",
  "collected_at",
  "capture_scope",
  "text",
  "quote",
  "originalQuote",
  "originalTranslation",
  "translation",
  "translationZh",
  "markdown_snapshot",
  "screenshot_path",
]);

const actionVerbPattern = /(发布|推出|上线|宣布|合作|接入|集成|部署|采用|融资|收购|开源|公测|改价|披露|扩展|升级|暂停|下线|监管|诉讼|采购|招标|推出|launch|release|integrate|deploy|acquire|fund)/iu;
const businessVariablePattern = /(客户|流程|预算|组织|责任|风险|竞争|采购|成本|收入|定价|毛利|交付|渠道|岗位|部门|合规|审计|回滚|数据|场景|市场)/u;
const opinionFactPattern = /(已经|宣布|发布|推出|上线|融资|收购|客户采用|收入|营收|市场规模|估值|下载量|采购|部署)/u;

const listFiles = (target) => {
  const abs = path.resolve(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return abs.endsWith(".md") ? [abs] : [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "_archive" || entry.name === "10-Templates") continue;
      const next = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(next);
      } else if (entry.name.endsWith(".md") && entry.name.startsWith(date)) {
        files.push(next);
      }
    }
  };
  walk(abs);
  return files;
};

const frontmatter = (text) => {
  const match = text.match(/^---\s*([\s\S]*?)---/u);
  return match?.[1] || "";
};

const fieldValue = (fm, field) => {
  const match = fm.match(new RegExp(`^${field}:\\s*(.+)$`, "mu"));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
};

const fieldValueAnyIndent = (fm, field) => {
  const match = fm.match(new RegExp(`^\\s*${field}:\\s*(.+)$`, "mu"));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
};

const hasOpinionTranslation = (fm, copy) => {
  const frontend = sectionBlock(fm, "frontend");
  const candidates = [
    fieldValueAnyIndent(frontend, "originalTranslation"),
    fieldValue(fm, "original_translation"),
    copy.match(/^中文(?:翻译|转述)[：:]\s*(.+)$/mu)?.[1] || "",
  ];
  return candidates.some((value) => {
    const text = String(value || "").trim();
    return text && !/^(待补|暂无|未补|pending|todo)/iu.test(text);
  });
};

const hasFrontstageOpinionTranslation = (fm, copy) => {
  const frontend = sectionBlock(fm, "frontend");
  const candidates = [
    fieldValueAnyIndent(frontend, "originalTranslation"),
    fieldValue(fm, "original_translation"),
    copy.match(/^中文(?:翻译|转述)[：:]\s*(.+)$/mu)?.[1] || "",
  ];
  return candidates.some((value) => {
    const text = String(value || "").trim();
    return text
      && /\p{Script=Han}/u.test(text)
      && !/(pending|todo|missing|not translated|translation pending)/iu.test(text);
  });
};

const isXSourceUrl = (value = "") => /\bx\.com\b|\btwitter\.com\b/iu.test(String(value || ""));

const compactText = (value = "") => String(value || "").replace(/https?:\/\/\S+/gu, "").replace(/\s+/gu, " ").trim();

const hasCompleteXTranslation = (source = "", translation = "") => {
  const sourceLength = compactText(source).length;
  if (sourceLength < 500) return true;
  const translationLength = compactText(translation).length;
  const minimumLength = Math.min(260, Math.floor(sourceLength * 0.28));
  return translationLength >= minimumLength;
};

const isReleasedAsset = (fm) => {
  const status = fieldValue(fm, "status");
  const assetLevel = fieldValue(fm, "asset_level");
  const frontStatus = fieldValue(fm, "front_status");
  return ["published", "live"].includes(status)
    || ["formal", "frontstage"].includes(assetLevel)
    || frontStatus === "visible";
};

const frontmatterGeneratedText = (fm, type) => {
  const fields = generatedFrontmatterFields.get(type) || [];
  const chunks = [];
  for (const field of fields) {
    const value = fieldValue(fm, field);
    if (value && !/^\[\]$/u.test(value) && value !== "暂无公开信息") chunks.push(value);
  }

  const lines = fm.split(/\r?\n/);
  let inFrontend = false;
  for (const line of lines) {
    if (/^frontend:\s*$/u.test(line)) {
      inFrontend = true;
      continue;
    }
    if (inFrontend && /^\S/u.test(line)) inFrontend = false;
    if (!inFrontend) continue;
    const match = line.match(/^\s+([A-Za-z0-9_]+):\s*(.+)$/u);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.trim().replace(/^["']|["']$/g, "");
    if (protectedFrontmatterFields.has(key) || !value || value === "[]" || value === "{}") continue;
    chunks.push(value);
  }
  return chunks.join("\n");
};

const normalizedText = (value = "") => String(value)
  .replace(/[^\p{Letter}\p{Number}]+/gu, "")
  .toLowerCase();

const tooSimilar = (a = "", b = "") => {
  const left = normalizedText(a);
  const right = normalizedText(b);
  if (!left || !right) return false;
  return left === right || (left.length > 8 && right.includes(left)) || (right.length > 8 && left.includes(right));
};

const containsLongEnglishFragment = (value = "") => /[A-Za-z][A-Za-z0-9'’,-]*(?:\s+[A-Za-z][A-Za-z0-9'’,-]*){7,}/u.test(value);

const numberField = (fm, name) => {
  const value = fieldValueAnyIndent(fm, name);
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sectionBlock = (fm, name) => {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${name}:`);
  if (start === -1) return "";
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\S/u.test(line)) break;
    block.push(line);
  }
  return block.join("\n");
};

const hasListValue = (block = "", value = "") => {
  const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\n)\\s*-\\s*${escaped}\\s*(\\n|$)`, "u").test(block)
    || new RegExp(`(^|\\n)\\s*\\w+:\\s*\\[?[^\\n]*\\b${escaped}\\b`, "u").test(block);
};

const booleanFieldPassed = (fm, field) => /^(true|yes|passed)$/iu.test(fieldValueAnyIndent(fm, field));

const weakEvidencePattern = /(failed provider|index-only AI HOT|index_only AI HOT|community\/frontier|frontier opinion|搜索摘要|采集失败|抓取失败|官网首页|产品目录|文档目录|README|包页|模型页|SEO 页|社区讨论|社媒观点|follow-builders 转述)/iu;
const unavailableEvidencePattern = /(暂无公开信息|暂未监测到|needs_backfill|watchlist_only|threshold_pending|weak_signal_only|index_only|failed|missing|缺|待补证)/iu;

const stripFrontmatter = (text) => text.replace(/^---\s*[\s\S]*?---\s*/u, "");

const firstHeading = (text) => text.match(/^#\s+(.+)$/mu)?.[1]?.trim() || "";

const publicText = (text) => {
  const body = stripFrontmatter(text);
  const lines = body.split(/\r?\n/);
  const kept = [];
  let currentPublic = false;
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || trimmed.startsWith(">")) continue;

    const heading = trimmed.match(/^#{1,6}\s+(.+)$/u)?.[1]?.trim();
    if (heading) {
      if (ignoredSectionPattern.test(heading)) {
        currentPublic = false;
        continue;
      }
      currentPublic = publicSectionNames.has(heading) || trimmed.startsWith("# ");
      continue;
    }

    if (currentPublic) kept.push(line);
  }

  return kept.join("\n");
};

const lineOf = (text, needle) => {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => line.includes(needle));
  return index === -1 ? 1 : index + 1;
};

const hasEllipsis = (value) => /(\.\.\.|…|。。。)/u.test(value);

const scanFile = (file) => {
  const text = fs.readFileSync(file, "utf8");
  const fm = frontmatter(text);
  const type = fieldValue(fm, "type") || "unknown";
  const title = fieldValue(fm, "title") || firstHeading(text);
  if (type === "opinion_intake") {
    return { file, type, title, issues: [] };
  }
  const copy = publicText(text);
  const generatedCopy = frontmatterGeneratedText(fm, type);
  const copyForStyle = [copy, generatedCopy].filter(Boolean).join("\n");
  const issues = [];

  if (requireGateFields && cardTypes.has(type)) {
    for (const field of ["fact_draft_gate", "frontend_copy_gate", "cardcopy_gate"]) {
      if (!new RegExp(`^${field}:`, "mu").test(fm)) {
        issues.push({ type: "missing_gate_field", line: 1, message: `缺少四道门字段：${field}` });
      } else if (isReleasedAsset(fm) && fieldValue(fm, field) !== "passed") {
        issues.push({ type: "gate_not_passed", line: 1, message: `前台 / 正式资产必须通过门禁：${field}` });
      }
    }
  }

  if (!title || /^\{\{/.test(title)) {
    issues.push({ type: "missing_title", line: 1, message: "标题缺失或仍是模板占位符" });
  } else {
    if (hasEllipsis(title)) {
      issues.push({ type: "bad_title", line: lineOf(text, title), message: "标题出现省略号，不能是半截话" });
    }
    if (weakTitleStarts.some((start) => title.startsWith(start))) {
      issues.push({ type: "bad_title", line: lineOf(text, title), message: `标题像机械判断，不是事件：${title}` });
    }
    if (abstractTitleParts.some((part) => title.includes(part)) && !/[发布上线推出合作收购融资部署接入宣布]/u.test(title)) {
      issues.push({ type: "abstract_title", line: lineOf(text, title), message: `标题含抽象骨架，缺少明确动作：${title}` });
    }
    if (["signal_card", "change_card", "case_card"].includes(type) && !actionVerbPattern.test(title)) {
      issues.push({ type: "non_event_title", line: lineOf(text, title), message: `标题缺少明确动作，不像事件型标题：${title}` });
    }
  }

  for (const term of internalTerms) {
    if (copyForStyle.includes(term) || title.includes(term)) {
      issues.push({
        type: "internal_term",
        line: lineOf(text, term),
        message: `前台文案出现内部生产词：${term}`,
      });
    }
  }

  for (const phrase of bannedPhrases) {
    if (copyForStyle.includes(phrase)) {
      issues.push({
        type: "banned_phrase",
        line: lineOf(text, phrase),
        message: `机械 / 空泛表达：${phrase}`,
      });
    }
  }

  const seenAbstract = new Set();
  for (const match of copyForStyle.matchAll(abstractSuffixPattern)) {
    const value = match[0];
    if (
      abstractAllowList.has(value) ||
      value.endsWith("变化") ||
      value.endsWith("转化") ||
      value.endsWith("自动化") ||
      seenAbstract.has(value)
    ) continue;
    seenAbstract.add(value);
    issues.push({
      type: "abstract_suffix",
      line: lineOf(text, value),
      message: `疑似抽象名词泡沫：${value}`,
    });
  }

  if (["signal_card", "change_card", "case_card"].includes(type) && !/(谁|做了什么|证据是什么|缺什么|发生了什么)/u.test(copy)) {
    issues.push({
      type: "missing_fact_draft",
      line: 1,
      message: "缺少事实底稿或事实叙述，不能直接进入前台卡片",
    });
  }

  if (type === "opinion_card" && !/(谁|原文|摘录|说了什么|观点)/u.test(copy)) {
    issues.push({
      type: "missing_opinion_basis",
      line: 1,
      message: "观点卡缺少人物、原文或观点底稿",
    });
  }

  if (type === "signal_card") {
    const signalType = fieldValue(fm, "signal_type");
    if (signalType && !["product_service", "funding", "case"].includes(signalType)) {
      issues.push({ type: "unsupported_signal_type", line: 1, message: "商业信号主类型只能是 product_service / funding / case" });
    }
  }

  if (["signal_card", "change_card", "case_card"].includes(type)) {
    const summaryCandidates = [
      fieldValue(fm, "business_meaning"),
      fieldValue(fm, "why_selected"),
      fieldValue(fm, "case_value"),
      fieldValue(fm, "supported_change"),
    ].filter(Boolean);
    if (summaryCandidates.some((value) => tooSimilar(value, title))) {
      issues.push({ type: "summary_repeats_title", line: 1, message: "摘要 / 判断字段只是重复标题，没有补充事实或商业含义" });
    }
    const businessText = summaryCandidates.join("\n");
    if (isReleasedAsset(fm) && businessText && !businessVariablePattern.test(businessText)) {
      issues.push({ type: "missing_business_variable", line: 1, message: "商业含义未落到客户、流程、预算、组织、责任、风险或竞争等变量" });
    }

    if (isReleasedAsset(fm)) {
      const primaryRaw = sectionBlock(fm, "primary_raw");
      const sourceEvidence = sectionBlock(fm, "source_evidence");
      const evidenceGate = fieldValue(fm, "evidence_gate");
      const sourceLevel = fieldValueAnyIndent(primaryRaw, "source_level");
      const extractionQuality = fieldValueAnyIndent(primaryRaw, "extraction_quality");
      const rawQcDecision = fieldValueAnyIndent(primaryRaw, "raw_qc_decision");
      const importanceScore = Number.parseInt(fieldValueAnyIndent(primaryRaw, "importance_score"), 10);

      if (evidenceGate !== "core_evidence_passed") {
        issues.push({ type: "weak_asset_evidence_gate", line: 1, message: "正式 / 前台商业信号必须为 evidence_gate=core_evidence_passed；变化 / 场景 / 趋势候选不得伪装成正式前台资产" });
      }
      if (!hasListValue(primaryRaw, "core_pool")) {
        issues.push({ type: "missing_core_pool", line: 1, message: "正式 / 前台商业信号必须来自 eligible core_pool" });
      }
      if (!booleanFieldPassed(primaryRaw, "has_full_text")) {
        issues.push({ type: "missing_full_text_gate", line: 1, message: "正式 / 前台商业信号必须保留 has_full_text=true" });
      }
      if (!["high", "medium"].includes(extractionQuality)) {
        issues.push({ type: "weak_extraction_quality", line: 1, message: "正式 / 前台商业信号必须来自 high / medium 抽取质量" });
      }
      if (rawQcDecision && rawQcDecision !== "allow") {
        issues.push({ type: "raw_qc_not_allow", line: 1, message: "正式 / 前台商业信号不得使用 raw_qc_decision 非 allow 的主证据" });
      }
      if (sourceLevel && /^(C|D|M)$/iu.test(sourceLevel)) {
        issues.push({ type: "weak_source_as_fact", line: 1, message: "正式 / 前台商业信号不得把 C / D / M 来源作为公司事实主证据" });
      }
      if (Number.isFinite(importanceScore) && importanceScore < 4) {
        issues.push({ type: "low_importance_score", line: 1, message: "正式 / 前台商业信号要求 importance_score>=4" });
      }
      if (weakEvidencePattern.test(`${primaryRaw}\n${sourceEvidence}`)) {
        issues.push({ type: "weak_evidence_source", line: 1, message: "正式 / 前台商业信号不得使用 failed provider text、index-only AI HOT、目录页或社区观点作为事实证据" });
      }
    }
  }

  if (generatedCopy && (hasEllipsis(generatedCopy) || containsLongEnglishFragment(generatedCopy))) {
    issues.push({ type: "bad_frontend_copy", line: 1, message: "前台 / 生成文案出现半截句、省略号或长段英文直出" });
  }

  if (type === "opinion_card") {
    if (!hasOpinionTranslation(fm, copy) || !hasFrontstageOpinionTranslation(fm, copy)) {
      issues.push({ type: "missing_original_translation", line: 1, message: "观点卡入库必须补充中文翻译；中文翻译不得用观澜解读替代" });
    }

    const opinionTier = fieldValue(fm, "opinion_tier");
    const displayLane = fieldValue(fm, "display_lane");
    const publishStatus = fieldValue(fm, "publish_status");
    const translationStatus = fieldValue(fm, "translation_status");
    if (!["feature", "sidebar"].includes(opinionTier)) {
      issues.push({ type: "invalid_opinion_tier", line: 1, message: "正式观点卡只能是 feature 或 sidebar；archive / discard 必须保留为 opinion_intake 或隐藏归档" });
    }
    if (!["daily_feature", "signal_sidebar"].includes(displayLane)) {
      issues.push({ type: "invalid_display_lane", line: 1, message: "正式观点卡 display_lane 只能是 daily_feature 或 signal_sidebar" });
    }
    if (!["frontstage_feature", "frontstage_sidebar"].includes(publishStatus)) {
      issues.push({ type: "invalid_publish_status", line: 1, message: "正式观点卡 publish_status 只能是 frontstage_feature 或 frontstage_sidebar" });
    }
    if ((opinionTier === "feature" && displayLane !== "daily_feature") || (opinionTier === "sidebar" && displayLane !== "signal_sidebar")) {
      issues.push({ type: "opinion_lane_mismatch", line: 1, message: "观点评级和前台位置不一致：feature 只能进 daily_feature，sidebar 只能进 signal_sidebar" });
    }
    if (translationStatus === "pending_translation") {
      issues.push({ type: "opinion_translation_pending", line: 1, message: "translation_status 为 pending_translation 的观点不得成为正式 opinion_card 或进入前台" });
    }

    const factSupport = fm.match(/^fact_claim_support:\s*([\s\S]*?)(?=^\S|$)/mu)?.[1] || "";
    const factRequired = /required:\s*true/u.test(factSupport);
    const supportStatus = factSupport.match(/status:\s*(.+)$/mu)?.[1]?.trim() || "";
    if (opinionFactPattern.test(copyForStyle) && factRequired && !/(supported|passed|已补证|S\/A\/B)/iu.test(supportStatus)) {
      issues.push({ type: "opinion_as_fact", line: 1, message: "观点卡包含事实主张，但 fact_claim_support 未显示已补 S/A/B 来源" });
    }

    if (isReleasedAsset(fm)) {
      const opinionCapture = sectionBlock(fm, "opinion_capture");
      for (const field of ["source_url", "capture_scope"]) {
        if (!fieldValueAnyIndent(opinionCapture, field)) {
          issues.push({ type: "missing_opinion_capture", line: 1, message: `正式 / 前台观点卡缺少观点捕获字段：${field}` });
        }
      }
      const frontend = sectionBlock(fm, "frontend");
      const sourceUrl = fieldValueAnyIndent(opinionCapture, "source_url") || fieldValue(fm, "source_url");
      const captureScope = fieldValueAnyIndent(opinionCapture, "capture_scope") || fieldValue(fm, "capture_scope");
      const originalQuote = fieldValueAnyIndent(frontend, "originalQuote");
      const originalTranslation = fieldValueAnyIndent(frontend, "originalTranslation");
      if (isXSourceUrl(sourceUrl)) {
        if (captureScope !== "x_full_visible_text") {
          issues.push({ type: "x_full_text_scope_missing", line: 1, message: "X / Twitter 来源观点必须标记 capture_scope=x_full_visible_text" });
        }
        if (!originalQuote || /见正文|正文原文|original excerpt only|placeholder/iu.test(originalQuote)) {
          issues.push({ type: "x_full_text_missing", line: 1, message: "X / Twitter 来源观点必须在前台字段保留当时可见全文，不能使用占位摘录" });
        }
      }
      if (isXSourceUrl(sourceUrl) && !hasCompleteXTranslation(originalQuote, originalTranslation)) {
        issues.push({ type: "x_full_translation_incomplete", line: 1, message: "X / Twitter long opinions must keep a complete Chinese translation before frontstage sync." });
      }
      if (!fieldValueAnyIndent(frontend, "originalQuote") && !/原文摘录/u.test(copy)) {
        issues.push({ type: "missing_original_quote", line: 1, message: "正式 / 前台观点卡必须保留原文摘录或 originalQuote" });
      }
      if (!fieldValueAnyIndent(frontend, "originalTranslation")) {
        issues.push({ type: "missing_original_translation", line: 1, message: "正式 / 前台观点卡必须补充 originalTranslation，中文翻译不得用观澜解读替代" });
      }
    }
  }

  if (type === "trend_card" && isReleasedAsset(fm)) {
    const changeCount = numberField(fm, "supporting_change_count");
    const caseCount = numberField(fm, "supporting_case_count");
    const sourceTypeCount = numberField(fm, "source_type_count");
    const thresholdPassed = fieldValue(fm, "trend_evidence_gate") === "threshold_passed";
    const hasTechnicalRoute = booleanFieldPassed(fm, "has_technical_route");
    const hasBoundary = booleanFieldPassed(fm, "has_risk_boundary")
      || booleanFieldPassed(fm, "has_follow_up_variables")
      || booleanFieldPassed(fm, "has_counter_evidence");
    if (thresholdPassed && (changeCount < 3 || caseCount < 2 || sourceTypeCount < 2 || !hasTechnicalRoute || !hasBoundary)) {
      issues.push({ type: "weak_trend_threshold", line: 1, message: "趋势判断门槛不足，不能由单条新闻、单个观点或少量案例硬凑正式趋势" });
    }
    if (thresholdPassed && unavailableEvidencePattern.test(copyForStyle)) {
      issues.push({ type: "trend_boundary_not_resolved", line: 1, message: "趋势候选仍含未解决证据缺口或降级状态，不得写为正式趋势" });
    }
  }

  if (type === "change_candidate" && isReleasedAsset(fm)) {
    issues.push({ type: "candidate_released", line: 1, message: "变化候选不得直接作为前台正式资产发布；成熟后应生成变化短专题" });
  }

  if (type === "scene_candidate" && isReleasedAsset(fm)) {
    issues.push({ type: "candidate_released", line: 1, message: "场景候选不得直接作为前台正式资产发布；成熟后应支撑相关场景或热力图节点" });
  }

  if (type === "trend_candidate" && isReleasedAsset(fm)) {
    issues.push({ type: "candidate_released", line: 1, message: "趋势候选不得直接作为前台正式资产发布；成熟后应进入趋势追踪、热力图或内参" });
  }

  return { file, type, title, issues };
};

const files = [...new Set(targets.flatMap(listFiles))].sort();
const results = files.map(scanFile);
const failed = results.filter((result) => result.issues.length);
const issueCount = failed.reduce((sum, result) => sum + result.issues.length, 0);
const status = strict && issueCount ? "failed" : "passed";

const detail = results.length
  ? results
      .map((result) => {
        const header = `### ${rel(result.file)}\n\n- 类型：${result.type}\n- 标题：${result.title || "missing"}\n`;
        if (!result.issues.length) return `${header}- 状态：passed\n`;
        return `${header}- 状态：failed\n${result.issues.map((issue) => `- L${issue.line}：${issue.message}`).join("\n")}\n`;
      })
      .join("\n")
  : "未发现当日卡片文件。";

const report = `# Card Copy Style Gate Report

生成日期：${date}

## 结论

- 状态：${status}
- 检查文件：${results.length}
- 问题数量：${issueCount}
- 严格模式：${strict ? "on" : "off"}
- 要求四道门字段：${requireGateFields ? "on" : "off"}

## 检查范围

${targets.map((target) => `- \`${target}\``).join("\n")}

## 检查规则

- 标题必须完整，不得省略、截断或写成抽象判断。
- 前台文案不得出现内部生产词。
- 前台文案不得出现机械过渡词、空泛趋势词和概念堆砌。
- 卡片必须能看出事实底稿或观点底稿。
- require-gates=true 时，强制检查 fact_draft_gate、frontend_copy_gate、cardcopy_gate 字段；正式 / 前台资产必须为 passed。
- 生成文案会按卡片类型检查事件型标题、摘要重复、商业变量、观点事实边界和趋势门槛。
- Raw 原文、source quote、原始摘录、URL 和证据快照不按文风扣分。

## 明细

${detail}
`;

fs.mkdirSync(reportsDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
const datedPath = path.join(reportsDir, `card-copy-style-gate-${date}-${stamp}.md`);
const latestPath = path.join(reportsDir, "card-copy-style-gate-latest.md");
fs.writeFileSync(datedPath, report, "utf8");
fs.writeFileSync(latestPath, report, "utf8");

console.log(report);
console.log(`Report: ${rel(datedPath)}`);

if (status !== "passed") process.exitCode = 1;
