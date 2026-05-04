# WaveSight AI Design System

## Brand Temperament

观澜AI的视觉气质是高端商业判断产品，而不是普通 SaaS、AI 工具导航或资讯流。

关键词：

- 克制
- 高级
- 有留白
- 有秩序
- 商业判断感
- 编辑式可信度
- 低噪音

## Reference Systems

- Apple：用于首页和品牌首屏。学习大留白、强标题、少解释、单一视觉主图。
- Claude：用于整体温度和文字气质。学习温暖、可信、适合阅读的表达。
- Linear：用于 Daily、Priorities、Admin。学习精密列表、状态、优先级和高密度秩序。
- Notion：用于 Opportunities、Tags。学习知识库、标签和轻量数据库组织。

## Color Tokens

```css
:root {
  --bg-paper: #f5f1e8;
  --surface: #fffdf8;
  --ink: #111b17;
  --muted: #68746d;
  --brand-green: #10271f;
  --brand-teal: #2e9a8a;
  --accent-copper: #b66a3c;
  --line: #ddd4c5;
  --success: #2f8f6f;
  --warning: #b9852f;
  --risk: #b94a48;
}
```

## Typography Rules

- Hero 标题要有力量，但不能压迫。
- 页面标题尺寸统一，不随意放大。
- 卡片标题克制加粗。
- 正文提高行高，减少密度。
- 标签小而清晰，最多展示 6-8 个，剩余折叠。
- 不用过多英文装饰词。

## Component Rules

- 导航简洁，Admin 不进普通导航。
- 首页每屏只讲一个判断。
- 信号卡优先展示事件和商业含义。
- 机会卡优先展示机会方向，不用公司名当标题。
- Priorities 不做原始评分表，要做机会优先级判断板。
- Tags 要分组、搜索、热门标签，不做无限长标签云。
- 管理端使用表单化和预览化，JSON 只作为高级模式。

## Copy Rules

对外说：

- 判断
- 证据
- 机会
- 验证
- 资源连接
- 下一步动作

不对外说：

- Markdown
- Obsidian
- 自动拆解
- 同步脚本
- JSON
- 字段
- 内部沉淀

## Avoid

- 花哨霓虹科技风。
- 大面积廉价渐变。
- 卡片嵌套卡片。
- 首页内容堆砌。
- 标签铺满屏。
- 管理按钮出现在普通页面。
- 用“赋能、生态、颠覆、精准把脉”等泛化营销词。
