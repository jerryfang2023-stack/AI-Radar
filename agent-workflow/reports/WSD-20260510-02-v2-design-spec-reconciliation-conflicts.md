---
title: V2-only 设计规范总纲冲突清单
date: 2026-05-10
task_id: WSD-20260510-02-v2-design-spec-reconciliation
board_id: V2-DESIGN-SPEC-RECONCILE
owner: UI / UE Design Director / Workflow Agent
status: resolved-in-design-spec
encoding: UTF-8
---

# V2-only 设计规范总纲冲突清单

## 1. 读取依据

本轮先读取并对照：

- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/governance/dispatch-state-reconciliation.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/governance/skill-pattern-gate.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/v2/v2-page-master-spec.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
- `docs/brand/wavesight-ai-vi/typography-guidelines.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- `docs/brand/wavesight-ai-vi/motion-tokens.css`
- `docs/brand/wavesight-ai-vi/executable-svg/README.md`
- `docs/brand/wavesight-ai-vi/executable-svg/manifest.json`

参考技能口径：`design-taste-frontend` 与 `high-end-visual-design` 仅作为审美检查和抗模板化参考；凡与观澜 AI VI、字体、token 或 V2 产品架构冲突，均以项目 VI 和 V2 规范为准。

## 2. 冲突与处理表

| 编号 | 冲突 | 风险 | 处理结论 |
|---|---|---|---|
| C1 | `DESIGN.md` 同时出现旧 `Daily Brief / Signals / Opportunities / Trends / The Point` 一级栏目和 V2 四导航。 | 后续页面任务可能恢复 The Point / Trends 独立导航。 | V2 一级导航只保留 `今日要点 / 关键信号 / 机会解码 / 商业内参`；The Point 写为 `观点校准`，Trends 写为 `趋势背景 / 热力输入`。 |
| C2 | 旧文档包含 P0 / P1 / V1 草案、P0-10 / P0-11 等历史任务口径。 | 执行窗口可能把历史草案当作当前开发依据。 | 旧 `DESIGN.md` 归档到 `agent-workflow/product/archive/DESIGN-2026-05-10-pre-v2-spec-reconciliation.md`；当前 `DESIGN.md` 改为 V2-only 总纲。 |
| C3 | 页面宽度同时写有 `1200-1280px` 和 `1520-1680px`。 | 栏目页、Daily 和数据密集页宽度基准不一致。 | 默认主容器 `1200-1280px`；详情正文 `760-860px`；侧栏 `320-380px`；只有商业内参热力图、宽表或经 UI / QA 说明的数据密集模块可放宽至 `1440-1520px`，不得默认 `1680px`。 |
| C4 | 圆角写作 `6-12px`，同时 token 有 `--gl-radius-card: 12px`、`--gl-radius-button: 8px`、`--gl-radius-sm/md/lg`。 | 卡片、按钮、标签圆角漂移。 | 以 `brand-tokens.css` 为唯一 token 源：卡片 `--gl-radius-card` / `--gl-radius-lg`，按钮 `--gl-radius-button`，小标签 `--gl-radius-sm`，工具面板 `--gl-radius-md`。不得新增同名 `--gl-*` token。 |
| C5 | VI 禁止雷达、眼睛、机器人、科技母题，但旧页面语境仍出现雷达图 / 热力图表述。 | 雷达图可能被误用为品牌视觉母题。 | 雷达图、热力图、趋势图只能作为数据可视化组件；不得进入 Logo、首屏主视觉、背景装饰或品牌母题。商业热力图只在内参 / 会员 / Admin 语境使用。 |
| C6 | 外部参考 Apple / Linear / Stripe 与高阶设计 skill 的规则可能和 VI 冲突。 | 可能引入玻璃拟态、大圆角 Bento、强动效、Inter 禁用等不适合观澜的规则。 | 外部参考只学习页面逻辑、节奏、信息密度和精致度，不继承品牌色、Logo、字体或强动效；项目 VI、`typography-guidelines.md`、`brand-tokens.css` 优先。 |
| C7 | `frontend-design` 仍可能被旧任务当作设计技能。 | 后续执行窗口误读旧技能口径。 | 当前 `DESIGN.md` 明确禁止使用 `frontend-design`；有效参考为 `design-taste-frontend / gpt-taste / redesign-existing-projects / high-end-visual-design / awesome-design-md`，且必须适配观澜 VI。 |
| C8 | `V2-SITE-QUALITY-AUTO` 曾有失败/不验收记录，旧阶段产物可能被误继承。 | 后续页面任务把失败截图、stage summary 或 local pass 当作质量基线。 | `DESIGN.md` 明确禁止继承该任务任何验收结论；只能作为失败样本或复盘材料。 |
| C9 | 导航背景、页面背景和 token 规则此前分散在 handoff、VI 和站点实现中。 | 规范入口不集中。 | 沉淀到 `DESIGN.md`：公开页面背景 `#FFFDF8` / `--gl-bg-page`；导航栏无边框、无阴影，与页面融合；`#F7F4EF` / `--gl-bg` 只作纸感底色或局部背景。 |
| C10 | Logo 尺寸和 SVG 引用规则此前散落在 VI 文件与 handoff；用户追加确认 Logo 用当前导航栏版本，不得轻易更改。 | 后续页面可能用 CSS、图标库、手写 SVG 重画 Logo，或替换成另一套正式资产。 | 沉淀到 `DESIGN.md`：V2 导航栏 Logo 以当前正在使用的 `01-SiteV2/site/assets/brand/logo-wavesight-reference-horizontal.svg` 为准；不得轻易替换、重绘或改识别结构；横版默认不低于 `160px`；小于 `120px` 优先 symbol；不得改变香槟金地平线和三道主澜线。 |
| C11 | 普通前台与 Admin 边界在设计规范里不够集中。 | 前台页面出现 JSON、同步、字段、编辑等后台痕迹。 | `DESIGN.md` 增加前台 / Admin 边界：公开页面不出现后台流程语；Admin 另按高密度工作台处理。 |
| C12 | 文案规则和页面标题规则分散，且旧草案含解释型副标题。 | 栏目页标题节奏不统一，文案像内部说明。 | `DESIGN.md` 增加标题规则：一级栏目标题统一位置、字号、行高和首屏节奏；标题是一句话价值表达，不写内部解释。 |

## 3. Reviewer 复核结论

- PM / 产品边界：已对齐 `v2-product-architecture-prd.md` 和 `v2-navigation-column-finalization.md`，未新增导航或功能。
- UI / UE：已将 VI、token、字体、SVG、页面母版、宽度、圆角、图表边界统一到 V2-only 总纲。
- Copy：已将公开前台禁用语、Opportunity 标题、Signal 标题和栏目命名边界写入设计总纲。
- Workflow：旧规范已归档，当前任务未修改站点代码、VI 资产、内容生产线、自动化、Netlify 或 GitHub 配置。

## 4. 归档位置

旧 `DESIGN.md` 已按允许范围归档为：

```text
agent-workflow/product/archive/DESIGN-2026-05-10-pre-v2-spec-reconciliation.md
```
