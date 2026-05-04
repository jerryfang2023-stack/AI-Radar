# WSD-20260504-25-site-ui-design-direction 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue / strategy / pm / copy`

## 1. 任务目标

在不直接改代码的前提下，由 UI / UE Design Director 牵头重新定义观澜AI网站 UI 优化方向，输出全站 Art Direction、页面母版、DESIGN v2 草案和验收基线。

本任务用于承接 `WSD-20260504-18-homepage-ui-copy-redesign` failed 后的重新规划，避免继续用局部 CSS 返工首页。

## 2. 非目标

- 不直接修改 `04-Site/`。
- 不生成最终首页海报图。
- 不进入 Dev 实现。
- 不改变栏目、数据模型、权限或自动化任务。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Design Director | 输出 Art Direction、页面母版、DESIGN v2 草案和审美阻塞项 |
| Strategy Agent | 确认视觉方向是否服务产品定位 |
| PM Agent | 控制范围、拆分后续任务 |
| Copy Agent | 确认视觉方向与首页价值表达、栏目文案可协同 |
| Workflow / Automation Agent | 记录收口和后续任务 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/agents/ui-ue-agent.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`
7. `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`
8. `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`

## 5. 允许改动范围

- `agent-workflow/product/DESIGN.md`，仅限新增 DESIGN v2 草案或明确升级方向。
- `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`
- 必要时新增 `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`

## 6. 禁止改动范围

- 不改 `04-Site/`。
- 不改内容源 Markdown。
- 不改同步脚本、关系检查脚本、统一同步闸门。
- 不改自动化任务。

## 7. 预期输出

- Art Direction。
- 全站页面母版方向：首页、栏目页、详情页、Admin、会员页、移动端。
- 字体 / 间距 / 色彩 / 材质系统建议。
- 首页右侧主视觉和判断样张方向。
- 审美阻塞项。
- 后续 Dev / Visual Asset / QA 任务拆分。
- 收口文件：`agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] Design Director 输出 Art Direction
- [ ] Copy 文案边界检查
- [ ] PM 后续任务拆分

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
4. agent-workflow/agents/ui-ue-agent.md
5. agent-workflow/execution/WSD-20260504-25-site-ui-design-direction.md

你是本任务的独立执行窗口，由 UI / UE Design Director 牵头。任务是重新定义观澜AI网站 UI 优化方向，不要直接改网站代码。

必须输出：
- Art Direction
- 全站页面母版方向
- DESIGN v2 草案或升级建议
- 首页右侧主视觉 / Intelligence Desk 样张方向
- 审美阻塞项
- 后续任务拆分

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md
```
