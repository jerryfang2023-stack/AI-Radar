/**
 * Fetch builder podcast RSS feeds for the follow-builders page.
 * Reads podcast sources from source-registry-v2.json and the follow-builders
 * default-sources.json, fetches RSS/Atom feeds, and outputs podcast episodes
 * in the format expected by build-follow-builders-page-data.mjs.
 *
 * Usage:
 *   node agent-workflow/tools/fetch-builder-podcast-feed.mjs [--date=YYYY-MM-DD]
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const root = process.cwd();
const registryPath = path.join(root, "01-SiteV2", "content", "11-databases", "source-registry-v2.json");
const reg = JSON.parse(fs.readFileSync(registryPath, "utf8"));

// Podcast source IDs from registry + follow-builders defaults
const podcastSourceIds = [
  "latent-space-podcast", "training-data-podcast", "no-priors-podcast",
  "unsupervised-learning-podcast", "mad-podcast", "ai-and-i-podcast",
];

let sources = reg.sources.filter(s => podcastSourceIds.includes(s.source_id));

// Also try reading follow-builders default-sources.json for fallback
const fbDefaultsPath = path.join(homedir(), ".skill-store", "follow-builders", "config", "default-sources.json");
if (fs.existsSync(fbDefaultsPath)) {
  try {
    const fbDefaults = JSON.parse(fs.readFileSync(fbDefaultsPath, "utf8"));
    for (const fb of fbDefaults.podcasts || []) {
      if (!sources.find(s => s.name === fb.name)) {
        sources.push({
          source_id: "podcast-" + fb.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: fb.name,
          source_level: "M",
          source_type: "podcast",
          interface_type: "rss",
          endpoint_or_url: fb.rssUrl,
          query_scope: "AI podcast",
        });
      }
    }
  } catch (e) {}
}

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
    .replace(/\s+$/g, "")
    .trim();
}

function compact(value, limit) {
  const text = decodeText(value).replace(/\s+/g, " ");
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1) + "…";
}

function isRecent(published, hours) {
  if (!published) return false;
  const d = new Date(published);
  if (!Number.isFinite(d.getTime())) return false;
  return (Date.now() - d.getTime()) < hours * 60 * 60 * 1000;
}

async function main() {
  const podcasts = [];
  const errors = [];

  for (const src of sources) {
    const url = src.endpoint_or_url || "";
    if (!url) continue;

    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) {
        errors.push(src.name + ": HTTP " + resp.status);
        continue;
      }
      const xml = await resp.text();
      if (!xml || xml.length < 50) continue;

      const isAtom = /<feed[\s>]/i.test(xml);
      let episodes = [];

      if (isAtom) {
        const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
        for (const entryXml of entries) {
          try {
            const title = decodeText(extractXmlField(entryXml, "title"));
            const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
            const link = linkMatch ? linkMatch[1] : "";
            const published = extractXmlField(entryXml, "published") || extractXmlField(entryXml, "updated");
            const summary = compact(extractXmlField(entryXml, "summary") || extractXmlField(entryXml, "content"), 920);
            if (!title) continue;
            if (!isRecent(published, 720)) continue;
            episodes.push({ title: title, url: link || srcChannelUrl, publishedAt: published, excerpt: summary });
          } catch (e) {}
        }
      } else {
        const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
        for (const itemXml of items) {
          try {
            const title = decodeText(extractXmlField(itemXml, "title"));
            const link = decodeText(extractXmlField(itemXml, "link")) || "";
            const pubDate = extractXmlField(itemXml, "pubDate");
            const description = compact(extractXmlField(itemXml, "description"), 920);
            if (!title) continue;
            if (!isRecent(pubDate, 720)) continue;
            episodes.push({ title, url: link || srcChannelUrl, publishedAt: pubDate, excerpt: description.replace(/<[^>]+>/g, "") });
          } catch (e) {}
        }
      }

      if (episodes.length > 0) {
        podcasts.push({
          source: "podcast",
          name: src.name,
          episodes,
        });
      }
    } catch (error) {
      errors.push(src.name + ": " + error.message.substring(0, 50));
    }
  }

  // Sort all episodes by date, take top 5
  const allEpisodes = podcasts.flatMap(p =>
    p.episodes.map(e => ({ ...e, source: "podcast", name: p.name }))
  );
  allEpisodes.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

  const output = {
    generatedAt: new Date().toISOString(),
    stats: { podcastsBuilt: podcasts.length, totalEpisodes: allEpisodes.length, errors },
    podcasts: allEpisodes.slice(0, 8), // top 8 episodes
  };

  const outPath = path.join(root, "01-SiteV2", "content", "11-databases", "builder-podcast-feed.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  console.log(JSON.stringify({
    status: "ok",
    podcasts_built: output.stats.podcastsBuilt,
    total_episodes: output.stats.totalEpisodes,
    errors: output.stats.errors.length,
    output: path.relative(root, outPath),
  }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
