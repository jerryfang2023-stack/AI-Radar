param(
  [string]$RepoPath = "",
  [string]$CdpUrl = "http://127.0.0.1:9333",
  [string]$ChromePath = "",
  [string]$ChromeProfilePath = "",
  [switch]$SkipBrowserStart
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

function Resolve-ChromePath {
  param([string]$InputPath)
  if ($InputPath) {
    return (Resolve-Path -LiteralPath $InputPath).Path
  }

  $candidates = @(
    (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"),
    (Join-Path $env:LOCALAPPDATA "Google\Chrome\Application\chrome.exe")
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  return ""
}

function Get-CdpPort {
  param([string]$Url)
  try {
    $uri = [Uri]$Url
    return $uri.Port
  } catch {
    return 9333
  }
}

function Test-CdpEndpoint {
  param([string]$Url)
  try {
    Invoke-WebRequest -Uri ($Url.TrimEnd("/") + "/json/version") -UseBasicParsing -TimeoutSec 3 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Start-CommunityChrome {
  param(
    [string]$Repo,
    [string]$Url,
    [string]$BrowserPath,
    [string]$ProfilePath
  )

  $resolvedChrome = Resolve-ChromePath -InputPath $BrowserPath
  if (-not $resolvedChrome) {
    throw "Chrome executable was not found. Pass -ChromePath to run the collector."
  }

  $port = Get-CdpPort -Url $Url
  $profile = $ProfilePath
  if (-not $profile) {
    $profile = Join-Path $Repo ".codex-browser-profile\community-scan"
  }

  New-Item -ItemType Directory -Force -Path $profile | Out-Null
  Write-LogLine "Starting Chrome for community intelligence on CDP port $port."

  $arguments = @(
    "--remote-debugging-port=$port",
    "--user-data-dir=$profile",
    "--no-first-run",
    "--no-default-browser-check",
    "https://scys.com/",
    "https://aipoju.com/index"
  )

  Start-Process -FilePath $resolvedChrome -ArgumentList $arguments -WindowStyle Hidden | Out-Null

  for ($attempt = 1; $attempt -le 20; $attempt++) {
    Start-Sleep -Seconds 1
    if (Test-CdpEndpoint -Url $Url) {
      Write-LogLine "Chrome CDP endpoint is ready."
      return
    }
  }

  throw "Chrome CDP endpoint did not become ready: $Url"
}

function Invoke-NpmStep {
  param(
    [string]$Name,
    [string[]]$Arguments
  )

  Write-LogLine "Running: npm $($Arguments -join ' ')"
  $output = & npm @Arguments 2>&1
  $exitCode = $LASTEXITCODE
  foreach ($line in $output) {
    Write-LogLine ("[$Name] " + $line)
  }
  if ($exitCode -ne 0) {
    throw "$Name failed with exit code $exitCode."
  }
}

function Get-BeijingDate {
  $timezone = [TimeZoneInfo]::FindSystemTimeZoneById("China Standard Time")
  return [TimeZoneInfo]::ConvertTimeFromUtc((Get-Date).ToUniversalTime(), $timezone).ToString("yyyy-MM-dd")
}

$repo = Resolve-RepoPath -InputPath $RepoPath
$logDir = Join-Path $repo "agent-workflow\reports\community-intelligence"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$script:LogFile = Join-Path $logDir ("community-intelligence-" + (Get-Date -Format "yyyyMMdd") + ".log")

Write-LogLine "Community intelligence run started."
Write-LogLine "Repository: $repo"
Write-LogLine "CDP endpoint: $CdpUrl"

Push-Location $repo
try {
  if (-not (Test-Path -LiteralPath "package.json")) {
    throw "Repository path does not contain package.json: $repo"
  }

  if (-not (Test-CdpEndpoint -Url $CdpUrl)) {
    if ($SkipBrowserStart) {
      throw "Chrome CDP endpoint is not available and -SkipBrowserStart was set: $CdpUrl"
    }
    Start-CommunityChrome -Repo $repo -Url $CdpUrl -BrowserPath $ChromePath -ProfilePath $ChromeProfilePath
  } else {
    Write-LogLine "Chrome CDP endpoint is already available."
  }

  $env:COMMUNITY_CDP_URL = $CdpUrl
  Invoke-NpmStep -Name "collect" -Arguments @("run", "collect:community-intelligence")
  Invoke-NpmStep -Name "archive" -Arguments @("run", "archive:community-intelligence")

  $dataPath = Join-Path $repo "01-SiteV2\site\data\community-intelligence.json"
  if (-not (Test-Path -LiteralPath $dataPath)) {
    throw "Community intelligence data file was not generated: $dataPath"
  }

  $payload = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $generated = [DateTimeOffset]::Parse($payload.meta.generatedAt)
  $timezone = [TimeZoneInfo]::FindSystemTimeZoneById("China Standard Time")
  $generatedBeijing = [TimeZoneInfo]::ConvertTime($generated, $timezone)
  $today = Get-BeijingDate
  $generatedDate = $generatedBeijing.ToString("yyyy-MM-dd")

  if ($generatedDate -ne $today) {
    throw "Generated data date is $generatedDate, expected $today."
  }

  $dailyArchive = Join-Path $repo ("01-SiteV2\content\07-community-intelligence\daily\" + $today + " Community Intelligence.md")
  if (-not (Test-Path -LiteralPath $dailyArchive)) {
    throw "Daily Obsidian archive was not generated: $dailyArchive"
  }

  Write-LogLine ("Validation ok. GeneratedAt: " + $payload.meta.generatedAt)
  Write-LogLine ("Items: " + $payload.items.Count)
  Write-LogLine ("Daily archive: " + $dailyArchive)
  Write-LogLine "Community intelligence run completed."
}
catch {
  Write-LogLine ("Community intelligence run failed: " + $_.Exception.Message)
  exit 1
}
finally {
  Pop-Location
}
