# WSD-20260504-01-copy-audit 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`copy`

## 1. 任务目标

对全站普通前台做 Copy 语气审计，清理遗留内部话术、说服式表达、空泛表达和不符合观澜AI商业内参气质的文案。

优先检查：

- 首页
- Daily Brief 列表页与详情页
- Signals 栏目页与 Signal 详情页
- The Point 栏目页、人物页、素材页
- Opportunities 列表页与详情页
- Trends 列表页与详情页
- 注册、登录、账户、订阅、购买占位页

## 2. 非目标

- 不改动数据模型。
- 不改动同步脚本或自动化任务。
- 不做大范围 UI 重构。
- 不新增前台栏目。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Copy Agent | 主审计与文案修改建议 / 小范围落地 |
| UI / UE Agent | 仅在文案长度影响页面层级时给出建议 |
| Dev Agent | 如需落地前台 JS/HTML 文案，由执行窗口自行小范围修改 |
| QA Agent | 后续抽查普通前台无内部话术 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-01-copy-audit.md`
5. `agent-workflow/agents/copy-agent.md`
6. `agent-workflow/product/COPY.md`
7. `agent-workflow/product/DESIGN.md`

## 5. 允许改动范围

- `04-Site/*.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css` 仅限文案长度导致的轻微布局修正
- `agent-workflow/reports/WSD-20260504-01-copy-audit-closeout.md`
- 必要时新增 `agent-workflow/reports/copy-audit-2026-05-04.md`

## 6. 禁止改动范围

- 不改动 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/` 内容源。
- 不改动 `sync-data.mjs`、`check-relations.mjs`、`unified-site-sync.mjs`。
- 不改动自动化提示词。
- 不恢复“证据链 / 强证据 / 来源明确 / 阅读证据 / 机会确定 / 下一步验证”等表达。

## 7. 预期输出

- 主交付物：前台 Copy 审计与必要的小范围文案修正。
- 收口文件：`agent-workflow/reports/WSD-20260504-01-copy-audit-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [x] 如修改 `04-Site/js/app.js`，运行 `node --check 04-Site/js/app.js`
- [ ] 浏览器桌面 / 移动端抽查，若未运行必须说明原因

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否
- 是否可能影响 `ai-2`：否
- 是否可能影响 `ai-3`：否

本任务只涉及普通前台文案，不改变 Markdown 字段、同步脚本或自动化顺序。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-01-copy-audit.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
重点按 Copy Agent 口径审计全站普通前台文案，清理内部话术、说服式表达和空泛表达。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-01-copy-audit-closeout.md

收口文件必须写清：做了什么、改了哪些文件、运行了哪些检查、哪些检查未运行及风险、是否影响自动化任务、下一步回到调度中枢窗口处理什么。
```

