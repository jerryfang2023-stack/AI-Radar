param(
  [string]$RepoPath = "",
  [string]$MorningAt = "08:10",
  [string]$RecoveryAt = "09:15",
  [string]$ClosureAt = "09:50",
  [bool]$DisableLegacyTasks = $true,
  [switch]$RunMorningNow
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) { return (Resolve-Path -LiteralPath $InputPath).Path }
  return (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
}

function Register-ControllerTask {
  param(
    [string]$Name,
    [string]$At,
    [string]$Phase,
    [string]$Runner,
    [string]$WorkingDirectory
  )
  $time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
  $argument = '"' + $Runner + '" --phase=' + $Phase
  if ($Phase -eq "closure") { $argument += " --invoke-codex=true" }
  $action = New-ScheduledTaskAction -Execute "node.exe" -Argument $argument -WorkingDirectory $WorkingDirectory
  $trigger = New-ScheduledTaskTrigger -Daily -At $time
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
    -Description "WaveSight consolidated daily automation controller: $Phase." `
    -Force | Out-Null
  Write-Host "Installed: $Name at $At ($Phase)"
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$runner = Join-Path $repo "agent-workflow\tools\run-daily-automation-controller.mjs"
if (-not (Test-Path -LiteralPath $runner)) { throw "Controller runner not found: $runner" }

Register-ControllerTask -Name "WaveSight Morning Production Dispatch" -At $MorningAt -Phase "morning" -Runner $runner -WorkingDirectory $repo
Register-ControllerTask -Name "WaveSight Daily Recovery Controller" -At $RecoveryAt -Phase "recovery" -Runner $runner -WorkingDirectory $repo
Register-ControllerTask -Name "WaveSight Daily Automation Closure" -At $ClosureAt -Phase "closure" -Runner $runner -WorkingDirectory $repo

if ($DisableLegacyTasks) {
  @(
    "WaveSight Daily Self Repair",
    "WaveSight Codex Self Repair Handoff",
    "WaveSight Data Observation Agent Review Trial"
  ) | ForEach-Object {
    $task = Get-ScheduledTask -TaskName $_ -ErrorAction SilentlyContinue
    if ($task) {
      Disable-ScheduledTask -TaskName $_ | Out-Null
      Write-Host "Disabled legacy task: $_"
    }
  }
}

Write-Host "Community Intelligence 08:30 and Follow-Builders 16:10 tasks remain independent."
if ($RunMorningNow) {
  Start-ScheduledTask -TaskName "WaveSight Morning Production Dispatch"
  Write-Host "Started morning controller once now."
}
