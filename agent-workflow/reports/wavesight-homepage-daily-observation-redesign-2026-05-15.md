# WaveSight Homepage Daily Observation Redesign

Date: 2026-05-15
Status: implemented draft

## Scope

- Reworked homepage second section around `今日观察` as the main editorial entry.
- Removed the `今天带走 / 可以问团队的 3 个问题` module from homepage.
- Added a proper long-form `今日观察` detail rendering on `daily-detail.html`.
- Kept the current first-screen hero direction and existing VI palette.

## Files

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily-detail.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

## Design Notes

- Homepage now treats 今日观察 as a daily article entry, not a plain card group.
- Detail page presents 今日市场综述, 主判断, 选题理由, 精选变化, Builders 观点, 趋势追踪线索 and 仍需留意.
- The removed team-question module should not return unless a later product decision explicitly asks for a tool-like operator checklist.

## Verification

- `node --check 01-SiteV2/site/assets/app.js`: passed.
- `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
- Desktop screenshots generated:
  - `agent-workflow/reports/homepage-daily-observation-redesign-2026-05-15-after-remove-questions.png`
  - `agent-workflow/reports/daily-detail-article-2026-05-15.png`

## Notes

- Browser verification used local Chrome headless against `http://127.0.0.1:4173/`.
- Existing workspace has many unrelated content and archive changes; this report only covers homepage and daily detail page files.

## 2026-05-15 User Screenshot Cleanup

- Removed homepage gold divider lines around hero / section headers / daily editorial card.
- Removed right-side auxiliary copy from homepage section headers.
- Simplified homepage section titles to one visible title per section.
- Removed the duplicated `今日一句判断` label inside the daily observation card.
- Tightened homepage hero-to-section spacing and section spacing.
- Adjusted daily observation two-column block so left and right cards align visually.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshot: `agent-workflow/reports/homepage-compact-section-cleanup-2026-05-15-v4.png`.

## 2026-05-15 Editorial Detail Redesign

- Added compact editorial symbols to homepage section titles: numbered circular marker plus restrained signal mark.
- Reworked `daily-detail.html` rendering from modular blocks into article-first layout.
- Moved quoted assets, selected changes, builder references and trend references into a right-side reading rail.
- Kept the article body as continuous editorial prose with subheads and a single pull quote.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshots:
    - `agent-workflow/reports/homepage-column-title-symbols-2026-05-15.png`
    - `agent-workflow/reports/daily-detail-editorial-article-layout-2026-05-15.png`

## 2026-05-15 Daily Detail Copy Cleanup

- Removed duplicated opening paragraph on the daily detail page.
- Removed backend-style section label `主判断`.
- Replaced modular labels with editorial subheads: `今天怎么看` / `今天的几条变化` / `为什么放在一起看` / `还要继续看什么`.
- Expanded today's changes using selected change-card content.
- Moved Builders references from the right rail to the bottom of the article.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshot: `agent-workflow/reports/daily-detail-article-copy-cleanup-2026-05-15.png`.

## 2026-05-15 Detail Copy Humanization

- Replaced mechanical subheads with editorial-style article heads:
  - `能不能做，已经不是最难的问题`
  - `几个信号，把问题推到桌面上`
  - `它们指向同一件事`
  - `还没到拍板的时候`
- Expanded selected changes into prose that explains why each item matters, where its value sits, and why it deserves continued observation.
- Tightened the daily detail page top spacing below navigation.
- Added detail-page link to the Daily Observation title on `daily.html`.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshot: `agent-workflow/reports/daily-detail-humanized-headings-2026-05-15.png`.

## 2026-05-15 Daily Writer And Homepage Copy Rules

- Added a visible `阅读完整今日观察` entrance at the end of the daily observation column article.
- Rewrote the homepage right-side daily notes into less mechanical business language:
  - `先问兜底，再谈效果`
  - `演示过关，还不算上线`
  - `热闹还不是收入`
- Changed homepage selected-change black titles from truncated raw headlines to short clear titles:
  - `Agent 开始要权限`
  - `代码仓库被接管`
  - `交付体系开始扩张`
- Reworked the daily detail article into a fuller article with opening scene, selected-change expansion, synthesis and closing paragraph.
- Removed remaining public-facing backend terms in the touched frontend copy, including `主判断`、`证据边界`、`后续观察变量`.
- Expanded `agent-workflow/automation-prompts/daily-observation-writer.md` into an independent writer spec covering homepage modules, detail article requirements, writing style, Builders placement, closing rules and homepage change-card title rules.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshots:
    - `agent-workflow/reports/home-qa-2026-05-15.png`
    - `agent-workflow/reports/daily-qa-2026-05-15.png`
    - `agent-workflow/reports/daily-detail-qa-2026-05-15.png`
    - `agent-workflow/reports/home-bottom-cards-qa-2026-05-15.png`

## 2026-05-15 Daily Detail Top Rhythm

- Tightened `daily-detail.html` top spacing so the article starts closer to the navigation, matching the column-page rhythm.
- Kept enough top clearance to avoid overlap with the logo and navigation after screenshot review.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - Screenshot: `agent-workflow/reports/daily-detail-compact-top-2026-05-15-v2.png`.

## 2026-05-15 Daily Writer Evidence Upgrade

- Updated `agent-workflow/automation-prompts/daily-observation-writer.md` so 今日观察 starts from the full daily Raw set, not from selected cards.
- Added explicit requirement to extract market heat from roughly 100 daily articles / posts / releases / discussions.
- Added evidence requirements: concrete companies, products, market actions, Builders / VC / operator views, market data and customer materials.
- Added authorial voice rules: writer can show excitement, anxiety, disappointment and judgment, but every emotion must be backed by evidence.
- Added output fields for `raw_market_read`, `topic_clusters`, `evidence_blocks` and `discarded_noise`.

## 2026-05-15 Five-Module Writer Rewrite

- Rebuilt `daily-observation-writer.md` around five hard modules:
  - 今日主问题
  - 首页表达
  - 详情文章
  - 变化卡展开规则
  - 禁用写法
- Rewrote the 2026-05-15 daily observation source article around the question: `Agent 已经会动手，企业敢不敢交权限？`
- Added explicit Raw=100 market temperature, company/product evidence and author voice to the source article.
- Synced V2 site data with `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-15`.
- Updated frontend rendering so homepage and daily detail use the new main question, homepage rationale, short change-card titles and cleaner right-rail titles.
- Attempted old `unified-site-sync.mjs`; it was blocked by legacy V1 file requirements and is not the active V2 data path for this change.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshots:
    - `agent-workflow/reports/home-writer-v2-2026-05-15.png`
    - `agent-workflow/reports/daily-writer-v2-2026-05-15.png`
    - `agent-workflow/reports/daily-detail-writer-v2-clean-2026-05-15.png`

## 2026-05-16 Daily Observation Source Cleanup

- Removed public-facing internal production terms from the touched daily pages and article sources, including `Raw` count, `Pool`, `source-router`, internal paths, card IDs in public prose and "enter brief / trend observation" style wording.
- Replaced fabricated "typical scene" openings with real source-backed events:
  - Anthropic × PwC expanded Claude deployment and training.
  - Anthropic × Gates Foundation multi-year partnership.
  - OpenAI Windows sandbox and supply-chain response.
  - Google Genkit middleware.
  - Copilot cost discussion on HN.
- Changed the daily page CTA from `阅读完整今日观察` to `查看详情`.
- Removed duplicate daily page/detail-page title echoes:
  - daily page no longer repeats the H2 as a separate thesis line.
  - detail page no longer shows `今日主问题：...` under the H1.
  - right summary no longer prefixes the title with `今日观察｜`.
- Upgraded `2026-05-15-selected-change-cards.md` from thin "title + reason" entries to public event cards with event, business meaning and source URLs.
- Updated `daily-observation-writer.md` root rules:
  - no fabricated scenes without source support;
  - no internal production language in frontend copy;
  - no half-event mentions;
  - selected cards must include public title, event, business meaning, selection reason and source URL before entering homepage featured positions.
- Also cleaned the 2026-05-16 outage draft and one 2026-05-14 historical synthetic opening so date switching does not reintroduce the same issue.
- Verification:
  - `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-15`: passed.
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshots:
    - `agent-workflow/reports/daily-page-final-2026-05-16.png`
    - `agent-workflow/reports/daily-detail-final-2026-05-16.png`

## 2026-05-16 Editorial Flow And Closing Cleanup

- Reworked the 2026-05-15 daily observation from card-by-card expansion into an article arc:
  - opening from Anthropic × PwC as the concrete event;
  - business meaning: AI enters delivery and responsibility-bearing workflows;
  - plain-language translation of technical terms into `围栏 / 门禁 / 钥匙 / 留痕`;
  - closing echoes the opening instead of forcing a checklist.
- Replaced empty large headings:
  - `先看普华永道这件事` -> `大组织买的不是聊天框`
  - `难点不是更聪明，而是能不能管住` -> `AI 真动手后，围栏比话术重要`
  - `今天先看到这里` -> `热闹还在门外，责任已经进屋`
- Updated `daily-observation-writer.md`:
  - small and large article headings must carry judgment, conflict or business meaning;
  - article endings should match the day’s topic and echo the opening;
  - no forced `下一步看什么 / 老板该做什么 / 三个变量` closing template.
- Verification:
  - `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-15`: passed.
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/daily-detail-editorial-headings-2026-05-16.png`.

## 2026-05-16 Daily Observation Writer Automation Run

- Updated the Codex automation task `daily-observation-writer` so future runs follow the new writing rules:
  - write an article with 起承转合, not a card collage;
  - start from real sourced events, never fabricate a "typical scene";
  - translate technical terms into business language before publishing;
  - headings must carry judgment, conflict or business meaning;
  - endings must fit the day and echo the opening, not force a checklist.
- Replaced the old 2026-05-16 outage draft with a new 今日观察:
  - `01-SiteV2/content/03-daily-observation/2026-05-16--daily-observation--ai-enters-professional-work-billing-and-control-show-up.md`
  - Title: `今日观察｜AI 进了专业流程，账单和围栏先露出来`
- Rebuilt the 2026-05-16 selected change cards as public event cards:
  - `账单开始按用量走`
  - `围栏成了采购前提`
  - `法律 AI 开始写路线图`
  - `企业采用开始有排行`
  - `门禁进入工具链`
- Updated V2 site rendering:
  - homepage and 今日观察页 now use 2026-05-16 home copy and right-rail judgment copy;
  - 今日观察详情页 now reads the parsed article `summary` and `sections`, so future writer output can drive the full article page;
  - fixed a sync gap where the active daily article body was parsed but not exposed to `data.daily`.
- Verification:
  - `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-16`: passed.
  - `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`: passed.
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshots:
    - `agent-workflow/reports/home-2026-05-16-daily-writer.png`
    - `agent-workflow/reports/daily-2026-05-16-writer.png`
    - `agent-workflow/reports/daily-detail-2026-05-16-writer-fixed.png`

## 2026-05-16 Homepage Fix And Skill Alignment

- Fixed homepage stale copy:
  - removed hardcoded 2026-05-15 homepage main line from `mountHomeV2`;
  - homepage daily core now reads the active `dailyJudgmentProfile` / `data.daily`;
  - homepage right-side rationale now has 2026-05-16 specific copy for legal workflow, runtime guardrails and usage billing.
- Clarified the Raw-based operating boundary in `daily-observation-writer.md`:
  - Raw count alone is not evidence of market understanding;
  - writer must check `source_distribution`, `topic_clusters`, `selected_basis`, `discarded_noise` and source quality before writing;
  - if upstream Raw package is incomplete, writer must downgrade or block instead of pretending to have written a full market overview;
  - M-level discovery sources can show discussion heat, but cannot be main factual evidence without S/A/B source verification.
- Updated the app automation task `daily-observation-writer` with the same practical boundary, so scheduled runs inherit the rule.
- Applied project-style precedence to related writing skills:
  - `edit-article`
  - `article-writer`
  - `copy-editing`
  - `humanizer`
- Added project-level reminder in `agent-workflow/product/COPY.md`: generic writing skills must obey WaveSight writing rules before applying generic editing workflows.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/home-2026-05-16-daily-writer-fixed.png`.

## 2026-05-16 Daily Detail Source Link Rendering

- Updated `01-SiteV2/site/assets/app.js` so 今日观察详情页 detects `相关原文 / 参考来源 / 原文链接` sections and renders each Markdown source row as an external jump link.
- Updated `01-SiteV2/site/assets/styles.css` with `daily-detail-source-links` styles:
  - source name on the left;
  - domain and external arrow on the right;
  - raw URLs are no longer shown in long paragraph form.
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/daily-detail-source-links-2026-05-16.png`.

## 2026-05-16 Homepage Daily Signal Duplicate Removal

- Removed the homepage `精选变化` card strip under 今日观察 because it duplicated the immediately following 商业信号 module.
- Updated `01-SiteV2/site/index.html`; 今日观察 now keeps only the article entrance and right-side judgment list.
- Commercial change cards are now visually owned by the 商业信号 section on the homepage.
- Verification:
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/home-remove-selected-change-cards-2026-05-16.png`.

## 2026-05-16 Homepage Business Signal Layout Redesign

- Confirmed 商业信号首页第一屏 as `今日精选 + 信号库入口` and documented it in `agent-workflow/product/column-architecture.md`.
- Redesigned homepage 商业信号 layout:
  - left: 1 featured signal with judgment summary and three compact explanation points;
  - right: 2 secondary signal briefs;
  - bottom: tag/filter entry row for the full signal library.
- Removed the previous large metric table layout that created excessive empty space and distorted the section.
- Updated:
  - `01-SiteV2/site/assets/app.js`
  - `01-SiteV2/site/assets/styles.css`
  - `agent-workflow/product/column-architecture.md`
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/home-business-signal-redesigned-2026-05-16.png`.

## 2026-05-16 Homepage Business Signal Typography Cleanup

- Reworked the 商业信号 homepage typography hierarchy after screenshot review:
  - featured signal title reduced to card-level title size;
  - secondary signal titles reduced and separated from featured hierarchy;
  - body copy, meta, chips and CTA now use tighter fixed card-scale sizes;
  - the old horizontal metric table was replaced by compact vertical keylines.
- Updated:
  - `01-SiteV2/site/assets/app.js`
  - `01-SiteV2/site/assets/styles.css`
- Verification:
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshot: `agent-workflow/reports/home-business-signal-typography-fix-2026-05-16.png`.

## 2026-05-16 Business Signal Alignment, Cases And Frontier Views

- Removed the abrupt homepage `筛选信号` chip row from the 商业信号 section; filtering remains owned by the 商业信号 library page.
- Fixed homepage 商业信号 card alignment:
  - left featured card and right stacked cards now stretch to the same bottom edge;
  - desktop screenshot check measured `delta = 0`.
- Added case assets to the V2 sync pipeline:
  - `05-case-research` now parses `CASE-*` bullets into `contentIndex.cases`;
  - duplicate case IDs are merged during sync;
  - 2026-05-16 generated data now includes related case cards from the L2 case-research records.
- Updated signal detail pages:
  - added a `相关案例` section with `来源依据` and `相关案例卡`;
  - detail page now uses the signal's original source URL as a source-basis card;
  - related cases are matched by signal/event keywords, not by broad shared tags.
- Public naming update:
  - all visible Builders-related column names in the site are now `前沿观点`;
  - product docs updated so `Builders 观点` no longer appears as the current frontstage name.
- Verification:
  - `node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-16`: passed.
  - `node --check 01-SiteV2/site/assets/app.js`: passed.
  - `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs syntax`: passed.
  - `node agent-workflow/tools/run-quality-gates.mjs style`: passed.
  - Screenshots:
    - `agent-workflow/reports/home-signal-aligned-cases-2026-05-16.png`
    - `agent-workflow/reports/signal-detail-cases-frontier-2026-05-16.png`
