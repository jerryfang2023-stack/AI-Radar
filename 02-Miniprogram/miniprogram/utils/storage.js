const WATCHLIST_KEY = "guanlan_funding_watchlist_v1";
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

module.exports = { WATCHLIST_KEY, getWatchIds, isWatched, toggleWatch, clearWatchlist };
