task_id: WSD-20260508-10-v2-source-interface-upgrade-autopilot
board_id: V2-SOURCE-INTERFACE-UPGRADE
status: completed
recommended_status: accepted / source-registry-ready
dispatch_path: agent-workflow/execution/WSD-20260508-10-v2-source-interface-upgrade-autopilot.md
closeout_path: agent-workflow/reports/WSD-20260508-10-v2-source-interface-upgrade-autopilot-closeout.md
changed_files:
  - agent-workflow/v2/v2-source-interface-registry.md
  - 01-SiteV2/content/10-databases/source-registry-v2.json
  - agent-workflow/v2/v2-daily-source-collection-strategy.md
  - agent-workflow/v2/v2-commercial-brief-depth-standard.md
  - agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md
  - agent-workflow/tools/v2-source-probe.mjs
  - agent-workflow/tools/v2-source-quality-gate.mjs
  - agent-workflow/tools/run-quality-gates.mjs
  - agent-workflow/governance/quality-gates.md
  - agent-workflow/reports/v2-source-probe-2026-05-08.json
  - agent-workflow/reports/v2-source-probe-2026-05-08.md
  - agent-workflow/reports/v2-source-quality-gate-2026-05-08.md
gates:
  - source-registry JSON parse: passed
  - v2-source-quality-gate: passed
  - v2-source-probe: 4/5 success
  - syntax: passed
automation_impact: V2 daily 09:00 automation now reads source registry first, uses expanded collection tiers, and applies commercial brief depth/display standards.
blockers: arXiv probe hit HTTP 429 during this run; non-blocking because at least 4 low-barrier probes succeeded and fallback is documented.
next_action: 调度中枢验收后将 V2-SOURCE-INTERFACE-UPGRADE 标记为 accepted，并观察下一次 09:00 自动化。

# V2 Source Interface Upgrade Closeout

## 1. 完成事项

本轮已完成 V2 新闻源与接口升级：

- 新增 `agent-workflow/v2/v2-source-interface-registry.md`。
- 新增 `01-SiteV2/content/10-databases/source-registry-v2.json`。
- 新增 `agent-workflow/v2/v2-daily-source-collection-strategy.md`。
- 新增 `agent-workflow/v2/v2-commercial-brief-depth-standard.md`，固化每日信号 / 深挖机会卡 / 趋势链的商业内参深度、白话表达和展示元素要求。
- 新增 `agent-workflow/tools/v2-source-probe.mjs`。
- 新增 `agent-workflow/tools/v2-source-quality-gate.mjs`。
- 更新 `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`，每日 09:00 自动化必须优先读取 source registry。
- 更新 `agent-workflow/tools/run-quality-gates.mjs`，syntax 模式纳入 V2 source probe / source quality gate 语法探针。
- 更新 `agent-workflow/governance/quality-gates.md`，新增 V2 Source Registry 闸门。

## 2. Source Registry 结果

机器可读 registry：

```text
01-SiteV2/content/10-databases/source-registry-v2.json
```

统计：

| 指标 | 数量 |
|---|---:|
| 来源总数 | 27 |
| 默认启用 | 22 |
| requires-key | 2 |
| requires-consent | 3 |
| 覆盖来源类型 | 7 |

默认启用来源覆盖：

- GDELT DOC 2.0。
- AI HOT selected items。
- follow-builders monitored builder feed。
- Hacker News Algolia / Firebase。
- GitHub REST Search API。
- arXiv API。
- OpenAI、Anthropic、Google / DeepMind、Microsoft、GitHub、NVIDIA 官方来源。
- TechCrunch、Reuters、VentureBeat。
- YC、a16z、Sequoia。
- AWS / Azure Marketplace、Hugging Face。

默认禁用：

- Product Hunt API v2：requires-key。
- Crunchbase API：requires-key。
- Reddit API：requires-consent。
- X / Twitter：requires-consent，不启用非官方抓取。
- LinkedIn：requires-consent。

## 3. AI HOT 接入

用户要求安装新的新闻源：

```text
https://github.com/KKKKhazix/khazix-skills
```

已安装：

```text
C:\Users\86186\.skill-store\aihot\SKILL.md
```

安全审查结论：

- `aihot` 目录只有 `SKILL.md`。
- 未发现读取本地凭据、修改系统文件、安装依赖或要求 API Key。
- 访问 `https://aihot.virxact.com/api/public/items` 公开 API。
- 风险等级：中低。

V2 使用口径：

- `aihot-virxact-selected` 已写入 registry。
- 默认启用，但标记为 M 级 `source-router`。
- AI HOT 是中文 AI 圈精选采集通道，不是事实证据分类。
- 每条线索必须回看原始 URL；证据等级按原始来源重新判定为 S/A/B/C。
- Front Signal 的来源数量只计算解析后的 S/A/B 原始证据，不计算 AI HOT 通道本身。

`follow-builders-monitor` 也按同一原则写入 registry：

- 默认启用，标记为 M 级 `source-router`。
- Builder 内容可作为观点校准或二次验证入口。
- 不把 follow-builders 本身计为事实主证据。

## 4. 扩大采集口径

用户确认新漏斗：

```text
Raw 80-150
-> Pool 20-30
-> Structured 8-15
-> Front Signal 3-5
-> Deep Dive 1-2
-> Trend Updates 3-5
```

已写入：

- `agent-workflow/v2/v2-daily-source-collection-strategy.md`
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`
- `01-SiteV2/content/10-databases/source-registry-v2.json`

三档执行：

| 场景 | Raw | Pool | Structured | Front | Deep Dive | Trend |
|---|---:|---:|---:|---:|---:|---:|
| 日常默认 | 80-120 | 20-25 | 8-12 | 3 | 1 | 3 |
| 高信号日 | 120-150 | 25-30 | 12-15 | 4-5 | 1-2 | 4-5 |
| 降级日 | 50-80 | 12-20 | 5-8 | 2-3 | 0-1 | 1-3 |

硬边界：

- 扩大 Raw 只扩大候选池，不降低前台发布阈值。
- Front Signal 每条仍必须至少 3 个 S/A/B 来源。
- 第 2 条 Deep Dive 只有证据链、反证和商业模式都充足时生成。
- M 级采集通道不能作为事实主证据；C 级来源不能作为事实主证据。

## 4A. 商业内参深度与展示口径

用户追加要求：

- 网站内容要有更丰富的展现形式，包括时间线、热力图、雷达图、趋势图、内参符号或信息元素。
- 内容不能有 AI 味和机械味，要面向普通老板讲清楚，可以专业，但必须易懂。

已落地：

- 新增 `agent-workflow/v2/v2-commercial-brief-depth-standard.md`。
- `agent-workflow/v2/v2-daily-source-collection-strategy.md` 已要求每日自动化读取该标准。
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md` 已加入商业内参深度、白话表达和展示元素要求。

三类栏目最低展示元素：

| 内容 | 最低展示元素 |
|---|---|
| 每日信号 | 时间线、影响坐标、证据梯子、商业变量卡、反证卡中至少 3 个 |
| 深挖机会卡 | 机会地图、玩家分层、商业模式表、验证清单、雷达图 / 风险雷达中至少 5 个 |
| 趋势链 | 趋势阶段条、趋势线、热力图、信号簇、推力 / 阻力、升降级触发器中至少 4 个 |

写作闸门：

- 先讲人话，再解释专业词。
- 每段必须回答一个商业问题。
- 模型、论文、框架必须落到客户、成本、收入、交付、采购或风险上。
- 不用“值得关注”“潜力巨大”“生态形成”等空话替代判断。

## 5. Probe 结果

已运行：

```powershell
node agent-workflow/tools/v2-source-probe.mjs --date=2026-05-08
```

报告：

```text
agent-workflow/reports/v2-source-probe-2026-05-08.json
agent-workflow/reports/v2-source-probe-2026-05-08.md
```

结果：

| 来源 | 状态 | 数量 | 说明 |
|---|---|---:|---|
| GDELT DOC 2.0 | success | 10 | 公开新闻搜索可用 |
| AI HOT selected items | success | 20 | 新增新闻源可用 |
| Hacker News Algolia | success | 10 | 开发者线索可用 |
| GitHub Search API | success | 10 | 开源生态线索可用 |
| arXiv API | failed | 0 | HTTP 429 Rate exceeded |

结论：

- 至少 3 类无密钥或低门槛来源 probe 已成功，本轮实际成功 4 类。
- arXiv 是公开低门槛来源，但本轮被限流，已记录为非阻塞降级项。
- Raw probe 结果只用于诊断，未发布到前台。

## 6. Quality Gates

已运行：

```powershell
node -e "JSON.parse(require('fs').readFileSync('01-SiteV2/content/10-databases/source-registry-v2.json','utf8')); console.log('ok')"
node --check agent-workflow/tools/v2-source-probe.mjs
node --check agent-workflow/tools/v2-source-quality-gate.mjs
node agent-workflow/tools/v2-source-quality-gate.mjs --date=2026-05-08
node agent-workflow/tools/run-quality-gates.mjs syntax
```

通过：

- source-registry JSON parse：passed。
- v2-source-probe syntax：passed。
- v2-source-quality-gate syntax：passed。
- v2-source-quality-gate：passed。
- syntax Quality Gate：passed。

报告：

```text
agent-workflow/reports/v2-source-quality-gate-2026-05-08.md
agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-053945.md
agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-060748.md
```

最新复验：

- `v2-source-quality-gate --date=2026-05-08`：passed。
- `syntax`：passed，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-08-20260508-060748.md`。

## 7. 自动化影响

影响对象：

- V2 daily 09:00 automation：直接影响。

更新后要求：

- 每日自动化必须先读取 `source-registry-v2.json`。
- Raw 候选必须写清来源分布。
- 接口失败必须写清失败接口、错误、降级来源和缺口。
- HN / X / Reddit 等 C 级来源只能触发二次搜索。
- AI HOT / follow-builders 等 M 级采集通道只能触发二次搜索或观点校准，不计为事实主证据。
- 每日内容必须生成时间线、热力图、雷达图、趋势图、机会地图或内参信息元素，不再只输出纯文字卡片。
- 内容必须面向普通老板讲清商业变量和边界，避免 AI 味、机械味和专家黑话。
- 不得因为接口失败把单一搜索结果伪装成多源结果。
- 保持每日 09:00 时间不变。

未做：

- 未处理 `09-ai-news-radar/`。
- 未恢复旧 `04-Site`。
- 未写入 V1 内容目录。
- 未做 Netlify deploy。
- 未默认启用 X / LinkedIn 非官方抓取。
- 未把 Product Hunt / Reddit / Crunchbase 等需要 key 或审批的来源硬编码为必需项。

## 8. 后续建议

1. 下一次 09:00 自动化观察 Raw 80-150 是否显著提升早期信号覆盖率。
2. 若 arXiv 连续限流，改为 arXiv RSS 或降低调用频率。
3. 可后续追加 `v2-source-weekly-report`，统计高产来源、噪音来源和 S/A/B 覆盖率。
