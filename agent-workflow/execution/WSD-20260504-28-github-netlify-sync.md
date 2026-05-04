# WSD-20260504-28-github-netlify-sync 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前调度中枢窗口  
牵头 Agent：`dev / workflow`

## 1. 任务目标

将当前已验收、应进入版本管理的网站代码与项目工作流文件同步到 GitHub，并将最新可部署网站更新到 Netlify。

本任务重点是“版本同步 + 预览部署更新 + 可访问性复核”，不是生产上线切换。

## 2. 非目标

- 不做正式 production launch 决策。
- 不配置正式域名。
- 不接入真实数据库、真实支付、真实邮件或生产账号系统。
- 不修改网站 UI、页面文案、数据模型或同步逻辑。
- 不合并、提交或部署 `P0-2A` void / abandoned 成果。
- 不合并、提交或部署 `P0-2B` failed / not accepted 成果。
- 不回滚、不删除不属于本任务的已有修改。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Dev Agent | 检查 Git 状态、整理提交范围、同步 GitHub、执行 Netlify 部署 |
| Workflow / Automation Agent | 记录版本、commit、push、deploy URL、部署边界和自动化影响 |
| QA / Acceptance Agent | 部署后访问首页与关键栏目，确认远端可访问 |
| PM Agent | 确认本任务是 preview / site update，不是 production launch |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/dispatch-board.md`
5. `agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md`
6. `agent-workflow/reports/github-baseline-sync-2026-05-04.md`
7. `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`
8. 本派发单

## 5. 允许操作范围

- 检查 Git 状态、当前分支、远程地址和未提交文件。
- 提交并推送已验收、应入库的项目文件。
- 优先使用 GitHub / Netlify 插件或 connector；不可用时使用 `gh` / Netlify CLI，并在 closeout 中说明。
- 更新 Netlify 预览站点或默认站点部署。
- 必要时新增部署记录报告：
  - `agent-workflow/reports/github-netlify-sync-2026-05-04.md`
- 必须生成收口文件：
  - `agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

## 6. 禁止操作范围

- 不直接修改 `04-Site/` 页面、样式、脚本或数据内容，除非只是部署工具生成的非业务文件且必须说明。
- 不改 Markdown 内容源、字段规则、同步脚本、关系检查脚本或统一同步闸门。
- 不改自动化任务配置或提示词。
- 不使用破坏性 Git 命令，例如 `git reset --hard`、`git checkout --` 或删除陌生文件。
- 不把 failed / void 任务文件作为网站可部署成果合并；若这些文件已经在工作树中，需要在 closeout 明确处理方式与风险。
- 不把 Netlify Preview 可访问描述为正式生产上线完成。

## 7. 预期输出

1. Git 状态审计：当前分支、远程、未提交文件概览、哪些属于 accepted / ready / failed / void。
2. GitHub 同步结果：commit hash、branch、remote URL、push 结果。
3. Netlify 部署结果：站点名、Site ID、Deploy ID、部署 URL、默认站点 URL。
4. 远端访问检查：至少检查首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、data。
5. 明确未部署或未提交的内容及原因。
6. 自动化影响判断。
7. 主报告：`agent-workflow/reports/github-netlify-sync-2026-05-04.md`
8. 收口文件：`agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

## 8. 必跑检查

- [ ] `git status --short`
- [ ] `git branch --show-current`
- [ ] `git remote -v`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] Netlify 远端访问检查：首页、Daily、Signals、The Point、Opportunities、Trends
- [ ] CSS / JS / data 远端 200 检查

如执行窗口认为需要同步网站数据，再运行：

- [ ] `node 04-Site/scripts/sync-data.mjs`
- [ ] `node 04-Site/scripts/check-relations.mjs`

未运行项必须说明原因和风险。

## 9. 自动化影响

- `ai-the-point`：默认不影响。
- `ai-2`：默认不影响。
- `ai-3`：默认不影响。

本任务可能影响上线准备路径和 Netlify 预览站点。若执行窗口发现部署过程中需要修改 Markdown 命名、字段规则、同步脚本、统一同步闸门、自动化时间线或内容生成口径，必须先标注“可能影响自动化任务”，并停止直接修改，回到调度中枢确认。

## 10. 验收硬规则

调度中枢收到 closeout 后，必须检查：

- 是否提交并推送到了 GitHub。
- 是否写清 commit hash、branch 和 remote。
- 是否部署到了 Netlify，并提供可访问 URL。
- 是否检查远端关键页面和静态资源。
- 是否明确 `P0-2A`、`P0-2B` 没有作为成功成果部署。
- 是否说明 Netlify Preview 不等于正式 production launch。
- 是否说明自动化影响。

缺少 commit / deploy / URL / 访问检查任一项，不得标记 accepted。

## 11. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/dispatch-board.md
5. agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md
6. agent-workflow/reports/github-baseline-sync-2026-05-04.md
7. agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md
8. agent-workflow/execution/WSD-20260504-28-github-netlify-sync.md

你是本任务的独立执行窗口，由 Dev Agent 与 Workflow / Automation Agent 牵头。

任务目标：
将当前已验收、应进入版本管理的网站代码与项目工作流文件同步到 GitHub，并将最新可部署网站更新到 Netlify。

严格边界：
- 不做正式 production launch。
- 不配置正式域名。
- 不改网站 UI、文案、数据模型或自动化逻辑。
- 不合并、提交或部署 P0-2A void / abandoned 成果。
- 不合并、提交或部署 P0-2B failed / not accepted 成果。
- 不使用 git reset --hard、git checkout -- 或删除陌生文件。
- Netlify Preview 可访问不等于正式上线完成。

执行要求：
1. 先审计 git status、当前分支、remote 和未提交文件。
2. 判断哪些变更属于 accepted / ready / failed / void，提交前写清范围。
3. 只提交应进入版本管理的文件。
4. 推送到 GitHub，记录 branch、commit hash、remote URL。
5. 更新 Netlify 站点部署，记录 Site ID、Deploy ID、部署 URL。
6. 检查远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、data 是否可访问。
7. 生成主报告：
agent-workflow/reports/github-netlify-sync-2026-05-04.md
8. 生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md

收口文件必须写清：
- 做了什么
- 提交了哪些文件类别
- 未提交/未部署哪些内容及原因
- GitHub branch、commit hash、remote URL、push 结果
- Netlify Site ID、Deploy ID、部署 URL、默认 URL
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响 ai-the-point、ai-2、ai-3
- 是否建议调度中枢标记 accepted / blocked / failed

完成后回到调度中枢窗口汇报：
收口：agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md
```
