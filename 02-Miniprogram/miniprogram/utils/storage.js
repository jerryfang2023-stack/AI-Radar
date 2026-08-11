const WATCHLIST_KEY = "guanlan_funding_watchlist_v1";

function getWatchIds() {
  const value = wx.getStorageSync(WATCHLIST_KEY);
  return Array.isArray(value) ? value : [];
}

function isWatched(id) {
  return getWatchIds().includes(id);
}

function toggleWatch(id) {
  const current = getWatchIds();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  wx.setStorageSync(WATCHLIST_KEY, next);
  return next;
}

function clearWatchlist() {
  wx.removeStorageSync(WATCHLIST_KEY);
}

module.exports = { WATCHLIST_KEY, getWatchIds, isWatched, toggleWatch, clearWatchlist };
