# WSD-20260508-07 V2 全站文案模块与排版优化收口

## 结论

- 状态：`completed / copy-layout-polished / netlify-paused`
- 用户指出部分模块存在莫名空白、右侧孤立文字和工程化难懂表达。
- 本轮已统一优化 V2 前台模块文案、关系区标题、观点区标题、趋势区标题和对应排版。
- 本轮未上传 Netlify。

## 文案处理

已替换或降级的表达：

- `关联判断网 / 信号关联判断网 / 今日关联判断网 / 机会关联判断网` 改为 `相关观察`、`相互印证`。
- `观点校准 / 校准观点` 改为 `观点参照`。
- `趋势背景` 改为 `趋势线索`。
- `暂未绑定更多判断资产` 改为 `暂无更多延伸观察`。
- `观澜解读` 改为 `我们的读法`。
- `原始观点` 改为 `来源观点`。
- `判断资产 / 判断链 / 证据积累 / 背景输入 / 高热三元组` 已从前台可见文案和生成器默认文案中清理。

## 排版处理

- `.section-head` 改为单列阅读流，说明文字不再被推到页面最右侧。
- 关系区右侧孤立数字计数已隐藏。
- `.relation-grid` 改为自适应列，减少大屏空白。
- 关系卡、观点卡、快照卡统一收紧 padding、标题字号和卡片高度。
- 快照卡中的装饰水纹隐藏，减少“空卡片”观感。

## 验证

- `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07` 通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs` 通过。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/data/site-content.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07` 通过，报告：`agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-180415.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-180415.md`。
- 浏览器检查保存到 `agent-workflow/reports/v2-copy-layout-check-2026-05-08/browser-check.json`。
  - 覆盖主页、今日要点、关键信号、机会解码、商业内参、Signal 详情、Daily 详情、Opportunity 详情。
  - 桌面 / 移动共 16 项全部 200。
  - 无横向溢出。
  - 禁用晦涩词扫描无命中。
  - section-head 说明文字左对齐，未再被推到右侧。

## 未执行

- 未上传 Netlify。
- 未处理旧 `04-Site` 或 `09-ai-news-radar`。
