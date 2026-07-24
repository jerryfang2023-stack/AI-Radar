param(
  [string]$RepoPath = "",
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

$repo = Resolve-RepoPath -InputPath $RepoPath
$publisher = Join-Path $repo "agent-workflow\tools\publish-follow-builders-skill-local.mjs"
$supervisor = Join-Path $repo "agent-workflow\tools\write-daily-supervision-report.mjs"

if (-not (Test-Path -LiteralPath $publisher)) {
  throw "Follow-builders skill publisher not found: $publisher"
}
if (-not (Test-Path -LiteralPath $supervisor)) {
  throw "Daily supervision runner not found: $supervisor"
}

Push-Location $repo
$publisherExitCode = 0
$skillSupervisionFailed = $false
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
    & node $supervisor "--force-afternoon-window=true"
    $supervisionExitCode = $LASTEXITCODE
    $latestReport = Join-Path $repo "agent-workflow\reports\daily-supervision-report-latest.json"
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
