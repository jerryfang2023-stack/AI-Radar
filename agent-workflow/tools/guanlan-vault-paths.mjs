import fs from "node:fs";
import path from "node:path";

export const GUANLAN_VAULT_CONFIG = ".guanlan-vault.json";
export const GUANLAN_VAULT_NAME = "观澜AI";

export const REPOSITORY_CONTENT_PATHS = Object.freeze({
  industryReportsRoot: "01-SiteV2/content/12-applications/industry-reports",
});

export const GUANLAN_VAULT_PATHS = Object.freeze({
  home: "00-总览/观澜 AI.md",
  currentVersion: "10-系统现状/当前版本.md",
  productMap: "10-系统现状/产品地图.md",
  dataCenterOverview: "20-数据中心/数据中心总览.md",
  commercialEvents: "20-数据中心/最新商业事件.md",
  fde: "20-数据中心/企业 AI 与 FDE.md",
  hardware: "20-数据中心/AI 硬件.md",
  viewpoints: "20-数据中心/一线观点.md",
  community: "20-数据中心/社群情报.md",
  applicationCenterOverview: "30-应用中心/应用中心总览.md",
  industryReports: "30-应用中心/行业报告.md",
  industryReportArchive: "30-应用中心/行业报告档案",
  fundingInsights: "30-应用中心/融资洞察.md",
  opportunityMap: "30-应用中心/机会地图.md",
  trendRadar: "30-应用中心/变化雷达.md",
  siteOperations: "40-运营中心/网站运营总台.md",
  operations: "40-运营中心/运行状态.md",
  automation: "40-运营中心/自动化与发布.md",
  quality: "40-运营中心/质量门禁.md",
  dataBoundary: "50-规则与契约/事实数据边界.md",
  contracts: "50-规则与契约/当前契约.md",
  knowledgeAssets: "60-知识资产/知识资产总览.md",
  fdeArchive: "60-知识资产/企业 AI 案例",
  hardwareArchive: "60-知识资产/AI 硬件资料",
  fundingArchive: "60-知识资产/融资研究",
  viewpointArchive: "60-知识资产/一线人物",
  communityArchive: "60-知识资产/社群资料",
  workspace: "90-工作区/README.md",
});

function readLocalConfig(root) {
  const configPath = path.join(root, GUANLAN_VAULT_CONFIG);
  if (!fs.existsSync(configPath)) return {};
  const payload = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return payload && typeof payload === "object" ? payload : {};
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function resolveGuanlanVaultRoot(root, options = {}) {
  const configured = String(
    options.vaultRoot
      || process.env.GUANLAN_VAULT_ROOT
      || readLocalConfig(root).vaultRoot
      || "",
  ).trim();
  if (!configured) {
    if (options.required === false) return "";
    throw new Error(
      `Guanlan Vault is not configured. Set GUANLAN_VAULT_ROOT or create ${GUANLAN_VAULT_CONFIG}.`,
    );
  }

  const resolved = path.resolve(configured);
  const repositoryRoot = path.resolve(root);
  if (isInside(repositoryRoot, resolved) || isInside(resolved, repositoryRoot)) {
    throw new Error(`Guanlan Vault and the WaveSight repository must be physically independent: ${resolved}`);
  }
  return resolved;
}

export function resolveGuanlanVaultPath(root, relativePath, options = {}) {
  const vaultRoot = resolveGuanlanVaultRoot(root, options);
  const resolved = path.resolve(vaultRoot, relativePath);
  if (!isInside(vaultRoot, resolved)) {
    throw new Error(`Guanlan Vault path escapes its root: ${relativePath}`);
  }
  return resolved;
}
