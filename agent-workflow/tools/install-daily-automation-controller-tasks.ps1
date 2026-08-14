param(
  [string]$RepoPath = "",
  [string]$MorningAt = "08:10",
  [string]$RecoveryAt = "09:15",
  [string]$ClosureAt = "09:50",
  [string]$FinalClosureAt = "16:45",
  [string]$RuntimePath = "",
  [string]$CodexExecutable = "",
  [Alias("DisableLegacyTasks")]
  [bool]$RemoveLegacyTasks = $true,
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

function Resolve-CodexExecutable {
  param([string]$InputPath)

  function Test-CodexExecutable {
    param([string]$Candidate)
    if (-not $Candidate -or -not (Test-Path -LiteralPath $Candidate -PathType Leaf)) { return $false }
    try {
      $process = Start-Process -FilePath $Candidate -ArgumentList "--version" -PassThru -Wait -WindowStyle Hidden
      return $process.ExitCode -eq 0
    } catch {
      return $false
    }
  }

  if ($InputPath) {
    $resolved = (Resolve-Path -LiteralPath $InputPath).Path
    if (-not (Test-CodexExecutable -Candidate $resolved)) {
      throw "Codex executable is not runnable: $resolved"
    }
    return $resolved
  }

  $managedRoot = Join-Path $env:LOCALAPPDATA "WaveSight\codex-cli"
  $managedExecutable = Get-ChildItem -LiteralPath (Join-Path $managedRoot "node_modules\@openai") `
    -Recurse -Filter "codex.exe" -File -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if (Test-CodexExecutable -Candidate $managedExecutable) { return $managedExecutable }

  $command = Get-Command codex.exe -ErrorAction SilentlyContinue
  if ($command -and (Test-CodexExecutable -Candidate $command.Source)) { return $command.Source }

  New-Item -ItemType Directory -Path $managedRoot -Force | Out-Null
  & npm install --prefix $managedRoot "@openai/codex"
  if ($LASTEXITCODE -ne 0) { throw "Failed to install the managed Codex CLI." }
  $managedExecutable = Get-ChildItem -LiteralPath (Join-Path $managedRoot "node_modules\@openai") `
    -Recurse -Filter "codex.exe" -File -ErrorAction Stop |
    Select-Object -First 1 -ExpandProperty FullName
  if (-not (Test-CodexExecutable -Candidate $managedExecutable)) {
    throw "Managed Codex CLI is not runnable: $managedExecutable"
  }
  return $managedExecutable
}

function Register-ControllerTask {
  param(
    [string]$Name,
    [string]$At,
    [string]$Phase,
    [string]$Runner,
    [string]$NodeExecutable,
    [string]$WorkingDirectory,
    [string]$RuntimeDirectory,
    [string]$CodexExecutable
  )
  $time = [DateTime]::ParseExact($At, "HH:mm", [Globalization.CultureInfo]::InvariantCulture)
  $argument = '"' + $Runner + '" --phase=' + $Phase
  if ($Phase -eq "closure") {
    $argument += ' --invoke-codex=true --codex-command="' + $CodexExecutable + '"'
  }
  $argument += ' --runtime-dir="' + $RuntimeDirectory + '"'
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
$CodexExecutable = Resolve-CodexExecutable -InputPath $CodexExecutable
if (-not $RuntimePath) { $RuntimePath = Join-Path $env:LOCALAPPDATA "WaveSight\runtime" }
$RuntimePath = [IO.Path]::GetFullPath($RuntimePath)
New-Item -ItemType Directory -Path $RuntimePath -Force | Out-Null

Register-ControllerTask -Name "WaveSight Morning Production Dispatch" -At $MorningAt -Phase "morning" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo -RuntimeDirectory $RuntimePath -CodexExecutable $CodexExecutable
Register-ControllerTask -Name "WaveSight Daily Recovery Controller" -At $RecoveryAt -Phase "recovery" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo -RuntimeDirectory $RuntimePath -CodexExecutable $CodexExecutable
Register-ControllerTask -Name "WaveSight Daily Automation Closure" -At $ClosureAt -Phase "closure" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo -RuntimeDirectory $RuntimePath -CodexExecutable $CodexExecutable
Register-ControllerTask -Name "WaveSight Daily Final Closure" -At $FinalClosureAt -Phase "final-closure" -Runner $runner -NodeExecutable $nodeExecutable -WorkingDirectory $repo -RuntimeDirectory $RuntimePath -CodexExecutable $CodexExecutable

if ($RemoveLegacyTasks) {
  @(
    "WaveSight Daily Self Repair",
    "WaveSight Codex Self Repair Handoff",
    "WaveSight Data Observation Agent Review Trial"
  ) | ForEach-Object {
    $task = Get-ScheduledTask -TaskName $_ -ErrorAction SilentlyContinue
    if ($task) {
      Unregister-ScheduledTask -TaskName $_ -Confirm:$false
      Write-Host "Removed replaced task: $_"
    }
  }
}

Write-Host "Community Intelligence 08:30 and Follow-Builders 16:10 tasks remain independent; final closure runs at $FinalClosureAt."
Write-Host "Node executable: $nodeExecutable"
Write-Host "Codex executable: $CodexExecutable"
Write-Host "Runtime reports: $RuntimePath"
if ($RunMorningNow) {
  Start-ScheduledTask -TaskName "WaveSight Morning Production Dispatch"
  Write-Host "Started morning controller once now."
}
