---
status: current
scope: project-state
last_updated: 2026-06-06
use_when:
  - large task startup
  - dispatch planning
  - state recovery
priority: current
---

# 00 Current State｜观澜 AI 当前状态

观澜 AI / WaveSight AI 当前进入 V3 数据观察台阶段。

## 当前定位

- 观澜 AI 是由 Agent 驱动的 AI 商业情报系统。
- 当前前台入口是数据观察台：`01-SiteV2/site/v3-data-observation.html`。
- 当前生产核心不是内容站，而是把每日外部信息沉淀为结构化商业情报资产。
- 当前资产链只要求：Raw 候选、Pool 证据、商业信号 Card、关系图谱输入、趋势候选。
- 每日目标是让用户看到市场上最值得关注的 10 件产品 / 服务、融资、案例信息。

## 当前停止口径

以下内容不是当前 V3 必要输出，也不作为当前执行依据：

- 今日观察；
- 商业内参；
- 趋势报告；
- 旧首页、旧商业信号页、旧趋势追踪页、旧观点页；
- follow-builders / opinion lane；
- 观澜前台文案规范与文案门禁；
- publiccopy / cardcopy 发布阻塞门禁。

V2 站点已经下线。历史规则如果影响 V3，可以删除或重建，不需要继续兼容。

## 当前目录

- 新站工程：`01-SiteV2/site/`
- 生产内容：`01-SiteV2/content/`
- 长期知识资产：`01-SiteV2/knowledge/`
- 当前规则真源：`context/07-v3-intelligence-generation-rules.md`
- 高风险执行外壳：`context/06-execution-harness.md`
- 运营后台页面继续保留，包括 `admin.html`、`operations-console.html`、`pipeline-dashboard.html`。

## 当前数据链路

```text
外部来源
-> Raw 候选
-> Pool 证据
-> signal_card：产品 / 服务、融资、案例
-> 关系图谱输入
-> 趋势候选
-> V3 数据观察台与运营后台数据
```

## 当前硬规则

- Raw 只负责收集外部材料，搜索工具只是发现入口，必须落到原始来源。
- Pool 必须保留原文链接、可读正文、摘要、证据摘录、hash、QC 放行和重要性理由。
- Pool 类型不等于 Card 类型。
- Card 标题优先保留原文事件标题，不得机械改成抽象判断。
- 缺前台字段时不得回退展示后台字段。
- 商业信号生成必须覆盖大厂产品动作、垂直行业案例、中小企业融资，不能只被大厂新闻占满。
- 趋势候选不能由单条新闻、单个观点或趋势文章直接生成。

## 当前自动化目标

GitHub 自动化目标为：

1. 每日监测 Raw / Pool。
2. 生成 10 张商业信号 Card。
3. 跑 Pool-to-Card 去重与必要质量检查。
4. 更新 V3 数据观察台和运营后台数据。
5. 提交到自动化分支并开 PR，合并后由 GitHub Pages 部署。
