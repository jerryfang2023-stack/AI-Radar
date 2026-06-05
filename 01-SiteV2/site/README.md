# V3.1 Site

状态：current-site-workbench
更新时间：2026-06-05

## 定位

本目录是观澜 AI V3.1 数据观察台与运营后台工程入口。

## 任务启动

站点开发任务默认只读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/02-vi-style.md`
4. 当前任务派发单
5. 派发单指定的页面、组件或数据文件

当前暂停使用观澜前台文案规范与文案门禁；商业信号标题优先使用可追溯原文标题，英文展示内容必须翻译为中文。
字体任务补读 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` 和 `skills/guanlan-typography-qc/SKILL.md`。

## 开发原则

- 桌面端优先。
- 普通前台不出现后台、同步、JSON、恢复、编辑等内部痕迹。
- 页面生成前先确认 Typography 页面位置表；前台文案以事实、来源和中文可读为准。
- GitHub / Netlify 推送或部署必须等用户明确确认。
