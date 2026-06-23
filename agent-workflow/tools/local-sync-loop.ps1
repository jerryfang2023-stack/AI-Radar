param(
  [string]$RepoPath = "",
  [int]$IntervalMinutes = 30
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
$syncScript = Join-Path $repo "agent-workflow\tools\local-sync-from-main.ps1"
$sleepSeconds = [Math]::Max(60, $IntervalMinutes * 60)

while ($true) {
  try {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $syncScript -RepoPath $repo
  } catch {
    Write-Host ("Local sync loop error: " + $_.Exception.Message)
  }

  Start-Sleep -Seconds $sleepSeconds
}
