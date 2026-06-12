param(
  [string]$RepoPath = "",
  [string]$Remote = "origin",
  [string]$Branch = "main",
  [switch]$AllowDirty,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-LogLine {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] $Message"
  Write-Host $line
  if ($script:LogFile) {
    Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8
  }
}

function Resolve-RepoPath {
  param([string]$InputPath)
  if ($InputPath) {
    return (Resolve-Path -LiteralPath $InputPath).Path
  }

  $scriptPath = Split-Path -Parent $PSCommandPath
  return (Resolve-Path -LiteralPath (Join-Path $scriptPath "..\..")).Path
}

function Invoke-AipTopicExport {
  param([string]$Repo)

  $exportScript = Join-Path $Repo "agent-workflow\tools\export-topic-center-to-aip-md.mjs"
  if (-not (Test-Path -LiteralPath $exportScript)) {
    Write-LogLine "AIP topic export skipped; script not found."
    return
  }

  Write-LogLine "Exporting Topic Center daily MD to 04-AIP\01-选题库..."
  if ($DryRun) {
    Write-LogLine "[dry-run] node agent-workflow/tools/export-topic-center-to-aip-md.mjs"
    return
  }

  $output = & node $exportScript 2>&1
  foreach ($line in $output) {
    Write-LogLine $line
  }
  if ($LASTEXITCODE -ne 0) {
    throw "AIP topic export failed with exit code $LASTEXITCODE"
  }
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$logDir = Join-Path $repo "agent-workflow\reports\local-sync"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$script:LogFile = Join-Path $logDir ("local-sync-" + (Get-Date -Format "yyyyMMdd") + ".log")

Write-LogLine "WaveSight local sync started."
Write-LogLine "Repository: $repo"
Write-LogLine "Target: $Remote/$Branch"

Push-Location $repo
try {
  if (-not (Test-Path -LiteralPath ".git")) {
    throw "Repository path does not contain a .git directory: $repo"
  }

  $currentBranch = (git branch --show-current).Trim()
  if ($currentBranch -ne $Branch) {
    throw "Current branch is '$currentBranch'. Switch to '$Branch' before local auto-sync."
  }

  Write-LogLine "Fetching remote refs..."
  if ($DryRun) {
    Write-LogLine "[dry-run] git fetch --prune $Remote"
  } else {
    git fetch --prune $Remote | ForEach-Object { Write-LogLine $_ }
  }

  $status = git status --porcelain
  if ($status -and -not $AllowDirty) {
    Write-LogLine "Local changes detected. Sync paused to avoid overwriting local Obsidian/workspace edits."
    Write-LogLine "Commit, stash, or clean local changes, then run sync again."
    git status --short | ForEach-Object { Write-LogLine $_ }
    exit 10
  }

  $localHead = (git rev-parse $Branch).Trim()
  $remoteHead = (git rev-parse "$Remote/$Branch").Trim()

  if ($localHead -eq $remoteHead) {
    Write-LogLine "Already up to date."
    Invoke-AipTopicExport -Repo $repo
    exit 0
  }

  $base = (git merge-base $Branch "$Remote/$Branch").Trim()
  if ($base -ne $localHead) {
    Write-LogLine "Local branch is not a clean ancestor of $Remote/$Branch. Sync paused."
    Write-LogLine "This avoids merging over local commits automatically."
    exit 11
  }

  Write-LogLine "Fast-forwarding local $Branch to $Remote/$Branch..."
  if ($DryRun) {
    Write-LogLine "[dry-run] git pull --ff-only $Remote $Branch"
  } else {
    git pull --ff-only $Remote $Branch | ForEach-Object { Write-LogLine $_ }
  }

  Invoke-AipTopicExport -Repo $repo
  Write-LogLine "Local sync completed."
}
catch {
  Write-LogLine ("Sync failed: " + $_.Exception.Message)
  exit 1
}
finally {
  Pop-Location
}
