# 工具登记表

## 已纳入工作流的工具/方法

| 工具或方法 | 用途 | 使用角色 | 备注 |
|---|---|---|---|
| design-taste-frontend / gpt-taste | 页面审美、排版、状态、动效、反模板化 | UI Agent | 页面和视觉任务的主要设计技能参考 |
| redesign-existing-projects | 已有页面系统性重构和质感诊断 | UI Agent / Dev Agent | 用于从粗糙页面升级到生产级体验 |
| high-end-visual-design | 高级商业视觉、海报、关键视觉资产 | UI Agent | 用于首页、栏目母版、商业内参视觉 |
| awesome-design-md | 参考 Apple、Linear、Claude、Notion 等设计系统 | UI Agent | 只抽取适合观澜AI的原则 |
| copywriting | 对外文案、CTA、转化路径 | Copy Agent | 删除内部流程语言 |
| copy-editing | 既有文案润色和一致性检查 | Copy Agent | 用于栏目页、PRD、会员页文案 |
| pm-skills 方法 | Discovery、Strategy、PRD、Roadmap、Prioritization | PM Agent | 作为 PM 工作方法参考 |
| site-health.ps1 | 网站与数据健康检查 | Automation Agent | 已在 verification 目录 |
| sync-data.mjs | Obsidian 到网站数据同步 | Automation / Dev Agent | 路径已配置化 |
| Anthropic long-running harness 方法 | 长任务拆解、进度文件、交接恢复 | Workflow / Dev Agent | 作为 agent-workflow 的协作方法参考 |

## 待评估工具

| 工具或方法 | 可能用途 | 下一步 |
|---|---|---|
| schema-check.mjs | 校验 Markdown 必填字段 | M1 开发 |
| relation-check.mjs | 检查跨栏目关联 | M2 开发 |
| dedupe-check.mjs | 查重复 signal、slug、机会方向 | M2 开发 |
| content-quality-check.mjs | 检查公司名标题、内部话术、空字段 | M2 开发 |
| deploy-check.mjs | 云端部署前检查 | M4 开发 |
| brief-quality-check.mjs | 检查今日要点是否有主判断、证据、趋势温度、关键词、来源和风险边界 | M2 开发 |
| keyword-quality-report.mjs | 检查关键词高产、低效、噪音和新增建议 | M2 开发 |
| public-admin-check.mjs | 检查普通页面是否泄露 Admin 控件 | M3 开发 |

## 工具发现来源

长期 agent 可以从以下来源寻找合适工具：

- 本地 skill store：优先使用已经安装的 `design-taste-frontend`、`gpt-taste`、`redesign-existing-projects`、`high-end-visual-design`、`awesome-design-md`、`copywriting`、`obsidian`、`browser-use` 等；后续页面任务不再使用 `frontend-design`。
- GitHub：寻找 PM、设计系统、长任务 agent、验证脚本、静态站部署等可借鉴方法。
- 官方文档：涉及框架、API、部署和权限时，优先查官方文档。
- 项目内历史文件：优先复用 `agent-workflow` 已有规范，不重复造体系。

新增工具进入项目长期使用前，需要写清楚：

- 工具解决什么问题。
- 哪个 agent 使用。
- 输入和输出是什么。
- 是否需要安全审查。
- 是否会影响用户数据或文件。

## 使用原则

- 工具服务判断，不替代判断。
- 每个工具都要有明确输入、输出和验收结果。
- 新工具若来自外部仓库，先做安全检查再安装或执行。
- 有长期价值的工具才进入项目规范。
