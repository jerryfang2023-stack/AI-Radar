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
  [pscustomobject]@{ Name = "WaveSight Morning Production Dispatch"; Time = "08:10"; Runner = "run-daily-automation-controller.mjs"; Arguments = "--phase=morning" },
  [pscustomobject]@{ Name = "WaveSight Community Intelligence Daily"; Time = "08:30"; Runner = "run-community-intelligence.ps1"; Arguments = "-PublishAfterSuccess" },
  [pscustomobject]@{ Name = "WaveSight Daily Recovery Controller"; Time = "09:15"; Runner = "run-daily-automation-controller.mjs"; Arguments = "--phase=recovery" },
  [pscustomobject]@{ Name = "WaveSight Daily Automation Closure"; Time = "09:50"; Runner = "run-daily-automation-controller.mjs"; Arguments = "--phase=closure --invoke-codex=true" },
  [pscustomobject]@{ Name = "WaveSight Hermes Control Plane Watchdog"; Time = "10:20"; Runner = "run-hermes-control-plane-cycle.mjs"; Arguments = "--repo=jerryfang2023-stack/AI-Radar" },
  [pscustomobject]@{ Name = "WaveSight Follow-Builders Skill Daily"; Time = "16:10"; Runner = "run-follow-builders-skill.ps1"; Arguments = "-Merge" },
  [pscustomobject]@{ Name = "WaveSight Daily Final Closure"; Time = "16:45"; Runner = "run-daily-automation-controller.mjs"; Arguments = "--phase=final-closure" }
)
$expectedByName = @{}
foreach ($item in $expected) { $expectedByName[$item.Name] = $item }

$tasks = @(Get-ScheduledTask -TaskName "WaveSight*" -ErrorAction SilentlyContinue)
$issues = [System.Collections.Generic.List[string]]::new()

foreach ($task in $tasks) {
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

$followBuilders = $tasks | Where-Object TaskName -eq "WaveSight Follow-Builders Skill Daily"
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
  actual_count = $tasks.Count
  tasks = @($tasks | Sort-Object TaskName | ForEach-Object {
    [pscustomobject]@{
      name = $_.TaskName
      state = [string]$_.State
      time = ([DateTime]$_.Triggers[0].StartBoundary).ToString("HH:mm")
      runner = $_.Actions[0].Arguments
    }
  })
  issues = @($issues)
}

$summary | ConvertTo-Json -Depth 5
if (-not $summary.ok) { exit 1 }
