import path from "node:path";

export const OBSIDIAN_VAULT_ROOT = "vault";

export const OBSIDIAN_PATHS = Object.freeze({
  home: "vault/00-Home/WaveSight.md",
  dataCenterRoot: "vault/10-Data-Center",
  dataCenterIndex: "vault/10-Data-Center/01-Commercial-Events/Data Center V4 Index.md",
  fdeRoot: "vault/10-Data-Center/02-Enterprise-AI-FDE",
  hardwareRoot: "vault/10-Data-Center/03-AI-Hardware",
  viewpointsRoot: "vault/10-Data-Center/04-First-Line-Viewpoints",
  communityRoot: "vault/10-Data-Center/05-Community-Intelligence",
  applicationCenterRoot: "vault/20-Application-Center",
  reportsRoot: "vault/20-Application-Center/01-Industry-Reports",
  fundingInsightsRoot: "vault/20-Application-Center/02-Funding-Insights",
  opportunityMapRoot: "vault/20-Application-Center/03-Opportunity-Map",
  trendRadarRoot: "vault/20-Application-Center/04-Trend-Radar",
  operationsRoot: "vault/30-Operations",
  referenceRoot: "vault/90-Reference",
  archiveRoot: "vault/99-Archive",
});

export function resolveObsidianPath(root, relativePath) {
  const vaultRoot = path.resolve(root, OBSIDIAN_VAULT_ROOT);
  const resolved = path.resolve(root, relativePath);
  if (resolved !== vaultRoot && !resolved.startsWith(`${vaultRoot}${path.sep}`)) {
    throw new Error(`Obsidian path escapes vault: ${relativePath}`);
  }
  return resolved;
}
