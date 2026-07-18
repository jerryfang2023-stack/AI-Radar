param(
  [string]$RepoPath = "",
  [string]$WeeklyReportAt = "10:30",
  [string]$WeeklyHealthAt = "18:00",
  [string]$MonthlyAt = "14:00",
  [switch]$InstallLocalRecovery
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) { return (Resolve-Path -LiteralPath $InputPath).Path }
  return (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

function Register-PeriodicTask {
  param(
    [string]$Name,
    [string]$At,
    [string]$Phase,
    [ValidateSet("Monday", "Sunday", "Daily")]
    [string]$Schedule,
    [string]$Runner,
    [string]$WorkingDirectory
  )

  $time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
  $argument = '"' + $Runner + '" --phase=' + $Phase
  $action = New-ScheduledTaskAction -Execute "node.exe" -Argument $argument -WorkingDirectory $WorkingDirectory
  if ($Schedule -eq "Daily") {
    $trigger = New-ScheduledTaskTrigger -Daily -At $time
  } else {
    $trigger = New-ScheduledTaskTrigger -Weekly -WeeksInterval 1 -DaysOfWeek $Schedule -At $time
  }
  $settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew

  Register-ScheduledTask `
    -TaskName $Name `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "WaveSight periodic automation controller: $Phase." `
    -Force | Out-Null
  Write-Host "Installed: $Name at $At ($Schedule, $Phase)"
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-periodic-automation-controller.mjs"
if (-not (Test-Path -LiteralPath $runner)) { throw "Periodic controller not found: $runner" }

if (-not $InstallLocalRecovery) {
  @(
    "WaveSight Weekly Report and Opportunity Map",
    "WaveSight Weekly Health Learning Loop",
    "WaveSight Monthly Report and Maintenance"
  ) | ForEach-Object {
    $task = Get-ScheduledTask -TaskName $_ -ErrorAction SilentlyContinue
    if ($task) { Disable-ScheduledTask -TaskName $_ | Out-Null; Write-Host "Disabled local duplicate: $_" }
  }
  Write-Host "GitHub Actions owns periodic schedules. Use -InstallLocalRecovery only for an explicit local recovery lane."
  exit 0
}

Register-PeriodicTask -Name "WaveSight Weekly Report and Opportunity Map" -At $WeeklyReportAt -Phase "weekly-report" -Schedule "Monday" -Runner $runner -WorkingDirectory $repo
Register-PeriodicTask -Name "WaveSight Weekly Health Learning Loop" -At $WeeklyHealthAt -Phase "weekly-health" -Schedule "Sunday" -Runner $runner -WorkingDirectory $repo
Register-PeriodicTask -Name "WaveSight Monthly Report and Maintenance" -At $MonthlyAt -Phase "monthly" -Schedule "Daily" -Runner $runner -WorkingDirectory $repo

Write-Host "Local recovery tasks installed. GitHub Actions remains the primary production scheduler."
