param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Data Observation Agent Review Trial",
  [string]$At = "10:05",
  [string]$TrialStart = "",
  [int]$TrialDays = 7,
  [switch]$RunOnceNow
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) {
    return (Resolve-Path -LiteralPath $InputPath).Path
  }

  $scriptPath = Split-Path -Parent $PSCommandPath
  return (Resolve-Path -LiteralPath (Join-Path $scriptPath "..\..")).Path
}

if (-not $TrialStart) {
  $TrialStart = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-data-observation-agent-review.mjs"

if (-not (Test-Path -LiteralPath $runner)) {
  throw "Data observation agent-review runner not found: $runner"
}

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$quotedRunner = '"' + $runner + '"'
$argument = "$quotedRunner --trial-start=$TrialStart --trial-days=$TrialDays --write-prompts=true"

$action = New-ScheduledTaskAction -Execute "node.exe" -Argument $argument -WorkingDirectory $repo
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At $time

$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $dailyTrigger `
  -Settings $settings `
  -Description "Run a one-week WaveSight data-observation sidecar review with five cross-lane agents." `
  -Force | Out-Null

Write-Host "Installed data-observation agent-review scheduled task: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Trial start: $TrialStart"
Write-Host "Trial days: $TrialDays"
Write-Host "Runner: $runner"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
