const PRODUCT_EVENT_TYPES = new Set([
  "model_release",
  "product_release",
  "service_change",
  "pricing_change",
  "hardware_product",
  "research_result"
]);

const GENERIC_WORDS = new Set([
  "ai", "api", "new", "model", "models", "platform", "service", "services",
  "product", "app", "application", "tool", "system", "feature", "agent", "voice",
  "video", "image", "coding", "enterprise", "developer", "edition", "record", "github",
  "cto", "ceo", "founder", "launch"
]);

const PRODUCT_KIND = "models?|platform|services?|products?|apps?|applications?|tools?|systems?|features?|agents?|computer|device|hardware";

function normalize(value = "") {
  return String(value).replace(/\s+/gu, " ").trim();
}

function looksBranded(value = "") {
  if (/\p{Script=Han}/u.test(value)) return value.length <= 30;
  const tokens = value.split(/\s+/u).filter(Boolean);
  if (!tokens.length || tokens.length > 6) return false;
  if (!/^(?:[A-Z][A-Za-z0-9+_.-]*|[A-Za-z0-9+_.-]*[A-Z][A-Za-z0-9+_.-]*)$/u.test(tokens[0])) return false;
  return tokens.some((token) => !GENERIC_WORDS.has(token.toLocaleLowerCase()));
}

function cleanCandidate(value = "") {
  const candidate = normalize(value)
    .replace(/^["'“”‘’《》]+|["'“”‘’《》]+$/gu, "")
    .replace(/^(?:the|a|an|its|their|new|updated|open-source)\s+/iu, "")
    .replace(new RegExp(`\\s+(?:${PRODUCT_KIND})$`, "iu"), "")
    .trim();
  if (candidate.length < 2 || candidate.length > 80 || !looksBranded(candidate)) return "";
  if (GENERIC_WORDS.has(candidate.toLocaleLowerCase())) return "";
  if (/^AI[- ]powered\b|^(?:AI Social|AI Public Launch)$/iu.test(candidate)) return "";
  if (/Social Platform for|^Every Team$/iu.test(candidate)) return "";
  if (/\b(?:CTO|CEO|founder)$/iu.test(candidate)) return "";
  if (/^(?:开箱即用)$/u.test(candidate)) return "";
  if (/^(?:AI|artificial intelligence|人工智能|大模型|模型|平台|服务|产品|应用|工具|系统|功能)$/iu.test(candidate)) return "";
  return candidate;
}

function captureNames(value = "") {
  const text = normalize(value);
  if (!text) return [];
  const captures = [];
  const englishAction = new RegExp(
    `\\b(?:announces?|announced|releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|adds?|added|open[- ]sources?|updates?|updated|expands?|expanded|rolls? out)\\s+(?:the\\s+|a\\s+|an\\s+|new\\s+|its\\s+)?([A-Za-z0-9][A-Za-z0-9+_.-]*(?:\\s+(?:[A-Za-z0-9][A-Za-z0-9+_.-]*|for)){0,5}?)(?=\\s+(?:${PRODUCT_KIND}|for|with|to|that|which)\\b|[,;:]|$)`,
    "giu"
  );
  for (const pattern of [englishAction]) {
    for (const match of text.matchAll(pattern)) captures.push(match[1]);
  }
  for (const match of text.matchAll(/(?:发布|推出|上线|新增|开源|升级)(?:了|其|全新|新一代|一款|首个)?\s*[“《]([^”》]{2,30})[”》]/gu)) {
    captures.push(match[1]);
  }
  for (const match of text.matchAll(/(?:发布|推出|上线|新增|开源|升级)(?:了|其|全新|新一代|一款|首个)?\s*([A-Z][A-Za-z0-9+_.-]*(?:\s+(?:[A-Z][A-Za-z0-9+_.-]*|\d+(?:\.\d+)*)){0,4})/gu)) {
    captures.push(match[1]);
  }
  return captures;
}

function captureBrandedObjectNames(value = "") {
  const text = normalize(value);
  const head = text.split(/[,，:：;；]/u)[0];
  const captures = [];
  const patterns = [
    /\b(?:[A-Z][a-z0-9]+[A-Z][A-Za-z0-9+_.-]*|[A-Z][A-Za-z0-9]*(?:[-.][A-Za-z0-9]+)+)(?:\s+(?:[A-Z][A-Za-z0-9+_.-]*|\d+(?:\.\d+)*)){0,3}\b/gu,
    /\b[A-Z]{2,}(?:\s+[A-Z][A-Za-z0-9+_.-]*){1,3}(?:\s+\d+(?:\.\d+)*)?\b/gu,
    /\b[A-Z][a-z]+\s+[A-Z][A-Za-z0-9+_.-]*\d[A-Za-z0-9+_.-]*\b/gu,
    /\b(?:\d+[A-Za-z][A-Za-z0-9+_.-]*|[A-Z][A-Za-z0-9+_.-]*)(?:\s+(?:for|[A-Z][A-Za-z0-9+_.-]*|v?\d+(?:\.\d+)*)){1,3}\b/gu
  ];
  for (const pattern of patterns) {
    for (const match of head.matchAll(pattern)) captures.push(match[0]);
  }
  for (const match of head.matchAll(/\b([A-Z][A-Za-z0-9+_.-]*)\b.{0,12}(?:模型|model)\s+([A-Z][A-Za-z0-9+_.-]*\d[A-Za-z0-9+_.-]*)/giu)) {
    captures.push(`${match[1]} ${match[2]}`);
  }
  return captures;
}

export function extractExplicitProductNames({ eventType = "", object = "", title = "", evidenceTexts = [], organizationNames = [] } = {}) {
  if (!PRODUCT_EVENT_TYPES.has(eventType)) return [];
  const organizationSet = new Set(organizationNames.map((name) => normalize(name).toLocaleLowerCase()).filter(Boolean));
  const evidence = [object, title, ...evidenceTexts].join("\n");
  const preservedBrandNames = [
    ["1Password for Claude", /\b1Password for Claude\b/iu],
    ["LM Studio Bionic", /\bLM Studio Bionic\b/iu]
  ].filter(([, pattern]) => pattern.test(evidence)).map(([name]) => name);
  const preservedBrandKeys = new Set(preservedBrandNames.map((name) => name.toLocaleLowerCase()));
  const candidates = [
    ...preservedBrandNames,
    ...captureBrandedObjectNames(object),
    ...captureBrandedObjectNames(title),
    ...captureNames(object),
    ...captureNames(title),
    ...evidenceTexts.flatMap(captureNames)
  ];

  const seen = new Set();
  return candidates.map(cleanCandidate).map((name) => {
    if (preservedBrandKeys.has(name.toLocaleLowerCase())) return name;
    const owner = organizationNames.find((organization) => name.toLocaleLowerCase().startsWith(`${normalize(organization).toLocaleLowerCase()} `));
    return owner ? cleanCandidate(name.slice(normalize(owner).length)) : name;
  }).filter((name) => {
    const key = name.toLocaleLowerCase();
    if (!name || organizationSet.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

export function productEntityDisplayType(eventType = "") {
  if (eventType === "model_release") return "模型";
  if (eventType === "hardware_product") return "AI 硬件";
  return "产品/服务";
}
