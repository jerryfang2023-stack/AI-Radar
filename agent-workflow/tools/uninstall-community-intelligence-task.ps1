param(
  [string]$TaskName = "WaveSight Community Intelligence Daily"
)

$ErrorActionPreference = "Stop"

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Removed community intelligence task: $TaskName"
} else {
  Write-Host "Community intelligence task not found: $TaskName"
}
