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

if (-not (Test-Path -LiteralPath $publisher)) {
  throw "Follow-builders skill publisher not found: $publisher"
}

Push-Location $repo
try {
  $publisherArgs = @($publisher)
  if (-not $Merge) {
    $publisherArgs += "--merge=false"
  }

  & node @publisherArgs
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}
finally {
  Pop-Location
}
