import fs from "node:fs";
import path from "node:path";

export const platformDefinitions = [
  { id: "data-center", label: "观澜数据中心", scope: "事实资产、采集与质量", url: "data-center.html", versionKey: "DATA-CENTER" },
  { id: "funding", label: "观澜融资情报站", scope: "融资内容、访问与转化", url: "https://www.zkdlj.vip/", versionKey: "FUNDING" },
  { id: "miniprogram", label: "观澜小程序", scope: "微信原生应用、内容与权益", url: "", versionKey: "MINIPROGRAM" },
  { id: "h5", label: "融资 H5", scope: "移动端融资产品原型", url: "", versionKey: "H5" },
  { id: "community", label: "社群与会员", scope: "会员服务、申请页与分享内容", url: "https://members.zkdlj.vip/", versionKey: "MEMBERS" },
];

export const publicVersionSources = [
  { id: "funding", url: "https://www.zkdlj.vip/version.json", fields: ["version", "data_version", "release_date"] },
  { id: "community", url: "https://members.zkdlj.vip/healthz", fields: ["version", "h5_version"] },
];

export function sanitizeVersionResponse(source, payload) {
  if (!payload || typeof payload !== "object" || (source.id === "community" && payload.ok !== true)) throw new Error("Invalid public version response");
  const result = {};
  for (const field of source.fields) {
    const value = payload[field];
    if (typeof value !== "string" || !/^[A-Za-z0-9._-]{1,100}$/u.test(value)) throw new Error(`Invalid version field: ${field}`);
    result[field] = value;
  }
  return result;
}

export function buildPortfolio(root, ledgerVersions, snapshot = {}) {
  const read = (file) => {
    try { return JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); } catch { return {}; }
  };
  const baseline = (key) => ledgerVersions.find((item) => item.key === key)?.value || "未登记";
  const publicRow = (key, label, category, sourceId, field) => {
    const source = publicVersionSources.find((item) => item.id === sourceId);
    const receipt = snapshot.sources?.find((item) => item.id === sourceId) || {};
    return { key, label, category, value: receipt.values?.[field] || "待核验", source: source.url,
      status: receipt.status === "verified" ? "公开端点已核验" : "核验不可用", kind: "deployed",
      checkedAt: receipt.verifiedAt || "", attemptedAt: receipt.checkedAt || "", verified: receipt.status === "verified" };
  };
  const labels = { "DATA-CENTER": "数据中心 Git 基线", SITE: "兼容站点外壳", OPS: "整体运营后台", BSIG: "商业信号生产链路", TAG: "分类与标签", FLV: "一线观点", CINT: "社群情报", FDE: "企业 AI / FDE 数据", HARDWARE: "AI 硬件数据", REPORTS: "融资报告发布", OMAP: "机会地图", TRADAR: "变化雷达", RAW: "原始数据契约", EVENT: "规范事件契约", ENTITY: "实体历史契约", PERSON: "人物审核契约", RELATION: "事实关系契约", BACKFILL: "历史采集契约", SKILL: "Skill Store" };
  const versions = [
    ...ledgerVersions.map((item) => ({ ...item, label: labels[item.key] || item.label,
      category: ["OPS", "SKILL"].includes(item.key) ? "运营与规则" : item.key === "REPORTS" ? "融资产品" : ["RAW", "EVENT", "ENTITY", "PERSON", "RELATION", "BACKFILL", "TAG"].includes(item.key) ? "数据契约" : "数据中心",
      source: "context/version-ledger.md", status: item.value ? "仓库基线" : "未登记", kind: "source", checkedAt: "" })),
    publicRow("FUNDING", "AI 融资站", "融资产品", "funding", "version"),
    publicRow("FUNDING-DATA", "融资数据", "融资产品", "funding", "data_version"),
    { key: "MINIPROGRAM", label: "微信小程序", category: "融资产品", value: read("02-Miniprogram/package.json").version || "未登记", source: "02-Miniprogram/package.json", status: "源码版本 · 微信线上待核验", kind: "source", checkedAt: "" },
    { key: "H5", label: "融资 H5 原型", category: "融资产品", value: read("03-H5/package.json").version || "未登记", source: "03-H5/package.json", status: "源码版本 · 部署待接入", kind: "source", checkedAt: "" },
    publicRow("MEMBERS", "社群会员服务", "社群与会员", "community", "version"),
    publicRow("MEMBERS-H5", "社群申请 H5 / PC", "社群与会员", "community", "h5_version"),
  ];
  let skillData = {};
  try {
    const raw = fs.readFileSync(path.join(root, "01-SiteV2/site/data/local-skill-store-data.js"), "utf8");
    skillData = JSON.parse(raw.replace(/^window\.WaveSightLocalSkillStore\s*=\s*/u, "").replace(/;\s*$/u, ""));
  } catch { /* Missing snapshot is shown as unavailable, not zero. */ }
  return {
    platforms: platformDefinitions.map((platform) => ({ ...platform, version: versions.find((item) => item.key === platform.versionKey) || {}, analytics: platform.id === "community" ? "会员与分享汇总按需接入" : ["funding", "miniprogram"].includes(platform.id) ? "聚合统计与会员权益已接入" : "业务统计待接入" })),
    versions,
    skills: { total: skillData.skills?.length ?? null, generatedAt: skillData.meta?.generatedAt || "", sources: skillData.meta?.catalogSources || [], platforms: skillData.meta?.platformCoverage || [] },
    analytics: { url: "https://www.zkdlj.vip/api/v1/analytics/summary", scope: "融资站与小程序的匿名聚合；不包含社群会员明细" },
    sourceBaseline: baseline("SITE"),
  };
}
