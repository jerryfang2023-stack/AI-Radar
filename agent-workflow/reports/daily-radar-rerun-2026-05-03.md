---
title: 2026-05-03 商业雷达补跑报告
type: daily-radar-rerun
schema_version: 1
id: daily-radar-rerun-2026-05-03
status: completed
date: 2026-05-03
---

# 2026-05-03 商业雷达补跑报告

## 执行方式

- 优先使用当前会话 OpenAI/Codex 内置网页检索能力。
- 未将 `openai.com` 官网 Cloudflare 403 作为联网失败依据。
- 本次未降级依赖本地 curl 作为主检索通道；curl 仅用于辅助核验部分网页元信息。

## 生成与更新

- 修正并重写：`01-Signals/2026-05-03-AI商业雷达.md`
- 修正并重写：`02-Scoring/2026-05-03-AI机会评分.md`
- 新增机会卡：
  - `07-Opportunities/专业服务AI工作流平台.md`
  - `07-Opportunities/临床影像AI辅助诊断平台.md`
  - `07-Opportunities/企业数据智能体控制平面.md`
  - `07-Opportunities/中小商家AI营销对话平台.md`
- 更新：`03-Trends/AI趋势总表.md`
- 更新处理日志：
  - `01-Signals/.processing_log.yaml`
  - `02-Scoring/.scoring_processing_log.yaml`

## 本日 Signals

1. Legora 估值升至 56 亿美元：专业服务 AI 工作流竞争升温。
2. Aidoc 完成 1.5 亿美元 E 轮：临床 AI 平台化继续推进。
3. Citi 推进 Agentic AI：大型金融机构开始采用组织级 Agent。
4. Snowflake 扩展 Intelligence 与 Cortex Code：企业数据平台争夺 Agent 控制平面。
5. Okta for AI Agents 进入可用窗口：Agent 身份治理产品化。
6. ASAPP 推出多 Agent 客服系统：客服 Agent 转向端到端流程编排。
7. Meta Business AI 每周处理 1000 万次对话：商家 AI 对话入口出现规模证据。

## 网站同步

- 已运行：`node 04-Site/scripts/sync-data.mjs`
- 同步结果：29 Signals / 33 Priority Rows / 13 Trends / 27 Opportunities。
- 05-03 新增：7 Signals / 7 Scoring Rows。
- 重复检查：0 组重复 Signal URL，0 组重复 `opportunity_id`，0 组重复 `slug`。
- 关系检查：硬错误 0；Priority -> Opportunity、Priority -> Trend、Signal -> Opportunity 均为 100%。

## 待复核

- 旧数据仍有部分 04-30 / 05-01 评分项缺少原始 Signal 回链，属于历史软提醒，不影响本次补跑内容上线。
- 新增专业服务AI、医疗AI、企业数据/RAG 三条趋势线，需要后续 7 天继续观察是否形成连续证据。
