const { recordBehavior } = require("../../utils/member.js");
const { getReportData, getCommunityDetail } = require("../../utils/live-data.js");
const { getCommunityEssays } = require("../../utils/community-essays.js");
const { getAccessState } = require("../../utils/access.js");
const { resolveDetailAccess, requestLockedContent } = require("../../utils/metered-access.js");
const { fetchProtectedContent } = require("../../utils/payment.js");

Page({
  data: { report: null, sharedEntry: false, registrationOpen: false, contentLocked: false, lockReason: "", loading: false, loadError: "" },
  onLoad(options) {
    this.reportId = options.id;
    this.setData(resolveDetailAccess(`report:${this.reportId || "unknown"}`));
    const remotePreview = getReportData().index.reports.find((item) => item.id === this.reportId || item.detailId === this.reportId);
    this.isCommunityEssay = /^community-essay-/.test(String(this.reportId || ""))
      || remotePreview?.contentType === "community-essay"
      || Boolean(getCommunityEssays().details[this.reportId]);
    const sharedEntry = options.from === "share";
    this.setData({ sharedEntry });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const preview = remotePreview || getCommunityEssays().details[this.reportId];
    if (preview) this.render(preview);
    this.verifyServerAccess();
  },
  async verifyServerAccess() {
    if (this.data.loading) return;
    if (!this.reportId) {
      this.setData({ loadError: "文章地址无效，请返回生态栏目" });
      return;
    }
    this.setData({ loading: true, loadError: "" });
    try {
      const report = this.isCommunityEssay
        ? await getCommunityDetail(this.reportId)
        : await fetchProtectedContent("report", this.reportId);
      if (!report?.title || !Array.isArray(report.blocks) || !report.blocks.some((block) => block.text)) throw new Error("REPORT_BODY_MISSING");
      this.render(report);
      this.setData({ contentLocked: false, lockReason: this.isCommunityEssay ? "public" : "server" });
    } catch (error) {
      if (error.statusCode === 401 || error.statusCode === 403 || error.code === "MEMBERSHIP_REQUIRED" || error.code === "AUTH_INVALID") {
        this.setData({ contentLocked: true, lockReason: getAccessState() === "expired" ? "expired" : "unregistered" });
      } else {
        this.setData({ loadError: "正文暂时无法读取" });
      }
    } finally {
      this.setData({ loading: false });
    }
  },
  render(report) {
    if (!this.browseRecorded && (this.isCommunityEssay || getAccessState() === "active")) {
      recordBehavior("browse", `report:${report.id}`);
      this.browseRecorded = true;
    }
    this.setData({ report });
  },
  unlockContent() { requestLockedContent(this); },
  closeRegistration() { this.pendingAction = ""; this.setData({ registrationOpen: false }); },
  continueAfterRegistration() {
    const unlock = this.pendingAction === "content";
    this.pendingAction = "";
    this.setData({ registrationOpen: false });
    if (unlock) return this.verifyServerAccess();
  },
  onShareAppMessage() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 行业观察", path: `/pages/report-detail/index?id=${report?.id || ""}&from=share` };
  },
  onShareTimeline() {
    const report = this.data.report;
    return { title: report?.title || "观澜 AI 行业观察", query: `id=${report?.id || ""}&from=share` };
  },
  switchSection(event) {
    const url = event.currentTarget.dataset.url;
    wx.switchTab({ url });
  },
});
