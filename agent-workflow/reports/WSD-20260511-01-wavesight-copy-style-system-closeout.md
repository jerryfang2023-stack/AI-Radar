# WSD-20260511-01 观澜AI V2 文案风格规范 Closeout

日期：2026-05-11  
状态：accepted  
牵头 Agent：Copy Agent  
任务：观澜AI V2 文案风格规范  
阶段：Stage 2 / confirmed / merged

## 1. 任务结论

已将阶段 1 草案和用户新增的“去 AI 味 / 商业内参风”要求合并进 `agent-workflow/product/COPY.md`，并将其升级为 V2 当前文案风格系统的单一可信源。

本次没有改变一级导航、VI、Logo、品牌 token、自动化任务配置、部署配置或内容 schema。

## 2. 修改文件

核心规范：

- `agent-workflow/product/COPY.md`
- `agent-workflow/product/archive/COPY-2026-05-11-pre-copy-style-system.md`

阶段草案与配套 Skill：

- `agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-stage1-draft.md`
- `skills/guanlan-writing-style/SKILL.md`
- `skills/guanlan-writing-style/agents/openai.yaml`

页面与站点文案优化记录：

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/brief.html`
- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/opportunity-detail.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- `agent-workflow/reports/guanlan-writing-style-skill-and-site-copy-2026-05-11.md`
- `agent-workflow/reports/wavesight-writing-style-home-1440.png`
- `agent-workflow/reports/wavesight-writing-style-brief-390.png`

## 3. COPY.md 升级摘要

新版 `COPY.md` 已重构为：

1. 文案定位：冷静、有判断、有温度的商业内参风。
2. 去 AI 味硬规则：不机械分点、不重复句式、不空泛判断、不堆概念、不写成冷报告。
3. V2 固定命名：今日要点 / 关键信号 / 机会解码 / 商业内参。
4. 降级模块边界：The Point 为观点校准，Trends 为趋势背景，Scoring 后台化，Tags 不作一级栏目。
5. 标题、摘要、导语、CTA、会员态、每日监测产物、知识卡片规则。
6. 禁用语与替代表。
7. 25 条 before / after 示例。
8. Copy QA 检查表。
9. Copy Agent 工作流程。

## 4. 冲突清理结果

已清理：

- 英文旧栏目作为前台主规范的问题。
- Trends 独立栏目感。
- The Point 独立频道感。
- “申请查看完整信号 / 申请进入完整情报层”等旧 CTA。
- “下一步验证 / 行动清单 / 强证据 / 证据链 / 机会确定”等公开前台风险表达。
- 缺少会员态、知识卡片、商业热力图和每日监测产物规则的问题。

冲突扫描说明：

- `COPY.md` 中仍会出现 “The Point / Trends / JSON / Markdown / 证据链 / 强证据 / 确定性机会”等词，但均位于“禁止、避免、Before 示例、降级说明或禁用语表”中，不作为推荐口径。
- 与 `DESIGN.md`、`column-architecture.md` 和 `typography-guidelines.md` 对齐：V2 四栏目、WAVESIGHT AI 英文写法、The Point / Trends 降级、字体标题短句要求均一致。

## 5. Copy QA 表

已补齐。后续页面和内容任务可按 `COPY.md` 第 18 节验收，覆盖：

- V2 栏目名。
- 降级模块。
- 去 AI 味。
- 内部词。
- 标题规则。
- 判断边界。
- 来源表达。
- 观点边界。
- 会员态。
- 今日要点。
- 机会解码。
- 商业内参。
- 知识卡片。
- 字体适配。
- 信息量。

## 6. Before / After 示例数量

已补齐 25 条，覆盖：

- 首页。
- 今日要点。
- 关键信号。
- Structured Signal。
- Front Signal。
- 机会解码。
- 商业内参。
- 会员锁定态。
- 观点校准。
- 趋势背景。
- 知识卡片。
- 标签。
- 后续观察。
- 去 AI 味、去营销感、去黑话。

## 7. 质量检查

已通过：

- `node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list json ok')"`：passed。
- `node -e "const fs=require('fs'); const p='agent-workflow/inbox/closeout-queue.jsonl'; ..."`：passed。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：passed。
- `node --check 01-SiteV2/site/assets/app.js`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-052832.md`。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-11`：passed，报告 `agent-workflow/reports/quality-gates-v2content-2026-05-11-20260511-052846.md`。

说明：

- 统一 syntax gate 内部子进程在当前环境显示 `spawn blocked (EPERM)`，但统一入口返回 passed；已用直接 `node --check` 补充验证关键脚本。
- Skill 官方 `quick_validate.py` 因当前 Python 环境缺少 `yaml` 模块未完成；已做 frontmatter 轻量检查并通过。

## 8. 风险与后续建议

1. 历史长文内容中仍可能存在“入口、真正、验证、闭环”等词。它们不一定全部违规，建议另派 Copy / Data 联合任务逐篇审校，不建议粗暴全局替换。
2. 后续内容自动化、页面实现和知识库任务应显式引用 `COPY.md` 与 `skills/guanlan-writing-style/SKILL.md`。
3. 如需让该 Skill 在所有项目中自动发现，可另派任务复制到 Codex 全局 skills 目录；本轮按用户建议保留在项目 `skills/` 下。

## 9. 收口箱登记

已登记：

```json
{"task_id":"WSD-20260511-01-wavesight-copy-style-system","board_id":"WSD-20260511-01-wavesight-copy-style-system","closeout_path":"agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-closeout.md","status":"ready_for_review","created_at":"2026-05-11T13:29:00+08:00","owner":"copy"}
```
