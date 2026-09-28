import fs from "node:fs";
import path from "node:path";

export const CONSUMER_HARDWARE_CONFIG = "01-SiteV2/content/11-databases/consumer-ai-hardware-monitor-v1.json";
export const CONSUMER_HARDWARE_PATH = "consumer_ai_hardware_funding";

export function consumerHardwareConfig(root) {
  const file = path.join(root, CONSUMER_HARDWARE_CONFIG);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { enabled: false, categories: [] };
}

export function consumerHardwareQueries(root, language = "en") {
  const config = consumerHardwareConfig(root);
  if (!config.enabled) return [];
  return config.categories.map((category) => ({
    query: category[language],
    query_theme: `consumer-hardware-${category.id}`,
    keyword_group: "important_funding",
    search_paths: [CONSUMER_HARDWARE_PATH],
    monitoring_category: category.id,
  }));
}
