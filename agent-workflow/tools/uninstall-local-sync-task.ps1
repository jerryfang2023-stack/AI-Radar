param(
  [string]$TaskName = "WaveSight Local GitHub Sync"
)

$ErrorActionPreference = "Stop"
$Utf8Profile = Join-Path $PSScriptRoot "Set-WaveSightUtf8.ps1"
if (Test-Path -LiteralPath $Utf8Profile) { . $Utf8Profile }

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Removed local sync task: $TaskName"
} else {
  Write-Host "Local sync task not found: $TaskName"
}

$startup = [Environment]::GetFolderPath("Startup")
if ($startup) {
  $startupFile = Join-Path $startup "WaveSight Local GitHub Sync.cmd"
  if (Test-Path -LiteralPath $startupFile) {
    Remove-Item -LiteralPath $startupFile -Force
    Write-Host "Removed Startup fallback: $startupFile"
  }
}
