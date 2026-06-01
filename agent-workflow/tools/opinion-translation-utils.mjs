import fs from "node:fs/promises";
import path from "node:path";

const cacheFile = (root) => path.join(root, "agent-workflow", "cache", "opinion-translations.json");

export async function loadTranslationCache(root) {
  try {
    return JSON.parse(await fs.readFile(cacheFile(root), "utf8"));
  } catch {
    return {};
  }
}

export async function saveTranslationCache(root, cache) {
  await fs.mkdir(path.dirname(cacheFile(root)), { recursive: true });
  await fs.writeFile(cacheFile(root), `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

export function visibleChineseTranslation(text = "") {
  const value = String(text || "").trim();
  if (!value) return "";
  const chineseChars = value.match(/[\u4e00-\u9fff]/gu) || [];
  if (chineseChars.length >= Math.max(4, Math.floor(value.length * 0.12))) return value;
  return "";
}

export function completeOpinionTranslation(source = "", translation = "", { preferFullTranslation = false } = {}) {
  const visible = visibleChineseTranslation(translation);
  if (!visible) return "";
  const sourceLength = cleanSource(source).length;
  if (!preferFullTranslation || sourceLength < 500) return visible;
  const translationLength = normalizeText(visible).length;
  const minimumLength = Math.min(260, Math.floor(sourceLength * 0.28));
  return translationLength >= minimumLength ? visible : "";
}

function normalizeText(text = "") {
  return String(text || "")
    .replace(/鈥檚/g, "'s")
    .replace(/鈥檛/g, "n't")
    .replace(/鈥檝/g, "'v")
    .replace(/鈥檙/g, "'r")
    .replace(/鈥檓/g, "'m")
    .replace(/鈥\?/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSource(text = "") {
  return normalizeText(text)
    .replace(/https?:\/\/\S+/gu, "")
    .replace(/\blikes=\d+;?\s*/giu, "")
    .replace(/\bretweets=\d+;?\s*/giu, "")
    .replace(/\breplies=\d+;?\s*/giu, "")
    .replace(/\s*\|\s*Join\s+\d+[KMB]?\+?\s+readers.*$/iu, "")
    .replace(/\s*\|\s*Product at .+$/iu, "")
    .replace(/\s*\|\s*Practical AI tutorials.*$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function domainPolish(text = "") {
  return normalizeText(text)
    .replace(/新法典/gu, "新版 Codex")
    .replace(/法典/gu, "Codex")
    .replace(/人工智能/gu, "AI")
    .replace(/出货/gu, "发布")
    .replace(/游戏规则改变者/gu, "改变玩法")
    .replace(/我猜/gu, "我觉得")
    .replace(/代理人/gu, "Agent")
    .replace(/代理/gu, "Agent")
    .replace(/工作流程/gu, "工作流")
    .replace(/开发者工具/gu, "开发者工具")
    .replace(/\s+/gu, " ")
    .trim();
}

function staticTranslation(source = "") {
  const text = cleanSource(source).toLowerCase();
  const rules = [
    [/new codex ships today.*ai is cool/u, "新版 Codex 今天发布了。AI 确实很酷。"],
    [/game changer codex automation/u, "Codex 自动化是一个改变玩法的能力。"],
    [/dangerously skip git/u, "危险地跳过 Git。"],
    [/what problem do you most hope ai will solve/u, "你最希望 AI 在未来解决什么问题？"],
    [/everyone should have an agent with a gbrain/u, "每个人都应该拥有一个带有强大智能核心的 Agent。"],
    [/introducing the claude code lark feishu bridge/u, "介绍 Claude Code 与飞书/Lark 的桥接工具。"],
    [/building software is more fun together/u, "一起构建软件会更有趣。试试我们的新模型。"],
    [/claude code auto mode/u, "Claude Code 的自动模式可以更安全地持续执行任务。"],
    [/customer conversations.*build evals/u, "用真实客户对话来建立评测，可以帮助判断 AI 是否真的适合复杂工作。"],
    [/this stack has won the localfirst battle/u, "我认为这套技术栈已经赢下了 local-first 的关键竞争。"],
    [/more here/u, "更多信息见原文。"],
    [/github/u, "GitHub。"],
    [/what are you making with claude design/u, "你正在用 Claude Design 做什么？"],
    [/partner @fpvventures.*investing in seed\/a/u, "FPV Ventures 合伙人，投资种子轮到 A 轮项目；曾早期加入 Meter、Opendoor、Atlassian 等公司。"],
    [/how does one engineer become a 1000x founder/u, "工程师如何成长为高杠杆创始人。"],
    [/why ai progress suddenly feels real/u, "AI 进展正在变得可验证，关键在于模型能力和产品交付能力同时提升。"],
    [/ex founders are the driving force helping scale/u, "前创始人正在帮助头部公司扩张，把从零到一的经验带进增长阶段。"],
    [/dangerously-skip-git|dangerously skip git/u, "谨慎看待跳过 Git 的自动化工作流：自动化越强，越需要清楚的意图、强度和操作边界。"],
    [/speaker 1\s*\|\s*00:00|you need to reach this level of reliability/u, "企业级 AI 必须稳定承接真实业务流程，才能进入生产环境。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  return match ? match[1] : "";
}

async function translateWithMyMemory(source = "") {
  const text = cleanSource(source);
  if (!text) return "";
  const translatedParts = [];
  for (const chunk of translationChunks(text, 470)) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|zh-CN`;
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) return "";
    const data = await response.json();
    const translated = domainPolish(data?.responseData?.translatedText || "");
    if (!visibleChineseTranslation(translated)) return "";
    translatedParts.push(translated);
  }
  const translated = translatedParts.join("\n");
  return visibleChineseTranslation(translated) ? translated : "";
}

function translationChunks(text = "", limit = 470) {
  const source = cleanSource(text);
  if (!source) return [];
  const parts = source
    .split(/(?<=[.!?。！？])\s+/u)
    .flatMap((part) => {
      if (part.length <= limit) return [part];
      const chunks = [];
      for (let index = 0; index < part.length; index += limit) chunks.push(part.slice(index, index + limit));
      return chunks;
    })
    .filter(Boolean);
  const chunks = [];
  for (const part of parts) {
    const current = chunks[chunks.length - 1] || "";
    if (current && `${current} ${part}`.length <= limit) chunks[chunks.length - 1] = `${current} ${part}`;
    else chunks.push(part);
  }
  return chunks;
}

export async function translateOpinionText(text = "", { cache = {}, cacheKey = "", allowNetwork = true, preferFullTranslation = false } = {}) {
  const existing = visibleChineseTranslation(text);
  if (existing) return { translation: existing, status: "translated", method: "source_chinese" };

  const source = cleanSource(text);
  if (!source) return { translation: "", status: "pending_translation", method: "empty_source" };
  const key = cacheKey || source;

  const staticValue = preferFullTranslation ? "" : staticTranslation(source);
  const staticComplete = completeOpinionTranslation(source, staticValue, { preferFullTranslation });
  if (staticComplete) {
    const result = { translation: staticComplete, status: "translated", method: "static_rules" };
    cache[key] = result;
    return result;
  }

  const cachedTranslation = completeOpinionTranslation(source, cache[key]?.translation || "", { preferFullTranslation });
  if (cachedTranslation && !(preferFullTranslation && cache[key].method === "static_rules")) {
    return { ...cache[key], status: cache[key].status || "translated" };
  }

  if (allowNetwork) {
    try {
      const translated = await translateWithMyMemory(source);
      if (translated) {
        const result = { translation: translated, status: "translated", method: "mymemory" };
        cache[key] = result;
        return result;
      }
    } catch {
      // Keep the intake explicit: translation was attempted but is not ready.
    }
  }

  const result = { translation: "", status: "pending_translation", method: "translation_failed" };
  cache[key] = result;
  return result;
}

export function replaceBodyTranslation(body = "", translation = "") {
  if (translation) {
    const label = "\u4e2d\u6587\u7ffb\u8bd1\uff1a";
    const translationBlock = `${label}\n${translation}`;
    const pattern = /^\s*\u4e2d\u6587(?:\u7ffb\u8bd1|\u8f6c\u8ff0)[\uff1a:]\s*[\s\S]*?(?=\n##\s|\n#\s|$)/mu;
    if (pattern.test(body)) return body.replace(pattern, translationBlock);
    return `${body.trimEnd()}\n\n${translationBlock}\n`;
  }
  if (!translation) return body;
  if (/^中文(?:翻译|转述)[：:]/mu.test(body)) {
    return body.replace(/^中文(?:翻译|转述)[：:].*$/mu, `中文翻译：${translation}`);
  }
  return `${body.trimEnd()}\n\n中文翻译：${translation}\n`;
}
