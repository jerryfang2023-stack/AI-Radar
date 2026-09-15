import net from "node:net";
import { spawnSync } from "node:child_process";

const PROXY_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
];
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
const LOOPBACK_BYPASS = ["localhost", "127.0.0.1", "::1"];

function appendBypass(value = "") {
  const entries = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set([...entries, ...LOOPBACK_BYPASS])].join(",");
}

function proxyEndpoint(value) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^\[|\]$/gu, "");
    if (!LOOPBACK_HOSTS.has(host)) return null;
    const port = Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80));
    if (!Number.isInteger(port) || port <= 0) return null;
    return { host, port };
  } catch {
    return null;
  }
}

function readGitProxyConfig(env) {
  const result = spawnSync("git", ["config", "--null", "--get-regexp", "^https?\\..*proxy$"], {
    env, encoding: "utf8", windowsHide: true, timeout: 5000,
  });
  if (result.status === 1) return [];
  if (result.error || result.status !== 0) throw new Error("Cannot inspect Git proxy configuration");
  return result.stdout.split("\0").filter(Boolean).map((entry) => {
    const split = entry.indexOf("\n");
    return [entry.slice(0, split), entry.slice(split + 1)];
  });
}

function canConnect({ host, port }, timeoutMs = 750) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (reachable) => {
      socket.destroy();
      resolve(reachable);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

export async function resolveAutomationNetworkEnv(baseEnv = process.env, options = {}) {
  const env = { ...baseEnv };
  env.NO_PROXY = appendBypass(env.NO_PROXY || env.no_proxy || "");
  env.no_proxy = env.NO_PROXY;
  const reachable = options.canConnect || canConnect;
  const checked = new Map();
  const disabled = [];

  for (const key of PROXY_KEYS) {
    const endpoint = proxyEndpoint(env[key]);
    if (!endpoint) continue;
    const identity = `${endpoint.host}:${endpoint.port}`;
    if (!checked.has(identity)) checked.set(identity, await reachable(endpoint));
    if (checked.get(identity)) continue;
    delete env[key];
    disabled.push(key);
  }

  // Git configuration takes precedence over proxy environment variables. Override
  // only dead loopback entries for this process tree; never rewrite user config.
  const gitProxies = (options.readGitProxyConfig || readGitProxyConfig)(env);
  for (const [key, value] of new Map(gitProxies)) {
    const endpoint = proxyEndpoint(value);
    if (!endpoint) continue;
    const identity = `${endpoint.host}:${endpoint.port}`;
    if (!checked.has(identity)) checked.set(identity, await reachable(endpoint));
    if (checked.get(identity)) continue;
    const count = Number(env.GIT_CONFIG_COUNT || 0);
    if (!Number.isInteger(count) || count < 0) throw new Error("Invalid GIT_CONFIG_COUNT");
    env[`GIT_CONFIG_KEY_${count}`] = key;
    env[`GIT_CONFIG_VALUE_${count}`] = "";
    env.GIT_CONFIG_COUNT = String(count + 1);
    disabled.push(`git:${key}`);
  }

  return {
    env,
    mode: disabled.length ? "direct_fallback" : "configured",
    disabled,
  };
}
