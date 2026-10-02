---
title: 观澜 AI Obsidian Vault
date: 2026-08-14
status: current
---

# 观澜 AI Obsidian Vault

观澜 AI Vault 是与 WaveSight 工程仓库物理分离的独立知识库。仓库通过环境变量 `GUANLAN_VAULT_ROOT` 或本地忽略文件 `.guanlan-vault.json` 定位它；仓库内不再保留 `vault/`。

## Directory Contract

```text
观澜AI/
├── 00-总览/
├── 10-系统现状/
├── 20-融资情报/              # 融资总览、融资报告、已发布报告档案
├── 30-专题研究/              # 社群监测、Builders观点、FDE、AI硬件
├── 40-运营中心/
├── 50-规则与契约/
├── 60-知识资产/              # 按融资/FDE/AI硬件/Builders观点/社群监测分目录
└── 90-工作区/
```

- 融资情报只读取已验收的 `financing-catalog-v1.json`；硬件、FDE 企业符合融资准入规则的融资事件仍保留在融资域。
- 专题研究与融资导航分开；独立栏目不进入融资读库，机会地图、变化雷达归内部实验室。
- `.guanlan-domains.json` 分别记录融资、社群、Builders、FDE、硬件和共享资产的内容哈希；专题更新不会改变融资域版本。
- 域版本采用 `content-without-generated-update-1`：仅忽略 frontmatter 中生成器写入的 `updated: YYYY-MM-DD`；各文件的原始 SHA-256 仍逐字节校验。旧版本清单可继续验证，下次正常生成升级版本算法；正文日期、事实和证据变化仍会改变所属域版本。
- 运营中心是网站运营总台、运行状态、自动化与质量门禁入口。
- 知识资产保存去重后仍有长期价值的正式报告、FDE、硬件、融资、一线人物和社群资料。
- 工作区保存人工笔记；不会反向覆盖生产数据。

AI Startup Radar 已退役且不迁移，不能与内部机会地图实验室混淆。V1/V2/V3 规则、迁移过程、旧 Prompt、QC/repair/diff 报告、缓存和重复卡片也不迁移；必要时从 Git 历史恢复。

## Local Commands

```powershell
npm run sync:guanlan-vault
npm run assert:guanlan-vault
npm run build:financing-read-model
npm run assert:private-evidence-backup
npm run assert:public-evidence-boundary
npm run register:guanlan-vault
```

同步会为全部已发布知识资产写入证据字段，并生成“来源—Claim—事件—公司／实体—报告”关系索引和高价值来源引用卡。Vault 只保存原文定位信息。完整原文仅保存在仓库与 Vault 之外的 `PRIVATE-EVIDENCE-STORE-V2.0` 私有证据仓；公开工程仓只保留哈希、来源元数据、Claim、必要摘录和定位符。

Vault 不设置 Markdown 总量硬上限；验收输出仅记录文件数。每个非工作区 Markdown 仍必须由生成清单管理，正式知识资产仍必须具备完整证据字段、可解析 Wiki 链接和退役内容隔离。

`local-sync-from-main.ps1` 在本地 `main` 快进后自动刷新新 Vault。GitHub Actions 不访问本机 Vault。

每日融资发布闭环不依赖主工作区是否干净：它从 `origin/main` 创建隔离工作树，刷新共享数据湖、独立融资读库及 Vault，并在项目 runtime 中记录来源提交。主工作区的未提交改动不会进入投影。

旧布局首次升级必须先在独立目录构建并验收，再通过 `migrate-guanlan-vault-layout.mjs --target=... --staging=... --backup=... --apply=true` 迁移。迁移备份全部修改前内容，校验并发修改，只修正人工笔记的路径引用，保留正文与现有 Obsidian 设置。生成器会拒绝直接覆盖旧布局或正在迁移的 Vault。迁移完成后恢复正常单向同步。

迁移失败时，仅恢复当前哈希仍属于本次迁移的文件。已被其他写入者再次修改的文件保留现场，备份目录的 `rollback.json` 记录冲突与部分恢复状态；按备份清单人工合并后再决定重试，不能直接覆盖并发正文。

## Production Boundary

- Canonical JSON、JSONL、DuckDB、代码、测试、工作流和运行报告留在公开工程仓；完整原文只留在私有证据仓。
- 正式周期报告源仍位于 `01-SiteV2/content/12-applications/industry-reports/`；同步器只读取 `status: published` 的 Markdown，并把报告元数据与正文发布到 AI 融资站。
- 新 Vault 是仓库当前事实和应用资产的单向本地投影，是日常运营入口，但不是 Git 或生产数据源。
- 已退役知识库只从明确的 Git ref 在隔离工作树中恢复，不得重新写入当前生产路径。
