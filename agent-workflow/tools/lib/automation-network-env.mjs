import net from "node:net";

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
    if (!LOOPBACK_HOSTS.has(parsed.hostname)) return null;
    const port = Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80));
    if (!Number.isInteger(port) || port <= 0) return null;
    return { host: parsed.hostname, port };
  } catch {
    return null;
  }
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

  return {
    env,
    mode: disabled.length ? "direct_fallback" : "configured",
    disabled,
  };
}
