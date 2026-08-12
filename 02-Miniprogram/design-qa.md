# Design QA

- Source visual truth: the live H5 first-three-tab hierarchy at `https://www.zkdlj.vip/h5/`, selected by the user as the Mini Program visual baseline.
- Target viewport: native WeChat Mini Program mobile viewport with the capsule safe area and system tab bar.
- State: 融资情报、市场概览、商业观察 default tab states. 我的 remains outside this sync.
- Structural comparison: completed against the H5 source and the Mini Program WXML/WXSS implementation.
- Build evidence: `npm run verify` passed 16 tests and validated 13 pages; WeChat Developer Tools automation accepted production AppID `wx34133741173154d4` and opened the project.
- Rendered screenshot: unavailable. `miniprogram-automator@0.12.1` connects to the installed Developer Tools but times out waiting for the current automation protocol response.

## Findings

- The first three tabs now use one concise four-character header aligned within the native capsule safe area.
- Financing follows the H5 hierarchy: compact publishing summary, search, category and structured filters, result controls, then the funding list. Row checkboxes and list-level collection controls are absent.
- Market follows the H5 hierarchy: a 2 x 2 metric grid, grouped market-category distribution, and ranked round distribution.
- Observe follows the H5 hierarchy: weekly/monthly tabs, a restrained featured-report card, then a continuous archive list.
- English headings, update-date captions, explanatory intro copy, repeated logos, and internal validation language are absent from the first three tab headers.
- Collection and comparison management remain available in detail or dedicated management views, so removing list controls does not remove those capabilities.

## Remaining visual check

- Confirm title/capsule clearance on one iOS and one Android device.
- Confirm the first funding row is visible at a useful height without bottom-tab overlap.
- Confirm long category and report titles wrap without clipping.

final result: implementation and technical gates passed; post-change phone screenshots remain the final visual evidence
