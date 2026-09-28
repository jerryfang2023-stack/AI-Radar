param(
  [string]$RepoPath = ""
)

$ErrorActionPreference = "Stop"

if ($RepoPath) {
  $repo = (Resolve-Path -LiteralPath $RepoPath).Path
} else {
  $repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

& (Join-Path $PSScriptRoot "install-daily-automation-controller-tasks.ps1") -RepoPath $repo
& (Join-Path $PSScriptRoot "install-community-intelligence-task.ps1") -RepoPath $repo -At "08:30"
& (Join-Path $PSScriptRoot "install-follow-builders-skill-task.ps1") -RepoPath $repo -At "16:10"

$weeklyTaskNames = @(
  "WaveSight Community Intelligence Weekly",
  "WaveSight Follow-Builders Skill Weekly"
)
foreach ($name in $weeklyTaskNames) {
  $task = Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
  if (-not $task -or $task.Triggers[0].CimClass.CimClassName -ne "MSFT_TaskWeeklyTrigger" -or [int]$task.Triggers[0].DaysOfWeek -ne 2) {
    throw "Weekly Monday task was not installed correctly: $name"
  }
}

$retiredDailyTasks = @(
  "WaveSight Community Intelligence Daily",
  "WaveSight Follow-Builders Skill Daily"
)
foreach ($name in $retiredDailyTasks) {
  if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false
    Write-Host "Replaced retired daily task with its weekly lane: $name"
  }
}

# Daily inspection and repair are operator-owned; do not recreate the watchdog.
& (Join-Path $PSScriptRoot "install-periodic-automation-tasks.ps1") -RepoPath $repo

$retiredDataLakeTask = Get-ScheduledTask -TaskName "WaveSight Data Lake Sync" -ErrorAction SilentlyContinue
if ($retiredDataLakeTask) {
  Unregister-ScheduledTask -TaskName "WaveSight Data Lake Sync" -Confirm:$false
  Write-Host "Removed retired independent data-lake task: WaveSight Data Lake Sync"
}
$startupDataLake = Join-Path ([Environment]::GetFolderPath("Startup")) "WaveSight Data Lake Sync.cmd"
if (Test-Path -LiteralPath $startupDataLake) {
  Remove-Item -LiteralPath $startupDataLake -Force
  Write-Host "Removed retired data-lake Startup loop: $startupDataLake"
}

& (Join-Path $PSScriptRoot "assert-windows-automation-tasks.ps1") -RepoPath $repo
