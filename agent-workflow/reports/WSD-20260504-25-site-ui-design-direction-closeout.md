---
title: P0-10 网站 UI 方向收口
date: 2026-05-04
task_id: WSD-20260504-25-site-ui-design-direction
status: accepted
encoding: UTF-8
---

# WSD-20260504-25 网站 UI 方向收口

## 1. 做了什么

本轮在当前调度窗口直接执行 `P0-10`，由 UI / UE Design Director 牵头，Strategy / PM / Copy 协作口径收敛。

已完成：

- 读取 `frontend-design` skill，并按“明确视觉方向、避免通用 AI 审美”的要求执行。
- 读取 UI / UE 岗位说明、`DESIGN.md`、`COPY.md`、P0-10A 模块评审报告、P0-2B failed closeout 和首页首屏规划。
- 输出全站 Art Direction：`商业情报桌面`。
- 输出首页、栏目页、详情页、会员页、Admin、移动端页面母版。
- 输出字体、间距、色彩和组件克制规则。
- 明确首页右侧主视觉应为 `Intelligence Desk` 判断样张。
- 明确审美阻塞项和后续任务拆分。

## 2. 改了哪些文件

- `agent-workflow/product/DESIGN.md`
  - 新增 `DESIGN v2 草案：商业情报桌面`。
- `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`
  - 新增本轮 UI 方向报告。
- `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`
  - 新增本收口文件。

未修改：

- `04-Site/`
- 内容源 Markdown
- 同步脚本、关系检查脚本、统一同步闸门
- 自动化任务配置

## 3. Art Direction

| 项目 | 输出 |
|---|---|
| 方向名称 | 商业情报桌面 |
| 产品气质 | 高端商业内参、研究桌面、判断样张、克制会员产品 |
| 视觉关键词 | 克制、研究感、纸面秩序、深墨绿重点、连续证据 |
| 目标感受 | 可信、有判断、有边界、值得读 |
| 非目标 | AI 紫蓝渐变、霓虹科技大屏、机器人头像、抽象雷达流程图、模板 SaaS 卡片墙 |

本轮明确：不沿用 P0-2B failed 结果；首页旧雷达图和四张 poster 卡应作为后续替换对象。

## 4. 页面母版

| 母版 | 核心方向 |
|---|---|
| 首页 | 左侧价值判断 + 右侧 Intelligence Desk + 首屏下沿露出今日内容 |
| 栏目页 | 统一标题区 + command bar + 主列表 / 主卡组 |
| 详情页 | 报告正文 + 右侧摘要 / 来源 / 关联 |
| 会员页 | 权限状态 + 可读内容层级 + 注册 / 登录 / 订阅动作 |
| Admin | 左侧窄导航 + 顶部状态条 + 高密度工作区 |
| 移动端 | 单列阅读，样张卡收缩，不横向溢出 |

## 5. DESIGN v2 草案

已写入 `agent-workflow/product/DESIGN.md`，包括：

- 色彩系统：象牙白、纸面白、深石墨、深墨绿、铜棕、低饱和青绿、细边框。
- 字体层级：首页 H1、栏目页 H1、详情页 H1、Section H2、卡片标题、正文、Meta。
- 首页母版、栏目页母版、详情页母版、会员页母版、Admin 母版和移动端母版。
- 组件克制规则。
- 首页 Intelligence Desk 视觉资产规则。
- 审美阻塞项。
- 后续 Dev 执行边界。

## 6. 首页主视觉方向

P0-11 应在本任务 accepted 后执行。

方向：

- 使用 `Intelligence Desk` 判断样张，而不是抽象海报或轮播。
- 样张包含 Brief 摘要、2 条 Signal、1 条 Opportunity、1 个 Trend 状态。
- 真实文字由 HTML/CSS 承载，生成图只负责纸面结构和氛围。
- 禁止出现 `Scoring`、`JSON`、`同步`、`后台`、`字段`、`编辑`。

## 7. Copy 文案边界检查

已按 `COPY.md` 复核后续页面表达边界：

- 首页 H1 推荐继续使用：`在市场形成共识前，看见 AI 商业变化`。
- CTA 推荐：`查看今日简报` / `申请完整情报层`。
- `机会排行` 应改向 `优先观察` 或 `验证序列`。
- 普通前台不出现内部话术、说服式表达或过度承诺。
- Opportunity 标题不得写公司名。
- Daily Brief 不输出行动指令。

## 8. PM 后续任务拆分

| 后续任务 | 建议看板 | 说明 |
|---|---|---|
| 首页 Intelligence Desk 视觉资产 | P0-11 | 等 P0-10 accepted 后执行 |
| 前后台边界 QA | P0-6 | 覆盖 signals 编辑弹窗、scoring/tags/apply 和四身份状态 |
| UI 截图矩阵 | P0-5 | 按 DESIGN v2 做桌面高级感验收 |
| 上线准备 | P0-4 | 明确生产页面地图、权限、备份、回滚和可访问范围 |
| 全站 Copy 审计 | P1-3 | 清理内部话术、空泛表达和过度承诺 |

## 9. 运行了哪些检查

- `node agent-workflow/tools/run-quality-gates.mjs syntax`
  - 通过，6 项检查，失败 0。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-155700.md`

## 10. 哪些检查未运行及风险

未运行内容同步、关系检查、标签检查。

原因：本任务不改内容源、`04-Site/data/`、同步脚本、数据模型或自动化任务。

风险：低。

未运行浏览器截图。

原因：本任务不改网站代码，不产生可浏览页面变化。

风险：低；后续 P0-11、P0-5 和 P0-6 需要截图验收。

## 11. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

原因：未修改 Markdown 命名、目录、frontmatter、Signal / Priority / Trend / Opportunity / Point 字段规则、同步脚本、关系检查、统一同步闸门、自动化提示词或运行顺序。

## 12. 调度结论

当前调度窗口已将 `P0-10 / WSD-20260504-25-site-ui-design-direction` 标记为 `accepted`。

下一步：

1. 执行 `P0-11`，按 DESIGN v2 输出首页 `Intelligence Desk` 主视觉资产。
2. 执行 `P0-6`，复查前后台边界。
3. 执行 `P0-5`，按 DESIGN v2 做桌面高级感截图矩阵。
