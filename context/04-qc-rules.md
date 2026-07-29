---
status: current
scope: quality-gates
last_updated: 2026-07-29
priority: current
---

# WaveSight V4 质量门禁

## 放行原则

- 成功运行脚本不等于完成验收；必须验证数据契约、前台结果和发布产物。
- V4 事实必须保持 SourceArtifact → RawDocument → Claim / Entity → CanonicalEvent 的可追溯链。
- Claim 必须对应 RawDocument 的精确字符区间。
- 正式 Event、FDE、Hardware、TagAssertion 和 FacetAssertion 只能来自已接受证据。
- 判断、建议、机会、重要性和趋势成熟度不得写回 V4 canonical tables。
- First-Line Viewpoints、Community Intelligence 和 OPS 运行报告不能成为 Event、Claim 或 RELATION-V2.1 证据。

## 当前硬门禁

```powershell
npm run build:data-center -- --date=YYYY-MM-DD
npm run assert:data-center -- --date=YYYY-MM-DD
npm run assert:no-active-v3
npm run assert:pipeline-policy
npm run assert:compatibility-retirement
```

V3 Card、Pool、desk、旧 graph、legacy mappings、兼容 schema/table 和相关门禁已经删除，不得恢复为现役流程。

## 前台与发布

页面改动至少执行：

```powershell
node agent-workflow/tools/frontstage-regression-gate.mjs
npm run test:data-center-site
npm run assert:versions
```

需要时再运行视觉和交互冒烟。历史周报 HTML 属于不可变发布记录，不因兼容层退役而批量重写。

## 冲突顺序

1. 用户当前明确指令。
2. 当前专题 Skill。
3. `context/` 当前文档。
4. 当前代码和数据契约。
5. 历史报告与 Git 历史。
