$loopbackBypass = @("localhost", "127.0.0.1", "::1")
$existingBypass = @($env:NO_PROXY -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$combinedBypass = @($existingBypass + $loopbackBypass | Select-Object -Unique) -join ","
$env:NO_PROXY = $combinedBypass
$env:no_proxy = $combinedBypass

function Test-WaveSightProxyEndpoint {
  param([Uri]$Uri)
  $client = [Net.Sockets.TcpClient]::new()
  try {
    $port = if ($Uri.Port -gt 0) { $Uri.Port } elseif ($Uri.Scheme -eq "https") { 443 } else { 80 }
    $connect = $client.ConnectAsync($Uri.Host, $port)
    return $connect.Wait(750) -and $client.Connected
  } catch {
    return $false
  } finally {
    $client.Dispose()
  }
}

$proxyNames = @("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy")
$proxyReachability = @{}
$disabledProxyNames = @()
foreach ($name in $proxyNames) {
  $value = [Environment]::GetEnvironmentVariable($name, "Process")
  if (-not $value) { continue }
  try { $uri = [Uri]$value } catch { continue }
  if ($uri.Host -notin @("127.0.0.1", "localhost", "::1")) { continue }
  $identity = "$($uri.Host):$($uri.Port)"
  if (-not $proxyReachability.ContainsKey($identity)) {
    $proxyReachability[$identity] = Test-WaveSightProxyEndpoint -Uri $uri
  }
  if (-not $proxyReachability[$identity]) {
    Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
    $disabledProxyNames += $name
  }
}

if ($disabledProxyNames.Count -gt 0) {
  Write-Host "WaveSight network preflight: local proxy unavailable; using direct fallback for this run."
}
