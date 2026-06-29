# 08-report｜周度商业变化雷达

每周从 Signals / Opinions / Community 三方数据交叉验证产出的 AI 商业变化判断报告。

## 文件命名

```text
YYYY-MM-DD--weekly-report--ai-business-change-radar.md
```

示例：`2026-06-29--weekly-report--ai-business-change-radar.md`

## 索引

| 日期 | 周次 | 标题 | 文件 |
|---|---|---|---|
| 2026-06-29 | 2026-W26 | 企业 AI 进入组织级工作流，Agent 从能力演示转向流程接管 | `2026-06-29--weekly-report--ai-business-change-radar.md` |
| 2026-06-22 | 2026-W25 | 企业 Agent 从工具采用进入部署服务化 | `2026-06-22--weekly-report--ai-business-change-radar.md` |
| 2026-06-15 | 2026-W24 | AI 从工具试用转向业务流程重构 | `2026-06-15--weekly-report--ai-business-change-radar.md` |

## Frontmatter 规范

```yaml
---
title: 企业 AI 进入组织级工作流，Agent 从能力演示转向流程接管
date: YYYY-MM-DD
week: "YYYY-WXX"
window: YYYY-MM-DD to YYYY-MM-DD
content_type: weekly-report
slug: ai-business-change-radar
status: published
---
```

- `date`: 报告日期，通常为周一。
- `week`: ISO 周次标签，方便按周检索。
- `window`: 数据覆盖的时间窗口。
- `content_type`: 固定为 `weekly-report`，供网站生成脚本识别。
- `slug`: 固定为 `ai-business-change-radar`，供 URL 生成。
