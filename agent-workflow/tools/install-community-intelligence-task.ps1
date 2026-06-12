param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Community Intelligence Daily",
  [string]$At = "08:30",
  [string]$CdpUrl = "http://127.0.0.1:9333",
  [int]$MaxAttempts = 2,
  [int]$RetryDelaySeconds = 300,
  [switch]$NoPublishAfterSuccess,
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
$runScript = Join-Path $repo "agent-workflow\tools\run-community-intelligence.ps1"

if (-not (Test-Path -LiteralPath $runScript)) {
  throw "Community intelligence runner not found: $runScript"
}

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$quotedScript = '"' + $runScript + '"'
$quotedRepo = '"' + $repo + '"'
$quotedCdpUrl = '"' + $CdpUrl + '"'
$argument = "-NoProfile -ExecutionPolicy Bypass -File $quotedScript -RepoPath $quotedRepo -CdpUrl $quotedCdpUrl -MaxAttempts $MaxAttempts -RetryDelaySeconds $RetryDelaySeconds"

if (-not $NoPublishAfterSuccess) {
  $argument = $argument + " -PublishAfterSuccess"
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
  -Description "Run WaveSight community intelligence collection and local Obsidian archive every day." `
  -Force | Out-Null

Write-Host "Installed community intelligence scheduled task: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Runner: $runScript"
Write-Host "Max attempts: $MaxAttempts"
Write-Host "Retry delay seconds: $RetryDelaySeconds"
Write-Host "Publish after success: $(-not $NoPublishAfterSuccess)"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
