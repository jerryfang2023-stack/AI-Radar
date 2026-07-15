import test from "node:test";
import assert from "node:assert/strict";
import { dedupeEpisodes, dedupeSources } from "../podcast-feed-utils.mjs";

test("podcast sources are deduplicated by RSS endpoint", () => {
  const sources = dedupeSources([
    { source_id: "registry", name: "Unsupervised Learning (Redpoint)", endpoint_or_url: "https://feeds.simplecast.com/dOSE_bdP" },
    { source_id: "fallback", name: "Unsupervised Learning", endpoint_or_url: "https://feeds.simplecast.com/dOSE_bdP/" },
  ]);

  assert.equal(sources.length, 1);
  assert.equal(sources[0].source_id, "registry");
});

test("podcast episodes are deduplicated by canonical URL", () => {
  const episodes = dedupeEpisodes([
    { title: "Episode", url: "https://example.com/episode" },
    { title: "Episode alias", url: "https://example.com/episode/" },
  ]);

  assert.equal(episodes.length, 1);
});
