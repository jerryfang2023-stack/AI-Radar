# 观澜AI｜WaveSight AI 品牌视觉识别系统规范

本规范依据用户提供的 `reference-images/visual-identity-system.png` 拆解，并作为 V2 官网、商业内参、报告物料、图标、动效与品牌应用的正式 VI 基准。Logo、色彩、字体、辅助图形和图标风格必须围绕同一套“极简澜线型”执行。

## 1. Logo System / 品牌标识

Logo 固定为“香槟金地平线 + 三道主澜线 + 中文字标 + 英文字标”的系统。为忠于源图中的水纹层次，SVG 资产可保留一条低对比细辅助水纹，但品牌识别仍以三道主澜线为准。

核心含义：

- 地平线：视野、远见、判断边界和长期方向。
- 三道主澜线：变化、流动、商业趋势和机会层次。
- 细辅助水纹：仅用于还原源图中更轻的层次关系，不作为新增品牌母题。
- 中文字标：`观澜 AI`，保持宋体类标题气质、稳定字距和商业可信度。
- 英文字标：`WAVESIGHT AI`，使用 Inter / IBM Plex Sans / Avenir Next 风格的大写宽字距。

### 标准版本

| 版本 | 结构 | 使用场景 |
|---|---|---|
| 横版组合 / Horizontal | 澜线图形在左，中文字标和英文字标在右 | 官网导航、页脚、报告页眉、名片、邮件签名 |
| 竖版组合 / Stacked | 澜线图形在上，中文字标和英文字标居中在下 | 报告封面、品牌页、PPT 首页、海报 |
| 图形标识 / Symbol | 保留地平线、三道主澜线和细辅助水纹 | favicon、App icon、卡片角标、小尺寸露出 |
| 单色版本 / Monochrome | 地平线与三道澜线统一单色 | 低色打印、压印、合同页脚、不可用彩色场景 |
| 深色背景 / Dark Background | 深海蓝底，澜线与字标反白，地平线保留香槟金 | 会员内参、深色报告封面、深色品牌物料 |

### 比例、安全区和最小尺寸

以澜线图形高度为 `H`：

| 项目 | 建议 |
|---|---|
| 图形宽度 | `2.8H - 3.2H` |
| 金色地平线宽度 | 接近图形宽度，略短于澜线外沿 |
| 中文字标高度 | `0.8H - 1H` |
| 英文字标高度 | `0.18H - 0.24H` |
| 图形与字标间距 | `0.45H - 0.6H` |

Logo 四周至少保留中文字标高度的 `1/2`，或英文大写字母高度的 `3 倍`。网页默认尺寸：正式横版 Logo 宽度不低于 `160px`，报告封面建议不低于 `220px`；`120px` 仅作为紧凑场景下限，小于 `120px` 宽时优先使用图形标识。竖版 Logo 宽度不低于 `96px`，图形标识不低于 `28px`，favicon 使用 `32px / 48px / 64px`。

### 禁止用法

- 不得改变三道主澜线的识别结构；细辅助水纹只可用于还原源图层次，不得扩展成新的图形系统。
- 不得去掉香槟金地平线后仍称为主 Logo。
- 不得添加信号点、雷达圈、眼睛、箭头、太阳、机器人、科技光圈或复杂山峰。
- 不得添加发光、彩虹渐变、霓虹蓝紫或高饱和科技效果。
- 不得拉伸、压缩、旋转或改写 Logo 比例。
- 不得用 CSS、图标库或临时手写 SVG 替代正式 Logo 文件。

## 2. Color Palette / 色彩系统

所有页面、SVG 和物料应优先使用 `brand-tokens.css` 中的 `--gl-*` token。

| 名称 | 色值 | 用途 |
|---|---:|---|
| 墨海蓝 | `#071827` | 主标题、Logo 字标、主澜线、深色识别 |
| 深澜蓝 | `#0D355C` | 品牌主色、链接、图表线、澜线强化 |
| 雾蓝灰 | `#6F7F8F` | 次级文字、说明信息、辅助澜线 |
| 远山灰 | `#A7ADB4` | 边界、禁用态、弱辅助图形 |
| 云白 | `#F7F4EF` | 页面背景、品牌纸感底色 |
| 暖白 | `#FFFDF8` | V2 网站公开页面全局背景、导航融合底色 |
| 纸白 | `#FFFFFF` | 卡片、报告页、浮层和正稿底色 |
| 香槟金 | `#C8A766` | 地平线、细分割线、会员标识、少量强调 |

使用比例建议：

- 暖白 / 云白 / 纸白：约 `70%`，作为主体背景和阅读空间。V2 网站公开页面优先使用暖白 `#FFFDF8` / `--gl-bg-page` 作为全局背景，云白 `#F7F4EF` 保留为品牌纸感底色、物料底色或局部背景。
- 墨海蓝 / 深澜蓝：约 `18%`，承载品牌识别和判断重点。
- 雾蓝灰 / 远山灰：约 `8%`，承载层级和弱信息。
- 香槟金：约 `2% - 4%`，只做点睛，不大面积铺色。

禁止使用紫蓝 AI 渐变、霓虹蓝、高饱和互联网色、科技光束或大面积金色背景。

## 3. Typography / 字体系统

正式字体规范见：

```text
docs/brand/wavesight-ai-vi/typography-guidelines.md
```

核心规则：

| 字体角色 | 使用场景 | 首选 |
|---|---|---|
| 中文品牌标题字体 | Logo 中文字标、首页主标题、栏目大标题、报告标题、核心判断句 | Noto Serif SC / Source Han Serif SC |
| 中文正文与界面字体 | 正文、导航、按钮、卡片摘要、表格、说明、移动端正文 | Noto Sans SC / Source Han Sans SC / PingFang SC |
| 英文品牌与标签字体 | `WAVESIGHT AI`、英文标签、日期、来源、页面小标题 | Inter / IBM Plex Sans / Avenir Next |
| 数字与数据字体 | 期号、日期、指标数字、图表、百分比、报告编号 | IBM Plex Mono / JetBrains Mono / Roboto Mono |

英文品牌名统一为：

```text
WAVESIGHT AI
```

不得写成 `WaveSight AI`、`WavesightAI`、`WAVE SIGHT AI` 或 `wavesight ai`。

正文行高建议 `1.7 - 1.85`。页面标题不得使用负字距，小卡片标题不得放大到 hero 级别。正文不使用大段宋体，移动端正文不得小于 `14px`。

## 4. Graphic Motifs / 辅助图形

辅助图形只从 Logo 中延展，不新增母题。

| 元素 | 用法 |
|---|---|
| 地平线 / Horizon Line | 页脚、标题分隔、封面上缘、章节起点 |
| 流线 / Wave Lines | 背景轻动、封面下沿、品牌角标、趋势图辅助 |
| 分隔线 / Divider | 报告结构、栏目分区、数据与正文分隔 |

辅助图形必须轻、薄、克制。透明度应低，不抢正文和主判断。同屏默认只出现一种主要辅助图形节奏。

## 5. Icon Style / 图标风格

图标风格为细线、几何、克制的商业工具图标，线宽建议 `1.5 - 2px`。默认使用墨海蓝或深澜蓝，弱信息可使用雾蓝灰。

标准图标方向：

- 数据分析
- 报告洞察
- 文档管理
- 解决方案
- 客户服务
- 安全合规
- 系统集成

禁止使用卡通、3D、发光、拟物、多彩渐变 icon set。不得把机器人、芯片、眼睛、雷达作为通用 AI 图标。

## 6. Brand Applications / 应用示意

应用物料应保持“高级商业内参 / 专业研究产品”的气质。

| 场景 | 设计要求 |
|---|---|
| 名片 / Business Card | 深海蓝品牌面 + 纸白信息面，Logo 使用反白或香槟金点缀 |
| 报告封面 / Report Cover | 纸白底、浅灰层次、Logo 小露出、澜线下沿 |
| 笔记本 / Notebook | 深海蓝材质，可使用香槟金或纸白 Logo |
| Favicon & App Icon | 圆角方形内置澜线符号，浅色和深色两版 |

物料中的 Logo 必须引用正式 SVG。背景保持云白、纸白、雾灰、深海蓝和少量香槟金，不使用通用 SaaS 插画或抽象科技海报替代内参气质。

## 7. Implementation / 实现要求

正式 Logo 生成入口：

```text
docs/brand/wavesight-ai-vi/tools/generate-logo-system-svg.mjs
```

正式 Logo SVG：

```text
docs/brand/wavesight-ai-vi/logo-wavesight-*.svg
docs/brand/wavesight-ai-vi/app-icon-*.svg
docs/brand/wavesight-ai-vi/brand-footer-motto-line.svg
```

站点引用副本：

```text
01-SiteV2/site/assets/brand/
```

如需更新 Logo，必须修改生成脚本后重新运行脚本，保证项目规范目录和站点引用目录同步。页面不得根据截图临时重画 Logo。

### 可执行 SVG 组件

除正式 Logo 外，商业内参符号、信息元素、页面模板、动效分镜和网站组件规范均应优先使用：

```text
docs/brand/wavesight-ai-vi/executable-svg/
```

生成与维护入口：

```text
docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
docs/brand/wavesight-ai-vi/svg-restoration-guidelines.md
```

这些 SVG 是根据 VI 源图拆解出的组件资产，不是 PNG 裁切图。若出现变形、比例不准或细节失真，应先修正生成脚本；确需重新生成元素参考图时，也必须再沉淀为 SVG 或正式图片资产后使用。
