const { readExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const { readCommunityPage } = require("../../utils/community-loading.js");

Page({
  data: { pool: null, reward: null, myPoints: 0, rulesOpen: false, loaded: false, error: "", experience: false },
  onLoad() {
    if (!requireCommunityMember()) return;
    this.setData({ experience: Boolean(readExperience()) });
    return this.refresh();
  },
  onShow() { if (this.data.loaded) return this.refresh(); },
  refresh(options = {}) {
    if (this.data.experience) {
      this.setData({ pool: { label: "第二季", status: "draft", amount: null, unit: "Token", start: "2026-09-14", rules: "" }, reward: { amount: null, status: "pending" }, loaded: true });
      return Promise.resolve();
    }
    return readCommunityPage(this, async () => {
      const apply = (result) => this.setData({ ...result, loaded: true, issuedDate: result.reward.issuedAt.slice(0, 10) });
      apply(await communityRequest("token-benefits", { force: Boolean(options.force), onCached: apply }));
    }, () => this.setData({ pool: null, reward: null, myPoints: 0 }));
  },
  async onPullDownRefresh() { try { await this.refresh({ force: true }); } finally { wx.stopPullDownRefresh(); } },
  toggleRules() { this.setData({ rulesOpen: !this.data.rulesOpen }); },
});
