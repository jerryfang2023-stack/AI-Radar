# 观澜AI｜WaveSight AI VI 资料库

本目录是观澜AI V2 的品牌视觉识别资料库。Logo 资产已根据 `reference-images/visual-identity-system.png` 重新拆解生成，不再使用早先压缩包中的 Logo 文件。

## 核心文件

- `visual-identity-guidelines.md`：品牌视觉识别系统规范，覆盖 Logo、色彩、字体、辅助图形、图标和应用。
- `USAGE.md`：所有设计任务的读取与验收要求。
- `brand-tokens.css`：色彩、圆角、阴影、字体 token。
- `motion-tokens.css`：动效 token。
- `logo-system.md`：Logo SVG 文件说明。
- `executable-svg/`：符号、信息元素、页面样张、动效分镜的可执行 SVG 组件。
- `reference-images/`：用户提供的规范源图。
- `tools/`：可重复生成 Logo 与 SVG 组件的脚本。

## Logo 资产

- `logo-wavesight-horizontal-light.svg`
- `logo-wavesight-horizontal-dark.svg`
- `logo-wavesight-stacked-light.svg`
- `logo-wavesight-stacked-dark.svg`
- `logo-wavesight-symbol-light.svg`
- `logo-wavesight-symbol-dark.svg`
- `logo-wavesight-monochrome.svg`
- `logo-wavesight-dark-background.svg`
- `app-icon-light.svg`
- `app-icon-dark.svg`
- `brand-footer-motto-line.svg`

## 强制原则

- 不根据截图临时重画页面元素。
- Logo、符号、信息卡片和动效分镜优先引用 SVG 资产。
- 页面颜色使用 `brand-tokens.css`。
- 动效使用 `motion-tokens.css`。
- 新组件基于现有 SVG 风格扩展，保持深海蓝、云白、雾灰和少量香槟金。
