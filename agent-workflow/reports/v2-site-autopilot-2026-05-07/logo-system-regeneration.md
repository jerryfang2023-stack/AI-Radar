# 观澜AI Logo 系统重新拆解记录

日期：2026-05-07  
状态：completed  
依据源图：

- `docs/brand/wavesight-ai-vi/reference-images/visual-identity-system.png`
- `docs/brand/wavesight-ai-vi/reference-images/logo-closeup-final-reference.png`

## 1. 处理原因

用户确认：此前 `wavesight_ai_svg_pack.zip` 中的 Logo 相关文件不对，不再作为 Logo 基准。

本轮已删除旧压缩包来源的 Logo / app icon SVG，并依据用户补充的 Logo 近景源图重新生成横版比例，同时参考品牌视觉识别系统源图补齐竖版、符号、单色、深色背景与 app icon。

## 2. 删除范围

已删除并替换以下目录中的旧 Logo / app icon SVG：

```text
docs/brand/wavesight-ai-vi/
01-SiteV2/site/assets/brand/
```

匹配范围：

```text
logo-wavesight*.svg
app-icon*.svg
```

## 3. 新生成文件

生成脚本：

```text
docs/brand/wavesight-ai-vi/tools/generate-logo-system-svg.mjs
```

生成并同步到项目归档目录与站点引用目录：

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

## 4. 规范文档回填

已新增 / 更新：

- `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
- `docs/brand/wavesight-ai-vi/logo-system.md`
- `docs/brand/wavesight-ai-vi/README.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `01-SiteV2/site/assets/brand/README.md`
- `AGENTS.md`
- `agent-workflow/product/DESIGN.md`

规范已补充：

- Logo 结构：地平线 + 三道澜线 + 中文字标 + 英文字标。
- 字体：中文标题用思源宋体 / Noto Serif SC 类；正文用思源黑体 / Noto Sans SC 类；英文用 Montserrat / Inter 类宽字距。
- 色彩：墨海蓝、深澜蓝、雾蓝灰、远山灰、云白、纸白、香槟金。
- 辅助图形：地平线、澜线、分隔线。
- 图标风格：细线、几何、克制，禁止卡通、3D、发光、高饱和和通用 AI 符号。
- 应用：名片、报告封面、笔记本、App / favicon。

## 5. 验证

已执行：

```powershell
node --check docs/brand/wavesight-ai-vi/tools/generate-logo-system-svg.mjs
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/dev-server.mjs
```

已用 XML 解析方式校验项目归档目录与站点引用目录中的 Logo / app icon SVG。

站点资源检查：

```text
http://127.0.0.1:4173/assets/brand/logo-wavesight-horizontal-light.svg
```

返回：`200 image/svg+xml;charset=utf-8`

截图：

- `agent-workflow/reports/v2-site-autopilot-2026-05-07/logo-regenerated-horizontal.png`
- `agent-workflow/reports/v2-site-autopilot-2026-05-07/logo-regenerated-home.png`
- `agent-workflow/reports/v2-site-autopilot-2026-05-07/logo-closeup-regenerated-horizontal.png`
- `agent-workflow/reports/v2-site-autopilot-2026-05-07/logo-closeup-regenerated-nav.png`

## 6. 注意

本轮最新用户指令优先处理 Logo 与规范文档。此前进行中的页面重设已暂停，后续页面重设应基于本轮新 Logo 与 `visual-identity-guidelines.md` 继续。
