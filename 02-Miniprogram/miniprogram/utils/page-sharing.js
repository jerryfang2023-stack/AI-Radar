const DEFAULT_TITLE = "观澜 AI｜AI 融资与产业生态";

const PAGE_SHARES = {
  "pages/terminal/index": { title: "观澜 AI 融资情报" },
  "pages/market/index": { title: "观澜 AI 生态图谱", keys: ["mode"] },
  "pages/community/index": { title: "观澜 AI 社群" },
  "pages/community-program/index": { title: "观澜 AI 分享实录", keys: ["type", "id", "speaker", "tab"] },
  "pages/community-bounty/index": { title: "观澜 AI 悬赏令", keys: ["id"] },
  "pages/community-points/index": { title: "观澜 AI 积分榜", keys: ["mode"] },
  "pages/community-graph/index": { title: "观澜 AI 角色图谱", keys: ["mode", "tab", "id"] },
  "pages/invite/index": { title: "邀请你加入观澜 AI", keys: ["inviter"] },
};

function shareQuery(options = {}, keys = []) {
  return keys.filter((key) => options[key] !== undefined && options[key] !== "")
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(options[key]))}`).join("&");
}

function sharePayload(page = {}) {
  const route = page.route || "pages/terminal/index";
  const configured = PAGE_SHARES[route];
  // Private/settings screens remain share-capable, but share the public front door
  // rather than account state, drafts, authorization codes or edit parameters.
  const target = configured ? route : "pages/terminal/index";
  const query = configured ? shareQuery(page.__shareOptions, configured.keys) : "";
  return {
    title: configured?.title || DEFAULT_TITLE,
    path: `/${target}${query ? `?${query}` : ""}`,
    query,
  };
}

function installPageSharing() {
  const runtime = typeof globalThis !== "undefined" ? globalThis : global;
  if (!runtime || runtime.__guanlanPageSharingInstalled || typeof runtime.Page !== "function") return;
  runtime.__guanlanPageSharingInstalled = true;
  const originalPage = runtime.Page;
  runtime.Page = function shareablePage(config = {}) {
    const originalLoad = config.onLoad;
    config.onLoad = function onLoad(options) {
      this.__shareOptions = options || {};
      if (typeof wx !== "undefined" && wx.showShareMenu) {
        wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
      }
      return typeof originalLoad === "function" ? originalLoad.call(this, options) : undefined;
    };
    if (typeof config.onShareAppMessage !== "function") {
      config.onShareAppMessage = function onShareAppMessage() {
        const payload = sharePayload(this);
        return { title: payload.title, path: payload.path };
      };
    }
    if (typeof config.onShareTimeline !== "function") {
      config.onShareTimeline = function onShareTimeline() {
        const payload = sharePayload(this);
        return { title: payload.title, query: payload.query };
      };
    }
    return originalPage(config);
  };
}

module.exports = { DEFAULT_TITLE, PAGE_SHARES, installPageSharing, sharePayload, shareQuery };
