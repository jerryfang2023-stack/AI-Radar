// Publisher-owned article containers; do not select the longest page/sidebar.
export function balancedElement(html, start) {
  const opening = html.slice(start).match(/^<([a-z][\w-]*)\b[^>]*>/iu);
  if (!opening) return "";
  const tag = opening[1];
  const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, "giu");
  tokens.lastIndex = start;
  let depth = 0;
  for (let match; (match = tokens.exec(html));) {
    depth += /^<\//u.test(match[0]) ? -1 : /\/>$/u.test(match[0]) ? 0 : 1;
    if (depth === 0) return html.slice(start, tokens.lastIndex);
  }
  return "";
}
export function chinaFundingArticleHtml(html, url) {
  let host; try { host = new URL(url).hostname; } catch { return null; }
  const selectors = host.endsWith("pedaily.cn") ? /<div\b[^>]*id="news-content"[^>]*>/iu
    : host.endsWith("chinaventure.com.cn") ? /<div\b[^>]*class="article_warpper_(?:pc|mobile)"[^>]*>/iu
      : host.endsWith("cls.cn") || host.endsWith("chinastarmarket.cn") ? /<div\b[^>]*class="[^"]*\bdetail-content\b[^"]*"[^>]*>/iu
        : host.endsWith("sina.com.cn") ? /<div\b[^>]*id="artibody"[^>]*>/iu : null;
  if (!selectors) return null;
  const match = String(html).match(selectors);
  if (!match) return null;
  const fragment = balancedElement(html, match.index);
  if (!fragment) return null;
  const header = host.endsWith("chinaventure.com.cn") ? fragment.slice(0, 3500) : html.slice(Math.max(0, match.index - 4500), match.index);
  const explicit = header.match(/<time\b[^>]*datetime="([^"]+)"/iu)?.[1]
    || header.match(/>\s*(20\d{2}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::\d{2})?(?:\s*星期[^<]*)?\s*</u)?.slice(1).join("T")
    || header.match(/class="date">(20\d{2})年(\d{2})月(\d{2})日\s+(\d{2}:\d{2})</u)?.slice(1).join("|").replace(/^(\d{4})\|(\d{2})\|(\d{2})\|/u, "$1-$2-$3T");
  const publishedAt = explicit && !Number.isNaN(Date.parse(explicit)) ? (/Z$|[+-]\d{2}:\d{2}$/u.test(explicit) ? explicit : `${explicit}:00+08:00`) : "";
  return { fragment, published_at: publishedAt, method: "china-publisher-article-container" };
}
