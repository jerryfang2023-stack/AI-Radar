param(
  [string]$TaskName = "WaveSight Community Intelligence Weekly"
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

$taskNames = @($TaskName, "WaveSight Community Intelligence Daily") | Select-Object -Unique
$removed = $false
foreach ($name in $taskNames) {
  if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false
    Write-Host "Removed community intelligence task: $name"
    $removed = $true
  }
}
if (-not $removed) { Write-Host "Community intelligence task not found: $TaskName" }
