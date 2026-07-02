# Enterprise AI / FDE Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the Enterprise AI / FDE lane.

## Required Checks

1. `fde_lane_owner_loaded`
   - Pass when FDE work routes through `guanlan-enterprise-ai-fde-monitor` instead of being handled only as a Business Signals side note.

2. `fde_not_fourth_card_type`
   - Pass when FDE items can use Raw / Pool evidence and lens-only pool entries without becoming a new formal Signal Card type.
   - Fail when FDE display requires weakening `product_service`, `funding`, or `case` card gates.

3. `fde_source_title_boundary`
   - Pass when every public FDE title is Chinese-facing and produced or recorded during Raw / Card / FDE Lens Pool asset generation.
   - Fail when title translation is deferred to generic frontstage suppression, or when a title is rewritten into a consulting summary, source-domain label, subject fragment, or generated boss-facing headline.

4. `fde_ingestion_fact_boundary`
   - Pass when FDE Lens Pool detail objects expose title translation and fact extraction status when available from Raw / Card ingestion.
   - Pass when missing translation/fact fields are routed to Raw/Card/FDE asset repair instead of hiding already generated formal Signal Cards in the generic frontstage selector.
   - Fail when source-title translation registry absence, weak fact support, missing customer, missing ROI, or missing before/after workflow is used as a generic frontstage blocker after FDE assets have been generated.

5. `fde_precision`
   - Pass when public FDE items contain concrete implementation evidence: FDE, forward-deployed work, customer-embedded delivery, technical scoping, procurement, pilot, production rollout, workflow deployment, or vertical customer workflow.
   - Fail when broad governance, research, benchmark, consumer app, platform-only, or generic enterprise AI content outranks concrete implementation evidence.

6. `fde_detail_openability`
   - Pass when every `enterpriseAiTransformation.cardId` resolves to a detail object in `cards`, `corePoolCandidates`, `enterpriseAiFdePool`, or `enterpriseAiLensCandidates`.
   - Fail when the frontstage `详情` action opens an empty state or falls back to a generic lens-only explanation.

7. `fde_demand_service_result`
   - Pass when every public FDE item has `implementationAnalysis.demand`, `implementationAnalysis.services`, and `implementationAnalysis.result`.
   - Pass when undisclosed results are explicitly labeled as undisclosed instead of invented.
   - Fail when the detail page omits what demand was discovered, what service was provided, or what implementation result is known.

8. `fde_obsidian_sync`
   - Pass when same-date public FDE items are synced into `01-SiteV2/content/09-fde/daily/<DATE> Enterprise AI FDE.md` with source link, Raw archive link when available, and demand/service/result analysis.
   - Fail when the frontstage is updated but Obsidian `09-fde` remains stale or lacks the implementation analysis.

## Repair Loop

Repair the earliest failing layer, then rerun the frontstage regression gate and `sync:enterprise-ai-fde`. Add or tighten this eval before adding long prose for repeated failures.
