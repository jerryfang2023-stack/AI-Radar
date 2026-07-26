param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Control Plane Heartbeat Publisher",
  [string]$At = "10:25",
  [string]$GitHubRepository = "jerryfang2023-stack/AI-Radar",
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
  return (Get-Command node.exe -ErrorAction Stop).Source
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\publish-hermes-control-plane-heartbeat.mjs"
if (-not (Test-Path -LiteralPath $runner)) { throw "Hermes heartbeat publisher not found: $runner" }
$nodeExecutable = Resolve-NodeExecutable
$ghExecutable = (Get-Command gh.exe -ErrorAction Stop).Source

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$argument = '"' + $runner + '" "--repo=' + $GitHubRepository + '" "--gh-executable=' + $ghExecutable + '"'
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
  -Description "Publish a sanitized WaveSight control-plane heartbeat to GitHub; never publish local report bodies or production data." `
  -Force | Out-Null

Write-Host "Installed control-plane heartbeat publisher: $TaskName"
Write-Host "Repository: $repo"
Write-Host "GitHub repository: $GitHubRepository"
Write-Host "Schedule: daily at $At"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started heartbeat publisher once now."
}
