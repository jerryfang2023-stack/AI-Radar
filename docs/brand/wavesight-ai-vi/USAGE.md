# 观澜AI｜WaveSight AI VI 资产使用规范

本目录是观澜AI V2 视觉识别系统的项目内基准资料库。后续任何网站页面、商业内参页面、组件库、截图验收、动效或品牌物料设计，必须先读取本目录，再进行实现。

## 资产来源

Logo 规范源图：

```text
docs/brand/wavesight-ai-vi/reference-images/visual-identity-system.png
```

说明：用户提供的 VI 源图是当前正式基准。`wavesight_ai_svg_pack.zip` 中的 Logo 文件不作为后续基准；Logo / app icon SVG 由 `tools/generate-logo-system-svg.mjs` 生成。

项目规范目录：

```text
docs/brand/wavesight-ai-vi/
```

站点可引用副本：

```text
01-SiteV2/site/assets/brand/
```

源图目录：

```text
docs/brand/wavesight-ai-vi/reference-images/
```

可执行 SVG 拆解目录：

```text
docs/brand/wavesight-ai-vi/executable-svg/
```

## 文件拆解

- `brand-tokens.css`：品牌色、圆角、阴影、字体 token 和字号 token。V2 页面 CSS 必须优先引用这些变量。
- `typography-guidelines.md`：正式字体规范，覆盖中文标题、正文、英文、数字、Logo、栏目、内参详情页、按钮标签和 CSS token。页面、报告和内参排版必须遵守。
- `page-typography-position-guidelines.md`：页面位置字体规范，覆盖导航栏、首页、栏目页、详情页、侧栏、页脚的字号、字重、行高、位置和验收口径。后续页面任务必须在生成前读取，并先输出 Typography 页面位置表。
- `motion-tokens.css`：网站动效 token。页面动效、hover、reveal、drift、fade 必须优先引用这些变量。
- `visual-identity-guidelines.md`：Logo、字体、色彩、辅助图形、图标和应用物料的正式规范。
- `svg-restoration-guidelines.md`：VI 源图转可执行 SVG 的还原说明、失真处理和验收口径。
- `logo-system.md`：依据品牌视觉识别源图重新生成的 Logo SVG 说明。
- `logo-reference-guidelines.md`：高还原 Logo 说明，包含颜色值、字体建议、安全区和最小尺寸。
- `logo-wavesight-reference-horizontal.svg`：基于近景参考图制作的高还原横版主 Logo。
- `logo-wavesight-reference-horizontal-reverse.svg`：高还原横版反白 Logo，用于深色背景。
- `logo-wavesight-reference-symbol.svg`：高还原左侧图形符号。
- `logo-wavesight-horizontal-light.svg`：浅色背景横版 Logo，用于网站导航、页脚、报告封面浅底区域。
- `logo-wavesight-horizontal-dark.svg`：深色背景横版 Logo，用于深色封面、深色卡片或反白场景。
- `logo-wavesight-stacked-light.svg`：浅色背景竖版 Logo，用于封面、品牌介绍页、报告物料。
- `logo-wavesight-stacked-dark.svg`：深色背景竖版 Logo，用于深色封面和会员内参视觉。
- `logo-wavesight-symbol-light.svg`：浅色背景符号，用于 favicon 附近、卡片符号、轻量品牌露出。
- `logo-wavesight-symbol-dark.svg`：深色背景符号，用于深色背景。
- `app-icon-light.svg`：浅色 App / 小程序图标示意。
- `app-icon-dark.svg`：深色 App / 小程序图标示意。
- `logo-wavesight-monochrome.svg`：单色图形标识，用于低色打印、压印和不可用彩色场景。
- `logo-wavesight-dark-background.svg`：深色背景完整 Logo 卡，用于深海蓝背景物料。
- `brand-footer-motto-line.svg`：底部品牌标语线，用于报告封底、页脚或封面分隔。
- `README.md`：原始 VI 包说明。
- `reference-images/`：用户提供的四张 VI 规范源图，仅用于对照，不作为页面组件直接裁切使用。
- `executable-svg/`：按规范一项项拆出的独立 SVG，页面、组件和验收应优先引用这里的单项资产。
- `tools/generate-executable-svg.mjs`：可重复生成 `executable-svg/` 的脚本。
- `svg-restoration-guidelines.md`：说明三张 VI 规范图如何拆为 SVG，若 SVG 变形应如何回到生成脚本或图像生成参考重新处理。

## 强制规则

1. Logo 是固定品牌资产，页面必须引用 SVG 文件，不允许用 CSS、图标库或手写 SVG 重新绘制。
2. 正式 Logo 必须保持一条香槟金地平线和三道主澜线；细辅助水纹只用于忠于源图层次，不得扩展为新的品牌母题。
3. 不得去掉金色地平线、添加新的品牌母题。
4. 不得把 Logo 改成雷达、眼睛、机器人、科技光圈、蓝紫渐变或其他通用 AI 视觉。
5. 页面配色必须优先使用 `brand-tokens.css` 中的 `--gl-*` token。
6. V2 公开页面全局背景使用 `#FFFDF8` / `--gl-bg-page`，与导航栏融合；卡片和内容容器使用半透明暖白纸面或 `--gl-paper`，不要把栏目 / 卡片背景直接铺成导航栏色。
7. 正式横版 Logo 网页默认宽度不低于 `160px`，报告封面建议不低于 `220px`；小于 `120px` 宽时优先使用 symbol。
8. 页面字体必须使用 `typography-guidelines.md`、`page-typography-position-guidelines.md` 与 `brand-tokens.css` 中的字体 token：中文标题用衬线，正文与界面用黑体，英文标签用 Inter 系，数字数据用 Mono 系。
9. 页面生成前必须执行 Typography-first：先按 `agent-workflow/governance/typography-first-page-gate.md` 输出 Typography 页面位置表，再进入 Build & Release；不得等页面生成后才检查字体。
9. 英文品牌名统一为 `WAVESIGHT AI`，不得写成 `WaveSight AI`、`WavesightAI`、`WAVE SIGHT AI` 或 `wavesight ai`。
10. 页面动效必须优先使用 `motion-tokens.css` 中的 `--gl-motion-*` 和 `--gl-ease-*` token。
11. 规范源图只能作为对照资料；需要进入页面或组件库的视觉元素，必须拆为 `executable-svg/` 下的单项 SVG。
12. 所有 Logo、符号、信息卡片和动效分镜都优先引用 SVG 资产，不允许根据截图重画元素。
13. 如需新增组件，必须基于现有 SVG 风格扩展，保持深海蓝、暖白、雾灰和少量香槟金。
14. 导航、报告封面、商业内参、符号系统、数据卡、机会矩阵和动效必须与 `agent-workflow/product/DESIGN.md` 的 V2 VI 硬基线一致。

## 设计验收口径

每次页面或视觉任务的 closeout 必须说明：

- 是否读取本目录。
- 使用了哪些 SVG 资产。
- 是否引用或映射 `brand-tokens.css`。
- 是否遵守 `typography-guidelines.md`，包括中文标题、中文正文、英文标签和数字字体。
- 是否遵守 `page-typography-position-guidelines.md`，包括导航、首页、栏目页、详情页、侧栏和页脚的位置级字号 / 字重 / 行高。
- 是否在 Build 前输出 Typography 页面位置表，并用 `$guanlan-typography-qc` 做 Build 前审查。
- 是否引用或映射 `motion-tokens.css`。
- 截图中 Logo、色彩、符号系统、页面节奏是否符合 VI。

未完成以上说明，不得标记页面类任务为完成。
