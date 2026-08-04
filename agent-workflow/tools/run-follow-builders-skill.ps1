param(
  [string]$RepoPath = "",
  [string]$RuntimePath = "",
  [switch]$Merge
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

function Get-BeijingDate {
  $timezone = [TimeZoneInfo]::FindSystemTimeZoneById("China Standard Time")
  return [TimeZoneInfo]::ConvertTimeFromUtc((Get-Date).ToUniversalTime(), $timezone).ToString("yyyy-MM-dd")
}

$repo = Resolve-RepoPath -InputPath $RepoPath
if (-not $RuntimePath) { $RuntimePath = Join-Path $env:LOCALAPPDATA "WaveSight\runtime" }
$RuntimePath = [IO.Path]::GetFullPath($RuntimePath)
New-Item -ItemType Directory -Path $RuntimePath -Force | Out-Null
$publisherSource = Join-Path $repo "agent-workflow\tools\publish-follow-builders-skill-local.mjs"
$supervisorSource = Join-Path $repo "agent-workflow\tools\write-daily-supervision-report.mjs"

if (-not (Test-Path -LiteralPath $publisherSource)) {
  throw "Follow-builders skill publisher not found: $publisherSource"
}
if (-not (Test-Path -LiteralPath $supervisorSource)) {
  throw "Daily supervision runner not found: $supervisorSource"
}

$date = Get-BeijingDate
$worktreeRoot = Join-Path $RuntimePath "worktrees"
$runWorktree = Join-Path $worktreeRoot ("follow-builders-" + $date + "-" + $PID)
$runBranch = "automation/local-follow-builders-$date-$PID"
$runtimeReportDir = Join-Path $RuntimePath "follow-builders-skill"
$publisherExitCode = 0
$supervisionExitCode = 1
$skillSupervisionFailed = $false
$worktreeCreated = $false

New-Item -ItemType Directory -Path $worktreeRoot -Force | Out-Null
New-Item -ItemType Directory -Path $runtimeReportDir -Force | Out-Null

try {
  & git -C $repo fetch origin main --quiet
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to fetch origin/main before creating the follow-builders worktree."
  }

  & git -C $repo worktree add -b $runBranch $runWorktree origin/main
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to create isolated follow-builders worktree: $runWorktree"
  }
  $worktreeCreated = $true

  $publisher = Join-Path $runWorktree "agent-workflow\tools\publish-follow-builders-skill-local.mjs"
  $supervisor = Join-Path $runWorktree "agent-workflow\tools\write-daily-supervision-report.mjs"

  Push-Location $runWorktree
  try {
    $publisherArgs = @($publisher)
    if (-not $Merge) {
      $publisherArgs += "--merge=false"
    }

    & node @publisherArgs
    $publisherExitCode = $LASTEXITCODE
  }
  finally {
    try {
      & node $supervisor "--force-afternoon-window=true" "--output-dir=$RuntimePath"
      $supervisionExitCode = $LASTEXITCODE
      $latestReport = Join-Path $RuntimePath "daily-supervision-report-latest.json"
      if (Test-Path -LiteralPath $latestReport) {
        $supervision = Get-Content -Raw -LiteralPath $latestReport | ConvertFrom-Json
        $skillLane = $supervision.lanes | Where-Object { $_.id -eq "follow_builders_skill" } | Select-Object -First 1
        $skillSupervisionFailed = (-not $skillLane) -or ($skillLane.status -notin @("passed", "warning"))
      }
      else {
        $skillSupervisionFailed = $true
      }
    }
    catch {
      $skillSupervisionFailed = $true
      Write-Warning "Unable to read the forced afternoon supervision result: $($_.Exception.Message)"
    }
    finally {
      Pop-Location
    }
  }
}
finally {
  if ($worktreeCreated) {
    $runReport = Join-Path $runWorktree "agent-workflow\reports\$date-follow-builders-skill-local-publish.md"
    if (Test-Path -LiteralPath $runReport) {
      Copy-Item -LiteralPath $runReport -Destination (Join-Path $runtimeReportDir "$date-follow-builders-skill-local-publish.md") -Force
    }
    & git -C $repo worktree remove --force -- $runWorktree
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Unable to remove isolated follow-builders worktree: $runWorktree"
    }
    & git -C $repo branch -D -- $runBranch 2>$null | Out-Null
  }
}

if ($publisherExitCode -eq 0 -and $Merge) {
  Push-Location $repo
  try {
    $currentBranch = (& git branch --show-current).Trim()
    $dirtyFiles = @(& git status --porcelain)
    if ($currentBranch -eq "main" -and $dirtyFiles.Count -eq 0) {
      & git fetch origin main --quiet
      if ($LASTEXITCODE -eq 0) {
        & git pull --ff-only origin main
      }
      if ($LASTEXITCODE -ne 0) {
        Write-Warning "Follow-builders publication succeeded, but local main fast-forward failed."
      }
    }
    elseif ($currentBranch -eq "main") {
      Write-Warning "Follow-builders publication succeeded, but local main sync was skipped because the primary worktree has $($dirtyFiles.Count) pre-existing dirty file(s)."
    }
  }
  finally {
    Pop-Location
  }
}

if ($publisherExitCode -ne 0) {
  exit $publisherExitCode
}
if ($skillSupervisionFailed) {
  Write-Error "Follow-builders publisher exited successfully, but forced afternoon supervision did not pass."
  exit 1
}
if ($supervisionExitCode -ne 0) {
  Write-Warning "Daily supervision found a failure in another lane; the follow-builders skill lane passed."
}
