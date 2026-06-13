param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Follow-Builders Skill Daily",
  [string]$At = "13:30",
  [switch]$NoMerge,
  [switch]$RunOnceNow
)

$ErrorActionPreference = "Stop"

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) {
    return (Resolve-Path -LiteralPath $InputPath).Path
  }

  $scriptPath = Split-Path -Parent $PSCommandPath
  return (Resolve-Path -LiteralPath (Join-Path $scriptPath "..\..")).Path
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runScript = Join-Path $repo "agent-workflow\tools\run-follow-builders-skill.ps1"

if (-not (Test-Path -LiteralPath $runScript)) {
  throw "Follow-builders skill runner not found: $runScript"
}

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$quotedScript = '"' + $runScript + '"'
$quotedRepo = '"' + $repo + '"'
$argument = "-NoProfile -ExecutionPolicy Bypass -File $quotedScript -RepoPath $quotedRepo"

if (-not $NoMerge) {
  $argument = $argument + " -Merge"
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argument -WorkingDirectory $repo
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
  -Description "Run the local follow-builders skill publisher every afternoon and commit the result through a branch and PR." `
  -Force | Out-Null

Write-Host "Installed follow-builders skill scheduled task: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Runner: $runScript"
Write-Host "Merge after success: $(-not $NoMerge)"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
