const ECOSYSTEM_MODE_KEY = "guanlan_ecosystem_mode_v1";

Page({
  onLoad() {
    wx.setStorageSync(ECOSYSTEM_MODE_KEY, "directory");
    wx.switchTab({ url: "/pages/market/index" });
  },
});
