# WSD-20260504-04-daily-brief-detail-productization 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `ui-ue` / `copy`

## 1. 任务目标

继续收口 Daily Brief 详情页，使其更像每日商业内参，而不是内容列表或后台信息页。

重点检查：

- 今日主线是否清楚。
- 主 Signal 阅读区是否比侧栏更强。
- 机会和趋势是否只是摘要，不抢主阅读。
- 文案是否避免行动指令。

## 2. 非目标

- 不改变 Daily Brief 数据模型。
- 不改变每日自动化生成规则。
- 不新增 newsletter 发送系统。
- 不接入真实付费或权限。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 明确页面目标和非目标 |
| UI / UE Agent | 调整阅读路径和视觉层级 |
| Copy Agent | 收敛文案语气 |
| Dev Agent | 小范围落地页面结构 / 样式 |
| QA Agent | 验收桌面和移动端 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md`
5. `agent-workflow/prd/active/PRD-001-daily-brief.md`
6. `agent-workflow/product/DESIGN.md`
7. `agent-workflow/product/COPY.md`

## 5. 允许改动范围

- `04-Site/daily-detail.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- `agent-workflow/reports/WSD-20260504-04-daily-brief-detail-productization-closeout.md`

## 6. 禁止改动范围

- 不改动 `01-Signals/` 内容源。
- 不改动 `sync-data.mjs`。
- 不改变 Daily Brief 自动化口径。

## 7. 预期输出

- Daily Brief 详情页产品化调整。
- 桌面端 / 移动端验收说明。
- 收口文件：`agent-workflow/reports/WSD-20260504-04-daily-brief-detail-productization-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [x] `node --check 04-Site/js/app.js`
- [ ] 浏览器桌面 / 移动端检查；未运行需说明风险

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否
- 是否可能影响 `ai-2`：否
- 是否可能影响 `ai-3`：否

仅调整展示和文案时不影响自动化；若执行窗口发现必须改数据字段或同步脚本，应停止并回到调度中枢确认。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
目标是收口 Daily Brief 详情页的商业内参感、阅读路径和文案克制度。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-04-daily-brief-detail-productization-closeout.md
```

