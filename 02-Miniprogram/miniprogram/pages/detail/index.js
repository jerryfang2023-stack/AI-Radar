const details = require("../../data/funding-details.js");
const { isWatched, toggleWatch } = require("../../utils/storage.js");
const { recordBrowse } = require("../../utils/member.js");

Page({
  data: { card: null, watched: false },

  onLoad(options) {
    const card = details[options.id];
    if (!card) {
      wx.showToast({ title: "融资记录不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 500);
      return;
    }
    recordBrowse(card.id);
    this.setData({ card, watched: isWatched(card.id) });
  },

  onShow() {
    if (this.data.card) this.setData({ watched: isWatched(this.data.card.id) });
  },

  toggleWatch() {
    toggleWatch(this.data.card.id);
    this.setData({ watched: isWatched(this.data.card.id) });
    wx.showToast({ title: this.data.watched ? "已加入观察" : "已取消收藏", icon: "none" });
  },

  copySource(event) {
    const url = event.currentTarget.dataset.url;
    if (!url) return;
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title: "来源链接已复制", icon: "success" }) });
  },
});
