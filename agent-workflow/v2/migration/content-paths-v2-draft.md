# content-paths V2 Draft

Status: V2 production-path draft after `01-SiteV2/` root normalization. Do not restore old `04-Site/` as the active V2 site.

```json
{
  "legacy": {
    "archiveDir": "10-Archive/v1.0",
    "siteDir": "10-Archive/v1.0/site/04-Site",
    "sourceDirs": "10-Archive/v1.0/source-dirs",
    "contentArchive": "10-Archive/v1.0/v1.0-content-archive.md",
    "mode": "read-only"
  },
  "v2": {
    "rootDir": "01-SiteV2",
    "contentDir": "01-SiteV2/content",
    "siteDir": "01-SiteV2/site",
    "rawDir": "01-SiteV2/content/01-raw",
    "rawOriginalsDir": "01-SiteV2/content/01-raw/originals",
    "poolDir": "01-SiteV2/content/02-pool",
    "structuredDir": "01-SiteV2/content/03-structured-signals",
    "frontSignalsDir": "01-SiteV2/content/04-selected-signals",
    "trendChainDir": "01-SiteV2/content/05-trend-chain",
    "insightsDir": "01-SiteV2/content/06-insights",
    "pointsDir": "01-SiteV2/content/07-points",
    "opportunitiesDir": "01-SiteV2/content/08-opportunities/deep-dive",
    "mvpValidationDir": "01-SiteV2/content/09-mvp-validation",
    "databasesDir": "01-SiteV2/content/10-databases",
    "distributionDir": "01-SiteV2/content/11-content-distribution",
    "feedbackDir": "01-SiteV2/content/12-feedback",
    "archiveDir": "01-SiteV2/content/_archive",
    "futureDataDir": "01-SiteV2/site/data"
  }
}
```

This draft is the active V2 path reference for new production-line work. It is not a Netlify deploy config and does not publish content by itself.
