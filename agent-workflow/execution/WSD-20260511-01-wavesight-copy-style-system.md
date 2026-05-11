# WSD-20260511-01-wavesight-copy-style-system 派发单

日期：2026-05-11  
状态：ready / two-step-confirmation  
派发模式：formal_task / staged_confirmation  
牵头 Agent：Copy Agent  
协作 Agent：PM Agent / UI-UE Agent / Intelligence Data Agent / QA Agent / Workflow Agent  
任务类型：文案规范 / 品牌表达 / V2-only 治理  
Skill Pattern：Generator + Reviewer + Inversion + Pipeline  

## 0. 任务卡片

为观澜AI V2 建立一套可执行的文案风格规范，形成后续网站页面、栏目页、详情页、会员态、每日内容、知识卡片和商业内参都能复用的统一表达口径。

本任务分两步执行：

1. 第一阶段：先建立新版文案规范草案，用于替换或优化旧规范，但不直接覆盖旧规范。
2. 第二阶段：在用户确认新版规范后，再执行旧规范替换 / 优化、冲突检查、升级回填和验收动作。

本任务不直接修改网站页面、不改自动化脚本、不生成新的内容文章。

## 1. 执行窗口启动读取

新窗口先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-01-wavesight-copy-style-system.md`

本任务补读：

1. `agent-workflow/agents/copy-agent.md`
2. `agent-workflow/product/COPY.md`
3. `agent-workflow/product/strategy-single-source.md`
4. `agent-workflow/product/DESIGN.md`
5. `docs/brand/wavesight-ai-vi/typography-guidelines.md`

如发现栏目定位冲突，再补读：

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/reports/WSD-20260510-10-v2-opportunity-decode-design-closeout.md`
- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md`

不要批量读取旧 V1 任务、失败任务或无关 closeout。

## 2. 背景

观澜AI当前已进入 V2-only 生产开发。页面、VI、栏目、每日监测和知识库都在升级，但文案口径仍存在几个风险：

1. 旧 V1 文案、内部流程话术和 V2 商业情报定位可能混用。
2. 页面文案、栏目文案、每日内容标题和内参表达缺少统一风格表。
3. “信号 / 观点 / 机会 / 趋势 / 内参 / 热力图 / 会员态”等词的边界需要固定。
4. 后续 Dev 和内容自动化需要一套可检查的 Copy Gate，而不是依赖临场判断。

## 3. 两步目标

### Step 1：建立新版规范，等待确认

第一阶段只允许输出“新版观澜AI V2 文案风格规范草案”，并说明它将如何替换或优化旧 `COPY.md`。

第一阶段必须输出：

1. 新版文案规范草案。
2. 新旧规范差异表。
3. 保留 / 替换 / 删除 / 新增规则清单。
4. 栏目表达、标题、摘要、CTA、会员态、每日内容、知识卡片规则草案。
5. 禁用语、替代表和 before / after 示例草案。
6. 执行第二阶段前需要用户确认的问题。

第一阶段禁止：

1. 直接覆盖 `agent-workflow/product/COPY.md`。
2. 直接清理旧规范。
3. 直接更新其他治理文件。
4. 直接把草案写成最终 accepted。

第一阶段建议临时输出到：

```text
agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-stage1-draft.md
```

完成第一阶段后，执行窗口必须停止，并向用户回复：

```text
阶段 1 已完成：新版文案规范草案已生成。
请确认是否进入阶段 2：替换 / 优化旧 COPY.md，并执行冲突检查与升级回填。
```

### Step 2：确认后替换 / 优化旧规范并治理冲突

只有用户明确确认后，第二阶段才允许执行：

1. 将确认后的新版规范合并进 `agent-workflow/product/COPY.md`。
2. 对旧规范做保留、替换、删除和归档。
3. 检查与 V2-only、栏目架构、VI 字体气质、DESIGN.md、每日内容规则、知识库规则之间的冲突。
4. 补齐 Copy QA 表。
5. 写正式 closeout 并登记 closeout queue。

## 4. 最终规范覆盖范围

输出一套“观澜AI V2 文案风格系统”，至少覆盖：

1. 品牌声音：高级、克制、东方智识、商业内参、判断感。
2. 语气边界：不鸡血、不营销化、不技术堆叠、不替用户下最终经营 / 投资判断。
3. 栏目表达：今日要点、关键信号、机会解码、商业内参、观点校准、趋势背景、Builders 观点。
4. 标题规范：一级标题、栏目标题、卡片标题、详情页标题、内参标题、机会标题、Signal 标题。
5. 摘要和导语规范：一句话判断、证据边界、风险提示、观察口径。
6. CTA 规范：公开访问、会员预览、锁定态、申请访问、继续阅读。
7. 禁用语和替代表：内部流程词、过度营销词、夸大确定性词、后台技术词。
8. 中英文品牌与栏目固定写法。
9. 每日监测产物的文案要求：Front Signal、Structured Signal、Opportunity Deep Dive、Trend Update、Point / 观点校准。
10. 知识库卡片表达要求：观点库、案例库、信号库的标题、别名、双链摘要和标签语气。
11. Copy QA 检查表：后续页面和内容任务可直接按表验收。
12. 至少 20 条 before / after 示例，覆盖首页、栏目页、详情页、会员态、每日内容和知识卡片。

## 5. 非目标

本任务不做：

1. 不修改 `01-SiteV2/site/` 页面代码。
2. 不改 VI、Logo、字体 token 或 SVG 资产。
3. 不重写全站所有已有页面文案。
4. 不新增每日监测脚本和自动化。
5. 不调整栏目架构、会员定价、支付、权限或数据 schema。
6. 不继承 `V2-SITE-QUALITY-AUTO` 的任何失败结论。

如果执行中发现必须改栏目定位、产品架构或页面结构，停止并写入“需另派任务”，不得顺手修改。

## 6. 允许写入范围

第一阶段允许新增：

1. `agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-stage1-draft.md`

第二阶段经用户确认后，允许更新：

1. `agent-workflow/product/COPY.md`
2. `agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-closeout.md`
3. `agent-workflow/inbox/closeout-queue.jsonl`

如对 `COPY.md` 进行大幅重写，可在已存在的归档目录中保留旧版：

- `agent-workflow/product/archive/COPY-2026-05-11-pre-copy-style-system.md`

禁止写入：

1. `01-SiteV2/site/`
2. `01-SiteV2/content/`
3. `01-SiteV2/knowledge/`
4. `docs/brand/wavesight-ai-vi/`
5. `agent-workflow/tools/`
6. `09-ai-news-radar/`
7. `10-Archive/`

## 7. 推荐执行顺序

### Stage A：现状审计

1. 读取指定文档。
2. 检查 `COPY.md` 里仍然适用、需要升级、需要删除或需要改写的段落。
3. 标出与 V2-only、VI 字体气质、栏目架构和公开前台表达冲突的地方。
4. 形成不超过 20 条的“问题清单”，按严重程度排序。

### Stage B：生成新版规范草案

1. 输出新版规范草案，但不要覆盖 `COPY.md`。
2. 增加栏目级文案表。
3. 增加禁用语 / 推荐替代表。
4. 增加标题、导语、CTA、会员态和长文详情页规则。
5. 增加每日内容与知识卡片文案规则。
6. 增加 before / after 示例。

### Stage C：阶段 1 停止确认

1. 写入 stage1 draft。
2. 列出需要用户确认的取舍。
3. 停止执行，等待用户明确确认进入第二阶段。

### Stage D：确认后替换 / 优化旧规范

1. 根据用户确认结果更新 `COPY.md`。
2. 如大幅重写，归档旧版。
3. 清理冲突口径和旧表达。

### Stage E：Reviewer 复核

以 PM / UI-UE / Data / QA 四个视角复核：

1. PM：是否符合产品定位和栏目边界。
2. UI-UE：是否适合页面层级和阅读节奏。
3. Data：是否保留证据边界、来源边界和不确定性。
4. QA：是否可被后续任务按表验收。

### Stage F：收口登记

1. 写收口文件。
2. 向 `agent-workflow/inbox/closeout-queue.jsonl` 追加一行 JSONL 登记。
3. 收口中列出修改文件、未修改原因、风险和后续建议。

## 8. 验收标准

阶段 1 完成后必须满足：

1. 已生成新版文案规范草案。
2. 已列出新旧规范差异。
3. 已列出替换 / 保留 / 删除 / 新增规则。
4. 已明确需要用户确认的问题。
5. 未覆盖 `COPY.md`。

阶段 2 完成后必须满足：

1. `COPY.md` 成为 V2 文案风格单一可信规范。
2. 明确观澜AI的品牌声音和禁用表达。
3. 四个一级导航栏目都有独立文案规则。
4. 观点校准、趋势背景、Builders 观点都有降级后的表达边界。
5. Front Signal、Structured Signal、Opportunity、Business Brief 都有标题和摘要规则。
6. 有可复制的 Copy QA 表。
7. 有至少 20 条 before / after 示例。
8. 没有把内部流程词写成公开用户文案。
9. 没有把“可能性 / 观察 / 信号”写成确定性承诺。
10. 未修改任何网站代码或内容生产脚本。

## 9. 质量检查

至少执行：

```powershell
node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list json ok')"
node -e "$fs=require('fs');$p='agent-workflow/inbox/closeout-queue.jsonl';if($fs.existsSync($p)){$fs.readFileSync($p,'utf8').trim().split(/\r?\n/).filter(Boolean).forEach((l,i)=>{try{JSON.parse(l)}catch(e){throw new Error('bad jsonl line '+(i+1)+': '+e.message)}})};console.log('closeout queue jsonl ok')"
```

如运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`，只运行一次，并在 closeout 中引用结果；不要留下重复、无引用的临时报告。

页面截图验收不适用，因为本任务不改页面。

## 10. 收口文件要求

收口文件保存为 UTF-8：

```text
agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-closeout.md
```

收口必须包含：

1. 任务结论：accepted / needs-followup / blocked。
2. 修改文件列表。
3. `COPY.md` 新增或重构内容摘要。
4. 冲突清理结果。
5. Copy QA 表是否已补齐。
6. before / after 示例数量。
7. 质量检查结果。
8. 后续建议任务。
9. closeout queue 登记状态。

## 11. 给新窗口的执行提示词

请复制以下内容到新窗口：

```text
请按 01-WaveSight 项目长期 agent-workflow 执行任务。

任务 ID：WSD-20260511-01-wavesight-copy-style-system
任务名称：观澜AI V2 文案风格规范

先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-01-wavesight-copy-style-system.md

然后按派发单补读 Copy / Strategy / Design / Typography 相关文件。

你是本任务执行窗口，不是调度中枢。请完成：
阶段 1：
1. 审计现有 COPY.md 与 V2-only 产品口径的冲突。
2. 建立新版观澜AI V2 文案风格规范草案。
3. 输出新旧规范差异表、保留/替换/删除/新增规则清单、需要用户确认的问题。
4. 写入：agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-stage1-draft.md
5. 阶段 1 禁止覆盖 COPY.md，禁止改网站代码、内容脚本、VI 文件、自动化任务或 09-ai-news-radar。
6. 阶段 1 完成后停止，只回复草案文件路径，并请求用户确认是否进入阶段 2。

阶段 2：
只有用户明确确认后，才将确认后的新版规范合并进 agent-workflow/product/COPY.md，执行冲突检查、升级回填、质量检查和 closeout。

阶段 2 完成后写 UTF-8 收口文件：agent-workflow/reports/WSD-20260511-01-wavesight-copy-style-system-closeout.md
并向 agent-workflow/inbox/closeout-queue.jsonl 追加登记。
```
