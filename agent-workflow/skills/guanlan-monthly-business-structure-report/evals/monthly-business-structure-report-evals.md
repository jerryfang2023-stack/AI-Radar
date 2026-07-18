# Monthly Business Structure Report Evals

## Pass Cases

### Case 0: Structural headline

Expected:

- Selects one strongest structural judgment instead of summarizing the full report.
- Uses cognitive tension and names a concrete budget, procurement, cost, delivery, responsibility, or opportunity consequence.
- Keeps the date and report type in metadata rather than the headline.

### Case 1: Structure-first monthly report

Input: A user asks for a monthly report using Business Signals, Community Intelligence, First-Line Viewpoints, and weekly reports.

Expected:

- Opens with data boundary and evidence roles.
- Uses industry structure change -> trend adjudication -> opportunity map.
- Includes at least one downgrade or淘汰 trend.
- Includes opportunity cards with buyer, pain, supply gap, path, risk, and verification signal.
- Marks non-repo external numbers as待复核 or omits them.

### Case 2: Community-heavy month

Input: Community Intelligence has many high-value cases, but Business Signals are weak.

Expected:

- Uses community as demand evidence only.
- Avoids claiming a commercial trend from community alone.
- Marks opportunities as early or observation unless source-backed Signals support them.

### Case 3: Strong weekly reports

Input: Three or four weekly reports show a repeated theme.

Expected:

- Uses the weekly sequence to support monthly trend adjudication.
- Does not paste weekly sections together.
- Explains which trend upgraded, stayed in observation, or downgraded.

### Case 4: Scheduled previous-month window

Input: The consolidated controller runs at 14:00 on the first Monday-Friday weekday of a month.

Expected:

- Uses exactly the previous complete calendar month.
- Produces at least eight numbered sections and the required frontmatter.
- Passes the content acceptance gate before monthly page generation.

## Fail Cases

### Fail 0: Generic or abstract headline

Fails if the title is only a dated monthly-report label or stacks `浮现 / 进入 / 转向 / 升温` without one clear business consequence.

### Fail 6: Partial month or early page generation

Fails if the report includes the new partial month or if the page generator runs before content acceptance.

### Fail 1: Weekly roundup

Fails if the report is mainly a list of weekly headlines, trend heatmaps, or news items without structure diagnosis.

### Fail 2: Evidence boundary violation

Fails if First-Line Viewpoints or Community Intelligence are used as direct business-signal facts.

### Fail 3: Unsupported certainty

Fails if a single funding round, article, demo, or社群案例 creates a high-certainty trend.

### Fail 4: Opportunity without buyer

Fails if opportunity cards do not identify who hurts, who pays, why now, and what would validate the opportunity next month.

### Fail 5: Unverified external statistics

Fails if external market statistics are used as core evidence without a source path in the repo or a clear待复核 label.
