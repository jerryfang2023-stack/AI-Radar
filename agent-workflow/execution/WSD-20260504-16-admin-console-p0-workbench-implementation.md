# WSD-20260504-16-admin-console-p0-workbench-implementation 派发单

日期：2026-05-04  
状态：review  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue` / `dev`  
协作 Agent：`copy` / `qa` / `pm`

## 1. 任务目标

- 基于 `PRD-007-admin-console.md` 和 Admin 需求报告，完成 Admin P0 单页工作台的信息架构、页面设计、前端实现和基础验收。
- 将当前 `04-Site/admin.html` 从本地控制台原型升级为后台专属管理工作台。
- 保留现有同步、内容编辑、用户权限和订阅记录能力，不接入真实云端数据库、真实支付或复杂权限系统。
- 完成后生成 UTF-8 closeout，回到调度中枢验收。

## 2. 必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md`
5. `agent-workflow/prd/active/PRD-007-admin-console.md`
6. `agent-workflow/reports/admin-console-requirements-2026-05-04.md`
7. `agent-workflow/product/DESIGN.md`
8. `agent-workflow/product/COPY.md`
9. `agent-workflow/agents/ui-ue-agent.md`
10. `agent-workflow/agents/dev-agent.md`
11. `agent-workflow/agents/qa-agent.md`
12. `04-Site/admin.html`
13. `04-Site/js/app.js`
14. `04-Site/css/styles.css`

## 3. 非目标

- 不接入真实云端数据库。
- 不接入真实支付网关。
- 不实现复杂多管理员角色系统。
- 不改每日雷达、The Point 或统一同步自动化的运行顺序。
- 不把 Admin 功能放入普通前台导航。
- 不改内容源 Markdown。
- 不改 `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs`。

## 4. 允许改动范围

- `04-Site/admin.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- 必要截图：`agent-workflow/reports/*admin-console-p0*.png`
- 收口文件：`agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md`

如确需修改其他前台文件以修复 Admin 边界泄漏，必须在 closeout 中说明原因和影响。

## 5. 禁止改动范围

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `04-Site/scripts/`
- 自动化任务配置或提示词

## 6. P0 页面结构

Admin 第一阶段仍保留单页 `admin.html`，但必须形成后台专属信息架构：

```text
Admin 顶部 / 侧栏导航
├─ 今日工作台
├─ 内容管理
├─ 用户与权限
├─ 订阅与订单
├─ 质量检查
└─ 系统设置
```

首屏应回答：

```text
今天能不能发布？
```

首屏状态建议包含：

- 同步状态。
- 内容状态。
- 质量检查状态。
- 用户 / 订单状态。
- 发布前 checklist。

## 7. UI / UE 要求

- Admin 是运营后台，不是普通前台栏目页。
- 使用后台专属导航，不沿用普通前台栏目导航节奏。
- 首屏以状态和操作为主，不做大面积品牌展示。
- 信息密度高但不拥挤，优先支持重复操作和快速扫读。
- 内容管理优先列表、搜索、筛选、结构化摘要，高级 JSON 只作为展开能力。
- 用户与订单优先表格 / 列表，不做营销卡片。
- 高风险操作必须有明确提示或二次确认。
- 桌面端优先完成主要管理操作，移动端至少可查看关键状态。

## 8. Copy 要求

后台文案面向管理员任务，不使用公开前台商业化表达。

推荐：

- `今日待处理`
- `同步最新数据`
- `保存到网站数据文件`
- `仅保存到当前浏览器`
- `关系检查通过`
- `仍有软提醒需要复核`
- `延长阅读权限`
- `发布前检查`
- `手动确认支付`

避免：

- `试读审批`
- `申请访问`
- `随便改一下`
- `内部临时入口`
- `看起来没问题`
- `用户一定会转化`

## 9. Dev 要求

- 保留现有 Admin 能力，不因重构丢失同步、编辑、用户权限、订阅记录等入口。
- 把 JSON 编辑降级为高级能力，不作为唯一管理方式。
- 增加质量检查入口和发布 checklist 展示。
- 高风险操作增加确认或明确风险提示。
- 普通前台不得出现 Admin 导航、编辑、同步、恢复、JSON、质量检查入口。

## 10. QA 要求

必须检查：

- Admin 桌面端截图。
- Admin 移动端截图。
- 普通用户、登录有效用户、到期用户、管理员四种状态。
- 普通前台无后台痕迹。
- Admin 删除、权限缩短、手动确认支付等高风险操作有提示。
- 常用操作不需要滚动过深。

阻塞标准：

- 普通前台出现编辑、同步、恢复、JSON、质量检查、Admin 导航。
- Admin 删除、权限缩短、手动确认支付无提示。
- 同步或质量检查状态不可辨认。
- 现有 Admin 核心能力被重构丢失。

## 11. 必跑检查

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] Admin 桌面端浏览器截图
- [ ] Admin 移动端浏览器截图
- [ ] 普通前台后台痕迹检查
- [ ] 四种访问状态轻量验收

如未运行某项，必须在 closeout 中说明原因和风险。

## 12. 自动化影响

预计不影响：

- `ai-the-point`
- `ai-2`
- `ai-3`

原因：本任务只改 Admin 展示层和本地管理交互，不改 Markdown 字段、同步脚本、关系检查或统一同步闸门。

如果执行过程中需要改同步脚本、内容字段或自动化规则，必须停止并回到调度中枢确认。

## 13. 预期输出

- Admin P0 单页工作台落地。
- 桌面端 / 移动端截图。
- 前后台边界检查结果。
- UTF-8 closeout：

```text
agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md
```

## 14. 执行窗口启动提示词

如果复制长提示词不方便，可直接让执行窗口读取：

```text
agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation-window-prompt.md
```
