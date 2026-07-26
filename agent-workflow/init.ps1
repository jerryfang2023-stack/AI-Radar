param(
  [switch]$Sync
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "tools\Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

$Root = Split-Path -Parent $PSScriptRoot
$HealthScript = Join-Path $PSScriptRoot "verification\site-health.ps1"
$RepoSkillSync = Join-Path $PSScriptRoot "tools\sync-repo-skills.mjs"

Write-Host "Guanlan AI agent workflow started" -ForegroundColor Cyan
Write-Host "Project root: $Root"

if (-not (Test-Path $HealthScript)) {
  throw "Health check script not found: $HealthScript"
}

if (-not (Test-Path -LiteralPath $RepoSkillSync)) {
  throw "Repo Skill sync script not found: $RepoSkillSync"
}

& node $RepoSkillSync
if ($LASTEXITCODE -ne 0) {
  throw "Repo Skill sync failed with exit code $LASTEXITCODE"
}

& $HealthScript -Root $Root -Sync:$Sync
