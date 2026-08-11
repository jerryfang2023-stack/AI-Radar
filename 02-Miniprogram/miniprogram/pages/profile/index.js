const fundingIndex = require("../../data/funding-index.js");
const { getWatchIds, clearWatchlist } = require("../../utils/storage.js");

Page({
  data: { meta: fundingIndex.meta, watchCount: 0 },
  onShow() { this.setData({ watchCount: getWatchIds().length }); },
  openWatchlist() { wx.switchTab({ url: "/pages/watchlist/index" }); },
  clearLocalData() {
    wx.showModal({
      title: "清空本地收藏？",
      content: "只会删除当前设备上的观察列表，不影响融资数据。",
      confirmColor: "#B85C5C",
      success: (result) => {
        if (!result.confirm) return;
        clearWatchlist();
        this.setData({ watchCount: 0 });
        wx.showToast({ title: "已清空", icon: "success" });
      },
    });
  },
});
