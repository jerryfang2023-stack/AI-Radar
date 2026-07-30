---
title: 观澜 AI Obsidian Vault
date: 2026-07-30
status: current
---

# 观澜 AI Obsidian Vault

观澜 AI Vault 是位于原始 `AI热点` 目录之外的独立知识库。仓库通过环境变量 `GUANLAN_VAULT_ROOT` 或本地忽略文件 `.guanlan-vault.json` 定位它；仓库内不再保留 `vault/`。

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
- 应用中心保存报告、融资洞察、机会地图和变化雷达入口。
- 运营中心是网站运营总台、运行状态、自动化与质量门禁入口。
- 知识资产保存从旧 Vault 去重后仍有长期价值的正式报告、FDE、硬件、融资、一线人物和社群资料。
- 工作区保存人工笔记；不会反向覆盖生产数据。

AI Startup Radar 已退役且不迁移，不能与应用中心的机会地图混淆。V1/V2/V3 规则、迁移过程、旧 Prompt、QC/repair/diff 报告、缓存和重复卡片也不迁移；必要时从 Git 历史恢复。

## Local Commands

```powershell
npm run sync:guanlan-vault
npm run assert:guanlan-vault
npm run register:guanlan-vault
```

`local-sync-from-main.ps1` 在本地 `main` 快进后自动刷新新 Vault。GitHub Actions 不访问本机 Vault。

## Production Boundary

- Canonical JSON、JSONL、DuckDB、原始快照、代码、测试、工作流和运行报告留在仓库。
- 正式行业报告的仓库源位于 `01-SiteV2/content/12-applications/industry-reports/`；网站生成器只读该路径。
- 新 Vault 是仓库当前事实和应用资产的单向本地投影，是日常运营入口，但不是 Git 或生产数据源。
- 删除的旧 Vault 只从明确的 Git ref 在隔离工作树中恢复，不得重新写入当前生产路径。
