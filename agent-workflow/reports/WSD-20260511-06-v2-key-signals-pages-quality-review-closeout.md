# WSD-20260511-06 V2 关键信号页面体系独立质检 Closeout

生成时间：2026-05-11  
任务 ID：`WSD-20260511-06-v2-key-signals-pages-quality-review`  
角色：QA / Acceptance Agent 独立质检窗口  
结论：`needs-revision`

## 1. 总体判断

这组页面已经从普通 AI 新闻列表推进到“信号、来源、商业变量、边界、观点校准”的观澜AI方向，但仍未达到 accepted：最大问题是 Builders 体系仍像观点聚合页，部分标签和文案仍带有内部字段感，信号、机会、内参之间的下一步关系还不够清楚。

本次没有修改 `01-SiteV2/site/`、`01-SiteV2/content/`、`01-SiteV2/knowledge/`、VI 文件或自动化脚本。

质检依据：

- 已读取：`AGENTS.md`
- 已读取：`agent-workflow/governance/current-context.md`
- 已读取：`agent-workflow/execution/WSD-20260511-06-v2-key-signals-pages-quality-review.md`
- 已读取：`agent-workflow/governance/page-copy-quality-review-skill.md`
- 已补读：`agent-workflow/product/DESIGN.md`
- 已补读：`agent-workflow/product/COPY.md`
- 已补读：`agent-workflow/product/signal-system.md`
- 已补读：`docs/brand/wavesight-ai-vi/USAGE.md`
- 已补读：`docs/brand/wavesight-ai-vi/typography-guidelines.md`
- 已补读：`docs/brand/wavesight-ai-vi/brand-tokens.css`

开发 closeout 状态：

- `agent-workflow/reports/WSD-20260510-key-signals-compression-closeout.md`：存在。
- `agent-workflow/reports/WSD-20260511-front-signal-report-closeout.md`：存在。
- `agent-workflow/reports/WSD-20260511-structured-signal-card-closeout.md`：存在。
- `agent-workflow/reports/WSD-20260511-builder-perspective-system-closeout.md`：存在。

本次质检渲染证据：

- `agent-workflow/reports/WSD-20260511-06-render-signals.html.png`
- `agent-workflow/reports/WSD-20260511-06-render-signal-detail.html.png`
- `agent-workflow/reports/WSD-20260511-06-render-structured-signal.html.png`
- `agent-workflow/reports/WSD-20260511-06-render-builders.html.png`
- `agent-workflow/reports/WSD-20260511-06-render-builder-detail.html.png`

## 2. 页面级结论

| 页面 | 结论 | 最大问题 | 是否建议进入修改 |
|---|---|---|---|
| `signals.html` | 方向基本成立 | 首屏能说明商业信号，但右侧图表和英文标签仍像系统面板；Signal / Opportunity / Brief 的后续路径不够明确 | 是，局部修改 |
| `signal-detail.html` | 基本可用 | 报告结构完整，但 `Fact Ledger / Commercial Variables / Watch Next` 等英文模块过多，部分内容像字段表 | 是，局部修改 |
| `structured-signal.html` | 可用但偏轻 | 结构紧凑，但来源事实过于模板化，缺少具体事实差异；`是否升级`模块略像内部评审表 | 是，重点修改文案 |
| `builders.html` | 需要修改 | 仍像 KOL / source 聚合页，`x.com`、域名头像和“人物观点流”降低可信度 | 是，重点修改 |
| `builder-detail.html` | 需要修改 | 详情页身份可信度不足，标题是 `x.com`，观点时间线偏长，相关内容露出裸 URL 摘要 | 是，重点修改 |

## 3. 七维评分

| 维度 | 得分 | 理由 |
|---|---:|---|
| 定位一致性 | 8 | 关键信号和详情页已明显不是普通新闻站，有来源、变量、边界和观察窗口；但 Builders 入口仍带观点聚合页气味。 |
| 信息架构 | 7 | 大路径从主信号到结构化扫描再到证据校准成立；详情页也有报告节奏。但页面间关系和下一步路径仍不够明白，部分模块标题偏内部。 |
| 商业判断 | 8 | 能回答“为什么重要、影响谁、替代什么流程、还缺什么证据”；Structured Signal 的事实层和 Builders 的身份层仍偏薄。 |
| 文案自然度 | 7 | 多数句子比模板页更克制，但 `Fact Ledger`、`Source Ledger`、`View Stream`、`Signal Status`、`Risk Boundary` 等英文标签和“已核对来源”反复出现，仍有系统化生产痕迹。 |
| 视觉体验 | 8 | 暖白纸面、衬线标题、深海蓝与香槟金控制得住，Logo 与全局气质符合 VI；但卡片重复和标签密度在后半页开始削弱内参感。 |
| 页面节奏 | 7 | `signals.html` 和 `signal-detail.html` 节奏明显改善；Builders 两页卡片和时间线偏长，主次有回落。 |
| 可信度 | 7 | 有来源等级、边界和观点校准意识；但 Builders 页把 `x.com`、`sierra.ai`、`prnewswire.com` 等域名作为人物身份，且相关内容出现裸 URL 摘要，会让企业用户怀疑资料整理质量。 |
| 总分 | 52 / 70 | 方向可用，但未达独立质检 accepted 线。 |
| 结论 | `needs-revision` | 总分处于 49-57 区间；文案自然度和可信度未达到核心维度 8 分。 |

## 4. 主要问题

1. Builders 体系仍没有完全从“KOL 聚合”变成“观点校准资产”。`builders.html` 出现 `人物观点流`，`builder-detail.html` 首屏 H1 是 `x.com`，会让用户觉得这是抓取来源页，不是观澜AI的判断资产。
2. 英文模块标签偏多，且部分像内部生产字段。`FRONT SIGNAL REPORT` 可以保留少量报告感，但 `SOURCE LEDGER / FACT LEDGER / VIEW STREAM / RELATED LINKS / SIGNAL STATUS / UPGRADE WATCH` 密集出现，会削弱中文商业内参的自然度。
3. Structured Signal 的“来源与关键事实”仍是模板句。三条来源都显示“补充事件、产品、客户采用或市场反馈中的关键信息”，没有说出每个来源实际补充了什么。
4. 信号体系关系表达不够完整。页面能看懂 Front Signal 和 Structured Signal 的强弱，但没有清楚说明它们如何进入 `机会解码`、如何被 `商业内参`周期引用、Builders 观点什么时候只校准而不升级权重。
5. 视觉上仍有卡片墙尾巴。前半页像内参，后半页尤其 Builders 和 Related Path 又回到两列卡片 / 列表堆叠，信息密度上来了，但判断层级变弱。
6. 公开前台没有明显 Admin、JSON、同步、后台、编辑等硬性后台痕迹；但“恢复”作为 `可恢复`、`回滚`等技术治理语出现多次，虽然不是后台痕迹，仍建议改成更面向经营者的“出错后能追责、能接管、能复盘”。

## 5. 模块级优化建议

### `signals.html`

- 保留：Lead Signal 首屏、来源数量、风险边界、Front Signal 三张深读卡。
- 强化：首屏副标题从“值得继续跟踪的商业变化”升级为更明确的判断口径，回答“为什么这些是商业信号”。
- 合并：底部 `追踪索引` 四组卡片可压缩为“一组变化正在指向什么机会 / 内参主题”的横向关系条。
- 弱化：右侧图表目前好看但解释不足，应增加一句“这不是热度图，而是来源、变量和机会的关系图”。
- 重写：`证据和一线看法`中的英文标签和指标命名，改成中文内参式表达。

### `signal-detail.html`

- 保留：报告头、Editorial Judgment、一句话判断、6 维机会解析、证据边界。
- 强化：`发生了什么`要把每条来源写成具体事实，不要只写“确认事件主体和官方表述”。
- 合并：`为什么值得看`和`商业变量拆解`有一定重复，可把 6 维机会解析保留为主模块，把变量图作为右侧辅助。
- 重写：`接下来怎么看`应直接指向“继续看哪些变量、何时进入机会解码或商业内参”，不要只是 7D / 30D / 90D 时间轴。

### `structured-signal.html`

- 保留：短页结构、`继续观察，接近升级线`、商业解读四项。
- 强化：`来源与关键事实`必须呈现来源差异，例如“融资规模 / 客户采用 / 产品定位 / 外部反证”，不能三行同模板。
- 弱化：`是否升级为深度信号？`像内部评审，建议改为“还差哪些证据”。
- 重写：`可能机会 Agent 权限治理`与当前 Sierra 客服 Agent 案例不完全贴合，应优先指向“客户体验 Agent 平台”或“客服前台运营层”。

### `builders.html`

- 保留：Builders 观点作为校准输入的定位、7D / 30D / 90D 校准窗口。
- 删除或重命名：`人物观点流`。建议改为“观点如何影响判断”或“正在改变权重的看法”。
- 强化：每张卡片必须显示“观点来源是谁 / 代表哪类判断 / 支持或质疑哪条信号”，而不是以域名和头像字母开头。
- 弱化：搜索筛选区目前占用首屏注意力，可以保留但降低视觉权重。

### `builder-detail.html`

- 重写：首屏 H1 不应是 `x.com`。如果没有明确人物身份，应显示“公开观点来源：x.com 线索组”，并说明“身份待补，不作为个人背书”。
- 强化：观点详情页应在首屏给出“这组观点校准了哪条信号 / 哪个机会方向 / 哪个风险边界”。
- 合并：观点时间线 6 条偏长，可默认显示 3 条，其余折叠或放到“更多观点记录”。
- 重写：`关联主题与内容`中裸 URL 摘要要转成来源摘要，不直接把 `https://...`露给普通前台。

## 6. 文案改写建议

### 位置：`signals.html` 栏目副标题

原文：

```text
从 AI 热点中筛出值得继续跟踪的商业变化
```

替换建议：

```text
只保留那些已经碰到客户、流程、预算或风险边界的 AI 变化。
```

### 位置：`signals.html` `证据和一线看法`

原文：

```text
这件事有多实
热度上升不等于结论成立。先看来源，再看还缺什么。
```

替换建议：

```text
这条信号站得住吗
先看它来自哪里，再看还缺哪类客户和付费证据。
```

### 位置：`signal-detail.html` `Fact Ledger`

原文：

```text
只保留对判断有帮助的信息。
```

替换建议：

```text
这些事实决定它是普通发布，还是值得进入后续观察的商业信号。
```

### 位置：`signal-detail.html` `接下来怎么看`

原文：

```text
7天：看是否有更多一手材料
30天：看客户采用和付费迹象
90天：看能否沉淀为趋势或机会
```

替换建议：

```text
7天：看官方是否补充客户、权限和动作边界。
30天：看是否出现采购、试点或渠道合作信号。
90天：如果多条信号继续指向同一流程，再考虑进入机会解码或商业内参。
```

### 位置：`structured-signal.html` `是否升级为深度信号？`

原文：

```text
是否升级为深度信号？
```

替换建议：

```text
还差哪些证据
```

原文：

```text
已出现商业变量，但公开证据还不足以支撑深度报告。
```

替换建议：

```text
它已经指向真实流程变化，但客户续约、交付成本和平台挤压还没有被充分验证。
```

### 位置：`builders.html` Hero

原文：

```text
用一线建造者、投资人和研究者的观点，修正我们对 AI 商业变化的判断。
```

替换建议：

```text
观点只用来校准判断。真正决定权重的，仍是客户采用、产品落地和一手材料。
```

### 位置：`builders.html` `人物观点流`

原文：

```text
人物观点流
```

替换建议：

```text
正在改变判断权重的看法
```

### 位置：`builder-detail.html` 首屏 H1

原文：

```text
x.com
```

替换建议：

```text
公开观点来源：x.com 线索组
```

若能识别人物，则替换为：

```text
Alex Albert 的长任务观点正在校准 Agent 商业化边界
```

### 位置：`builder-detail.html` `RELATED LINKS`

原文：

```text
X / Podcast / YouTube / Blog 只作为观点来源，不能替代公司公告、客户证据、财报、监管文件或一手材料。
```

替换建议：

```text
这些内容只说明观点如何变化。是否提高判断权重，还要看公司公告、客户采用、财务数据和监管材料。
```

## 7. 视觉与节奏建议

1. `signals.html` 首屏视觉成立，标题、图表和来源卡有内参感；但主标题过长时首屏压迫感偏强，建议缩短标题或在详情页保留完整标题，列表页用压缩版。
2. `signal-detail.html` 详情页报告感较好，但英文小标签太多，建议只保留报告编号和少量英文，其余模块改中文。
3. `structured-signal.html` 视觉干净，但右侧状态卡像字段摘要；建议把“当前判断、信号状态、来源结构”改成一句判断 + 三个弱标签。
4. `builders.html` 卡片排布仍像人物 / 来源墙。建议首屏下方先放“这组观点校准了什么”，再放观点卡。
5. `builder-detail.html` 时间线过长，且相关内容区露出 URL 摘要，像资料库而不是前台内参。建议压缩时间线、改写相关内容摘要。
6. 全组页面没有严重横向溢出；本次桌面端渲染检查通过。移动端非本任务硬闸门，未作为 accepted 依据。

## 8. 信号系统关系建议

当前关系表达基本可读：

- Front Signal：高优先级深度信号，有完整判断和边界。
- Structured Signal：结构化入库信号，适合继续观察。
- Builders：观点校准输入，不替代事实来源。

仍不够清楚的部分：

- Structured Signal 何时升级为 Front Signal，需要更像用户可理解的证据缺口，而不是内部升级流程。
- Front Signal 何时进入 Opportunity，需要明确“多条信号共同指向同一客户 / 流程 / 预算变化”。
- Business Brief 目前只在导航中出现，没有在信号页形成周期判断入口。
- Builders 和 Signal 的关系要更明确：观点支持、质疑或修正哪条信号，而不是单独展示观点。

建议在 `signals.html` 底部加入一条克制的关系说明：

```text
关键信号不是结论。多条信号持续指向同一客户、流程或预算变化时，才会进入机会解码；当这些变化形成周期性组合判断，才会进入商业内参。
```

## 9. 转化路径建议

转化路径不应过早销售。建议采用三层低压路径：

1. 在 `signals.html` Lead Signal 下保留 `阅读完整判断`，旁边增加弱链接 `看它可能指向的机会`，指向相关机会解码。
2. 在 `signal-detail.html` 底部 `接下来怎么看`中增加“若 30 / 90 天证据继续增强，将进入机会解码或商业内参”的说明，不使用“立即行动”。
3. 在 Builders 页不要设置强 CTA。只保留“查看相关信号”“返回关键信号”，让观点回到事实和判断。
4. 商业内参入口应放在周期判断语境中，例如“本周哪些信号正在汇成同一条主线”，不要写成会员销售按钮。

## 10. Codex 执行指令

```text
你是观澜AI V2 关键信号页面体系修改窗口。请先读取 AGENTS.md、agent-workflow/governance/current-context.md、agent-workflow/product/DESIGN.md、agent-workflow/product/COPY.md、agent-workflow/product/signal-system.md、docs/brand/wavesight-ai-vi/USAGE.md、docs/brand/wavesight-ai-vi/typography-guidelines.md、docs/brand/wavesight-ai-vi/brand-tokens.css，以及本质检报告 agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md。

修改范围仅限 01-SiteV2/site/signals.html、01-SiteV2/site/signal-detail.html、01-SiteV2/site/structured-signal.html、01-SiteV2/site/builders.html、01-SiteV2/site/builder-detail.html 对应的渲染逻辑、样式和必要页面文案。不得修改 VI 资产、内容生产线、自动化、本任务 closeout 或 V1 归档。

核心目标：
1. 让关键信号页面更像“面向商业决策者的 AI 机会判断系统”，而不是新闻站、卡片墙或 KOL 聚合页。
2. 将英文和内部字段式模块标题改成中文商业内参表达，只保留少量必要英文报告编号。
3. 强化 Signal / Front Signal / Structured Signal / Builders / Opportunity / Business Brief 的关系说明。
4. 修复 Builders 体系可信度：不要用 x.com、sierra.ai、prnewswire.com 等域名作为人物身份主标题；无法识别人物时使用“公开观点来源：某来源线索组”，并说明身份边界。
5. Structured Signal 的来源事实必须写出来源差异，不要三条重复模板句。
6. 相关内容区不得露出裸 URL 摘要，改成来源摘要和判断关系。

验收重点：
- 前台无 Admin、JSON、同步、字段、后台、编辑等后台痕迹。
- Signal 标题仍保持“事件 + 商业含义”。
- Opportunity 标题不写公司名。
- Builders 观点明确只作校准，不替代事实主证据。
- 页面桌面端无横向溢出，首屏主次清楚，卡片墙感下降。
- 修改后运行 node --check 01-SiteV2/site/assets/app.js 和 node agent-workflow/tools/run-quality-gates.mjs syntax，并输出新的桌面截图与 closeout。
```

## 11. Quality Gates

本任务是独立质检窗口，不修改站点代码，因此未运行站点语法 / 内容质量门禁作为通过依据。

已完成的检查：

- 本地桌面渲染检查：5 个目标页面均可访问。
- 桌面横向溢出检查：5 个目标页面均为 `false`。
- 页面截图留存：已生成到 `agent-workflow/reports/WSD-20260511-06-render-*.png`。
- 开发 closeout 检查：派发单列出的 4 份 closeout 均存在。

未运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：本窗口不改代码，不将语法门禁作为页面质量 accepted 依据。
- `node agent-workflow/tools/run-quality-gates.mjs v2content`：本任务不检查真实数据抓取质量或内容 schema。

## 12. 最终结论

`needs-revision`。

这些页面已经接近观澜AI V2 的正确方向，尤其 `signals.html` 和 `signal-detail.html` 有明显商业判断感；但 Builders 体系、Structured Signal 来源事实、英文内部标签和信号到机会 / 内参的关系表达仍需修改。修改后建议再次派发独立页面与文案质检，达标后再由调度窗口 accepted。
