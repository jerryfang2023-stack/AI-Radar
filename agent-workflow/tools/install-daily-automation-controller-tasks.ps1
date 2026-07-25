param(
  [string]$RepoPath = "",
  [string]$MorningAt = "08:10",
  [string]$RecoveryAt = "09:15",
  [string]$ClosureAt = "09:50",
  [string]$FinalClosureAt = "16:45",
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

function Register-ControllerTask {
  param(
    [string]$Name,
    [string]$At,
    [string]$Phase,
    [string]$Runner,
    [string]$NodeExecutable,
    [string]$WorkingDirectory
  )
  $time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
  $argument = '"' + $Runner + '" --phase=' + $Phase
  if ($Phase -eq "closure") { $argument += " --invoke-codex=true" }
  $action = New-ScheduledTaskAction -Execute $NodeExecutable -Argument $argument -WorkingDirectory $WorkingDirectory
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
$nodeExecutable = Resolve-NodeExecutable

Register-ControllerTask -Name "WaveSight Morning Production Dispatch" -At $MorningAt -Phase "morning" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo
Register-ControllerTask -Name "WaveSight Daily Recovery Controller" -At $RecoveryAt -Phase "recovery" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo
Register-ControllerTask -Name "WaveSight Daily Automation Closure" -At $ClosureAt -Phase "closure" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo
Register-ControllerTask -Name "WaveSight Daily Final Closure" -At $FinalClosureAt -Phase "final-closure" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo

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

Write-Host "Community Intelligence 08:30 and Follow-Builders 16:10 tasks remain independent; final closure runs at $FinalClosureAt."
Write-Host "Node executable: $nodeExecutable"
if ($RunMorningNow) {
  Start-ScheduledTask -TaskName "WaveSight Morning Production Dispatch"
  Write-Host "Started morning controller once now."
}
