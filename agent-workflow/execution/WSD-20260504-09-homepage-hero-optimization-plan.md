# WSD-20260504-09-homepage-hero-optimization-plan 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`strategy` / `pm` / `ui-ue` / `copy`

## 1. 任务目标

优化首页，重点是首屏海报图和第一屏价值表达，让用户在 5 秒内理解观澜AI的商业判断价值。

## 2. 非目标

- 本任务先制定方向和页面需求，不直接大范围改代码。
- 不新增商业化承诺。
- 不改数据模型。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Strategy Agent | 明确首页主价值和目标用户判断场景 |
| PM Agent | 定义首页首屏目标、模块取舍和验收 |
| UI / UE Agent | 给出首屏海报图方向、布局和视觉参考 |
| Copy Agent | 给出 H1、导语和 CTA 文案方向 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md`
5. `agent-workflow/product/strategy-single-source.md`
6. `agent-workflow/prd/active/PRD-006-homepage-layout.md`
7. `agent-workflow/product/DESIGN.md`
8. `agent-workflow/product/COPY.md`

## 5. 允许改动范围

- 可新增 `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`
- `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

## 6. 禁止改动范围

- 不改 `04-Site/index.html`、`04-Site/js/app.js`、`04-Site/css/styles.css`。
- 不生成最终图片资产，除非调度中枢另行派发。
- 不改自动化任务。

## 7. 预期输出

- 首页首屏战略判断。
- 海报图方向：真实资产 / 生成图 / 数据场景 / 情报桌面等候选。
- 首页首屏信息架构。
- 后续 UI / Copy / Dev 执行任务拆分。
- 收口文件：`agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否。
- 是否可能影响 `ai-2`：否。
- 是否可能影响 `ai-3`：否。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
请以 Strategy / PM / UI / Copy 联合口径，制定首页优化方向，重点解决首屏海报图和第一屏价值表达。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md
```

