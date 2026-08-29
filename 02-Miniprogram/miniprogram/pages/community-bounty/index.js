const { bounties, getBounty } = require("../../utils/community-data.js");

Page({
  data: { mode: "list", activeFilter: "全部", filters: ["全部", "进行中", "待结案", "已结案"], bounties, item: null, answer: "", participating: false },
  onLoad(options) {
    if (options.id) {
      const item = getBounty(options.id);
      this.setData({ mode: "detail", item: { ...item, founderInitial: item.founder.slice(0, 1) } });
    }
  },
  switchFilter(event) {
    const activeFilter = event.currentTarget.dataset.value;
    this.setData({ activeFilter, bounties: activeFilter === "全部" ? bounties : bounties.filter((item) => item.status === activeFilter) });
  },
  openCase(event) { wx.navigateTo({ url: `/pages/community-bounty/index?id=${event.currentTarget.dataset.id}` }); },
  createCase() { wx.showToast({ title: "发起入口将在正式运营后台开放", icon: "none" }); },
  inputAnswer(event) { this.setData({ answer: event.detail.value }); },
  submitAnswer() {
    if (!this.data.answer.trim()) return wx.showToast({ title: "请先填写回答", icon: "none" });
    wx.showModal({ title: "确认提交回答", content: "提交后 Founder 可在结案时采纳并分配积分。", success: (result) => { if (result.confirm) { this.setData({ answer: "" }); wx.showToast({ title: "回答已提交", icon: "success" }); } } });
  },
  joinCocreate() { this.setData({ participating: true }); wx.showToast({ title: "已登记参加共创", icon: "success" }); },
});
