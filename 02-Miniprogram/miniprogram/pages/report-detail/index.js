const { recordBehavior } = require("../../utils/member.js");
const { getReportData, refreshReportData } = require("../../utils/live-data.js");
const { getCommunityEssays } = require("../../utils/community-essays.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

Page({
  data: { report: null, sharedEntry: false, registrationOpen: false },
  onLoad(options) {
    this.reportId = options.id;
    this.isCommunityEssay = Boolean(getCommunityEssays().details[this.reportId]);
    const sharedEntry = options.from === "share";
    if (!sharedEntry && !this.isCommunityEssay) {
      const accessState = getAccessState();
      if (accessState === "unregistered") {
        this.entryGate = true;
        this.setData({ registrationOpen: true });
      }
      if (accessState === "expired") setTimeout(() => openMembership(), 0);
    }
    this.setData({ sharedEntry });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const bundled = getCommunityEssays().details[this.reportId] || getReportData().details[this.reportId];
    if (bundled) this.render(bundled);
    refreshReportData().then((state) => {
      const report = getCommunityEssays().details[this.reportId] || state.details[this.reportId];
      if (report) this.render(report);
      else if (!this.data.report) {
        wx.showToast({ title: "报告不存在", icon: "none" });
        setTimeout(() => wx.navigateBack(), 500);
      }
    });
  },
  render(report) {
    if (!this.browseRecorded && (this.isCommunityEssay || getAccessState() === "active")) {
      recordBehavior("browse", `report:${report.id}`);
      this.browseRecorded = true;
    }
    this.setData({ report });
  },
  closeRegistration() {
    this.pendingSectionUrl = "";
    this.setData({ registrationOpen: false });
    if (!this.entryGate) return;
    this.entryGate = false;
    if (getCurrentPages().length > 1) wx.navigateBack();
    else wx.switchTab({ url: "/pages/watchlist/index" });
  },
  continueAfterRegistration() {
    const url = this.pendingSectionUrl;
    this.entryGate = false;
    this.pendingSectionUrl = "";
    this.setData({ registrationOpen: false });
    if (!this.browseRecorded && this.data.report) {
      recordBehavior("browse", `report:${this.data.report.id}`);
      this.browseRecorded = true;
    }
    if (url) wx.switchTab({ url });
  },
  onShareAppMessage() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", path: `/pages/report-detail/index?id=${report?.id || ""}&from=share` };
  },
  onShareTimeline() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 商业观察", query: `id=${report?.id || ""}&from=share` };
  },
  switchSection(event) {
    const url = event.currentTarget.dataset.url;
    const accessState = getAccessState();
    if (accessState === "active") {
      wx.switchTab({ url });
      return;
    }
    if (accessState === "expired") {
      openMembership();
      return;
    }
    this.pendingSectionUrl = url;
    this.setData({ registrationOpen: true });
  },
});
