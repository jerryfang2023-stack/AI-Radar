# 2026-05-03 The Point Intelligence 质量规则固化报告

## 执行身份

本轮按升级后的 Intelligence Data Agent 执行。

## 已固化规则

### 1. 来源去重

- 同一原文链接对应多条 Point 时，必须判断是否为同源多观点。
- 如果多条 Point 共享同一素材笔记，记录为备注。
- 如果多条 Point 不共享素材笔记，进入来源去重软提醒。

### 2. 同人多观点

- 同一人物多条 Point 不删除、不强行合并为一条。
- 人物详情页应合并展示该人物所有观点。
- 每条 Point 保留独立来源、独立原文和独立关联关系。

### 3. 素材笔记

- Podcast / Blog / YouTube 类观点必须绑定 `05-Point/sources/YYYY-MM-DD/` 下的站内素材笔记。
- X 观点不强制绑定素材笔记。
- Source 必须能通过 `related_points` 回到 Point。

### 4. 原文/译文完整性

- Point 必须有原文和中文译文。
- X 使用原文全文 / 中文译文全文。
- Podcast 使用原始发言段 / 发言段译文。
- Blog 使用原始段落 / 原始段落译文。
- 不得用观点摘要、标题或观澜解读替代原文/译文。

### 5. 短链和 timecode 清理

- Point 展示文本和素材展示文本不得包含 X `t.co` 短链。
- Point 展示文本和素材展示文本不得残留 YouTube speaker/timecode 格式。

### 6. 授权说明

- 素材笔记必须包含来源与版权说明。
- 第三方全文入库前必须确认授权或自有导出边界。
- 未写入全文时，素材页使用结构化阅读摘要和高价值原文段。

## 已落地脚本

- `04-Site/scripts/check-point-quality.mjs`

本轮已在检查报告中新增“固化规则”段落，使质量规则不只存在于实现里，也能在报告中被长期复核。

## 当前验证

- The Point 质量检查硬错误：0
- The Point 质量检查软提醒：0
- 备注：11
- Point -> Signal：24/24
- Point -> Trend：24/24
- Point -> Opportunity：24/24
- Point Source：4

## 后续建议

1. 第三方 Blog / YouTube 全文入库前，继续使用结构化阅读摘要，不强行复制全文。
2. 后续新增 Point 时，统一通过 `check-point-quality.mjs` 复核。
3. 如果出现 Podcast / Blog / YouTube 缺素材笔记，应作为发布前阻塞项处理。
