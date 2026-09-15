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

# Git's own proxy settings override the environment. Keep overrides confined to
# this process and its children, including the sibling financing publisher.
$gitProxyRows = @(& git config --get-regexp '^https?\..*proxy$' 2>$null)
if ($LASTEXITCODE -notin @(0, 1)) { throw "Cannot inspect Git proxy configuration" }
$gitProxySettings = @{}
foreach ($row in $gitProxyRows) {
  if ($row -match '^(\S+)\s+(.*)$') { $gitProxySettings[$Matches[1]] = $Matches[2] }
}
foreach ($key in $gitProxySettings.Keys) {
  try { $uri = [Uri]$gitProxySettings[$key] } catch { continue }
  if ($uri.Host.Trim('[', ']') -notin @("127.0.0.1", "localhost", "::1")) { continue }
  $identity = "$($uri.Host):$($uri.Port)"
  if (-not $proxyReachability.ContainsKey($identity)) {
    $proxyReachability[$identity] = Test-WaveSightProxyEndpoint -Uri $uri
  }
  if ($proxyReachability[$identity]) { continue }
  # Quoted parameters preserve an empty value on Windows PowerShell 5.1, where
  # assigning an empty GIT_CONFIG_VALUE_n would remove that environment variable.
  $quote = [string][char]39
  $escapedKey = $key.Replace($quote, $quote + [char]92 + $quote + $quote)
  $env:GIT_CONFIG_PARAMETERS = ($env:GIT_CONFIG_PARAMETERS + " " + $quote + $escapedKey + "=" + $quote).Trim()
  $disabledProxyNames += "git:$key"
}

if ($disabledProxyNames.Count -gt 0) {
  Write-Host "WaveSight network preflight: local proxy unavailable; using direct fallback for this run."
}
