# Good Typography Check Example

```yaml
result: needs-fix
scope:
  - 01-SiteV2/site/operations-console.html
  - 01-SiteV2/site/assets/operations-console.js
findings:
  - selector: ".skill-card strong"
    issue: "Card title competes with local section title."
    fix: "Keep card title near 15-16px and reserve 20px+ for section headers."
  - selector: ".metrics"
    issue: "Responsive grid verified on 390px and 1440px."
    fix: "No action."
evidence:
  - desktop screenshot inspected
  - mobile screenshot inspected
```

Why it passes: it ties typography findings to selectors, page positions, and screenshot evidence.
