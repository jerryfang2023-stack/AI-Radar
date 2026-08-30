const API_ROOT = "https://www.zkdlj.vip/api/v1";
const APP_VERSION = "0.9.2";
const TOKEN_KEY = "guanlan_api_token_v1";
const VISITOR_KEY = "guanlan_analytics_visitor_v1";
const SESSION_KEY = "guanlan_analytics_session_v1";
const QUEUE_KEY = "guanlan_analytics_queue_v1";
const SESSION_TIMEOUT = 30 * 60 * 1000;
let flushing = false;

function uniqueId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function visitorId() {
  let value = wx.getStorageSync(VISITOR_KEY);
  if (!value) {
    value = uniqueId("mini-visitor");
    wx.setStorageSync(VISITOR_KEY, value);
  }
  return value;
}

function sessionId(force = false) {
  const now = Date.now();
  const saved = wx.getStorageSync(SESSION_KEY) || {};
  if (force || !saved.id || now - Number(saved.activeAt || 0) > SESSION_TIMEOUT) {
    const next = { id: uniqueId("mini-session"), activeAt: now };
    wx.setStorageSync(SESSION_KEY, next);
    return next.id;
  }
  wx.setStorageSync(SESSION_KEY, { ...saved, activeAt: now });
  return saved.id;
}

function deviceProperties() {
  try {
    const info = wx.getSystemInfoSync();
    return {
      os: info.platform || "",
      model: info.model || "",
      system: info.system || "",
      wechatVersion: info.version || "",
    };
  } catch {
    return {};
  }
}

function currentRoute() {
  try {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return page?.route ? `/${page.route}` : "/app";
  } catch {
    return "/app";
  }
}

function enqueue(event) {
  const queue = wx.getStorageSync(QUEUE_KEY) || [];
  queue.push(event);
  wx.setStorageSync(QUEUE_KEY, queue.slice(-100));
  if (queue.length >= 5) flush();
}

function track(event, properties = {}, options = {}) {
  enqueue({
    eventId: uniqueId("mini-event"),
    event,
    platform: "miniprogram",
    visitorId: visitorId(),
    sessionId: sessionId(),
    page: options.page || currentRoute(),
    referrer: options.referrer || "",
    appVersion: APP_VERSION,
    occurredAt: new Date().toISOString(),
    properties: { ...deviceProperties(), ...properties },
  });
}

function flush() {
  if (flushing) return Promise.resolve(false);
  const queue = wx.getStorageSync(QUEUE_KEY) || [];
  if (!queue.length) return Promise.resolve(true);
  flushing = true;
  const batch = queue.slice(0, 20);
  const token = wx.getStorageSync(TOKEN_KEY);
  return new Promise((resolve) => {
    wx.request({
      url: `${API_ROOT}/analytics/events`,
      method: "POST",
      data: { events: batch },
      timeout: 10000,
      header: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const latest = wx.getStorageSync(QUEUE_KEY) || [];
          const ids = new Set(batch.map((item) => item.eventId));
          wx.setStorageSync(QUEUE_KEY, latest.filter((item) => !ids.has(item.eventId)));
          resolve(true);
          return;
        }
        resolve(false);
      },
      fail() { resolve(false); },
      complete() { flushing = false; },
    });
  });
}

function contentProperties(route, options, data = {}) {
  const id = options?.id || options?.reportId || options?.entityId || "";
  if (!id) return null;
  if (route.includes("report-detail")) return { contentType: "report", contentId: id, title: data.report?.title || "" };
  if (route.includes("entity-detail")) return { contentType: "entity", contentId: id, title: data.entity?.name || data.title || "" };
  if (route.includes("/detail")) return { contentType: "funding", contentId: id, title: data.card?.company || "" };
  return null;
}

function installPageTracking() {
  const runtime = typeof globalThis !== "undefined" ? globalThis : global;
  if (!runtime || runtime.__guanlanAnalyticsPageInstalled || typeof runtime.Page !== "function") return;
  runtime.__guanlanAnalyticsPageInstalled = true;
  const originalPage = runtime.Page;
  runtime.Page = function trackedPage(config = {}) {
    const originalLoad = config.onLoad;
    const originalShow = config.onShow;
    const originalHide = config.onHide;
    const originalUnload = config.onUnload;
    config.onLoad = function onLoad(options) {
      this.__analyticsOptions = options || {};
      return typeof originalLoad === "function" ? originalLoad.call(this, options) : undefined;
    };
    config.onShow = function onShow() {
      this.__analyticsShownAt = Date.now();
      const route = this.route ? `/${this.route}` : currentRoute();
      track("page_view", { queryKeys: Object.keys(this.__analyticsOptions || {}).slice(0, 8) }, { page: route });
      const content = contentProperties(route, this.__analyticsOptions, this.data || {});
      if (content) track("content_view", content, { page: route });
      flush();
      return typeof originalShow === "function" ? originalShow.call(this) : undefined;
    };
    const leave = function leavePage(original) {
      const durationMs = this.__analyticsShownAt ? Date.now() - this.__analyticsShownAt : 0;
      track("page_leave", { durationMs }, { page: this.route ? `/${this.route}` : currentRoute() });
      flush();
      return typeof original === "function" ? original.call(this) : undefined;
    };
    config.onHide = function onHide() { return leave.call(this, originalHide); };
    config.onUnload = function onUnload() { return leave.call(this, originalUnload); };
    return originalPage(config);
  };
}

module.exports = {
  APP_VERSION,
  track,
  flush,
  sessionId,
  installPageTracking,
};
