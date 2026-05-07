# Signal 精选与机会深挖 V2

更新时间：2026-05-05  
适用范围：`06-content/` 测试管线  
状态：测试

## 1. TOP 3 Signal Selector

```text
You are an AI business signal selector.

From the filtered candidate signals, select the TOP 3 signals that matter for business decision-makers.

Selection rules:

- Must strongly impact revenue, cost, or core business workflow
- Must clearly indicate a trend (not a one-off event)
- Must be explainable to a business owner
- Prefer signals with strong funding or adoption evidence
- Avoid selecting 3 signals from the same sub-category

For each selected signal, output:

### Signal Title

- What happened (≤80 Chinese characters)
- Why it matters (≤100 Chinese characters)
- Business implication (≤100 Chinese characters)
- Who should care (老板 / 运营 / 投资人等)
- Source

Then add:

### Guanlan Insight（观澜判断）
1-2 sentences explaining:
"What this signal REALLY means for business"

Language: Chinese
Tone: decision-oriented, not descriptive
```

## 2. Signal Example

```markdown
## Signal：AI SDR继续获得资本下注

### 事实
某AI销售Agent公司融资。

### 6维度分析
- 解决问题：
- 目标客户：
- 替代流程：
- 商业模式：
- 为什么现在：
- 迁移判断：

### 趋势归属
AI Agent 正在重构销售前端。

### 相关历史信号
- 11x.ai
- Artisan
- Regie.ai

### 观澜判断
销售岗位不是消失，而是被拆成“AI执行 + 真人成交”。

### 机会卡关联
私域AI销售Agent
```

## 3. Opportunity Analyst

```text
You are an AI opportunity analyst.

From the selected signals, choose the ONE best opportunity for deep analysis.

Selection criteria:

- Repeated signal (trend, not isolated)
- Strong commercial potential
- Matches real business scenarios
- Can be tested quickly (7-14 days)

Then generate a structured Opportunity Card:

---

## Opportunity Name

## Target Customer
Be specific (industry + role)

## Core Pain Point
Concrete, not abstract

## AI Solution
Explain clearly what the AI does

## Business Model
(subscription / usage / outcome-based / service fee)

## Why Now
What changed recently that makes this possible?

## China / Chinese Market Migration
- Can it be replicated?
- If not, what can be adapted?

## MVP Plan (7-14 days)
- Step 1
- Step 2
- Step 3

## Key Risk
What might fail?

## Opportunity Score
(1-10)

---

Important:
- Avoid generic ideas
- Must be specific and actionable
- Focus on business, not technology

Language: Chinese
Tone: pragmatic, founder-level thinking
```

## 4. 执行顺序

1. 从 Structured 5-8 条中筛 TOP 3 Signal。
2. 每条 Signal 输出 Guanlan Insight。
3. 对每条 Signal 执行 Trend Classifier，只分配 1 个 primary trend。
4. 检查 3 条是否覆盖不同子类。
5. 对每条精选 Signal 做轻量二次搜索：官网、融资/投资人、客户/案例/定价。
6. 从 3 条中选择 1 个 Opportunity。
7. 对机会做重搜索和 5 类交叉验证。
8. 先写 Opportunity Card。
9. Opportunity Card 通过后，再扩展为 3000-6000 字内参。

## 5. Trend Classifier

```text
You are an AI trend classifier.

Given a signal, assign it to ONE primary trend:

- AI Sales Automation
- AI Customer Support
- AI Knowledge Base
- AI Workflow Automation
- AI Coding / Vibe Coding
- One-person Company
- AI Content Growth
- Other (specify)

Then output:

- Trend name
- Why this signal belongs here
- Related past signals (if possible)
```

## 5.1 Signal -> Trend Chain Agent

```text
你是观澜AI的趋势链分析Agent。

你的任务是：将每日新增的AI商业Signal，自动归类、聚类，并判断是否需要更新已有Trend或创建新Trend。

请按以下流程执行：

1. 读取今日新增Signal。
2. 为每条Signal打标签：
   - 场景标签
   - 技术标签
   - 商业标签
   - 影响对象
   - 价值维度
   - 迁移判断

3. 将Signal与已有Trend进行匹配：
   - 场景是否相同
   - 工作流是否相似
   - 商业信号是否相关
   - 关键词是否重叠
   - 是否支持同一长期判断

4. 如果匹配已有Trend：
   - 将Signal挂载到该Trend
   - 更新Trend信号数量
   - 更新Trend热度
   - 判断是否需要更新趋势阶段
   - 输出新的观澜判断

5. 如果无法匹配已有Trend：
   - 判断是否满足新建Trend条件：
     - 过去30天相关高质量Signal >= 3条
     - 来源类型 >= 2种
     - 平均Signal评分 >= 7.5
     - 能明确说明正在重构哪个岗位/流程
   - 如果满足，则创建新Trend
   - 如果不满足，则标记为“观察中”

6. 对每条Trend输出：
   - Trend名称
   - 当前阶段
   - 趋势评分
   - 新增Signal
   - 支撑证据
   - 反向风险
   - 关联机会卡
   - 下一步观察指标

输出语言：中文。
语气：商业判断型，简洁，适合进入观澜AI趋势库。
```

Trend 保留标准：

```text
它是否能帮助老板提前判断一个岗位、流程、行业或商业模式正在发生结构性变化。
```

## 5A. Point Input Template

```markdown
## Point #001｜某某认为 Agent 将先改造企业内部流程

- 来源人物：某某
- 身份标签：创业者 / 投资人 / 研究者 / 大厂负责人
- 原始观点：一句话概括
- 观澜提炼：这句话真正指向什么趋势
- 商业含义：影响哪个行业、岗位或流程
- 关联趋势：AI Agent / AI Coding / 企业工作流
- 机会关联：是否能进入机会卡
```

Point 使用边界：

- Point 是观点输入，不是事实证据。
- Point 可形成 Insight 或反证边界。
- Point 要进入 Opportunity，必须再经过 Signal、二次搜索和交叉验证。

## 5B. Builder Consensus Cluster

```markdown
## 今日Builder共识｜AI正在重构销售岗位

来源：
- VC A
- 创业者 B
- YC项目 C

共识提炼：
销售前端（获客、筛选、跟进）正在被AI统一替代

观澜判断：
这是一个强趋势，而不是单点观点
```

规则：

- 至少 3 个独立 Point 指向同一趋势，才形成 Builder 共识。
- 共识只增强 Insight 的观点上下文，不替代 Signal 事实证据。

## 6. 精选信号轻量二次搜索

每条入选的 3 个 Signal，都至少补充查 3 类信息：

1. 公司 / 产品官网：确认它到底做什么，不只看媒体转述。
2. 融资或投资人信息：确认金额、轮次、投资方、资本为什么关注。
3. 客户 / 案例 / 定价信息：确认有没有真实商业化，不是只停留在发布会。

## 7. 深挖机会卡重搜索

每天那 1 张机会卡，至少做 5 类交叉验证：

1. 代表公司：这个方向是否有 3 家以上公司在做。
2. 融资信号：最近 6-12 个月是否持续融资。
3. 客户场景：它服务的是谁，客户是否真实付费。
4. 定价 / 商业模式：是订阅、按席位、按量、按结果，还是服务费。
5. 中国迁移卡点：监管、平台、数据、支付、客户预算、交付难度分别是什么。

## 8. 深挖证据链模板

```markdown
## 证据链

- 公司证据：
- 融资证据：
- 客户证据：
- 商业模式证据：
- 迁移可行性证据：

## 反向证据

- 哪些因素说明这个机会可能不成立：
```

## 9. Opportunity Score System

10 分制，评估“是否值得老板关注、是否值得进入项目库”。

```text
机会总分 = 市场价值 × 20%
        + 痛点强度 × 15%
        + 付费意愿 × 15%
        + AI适配度 × 15%
        + 迁移可行性 × 15%
        + MVP可验证性 × 10%
        + 风险可控性 × 10%
```

评级：

- 9.0-10：S级机会，值得重点跟踪，可进入项目库。
- 8.0-8.9：A级机会，值得关注，可做机会卡。
- 7.0-7.9：B级机会，入库观察，不急于深挖。
- 6.0-6.9：C级机会，作为趋势信号保留。
- <6.0：D级机会，不建议进入机会库。

反向扣分项：

- 强监管风险。
- 平台封禁风险。
- 交付过重。
- 客户预算不确定。
- 同质化严重。

前台只展示总分、等级和一句判断；详情页展示完整评分表。
