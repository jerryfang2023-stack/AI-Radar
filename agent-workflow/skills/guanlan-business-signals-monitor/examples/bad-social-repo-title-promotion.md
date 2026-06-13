# Bad Social / Repo Title Promotion Example

Use this as a regression example for Business Signals Top10 and Core Pool candidate display.

## Bad Output

- `linkedin original AI event: <English repost title>`
- `linkedin financing $100`
- `github original event title: GitHub - owner/repo at branch`
- several candidate rows about the same MiniMax M3 release or the same Mistral financing round.

## Why It Fails

- The title names the source domain instead of the actual company, product, round, release, customer, or workflow event.
- Social/community posts are discovery or feedback evidence, not direct formal Business Signal Card evidence.
- GitHub repo root/tree/blob pages, package/model pages, marketplace listings, and generic funding lists are not dated concrete business events.
- URL-level dedupe is insufficient because the same event can appear across multiple URLs.

## Expected Repair

- Block social/community, repo/catalog, marketplace, package/model, and generic list sources from formal Signal Card promotion unless recaptured through a dated source-backed event page.
- Build public titles from source-backed event facts, not placeholder wording such as "purpose see original" or "original AI event".
- Deduplicate the public candidate pool by event key, keeping the highest-quality source-backed item and treating the rest as supporting evidence.
