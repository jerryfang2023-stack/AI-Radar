const WATCHLIST_KEY = "guanlan_funding_watchlist_v1";
const COMPARE_KEY = "guanlan_funding_compare_v1";
const { recordBehavior } = require("./member.js");

function getWatchIds() {
  const value = wx.getStorageSync(WATCHLIST_KEY);
  return Array.isArray(value) ? value : [];
}

function isWatched(id) {
  return getWatchIds().includes(id);
}

function toggleWatch(id) {
  const current = getWatchIds();
  const adding = !current.includes(id);
  const next = adding ? [...current, id] : current.filter((item) => item !== id);
  wx.setStorageSync(WATCHLIST_KEY, next);
  if (adding) recordBehavior("favorite", id);
  return next;
}

function clearWatchlist() {
  wx.removeStorageSync(WATCHLIST_KEY);
}

function getCompareIds() {
  const value = wx.getStorageSync(COMPARE_KEY);
  return Array.isArray(value) ? value.slice(0, 3) : [];
}

function isCompared(id) {
  return getCompareIds().includes(id);
}

function toggleCompare(id) {
  const current = getCompareIds();
  if (current.includes(id)) {
    const ids = current.filter((item) => item !== id);
    wx.setStorageSync(COMPARE_KEY, ids);
    return { ids, selected: false, full: false };
  }
  if (current.length >= 3) return { ids: current, selected: false, full: true };
  const ids = [...current, id];
  wx.setStorageSync(COMPARE_KEY, ids);
  return { ids, selected: true, full: false };
}

module.exports = {
  WATCHLIST_KEY,
  COMPARE_KEY,
  getWatchIds,
  isWatched,
  toggleWatch,
  clearWatchlist,
  getCompareIds,
  isCompared,
  toggleCompare,
};
