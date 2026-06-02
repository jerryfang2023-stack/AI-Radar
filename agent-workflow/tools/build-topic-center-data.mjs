import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const siteContentPath = path.join(siteDataDir, "site-content.json");
const topicCenterJsonPath = path.join(siteDataDir, "topic-center.json");
const topicCenterJsPath = path.join(siteDataDir, "topic-center.js");

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return value ? [value] : [];
}

function hostFromUrl(url) {
  try {
    return new URL(url).host.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function slug(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 48) || "topic";
}

function scoreGrade(score) {
  if (score >= 92) return "S";
  if (score >= 86) return "A";
  if (score >= 78) return "B";
  return "C";
}

function priorityLabel(score) {
  if (score >= 90) return "S级选题";
  if (score >= 84) return "优先观察";
  return "候选";
}

function normalizeSignal(signal, index, content) {
  const sourceUrl = text(signal.sourceUrl || signal.url || signal.link);
  const host = hostFromUrl(sourceUrl);
  const title = text(signal.frontend?.displayTitle || signal.editorialTitle || signal.title || signal.sourceTitle || `候选信号 ${index + 1}`);
  return {
    raw: signal,
    baseId: text(signal.id || signal.slug || slug(title)),
    title,
    type: text(signal.signalType || signal.type || signal.contentType || "signal").replaceAll("_", "-"),
    audience: text(signal.audience || "企业决策者 / 业务负责人 / AI 产品与运营负责人"),
    core: text(signal.judgment || signal.frontend?.whyWatch || signal.event || signal.brief || signal.summary),
    relevance: text(signal.businessMeaning || signal.frontend?.businessMeaning || signal.brief || signal.summary),
    evidence: text(signal.frontend?.evidenceNote || signal.counter || signal.sourceTitle || signal.sources || host),
    source: host || text(signal.sourceTitle || signal.sources || "content asset"),
    url: sourceUrl,
    date: text(signal.date || content.meta?.date),
    score: 91 - Math.min(index, 7),
  };
}

function baseItems(content) {
  const items = [];
  if (content.daily?.title) {
    items.push({
      raw: content.daily,
      baseId: text(content.daily.id || "daily-observation"),
      title: text(content.daily.title),
      type: "daily",
      audience: "企业老板 / 业务负责人",
      core: text(content.daily.judgment || content.daily.dek || content.daily.summary),
      relevance: text(content.daily.homeSummary || content.daily.summary || content.daily.dek),
      evidence: text(content.daily.dek || content.daily.issue),
      source: "今日观察",
      url: text(content.daily.link),
      date: text(content.meta?.date),
      score: 96,
    });
  }

  list(content.signals).forEach((signal, index) => items.push(normalizeSignal(signal, index, content)));

  if (content.trendReport?.title) {
    items.push({
      raw: content.trendReport,
      baseId: text(content.trendReport.id || "trend-report"),
      title: text(content.trendReport.title),
      type: "trend",
      audience: "行业操盘手 / 投资与战略负责人",
      core: text(content.trendReport.oneLine || content.trendReport.summary),
      relevance: text(content.trendReport.stage || content.trendReport.summary),
      evidence: list(content.trendReport.evidenceGaps).join("；"),
      source: "趋势追踪",
      url: text(content.trendReport.link),
      date: text(content.trendReport.updated || content.meta?.date),
      score: 89,
    });
  }

  if (content.brief?.title) {
    items.push({
      raw: content.brief,
      baseId: text(content.brief.id || "brief"),
      title: text(content.brief.title),
      type: "brief",
      audience: "资源型合伙人 / 企业经营者",
      core: text(content.brief.subhead || content.brief.summary),
      relevance: text(content.brief.summary || content.brief.subhead),
      evidence: list(content.brief.evidence).join("；"),
      source: "商业内参",
      url: text(content.brief.link),
      date: text(content.brief.period || content.meta?.date),
      score: 88,
    });
  }

  const seen = new Set();
  return items
    .filter((item) => item.title && !seen.has(item.title) && seen.add(item.title))
    .sort((a, b) => b.score - a.score);
}

function sourceDefinitions() {
  return [
    { id: "raw_pool_pitch", title: "Raw-Pool-Pitch", desc: "每日 Raw / Pool / Card 产物" },
    { id: "industry_chain", title: "产业链分析", desc: "产业节点与资产结构" },
    { id: "builders", title: "Builders 文章", desc: "开发者与产品实践" },
    { id: "viral_rewrite", title: "爆款改编", desc: "AI 热点内容与传播结构" },
  ];
}

function candidatesForSource(sourceId, items) {
  if (sourceId === "builders") {
    const builderItems = items.filter((item) => /github|docs|developer|api|sdk|release|builder|openai|anthropic|nvidia/iu.test(`${item.source} ${item.url} ${item.title}`));
    return builderItems.length ? builderItems : items;
  }
  if (sourceId === "industry_chain") {
    const chainItems = items.filter((item) => /product|service|case|funding|trend|infra|workflow|market|signal/iu.test(item.type));
    return chainItems.length ? chainItems : items;
  }
  return items;
}

function angleSet(sourceId, item) {
  const actor = item.title.split(/[，,：:｜|]/u)[0].slice(0, 30) || item.title.slice(0, 30);
  const evidence = item.evidence || "需要补一条官方发布、客户案例或开发者文档作为证据边界。";
  const relevance = item.relevance || item.core || "它可能改变企业预算、流程、供应商选择或责任边界。";

  if (sourceId === "industry_chain") {
    return [
      { title: `从 ${actor} 看 AI 预算流向哪段产业链`, note: `先写事件，再判断钱会落在算力、工具、集成、渠道还是客户现场。证据边界：${evidence}` },
      { title: `${actor} 会先影响谁的采购单`, note: "把读者带到一个具体买方岗位：CIO、工厂负责人、客服负责人、销售运营负责人或安全负责人。" },
      { title: "这不是技术升级，而是责任边界重画", note: `写清系统出错时谁负责、谁复核、谁买单。商业落点：${relevance}` },
    ];
  }

  if (sourceId === "builders") {
    return [
      { title: `${actor} 背后的开发者真实需求`, note: "不写工具测评，写开发者为什么愿意换流程、接插件、改团队协作方式。" },
      { title: "从演示走向日常工作，差的是哪一步", note: "拆一个真实任务链：需求进入、生成、测试、审阅、上线，只抓最容易卡住的一步。" },
      { title: "企业读者该看哪些采用信号", note: "看文档更新频率、GitHub issue、客户引用、招聘岗位和生态插件，不看口号。" },
    ];
  }

  if (sourceId === "viral_rewrite") {
    return [
      { title: `${actor} 为什么会刺中企业焦虑`, note: "找一个明确情绪钩子：岗位替代、预算失控、客户流失、安全责任或老板看不懂投入产出。" },
      { title: "把热门话题改写成一个商业冲突", note: "标题必须回答谁的利益被改变，例如供应商拿走预算、员工失去入口、平台获得控制权。" },
      { title: "爆款改编前必须补哪条事实", note: `先补一条可验证来源，再写观点。当前可用证据边界：${evidence}` },
    ];
  }

  return [
    { title: `${actor} 改变的是哪一类企业决策`, note: `从老板是否加预算、换供应商、调岗位或重做流程写起。商业落点：${relevance}` },
    { title: "这件事为什么不是普通新闻", note: `找一个可验证动作，例如官方发布、客户采用、融资金额、采购入口或产品上线。当前证据：${evidence}` },
    { title: "可以写成哪种文章标题", note: `标题例：《${actor} 把 AI 带进真实流程，企业该看成本还是责任》《${actor} 背后，AI 采购正在从工具账变成流程账》` },
  ];
}

function buildTopics(content, date) {
  const items = baseItems(content);
  const sources = sourceDefinitions();
  const topics = sources.flatMap((source, sourceIndex) => {
    const candidates = candidatesForSource(source.id, items);
    const filled = Array.from({ length: 5 }, (_, index) => candidates[index % Math.max(candidates.length, 1)]).filter(Boolean);

    return filled.map((item, index) => {
      const score = Math.max(72, Math.min(99, item.score - sourceIndex * 3 - index));
      return {
        id: `${source.id}-${slug(item.baseId || item.title)}-${index + 1}`,
        sourceId: source.id,
        sourceName: source.title,
        sourceDesc: source.desc,
        baseId: item.baseId,
        title: item.title,
        type: item.type,
        audience: item.audience,
        core: item.core,
        relevance: item.relevance,
        evidence: item.evidence,
        source: item.source,
        url: item.url,
        date: item.date || date,
        score,
        grade: scoreGrade(score),
        priority: priorityLabel(score),
        angles: angleSet(source.id, item),
      };
    });
  });

  return { sources, topics };
}

function main() {
  const siteContent = readJson(siteContentPath, {});
  const date = argValue("date", text(siteContent.meta?.date).replaceAll(".", "-") || new Date().toISOString().slice(0, 10));
  const { sources, topics } = buildTopics(siteContent, date);
  const data = {
    meta: {
      version: "V1.1",
      date,
      generatedAt: new Date().toISOString(),
      source: "site-content.json",
      rule: "four_sources_five_topics_each",
    },
    sources,
    topics,
  };

  writeJson(topicCenterJsonPath, data);
  fs.writeFileSync(topicCenterJsPath, `window.WaveSightTopicCenter = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  console.log(`topic-center generated: ${topics.length} topics -> ${path.relative(root, topicCenterJsonPath)}`);
}

main();
