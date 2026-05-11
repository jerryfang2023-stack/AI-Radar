# WSD-20260510-04-builders-source-link-repair Closeout

日期：2026-05-10  
owner：`dev / data / workflow`  
状态：accepted  
编码：UTF-8

## 0. 调度摘要

```yaml
task_id: WSD-20260510-04-builders-source-link-repair
board_id: ad-hoc
status: accepted
recommended_status: accepted
dispatch_path: 无独立派发单（计划外修复）
closeout_path: agent-workflow/reports/WSD-20260510-04-builders-source-link-repair-closeout.md
changed_files:
  - 01-SiteV2/content/04-selected-signals/2026-05-10-front-signals.md
  - 01-SiteV2/content/07-points/2026-05-09-point-calibration.md
  - 01-SiteV2/content/07-points/2026-05-10-point-calibration.md
  - 01-SiteV2/content/07-points/refined/legacy-point-calibration-publish-ready-2026-05-08.md
  - 01-SiteV2/site/assets/app.js
  - 01-SiteV2/site/data/site-content.json
  - 01-SiteV2/site/data/site-content.js
  - agent-workflow/reports/builders-link-audit-2026-05-10-20260510-121154.md
  - agent-workflow/reports/builders-link-audit-2026-05-10-rerun-20260510-123019.md
gates:
  syntax: pass
  browser_desktop: not-run
  browser_mobile: not-run
  design_director: n/a
  pm_gate: n/a
automation_impact:
  ai-the-point: none
  ai-2: none
  ai-3: none
blockers:
  - none
next_action: 已由调度中枢验收并回填
```

## 1. 对应派发单

- 派发单：无独立派发单，本轮为用户在执行窗口内提出的计划外修复。
- 任务目标：
  - 查明 `关键信号 / Builders` 原文链接大量失效的原因。
  - 修复可直接修复的错误链接与缺失链接。
  - 保证 Builders 入口保留原文链接、日期，并为 X 来源提供稳定兜底入口。
  - 重跑 V2 内容与语法闸门，并重新生成站点数据。

## 2. 本轮完成

- 审计了当前 Builders 入口对应的 23 条观点链接，区分出三类问题：
  - 真 404：Sierra 官方链接 slug 失效。
  - 空链接：3 条 legacy refined point 丢失 `source_url`。
  - 环境可达性问题：大量 X 链接在当前网络环境下超时或被拦截，不是内容字段为空。
- 修复了 `2026-05-09` 与 `2026-05-10` 两条 Sierra 相关 Point 的 `source_url`，从失效 slug 改为可访问的官方文章链接。
- 修复了 3 条 legacy refined point 的 `source_url` 缺失问题，补回 Anthropic / X 原始来源。
- 修复了 `2026-05-10` Front Signal 正文中的 Sierra 官方来源链接，避免详情页正文与 Point 卡片口径不一致。
- 在 Builders / Point 卡片中为 X 链接新增“文本镜像”兜底入口，降低原站不可达时的阅读中断。
- 重新生成 `01-SiteV2/site/data/`，确保网站读取到最新内容与链接。

## 3. 修改文件

- `01-SiteV2/content/07-points/2026-05-09-point-calibration.md`：修复 `PT-20260509-03` 的 Sierra 官方链接。
- `01-SiteV2/content/07-points/2026-05-10-point-calibration.md`：修复 `PT-20260510-01` 的 Sierra 官方链接。
- `01-SiteV2/content/07-points/refined/legacy-point-calibration-publish-ready-2026-05-08.md`：补齐 `LPT-20260508-01/02/03` 的缺失原文链接。
- `01-SiteV2/content/04-selected-signals/2026-05-10-front-signals.md`：同步修正 Sierra 官方来源 URL。
- `01-SiteV2/site/assets/app.js`：Point / Builders 卡片保留原文链接，并为 X 来源新增“文本镜像”兜底入口；同时兼容 `sourceUrl` / `source_url` 的读取。
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
  - 以上两个文件由 V2 site data generator 重生成。
- `agent-workflow/reports/builders-link-audit-2026-05-10-20260510-121154.md`：首次 Builders 链接审计。
- `agent-workflow/reports/builders-link-audit-2026-05-10-rerun-20260510-123019.md`：复跑审计，验证修复后状态。

## 4. 验证结果

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-10`：成功重生成 `site-content.json/.js`。
- 二次抽查（Node fetch）非社媒 Builders 来源 10 条：9 条返回 200，仅 1 条官方 CSA 链接返回 403。
- 数据抽查：Builders 点位 `sourceUrl` 缺失 HTTP 链接数量为 `0`。

未运行：

- `browser_desktop`：未运行。原因：本轮重点是链接字段修复与数据重生成，不是页面视觉验收。风险：需人工打开页面确认镜像入口文案与换行表现。
- `browser_mobile`：未运行。原因同上。风险：需人工确认移动端 Point 卡片中“双链接”未挤压布局。

## 4A. 页面 / 文案类任务验收

不适用，原因：本轮不是页面审美升级任务，只对现有 Point / Builders 卡片追加原文访问兜底入口，未改栏目结构、视觉体系或公开主文案策略。

## 5. 自动化影响

- `ai-the-point`：none
- `ai-2`：none
- `ai-3`：none

说明：

- 未改旧 V1 自动化。
- 未恢复旧 `04-Site`。
- 仅使用现有 V2 site data generator 更新 `01-SiteV2/site/data/`。

## 6. 风险与遗留

- 风险：
  - X / YouTube 一类链接在部分网络环境下仍可能超时或被拦截，这不是内容字段缺失，而是外部站点可达性问题。
  - `labs.cloudsecurityalliance.org` 对当前抓取环境返回 `403`，官方源仍保留，但自动审计会持续判为不可直连。
- 软提醒：
  - 若后续把 Builders 作为长期固定栏目继续扩展，建议补一条“外链健康度”日检，区分 `404/空链接/被拦截` 三种失败类型。
  - 若要进一步降低 X 链接失效率，建议把“文本镜像”能力前移到详情页或统一外链组件，而不只放在 Point 卡片。
- 需要用户确认：
  - 是否要把 YouTube / CSA 这类“官方仍在，但当前环境可达性差”的来源，统一补一个公开文本备份或二级镜像来源。

## 7. 建议调度中枢更新

- `dispatch-board.md`：可新增一条已完成的计划外修复记录，说明 Builders 原文链接口径已修复，后续若再做外链健康度治理需新建任务。
- `feature_list.json`：本轮不建议更新。
- `progress.md`：可补一条“Builders 原文链接修复 + X 文本镜像兜底已完成”。
- `docs/agent-handoff.md`：如需让后续窗口快速恢复上下文，建议补一条“Builders 入口已具备日期 / 原文链接 / X 镜像兜底，仍有少量外部站点环境可达性差异”的说明。

## 8. 下一步

建议下一个任务：

- 若调度中枢只需要本轮收口，建议直接 `accepted`。
- 若要继续治理外链稳定性，建议新建继任任务：`Builders / Point 外链健康度治理`，范围限定为：
  - 建立外链健康度检查脚本；
  - 为 X / YouTube / 403 官方源定义固定兜底规则；
  - 补桌面 / 移动端浏览器验收。

## 9. 调度中枢验收

验收时间：2026-05-10

验收结论：`accepted / link-data-repair`

调度中枢复验：

- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：passed，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-10-20260510-050238.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-10-20260510-050239.md`。

验收说明：

- 本轮作为 Builders / Point 链接与数据修复验收，不作为页面视觉升级任务验收。
- 已接受“桌面 / 移动浏览器截图未跑”的限制；若后续继续扩展外链组件或镜像入口，应单独补浏览器验收。
