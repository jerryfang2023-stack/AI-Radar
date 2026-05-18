# WaveSight Writer Style Update - 2026-05-14

## 背景

用户明确要求三个写作线程形成观澜独特风格：

- 鲜明、有记忆点，但不煽动。
- 站在商业观察者视角，客观冷静。
- 有判断、有事实、有经营颗粒度。
- 不只写公司、行业、技术，也写具体的人、场景和冲突。
- 像商业记者一样，从小场景里写出大趋势。

## 本轮更新

新增统一写作规约：

- `agent-workflow/automation-prompts/writer-style-guide.md`

已接入三个 writer 的必读清单和写作规则：

- `agent-workflow/automation-prompts/daily-observation-writer.md`
- `agent-workflow/automation-prompts/trend-report-writer.md`
- `agent-workflow/automation-prompts/brief-periodical-writer.md`

同步更新总文案规范：

- `agent-workflow/product/COPY.md`

## 核心规则

三个 writer 共同遵守：

- 文章应像长期观察产业现场的商业记者写出的判断。
- 优先从具体人、场景、组织动作和商业冲突进入。
- 场景必须带出经营变量：时间、成本、职责、预算、信任、采购、交付、风险或组织阻力。
- 不得编造采访、人物、公司动作或现场细节。
- 没有真实现场时，可以写基于材料归纳的典型场景，但必须让读者知道这不是采访现场。
- 技术路线只解释商业含义。
- 避免公司列表、功能列表、投研模板、技术摘要和内部流程语言。
- 禁用“首先 / 其次 / 最后 / 值得注意的是 / 显而易见 / 不可否认 / 总而言之”等 AI 腔过渡词。
- 禁用带有“XX感 / XX性 / XX化”的抽象名词，改写成具体动作、流程和经营结果。
- 句子长短交替，多用短句，禁止连续超过 3 个句式整齐的排比句。
- 语气允许有一点主观判断，像在咖啡馆跟朋友聊生意变化，但事实必须站得住。

## 三类文章差异

### 今日观察

每日商业行情综述。用一个当日最能代表情绪或变化的场景开篇，解释市场为什么这样动，哪些是噪音，哪些值得进入变化卡。

### 趋势追踪

深度研究报告。用多个案例和场景串起同一条商业冲突，覆盖行业、赛道、公司、竞品、技术路线、客户需求、商业案例、观点分歧和反证。

### 商业内参

周期刊物。回看一个周期内哪些判断被增强、修正或降温，并给出下周期真正需要盯住的变化。

## 自动化影响

当前六个自动化线程中，三个写作线程的自动化 prompt 均指向本地 prompt 文件。由于本轮已更新本地 prompt 文件，后续自动化运行会读取新的写作口径；无需重新创建自动化任务。

## 后续门禁

新增风格检查脚本：

- `agent-workflow/tools/writer-style-gate.mjs`

已接入统一检查入口：

- `node agent-workflow/tools/run-quality-gates.mjs style`

三个 writer 完成后必须同时运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- `node agent-workflow/tools/run-quality-gates.mjs style`
