const { getReportData, refreshReportData } = require("../../utils/live-data.js");
const { mergeCommunityEssays } = require("../../utils/community-essays.js");
const { syncTabBar } = require("../../utils/tab-bar.js");

const bundledReportIndex = getReportData().index;

Page({
  data: {
    meta: bundledReportIndex.meta,
    activeType: "all",
    activeLabel: "最新观察",
    featured: null,
    reports: [],
  },

  onLoad() {
    this.refresh("all");
    refreshReportData().then(() => this.refresh(this.data.activeType));
  },

  onShow() { syncTabBar(this, 2); },

  refresh(type) {
    const reportIndex = getReportData().index;
    const community = mergeCommunityEssays(reportIndex.reports);
    const editorialReports = reportIndex.reports.filter((item) => item.type !== "community");
    const all = [...community, ...editorialReports].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const reports = type === "all" ? all : type === "community" ? community : editorialReports.filter((item) => item.type === type);
    const labels = { all: "最新观察", community: "社群精华", weekly: "周报", monthly: "月报" };
    this.setData({
      meta: reportIndex.meta,
      activeType: type,
      activeLabel: labels[type],
      featured: reports[0] || null,
      reports: reports.slice(1),
    });
  },

  switchType(event) { this.refresh(event.currentTarget.dataset.type); },
  openReport(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/report-detail/index?id=${id}` });
  },
  openSaved() { wx.navigateTo({ url: "/pages/saved/index" }); },
});
