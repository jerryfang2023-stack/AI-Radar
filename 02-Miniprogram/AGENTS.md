# Guanlan Funding Mini Program

This is the native WeChat Mini Program frontstage for Funding Insights.

## Boundaries

- Source truth remains `../01-SiteV2/site/data/funding-insights-v1.json`.
- Weekly/monthly report source truth remains `../01-SiteV2/content/12-applications/industry-reports/`.
- Run `npm run build:data` after the source projection changes. Do not hand-edit generated files under `miniprogram/data/`.
- Bundled projections are the offline fallback. Runtime funding and report refreshes may read only the gated public contracts under `https://www.zkdlj.vip/data/`; reject date/version/count regressions and retain the fallback on any request or validation failure.
- Public UI may expose application-level funding facts, analysis, and source links only. It must not expose Data Center/Application Center navigation, operational fields, model provenance, internal gates, or private evidence locators.
- Missing values remain explicit. Do not infer undisclosed amounts, investors, customers, regions, or outcomes.
- The project may use `touristappid`, a WeChat test AppID, or the production AppID. Never store AppSecret or other account credentials in the repository.

## Frontstage UI contract

- Treat `../03-H5/` as the visual baseline for the first three tabs: 融资情报、市场概览、商业观察. Keep the native Mini Program interaction model and capsule safe area.
- Those three tab pages use one concise four-character title in the top safe area. Do not repeat English headings, dates, explanatory subtitles, logos, or internal validation language above the primary content.
- Do not show collection controls or selection checkboxes in the financing list. Collection and selection belong to detail or dedicated management pages.
- Keep the 我的 tab independent from the first-three-tab visual sync unless a task explicitly includes it.

## Validation

Run:

```text
npm run verify
```

The project must remain directly importable by WeChat DevTools from this directory.
