---
title: WSD-20260508-14 VI SVG Restoration Closeout
date: 2026-05-08
status: completed
owner: ui-ue / workflow
project: 观澜AI｜WaveSight AI
---

# WSD-20260508-14｜VI SVG 还原与说明收口

## 任务来源

用户要求使用 `image-to-code` 技能，把观澜AI的 VI 规范还原为 SVG 格式的相关 VI 说明；若图片生成 SVG 变形或失真，可使用图像生成能力重新生成 VI 元素后再 SVG 化。

## 已完成

- 读取项目交接、治理文件、VI 使用规范、现有可执行 SVG 目录和生成脚本。
- 对照用户提供的三张 VI 图，确认现有 SVG 已覆盖符号系统和部分信息元素，但缺少网站设计系统、页面模板和动效规范的完整拆解。
- 更新 `docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs`。
- 重新生成 `docs/brand/wavesight-ai-vi/executable-svg/`，当前共 48 个 SVG。
- 新增 `06-site-design-system/`：导航、按钮、标签、卡片、章节标题、搜索框、引用框、桌面模板、移动模板、数据图表。
- 补充 `05-motion-guidelines/`：动效 token、手风琴、弹窗淡入、禁用动效、阅读体验。
- 补充 `03-layout-principles/`：三栏摘要、报告章节页。
- 新增 `docs/brand/wavesight-ai-vi/svg-restoration-guidelines.md`，说明还原范围、失真处理、图像生成参考使用边界和验收检查。
- 更新 `README.md`、`USAGE.md`、`visual-identity-guidelines.md`，把 SVG 还原说明纳入 VI 资料库。

## 关键输出

- `docs/brand/wavesight-ai-vi/executable-svg/index.html`
- `docs/brand/wavesight-ai-vi/executable-svg/manifest.json`
- `docs/brand/wavesight-ai-vi/executable-svg/README.md`
- `docs/brand/wavesight-ai-vi/svg-restoration-guidelines.md`
- `docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs`

## 验证

- `node --check docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs` 通过。
- `node docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs` 通过，生成 48 个 SVG。
- 全量 SVG XML 解析通过。
- `manifest.json` 更新后可读取。

## 边界

- 本轮未修改 V2 前台页面。
- 本轮未替换正式 Logo；Logo 仍以 `logo-wavesight-*.svg` 为准。
- 本轮未调用图像生成，因为现有三张源图和几何还原已足够完成组件级 SVG 拆解。
- 本轮未做 Netlify 部署。

## 后续建议

- 若后续发现某个 SVG 与源图比例不准，优先修正生成脚本。
- 若源图细节不足，再使用图像生成能力补单个元素参考图，但最终资产仍应沉淀为 SVG。
- 页面类任务引用这些 SVG 后，应补桌面和移动端截图验收。
