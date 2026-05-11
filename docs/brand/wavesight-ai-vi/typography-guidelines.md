# 观澜 AI / WAVESIGHT AI 字体规范

本文件是观澜 AI V2 的正式字体规范。官网、商业内参、报告、PPT、海报、页面组件、站点 CSS、Logo 说明和后续设计任务必须以本文件为准。

字体系统服务于品牌定位：

```text
高级、克制、东方智识、商业内参、判断感。
```

字体不走强科技感，也不走传统书法感。整体应形成：

```text
中文标题：有东方智识感
中文正文：清晰、稳重、易读
英文信息：现代、国际化、克制
数字数据：理性、专业、报告感
```

## 1. 字体角色

观澜 AI 使用四套字体角色：

| 角色 | 用途 | 首选 |
|---|---|---|
| 中文品牌标题字体 | Logo 中文字标、首页主标题、栏目大标题、报告标题、核心判断句 | Noto Serif SC / Source Han Serif SC |
| 中文正文与界面字体 | 正文、导航、按钮、卡片摘要、表格、说明、移动端正文 | Noto Sans SC / Source Han Sans SC / PingFang SC |
| 英文品牌与标签字体 | WAVESIGHT AI、英文标签、日期、来源、页面小标题 | Inter / IBM Plex Sans / Avenir Next |
| 数字与数据字体 | 期号、日期、指标数字、图表、百分比、报告编号 | IBM Plex Mono / JetBrains Mono / Roboto Mono |

## 2. 中文品牌标题字体

### 使用场景

```text
Logo 中文字标
首页主标题
内参标题
报告封面标题
栏目大标题
核心判断句
PPT 封面标题
商业内参页眉
```

### 推荐字体

首选：

```text
思源宋体 SC / Source Han Serif SC
Noto Serif SC
```

备选：

```text
Songti SC
华文宋体
方正书宋
方正兰亭宋
```

中文标题应呈现稳重、克制、高级、东方智识和商业判断感。

禁止使用：

```text
毛笔书法体
国潮字体
圆体
黑板体
卡通字体
过度锋利的科技字体
```

### 字重

| 场景 | 建议 |
|---|---|
| 首页大标题 | Semibold / Bold |
| 报告标题 | Semibold |
| 内参标题 | Semibold |
| 栏目标题 | Medium / Semibold |
| Logo 字标 | 定制或转路径 |

如果使用 Noto Serif SC：

```text
标题推荐：600 / 700
副标题推荐：500
```

## 3. 中文正文与界面字体

### 使用场景

```text
正文段落
导航菜单
按钮文字
卡片摘要
表格内容
标签
说明文字
FAQ
后台界面
移动端正文
```

### 推荐字体

首选：

```text
思源黑体 SC / Source Han Sans SC
Noto Sans SC
PingFang SC
```

Windows 备选：

```text
Microsoft YaHei
Microsoft YaHei UI
```

正文与界面字体要清晰、现代、理性、易读，不抢标题。不建议正文使用宋体大段排版，尤其在移动端，宋体小字号容易发虚。

### 字重

| 场景 | 建议 |
|---|---|
| 正文 | Regular 400 |
| 正文重点 | Medium 500 |
| 卡片标题 | Medium 500 / Semibold 600 |
| 按钮 | Medium 500 / Semibold 600 |
| 导航 | Medium 500 |
| 说明文字 | Regular 400 |

## 4. 英文字体

英文用于增强国际化、内参感和系统感：

```text
WAVESIGHT AI
Signal / Point / Opportunity / Trend
Business Brief
Member Brief
Issue No.
For Decision Reference Only
日期
标签
图表说明
数据来源
页面小标题
```

首选：

```text
Inter
IBM Plex Sans
Avenir Next
```

备选：

```text
Montserrat
Helvetica Neue
Arial
```

英文品牌统一使用：

```text
WAVESIGHT AI
```

不要写成：

```text
WaveSight AI
WavesightAI
WAVE SIGHT AI
wavesight ai
```

英文品牌字标建议全部大写，并拉开字距：

```css
letter-spacing: 0.12em;
```

可用范围：

```text
0.10em - 0.18em
```

Logo 下方英文可以略大字距：

```css
letter-spacing: 0.16em;
```

栏目英文标签可使用：

```text
0.08em - 0.12em
```

## 5. 数字与数据字体

数字字体用于增强商业内参、数据判断和投研报告的专业感：

```text
期号
日期
数据卡
指标数字
图表坐标
百分比
增长率
阅读时长
评级
报告编号
```

首选：

```text
IBM Plex Mono
JetBrains Mono
Roboto Mono
```

部分封面和核心数据可使用：

```text
Georgia
Times New Roman
```

用于更有报告感、杂志感的大数字。

数据卡大数字：

```css
font-family: "IBM Plex Mono", "JetBrains Mono", "Roboto Mono", monospace;
font-size: 40px;
font-weight: 500;
letter-spacing: -0.02em;
```

期号编号：

```css
font-family: Georgia, "Times New Roman", serif;
font-size: 32px;
font-weight: 600;
```

## 6. 网站字号规范

### 桌面端

| 层级 | 字号 | 行高 | 字重 | 字体 |
|---|---:|---:|---:|---|
| Hero 主标题 | 56px | 72px | 600/700 | 中文衬线 |
| 页面标题 | 44px | 58px | 600 | 中文衬线 |
| 内参文章标题 | 40px | 56px | 600 | 中文衬线 |
| 模块标题 | 28px | 40px | 600 | 中文衬线 / 黑体 |
| 卡片标题 | 20px | 30px | 500/600 | 中文黑体 |
| 正文 | 16px | 28px | 400 | 中文黑体 |
| 正文重点 | 17px | 30px | 500 | 中文黑体 |
| 摘要说明 | 14px | 24px | 400 | 中文黑体 |
| 标签 / 日期 | 12px | 18px | 400/500 | 英文 / 中文黑体 |
| 英文小标签 | 11px | 16px | 500/600 | Inter |

### 移动端

| 层级 | 字号 | 行高 | 字体 |
|---|---:|---:|---|
| Hero 主标题 | 34px | 46px | 中文衬线 |
| 页面标题 | 30px | 42px | 中文衬线 |
| 内参文章标题 | 28px | 40px | 中文衬线 |
| 模块标题 | 22px | 32px | 中文黑体 / 衬线 |
| 卡片标题 | 18px | 28px | 中文黑体 |
| 正文 | 15px | 26px | 中文黑体 |
| 摘要说明 | 13px | 22px | 中文黑体 |
| 标签 / 日期 | 12px | 18px | 英文 / 中文黑体 |

## 7. Logo 字体规范

中文 Logo 字标为：

```text
观澜AI
```

要求：

```text
高级衬线感
现代宋体气质
笔画清晰
重心稳定
不书法化
不科技化
不圆润化
```

正式商用建议中文字标转为 SVG 路径 / 轮廓，避免不同浏览器和不同系统的中文字体渲染差异。

英文 Logo 字标统一为：

```text
WAVESIGHT AI
```

建议：

```css
font-family: "Inter", "IBM Plex Sans", "Avenir Next", sans-serif;
font-weight: 600;
letter-spacing: 0.16em;
```

## 8. 栏目字体规范

栏目名称建议采用双语结构：

```text
Signal 信号
Point 观点
Opportunity 机会
Trend 趋势
Brief 内参
```

英文栏目：

```css
font-family: Inter, sans-serif;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
```

中文栏目：

```css
font-family: "Noto Sans SC", "PingFang SC", sans-serif;
font-size: 14px;
font-weight: 500;
```

## 9. 内参详情页字体规范

内参页眉：

```text
观澜 AI 商业内参
WAVESIGHT AI BUSINESS BRIEF
```

中文：

```css
font-family: "Noto Serif SC", serif;
font-size: 28px;
font-weight: 600;
```

英文：

```css
font-family: Inter, sans-serif;
font-size: 11px;
letter-spacing: 0.16em;
text-transform: uppercase;
```

内参标题：

```css
font-family: "Noto Serif SC", "Source Han Serif SC", serif;
font-size: 40px;
line-height: 1.35;
font-weight: 600;
```

移动端：

```css
font-size: 28px;
line-height: 1.42;
```

一句话判断：

```css
font-family: "Noto Serif SC", serif;
font-size: 20px;
line-height: 1.7;
font-weight: 500;
```

正文：

```css
font-family: "Noto Sans SC", "PingFang SC", sans-serif;
font-size: 16px;
line-height: 1.8;
font-weight: 400;
color: #333840;
```

引用块：

```css
font-family: "Noto Serif SC", serif;
font-size: 20px;
line-height: 1.75;
font-weight: 500;
```

## 10. 按钮与标签字体规范

主按钮：

```css
font-family: "Noto Sans SC", "PingFang SC", sans-serif;
font-size: 14px;
font-weight: 600;
letter-spacing: 0.02em;
```

次按钮：

```css
font-size: 14px;
font-weight: 500;
```

标签：

```css
font-size: 12px;
font-weight: 500;
line-height: 1;
```

英文标签：

```css
font-family: Inter, sans-serif;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
```

## 11. CSS 字体变量

项目必须使用以下 token：

```css
:root {
  --gl-font-serif-cn: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", serif;
  --gl-font-sans-cn: "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", "Microsoft YaHei UI", sans-serif;
  --gl-font-en: "Inter", "IBM Plex Sans", "Avenir Next", "Helvetica Neue", Arial, sans-serif;
  --gl-font-mono: "IBM Plex Mono", "JetBrains Mono", "Roboto Mono", Consolas, monospace;
}
```

## 12. Tailwind 配置建议

如果后续使用 Tailwind：

```js
theme: {
  extend: {
    fontFamily: {
      serifcn: ['Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'serif'],
      sanscn: ['Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      en: ['Inter', 'IBM Plex Sans', 'Avenir Next', 'sans-serif'],
      mono: ['IBM Plex Mono', 'JetBrains Mono', 'Roboto Mono', 'monospace'],
    },
    letterSpacing: {
      brand: '0.16em',
      label: '0.12em',
    },
  },
}
```

## 13. 禁忌

不要使用：

```text
过度书法化字体
国潮标题字体
圆体做主标题
过窄科技字体
蓝紫赛博风字体
花体英文
粗黑体大标题满屏压迫
正文小于 14px
大段正文使用衬线宋体
```

尤其要避免：

```text
Logo 中文字标每次由浏览器字体随机渲染
英文品牌名大小写不统一
标题字体和正文字体混用混乱
标签过多使用不同字体
```

## 14. 最终推荐组合

官网与内参最稳组合：

```text
中文标题：Noto Serif SC / Source Han Serif SC
中文正文：Noto Sans SC / PingFang SC
英文标签：Inter
数字数据：IBM Plex Mono
```

Logo 最终处理：

```text
中文字标：定制 / 转路径
英文字标：Inter / Avenir Next，全大写，拉开字距
```

字体系统要让观澜 AI 看起来像：

```text
一个安静、专业、有判断力的 AI 商业内参品牌。
```
