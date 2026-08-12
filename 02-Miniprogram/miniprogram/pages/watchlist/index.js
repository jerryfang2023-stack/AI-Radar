const reportIndex = require("../../data/report-index.js");

Page({
  data: {
    meta: reportIndex.meta,
    activeType: "weekly",
    activeLabel: "周报",
    featured: null,
    reports: [],
  },

  onLoad() { this.refresh("weekly"); },

  refresh(type) {
    const reports = reportIndex.reports.filter((item) => item.type === type);
    this.setData({
      activeType: type,
      activeLabel: type === "weekly" ? "周报" : "月报",
      featured: reports[0] || null,
      reports: reports.slice(1),
    });
  },

  switchType(event) { this.refresh(event.currentTarget.dataset.type); },
  openReport(event) { wx.navigateTo({ url: `/pages/report-detail/index?id=${event.currentTarget.dataset.id}` }); },
  openSaved() { wx.navigateTo({ url: "/pages/saved/index" }); },
});
