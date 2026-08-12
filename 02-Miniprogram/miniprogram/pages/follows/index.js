const { getFollowIds, toggleFollow } = require("../../utils/member.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");

Page({
  data: { categories: [] },
  onLoad() { refreshFundingData().then(() => this.refresh()); },
  onShow() { this.refresh(); },
  refresh() {
    const followed = new Set(getFollowIds());
    this.setData({ categories: getFundingData().index.categories.map((item) => ({ ...item, followed: followed.has(item.id) })) });
  },
  toggle(event) {
    const result = toggleFollow(event.currentTarget.dataset.id);
    this.refresh();
    const title = result.awarded ? `关注成功，获得 ${result.awarded} 积分` : (result.following ? "已关注" : "已取消关注");
    wx.showToast({ title, icon: "none" });
  },
  open(event) {
    wx.setStorageSync("guanlan_pending_filter_v1", { categoryId: event.currentTarget.dataset.id });
    wx.switchTab({ url: "/pages/terminal/index" });
  },
});
