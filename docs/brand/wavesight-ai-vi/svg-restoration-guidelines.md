# 观澜AI｜VI SVG 还原与生成说明

本说明用于把用户提供的三张 VI 规范图转化为可执行、可引用、可验收的 SVG 资产。后续页面、商业内参、报告、动效和组件设计应优先使用 `executable-svg/` 下的单项资产，不从整张 PNG 规范图中裁切。

## 1. 还原范围

本轮已按三张源图拆解为 6 类 SVG：

| 类别 | 目录 | 内容 |
|---|---|---|
| 符号系统 | `executable-svg/01-symbol-system/` | Signal、Point、Trend、Opportunity、Quote、Divider、Timeline、Data Snapshot、Rating、Source Note |
| 信息元素 | `executable-svg/02-information-elements/` | 期号、日期、会员标签、阅读时长、核心判断框、引述框、数据卡、趋势时间线、机会矩阵、来源脚注 |
| 排版原则 | `executable-svg/03-layout-principles/` | 封面、正文详情、侧边决策栏、三栏摘要、报告章节页 |
| 应用示意 | `executable-svg/04-application-samples/` | 内参封面、数据卡组、报告跨页 |
| 动效规范 | `executable-svg/05-motion-guidelines/` | 波纹线微动、导航下划线、按钮 hover、卡片抬升、数字递增、动效 token、手风琴、弹窗淡入、禁用动效、阅读体验 |
| 网站设计系统 | `executable-svg/06-site-design-system/` | 导航、按钮、标签、卡片、章节标题、搜索框、引用框、桌面模板、移动模板、图表风格 |

索引文件：

```text
docs/brand/wavesight-ai-vi/executable-svg/index.html
docs/brand/wavesight-ai-vi/executable-svg/manifest.json
docs/brand/wavesight-ai-vi/executable-svg/README.md
```

生成脚本：

```text
docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
```

## 2. 还原原则

1. SVG 不是整张规范图的像素级描摹，而是把规范图中的元素转化为可维护的组件资产。
2. Logo 不在这些组件 SVG 中重画；正式 Logo 始终引用 `logo-wavesight-*.svg`。
3. 颜色必须使用观澜 VI 色系：墨海蓝、深澜蓝、雾蓝灰、远山灰、云白、纸白、香槟金。
4. 字体角色必须遵守 `typography-guidelines.md`：中文标题用宋体/思源宋体气质，正文与界面用黑体，英文标签用 Inter 系，数字用 Mono 系。
5. 动效只使用轻、慢、稳的微动，不使用霓虹、弹跳、强视差、噪点循环和自动播放干扰。
6. SVG 中的文字用于说明组件结构，不直接代表最终前台文案。
7. 图表、卡片、模板应服务商业内参阅读，不做后台仪表盘感。

## 3. 失真处理

如果某个 SVG 相比源图出现明显变形、比例错误或元素不准，按以下顺序处理：

1. 先检查 `tools/generate-executable-svg.mjs` 中的 viewBox、坐标、字号、线宽和颜色 token。
2. 若是 Logo 失真，不改组件脚本，必须回到 `tools/generate-logo-system-svg.mjs` 或正式 Logo 源资产处理。
3. 若是普通符号或信息元素失真，优先在生成脚本中重建几何结构，而不是裁切 PNG。
4. 若源图细节不足、难以可靠还原，可使用已启用的图像生成能力重新生成单个 VI 元素参考图，再按本规范转成 SVG。
5. 如后续环境启用 `gpt-image2` 或等价图像生成技能，只用于生成参考元素，不直接把生成图片作为最终页面资产；最终仍应沉淀为 SVG 或正式图片资产。

## 4. 禁止事项

- 不从三张 PNG 源图直接裁切小图用于前台。
- 不把 Logo、澜线或页面模板改成雷达、眼睛、机器人、芯片、蓝紫渐变或霓虹科技风。
- 不在普通前台暴露 Admin、JSON、同步、字段、后台等内部语言。
- 不把 `Tags` 做成一级导航或过度醒目的前台栏目。
- 不为动效引入大幅位移、闪烁、弹跳、强发光或循环噪点。

## 5. 验收检查

更新或新增 VI SVG 后至少检查：

```powershell
node --check docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
node docs/brand/wavesight-ai-vi/tools/generate-executable-svg.mjs
```

并确认：

- `manifest.json` 能解析。
- 所有 SVG 能被 XML 解析。
- `index.html` 可作为资产总览打开。
- `README.md` 文件清单与实际 SVG 数量一致。
- 若用于页面实现，还需按页面类任务补桌面和移动端截图验收。
