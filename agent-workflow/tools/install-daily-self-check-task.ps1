param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Daily Self Repair",
  [string]$At = "09:40",
  [ValidateSet("off", "safe")]
  [string]$RepairMode = "safe",
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

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-daily-self-check.mjs"

if (-not (Test-Path -LiteralPath $runner)) {
  throw "Daily self-check runner not found: $runner"
}

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$quotedRunner = '"' + $runner + '"'
$argument = "$quotedRunner --repair=$RepairMode"

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
  -Description "Run WaveSight daily self-check without Hermes and apply safe deterministic repairs." `
  -Force | Out-Null

Write-Host "Installed daily self-check scheduled task: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Repair mode: $RepairMode"
Write-Host "Runner: $runner"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
