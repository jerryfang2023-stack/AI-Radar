---
title: GitHub Baseline Sync
date: 2026-05-04
type: deployment-prep
status: synced
owner: dev / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# GitHub Baseline Sync

## 1. 目标

用户已创建 GitHub 仓库，希望同步网站代码和云端部署所需的相关必要文件，方便后续部署、回滚和协作。

目标仓库：

```text
jerryfang2023-stack/AI-Radar
```

仓库地址：

```text
https://github.com/jerryfang2023-stack/AI-Radar
```

## 2. 本轮处理

已完成：

- 确认 GitHub 插件可访问 `jerryfang2023-stack/AI-Radar`。
- 本地仓库绑定远端：

```text
origin = https://github.com/jerryfang2023-stack/AI-Radar.git
```

- 发现远端 `main` 已有测试提交，因此没有强推覆盖远端 `main`。
- 将当前观澜AI完整项目基线推送到新分支：

```text
wavesight-baseline-20260504
```

GitHub 提示可从该分支创建 Pull Request：

```text
https://github.com/jerryfang2023-stack/AI-Radar/pull/new/wavesight-baseline-20260504
```

## 3. 已同步范围

已同步到 GitHub 分支的核心范围：

- `04-Site/` 网站代码、页面、样式、脚本、静态资产和当前数据文件。
- `agent-workflow/` 长期 Agent 工作流、治理、派发单、PRD、产品规范、脚本和报告。
- `docs/agent-handoff.md`。
- `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/` 当前内容源。
- `AGENTS.md`、`.gitignore`、`.gitattributes`。
- `提示词/` 与 `测试期文档/`。

## 4. 已排除范围

根据 `.gitignore`，未同步：

- `node_modules/` 等依赖目录。
- 构建产物和缓存目录。
- `agent-workflow/backups/`。
- `agent-workflow/reports/**/*.png`、`jpg`、`jpeg`、`webp` 等大型截图验收文件。
- 本地环境变量文件。

说明：截图验收文件不进入仓库，避免仓库快速膨胀；重要截图路径仍保留在报告中。

## 5. 当前 Git 状态

本地初始基线：

```text
5428909 chore: initialize WaveSight repository baseline
```

本地环境修复提交：

```text
baf3a28 chore: document local worktree environment fix
```

远端同步分支：

```text
origin/wavesight-baseline-20260504
```

## 6. 后续建议

建议下一步由 Dev / PM 确认：

1. 是否将 `wavesight-baseline-20260504` 合并为 GitHub 默认部署分支。
2. 是否保留远端 `main` 中现有测试文件，还是清理后以观澜AI基线作为正式 `main`。
3. 云端部署选型：静态托管、Vercel / Netlify、或自有服务器。
4. 是否需要把 `04-Site/` 设为部署根目录。
5. 是否需要建立 GitHub Actions：语法检查、同步检查、构建检查、部署前备份。

## 7. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

原因：本轮只同步版本管理仓库和必要文件，不改变 Markdown 字段、同步脚本口径、自动化任务提示词或运行顺序。
