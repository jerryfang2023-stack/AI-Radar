/**
 * Fetch builder blog RSS feeds from source-registry-v2.json
 * Outputs a JSON structure compatible with build-follow-builders-page-data.mjs
 *
 * Usage:
 *   node agent-workflow/tools/fetch-builder-blog-feed.mjs [--date=YYYY-MM-DD]
 *
 * Output format mirrors feed-x.json for compatibility:
 *   { blogs: [{ name, handle, bio, tweets: [{ id, text, createdAt, url }] }] }
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "01-SiteV2", "content", "11-databases", "source-registry-v2.json");
const dateArg = process.argv.find(a => a.startsWith("--date="));
const targetDate = dateArg ? dateArg.split("=")[1] : new Date().toISOString().slice(0, 10);
const lookbackHours = 168;

const reg = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const builderBlogIds = [
  "simon-willison-blog", "lilian-weng-blog", "interconnects-blog",
  "eugene-yan-blog", "benedict-evans-blog", "stephen-wolfram-writings",
  "bens-bites-newsletter", "tldr-ai-newsletter", "import-ai-newsletter",
  "the-batch-newsletter", "sebastian-raschka-blog",
  "tigera-blog", "dataiku-blog"
];

const sources = reg.sources.filter(s => builderBlogIds.includes(s.source_id) && s.interface_type === "rss");

function extractXmlField(xml, tag) {
  const re = new RegExp("<" + tag + "(?:\\s[^>]*)?>(.*?)<\\/" + tag + ">", "is");
  const match = xml.match(re);
  if (!match) return "";
  return match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
}

function decodeText(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replace(/\s+$/g, "")
    .trim();
}

function isRecent(published, hours) {
  if (!published) return false;
  const d = new Date(published);
  if (!Number.isFinite(d.getTime())) return false;
  return (Date.now() - d.getTime()) < hours * 60 * 60 * 1000;
}

function topicForText(text) {
  const value = text.toLowerCase();
  if (/agent|agents|mcp|tool use|orchestration|sandbox|composer/.test(value)) return "Agent";
  if (/code|coding|developer|software|cursor|replit|devtool|framework|sdk|api/.test(value)) return "AI 编程";
  if (/inference|compute|gpu|nvidia|model|training|fine.?tune|open.?source|llama/.test(value)) return "AI 基础设施";
  if (/startup|founder|vc|arr|customer|saas|product|funding|seed|series/.test(value)) return "产品与创业";
  if (/llm|gpt|claude|gemini|reasoning|prompt|context|eval/.test(value)) return "AI 技术与研究";
  return "Builder 观点";
}

async function main() {
  const blogs = [];
  const errors = [];

  for (const src of sources) {
    const url = src.endpoint_or_url || "";
    if (!url) continue;

    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) {
        errors.push(src.source_id + ": HTTP " + resp.status);
        continue;
      }
      const xml = await resp.text();
      if (!xml || xml.length < 50) {
        errors.push(src.source_id + ": empty");
        continue;
      }

      const isAtom = /<feed[\s>]/i.test(xml);
      let items = [];

      if (isAtom) {
        const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
        for (const entryXml of entries) {
          try {
            const title = decodeText(extractXmlField(entryXml, "title"));
            const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
            const link = linkMatch ? linkMatch[1] : "";
            const published = extractXmlField(entryXml, "published") || extractXmlField(entryXml, "updated");
            const summary = decodeText(extractXmlField(entryXml, "summary") || extractXmlField(entryXml, "content"));
            if (!link && !title) continue;
            if (!isRecent(published, lookbackHours)) continue;
            items.push({
              id: link || title,
              text: title,
              summary: summary.slice(0, 300),
              createdAt: published,
              url: link,
              likes: 0, retweets: 0, replies: 0,
            });
          } catch (e) { /* skip */ }
        }
      } else {
        const itemXmlList = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
        for (const itemXml of itemXmlList) {
          try {
            const title = decodeText(extractXmlField(itemXml, "title"));
            const link = decodeText(extractXmlField(itemXml, "link"));
            const pubDate = extractXmlField(itemXml, "pubDate") || extractXmlField(itemXml, "dc:date");
            const description = decodeText(extractXmlField(itemXml, "description"));
            if (!link && !title) continue;
            if (!isRecent(pubDate, lookbackHours)) continue;
            items.push({
              id: link || title,
              text: title,
              summary: description.replace(/<[^>]+>/g, "").slice(0, 300),
              createdAt: pubDate,
              url: link,
              likes: 0, retweets: 0, replies: 0,
            });
          } catch (e) { /* skip */ }
        }
      }

      if (items.length > 0) {
        const host = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        blogs.push({
          name: src.name,
          handle: host.replace(/^www\./, ""),
          bio: src.query_scope || "",
          tweets: items,
        });
      }
    } catch (error) {
      errors.push(src.source_id + ": " + error.message.substring(0, 60));
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    stats: {
      blogsBuilt: blogs.length,
      totalItems: blogs.reduce((s, b) => s + b.tweets.length, 0),
      sourceCount: sources.length,
      errors,
    },
    blogs,
  };

  const outPath = path.join(root, "01-SiteV2", "content", "11-databases", "builder-blog-feed.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(JSON.stringify({
    status: "ok",
    date: targetDate,
    blogs_built: output.stats.blogsBuilt,
    total_items: output.stats.totalItems,
    sources_checked: output.stats.sourceCount,
    errors: output.stats.errors.length,
    output: path.relative(root, outPath),
  }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
