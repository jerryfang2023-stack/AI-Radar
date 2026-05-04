param(
  [switch]$Sync
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$HealthScript = Join-Path $PSScriptRoot "verification\site-health.ps1"

Write-Host "Guanlan AI agent workflow started" -ForegroundColor Cyan
Write-Host "Project root: $Root"

if (-not (Test-Path $HealthScript)) {
  throw "Health check script not found: $HealthScript"
}

& $HealthScript -Root $Root -Sync:$Sync
