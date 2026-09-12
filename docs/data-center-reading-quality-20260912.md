# Data Center reading quality patch — 2026-09-12

Scope: Data Center and the existing community subcolumns. Release/product versions remain unchanged; this patch is identified by its Git commit.

## Applied changes

- Withdraw four reviewed invalid events from the September 12 batch and their event links/projections. Preserve RawDocuments, Claims, private evidence locators and source-linked QA entries. The reusable withdrawal command is idempotent. Admission rejects advisory commentary, ownership questions, financing roundups and body fragments. Historical serving reuses the same gate (10 fewer displayed events overall).
- List events by batch date and disclosed date; show the precise event type, publisher and translated state. Retain full source titles in detail and accessible link names while limiting list headlines to two lines.
- Split taxonomy dimension and value selectors. Reset the selected value when changing dimension; unify search/reset control sizes.
- Combine company and investor index rows only through an existing canonical entity ID. Retain a separate investment-record link and investor-type lookup. Independent products and same-name objects without canonical links are not merged.
- Skip greetings/self-introductions when selecting an excerpt. Resource summaries remain labelled as source-post excerpts unless resource descriptions are present. Suppress an exact-title/author generic-URL case only when one canonical-URL counterpart exists. All resource URLs and owners remain unchanged.
- Keep Guanlan navigation at 14/20 px, 500/600 weight; use existing deep blue for small metadata and warm backgrounds/gold rules. Reduce mobile tab height; add drawer backdrop, close label, Escape support, focus cycling and inert main content.

## Validation and limits

- Data Center unit suite: 276 passed; community suite: 26 passed; title withdrawal regressions: 2 passed (included in Data Center suite).
- Browser regression covers independent routes, source isolation, archive months, Feishu hrefs, summaries, entity identity and investment entry, taxonomy controls, desktop/mobile overflow and drawer closing.
- Versions, current-rule hygiene and frontstage regression gate pass.
- Full private-body integrity remains blocked by missing local evidence objects. A same-environment baseline comparison reports 207 failures before versus 204 after, with zero newly introduced failures. No collection was repeated and no unavailable body was fabricated. This release does not claim a full historical semantic or accessibility audit.
- Generated Data Center entity/taxonomy shards repeat global event counts; rebuilding those counts affects many files. Original evidence and unrelated public financing products are not republished.

- Three targeted event-frontstage tests pass. The full legacy frontstage suite also contains two pre-existing assertions for the retired community default and old workflow concurrency group; neither unrelated contract was changed in this patch.
