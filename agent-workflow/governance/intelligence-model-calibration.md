# Intelligence Model Calibration

更新时间：2026-05-03  
owner：`data-agent` / `strategy` / `pm`  
状态：长期生效

## 1. 定位

本文件定义观澜AI每月一次的数据智能校准机制。

目标是让观澜AI不是每天重新开始，而是持续复盘哪些 Signal、Point、Trend、Opportunity 判断真正产生了价值，哪些只是热度或噪音。

## 2. 产出文件

每月输出：

```text
agent-workflow/reports/intelligence-model-calibration-YYYY-MM.md
```

每季度可输出：

```text
agent-workflow/reports/intelligence-model-quarterly-review-YYYY-QN.md
```

## 3. 校准对象

### Signal

检查：

- 哪些高分 Signal 进入 Daily Brief。
- 哪些高分 Signal 后续形成 Opportunity 或 Trend。
- 哪些高分 Signal 后续被证明只是媒体热度。
- 哪些低分 Signal 后续变重要。
- 哪些来源和关键词贡献高价值 Signal。

### The Point

检查：

- 哪些观点进入 Daily Brief、Trend 或 Opportunity。
- 哪些人物持续贡献高价值观点。
- 哪些观点形成共识。
- 哪些观点形成分歧或反证。
- 哪些来源存在摘要冒充原文、授权不足或重复问题。

### Trend

检查：

- 哪些 Trend 状态需要上调、下调或标记分化。
- 哪些 Trend 缺少原始 Signal 证据。
- 哪些 Trend 有足够 Point 支撑。
- 哪些 Trend 的反证增强。

### Opportunity

检查：

- 哪些 Opportunity 获得更多评分、Signal 或 Point 支撑。
- 哪些 Opportunity 缺少证据，应降级观察。
- 哪些机会方向重复，应合并。
- 哪些机会标题或代表案例需要修正。

### Tags / Sources / Keywords

检查：

- 哪些标签膨胀或同义重复。
- 哪些关键词高产。
- 哪些关键词低效。
- 哪些来源应升权、降权或移除。
- 哪些人物应加入或移出 The Point 追踪池。

## 4. 月报结构

```markdown
# Intelligence Model Calibration - YYYY-MM

## 1. 本月结论

## 2. Signal 复盘

## 3. The Point 复盘

## 4. Trend 复盘

## 5. Opportunity 复盘

## 6. 来源、关键词和标签调整

## 7. 需要更新的模型规则

## 8. 需要 PM 决策的事项

## 9. 需要 Dev 自动化的事项

## 10. 下月观察重点
```

## 5. 判断标准

高价值判断应满足至少一项：

- 后续出现客户、收入、融资、招投标、并购、监管或产品落地证据。
- 被多个独立高质量来源支撑。
- 被高质量建造者观点反复讨论。
- 影响 Opportunity 优先级。
- 改变 Trend 状态。
- 对 Daily Brief 主判断形成支撑或反证。

低价值或噪音判断包括：

- 只有媒体热度，无商业证据。
- 只有观点，无来源或无场景。
- 只是一家公司宣传，无法外推为机会方向。
- 与观澜AI目标用户的判断任务无关。
- 无法关联 Signal、Trend、Opportunity 或 Point。

## 6. 决策输出

月度校准后应产生以下决策之一：

- 升权：提高来源、关键词、人物或趋势权重。
- 降权：降低噪音来源、低效关键词或弱趋势权重。
- 合并：合并重复 Opportunity、Tag 或 Trend。
- 新建：新增机会方向、趋势或标签。
- 隐藏：将证据不足内容降级到后台观察池。
- 自动化：交给 Dev Agent 增加检查或规则。
- 人工确认：交给 PM / Strategy 或用户判断。

## 7. 分工

| Agent | 职责 |
|---|---|
| Intelligence Data Agent | 主导数据复盘、关系复盘和模型校准 |
| Strategy Agent | 判断赛道和商业化方向是否需要调整 |
| PM Agent | 将校准结果转成 PRD、任务和路线图 |
| Copy Agent | 更新对外表达边界 |
| UI/UE Agent | 更新趋势、机会、标签或观点展示方式 |
| Dev Agent | 实现新增检查、权重或自动化 |
| QA Agent | 验证校准后的检查和前台展示 |
| Workflow Agent | 记录月报、任务状态和交接 |

## 8. 验收标准

- 每月至少输出一次校准报告。
- 报告包含 Signal、Point、Trend、Opportunity 四类复盘。
- 每个调整建议都有理由和 owner。
- 需要自动化的规则进入 Dev 任务。
- 需要人工判断的事项不被自动执行。
