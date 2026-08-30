const { schedules, archives, getArchive } = require("../../utils/community-data.js");
const { isExperience } = require("../../utils/experience.js");
const sharingPreview = require("../../utils/sharing-preview.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");

Page({
  data: { mode: "list", activeTab: "schedule", schedules: [], archives: [], item: null, speaker: null, error: "", loading: false, sessionCount: 0, speakerCount: 0 },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    this.options = options;
    if (!isExperience()) return this.refresh();
    this.setData({ schedules, archives, sessionCount: archives.length, speakerCount: archives.length * 3 });
    if (options.type === "speaker") {
      const item = getArchive(options.id);
      const speaker = isExperience() ? sharingPreview[options.id]?.speakers?.[Number(options.speaker)] : null;
      this.setData({ mode: "speaker", item, speaker, error: speaker ? "" : "完整实录暂未加载，请稍后重试。" });
      return;
    }
    if (options.type === "archive") this.setData({ mode: "archive", item: getArchive(options.id) });
    else if (options.type === "schedule") this.setData({ mode: "schedule", item: schedules.find((value) => value.id === options.id) || schedules[0] });
    else this.setData({ activeTab: options.tab === "archive" ? "archive" : "schedule" });
  },
  async refresh() {
    const options = this.options || {};
    this.setData({ loading: true, error: "", activeTab: options.tab === "archive" ? "archive" : "schedule" });
    try {
      if (options.type === "archive" || options.type === "speaker") {
        const { item } = await communityRequest(`archives/${encodeURIComponent(options.id)}`);
        const speaker = options.type === "speaker" ? item.speakerDetails[Number(options.speaker)] : null;
        if (options.type === "speaker" && !speaker) throw new Error("此分享不存在");
        this.setData({ mode: options.type, item, speaker });
      } else {
        const result = await communityRequest("program");
        const item = options.type === "schedule" ? result.schedules.find((entry) => entry.id === options.id) : null;
        if (options.type === "schedule" && !item) throw new Error("此排期不存在");
        this.setData({ ...result, mode: item ? "schedule" : "list", item });
      }
    } catch (error) { this.setData({ error: error.message, item: null, speaker: null, archives: [], schedules: [] }); }
    finally { this.setData({ loading: false }); }
  },
  switchTab(event) { this.setData({ activeTab: event.currentTarget.dataset.tab }); },
  openSchedule(event) { wx.navigateTo({ url: `/pages/community-program/index?type=schedule&id=${event.currentTarget.dataset.id}` }); },
  openArchive(event) { wx.navigateTo({ url: `/pages/community-program/index?type=archive&id=${event.currentTarget.dataset.id}` }); },
  openSpeaker(event) { wx.navigateTo({ url: `/pages/community-program/index?type=speaker&id=${this.data.item.id}&speaker=${event.currentTarget.dataset.index}` }); },
  back() { wx.navigateBack({ fail: () => wx.switchTab({ url: "/pages/community/index" }) }); },
});
