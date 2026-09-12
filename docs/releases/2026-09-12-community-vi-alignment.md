# Community Intelligence V1.4.2 — VI alignment

依据 context/02-vi-style.md、page-typography-position-guidelines.md 和 brand-tokens.css。

| 位置 | 字号/行高 | 字重 |
|---|---|---|
| 导航栏目与子栏目 | 14/20 | 500；选中600 |
| 导航分组标题 | 16/24 | 600 |
| 普通卡片标题 | 18/28 | 600 |
| 摘要 | 14/24 | 400 |
| 筛选 | 13/20 | 500；按钮600 |

左侧导航统一留白、240px 桌面宽度、子项缩进与金色选中标记；导航无外边框、无阴影，与页面暖白背景融合。卡片移除非品牌冷蓝色与650/700字重，复用正式token。名称、摘要、链接和内容不变。

浏览器回归直接检查栏目与子栏目的 computed font-size/line-height/font-weight，检查品牌底色与卡片标题，防止再次偏离规范。
