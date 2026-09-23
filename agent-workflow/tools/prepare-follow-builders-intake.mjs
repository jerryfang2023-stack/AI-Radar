import { execFile } from "node:child_process";
import { isMainModule } from "./lib/module-entry.mjs";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const base = "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main";
export const BUILDER_FEEDS = Object.freeze({ x: `${base}/feed-x.json`, blogs: `${base}/feed-blogs.json`, podcasts: `${base}/feed-podcasts.json` });

// The archive needs feed data, not five sequential remote digest prompts or
// personal delivery configuration. Bound both request and body-read time.
export async function fetchBuilderFeed(url, { fetchImpl = fetch, timeoutMs = 15000, curl = execFileAsync } = {}) {
  let response;
  let text;
  try {
    response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (response.ok) text = await response.text();
  } catch (error) {
    if (process.platform !== "win32") throw error;
    const result = await curl("curl.exe", ["--fail", "--silent", "--show-error", "--location", "--connect-timeout", "10", "--max-time", "25", url],
      { timeout: 30000, maxBuffer: 50 * 1024 * 1024, windowsHide: true });
    text = result.stdout;
  }
  if (text === undefined) throw new Error(`HTTP ${response?.status ?? "unavailable"}`);
  return JSON.parse(text);
}

export async function prepareBuilderIntake({ load = fetchBuilderFeed, now = () => new Date().toISOString() } = {}) {
  const results = await Promise.all(Object.entries(BUILDER_FEEDS).map(async ([kind, url]) => {
    try {
      const feed = await load(url);
      if (!Array.isArray(feed?.[kind])) throw new Error(`invalid ${kind} feed array`);
      return { kind, url, items: feed[kind], generatedAt: feed.generatedAt || null };
    } catch (error) { return { kind, url, items: [], error: error.message }; }
  }));
  const output = { generatedAt: now(), x: [], blogs: [], podcasts: [], sources: [], errors: [] };
  for (const result of results) {
    output[result.kind] = result.items;
    output.sources.push({ kind: result.kind, url: result.url, generatedAt: result.generatedAt || null, status: result.error ? "failed" : "fetched" });
    if (result.error) output.errors.push(`${result.kind}: ${result.error}`);
  }
  const itemCount = output.blogs.length + output.podcasts.length + output.x.reduce((sum, author) => sum + (Array.isArray(author.tweets) ? author.tweets.length : 0), 0);
  if (!itemCount) throw new Error(`follow-builders feed intake empty: ${output.errors.join("; ") || "no source items"}`);
  output.status = output.errors.length ? "partial" : "ok";
  return output;
}

if (isMainModule(import.meta.url)) {
  prepareBuilderIntake().then(data => console.log(JSON.stringify(data))).catch(error => {
    console.error(error.message); process.exitCode = 1;
  });
}
