param(
  [string]$RepoPath = "",
  [string]$RuntimePath = "",
  [switch]$RunMorningNow
)

$ErrorActionPreference = "Stop"
# Migration is idempotent and preserves definitions for rollback. Daily scheduling
# belongs to Codex automation ai; installers must never recreate retired timers.
$names = @(
  "WaveSight Morning Production Dispatch",
  "WaveSight Daily Final Closure",
  "WaveSight Daily Self Repair",
  "WaveSight Daily Recovery Controller",
  "WaveSight Daily Automation Closure",
  "WaveSight Hermes Control Plane Watchdog",
  "WaveSight Codex Self Repair Handoff",
  "WaveSight Data Observation Agent Review Trial"
)
foreach ($name in $names) {
  $task = Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
  if ($task -and $task.Settings.Enabled) {
    Disable-ScheduledTask -TaskName $name | Out-Null
    Write-Host "Disabled retired daily timer: $name"
  }
}
if ($RunMorningNow) { throw "Use agent-workflow/financing/dispatch.mjs explicitly; no legacy timer is started." }
Write-Host "Daily owner: Codex automation ai at 08:10 Asia/Shanghai; GitHub fallback at 10:30."
Write-Host "Consumer AI hardware runs inside the same domestic/overseas funding task. Community and Builders weekly lanes are paused."
