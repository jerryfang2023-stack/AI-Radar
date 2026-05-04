# WSD-20260504-17-netlify-preview-deploy 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`dev`  
协作 Agent：`pm` / `qa` / `workflow`

## 1. 任务目标

- 将当前 01-WaveSight 项目的可运行网站部署到 Netlify 预览环境。
- 返回一个外部可访问的 Netlify Preview URL。
- 完成部署前基础检查、部署后浏览器访问检查和收口记录。
- 本任务只做预览环境，不做正式生产发布、正式域名绑定、数据库迁移或自动化上线。

## 2. 非目标

- 不改内容源 Markdown。
- 不改每日自动化任务提示词、时间线或同步闸门。
- 不接入真实数据库。
- 不配置正式域名、付费套餐、组织权限或生产环境发布策略。
- 不合并未验收的派生工作树成果。
- 不把 Admin 作为普通前台入口暴露给用户。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Dev Agent | 确认静态站点部署目录、Netlify 配置、部署执行、URL 输出 |
| PM Agent | 控制范围，确认这是 preview deploy 而不是 production launch |
| QA / Acceptance Agent | 访问 Netlify URL，检查首页和主要栏目是否可打开 |
| Workflow / Automation Agent | 写收口文件、记录部署环境、标注自动化影响 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/governance/quality-gates.md`
5. `agent-workflow/governance/plan-first-policy.md`
6. `agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md`
7. `agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy-window-prompt.md`
8. `agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md`
9. `04-Site/README.md`
10. `04-Site/config/content-paths.json`

## 5. 允许改动范围

优先不改代码，仅部署当前可运行站点。

如 Netlify 静态部署确实需要配置文件，可改：

- `netlify.toml`
- `04-Site/_redirects`
- `04-Site/_headers`
- `agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`
- 必要截图或验证报告文件

如果需要修改 `04-Site/index.html`、`04-Site/js/app.js`、`04-Site/css/styles.css` 才能让预览环境可访问，必须在 closeout 中说明原因、改动范围和风险。

## 6. 禁止改动范围

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-Point/`
- `07-Opportunities/`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- 自动化任务提示词或运行顺序

## 7. 部署要求

- 优先使用 Netlify 插件 / connector 能力完成部署；如果不可用，再使用 Netlify CLI 或 Netlify Web 流程。
- 部署目录应优先选择 `04-Site/`，除非检查发现当前站点需要其他发布目录。
- 如使用 Netlify CLI，不要把 token、账号信息或敏感配置写入仓库。
- 如需创建 Netlify 站点，站点名称建议包含 `wavesight` 或 `ai-radar-preview`，并在 closeout 中记录。
- 预览 URL 必须能从外部浏览器访问。
- 如果部署失败，必须写明失败阶段、错误摘要、已尝试方案和下一步阻塞点。

## 8. 必跑检查

部署前：

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 确认 `04-Site/` 内首页和关键静态资产存在

部署后：

- [ ] 打开 Netlify Preview URL
- [ ] 首页可访问
- [ ] Daily Brief 可访问
- [ ] Signals 可访问
- [ ] The Point 可访问
- [ ] Opportunities 可访问
- [ ] Trends 可访问
- [ ] 主要 CSS / JS / data 文件加载正常
- [ ] 普通前台不出现 Admin、JSON、同步、编辑、恢复等后台痕迹

如未运行某项，必须在 closeout 中说明原因和风险。

## 9. 自动化影响

本任务可能影响上线准备路径，但默认不影响每日内容自动化。

预计不影响：

- `ai-the-point`
- `ai-2`
- `ai-3`

如果执行过程中改变 Markdown 命名、内容字段、同步脚本、统一同步闸门、部署入站顺序或自动化提示词，必须立即停止并回调度中枢确认。

## 10. 预期输出

- Netlify Preview URL。
- 如新增配置，说明新增配置文件和原因。
- 部署前检查结果。
- 部署后访问检查结果。
- 收口文件：`agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

## 11. 执行窗口启动提示词

如果新窗口不方便复制整段任务，请直接让它读取：

```text
agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy-window-prompt.md
```
