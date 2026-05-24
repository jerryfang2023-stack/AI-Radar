---
task_id: WSD-20260523-business-signals-latest-signal-frontstage
title: 商业信号最新信号与首页商业信号前台调整 closeout
date: 2026-05-23
status: completed
owner: Codex / Experience & Editorial / Build & Release
encoding: UTF-8
revision: 20260523-1918
---

# WSD-20260523 商业信号最新信号与首页商业信号前台调整 closeout

## 1. 执行结论

本轮围绕商业信号前台完成收口：后台新增卡片已同步到前台，商业信号栏目页的「最新信号」改为融资 / 产品 / 案例的小栏目切换结构，首页商业信号恢复为三张卡片 + 右侧统计卡的原布局，仅修正右侧统计的近 3 日展示。

最终口径：

- 首页保留最右侧统计卡。
- 商业信号栏目页「最新信号」删除最右侧全局统计卡，只保留当前 tab 内的内容列表和右侧分类统计。
- 最新信号右侧统计卡采用与聚合页一致的横向柱状分布样式。
- 最新信号 tab 文字和数字居中，避免贴上边框。
- 人物详情页时间轴内不显示观澜点评，避免重复拉长页面。

## 2. 已修改文件

| 文件 | 修改内容 |
|---|---|
| `01-SiteV2/site/assets/app.js` | 同步新卡片数据后的前台渲染逻辑；调整商业信号「最新信号」tab 切换、tab 内统计卡、首页商业信号与人物详情时间轴展示 |
| `01-SiteV2/site/assets/styles.css` | 调整最新信号 tab、右侧横向柱状统计、栏目页紧凑度、首页统计卡近 3 日展示与按钮垂直居中 |
| `01-SiteV2/site/data/site-content.json` | 由同步脚本更新的前台内容数据 |
| `01-SiteV2/site/data/site-content.js` | 由同步脚本更新的前台内容数据包装文件 |
| `01-SiteV2/site/*.html` | 刷新前台资源版本到 `20260523-1918` |

新增页面文件：

- `01-SiteV2/site/opinion.html`
- `01-SiteV2/site/opinion-detail.html`
- `01-SiteV2/site/pipeline-dashboard.html`

## 3. 数据同步结果

已执行前台数据同步，当前前台内容口径：

| 指标 | 当前值 |
|---|---:|
| 当前日期 | `2026.05.23` |
| 当日商业信号 | 11 条 |
| 历史累计信号 | 32 条 |
| 当日融资 | 8 条 |
| 当日产品 | 2 条 |
| 当日案例 | 1 条 |

前台聚合页每页容量口径：15 条。商业信号栏目页首页「最新信号」最多展示 5 条，更多内容进入对应聚合页。

## 4. 前台展示规则

### 首页商业信号

- 恢复为三张信号卡 + 右侧统计卡。
- 三张卡分别显示融资、案例、产品的当前代表信号。
- 右侧统计卡保留，但趋势展示从近 4 日改为近 3 日，避免贴边拥挤。
- 卡片内容补充观澜点评，避免只有标题和摘要导致页面空。

### 商业信号栏目页：最新信号

- 改为融资 / 产品 / 案例 tab 切换。
- tab 下方左侧显示当前小栏目列表，右侧显示该小栏目的历史分类分布。
- 栏目页删除最右侧全局统计卡，避免与 tab 内统计重复。
- 右侧统计卡统一使用横向柱状图 + 标签 chip，不再使用旧的趋势柱图。
- tab 文本与数量垂直居中，按钮高度固定为 52px。

### 人物详情页

- 时间轴内只显示人物观点原文和必要翻译，不显示观澜点评。
- 观澜点评保留在首屏核心观点区域，避免同一判断反复出现。

## 5. 文案与 VI 约束

本轮继续遵守以下前台约束：

- 不展示 Raw / Pool / gate / 入库 / 字段 / displayLane 等内部词。
- 不把标题或摘要伪装成原文引用。
- 原文缺失时不硬编引用。
- 统计卡使用观澜 VI 的深澜蓝、帆檐金和暖白纸面，不新增突兀色卡。
- 商业信号页保持 Apple 式克制留白与 Linear 式信息密度，不做浮夸 dashboard。

## 6. 验证记录

已执行：

```powershell
node --check 01-SiteV2/site/assets/app.js
git diff --check -- 01-SiteV2/site/assets/app.js 01-SiteV2/site/assets/styles.css 01-SiteV2/site/*.html 01-SiteV2/site/data/site-content.json 01-SiteV2/site/data/site-content.js
```

结果：

- `app.js` 语法检查通过。
- diff 空白检查通过。
- 已用浏览器运行态确认商业信号 tab 按钮样式生效：`align-items: center`，高度 `52px`，资源版本 `20260523-1918`。

## 7. 未删除文件

本轮没有删除文件。

未修改：

- `AGENTS.md`
- Logo / SVG 生成脚本
- VI 正式 token
- Netlify / GitHub / 自动化配置

## 8. 后续风险

- 当前部分历史 closeout 在 PowerShell 输出中出现编码显示异常，但文件本身不在本轮修改范围内。
- `styles.css` 已有大量历史样式叠加，后续如果继续大改商业信号页，建议单独做一次样式分层清理，避免 page-index 与 page-signals 的同名组件互相污染。
- 前台原文引用仍依赖入库字段质量；后续 Raw / Pool / Card 入库必须继续按 copy 规范补齐真实原文摘录和中文翻译。

## 9. 追加修正：2026-05-23 19:48

针对首页商业信号和商业信号栏目页追加两项修正：

- 首页右侧统计卡的近 3 日柱状图缩小显示，趋势图最大宽度收为 216px，柱体宽度收为 82%，避免贴近右侧边框。
- 商业信号「最新信号」列表不再把自动生成的前台编辑标题当作新闻原题展示。同步脚本已从 Raw 原文材料中提取 `sourceTitle`，前台列表优先显示新闻原始标题；没有原题时才回退到前台编辑标题。

追加验证：

```powershell
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
git diff --check -- 01-SiteV2/site/assets/app.js 01-SiteV2/site/assets/styles.css 01-SiteV2/site/scripts/sync-v2-site-data.mjs 01-SiteV2/site/*.html 01-SiteV2/site/data/site-content.json 01-SiteV2/site/data/site-content.js
```

浏览器运行态确认：

- 首页右侧统计卡宽度 300px 时，趋势图实际宽度约 154px，右侧留白约 23px。
- 商业信号融资列表前 5 条标题已切换为 Raw 原始标题。
- 最新信号 tab 仍保持垂直居中：`align-items: center`，高度 `52px`。

## 10. 追加修正：2026-05-24 11:38

针对首页商业信号右侧统计卡再次修正：

- 根因：旧规则 `home-v2-business-signals .home-signal-sparkline { width: 180px }` 仍在首页统计卡内生效，导致外层已收窄但子图继续向右溢出。
- 修正：在首页统计卡作用域内明确覆盖 sparkline 宽度为 `130px`，并把柱体宽度固定为 `30px`、最大高度限制为 `28px`。
- 修正：趋势标题从右对齐改为左对齐，图表区域加入 `overflow: hidden` 和明确安全边界，避免“近3日”、日期和值贴边或跑出卡片。
- 浏览器实测：三组趋势图右侧留白约 `53px`；右侧文字、日期和值均未越过卡片安全区；柱体与上方数字、下方日期无重叠。
