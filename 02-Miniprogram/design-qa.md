# Design QA

- Source visual truth: the live H5 first-three-tab hierarchy at `https://www.zkdlj.vip/h5/`, selected by the user as the Mini Program visual baseline.
- Target viewport: native WeChat Mini Program mobile viewport with the capsule safe area and system tab bar.
- State: 融资情报、商业主体、商业观察 default tab states. 我的 remains outside this sync.
- Structural comparison: completed against the H5 source and the Mini Program WXML/WXSS implementation.
- Build evidence: `npm run verify` passed 19 tests and validated 14 pages for development version `0.3.5` and production AppID `wx34133741173154d4`.
- Rendered screenshot: unavailable. `miniprogram-automator@0.12.1` connects to the installed Developer Tools but times out waiting for the current automation protocol response.

## Findings

- The first three tabs now share the H5 header pattern: the supplied horizontal brand logo at left, one concise four-character title centered on screen, and a fine divider below, all aligned within the native capsule safe area.
- Financing follows the H5 hierarchy: compact publishing summary, search, structured time/region/round filters, result controls, then the funding list. Industry/category button rails, row industry labels, checkboxes, and list-level collection controls are absent.
- 商业主体整合企业库、投资机构库与核心人物库；三类卡片均先进入独立主体档案，再由档案中的关联动态进入融资详情。
- Observe follows the H5 hierarchy: weekly/monthly tabs, a restrained featured-report card, then a continuous archive list.
- English headings, update-date captions, explanatory intro copy, duplicate in-page logos, and internal validation language are absent from the first three tab pages.
- Collection and comparison management remain available in detail or dedicated management views, so removing list controls does not remove those capabilities.

## Remaining visual check

- Confirm title/capsule clearance on one iOS and one Android device.
- Confirm the horizontal logo remains legible at the 152rpx header width on both devices.
- Confirm the first funding row is visible at a useful height without bottom-tab overlap.
- Confirm long enterprise, institution and report titles wrap without clipping.

final result: implementation and technical gates passed; post-change phone screenshots remain the final visual evidence
