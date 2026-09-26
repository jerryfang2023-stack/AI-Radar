import test from "node:test";
import assert from "node:assert/strict";
import { consumerHardwareConfig, consumerHardwareQueries } from "../lib/consumer-ai-hardware-monitor.mjs";
import { collectChinaFunding } from "../lib/china-funding-collector.mjs";

const root = process.cwd();
test("every configured consumer category has separate bilingual discovery queries", () => {
  const config = consumerHardwareConfig(root);
  for (const language of ["zh", "en"]) {
    const queries = consumerHardwareQueries(root, language);
    assert.equal(queries.length, 6);
    assert.equal(new Set(queries.map((row) => row.monitoring_category)).size, 6);
    for (const row of queries) assert.ok(row.query && row.search_paths.length === 1);
  }
  assert.ok(config.categories.some((row) => row.zh.includes("钥匙扣")));
});

test("full general budget cannot crowd out consumer categories; empty and failed remain distinct", async () => {
  const config = consumerHardwareConfig(root);
  const output = await collectChinaFunding({ root, date: "2026-09-26",
    fetcher: async () => ({ ok: true, text: async () => "<html></html>" }),
    search: async (query) => {
      const domain = query.match(/^site:(\S+)/u)[1];
      const category = config.categories.find((row) => query.includes(row.zh));
      if (category?.id === "ai-phones") throw new Error("search unavailable");
      if (category?.id === "ai-home-devices") return [];
      return Array.from({ length: 30 }, (_, i) => ({
        url: `https://${domain}/article/${category?.id || "general"}-${100000 + i}`,
        title: "AI智能设备公司完成A轮融资",
      }));
    },
  });
  for (const row of output.diagnostics) {
    assert.equal(row.general_candidates, 24);
    assert.equal(row.candidates, 40);
    assert.equal(row.consumer_hardware.find((item) => item.category === "ai-phones").status, "failed");
    assert.equal(row.consumer_hardware.find((item) => item.category === "ai-home-devices").status, "empty");
    for (const item of row.consumer_hardware.filter((item) => item.status === "collected")) {
      assert.equal(item.retained, 4);
      assert.equal(item.capped, 26);
    }
  }
});
