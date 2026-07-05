param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Codex Self Repair Handoff",
  [string]$At = "09:50",
  [ValidateSet("off", "safe")]
  [string]$RepairMode = "safe",
  [switch]$InvokeCodex,
  [switch]$AllowDirty,
  [string]$CodexCommand = "codex",
  [string]$CodexArgs = "",
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

function Quote-Arg {
  param([string]$Value)
  return '"' + ($Value -replace '"', '\"') + '"'
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-codex-self-repair.mjs"

if (-not (Test-Path -LiteralPath $runner)) {
  throw "Codex self-repair runner not found: $runner"
}

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$invoke = if ($InvokeCodex) { "on" } else { "off" }
$argumentParts = @(
  (Quote-Arg $runner),
  "--repair=$RepairMode",
  "--invoke=$invoke",
  "--codex-command=$(Quote-Arg $CodexCommand)"
)

if ($CodexArgs) {
  $argumentParts += "--codex-args=$(Quote-Arg $CodexArgs)"
}

if ($AllowDirty) {
  $argumentParts += "--allow-dirty=true"
}

$argument = $argumentParts -join " "
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
  -Description "Generate a non-Hermes Codex self-repair handoff, optionally invoking Codex non-interactively." `
  -Force | Out-Null

Write-Host "Installed Codex self-repair scheduled task: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Repair mode: $RepairMode"
Write-Host "Invoke Codex: $invoke"
Write-Host "Runner: $runner"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
