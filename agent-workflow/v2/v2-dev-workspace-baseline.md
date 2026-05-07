---
title: V2.0 Dev Workspace Baseline
date: 2026-05-07
task_id: WSD-20260507-06-v2-dev-workspace-baseline
status: baseline-plan
owner: V2 Platform / Dev Migration Agent
encoding: UTF-8
---

# V2.0 技术工作区与迁移基线

## 0. 结论

V2.0 是观澜AI的正式升级项目，不是临时测试项目。代码开发应使用独立 Git 分支，并在需要页面、脚本或数据结构原型时使用独立 worktree 隔离。

本轮已检查当前仓库状态，但不创建 `v1.0-baseline` tag、不创建 V2 branch、不创建外部 worktree。

原因是当前 `main` 虽然与 `origin/main` 同步在 `925f2e9`，但本地工作树存在大量未提交和未跟踪文件，包含 V2 文档、已验收报告、测试管线、每日内容、网站数据和调度看板更新。此时直接打 tag 只能标记旧提交，不能代表当前项目文件层面的 V1.0 / V2 转场基线。

推荐先完成一次“V1.0 转场基线整理提交”，再执行 tag / branch / worktree。

## 1. 当前仓库事实

检查时间：2026-05-07

| 项目 | 结果 |
|---|---|
| Git 顶层目录 | `C:/Users/86186/Documents/Fang/wiki/AI热点/01-WaveSight` |
| 当前分支 | `main` |
| 当前 HEAD | `925f2e9ccbd6cb2a63b5790d594f89e4efb01d9c` |
| HEAD 说明 | `chore: record final sync quality gate` |
| 远端 | `origin https://github.com/jerryfang2023-stack/AI-Radar.git` |
| 远端状态 | `main...origin/main`，无 ahead / behind |
| 现有 tag | 无 |
| 现有本地分支 | `main`、`task/WSD-20260504-13-homepage-hero-carousel-assets` |
| 现有远端分支 | `origin/main`、`origin/wavesight-baseline-20260504` |
| 现有 worktree | 仅当前主工作树 |
| Netlify publish | `04-Site/` |

当前工作树状态：非 clean。存在已修改文件和大量未跟踪文件。

主要类别包括：

- V2 规划与派发文件：`agent-workflow/v2/`、`agent-workflow/execution/WSD-20260507-*`。
- 调度与治理更新：`dispatch-board.md`、`progress.md`、`docs/agent-handoff.md`、`agent-memory.md` 等。
- 网站与数据文件：`04-Site/` 下 CSS、JS、数据、signal-lab 测试页和资产。
- 内容源文件：2026-05-05 / 2026-05-06 的 Signals、Scoring、The Point、Opportunities。
- AI News Radar 本地目录：`09-ai-news-radar/`。
- 大量 Quality Gate、relation、tag、point 和 sync 报告。

## 2. Git 操作结论

### 2.1 是否建议创建 Git tag

建议创建，但不在当前脏工作树状态下创建。

推荐 tag：

```text
v1.0-baseline-20260507
```

创建条件：

1. 调度中枢确认哪些当前未提交文件属于 V1.0 accepted 基线、哪些属于 V2 planning、哪些属于 test-only 或待验收资产。
2. 对应文件完成一次可审计提交。
3. `git status --short --branch` 显示 clean，或只有明确排除的本地私有文件。
4. 再在基线提交上创建 tag。

建议命令：

```powershell
git status --short --branch
git tag -a v1.0-baseline-20260507 -m "V1.0 baseline before V2 formal upgrade"
git push origin v1.0-baseline-20260507
```

回滚方式：

```powershell
git switch main
git restore --source v1.0-baseline-20260507 -- .
```

注意：真实回滚前仍需备份未提交内容，不得使用破坏性回滚覆盖用户未保存工作。

### 2.2 是否建议创建 V2 branch

建议创建：

```text
codex/v2-planning
```

创建条件：

- `v1.0-baseline-20260507` 已存在，或调度中枢明确指定某个基线提交。
- 当前工作树已整理到可审计状态。

建议命令：

```powershell
git branch codex/v2-planning v1.0-baseline-20260507
git push -u origin codex/v2-planning
```

不建议直接从当前脏工作树切换分支，因为未提交内容会被带入新分支，削弱 V1 / V2 边界。

### 2.3 是否建议创建 worktree

建议在进入真实页面、脚本或数据结构迁移前创建。当前不创建，因为派发单要求创建外部 worktree 前必须确认目标路径。

推荐目标路径：

```text
C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-v2-lab
```

用户确认目标路径后，建议命令：

```powershell
git worktree add "..\01-WaveSight-v2-lab" codex/v2-planning
```

用途：

- V2 页面、VI tokens、layout primitives、AI内参、热力图、算法脚本原型。
- 生产内容源和 V1.0 前台不被未验收 V2 改动污染。
- QA 可以在主工作树和 V2 worktree 之间做截图、数据和回滚对照。

删除 worktree 的安全方式：

```powershell
git worktree list
git worktree remove "..\01-WaveSight-v2-lab"
```

删除前必须确认 worktree 内无未提交成果。

## 3. V2 开发工作区结构建议

V2 不另起孤立项目。推荐结构：

```text
01-WaveSight
  V1.0 主项目、调度中枢、基线归档、正式内容源

01-WaveSight-v2-lab
  V2 正式升级开发区，基于 codex/v2-planning
```

在 V2 worktree 中，建议新增或迁移以下工程层：

```text
04-Site/
  assets/
    brand/
      wavesight-logo-horizontal.svg
      wavesight-logo-vertical.svg
      wavesight-mark.svg
      favicon.svg
    icons/
      signal.svg
      point.svg
      trend.svg
      opportunity.svg
      brief.svg
  css/
    v2-tokens.css
    v2-primitives.css
    v2-layouts.css
  js/
    v2-brief.js
    v2-heatmap.js
```

说明：

- `v2-tokens.css` 承接 `v2-vi-design-direction.md` 的色彩、字体、半径、阴影、动效 token。
- `v2-primitives.css` 承接 Logo 安全区、澜线、地平线、分割线、按钮、标签、引用块、判断块。
- `v2-layouts.css` 承接首页、栏目页、详情页、AI商业内参、热力图、移动端母版。
- `assets/brand/` 只放锁定品牌资产，不放临时探索图。
- `assets/icons/` 图标必须遵守线性、1.5px stroke、24px 网格、不填充、不渐变。

## 4. V2 VI 到前端落地映射

V2-3 已锁定 `方案 A：极简澜线型`。后续 Dev 必须把 VI 转成工程约束，而不是只作为参考图片。

### 4.1 Token 初始映射

| Token | 值 | 用途 |
|---|---:|---|
| `--gl-ink` | `#071827` | 主品牌文字、深色背景、主按钮 |
| `--gl-blue` | `#0D355C` | 澜线、链接、重点信息 |
| `--gl-gray` | `#6F7F8F` | 辅助文字、图表辅助线 |
| `--gl-mountain` | `#A7ADB4` | 弱边界、辅助线 |
| `--gl-bg` | `#F7F4EF` | 页面底色 |
| `--gl-paper` | `#FFFFFF` | 内容区和卡片 |
| `--gl-gold` | `#C8A766` | 地平线、会员点缀、重点细线 |
| `--gl-risk` | `#B85C5C` | 风险项 |
| `--gl-positive` | `#2F8C57` | 正向变化 |

### 4.2 禁止迁移的 V1 视觉

后续 V2 Dev 不得把以下 V1 或历史方向迁入 V2：

- 旧雷达图、雷达圈、信号点阵。
- 眼睛、机器人、芯片、火箭、闪电等泛 AI 图形。
- 蓝紫科技渐变、霓虹、发光、复杂阴影。
- 后台数据大屏、泛仪表盘、彩虹热力表。
- `P0-2A` abandoned 轮播方向。
- `P0-2B` failed 首页方向。
- `P1-4B` stopped 页面实现方向。
- `P0-11` 未补 SYS-7 证据前，不得作为 accepted 视觉资产直接迁入 V2。

## 5. 迁移分阶段

### 阶段 A：基线整理

目标：把当前 accepted 状态整理成可 tag 的 Git 提交。

动作：

- 调度中枢确认本地未提交文件归属。
- 排除 test-only、failed、abandoned、private、本地缓存和无关大文件。
- 提交 V1 accepted 与 V2 planning 文档。
- 创建 `v1.0-baseline-20260507` tag。

验收：

- `git status --short --branch` clean。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- tag 指向明确基线提交。

### 阶段 B：V2 branch / worktree

目标：建立独立 V2 正式升级开发区。

动作：

- 从 tag 创建 `codex/v2-planning`。
- 用户确认路径后创建 `01-WaveSight-v2-lab` worktree。
- 在 worktree 中只执行 V2 派发单允许的页面、脚本、数据和资产迁移。

验收：

- `git worktree list` 显示主工作树和 V2 worktree。
- V2 worktree 分支为 `codex/v2-planning`。
- 主工作树保持可运行。

### 阶段 C：V2 tokens / primitives first

目标：先建立 V2 设计系统工程底座，再改页面。

动作：

- 创建品牌资产目录。
- 创建 tokens、primitives、layouts CSS 文件。
- 先做独立 V2 demo / preview 页面，不直接覆盖 V1 首页。
- 图标和 Logo 使用锁定 VI，不临时重画品牌母题。

验收：

- V2 Verification Agent 检查是否遵守 VI。
- SYS-7 只在有实际页面 / 资产截图时适用。
- 未影响 `ai-the-point`、`ai-2`、`ai-3`。

### 阶段 D：V2 产品与算法迁移

目标：在 V2-2、V2-4A、V2-4 accepted 后再进入生产结构迁移。

动作：

- HeatEvidence / AI商业内参 / 热力图 schema 必须有 PM 和 Data 定义。
- 修改生产同步脚本前，另行派发自动化影响类任务。
- 保留 V1 数据解析兼容，不硬切断现有 Signals / Priority Engine / Trends / The Point。

验收：

- `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs` 通过。
- 统一同步闸门说明是否升级。
- 硬错误为 0，软提醒有处理路径。

## 6. 部署隔离

当前 Netlify 配置：

```toml
[build]
publish = "04-Site"
```

V2 预览建议：

- 不直接覆盖现有 `wavesight-ai-preview` 生产预览口径。
- V2 worktree 可使用独立 Netlify preview 或 branch deploy。
- 正式上线前必须补齐 release checklist、备份、回滚、权限和数据写入方案。

推荐部署分层：

| 环境 | 来源 | 用途 |
|---|---|---|
| V1 main preview | `main` / `04-Site` | V1 稳定预览与回滚基线 |
| V2 branch preview | `codex/v2-planning` / `04-Site` | V2 页面、VI、内参、热力图预览 |
| Production | 待用户确认 | 用户验收后再替换 |

## 7. 自动化影响边界

本轮不修改以下内容：

- `sync-data.mjs`
- `check-relations.mjs`
- `check-tags.mjs`
- `unified-site-sync.mjs`
- The Point 来源与授权规则
- 每日商业雷达命名、机会拆解、评分表和趋势/机会卡生成规则
- `ai-the-point`、`ai-2`、`ai-3` 自动化提示词或运行顺序

后续若 V2 任务修改内容源字段、同步脚本、The Point 规则、Priority / HeatEvidence schema 或统一同步闸门，必须先提示“可能影响自动化任务”，并单独派发自动化影响类任务。

## 8. V2 Verification Agent 验收段

| 检查项 | 结论 |
|---|---|
| 是否读取 V1 baseline 与 V2 workspace strategy | 通过 |
| 是否读取 V2 VI 方向并转为 Dev 迁移约束 | 通过 |
| 是否检查当前 Git 状态 | 通过 |
| 是否创建 Git tag | 未创建，因工作树非 clean |
| 是否创建 V2 branch | 未创建，因基线提交未整理 |
| 是否创建外部 worktree | 未创建，目标路径需用户确认 |
| 是否使用破坏性回滚 | 未使用 |
| 是否删除或覆盖未归属本任务的修改 | 未发生 |
| 是否修改 `04-Site/` 页面或生产数据 | 未修改 |
| 是否影响自动化任务 | 不影响 |

## 9. 下一步

建议调度中枢新增或执行一个小范围基线整理任务：

```text
V2-5A / V1.0 accepted files commit and baseline tag
```

目标：

1. 按 accepted / review / test-only / abandoned / private 分类当前未提交文件。
2. 只提交应进入基线的文件。
3. 创建 `v1.0-baseline-20260507` tag。
4. 创建 `codex/v2-planning` branch。
5. 在用户确认路径后创建 V2 worktree。

在此之前，任何 V2 页面或脚本开发都应避免直接覆盖主工作树的 V1.0 前台和生产同步链路。
