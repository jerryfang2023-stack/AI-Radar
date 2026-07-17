# Monthly Report Page Generation Standards

## Page Role

The monthly report detail page should answer:

- What is the monthly structural judgment?
- What changed in the industry structure?
- Which trends were upgraded, added, watched, downgraded, or removed?
- Which opportunities became actionable?
- What must be verified next month?

It should feel like a complete business intelligence report, not a report teaser.

## Recommended Page Shape

1. Hero
   - Show the accepted title and one core judgment.
   - Do not add report-type helper subtitles or explanatory deck copy when the title and core statement already explain the page.
   - Prefer a clean, wide title line on desktop; allow natural wrapping on mobile.
   - Avoid hero stat cards unless the data is essential to the reader's first decision.
   - Keep counts and data-boundary information out of the hero unless explicitly requested.

2. Fast read
   - Optional compact section with 3-5 executive takeaways.
   - Use concise judgment cards or statement blocks.

3. Full report body
   - Render every major monthly report section.
   - Use editorial hierarchy:
     - section label;
     - serif H2;
     - designed longform blocks;
     - charts/tables/cards as appropriate.

4. Visual modules
   - Use trend timelines for monthly progression.
   - Use bar/radar visuals when comparing tags, evidence types, or opportunity maturity.
   - Use opportunity matrices when comparing certainty and actionability.
   - Use designed tables for structure maps, trend adjudication, and verification lists.

5. Appendix
   - Place data boundary, method boundary, evidence limitations, source scope, and nonessential operational notes at the end.
   - Keep appendix compressed but readable.

## Table Treatment

Every table must have:

- readable Chinese-friendly header styling;
- emphasized first column as row title;
- enough cell padding and line height;
- restrained borders and row bands;
- status color only when it helps scan upgrade/downgrade/risk;
- mobile card rendering with `data-label`;
- no horizontal overflow at 390px width.

Use tables when the reader needs comparison. Use cards or lists when the reader needs narrative.

## Typography and Layout

- Use detail H1 around 40px / 56px, H2 around 26px / 38px, body around 16px / 30px.
- Use a reading width near 860-920px when paired with a side rail.
- Avoid viewport-scaled font sizes and negative letter spacing.
- Do not place cards inside cards.
- Keep side rail sticky only on desktop; let it collapse or stack on mobile.
- Use section ornaments sparingly: gold bars, thin rules, small mono labels, and numbered blocks.

## Report Center Wiring

- `intelligence-map.html` is the only Industry Reports entrance and leads with reports.
- `reports.html` is a compatibility redirect only.
- Show monthly and weekly reports as separate subcolumns when both exist.
- Time-window selectors should sit in the section head when relevant.
- Do not duplicate a `报告中心` button beside the selector unless there is a clear reader action.

## Validation Checklist

- Local page loads with status 200.
- No console errors.
- No mobile horizontal overflow.
- All major monthly report sections are present.
- Tables are styled and readable.
- Appendix contains nonessential method/data boundary information.
- Report-center links open the correct monthly detail page.
- The detail page uses the V4 sidebar and contains no V3 topbar, stylesheet, or retired column link.
- `frontstage-regression-gate` passes.
