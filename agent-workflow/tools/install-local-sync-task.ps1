param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Local GitHub Sync",
  [int]$IntervalMinutes = 30,
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
$syncScript = Join-Path $repo "agent-workflow\tools\local-sync-from-main.ps1"
$loopScript = Join-Path $repo "agent-workflow\tools\local-sync-loop.ps1"

if (-not (Test-Path -LiteralPath $syncScript)) {
  throw "Sync script not found: $syncScript"
}

if (-not (Test-Path -LiteralPath $loopScript)) {
  throw "Sync loop script not found: $loopScript"
}

$quotedScript = '"' + $syncScript + '"'
$quotedRepo = '"' + $repo + '"'
$argument = "-NoProfile -ExecutionPolicy Bypass -File $quotedScript -RepoPath $quotedRepo"

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argument -WorkingDirectory $repo
$logonTrigger = New-ScheduledTaskTrigger -AtLogOn
$intervalTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5) `
  -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) `
  -RepetitionDuration (New-TimeSpan -Days 3650)

$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew

try {
  Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger @($logonTrigger, $intervalTrigger) `
    -Settings $settings `
    -Description "Sync WaveSight local Obsidian workspace from GitHub main after PR auto-merge." `
    -Force | Out-Null

  Write-Host "Installed local sync scheduled task: $TaskName"
  Write-Host "Repository: $repo"
  Write-Host "Interval: every $IntervalMinutes minutes, plus at Windows logon."

  if ($RunOnceNow) {
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "Started task once now."
  }
} catch {
  $startup = [Environment]::GetFolderPath("Startup")
  if (-not $startup) {
    throw "Scheduled task install failed and Startup folder could not be resolved: $($_.Exception.Message)"
  }

  $startupFile = Join-Path $startup "WaveSight Local GitHub Sync.cmd"
  $loopArgument = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$loopScript`" -RepoPath `"$repo`" -IntervalMinutes $IntervalMinutes"
  $cmd = "@echo off`r`nchcp 65001 >nul`r`nstart `"WaveSight Local GitHub Sync`" powershell.exe $loopArgument`r`n"
  Set-Content -LiteralPath $startupFile -Value $cmd -Encoding UTF8

  Write-Host "Scheduled task install was blocked by Windows permissions."
  Write-Host "Installed Startup fallback instead: $startupFile"
  Write-Host "It will start a hidden sync loop at Windows logon and check every $IntervalMinutes minutes."

  if ($RunOnceNow) {
    Start-Process powershell.exe -ArgumentList $loopArgument -WindowStyle Hidden
    Write-Host "Started Startup fallback loop once now."
  }
}
