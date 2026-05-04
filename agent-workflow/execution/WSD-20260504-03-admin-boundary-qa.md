# WSD-20260504-03-admin-boundary-qa 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`qa`

## 1. 任务目标

复查普通前台与 Admin 边界，按未登录、阅读权限有效、阅读权限到期、管理员四种状态验收。

重点确认普通前台不出现：

- Admin 入口
- 编辑控件
- 同步 / 恢复
- JSON
- 后台状态或内部字段

## 2. 非目标

- 不重构 Admin 页面。
- 不接入真实支付或真实云端权限。
- 不改变会员策略。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| QA Agent | 独立验收四种身份状态 |
| Dev Agent | 修复明确泄漏或权限判断错误 |
| PM Agent | 判断是否需要后续 PRD |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-03-admin-boundary-qa.md`
5. `agent-workflow/agents/qa-agent.md`
6. `agent-workflow/prd/active/PRD-005-membership-access.md`
7. `agent-workflow/execution/acceptance-checklist.md`

## 5. 允许改动范围

- `04-Site/js/app.js` 仅限权限边界或后台痕迹修复
- `04-Site/*.html` 仅限入口文案或可见入口修复
- `agent-workflow/reports/WSD-20260504-03-admin-boundary-qa-closeout.md`
- 必要时新增 `agent-workflow/reports/admin-boundary-qa-2026-05-04.md`

## 6. 禁止改动范围

- 不改动内容源 Markdown。
- 不改动自动化任务。
- 不新增真实支付、真实登录或云端写入。

## 7. 预期输出

- 四种身份验收表。
- 普通前台后台痕迹检查结果。
- 阻塞项和发布建议。
- 收口文件：`agent-workflow/reports/WSD-20260504-03-admin-boundary-qa-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [x] 如修改 `04-Site/js/app.js`，运行 `node --check 04-Site/js/app.js`
- [x] 多身份权限检查
- [ ] 浏览器截图建议运行；未运行需说明风险

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否
- 是否可能影响 `ai-2`：否
- 是否可能影响 `ai-3`：否

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-03-admin-boundary-qa.md

你是本任务的独立 QA 执行窗口，只处理派发单中允许的范围。
按未登录、阅读权限有效、阅读权限到期、管理员四种状态验收普通前台与 Admin 边界。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-03-admin-boundary-qa-closeout.md
```

