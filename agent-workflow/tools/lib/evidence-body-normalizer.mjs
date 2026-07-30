const BOILERPLATE_LINE = /^(?:(?:topics?|most popular|related articles?|view bio|register now|loading the next article|error loading|when you purchase through links|back to top|cookie settings?)\b|(?:相关文章|相关文档|相关阅读|相关推荐|软媒旗下网站|스크롤 이동|상태바|기사본문))/iu;

function clean(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
}

export function normalizeEvidenceBody(value) {
  const normalized = clean(value).replace(/\r\n?/gu, "\n");
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
