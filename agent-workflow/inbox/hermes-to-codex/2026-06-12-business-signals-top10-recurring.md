status: open
priority: urgent
lane: business_signals
failed_gate: Top10 selection (frontstage data build)
report_path: 01-SiteV2/site/data/v3-data-observation-desk.json
data_generated: yes
needed_action: repair script
notes: |
  Two consecutive days (06-11, 06-12) with Top10=0 despite successful card generation.
  
  - 06-11: 211 cards generated, Top10=0
  - 06-12: data generated at 2026-06-12T03:53:41.579Z, Top10=0
  
  Previous inbox: 2026-06-11-business-signals-top10-empty.md (not yet resolved).
  
  Suspect: 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs frontstageSelection logic 
  not populating top10[] from generated cards.
  
  Need to: inspect the build script, identify why Top10 stays empty, fix, commit, 
  and add a gate/eval that catches Top10=0 before deployment.
  
  This is a recurring failure — prevent recurrence with a guardrail.
