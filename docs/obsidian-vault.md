---
title: 观澜 AI Obsidian Vault
date: 2026-08-10
status: current
---

# 观澜 AI Obsidian Vault

观澜 AI Vault 是与 WaveSight 工程仓库物理分离的独立知识库。仓库通过环境变量 `GUANLAN_VAULT_ROOT` 或本地忽略文件 `.guanlan-vault.json` 定位它；仓库内不再保留 `vault/`。

## Directory Contract

```text
观澜AI/
├── 00-总览/
├── 10-系统现状/
├── 20-数据中心/
├── 30-应用中心/
├── 40-运营中心/
├── 50-规则与契约/
├── 60-知识资产/
└── 90-工作区/
```

- 数据中心保存当前可追溯事实和独立栏目投影。
- 应用中心只保留变化雷达入口；融资情报与周报/月报统一链接到独立 AI 融资站，机会地图保留为内部实验室。
- 运营中心是网站运营总台、运行状态、自动化与质量门禁入口。
- 知识资产保存去重后仍有长期价值的正式报告、FDE、硬件、融资、一线人物和社群资料。
- 工作区保存人工笔记；不会反向覆盖生产数据。

AI Startup Radar 已退役且不迁移，不能与内部机会地图实验室混淆。V1/V2/V3 规则、迁移过程、旧 Prompt、QC/repair/diff 报告、缓存和重复卡片也不迁移；必要时从 Git 历史恢复。

## Local Commands

```powershell
npm run sync:guanlan-vault
npm run assert:guanlan-vault
npm run assert:private-evidence-backup
npm run assert:public-evidence-boundary
npm run register:guanlan-vault
```

同步会为全部已发布知识资产写入证据字段，并生成“来源—Claim—事件—公司／实体—报告”关系索引和高价值来源引用卡。Vault 只保存原文定位信息。完整原文仅保存在仓库与 Vault 之外的 `PRIVATE-EVIDENCE-STORE-V2.0` 私有证据仓；公开工程仓只保留哈希、来源元数据、Claim、必要摘录和定位符。

Vault 不设置 Markdown 总量硬上限；验收输出仅记录文件数。每个非工作区 Markdown 仍必须由生成清单管理，正式知识资产仍必须具备完整证据字段、可解析 Wiki 链接和退役内容隔离。

`local-sync-from-main.ps1` 在本地 `main` 快进后自动刷新新 Vault。GitHub Actions 不访问本机 Vault。

## Production Boundary

- Canonical JSON、JSONL、DuckDB、代码、测试、工作流和运行报告留在公开工程仓；完整原文只留在私有证据仓。
- 正式周期报告源仍位于 `01-SiteV2/content/12-applications/industry-reports/`；同步器只读取 `status: published` 的 Markdown，并把报告元数据与正文发布到 AI 融资站。
- 新 Vault 是仓库当前事实和应用资产的单向本地投影，是日常运营入口，但不是 Git 或生产数据源。
- 已退役知识库只从明确的 Git ref 在隔离工作树中恢复，不得重新写入当前生产路径。
