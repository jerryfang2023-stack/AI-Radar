# Design QA

## 2026-08-15 V0.6.1 融资金额与底栏优化

- Source visual truth: `C:\Users\86186\Downloads\1257227072.jpg`（用户真机截图）。
- Target state: 融资页默认“全球”在前、“中国”在后；中国列表不重复显示地区角标；人民币标准金额仅显示“元”；底部文本导航收紧安全区上方留白。
- Code and data verification passed: 259 张融资卡重新生成；全部 CNY 标准金额在融资源、PC 融资投影、Data Center 投影和小程序内置数据中均不再含 `人民币`、`CNY` 或 `RMB` 后缀；55 个小程序行为与公开文案测试通过。
- Native implementation capture: blocked. 微信开发者工具 RC 2.02.2607271 在仓库路径和短临时路径中均错误报告 `pages/community-apply/index.wxml` 不存在；Git、文件系统和项目校验均确认该文件存在，17 个页面路径全部有效。重置 DevTools fileutils 后问题仍复现，因此未伪造替代截图或 side-by-side comparison。

final result: blocked (native simulator capture only; implementation and project validation passed)

---

## 2026-08-14 个人资料与手机号绑定修复

- Source visual truth: 用户提供的“账号与联系”真机截图；implementation capture: `C:\Users\86186\.codex\tmp\wavesight-profile-fix\profile-edit.png`；side-by-side comparison: `C:\Users\86186\.codex\tmp\wavesight-profile-fix\comparison.png`。
- Removed the WeChat-ID row, privacy implementation note, pending-backend state, preview/production wording, and redundant account-section split.
- Rebuilt the remaining content as a compact completion summary, one cohesive profile-settings card, and a single primary save action using the existing warm-white, deep-navy, and champagne-gold system.
- Phone authorization now exchanges the one-time code through the account service and returns a masked bound number; the Mini Program no longer creates a local pending state.
- Visual comparison passed for hierarchy, spacing, type scale, card radius, divider contrast, control affordance, capsule-safe header, and removal of all requested copy.
- `npm run verify`: 43 tests passed; 16 pages and 33 JavaScript files validated.
- Payment/account service: 14 pytest cases passed, including code exchange, masked-only storage, unique phone binding, and access-token reuse.
- WeChat Developer Tools preview compiled with production AppID `wx34133741173154d4`; package size 754,564 bytes. Simulator capture completed from `pages/profile-edit/index`.

final result: passed

---

## 2026-08-14 分享、签到与邀请注册修复

- Source visual truth: 用户提供的周报、融资详情、企业档案及邀请好友真机截图。
- Financing and ecosystem detail pages now expose native WeChat session and Moments sharing with stable deep links.
- Reports opened from a share show a persistent text navigation fallback; direct-entry back actions return to the relevant tab.
- Profile growth tasks include an idempotent “每日签到” task worth 5 points.
- Invitee pages now lead with “邀请人昵称 + 邀请你来”, place the WeChat registration CTA directly below the hero, and provide direct-entry tab navigation.
- Inviter pages remove the repeated hero helper sentence and show server-confirmed invited visitors, successful registrations, and reward points.
- `npm run verify`: 41 tests passed; 16 pages and 33 JavaScript files validated.
- Payment/invitation service: 11 pytest cases passed, including duplicate visit and duplicate registration protection.
- WeChat Developer Tools CLI preview succeeded with production AppID `wx34133741173154d4`; package size 753,592 bytes.

final result: passed

---

## Scope

- Source visual truth: approved full-page UI demo at `C:\Users\86186\.codex\visualizations\2026\08\13\wavesight-full-ui-demo`.
- Target: native WeChat Mini Program, iOS capsule safe area, text-only system tab bar.
- States: splash, 融资情报、生态图谱、商业观察、我的、融资详情与公司比较。
- Production AppID: `wx34133741173154d4`.

## Fidelity review

| Surface | Result | Notes |
|---|---|---|
| Splash | Pass | Official horizontal logo, slogan and subtitle remain centered; divider, progress copy and extra footer were removed. |
| Header and navigation | Pass | First three tabs retain the official logo at left and four-character title centered; native tab bar remains text-only with no icons. |
| Funding | Pass | Search-only entry, navy statistics band, daily-new label and compact rows match the approved hierarchy. List collection/compare controls are absent. |
| Ecosystem | Pass | Navy “商业主体全景” summary, lightweight type tabs, direct search and compact enterprise/institution/person rows match the approved direction. |
| Observe | Pass | Navy featured report leads the page; weekly/monthly tabs and archive cards follow beneath it. |
| Profile | Pass | Observer growth remains primary; membership is compact; the redundant browse/favorite/follow statistic strip is absent. |
| Detail actions | Pass | Collection and 2–3 company comparison selection remain in financing detail; the dedicated comparison page remains available. |

## Validation

- `npm run verify`: 33 tests passed; 16 pages and 31 JavaScript files validated.
- Generated public data: 255 financing cards, 11 reports, latest funding dataset date `2026-08-13`.
- WeChat Developer Tools was opened with the production project and compile cache refreshed. The installed tool intermittently reports its pre-existing missing-file simulator error for `pages/compare/index.wxml`; the repository validator confirms the file exists and all page/component paths are valid.
- H5 implementation was rendered beside the approved demo at the same mobile state. Mini Program WXML/WXSS uses the same visual tokens and page hierarchy with native capsule/tab-bar adaptations.

final result: passed
