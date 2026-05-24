---
status: current
scope: visual-identity-and-page-style
last_updated: 2026-05-20
use_when:
  - page design
  - visual polish
  - typography or logo work
  - brand asset work
do_not_use_when:
  - pure data pipeline task
  - daily monitoring without frontend change
priority: current
---

# 02 VI Style｜观澜视觉与页面规范

## 任务启动

页面 / 视觉任务默认读取：

1. 本文件。
2. `docs/brand/wavesight-ai-vi/brand-tokens.css`。
3. 任务涉及字体、动效或 SVG 时，再按需读取对应文件。

不要默认读取整个 `docs/brand/wavesight-ai-vi/` 目录。

## 品牌气质

观澜 AI 的视觉气质：

- 高级、克制、东方智识、商业内参、判断感。
- 避免强科技感、蓝紫赛博感、普通 SaaS 模板感、AI 工具导航站感。

## 基础视觉

- 页面背景：`#FFFDF8` / `--gl-bg-page`。
- 品牌纸感底色：`#F7F4EF` / `--gl-bg`，仅用于局部。
- 导航栏无边框、无阴影，背景与页面融合。
- 卡片使用半透明暖白纸面，不用粗重边框和过度玻璃拟态。

## Logo

- Logo 必须引用正式 SVG 文件，不得用 CSS、图标库或手写 SVG 重绘。
- 正式横版 Logo 默认不低于 `160px`；小于 `120px` 优先使用 symbol。
- 英文品牌统一为 `WAVESIGHT AI`。

## 字体

- 中文标题：Noto Serif SC / Source Han Serif SC。
- 中文正文与界面：Noto Sans SC / PingFang SC。
- 英文标签：Inter。
- 数字数据：IBM Plex Mono / JetBrains Mono。

页面位置字号以 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` 为准：

- 导航：`14px / 20px`
- 首页 Hero：`56px / 72px`
- 栏目页标题：`44px / 58px`
- 详情页标题：`40px / 56px`
- 模块标题最高：`36px / 48px`
- 卡片标题默认：`18-20px`

普通页面不得使用不受控 `vw`、过大 `clamp()` 或过重字重。

## 页面流程

- 页面生成前必须 Typography-first，先输出 Typography 页面位置表。
- 页面 / 文案任务必须 Copy-first，先输出关键页面文案表。
- Build & Release 只能按表实现，不得临场新增字号体系或关键文案。

## 按需原始规范

- VI 使用说明：`docs/brand/wavesight-ai-vi/USAGE.md`
- 字体规范：`docs/brand/wavesight-ai-vi/typography-guidelines.md`
- 页面位置字体：`docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
- Token：`docs/brand/wavesight-ai-vi/brand-tokens.css`
- 动效：`docs/brand/wavesight-ai-vi/motion-tokens.css`
- SVG：`docs/brand/wavesight-ai-vi/executable-svg/README.md`
