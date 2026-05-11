# Automation Fallback Policy

更新时间：2026-05-03  
owner：`workflow` / `dev`  
状态：V1 旧自动化已停止；V2 每日内容自动化已启用

## 0. 2026-05-07 V2-only 更新

用户明确：

- V1.0 网站不再更新。
- 旧自动化任务停止。
- 后续不再判断动作是否影响旧自动化或 V1 链路。
- 项目调度专注 V2.0 版开发。

已停止的旧自动化：

- `ai-the-point`
- `ai-2`
- `ai-3`

本文件中关于旧每日雷达、The Point 和统一同步闸门的规则，保留为历史参考，不再作为 V2 后续任务的阻塞口径。V2 自动化当前以 `V2-DAILY-AUTO / WSD-20260508-02-v2-content-site-daily-automation` 为准。

V2 当前自动化口径：

- 每天 09:00 执行 V2 内容抓取、入库和本地网站数据更新。
- 默认写入 `01-SiteV2/content/`。
- 默认读取 `01-SiteV2/content/10-databases/source-registry-v2.json` 和 V2 source strategy。
- 默认运行 V2 quality gates；不再运行旧 `04-Site` 同步作为完成标准。
- 不做 production deploy，除非用户单独确认。

## 1. 定位

本文件定义观澜AI自动化任务失败、部分失败或结果不可信时的降级策略。

目标是保证自动化不会污染前台判断，不会覆盖有效数据，不会把空结果或低质量结果报告为完成。

## 2. 适用范围

适用于：

- V2 每日内容自动化。
- Raw / Pool / Structured / Front Signal / Deep Dive / Trend Updates 入库。
- Source registry、source probe、source quality gate。
- Point Calibration / builder viewpoint 入库。
- V2 内容同步、生成器和本地网站数据更新。
- V2 quality gates、关键词与来源质量报告。
- 未来 newsletter、样例报告或云端发布自动化。

## 3. 基本原则

1. 失败不写空文件。
2. 失败不覆盖上一版有效数据。
3. 失败不进入首页精选。
4. 失败必须记录原因和尝试路径。
5. 不确定结果标记 `needs_review`。
6. 网站同步必须走统一闸门。
7. 自动化不能替代人工战略判断。

## 4. 失败等级

### L1：轻微异常

示例：

- 某个来源不可用。
- 少量字段缺失但主内容完整。
- 关系检查有软提醒但无硬错误。

处理：

- 标记软提醒。
- 继续同步。
- 写入报告，交给 Intelligence Data Agent 或 QA Agent 复核。

### L2：部分失败

示例：

- The Point 部分来源失败。
- 每日雷达生成数量不足。
- 部分 Signal 缺少 6 点机会拆解。
- Point 缺少素材笔记或译文。

处理：

- 不报告完成。
- 不进入首页精选。
- 补齐后重新同步。
- 写入 `daily-run-log.md` 和对应报告。

### L3：阻塞失败

示例：

- 同步脚本失败。
- 关系检查硬错误。
- 网站数据文件无法生成。
- 自动化生成空文件。
- 权限或写入路径异常。

处理：

- 停止后续发布。
- 保留上一版有效数据。
- 写入失败报告。
- 标记 feature 或任务为 `blocked`。
- 交给 Dev Agent / Workflow Agent 处理。

## 5. V2 每日内容降级

V2 每日内容自动化必须满足：

- Raw 候选、Pool、Structured、Front Signals、Deep Dive / Opportunity、Trend Updates 的数量和质量符合派发单或自动化文档。
- Front Signal 必须有商业解释、二次搜索来源和清晰证据边界。
- Deep Dive 每日最多 1-2 条，宁缺毋滥。
- C 级来源不得作为事实主证据。
- AI HOT / follow-builders 等 M 级通道只作为线索或观点来源，不自动等同事实来源。
- 旧 Raw 30-50 口径已废止；V2 当前完整运行必须达到 Raw 80-150，低信号或关键接口失败日可降级为 50-80 并写明原因。
- 每日日志必须写入 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count`。
- M 级通道命中的线索必须回看原始 URL，解析后的原始来源重新分级为 S/A/B/C/D；M 通道本身不得计入事实主证据。
- 写入 `01-SiteV2/content/` 后必须通过 V2 content gate。

若缺失：

- 不得报告完成。
- 不得进入前台精选或本地站点更新。
- 写入失败原因、降级路径和下一步 owner。
- 补齐后重新执行 V2 quality gates。

## 5A. V1 每日雷达历史降级

每日雷达必须满足：

- Signals 命名为 `YYYY-MM-DD-AI商业雷达.md`。
- Scoring 命名为 `YYYY-MM-DD-AI机会评分.md`。
- 每条 Signal 包含 6 点机会拆解。
- 同步后网站数据中当天 Signal 能解析出 6 个机会拆解模块。

若缺失：

- 不得报告完成。
- 不得运行发布或首页精选。
- 补齐后重新执行同步和关系检查。

## 6. The Point 降级

The Point 必须满足：

- 失败时不生成空 `YYYY-MM-DD-The-Point.md`。
- `status: needs_review` 不进入首页精选。
- X 原文不得被摘要替代。
- Podcast / Blog 必须有素材笔记或明确降级说明。
- 不单独运行网站同步，等待统一同步入口。

若 feed 失败：

- 使用上一日内容作为回看数据，不冒充今日新内容。
- 写入失败原因。
- 记录尝试过的 X / YouTube / Blog / fallback source。

## 7. 同步降级

V2 内容同步或生成器失败时：

- 不覆盖上一版有效 V2 generated data。
- 不生成不完整 `site-content.json` / `site-content.js`。
- 写入失败日志。
- 标记需要 Dev Agent 处理。

同步成功但检查失败时：

- 硬错误：停止发布。
- 软提醒：可进入复核，但必须记录处理路径。

旧 `04-Site/data/radar-data.json` 规则只适用于 V1 归档追溯，不再作为 V2 默认同步入口。

## 8. 记录格式

失败或降级记录写入：

```text
agent-workflow/daily-run-log.md
agent-workflow/reports/<task>-failure-YYYY-MM-DD.md
```

记录应包含：

- 任务名。
- 运行时间。
- 输入来源。
- 尝试过的检索或处理方式。
- 失败原因。
- 降级路径。
- 保留或回滚的数据版本。
- 是否影响前台。
- 下一步 owner。

## 9. 禁止事项

- 不得把空结果报告为成功。
- 不得把低质量自动生成内容直接推到首页。
- 不得跳过质量闸门。
- 不得在失败时静默覆盖历史有效数据。
- 不得把自动化异常只写在对话里而不写入项目文件。
