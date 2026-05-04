# Opportunity Priority Gap Review

日期：2026-05-03  
owner：`pm` / `data-agent`  
状态：completed

## 1. 背景

当前关系检查硬错误为 0，剩余 5 条软提醒均为早期 Opportunity 暂无 Priority 评分证据。

本轮原则：

- 不为清零软提醒而硬绑评分。
- 每张机会给出补评分、合并、降级观察或保留的处理结论。
- 处理结论后续由 PM / Intelligence Data Agent 执行。

## 2. 评审结论

| Opportunity | 当前判断 | 处理建议 | 理由 |
|---|---|---|---|
| AI招投标Agent | 保留为观察机会 | `watch`，等待补评分 | 机会方向明确，场景具备中国适配度，但当前缺少独立 Priority Row；不应硬绑到其他泛文档 Agent。 |
| 企业AI工作流样板库 | 降级为方法/模板型资产候选 | 与“企业Agent工作平台”“企业文档与财务流程Agent”做合并评估 | 当前更像模板/实施资产，不一定是独立机会方向；如果保留，应明确差异是“模板库 + 配置服务”。 |
| AI客服质检与工单智能Agent | 建议合并或补专门评分 | 与“AI企业客服执行Agent”“AI语音客服首轮分流助手”做证据合并 | 客服链路已有多个相关机会，质检/工单可以成为客服执行 Agent 的子场景，也可以补一条独立评分。 |
| AI商业洞察与销售赋能Agent | 保留观察 | 等待销售赋能独立 Signal 后补评分 | 与 AI营销、AI增长、AI用户研究重叠，但“销售日报/CRM/竞品情报”仍有独立客户任务。 |
| 行业专家知识Agent化 | 保留观察 | 等待专业服务/重资产行业专家知识复制信号后补评分 | 与专业服务AI、企业知识工作流相关，但专家知识沉淀具备潜在壁垒，暂不合并。 |

## 3. 建议状态调整

不立即批量改机会卡 frontmatter，避免无验证的状态 churn。下一轮若进入内容治理，可按以下方式处理：

- `AI招投标Agent`：`status: watch`
- `企业AI工作流样板库`：`status: watch`，并进入合并候选
- `AI客服质检与工单智能Agent`：`status: watch`，进入客服类机会合并候选
- `AI商业洞察与销售赋能Agent`：`status: watch`
- `行业专家知识Agent化`：`status: watch`

## 4. 后续任务

1. PM Agent 建立“早期机会合并/降级”小批次任务。
2. Intelligence Data Agent 在 `tag-taxonomy.md` 中为这些机会补赛道、职能、场景标签。
3. 后续 Daily Radar 如出现对应新 Signal，优先补 Priority Row，而不是硬绑旧评分。
4. QA Agent 保留 5 条软提醒为可解释状态，不作为发布阻塞。

## 5. 验收标准

- 本轮未修改机会卡，未制造无证据绑定。
- 每张缺口机会都有明确处理方向。
- 关系检查软提醒可解释、可追踪。
