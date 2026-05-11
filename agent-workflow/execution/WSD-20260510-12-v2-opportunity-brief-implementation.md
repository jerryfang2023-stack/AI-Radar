# WSD-20260510-12-v2-opportunity-brief-implementation 派发单

日期：2026-05-10  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`dev`  
协作 Agent：`ui-ue` / `copy` / `data` / `qa` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-OPPORTUNITY-BRIEF-IMPLEMENT`
- Task ID：`WSD-20260510-12-v2-opportunity-brief-implementation`
- 任务类型：页面类 / 开发类 / QA 类
- 派发模式：autopilot_chain
- 派发单：`agent-workflow/execution/WSD-20260510-12-v2-opportunity-brief-implementation.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md`
- 收口箱登记：`agent-workflow/inbox/closeout-queue.jsonl`
- 调度口令：`收口：WSD-20260510-12-v2-opportunity-brief-implementation`
- 是否可能影响自动化：否
- 是否需要更新 `current-context.md`：否，除非实现中发现必须改变栏目角色、会员边界或一级导航
- 是否写入收口箱：是
- Skill Pattern：Tool Wrapper + Pipeline + Reviewer
- Pattern 顺序：读取已验收设计规范 -> 分阶段实现机会中心 / 商业内参 -> 桌面与移动截图 QA -> closeout
- 硬停顿：不得改变一级导航；不得改 VI token / Logo / SVG 资产；不得改自动化、schema、内容源、Netlify、GitHub；不得继承 `V2-SITE-QUALITY-AUTO` failed 成果；如发现现有数据无法支撑页面，不得硬改 schema，先用安全 fallback 并在 closeout 列出 Data 后续任务
- Reviewer：UI / UE Design Director + QA Agent

执行窗口最短启动提示词：

```text
执行任务：WSD-20260510-12-v2-opportunity-brief-implementation
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 agent-workflow/execution/WSD-20260510-12-v2-opportunity-brief-implementation.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md。
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：WSD-20260510-12-v2-opportunity-brief-implementation
```

## 1. 任务目标

基于已验收的 V2 设计规范，把“机会中心 / 机会解码”和“商业内参”两个一级栏目的页面落到 `01-SiteV2/site/`，使本地 V2 网站可以直接体验这两个栏目的新设计。

说明：用户口中的“机会中心”按当前 V2 导航口径执行为“机会解码”栏目，不新增一级导航，不改名。

必须实现：

- 机会解码列表页：栏目标题区、最新报告、观察中方向、历史报告、内参关联。
- 机会解码详情页：报告阅读链、趋势背景、观点校准、风险 / 反证、成立边界、建议关注变量、关联内容。
- 商业内参列表 / 入口页：最新一期封面、本期总判断、热力摘要、核心判断、来源摘要、往期内参、会员说明。
- 商业内参会员态 / 锁定态：普通用户、登录用户、会员、管理员边界清晰；锁定态只锁受限模块，不整页遮挡。
- 商业热力图模块：行业 x 岗位 x 流程三元组、升温 / 降温 / 争议表达、克制色彩，不做公开榜单。

## 2. 非目标

- 不新增或改变一级导航。
- 不修改 `docs/brand/wavesight-ai-vi/`。
- 不修改 VI token、Logo、SVG 资产或生成脚本。
- 不修改 `01-SiteV2/content/` 内容源和 schema。
- 不修改自动化、Netlify、GitHub、部署配置。
- 不实现支付、会员定价、下载 / 保存 / 分享。
- 不把 `V2-SITE-QUALITY-AUTO` 的 failed / not-accepted 成果作为通过依据。

## 3. 阶段安排

### Stage A：机会解码实现

实现范围：

- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/opportunity-detail.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

依据：

- `agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-spec.md`
- `agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-matrix.md`

硬要求：

- 证据不足的 Deep Dive 显示为“观察中方向 / 证据缺口”，不得包装成正式深度报告。
- “行动地图”统一转为“建议关注变量”。
- Opportunity 标题不能用公司名。
- 页面不能像新闻列表、后台资产页或模板卡片墙。

### Stage B：商业内参实现

实现范围：

- `01-SiteV2/site/brief.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

依据：

- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-spec.md`
- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-matrix.md`

硬要求：

- 商业内参是会员 / 增值产品入口，不是普通文章栏目。
- 商业热力图不做公开榜单、公司榜或岗位替代榜。
- 普通用户、登录用户、会员、管理员四状态边界清楚。
- 锁定态只锁受限模块，不整页遮挡标题和总判断。
- 下载 / 保存 / 分享不进入本轮实现。

### Stage C：QA 与收口

必须完成：

- 桌面 1440px 截图：机会解码列表、机会详情、商业内参。
- 移动 390px 截图：机会解码列表、机会详情、商业内参。
- 横向溢出检查。
- 导航栏位置、字号、背景融合检查。
- 普通前台不得出现 Admin、JSON、同步、字段、后台、证据链、强证据等内部词。
- 商业内参四状态检查：普通用户、登录用户、会员、管理员。
- UI / UE Design Director 按已验收 spec 复评。
- QA Agent 给出是否可进入下一轮数据 / 会员能力任务的结论。

## 4. 执行窗口必须读取

默认读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 本派发单

任务补读：

- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/COPY.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- `docs/brand/wavesight-ai-vi/typography-guidelines.md`
- `agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-spec.md`
- `agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-matrix.md`
- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-spec.md`
- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-matrix.md`

可只读参考：

- `01-SiteV2/content/08-opportunities/`
- `01-SiteV2/content/05-trend-chain/`
- `01-SiteV2/content/07-points/`
- `01-SiteV2/content/10-databases/`

## 5. 允许改动范围

- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/opportunity-detail.html`
- `01-SiteV2/site/brief.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- 可新增 QA 截图 / 报告目录：`agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation/`
- `agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md`
- `agent-workflow/inbox/closeout-queue.jsonl`

## 6. 禁止改动范围

- `docs/brand/wavesight-ai-vi/`
- `01-SiteV2/content/`
- `01-SiteV2/knowledge/`
- `agent-workflow/tools/`
- `netlify.toml`
- Git / GitHub / Netlify / Codex automation 配置
- V1 归档目录 `10-Archive/`
- `09-ai-news-radar/`

## 7. 预期输出

主交付物：

- 机会解码页面实现。
- 机会详情页实现。
- 商业内参页面实现。
- 桌面 / 移动截图验收。
- 商业内参四状态边界说明。
- UI / UE Design Director 复评。
- QA 验收表。

收口文件：

- `agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md`

收口箱登记：

```json
{"task_id":"WSD-20260510-12-v2-opportunity-brief-implementation","board_id":"V2-OPPORTUNITY-BRIEF-IMPLEMENT","closeout_path":"agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md","status":"ready_for_review","created_at":"YYYY-MM-DDTHH:mm:ss+08:00","owner":"dev"}
```

## 7S. Skill Pattern Gate

| 项目 | 结论 |
|---|---|
| 主 Pattern | Tool Wrapper + Pipeline + Reviewer |
| Pattern 组合顺序 | 读取已验收设计规范 -> Stage A 机会解码 -> Stage B 商业内参 -> Stage C QA / 截图 / closeout |
| 为什么选这个 Pattern | 两个栏目设计已验收，本轮是按规范实现和验收，不再重新设计 |
| 必须读取的 Tool Wrapper / 规范 | DESIGN、COPY、VI、两个栏目 design spec / matrix |
| 必须生成的 Generator 产物 | 页面实现、截图、QA 报告、closeout |
| 必须独立执行的 Reviewer | UI / UE Design Director、QA Agent |
| 必须先诊断 / 先确认的 Inversion 节点 | 若现有数据无法支撑正式报告 / 会员态，不硬改 schema，使用安全 fallback 并列后续任务 |
| Pipeline 阶段顺序 | A 机会解码 -> B 商业内参 -> C QA |
| 硬停顿 | 需要改一级导航、schema、自动化、会员定价、支付、VI token、Netlify / GitHub 时停止 |
| closeout 必须提供的 Pattern 证据 | 阶段完成说明、改动文件、截图路径、QA 表、未做事项 |

## 7P. 产品功能类任务硬性要求

本任务不重新做产品门禁；必须继承两个已 accepted 设计任务的 PM / WAVE 结论：

- `V2-OPPORTUNITY-DESIGN / WSD-20260510-10-v2-opportunity-decode-design`
- `V2-BUSINESS-BRIEF-DESIGN / WSD-20260510-11-v2-business-brief-design`

如执行中发现必须新增产品模块、改变会员边界或改变栏目角色，必须停止并回调度窗口，不得自行进入 Dev。

## 7A. 页面类任务硬性要求

Dev 必须逐条按两个设计 spec 实现，并在 closeout 中说明：

- 哪些模块已实现。
- 哪些模块因数据不足采用 fallback。
- 哪些设计要求未实现及原因。
- 桌面 / 移动截图路径。
- 导航栏、字体、间距、背景、Logo 是否符合最新 DESIGN / VI。
- 是否存在横向溢出、遮挡、重叠或按钮文字拥挤。

Design Director 复评通过线：

- 机会解码栏目 / 详情页：>= 80。
- 商业内参会员核心页：>= 85。

## 7B. 文案类任务硬性要求

必须按两个设计 spec 的 Copy 表执行：

- 公开前台不得出现内部流程语：Admin、JSON、同步、字段、后台、证据链、强证据、下一步验证。
- 机会标题不能写公司名。
- 机会解码使用“观察中方向”“建议关注变量”。
- 商业内参使用“本期热力变化”“完整来源与边界保留在会员层”等克制表达。
- 不写“立即赚钱”“确定机会”“岗位替代榜”“公开热力榜”等禁用表达。

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] `node --check 01-SiteV2/site/assets/app.js`
- [ ] 本地浏览器桌面 1440px 截图：机会解码列表 / 机会详情 / 商业内参
- [ ] 本地浏览器移动 390px 截图：机会解码列表 / 机会详情 / 商业内参
- [ ] 横向溢出检查
- [ ] 商业内参四状态：普通用户 / 登录用户 / 会员 / 管理员
- [ ] 页面类：UI/UE Design Director 复评
- [ ] 页面类：QA 桌面 / 移动截图和坐标/字号/间距/文案验收
- [ ] 文案类：禁用语、判断边界和容器适配验收

未运行的检查必须在 closeout 中说明原因和风险。

## 9. V2 自动化影响

- 是否可能影响 `v2-content-site-daily-update`：否。
- 是否可能影响内容入库、知识库、站点生成或部署：否。
- 如需内容字段调整，不得在本任务修改，另派 Data schema 任务。

## 10. 外部 GitHub skill / repo 安全审查

本任务默认不安装、不引用外部 GitHub repo。如执行窗口确需引用外部设计 repo 或 skill，必须在 closeout 中写明来源、安全风险和适配边界。

## 11. 执行窗口启动提示词

```text
执行任务：WSD-20260510-12-v2-opportunity-brief-implementation
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 agent-workflow/execution/WSD-20260510-12-v2-opportunity-brief-implementation.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：
agent-workflow/reports/WSD-20260510-12-v2-opportunity-brief-implementation-closeout.md
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：WSD-20260510-12-v2-opportunity-brief-implementation
```
