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

## Validation

Run:

```text
npm run verify
```

The project must remain directly importable by WeChat DevTools from this directory.
