---
title: Agent GitHub Capability Learning Report
date: 2026-05-04
type: agent-capability-learning
status: ready-for-dispatch-hub-review
project: 观澜AI｜WaveSight AI
encoding: UTF-8
---

# Agent GitHub Capability Learning Report

## 1. 本轮目标

根据上一轮能力训练清单，继续补齐八个长期 Agent 的外部学习能力，并按用户要求为 UI/UE Agent 安装并学习 `taste-skill`。

本轮只更新长期 Agent 能力和治理报告，不执行具体产品任务，不修改 `04-Site/`，不修改内容源 Markdown，不修改自动化任务。

## 2. GitHub 能力来源

本轮学习与沉淀的 GitHub 来源：

| 来源 | 当前用途 | 适用 Agent | 学习方式 |
|---|---|---|---|
| `openai/skills` | 技能说明、触发条件、输入输出、安全边界 | 全体 Agent / Workflow | 学习结构化技能与岗位说明写法 |
| `phuryn/pm-skills` | Product Discovery、PRD、Roadmap、Prioritization、Opportunity-Solution Tree | Strategy / PM / Copy | 学习产品判断与任务拆解方法 |
| `VoltAgent/awesome-design-md` | 真实项目 DESIGN.md 和设计系统样例 | UI/UE | 学习设计规范沉淀方式 |
| `Leonxlnx/taste-skill` | 高审美前端、反模板化、状态完整性、性能护栏 | UI/UE / Dev / QA | 已安装并静态学习 |
| `Tencent/AI-Infra-Guard` | Skill 静态安全扫描、供应链风险、只读审计原则 | Data / Dev / QA / Workflow | 学习安全审查和风险分级 |

通过 GitHub API 抽查到的当前公开指标：

| Repo | Stars | Forks | Updated |
|---|---:|---:|---|
| `openai/skills` | 18184 | 1176 | 2026-05-04 |
| `VoltAgent/awesome-design-md` | 70632 | 8668 | 2026-05-04 |
| `phuryn/pm-skills` | 10877 | 1261 | 2026-05-04 |
| `Leonxlnx/taste-skill` | 15085 | 1302 | 2026-05-04 |
| `Tencent/AI-Infra-Guard` | 3617 | 358 | 2026-05-04 |

说明：GitHub 指标只用于判断资料活跃度和参考价值，不代表本项目自动信任其中所有代码。

## 3. taste-skill 安装与学习

已安装：

```text
C:\Users\86186\.codex\skills\taste-skill
```

安装来源：

```text
https://github.com/Leonxlnx/taste-skill/tree/main/skills/taste-skill
```

技能名：

```text
design-taste-frontend
```

学习到的可吸收能力：

- 改前端前必须检查依赖，不假设第三方库已经存在。
- 移动端避免使用不稳定的全屏高度，优先使用更稳定的动态 viewport 或 min-height。
- 复杂布局优先 CSS Grid，减少脆弱的 flex 百分比计算。
- 避免 AI 紫蓝渐变、霓虹光效、过度卡片化、假数字、通用头像和空泛文案。
- 补齐 loading、empty、error、active 等真实交互状态。
- 动效只动画 `transform` 和 `opacity`，避免动画 `top`、`left`、`width`、`height`。
- 重动画必须隔离，不能拖慢页面。

观澜AI适配结论：

- `taste-skill` 适合作为 UI/UE Agent 的审美和工程检查参考。
- 不适合原样套用其默认强动效、持续动画、大圆角 Bento、玻璃拟态和作品集式英雄区。
- 对观澜AI，建议改写为 `DESIGN_VARIANCE 4-6`、`MOTION_INTENSITY 1-3`、`VISUAL_DENSITY 6-8`。
- 与项目规则冲突时，优先级为：用户具体反馈 > `AGENTS.md` > `DESIGN.md` > `frontend-design` > `taste-skill`。

安全静态检查：

- 已读取安装后的 `SKILL.md`。
- 安装目录只有 `SKILL.md`，没有脚本、依赖清单或自动执行代码。
- 关键词扫描未发现自动远程执行、凭证读取、敏感文件访问、破坏性删除或依赖安装行为。
- 唯一外链为设计说明中的图片占位示例，不构成自动联网行为。

风险等级：低。

注意：正式让 Codex 自动识别新装 skill 通常需要重启 Codex。

## 4. 八个 Agent 能力补齐

### Strategy Agent

已补齐：
- 学习 `openai/skills` 的结构化说明方式。
- 学习 `phuryn/pm-skills` 的产品发现、优先级和机会树方法。

适配边界：
- 只用于战略判断结构，不直接写商业化承诺。

### PM Agent

已补齐：
- 将 `phuryn/pm-skills` 作为 PRD、路线图、优先级和任务拆解的外部参考。
- 将 `openai/skills` 作为岗位说明与派发单结构参考。

适配边界：
- PM 必须结合 Plan-first 和 Quality Gates 改写，不能复制通用 SaaS 模板。

### UI / UE Agent

已补齐：
- 已安装并学习 `taste-skill`。
- 明确 `taste-skill` 与 `frontend-design`、`awesome-design-md`、`DESIGN.md` 的优先级关系。
- 新增 `taste-skill 适配规则`。

适配边界：
- 克制商业情报调性优先，不默认采用强动效或作品集式视觉。

### Copy Agent

已补齐：
- 学习 `openai/skills` 的任务触发与输出结构。
- 学习 `phuryn/pm-skills` 的用户场景和价值假设表达方式。

适配边界：
- 最终语气仍以 `COPY.md` 为准。

### Intelligence Data Agent

已补齐：
- 学习 `openai/skills` 的输入输出和风险边界结构。
- 学习 `Tencent/AI-Infra-Guard` 的静态扫描、供应链风险和安全审计思路。

适配边界：
- 只参考质量检查和安全审计思想，不改变观澜AI数据模型。

### Dev Agent

已补齐：
- 学习 `taste-skill` 的依赖检查、移动端稳定、状态完整性和性能护栏。
- 学习 `AI-Infra-Guard` 的危险关键词、供应链风险和审计纪律。
- 补充 GitHub CLI / Actions 作为未来版本管理和 CI 方向。

适配边界：
- 当前项目不是 git 仓库时，不假装已有版本管理；不直接复制未经审查代码。

### QA / Acceptance Agent

已补齐：
- 学习 `AI-Infra-Guard` 的只读审计、风险分级和不执行被审查代码原则。
- 学习 GitHub Actions / Playwright 的可重复检查思想。

适配边界：
- QA 可以借鉴检查矩阵，但不能参与实现，也不能把未运行检查写成通过。

### Workflow / Automation Agent

已补齐：
- 学习 `openai/skills` 的技能注册、触发、输入输出和安全提示组织方式。
- 记录 `taste-skill` 的安装来源、路径、适配边界和重启提示。
- 把外部 GitHub 能力学习写入 Agent Memory。

适配边界：
- 所有外部能力必须沉淀到 `agent-workflow`，不能只停留在聊天中。

## 5. 修改文件

- `agent-workflow/agents/strategy-agent.md`
- `agent-workflow/agents/pm-agent.md`
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/agents/data-agent.md`
- `agent-workflow/agents/dev-agent.md`
- `agent-workflow/agents/qa-agent.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/reports/agent-github-capability-learning-2026-05-04.md`

## 6. 未改范围

- 未修改 `04-Site/`。
- 未修改内容源 Markdown。
- 未修改自动化任务。
- 未修改同步脚本、关系检查脚本或统一同步脚本。
- 未改变前台栏目、数据模型、权限、云端部署或商业化路径。

## 7. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本轮只更新长期 Agent 能力说明、外部学习规则和报告，不改变自动化任务提示词、时间线、Markdown 字段、同步入口或质量闸门。

