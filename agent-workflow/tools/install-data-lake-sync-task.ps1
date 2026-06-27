param(
  [string]$RepoPath = "",
  [string]$TaskName = "WaveSight Data Lake Sync",
  [string]$At = "11:10",
  [int]$FallbackIntervalMinutes = 60,
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
$syncScript = Join-Path $repo "agent-workflow\tools\sync-data-lake.ps1"
if (-not (Test-Path -LiteralPath $syncScript)) {
  throw "Data-lake sync script not found: $syncScript"
}

$atTime = [datetime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
$quotedScript = '"' + $syncScript + '"'
$quotedRepo = '"' + $repo + '"'
$argument = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File $quotedScript -RepoPath $quotedRepo"

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argument -WorkingDirectory $repo
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At $atTime
$logonTrigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew

try {
  Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger @($dailyTrigger, $logonTrigger) `
    -Settings $settings `
    -Description "Rebuild the local WaveSight DuckDB data-lake index from Git-tracked source files." `
    -Force | Out-Null

  Write-Host "Installed data-lake sync scheduled task: $TaskName"
  Write-Host "Repository: $repo"
  Write-Host "Schedule: daily at $At, plus at Windows logon."

  if ($RunOnceNow) {
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "Started task once now."
  }
} catch {
  $startup = [Environment]::GetFolderPath("Startup")
  if (-not $startup) {
    throw "Scheduled task install failed and Startup folder could not be resolved: $($_.Exception.Message)"
  }

  $loopScript = Join-Path $repo "agent-workflow\tools\data-lake-sync-loop.ps1"
  if (-not (Test-Path -LiteralPath $loopScript)) {
    throw "Scheduled task install failed and fallback loop script was not found: $loopScript"
  }

  $startupFile = Join-Path $startup "WaveSight Data Lake Sync.cmd"
  $loopArgument = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$loopScript`" -RepoPath `"$repo`" -IntervalMinutes $FallbackIntervalMinutes"
  $cmd = "@echo off`r`nchcp 65001 >nul`r`nstart `"WaveSight Data Lake Sync`" powershell.exe $loopArgument`r`n"
  Set-Content -LiteralPath $startupFile -Value $cmd -Encoding UTF8

  Write-Host "Scheduled task install was blocked by Windows permissions."
  Write-Host "Installed Startup fallback instead: $startupFile"
  Write-Host "It will start a hidden data-lake sync loop at Windows logon and check every $FallbackIntervalMinutes minutes."

  if ($RunOnceNow) {
    Start-Process powershell.exe -ArgumentList $loopArgument -WindowStyle Hidden
    Write-Host "Started Startup fallback loop once now."
  }
}
