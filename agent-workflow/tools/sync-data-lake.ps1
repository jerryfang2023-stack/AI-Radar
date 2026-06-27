param(
  [string]$RepoPath = "",
  [switch]$DryRun
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

function Write-LogLine {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] $Message"
  Write-Host $line
  if ($script:LogFile) {
    Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8
  }
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$logDir = Join-Path $repo "agent-workflow\reports\data-lake"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$script:LogFile = Join-Path $logDir ("data-lake-sync-" + (Get-Date -Format "yyyyMMdd") + ".log")

Write-LogLine "WaveSight data-lake sync started."
Write-LogLine "Repository: $repo"

Push-Location $repo
try {
  if (-not (Test-Path -LiteralPath ".git")) {
    throw "Repository path does not contain a .git directory: $repo"
  }

  if ($DryRun) {
    Write-LogLine "[dry-run] npm run sync:data-lake"
    exit 0
  }

  $output = & npm run sync:data-lake 2>&1
  foreach ($line in $output) {
    Write-LogLine $line
  }
  if ($LASTEXITCODE -ne 0) {
    throw "npm run sync:data-lake failed with exit code $LASTEXITCODE"
  }

  Write-LogLine "WaveSight data-lake sync completed."
}
catch {
  Write-LogLine ("Data-lake sync failed: " + $_.Exception.Message)
  exit 1
}
finally {
  Pop-Location
}
