function text(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

function englishConnectorCount(value = "") {
  return (String(value || "").match(/\b(?:the|and|to|for|with|from|into|across|after|before|as|at|by|were|was|are|is|its|this|that|new)\b/giu) || []).length;
}

export function buildEventDisplayTitle({ rawDocument = null } = {}) {
  const originalTitle = text(rawDocument?.title_original);
  const translatedTitle = text(rawDocument?.title_zh);
  const sourceBackedTitle = translatedTitle || (containsChinese(originalTitle) ? originalTitle : "");
  return isCompletePublicEventTitle(sourceBackedTitle) ? sourceBackedTitle : "";
}

export function isCompletePublicEventTitle(value = "") {
  const title = text(value);
  return title.length >= 6
    && containsChinese(title)
    && englishConnectorCount(title) < 2
    && !/(?:…|\.\.\.|&(?:#\d+|[a-z]+);)/iu.test(title)
    && !/[|]|\b(?:Newsroom|Company Announcement)\b/iu.test(title)
    && !/\bformer\s+hardware\s+VP\b/iu.test(title)
    && !/(?:\b[A-Za-z][A-Za-z’'-]*\b[\s,:-]*){5,}/u.test(title)
    && !/^(?:exclusive|breaking):/iu.test(title)
    && !/发布\s+(?:for|with|to|that|new|its)\b/iu.test(title)
    && !/：\s*[a-z]{2,}\b/u.test(title)
    && !/(?:发生并购|完成融资|发布产品|完成部署|发生事件)$/u.test(title)
    && !/发生事件/u.test(title)
    && !/undisclosed|未披露主体/iu.test(title);
}
