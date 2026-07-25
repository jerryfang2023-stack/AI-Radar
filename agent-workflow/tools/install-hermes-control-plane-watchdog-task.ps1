param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Hermes Control Plane Watchdog",
  [string]$At = "10:20",
  [switch]$RunOnceNow
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) { return (Resolve-Path -LiteralPath $InputPath).Path }
  return (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

function Resolve-NodeExecutable {
  $fnmDefault = Join-Path $env:APPDATA "fnm\aliases\default\node.exe"
  if (Test-Path -LiteralPath $fnmDefault) {
    return (Resolve-Path -LiteralPath $fnmDefault).Path
  }

  $command = Get-Command node.exe -ErrorAction Stop
  if (-not (Test-Path -LiteralPath $command.Source)) {
    throw "Node executable not found: $($command.Source)"
  }
  return $command.Source
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-hermes-control-plane-watchdog.mjs"
if (-not (Test-Path -LiteralPath $runner)) { throw "Hermes watchdog runner not found: $runner" }
$nodeExecutable = Resolve-NodeExecutable

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$argument = '"' + $runner + '"'
$action = New-ScheduledTaskAction -Execute $nodeExecutable -Argument $argument -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Daily -At $time
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Check WaveSight controller liveness only; Hermes does not evaluate lane data or dispatch recovery." `
  -Force | Out-Null

Write-Host "Installed Hermes control-plane watchdog: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "Node executable: $nodeExecutable"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
