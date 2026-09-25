# Public Entity Profiles V1

`PUBLIC-ENTITY-PROFILES-V1.0` supplements the event and investment-activity records with concise source-backed organization and person profiles. Its editable source is `01-SiteV2/content/11-databases/public-entity-profiles-v1.json`; the registry and frontstage files are generated projections.

## Organization fields

- `summary`: a short factual introduction. Attribute self-reported descriptions where appropriate.
- `facts`: structured background such as founding year, investment stage, sectors, geographies, and stated investment approach. Each fact has a stable field key, display label, value, and source reference.
- `milestones`: dated institutional history. Use only dates the cited source supports.
- `track_record`: disclosed examples or outcome figures. Identify incomplete examples as selected cases; preserve the source’s date and measurement basis for any time-sensitive metric.
- `contacts`: official organization website, submission/application channels, public general or media email, phone, office address, contact form, or social account. Record the contact purpose. Do not publish inferred addresses or private contact details.
- `coverage_status` and `coverage_note`: distinguish a researched profile from financing-evidence-only coverage, self-declared affiliation, or an unverified investor label. Never present an activity-only summary as a full biography or full portfolio.

## Person fields

- `current_roles`: source-dated or recently verified public roles, linked to the organization name as stated by the source.
- `career`: prior roles and company associations with a period and a source. If a source names companies but does not establish employment or the exact role, state that limitation instead of inferring it.
- `education`: disclosed institution and qualification only; do not infer graduation dates or credentials.
- `experience_summary` and `track_record`: brief descriptions of domain experience, work, or outcomes with clear attribution.

## Evidence and display rules

- Every item in `facts`, `milestones`, `track_record`, `contacts`, `current_roles`, `career`, and `education` resolves to a `source_id` within the same profile.
- Sources use the canonical URL, page title, capture-time content hash, and a short attributable excerpt. Prefer official organization or person pages; use primary filings and original announcements where first-party biographies are unavailable.
- Imported sources may retain the 16-character content-hash prefix used by the existing financing-evidence registry; curated web captures use the full 64-character SHA-256. Quote hashes remain full SHA-256.
- `last_verified_at` records the date the public page was checked. Volatile roles, contact details, fund sizes, and performance metrics must be rechecked before release.
- Empty arrays mean no verified items are available. Do not fill them from directory guesses, search snippets, name matching, or unsupported biography aggregations.
- Public profile claims remain distinct from accepted event Claims and canonical relationships. A career mention never creates a join, founder, acquisition, or ownership relationship automatically.
- Contact links must use HTTPS and render as explicit labeled links. Email values are published only where the cited source gives the address for that public purpose.

Validate the curated profile source with `npm run assert:public-entity-profiles`, rebuild the investor registry with `npm run build:investment-institutions`, and apply the profiles to the generated frontstage bundles with `npm run build:public-entity-profiles`.
