# WSD-20260508-15 V2 全站设计 / 文案 / 视觉资产质感升级自动包

日期：2026-05-08  
状态：ready / stage-1-diagnosis-first  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue` / `copy` / `pm` / `dev` / `qa` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-SITE-QUALITY-AUTO`
- Task ID：`WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`
- 任务类型：页面类 / 文案类 / 视觉资产类 / 自动化执行包
- 派发单：`agent-workflow/execution/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot-closeout.md`
- 调度口令：`收口：WSD-20260508-15-v2-site-design-copy-visual-system-autopilot`
- 是否可能影响自动化：否，除非阶段 2 需要调整站点数据生成器以承载新视觉字段

执行窗口最短启动提示词：

```text
执行任务：WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot.md。
先执行阶段 1：全站诊断、设计/字体/VI/文案标准、栏目逐项优化方案，不要改页面代码。
阶段 1 完成后写 UTF-8 阶段报告：
agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md
把阶段 1 结论发给用户确认。
用户确认后，再继续阶段 2：按栏目逐个自动优化并写最终 closeout。
回调度窗口：收口：WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
```

## 1. 任务目标

解决当前 V2 网站页面粗糙、简陋、排版松散、页头页脚不够高级、字体和 VI 落地不充分、商业判断产品感不足的问题。

本任务采用“诊断先行，确认后自动执行”的方式：

1. 先输出全站诊断和统一标准。
2. 将现有相关任务合并进来，避免重复派发。
3. 用户确认优化方向后，执行窗口继续阶段 2，按 Home、今日要点、关键信号、机会解码、商业内参、详情页母版逐个优化。
4. 补充栏目图片、商业内参常用符号和视觉元素，包括但不限于澜线、雷达图、热力图、判断卡、内参封面元素、关系网络暗示图形。
5. 全站文案重新审查，清理内部流程语、样例感、空泛营销和不符合判断边界的表达。

## 2. 合并范围与不可继承边界

本任务合并以下现有事项，但不得把此前页面任务的完成度或验收结论作为视觉质量基线。用户已明确对之前页面任务完成度和验收结果不满意，执行窗口必须重新诊断、重新定标准、重新评分。

| 来源任务 / 规范 | 合并方式 |
|---|---|
| `V2-PUBLIC-COPY-FOOTER-CLEANUP` | 合并其页脚、公开前台文案、sample fallback 清理后的未完成截图验收与 Design Director 复核 |
| `V2-PAGE-TIME-DIMENSION` | 合并其“时间线索”模块视觉与截图验收，不单独再派发 |
| `GL-M4-029 V2 字体规范` | 作为阶段 1 和阶段 2 的字体硬基线 |
| `V2-VI-SVG-RESTORE / WSD-20260508-14-vi-svg-restoration` | 作为最新 VI SVG 资产和 VI 引用硬基线 |
| `docs/brand/wavesight-ai-vi/` | 作为本任务唯一视觉规范来源，必须按其中 Logo、SVG、字体、token、动效和使用说明执行 |
| `V2-SITE-AUTO` | 只作为当前代码现状和页面范围参考，不作为视觉完成度基线 |
| `V2-HERO-BLEND-EXTEND` | 只作为已存在 hero CSS 改动事实参考，不作为首页视觉质量基线 |
| `V2-8AUTO` | 只作为栏目范围、数据 schema、Copy / Editorial 方向参考，不作为页面母版质量基线 |
| `V2-3` | 只作为历史 VI 方向来源参考；若与当前 `docs/brand/wavesight-ai-vi/` 冲突，以最新 VI 资料库为准 |

不可继承边界：

- 不得写“沿用此前已验收页面基线”。
- 不得因为 `V2-SITE-AUTO`、`V2-HERO-BLEND-EXTEND` 曾标记 accepted，就默认其页面质感合格。
- 不得复用之前任务的 Design Director 分数作为本任务通过依据。
- 阶段 1 必须把当前页面当作待审查对象重新评分；评分不足则列为重做项。
- 视觉规范必须引用最新 `docs/brand/wavesight-ai-vi/`、`typography-guidelines.md`、`brand-tokens.css`、`motion-tokens.css` 和 `executable-svg/`。

## 3. 阶段设置

### 阶段 1：诊断与标准，不改代码

阶段 1 只做诊断、评分、标准和逐栏目方案，不进入 Dev。

必须输出：

1. 全站视觉诊断表：页面粗糙点、主次层级、页头页脚、字体、间距、卡片、空白、图形资产、移动端风险。
2. Design Director 评分：Home 和各一级栏目按 SYS-7 证据化审美闸门评分，首页 / 母版通过线 85，栏目 / 详情通过线 80。
3. V2 页面设计标准：排版、页头、页脚、字体、色彩、留白、卡片、视觉资产、动效克制规则。
4. 栏目视觉资产策略：哪些页面使用生成图，哪些页面使用 SVG 符号，哪些页面使用数据图形或商业内参元素。
5. 文案审查标准：标题、CTA、栏目说明、卡片摘要、页脚、内参表达和禁用语。
6. 逐栏目优化顺序与改动清单：先 Home，再今日要点、关键信号、机会解码、商业内参、详情页母版。
7. 哪些改动只属于视觉增强，哪些可能构成新功能或新模块；若构成新模块，必须先补 PM 门禁和模块决策表。
8. 明确列出此前页面任务中不可借鉴的问题，避免把旧页面质感继续带入阶段 2。
9. 明确列出最新 VI 资料库中可直接引用的 SVG、Logo、token、字体和动效资产。

阶段 1 输出文件：

- `agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md`

阶段 1 完成后必须暂停，等用户确认后再执行阶段 2。

### 阶段 2：确认后自动逐栏目优化

用户确认阶段 1 方案后，执行窗口可继续阶段 2，不需要重新派发。

执行顺序：

1. 全站基础：tokens、字体落地、页头、页脚、全局排版节奏。
2. Home：首页结构、首屏、关键内容区、商业判断视觉。
3. 今日要点：日期、要点、时间线索、今日判断的阅读路径。
4. 关键信号：Signal 卡片、来源、商业含义、关系提示、雷达/证据视觉。
5. 机会解码：机会报告列表、方向判断、成立边界、流程/客户/价值表达。
6. 商业内参：内参封面感、热力图、判断卡、会员边界和报告阅读节奏。
7. 详情页母版：Signal / Daily / Opportunity / Brief 详情页长文排版、信息图形、引用块、关联资产。
8. 移动端：逐页检查主次、断行、按钮、卡片、横向溢出。

## 4. 非目标

- 不恢复或改动旧 `04-Site`。
- 不处理 `09-ai-news-radar`。
- 不改 V1 内容目录。
- 不新增一级导航，除非 PM 门禁通过且用户确认。
- 不把 The Point 或 Trends 恢复为 V2 一级栏目。
- 不做 Netlify deploy，除非用户单独确认。
- 不使用通用蓝紫科技风、机器人、眼睛、赛博大屏、夸张雷达屏作为主视觉。
- 不重画 Logo；Logo 必须引用 `docs/brand/wavesight-ai-vi/` 中已有 SVG 资产。
- 不用图片掩盖信息架构问题；先修阅读路径和层级，再补视觉资产。

## 5. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 判断视觉模块是否构成新功能；必要时补 PM 门禁、WAVE 和模块决策表 |
| UI / UE Design Director | 阶段 1 全站诊断、设计标准、逐页评分；阶段 2 页面设计与视觉资产方向 |
| Copy Agent | 全站外部表达审查、禁用语清理、栏目和详情页文案规范 |
| Dev Agent | 阶段 2 按 UI / Copy 表逐项实现，生成或引用视觉资产 |
| QA / Acceptance Agent | 独立截图验收、移动端检查、风格评分复核、文案边界检查 |
| Workflow / Automation Agent | 阶段报告、closeout、合并任务状态和调度记录 |

## 6. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/governance/quality-gates.md`
5. `agent-workflow/governance/plan-first-policy.md`
6. `agent-workflow/v2/v2-workflow-skill-graph.md`
7. `agent-workflow/v2/v2-page-master-spec.md`
8. `agent-workflow/v2/v2-copy-editorial-system.md`
9. `agent-workflow/v2/v2-vi-design-direction.md`
10. `agent-workflow/product/DESIGN.md`
11. `agent-workflow/product/COPY.md`
12. `docs/brand/wavesight-ai-vi/USAGE.md`
13. `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
14. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
15. `docs/brand/wavesight-ai-vi/brand-tokens.css`
16. `docs/brand/wavesight-ai-vi/motion-tokens.css`
17. `docs/brand/wavesight-ai-vi/executable-svg/README.md`
18. `agent-workflow/reports/WSD-20260508-08-v2-public-copy-footer-cleanup-closeout.md`
19. `agent-workflow/reports/V2-PAGE-TIME-DIMENSION-closeout.md`
20. 本派发单

## 7. 可用技能和插件

按 `agent-workflow/v2/v2-workflow-skill-graph.md` 使用技能，技能只能增强长期 Agent，不替代长期岗位。

建议使用：

| 能力 | 用途 |
|---|---|
| `frontend-design` | 页面审美、信息架构、视觉系统升级 |
| `imagegen-frontend-web` 或 `imagegen` | 生成栏目图片、内参视觉、商业判断背景图；必须符合 VI |
| `awesome-design-md` | 参考高质量 DESIGN.md 的结构，不直接套风格 |
| `copy-editing` | 全站文案审查与压缩 |
| `humanizer` | 去除 AI 腔、营销腔和空泛表达 |
| `browser-use` 或 `playwright-browser-automation` | 桌面 / 移动截图和页面验收 |

如调用外部网络素材、外部 GitHub skill / repo 或非项目内资产，closeout 必须说明来源、授权风险和安全边界。

## 8. 允许改动范围

阶段 1：

- `agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md`

阶段 2 用户确认后：

- `01-SiteV2/site/*.html`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/brand/`
- `01-SiteV2/site/assets/images/`
- `01-SiteV2/site/assets/visuals/`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- `agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-closeout.md`
- 阶段 2 如确需更新生成器：`01-SiteV2/site/scripts/sync-v2-site-data.mjs`

## 9. 禁止改动范围

- `10-Archive/`
- `09-ai-news-radar/`
- 旧 V1 `04-Site` 路径或归档内旧站工程
- Codex app 自动化本体
- Netlify 生产部署配置，除非用户单独确认
- 与本任务无关的内容入库、算法和来源 registry

## 10. 预期输出

阶段 1：

- `agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md`

阶段 2：

- 改造后的 V2 本地网站页面。
- 生成或引用的栏目图片、商业内参符号、雷达图、热力图、判断卡等视觉资产。
- 桌面 / 移动截图目录。
- 最终 closeout：`agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot-closeout.md`

## 11. 页面类硬性要求

本任务是页面类任务，必须完整执行：

1. UI / UE 页面规范表。
2. Design Director 证据化风格美观质检表。
3. Copy 文案规范表。
4. Dev 按表实现说明。
5. QA 桌面 / 移动端截图验收。

阶段 2 accepted 通过线：

- 首页 / 全站母版 / 核心首屏 / 视觉资产：`>=85`。
- 一级栏目页 / 详情页 / 会员页：`>=80`。
- 任一单项低于 `14`、Squint Test 不通过、页面仍显粗糙简陋、移动端遮挡或横向溢出，均不得 accepted。

## 12. 文案类硬性要求

Copy Agent 必须输出：

- 全站禁用语清单。
- 首页、四个一级栏目、详情页母版、页脚的文案修改表。
- 每处文案的目标、替换后文案、判断边界、容器适配说明。

公开前台禁止：

- 内部流程语：`同步`、`字段`、`后台`、`入库`、`生成器`、`JSON`、`样例`。
- 空泛营销：`颠覆`、`抢占红利`、`财富密码`、`确定机会`、`立即行动`。
- 替用户下最终判断：投资、采购、合作、经营动作的确定性建议。

## 13. 视觉资产要求

视觉资产必须服务于商业判断，不做装饰堆叠。

可生成或引用：

- 栏目封面图：Home、今日要点、关键信号、机会解码、商业内参。
- 商业内参符号：澜线、地平线、判断卡、Issue No.、封面标签、报告页眉。
- 数据视觉：雷达图、热力图、关系网络、证据强弱提示、行业 / 岗位 / 流程热度图。
- 长文阅读元素：引用块、来源脚注、边界提示、相关判断资产。

要求：

- 优先使用 `docs/brand/wavesight-ai-vi/` 真实 SVG 和 tokens。
- 如用 image generation，提示词必须写入 closeout，并保存生成文件到 `01-SiteV2/site/assets/images/` 或 `01-SiteV2/site/assets/visuals/`。
- 图片不能模糊、暗黑、纯氛围、通用科技感或与内容无关。
- 生成图必须在桌面和移动端实际截图验收。

## 14. 必跑检查

阶段 1：

- [ ] 阶段 1 报告 UTF-8 保存。
- [ ] Design Director 评分表。
- [ ] Copy 文案审查表。
- [ ] 逐栏目优化清单。
- [ ] 明确需要用户确认的改动点。

阶段 2：

- [ ] `node --check 01-SiteV2/site/assets/app.js`
- [ ] `node --check 01-SiteV2/site/dev-server.mjs`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 如修改数据生成器，运行 V2 内容生成与 `v2content` 相关闸门。
- [ ] 本地 HTTP 页面检查。
- [ ] Home、今日要点、关键信号、机会解码、商业内参、详情页母版桌面截图。
- [ ] 同一页面集合移动端截图。
- [ ] 无横向溢出、遮挡、文字挤压、按钮溢出。
- [ ] 普通前台无内部流程语。
- [ ] Design Director 复评分达标。

## 15. closeout 必须包含

- 阶段 1 诊断摘要和用户确认结论。
- 实际改动文件清单。
- 合并任务处理结果：`V2-PUBLIC-COPY-FOOTER-CLEANUP`、`V2-PAGE-TIME-DIMENSION`、`GL-M4-029` 的吸收情况。
- 生成 / 引用视觉资产清单、来源和提示词。
- 每个栏目优化前问题、优化后结果和截图路径。
- Copy 替换表和禁用语检查结果。
- Design Director 评分表。
- QA 桌面 / 移动截图验收。
- Quality Gates 报告路径。
- 未做事项和风险。
- 是否部署 Netlify：默认否。

## 16. 执行窗口启动提示词

```text
执行任务：WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
请读取 AGENTS.md 和 agent-workflow/execution/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot.md。

这是 V2 全站设计 / 文案 / 视觉资产质感升级自动包。

先做阶段 1，不要改页面代码：
1. 审查当前 V2 网站页面是否粗糙简陋。
2. 对排版、页头页脚、字体规范、VI 规范、视觉资产、栏目图片、商业内参符号、雷达图、热力图、文字表达做全站诊断。
3. 合并看板中相关事项：V2-PUBLIC-COPY-FOOTER-CLEANUP、V2-PAGE-TIME-DIMENSION、GL-M4-029 字体规范。
4. 不得借鉴 V2-3 / V2-8AUTO / V2-SITE-AUTO / V2-HERO-BLEND-EXTEND 的页面完成度和验收结论；它们只能作为历史上下文、现有代码范围和问题来源参考。
5. 必须以最新 `docs/brand/wavesight-ai-vi/` 为 VI 硬规范，引用其中 Logo、SVG、字体、token、动效和使用说明。
6. 输出整体诊断、设计标准、文案标准、视觉资产策略和逐栏目优化清单。
7. 写 UTF-8 阶段报告：agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-stage1.md。
8. 阶段 1 完成后暂停，等用户确认。

用户确认后继续阶段 2：
按 Home、今日要点、关键信号、机会解码、商业内参、详情页母版逐个自动优化页面、文案和视觉资产。
可使用 imagegen / imagegen-frontend-web / gpt-image2 相关能力生成栏目图片、商业内参符号、雷达图、热力图等，但必须符合观澜 AI VI、字体规范和页面类硬闸门。

完成后写 UTF-8 closeout：
agent-workflow/reports/WSD-20260508-15-v2-site-design-copy-visual-system-autopilot-closeout.md

回调度窗口：
收口：WSD-20260508-15-v2-site-design-copy-visual-system-autopilot
```
