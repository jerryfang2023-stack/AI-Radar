# WSD-20260508-08 V2 前台备注性文案与页脚清理 Closeout

日期：2026-05-08  
owner：`UI / UE Agent + Copy Agent + Dev Agent`  
状态：review  
编码：UTF-8

## 0. 调度摘要

```yaml
task_id: WSD-20260508-08-v2-public-copy-footer-cleanup
board_id: ad-hoc-user-followup
status: review
recommended_status: accepted
dispatch_path: none
closeout_path: agent-workflow/reports/WSD-20260508-08-v2-public-copy-footer-cleanup-closeout.md
changed_files:
  - 01-SiteV2/site/assets/app.js
  - 01-SiteV2/site/assets/styles.css
  - 01-SiteV2/site/index.html
  - 01-SiteV2/site/daily.html
  - 01-SiteV2/site/signals.html
  - 01-SiteV2/site/opportunities.html
  - 01-SiteV2/site/brief.html
  - 01-SiteV2/site/daily-detail.html
  - 01-SiteV2/site/signal-detail.html
  - 01-SiteV2/site/opportunity-detail.html
  - 01-SiteV2/site/data/sample-content.js
  - docs/agent-handoff.md
  - agent-workflow/progress.md
gates:
  syntax: pass
  browser_desktop: pass
  browser_mobile: not-run
  design_director: evidence-required
  pm_gate: n/a
automation_impact:
  v2-site-sync: none
  netlify: paused
blockers:
  - none
next_action: 调度中枢验收并回填；如需更高等级视觉验收，派发 UI/UE 独立截图复核。
```

## 1. 对应派发单

- 派发单：无独立派发单，用户在当前执行窗口追加要求。
- 任务目标：
  - 检查并删除 V2 全站公开前台中类似“样例数据、对内备注、工程化说明、模板痕迹”的模块。
  - 修正网站页脚内容与形式，避免重复顶部导航、口号复读和说明性文案。
  - 暂不上传 Netlify。

## 2. 本轮完成

- 删除首页固定百分比“变化快照”模块。
- 删除首页“商业内参样张”占位卡。
- 删除机会页固定“观察中”样例卡。
- 删除机会页固定趋势样例卡。
- 删除信号页固定筛选标签和“信号到机会”样例段。
- 删除商业内参页固定“观察分布”矩阵和备注性“观察边界”段。
- 移除所有页面对 `sample-content.js` 的加载。
- 删除 `01-SiteV2/site/data/sample-content.js`，前台不再回退到样例数据。
- 清理公开页备注式表达，如“入库、候选池、判断边界、后台生成、请先生成”等。
- 页脚最终口径调整为低调品牌收尾：仅保留 Logo 与 `© 2026 WaveSight AI`。

## 3. 修改文件

- `01-SiteV2/site/assets/app.js`：
  - 移除 `WaveSightSample` fallback。
  - 缺真实站点数据时显示普通不可用提示。
  - 页脚改为低调 Logo + 版权信息，不再放栏目入口和解释性文案。
  - 详情页侧栏中“来源概况 / 报告侧记 / 状态”等偏内部表达做了收敛。
- `01-SiteV2/site/assets/styles.css`：
  - 重写 footer 样式为细线下的轻量底栏。
  - 移除旧 footer 导航样式。
- `01-SiteV2/site/index.html`：
  - 删除“变化快照”固定百分比模块。
  - 删除“商业内参样张”占位卡。
  - 调整栏目说明为读者语言。
- `01-SiteV2/site/signals.html`：
  - 删除固定 toolbar 标签。
  - 删除“信号到机会”样例段。
  - 清理“候选池 / 入库”等表达。
- `01-SiteV2/site/opportunities.html`：
  - 删除固定 toolbar、固定观察卡、固定趋势卡。
  - 清理“低频更新、只保留”等内部编辑口吻。
- `01-SiteV2/site/brief.html`：
  - 删除“观察分布”矩阵。
  - 删除备注性“观察边界”段。
  - 调整说明文字。
- `01-SiteV2/site/daily.html`：
  - 调整说明文字，删除“已整理 / 便于回看”等内部口吻。
- `01-SiteV2/site/daily-detail.html`、`signal-detail.html`、`opportunity-detail.html`：
  - 移除 `sample-content.js` 加载。
- `01-SiteV2/site/data/sample-content.js`：
  - 已删除。
- `docs/agent-handoff.md`：
  - 已记录本轮收口状态。
- `agent-workflow/progress.md`：
  - 已记录本轮进度。

## 4. 验证结果

已运行：

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/data/site-content.js`：通过。
- 8 个页面本地访问检查：全部 200。
- 浏览器检查（本机 Edge + Playwright）：
  - `index.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `daily.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `signals.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `opportunities.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `brief.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `daily-detail.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `signal-detail.html`：200，无空 section，无横向溢出，无指定备注性词句。
  - `opportunity-detail.html`：200，无空 section，无横向溢出，无指定备注性词句。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-185027.md`

未运行：

- 移动端浏览器截图：未运行。原因：本轮重点为快速清理与收口，已做桌面浏览器结构检查；建议 UI/UE 后续补移动截图。
- Netlify 部署：未运行。原因：用户明确要求暂时不上传到 Netlify。

## 4A. 页面 / 文案类任务验收

### 4A.1 UI/UE 页面规范表

- 页面类型：V2 公开前台多页面清理。
- 页面目标：去掉样例感、后台痕迹和不可信数据展示，让页面只展示真实数据或必要结构。
- 设计基准：`agent-workflow/product/DESIGN.md`、`docs/brand/wavesight-ai-vi/`。
- 布局基准：保留现有编辑型页面节奏，删除空壳模块后不新增装饰性卡片。
- 字体层级：沿用既有 V2 CSS，不新增大标题层级。
- 间距基准：删除模块后由既有 section rhythm 控制。
- 组件克制规则：页脚只保留 Logo + copyright，不重复导航。
- 前台 / Admin 边界：公开前台不出现后台、生成、同步、字段、JSON、候选池、入库等词。
- 桌面端验收点：无空 section、无横向溢出、footer 低存在感。
- 移动端验收点：未截图，建议后续补测。
- 禁止项：固定百分比、样例快照、样例卡、对内备注、重复导航型页脚。

### 4A.1A Design Director 证据化风格美观质检表

| 质检项 | 得分 | 说明 |
|---|---:|---|
| Style Purity / 风格一致性与纯净度 | 16 | 删除样例模块后，页面更接近编辑型产品口径。 |
| Proportion & Rhythm / 比例与韵律感 | 15 | 已删大块异常模块；未做逐屏截图微调。 |
| Color Sophistication / 色彩深度与平衡 | 16 | 未新增色彩负担，沿用 VI。 |
| Craftsmanship / 细节的艺术处理 | 15 | Footer 已收敛为轻量底栏；仍建议人工审美复核。 |
| Emotional Resonance / 情感共鸣 | 15 | 减少说明腔，保留克制感。 |
| Squint Test / 眯眼测试 | 通过 | 浏览器结构检查无空段和横向溢出。 |
| 总分 | 77 | 页面级快速清理，建议调度中枢按 review 接收后再派 UI 复核。 |
| 结论 | 通过但需复核 | 达到清理目标；非最终视觉验收。 |
| 必须重做的问题 | 无阻塞项。 |
| 可延后优化的问题 | 移动端截图、全站逐屏人工审美验收。 |

证据字段：

- 设计基准引用：`agent-workflow/product/DESIGN.md`、`docs/brand/wavesight-ai-vi/`。
- 桌面端截图：未落盘截图；使用本机 Edge + Playwright 做 DOM/布局检查。
- 移动端截图：未运行。
- 逐项扣分原因：缺少人工截图复核与移动端截图。
- Dev 实现偏差清单：无新增后台痕迹；footer 口径已按用户反馈二次收敛。
- QA 复核建议：调度中枢可派 UI/UE 单独跑桌面/移动截图验收。

### 4A.2 Dev 按表实现情况

- 已实现：模块删除、样例数据断链、footer 重写、语法检查。
- 未实现：Netlify 部署。
- 偏离规范：无；用户要求暂不 Netlify。
- 是否自行新增或改写 Copy 未提供的关键文案：是，进行删除和极少量替换；关键原则是减少说明，不新增说服性文案。
- 影响范围：V2 公开前台页面与前端渲染逻辑。

### 4A.3 Copy 文案规范表

- 页面/模块：首页、今日要点、关键信号、机会解码、商业内参、详情页侧栏、footer。
- 用户任务：删除对内备注性文字与模板感说明。
- 当前文案问题：入库、候选池、判断边界、保留来源、后台生成等词偏内部流程。
- 替换后文案：多数直接删除；必要处改为“今天最值得看的变化 / 回看过往变化 / 请稍后再试”等读者语言。
- 禁用语检查：浏览器检查未发现指定备注性词句。
- 判断边界：不再在 footer 复述判断边界；具体内容判断仍在文章正文保留。
- 标题长度与容器适配：未发现溢出。
- QA 文案验收点：继续检查长文内容中是否仍有内部流程词。

### 4A.4 QA 独立验收

- 桌面端截图：未落盘。
- 移动端截图：未运行。
- 对比页面或模块：已对全站 8 个页面做浏览器检查。
- 标题位置 / 字号 / 行高 / 模块起点：未做人工截图评分。
- 首屏主次：未改首屏结构。
- 字体层级：未新增层级。
- 间距一致性：删除模块后无空 section。
- 无横向溢出：通过。
- 普通前台无后台痕迹：指定词检查通过。
- 禁用语检查：通过。
- 判断边界检查：footer 和备注模块已清理。
- 标题长度与容器适配：未发现阻塞。
- 阻塞项：无。

## 5. 自动化影响

- `v2-site-sync`：无改动；未改变同步脚本输出结构。
- `sample-content.js`：已删除，前台不再 fallback 到样例数据。
- `netlify`：未执行，按用户要求暂停。

## 6. 风险与遗留

- 风险：本轮是前台快速清理，未做完整移动端截图。
- 软提醒：长文正文仍可能残留内部编辑口吻，建议另派任务做内容正文 Copy Sweep。
- 需要用户确认：footer 当前最终口径为 Logo + `© 2026 WaveSight AI`，不放栏目入口、不放口号、不放解释文案。

## 7. 建议调度中枢更新

- `dispatch-board.md`：可新增或回填 ad-hoc 任务为 `review -> accepted`。
- `feature_list.json`：如需记录，可追加 V2 前台清理类条目。
- `progress.md`：已更新。
- `docs/agent-handoff.md`：已更新。

## 8. 下一步

建议下一个任务：

- 派 UI/UE Agent 做 V2 全站桌面 + 移动截图复核，重点看 footer、删除模块后的页面节奏和是否还有模板感。
- 派 Copy Agent 做全站长文正文 Copy Sweep，继续清理内部流程词、工程化表达和不可信数据口吻。
