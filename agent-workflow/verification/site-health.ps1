param(
  [string]$Root = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
  [switch]$Sync
)

$ErrorActionPreference = "Stop"

function Add-Line {
  param([System.Collections.Generic.List[string]]$Lines, [string]$Text)
  $Lines.Add($Text) | Out-Null
}

function Get-DateFromName {
  param([string]$Name)
  if ($Name -match "^(\d{4}-\d{2}-\d{2})-") { return $Matches[1] }
  return ""
}

function Has-Text {
  param([object]$Value)
  return -not [string]::IsNullOrWhiteSpace([string]$Value)
}

$Root = (Resolve-Path $Root).Path
$WorkflowDir = Join-Path $Root "agent-workflow"
$LogDir = Join-Path $WorkflowDir "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$SignalSuffix = "AI$([char]0x5546)$([char]0x4E1A)$([char]0x96F7)$([char]0x8FBE).md"
$ScoreSuffix = "AI$([char]0x673A)$([char]0x4F1A)$([char]0x8BC4)$([char]0x5206).md"

$Now = Get-Date
$Stamp = $Now.ToString("yyyyMMdd-HHmmss")
$LogPath = Join-Path $LogDir "health-$Stamp.md"
$Lines = [System.Collections.Generic.List[string]]::new()

Add-Line $Lines "# Guanlan AI health check"
Add-Line $Lines ""
Add-Line $Lines "- Time: $($Now.ToString("yyyy-MM-dd HH:mm:ss"))"
Add-Line $Lines "- Root: $Root"
Add-Line $Lines "- Sync first: $($Sync.IsPresent)"
Add-Line $Lines ""

$RequiredPaths = @(
  "01-Signals",
  "02-Scoring",
  "03-Trends",
  "04-Site\index.html",
  "04-Site\daily.html",
  "04-Site\signals.html",
  "04-Site\scoring.html",
  "04-Site\opportunities.html",
  "04-Site\tags.html",
  "04-Site\config\content-paths.json",
  "04-Site\js\app.js",
  "04-Site\scripts\sync-data.mjs",
  "07-Opportunities"
)

Add-Line $Lines "## Base files"
$Missing = @()
foreach ($Item in $RequiredPaths) {
  $Path = Join-Path $Root $Item
  if (Test-Path $Path) {
    Add-Line $Lines "- OK: $Item"
  } else {
    $Missing += $Item
    Add-Line $Lines "- MISSING: $Item"
  }
}
Add-Line $Lines ""

$OpportunityRoot = Join-Path $Root "07-Opportunities"
if (Test-Path $OpportunityRoot) {
  $OpportunityCards = @(Get-ChildItem -Path $OpportunityRoot -File -Filter "*.md" -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "_*" })
  Add-Line $Lines "- OK: opportunity cards in 07-Opportunities -> $($OpportunityCards.Count)"
} else {
  Add-Line $Lines "- MISSING: 07-Opportunities"
}
Add-Line $Lines ""

if ($Sync) {
  Add-Line $Lines "## Site data sync"
  $Node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $Node) {
    Add-Line $Lines "- Node.js not found. Sync skipped."
  } else {
    Push-Location $Root
    try {
      $Output = & node "04-Site/scripts/sync-data.mjs" 2>&1
      Add-Line $Lines "- Sync script executed."
      foreach ($Line in $Output) {
        Add-Line $Lines "  - $Line"
      }
    } catch {
      Add-Line $Lines "- Sync failed: $($_.Exception.Message)"
    } finally {
      Pop-Location
    }
  }
  Add-Line $Lines ""
}

Add-Line $Lines "## Markdown naming"
$SignalFiles = Get-ChildItem -Path (Join-Path $Root "01-Signals") -Filter "*.md" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "_*" }
$ScoringFiles = Get-ChildItem -Path (Join-Path $Root "02-Scoring") -Filter "*.md" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "_*" }

$BadSignalNames = $SignalFiles | Where-Object {
  $Date = Get-DateFromName $_.Name
  -not ($Date -and $_.Name -eq "$Date-$SignalSuffix")
}
$BadScoringNames = $ScoringFiles | Where-Object {
  $Date = Get-DateFromName $_.Name
  -not ($Date -and $_.Name -eq "$Date-$ScoreSuffix")
}

Add-Line $Lines "- Signal md files: $($SignalFiles.Count)"
Add-Line $Lines "- Scoring md files: $($ScoringFiles.Count)"
if ($BadSignalNames.Count -gt 0) {
  $Joined = ($BadSignalNames.Name -join " | ")
  Add-Line $Lines "- Bad signal names: $Joined"
} else {
  Add-Line $Lines "- Signal names: OK"
}
if ($BadScoringNames.Count -gt 0) {
  $Joined = ($BadScoringNames.Name -join " | ")
  Add-Line $Lines "- Bad scoring names: $Joined"
} else {
  Add-Line $Lines "- Scoring names: OK"
}
Add-Line $Lines ""

$DataPath = Join-Path $Root "04-Site\data\radar-data.json"
Add-Line $Lines "## Site data"
$ScoreEmptyTrack = @()
$OpportunityIdDupes = @()
if (Test-Path $DataPath) {
  $Data = Get-Content -Path $DataPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $Signals = @($Data.signals)
  $Scores = @($Data.scoring.rows)
  $Trends = @($Data.trends)
  $Opportunities = @($Data.opportunities)

  Add-Line $Lines "- generatedAt: $($Data.generatedAt)"
  Add-Line $Lines "- Signals: $($Signals.Count)"
  Add-Line $Lines "- Score rows: $($Scores.Count)"
  Add-Line $Lines "- Trends: $($Trends.Count)"
  Add-Line $Lines "- Opportunities: $($Opportunities.Count)"

  $SignalDupes = $Signals |
    Group-Object { (($_.title, $_.product) -join "|").ToLower().Trim() } |
    Where-Object { $_.Count -gt 1 -and $_.Name.Trim() -ne "|" }
  if ($SignalDupes.Count -gt 0) {
    Add-Line $Lines "- Duplicate signal groups: $($SignalDupes.Count)"
    foreach ($Group in $SignalDupes | Select-Object -First 10) {
      Add-Line $Lines "  - $($Group.Name): $($Group.Count)"
    }
  } else {
    Add-Line $Lines "- Duplicate signals: none obvious"
  }

  $ScoreEmptyTrack = $Scores | Where-Object { -not (Has-Text $_.track) }
  Add-Line $Lines "- Score rows with empty track: $($ScoreEmptyTrack.Count)"
  foreach ($Row in $ScoreEmptyTrack | Select-Object -First 10) {
    Add-Line $Lines "  - $($Row.product) / $($Row.opportunity) / $($Row.total)"
  }

  $OpportunityIdDupes = $Opportunities |
    Where-Object { Has-Text $_.id } |
    Group-Object id |
    Where-Object { $_.Count -gt 1 }
  if ($OpportunityIdDupes.Count -gt 0) {
    Add-Line $Lines "- Duplicate opportunity IDs: $($OpportunityIdDupes.Count)"
    foreach ($Group in $OpportunityIdDupes) {
      $Names = @($Group.Group | ForEach-Object { $_.title }) -join " / "
      Add-Line $Lines "  - $($Group.Name): $Names"
    }
  } else {
    Add-Line $Lines "- Opportunity IDs: no duplicates"
  }

  $LatestSignalDate = ($SignalFiles | Sort-Object Name -Descending | Select-Object -First 1 | ForEach-Object { Get-DateFromName $_.Name })
  $TodaySignals = $Signals | Where-Object { $_.date -eq $LatestSignalDate }
  if ($LatestSignalDate) {
    Add-Line $Lines "- Latest signal date: $LatestSignalDate, site count for that date: $($TodaySignals.Count)"
  }
} else {
  Add-Line $Lines "- Data file not found: $DataPath"
}
Add-Line $Lines ""

Add-Line $Lines "## Code check"
$NodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($NodeCommand) {
  Push-Location $Root
  try {
    $Check = & node --check "04-Site/js/app.js" 2>&1
    if ($LASTEXITCODE -eq 0) {
      Add-Line $Lines "- app.js syntax: OK"
    } else {
      Add-Line $Lines "- app.js syntax issue: $Check"
    }
  } catch {
    Add-Line $Lines "- app.js syntax check failed: $($_.Exception.Message)"
  } finally {
    Pop-Location
  }
} else {
  Add-Line $Lines "- Node.js not found. app.js syntax check skipped."
}
Add-Line $Lines ""

Add-Line $Lines "## Recommended next actions"
if ($Missing.Count -gt 0) {
  Add-Line $Lines "- Restore missing base files first."
}
if ($BadSignalNames.Count -gt 0 -or $BadScoringNames.Count -gt 0) {
  Add-Line $Lines "- Fix markdown naming before the next sync."
}
if ((Test-Path $DataPath) -and $ScoreEmptyTrack.Count -gt 0) {
  Add-Line $Lines "- Review empty-track scoring rows and fill track or mark as risk variables."
}
if ((Test-Path $DataPath) -and $OpportunityIdDupes.Count -gt 0) {
  Add-Line $Lines "- Fix duplicate opportunity IDs to avoid relation confusion."
}
Add-Line $Lines "- After each change, rerun this check and update progress.md."

Set-Content -Path $LogPath -Value $Lines -Encoding UTF8

Write-Host "Health check complete: $LogPath" -ForegroundColor Green
Get-Content -Path $LogPath -Encoding UTF8
