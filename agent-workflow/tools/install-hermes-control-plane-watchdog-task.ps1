param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Hermes Control Plane Watchdog",
  [string]$At = "10:20",
  [string]$GitHubRepository = "jerryfang2023-stack/AI-Radar",
  [string]$RuntimePath = "",
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
$runner = Join-Path $repo "agent-workflow\tools\run-hermes-control-plane-cycle.mjs"
if (-not (Test-Path -LiteralPath $runner)) { throw "Hermes control-plane cycle runner not found: $runner" }
$nodeExecutable = Resolve-NodeExecutable
$ghExecutable = (Get-Command gh.exe -ErrorAction Stop).Source
if (-not $RuntimePath) { $RuntimePath = Join-Path $env:LOCALAPPDATA "WaveSight\runtime" }
$RuntimePath = [IO.Path]::GetFullPath($RuntimePath)
New-Item -ItemType Directory -Path $RuntimePath -Force | Out-Null

$time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$argument = '"' + $runner + '" "--repo=' + $GitHubRepository + '" "--gh-executable=' + $ghExecutable + '" "--reports-dir=' + $RuntimePath + '"'
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
  -Description "Check WaveSight controller liveness and always publish the sanitized heartbeat, including manual_required results." `
  -Force | Out-Null

$retiredPublisher = "WaveSight Control Plane Heartbeat Publisher"
if ($retiredPublisher -ne $TaskName) {
  $publisherTask = Get-ScheduledTask -TaskName $retiredPublisher -ErrorAction SilentlyContinue
  if ($publisherTask) {
    Unregister-ScheduledTask -TaskName $retiredPublisher -Confirm:$false
    Write-Host "Removed retired separate heartbeat task: $retiredPublisher"
  }
}

Write-Host "Installed Hermes watchdog + heartbeat cycle: $TaskName"
Write-Host "Repository: $repo"
Write-Host "Schedule: daily at $At"
Write-Host "GitHub repository: $GitHubRepository"
Write-Host "Node executable: $nodeExecutable"
Write-Host "Runtime reports: $RuntimePath"

if ($RunOnceNow) {
  Start-ScheduledTask -TaskName $TaskName
  Write-Host "Started task once now."
}
