param(
  [string]$RepoPath = "",
  [int]$IntervalMinutes = 60
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
$syncScript = Join-Path $repo "agent-workflow\tools\sync-data-lake.ps1"
$sleepSeconds = [Math]::Max(300, $IntervalMinutes * 60)
$lockDir = Join-Path $repo "agent-workflow\cache"
$lockFile = Join-Path $lockDir "data-lake-sync-loop.pid"
New-Item -ItemType Directory -Force -Path $lockDir | Out-Null

if (Test-Path -LiteralPath $lockFile) {
  $existingPid = (Get-Content -LiteralPath $lockFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($existingPid -and (Get-Process -Id ([int]$existingPid) -ErrorAction SilentlyContinue)) {
    Write-Host "Data-lake sync loop already running with PID $existingPid."
    exit 0
  }
}

Set-Content -LiteralPath $lockFile -Value $PID -Encoding UTF8

while ($true) {
  try {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $syncScript -RepoPath $repo
  } catch {
    Write-Host ("Data-lake sync loop error: " + $_.Exception.Message)
  }

  Start-Sleep -Seconds $sleepSeconds
}
