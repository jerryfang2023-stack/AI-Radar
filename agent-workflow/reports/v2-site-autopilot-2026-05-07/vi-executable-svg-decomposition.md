# 观澜AI VI 可执行 SVG 拆解记录

日期：2026-05-07  
范围：用户提供的四张 VI 规范图拆解为可执行 SVG 组件库  
状态：first-batch-completed

## 1. 源图归档

源图已保存到：

```text
docs/brand/wavesight-ai-vi/reference-images/
```

文件：

- `visual-identity-system.png`
- `site-design-system-page-templates.png`
- `business-brief-symbols-elements.png`
- `motion-interaction-guidelines.png`

## 2. 可执行 SVG 输出

输出目录：

```text
docs/brand/wavesight-ai-vi/executable-svg/
```

本批生成：

- SVG：31 个
- 索引页：`index.html`
- 清单：`manifest.json`
- 说明：`README.md`

分类：

- `01-symbol-system/`：Signal、Point、Trend、Opportunity、Quote、Divider、Timeline Node、Data Snapshot、Rating Chip、Source Note
- `02-information-elements/`：期号、日期、会员标签、阅读时长、核心判断框、引述框、数据卡、趋势时间线、机会矩阵、来源脚注
- `03-layout-principles/`：封面页、正文详情页、侧边决策栏
- `04-application-samples/`：内参封面、数据卡片组、报告内页
- `05-motion-guidelines/`：波纹线微动、导航下划线、按钮 hover、卡片抬升、数字递增

## 3. 生成与维护

生成脚本：

```text
docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
```

后续新增或调整 SVG，应修改脚本后重新生成，避免手工散改导致清单和索引不一致。

## 4. 验证

已执行：

```powershell
node --check docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
node docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
```

已用 XML 解析方式校验所有生成 SVG 可解析。

浏览器索引截图：

```text
agent-workflow/reports/v2-site-autopilot-2026-05-07/vi-executable-svg-index.png
```

## 5. 设计规范回填

已更新：

- `docs/brand/wavesight-ai-vi/USAGE.md`
- `agent-workflow/product/DESIGN.md`

后续页面设计、组件实现和截图验收，应优先引用 `executable-svg/` 的单项 SVG，不再从整张规范源图中裁切局部图片。
