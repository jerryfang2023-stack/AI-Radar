# 01-Signals — AI 商业雷达

> 每日 AI 产业信号扫描文件。每个文件 = 一天的原始信号 + 六字段机会拆解。

## 规则

- 命名格式：`YYYY-MM-DD-AI商业雷达.md`
- 使用 `09-Templates/daily-report.md` 模板创建
- 当前结构：核心判断 → 信号拆解 → 今日结论
- 信号中提炼的机会卡 → `01-WaveSight/07-Opportunities/`

## 文件列表

```dataview
TABLE 
  date AS "日期",
  length(file.outlinks) AS "引用次数"
FROM "01-WaveSight/01-Signals"
WHERE type = "daily-radar"
SORT date DESC
```
