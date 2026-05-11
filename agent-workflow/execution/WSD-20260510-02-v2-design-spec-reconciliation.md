# WSD-20260510-02-v2-design-spec-reconciliation 派发单

日期：2026-05-10
状态：ready
调度窗口：当前主窗口
牵头 Agent：`ui-ue` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-DESIGN-SPEC-RECONCILE`
- Task ID：`WSD-20260510-02-v2-design-spec-reconciliation`
- 任务类型：治理类 / UI 规范类 / 文案规范类
- 派发单：`agent-workflow/execution/WSD-20260510-02-v2-design-spec-reconciliation.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md`
- 调度口令：`收口：WSD-20260510-02-v2-design-spec-reconciliation`
- 是否可能影响自动化：否，本任务不改内容生产线、站点代码、同步脚本或自动化配置
- Skill Pattern：`Tool Wrapper + Inversion + Generator + Reviewer`
- Pattern 顺序：先读取规范源 -> 诊断冲突 -> 生成 V2-only DESIGN 总纲 -> Reviewer 复核冲突是否清零
- 硬停顿：如发现需要改页面代码、改 VI 资产、改产品导航或改自动化，必须停止并回调度窗口
- Reviewer：`UI / UE Design Director` + `Workflow Agent`

执行窗口最短启动提示词：

```text
执行任务：WSD-20260510-02-v2-design-spec-reconciliation
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260510-02-v2-design-spec-reconciliation.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md。
回调度窗口：收口：WSD-20260510-02-v2-design-spec-reconciliation
```

## 1. 任务目标

将当前设计规范清理为 V2-only 的单一可信设计总纲，解决以下冲突：

- 旧 `Daily Brief / Signals / Opportunities / Trends / The Point` 一级栏目口径与 V2 `今日要点 / 关键信号 / 机会解码 / 商业内参` 口径并存。
- `1200-1280px` 与 `1520-1680px` 页面宽度建议并存。
- `6-12px` 圆角范围与 `brand-tokens.css` 中固定 token 未统一。
- VI 禁止雷达 / 科技母题，与商业内参可用雷达图 / 热力图之间边界不清。
- `DESIGN.md` 中残留 P0 / P1 / V1 历史段落，可能被后续执行窗口误读为 V2 当前规则。
- 参考 Apple / Linear / Stripe 等外部方向时，没有明确“只学习页面逻辑，不继承品牌视觉”的边界。

最终结果应让后续执行窗口只读 `DESIGN.md` 就能明确：

- 当前 V2 有效导航和页面体系。
- 当前 VI / 字体 / token / SVG 使用规则。
- 页面宽度、圆角、字体、模块节奏、截图验收和 Design Director 评分标准。
- 哪些旧规范已归档或标注为 historical，不得作为 V2 开发依据。

## 2. 非目标

- 不修改 `01-SiteV2/site/` 页面代码、样式、脚本或资产。
- 不修改 `docs/brand/wavesight-ai-vi/` 正式 VI 资产、Logo、SVG 生成脚本或 token。
- 不新增一级导航，不恢复 The Point / Trends 为一级栏目。
- 不继续或复活 `V2-SITE-QUALITY-AUTO`。
- 不处理 `09-ai-news-radar/`。
- 不做 Netlify deploy。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Design Director | 牵头重写 V2-only 设计总纲，统一页面规范、VI 引用和验收标准 |
| PM Agent | 复核导航、栏目、模块边界是否符合 V2 产品架构 |
| Copy Agent | 复核栏目命名、对外表达、禁用语和中英文命名一致性 |
| QA Agent | 复核规范是否可验收、是否有明确通过线和截图要求 |
| Workflow Agent | 更新进度、feature、handoff 和 closeout |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/dispatch-state-reconciliation.md`
4. `agent-workflow/governance/window-dispatch-hub.md`
5. `agent-workflow/governance/skill-pattern-gate.md`
6. `agent-workflow/product/DESIGN.md`
7. `agent-workflow/v2/v2-page-master-spec.md`
8. `agent-workflow/v2/v2-product-architecture-prd.md`
9. `agent-workflow/v2/v2-navigation-column-finalization.md`
10. `docs/brand/wavesight-ai-vi/USAGE.md`
11. `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
12. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
13. `docs/brand/wavesight-ai-vi/brand-tokens.css`
14. `docs/brand/wavesight-ai-vi/motion-tokens.css`
15. `docs/brand/wavesight-ai-vi/executable-svg/README.md`
16. `docs/brand/wavesight-ai-vi/executable-svg/manifest.json`

## 5. 允许改动范围

- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/archive/`，如需归档旧 DESIGN 段落或旧版副本
- `agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md`
- `agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-conflicts.md`，如需单独输出冲突清单
- `agent-workflow/progress.md`
- `docs/agent-handoff.md`
- `agent-workflow/feature_list.json`

## 6. 禁止改动范围

- `01-SiteV2/site/`
- `01-SiteV2/content/`
- `docs/brand/wavesight-ai-vi/` 下的正式 VI、SVG、token 和生成脚本
- `10-Archive/`
- `09-ai-news-radar/`
- Netlify / GitHub / automation 配置
- 任何页面实现代码、站点 CSS、站点 JS

## 7. 预期输出

主交付物：

1. V2-only 版 `agent-workflow/product/DESIGN.md`。
2. 旧 P0 / P1 / V1 设计段落的归档或明确 historical 标注。
3. 设计规范冲突清单及处理表。
4. 当前有效设计规范摘要，写入 `docs/agent-handoff.md` 和 `agent-workflow/progress.md`。
5. `feature_list.json` 新增或更新本任务状态。
6. UTF-8 closeout：`agent-workflow/reports/WSD-20260510-02-v2-design-spec-reconciliation-closeout.md`。

`DESIGN.md` 至少应包含：

- V2 设计定位。
- V2 当前导航与栏目体系。
- VI / SVG / token 使用规则。
- 字体系统。
- 色彩系统。
- 页面宽度与布局系统。
- 圆角、边框、阴影和卡片规则。
- Home / 今日要点 / 关键信号 / 机会解码 / 商业内参 / 详情页母版。
- 商业图表规则：热力图、雷达图、趋势图可用边界。
- 文案与标题规则。
- Design Director 评分和截图验收。
- 禁止继承 `V2-SITE-QUALITY-AUTO` 失败任务成果。
- 旧规范 historical 区或归档路径。

## 7S. Skill Pattern Gate

### 7S.1 Pattern 标注

| 项目 | 结论 |
|---|---|
| 主 Pattern | `Tool Wrapper + Inversion + Generator + Reviewer` |
| Pattern 组合顺序 | 读取规范源 -> 冲突诊断 -> 生成 V2-only DESIGN -> Reviewer 复核 |
| 为什么选这个 Pattern | 本任务是规范治理，不是页面实现；需要先读取稳定规范，再诊断冲突，最后生成可执行总纲 |
| 必须读取的 Tool Wrapper / 规范 | VI、字体、token、页面母版、产品架构、状态冲突治理 |
| 必须生成的 Generator 产物 | V2-only DESIGN、冲突处理表、closeout、handoff/progress 摘要 |
| 必须独立执行的 Reviewer | UI / UE Design Director、Workflow Agent；涉及栏目命名时 Copy / PM 复核 |
| 必须先诊断 / 先确认的 Inversion 节点 | 先列出所有冲突和处理策略，不得直接覆盖 DESIGN.md |
| Pipeline 阶段顺序 | A. 读取规范源；B. 冲突清单；C. DESIGN 重写/归档；D. Reviewer 复核；E. 回填 |
| 硬停顿 | 如需要改页面代码、VI 资产、导航结构或自动化，停止并回调度窗口 |
| closeout 必须提供的 Pattern 证据 | 已读取文件、冲突表、处理结果、Reviewer 复核、未处理风险 |

### 7S.2 Pattern 硬闸门

- 缺少冲突清单，不得 accepted。
- 没有说明旧规范如何归档或标注 historical，不得 accepted。
- 没有明确 V2 当前有效口径，不得 accepted。
- 若误改页面代码、站点资产、VI 资产或自动化配置，不得 accepted。

## 7P. 产品功能类任务硬性要求

不适用。本任务不新增页面、导航、功能、会员权益或数据维度。

## 7A. 页面类任务硬性要求

本任务不实现页面，但会修改页面设计规范，因此必须保留以下审查要求：

- 不需要 Dev 实现。
- 不需要浏览器截图。
- 必须输出 UI/UE 规范冲突清单。
- 必须明确后续页面任务的截图验收口径。
- 必须明确 V2 页面路径为 `01-SiteV2/site/`，旧 `04-Site/` 只作 V1 归档参考。

## 8. 必跑检查

```powershell
node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list.json OK')"
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如归档或重写 Markdown，必须人工确认中文无乱码，文件为 UTF-8。

## 9. 收口验收标准

调度中枢验收时检查：

- 是否把 V2 当前导航统一为 `今日要点 / 关键信号 / 机会解码 / 商业内参`。
- 是否明确 The Point / Trends 为降级模块。
- 是否解决 `1200-1280px` vs `1520-1680px` 的宽度冲突。
- 是否统一圆角 token 和可用范围。
- 是否明确雷达图 / 热力图是数据可视化，不是品牌母题。
- 是否清理或标注 P0 / P1 / V1 历史段落。
- 是否明确外部参考只学页面逻辑，不继承品牌视觉。
- 是否保留 VI / SVG / token-first 规则。
- 是否禁止继承 `V2-SITE-QUALITY-AUTO` 失败成果。
- 是否通过必跑检查。
