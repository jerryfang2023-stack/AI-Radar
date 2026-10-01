param(
  [string]$RepoPath = "",
  [string]$RuntimePath = ""
)

$ErrorActionPreference = "Stop"

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) { return (Resolve-Path -LiteralPath $InputPath).Path }
  return (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

$repo = Resolve-RepoPath -InputPath $RepoPath
if (-not $RuntimePath) { $RuntimePath = Join-Path $env:LOCALAPPDATA "WaveSight\runtime" }
$RuntimePath = [IO.Path]::GetFullPath($RuntimePath)
$expected = @(
  [pscustomobject]@{ Name = "WaveSight Community Intelligence Weekly"; Time = "08:30"; Frequency = "weekly"; Runner = "run-community-intelligence.ps1"; Arguments = "-PublishAfterSuccess" },
  [pscustomobject]@{ Name = "WaveSight Follow-Builders Skill Weekly"; Time = "16:10"; Frequency = "weekly"; Runner = "run-follow-builders-skill.ps1"; Arguments = "-Merge" }
)
$expectedByName = @{}
foreach ($item in $expected) { $expectedByName[$item.Name] = $item }

$tasks = @(Get-ScheduledTask -TaskName "WaveSight*" -ErrorAction SilentlyContinue)
$issues = [System.Collections.Generic.List[string]]::new()

foreach ($task in $tasks) {
  if (-not $task.Settings.Enabled) { continue }
  if (-not $expectedByName.ContainsKey($task.TaskName)) {
    $issues.Add("Unexpected WaveSight task exists: $($task.TaskName)")
    continue
  }

  $contract = $expectedByName[$task.TaskName]
  $action = @($task.Actions)[0]
  $trigger = @($task.Triggers)[0]
  $time = ([DateTime]$trigger.StartBoundary).ToString("HH:mm")
  $actionText = "$($action.Execute) $($action.Arguments)"

  if (-not $task.Settings.Enabled) { $issues.Add("Task is disabled: $($task.TaskName)") }
  if ($time -ne $contract.Time) { $issues.Add("Task time mismatch: $($task.TaskName) expected $($contract.Time), found $time") }
  if ($contract.Frequency -eq "weekly") {
    if ($trigger.CimClass.CimClassName -ne "MSFT_TaskWeeklyTrigger") { $issues.Add("Task frequency mismatch: $($task.TaskName) expected weekly") }
    if ([int]$trigger.DaysOfWeek -ne 2) { $issues.Add("Task weekday mismatch: $($task.TaskName) expected Monday only") }
  }
  elseif ($trigger.CimClass.CimClassName -ne "MSFT_TaskDailyTrigger") {
    $issues.Add("Task frequency mismatch: $($task.TaskName) expected daily")
  }
  if ($action.WorkingDirectory -ne $repo) { $issues.Add("Task working directory mismatch: $($task.TaskName)") }
  if ($actionText -notlike "*$($contract.Runner)*") { $issues.Add("Task runner mismatch: $($task.TaskName)") }
  if ($actionText -notlike "*$($contract.Arguments)*") { $issues.Add("Task arguments mismatch: $($task.TaskName)") }
  if ($actionText -notlike "*$RuntimePath*") { $issues.Add("Task runtime path mismatch: $($task.TaskName)") }
  if ($actionText -match "\\wiki\\.*\\01-WaveSight") { $issues.Add("Task still references the retired AI hotspot vault: $($task.TaskName)") }
}

foreach ($contract in $expected) {
  if (-not ($tasks | Where-Object TaskName -eq $contract.Name)) {
    $issues.Add("Required task is missing: $($contract.Name)")
  }
}

$followBuilders = $tasks | Where-Object TaskName -eq "WaveSight Follow-Builders Skill Weekly"
if ($followBuilders) {
  if (-not $followBuilders.Settings.WakeToRun) { $issues.Add("Follow-Builders task must wake the machine") }
  if ([int]$followBuilders.Settings.RestartCount -lt 2) { $issues.Add("Follow-Builders task must retain two retries") }
}

$startupDataLake = Join-Path ([Environment]::GetFolderPath("Startup")) "WaveSight Data Lake Sync.cmd"
if (Test-Path -LiteralPath $startupDataLake) {
  $issues.Add("Retired independent data-lake Startup loop still exists: $startupDataLake")
}

$summary = [pscustomobject]@{
  ok = $issues.Count -eq 0
  repository = $repo
  expected_count = $expected.Count
  actual_count = @($tasks | Where-Object { $_.Settings.Enabled }).Count
  retired_disabled_count = @($tasks | Where-Object { -not $_.Settings.Enabled }).Count
  tasks = @($tasks | Sort-Object TaskName | ForEach-Object {
    [pscustomobject]@{
      name = $_.TaskName
      state = [string]$_.State
      time = ([DateTime]$_.Triggers[0].StartBoundary).ToString("HH:mm")
      frequency = $_.Triggers[0].CimClass.CimClassName
      daysOfWeek = $_.Triggers[0].DaysOfWeek
      runner = $_.Actions[0].Arguments
    }
  })
  issues = @($issues)
}

$summary | ConvertTo-Json -Depth 5
if (-not $summary.ok) { exit 1 }
