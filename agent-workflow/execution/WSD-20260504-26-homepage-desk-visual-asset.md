# WSD-20260504-26-homepage-desk-visual-asset 派发单

日期：2026-05-04  
状态：ready-after-P0-10  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue / copy / dev / qa`

## 1. 任务目标

在 `P0-10` 网站 UI 方向确认后，单独优化首页右侧海报图 / Intelligence Desk 样张，使其达到参考 demo 的首页质感要求，并完成桌面与移动端验收。

## 2. 非目标

- 不重做全站 UI。
- 不改内容源 Markdown。
- 不改同步脚本或自动化任务。
- 不恢复三图轮播。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Design Director | 输出主视觉规范、构图、资产规则和移动端裁切规则 |
| Copy Agent | 输出样张内短文案和禁用语检查 |
| Dev Agent | 按规范落地首页右侧主视觉 |
| QA / Acceptance Agent | 做桌面 / 移动截图、像素与文案验收 |

## 4. 执行前置

必须等待 `P0-10 / WSD-20260504-25-site-ui-design-direction` accepted 后执行。

## 5. 允许改动范围

- `04-Site/index.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`，仅限首页样张渲染。
- 必要视觉资产文件。
- `agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

## 6. 禁止改动范围

- 不改内容源 Markdown。
- 不改 `04-Site/data/`。
- 不改同步脚本、关系检查脚本、统一同步闸门。
- 不改自动化任务。

## 7. 预期输出

- 首页右侧主视觉 / Intelligence Desk 样张最终方案。
- UI/UE 页面规范表。
- Copy 文案规范表。
- Dev 按表实现说明。
- 桌面 / 移动端截图。
- 收口文件：`agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] `node --check 04-Site/js/app.js`
- [ ] 浏览器桌面 / 移动端截图检查
- [ ] 首页无横向溢出检查
- [ ] 前台禁用语检查

## 9. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-26-homepage-desk-visual-asset.md
5. P0-10 的 accepted closeout

本任务必须等 P0-10 accepted 后执行。目标是单独优化首页右侧海报图 / Intelligence Desk 样张，不恢复三图轮播。

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md
```
