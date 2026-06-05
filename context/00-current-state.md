---
status: current
scope: project-state
last_updated: 2026-06-01
use_when:
  - large task startup
  - dispatch planning
  - state recovery
do_not_use_when:
  - small typo or copy edit with explicit files
  - past-state audit
priority: current
---

# 00 Current State｜观澜 AI 当前状态

观澜 AI / WaveSight AI 当前处于 V3.0.0 数据观察台生产开发阶段。

## 定位

- 产品定义：观澜 AI 是一个由 Agent 驱动的 AI 商业情报系统。
- 核心逻辑：持续监测全球 AI 商业变化，将外部信息转化为结构化情报资产，再生成面向企业老板、资源型合伙人、行业操盘手的商业信号、机会判断、AI 内参和 AI 商业热力图。
- 系统定位：观澜 AI 不是内容站，而是一个会持续感知、判断、表达、发布、复盘和进化的 AI 商业决策系统。
- AI Native 方向：后续能力建设优先让 Agent 之间形成联动，围绕感知、判断、表达、发布、复盘和进化形成闭环。
- 不是 AI 新闻站、工具导航、热点搬运站或普通日报。
- 当前前台入口：数据观察台。

## 当前目录

- 新站工程：`01-SiteV2/site/`
- 内容生产：`01-SiteV2/content/`
- 判断资产：`01-SiteV2/knowledge/`
- 当前有效上下文：`context/`
- 当前版本基线：`context/version-ledger.md`
- 前台页面契约：`context/frontstage-page-contracts.md`
- 项目内专项 Skill：`skills/`
- 当前载入的用户 Skill：`~/.skill-store/`，其中今日观察 pitch / writer / QC 三件套以用户 Skill 为准。
- 高风险执行外壳：`context/06-execution-harness.md`

`content/` 是生产与发布库，保存 Raw、Pool、文章、发布索引和自动化产物。
`knowledge/` 是长期判断资产主库，保存商业信号卡、前沿观点卡、变化 / 场景 / 趋势候选、来源、人物和公司对象。

## 已停止口径

- V2 前台页面已退役；首页、今日观察、商业信号、趋势追踪、商业内参、观点和 builders 旧前台页面不再作为当前前台入口。
- V3 当前前台以 `01-SiteV2/site/v3-data-observation.html` 为准，`01-SiteV2/site/index.html` 只作为跳转入口。
- 运营仪表盘相关页面继续保留，包括 `admin.html`、`operations-console.html`、`pipeline-dashboard.html`。
- 已停止的网站版本与内容日更不作为当前仓库参考源。
- 前沿观点不作为 V2 一级导航，承接旧观点栏目中的有效能力，作为商业信号相邻内容流和后台判断资产。前沿观点必须先入 `opinion_intake` 并写入中文翻译，再执行四档评级：`feature` / `sidebar` / `archive` / `discard`；只有完成翻译的 `feature` 与 `sidebar` 可以进入前台。
- 机会判断不作为一级导航，进入趋势追踪和商业内参中的判断段落。
- Priority Engine / Scoring 后台化，不作为普通前台栏目。
- Tags 不作为一线栏目，只作为搜索、筛选和关系网络能力。

## 当前开发节奏

- 桌面端优先，移动端专项暂缓，除非任务明确要求。
- 页面任务必须先有 Typography 页面位置表和 Copy-first 文案表，再进入 Build & Release。
- 页面 / 文案通用独立质检流程已停用；质量由调度窗口按用户反馈、VI、Copy、桌面截图、核心交互和必要专项检查判断。

## 当前每日生产线

当前每日监测和资产链均改为手动触发，不再按 09:00 / 09:25 自动运行。

保留但暂停：

1. `guanlan-daily-monitor`：`PAUSED`，手动触发 Raw / Pool 监测。
2. `guanlan-daily-assets-chain`：`PAUSED`，手动触发商业信号卡、前沿观点卡、变化 / 场景 / 趋势候选和成熟变化短专题。
3. `daily-observation-writer`：`PAUSED`，不自动写稿或自动同步网站。

手动触发命令：

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=<YYYY-MM-DD>
```

按需人工或另派：

- `case-signal-researcher`：案例、同类产品、市场竞争和二搜。
- `trend-report-writer`：周任务或急件触发。
- `brief-periodical-writer`：周期性商业内参。

每日监测固定读取链路见 `context/05-daily-monitoring.md`。

## 当前硬规则

- 补读文档中的二级引用不自动继续读取。
- 每个任务补读 1-3 个直接相关真源；超出必须说明原因。
- 每日监测、Raw / Pool / Card、页面 / 文案 / Typography 任务必须先套用 `context/06-execution-harness.md`。
- 页面、文案、前台数据同步和发布检查必须先确认 `context/version-ledger.md` 与 `context/frontstage-page-contracts.md`。
- Raw 原文、source quote、原始摘录、URL、source metadata、证据快照和 `key_excerpts.text` 是证据，不得为了文风改写。
- 官网首页、工具平台官网、产品目录、文档目录、控制台登录页、搜索结果页和只有导航词堆砌的页面默认只能 `index_only`。
- follow-builders / 社区观点只能证明“谁在何时何处说了什么”，不能作为公司事实主证据；观点卡进入前台必须有中文翻译、`opinion_tier`、`display_lane` 和 `publish_status`。
