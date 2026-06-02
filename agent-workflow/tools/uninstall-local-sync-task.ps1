param(
  [string]$TaskName = "WaveSight Local GitHub Sync"
)

$ErrorActionPreference = "Stop"

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
