const { readExperience } = require("../../utils/experience.js");
const { requireCommunityMember, communityGate } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const { readCommunityPage } = require("../../utils/community-loading.js");

const formatAmount = (value, fallback) => value == null ? fallback : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const displayDate = (value) => value ? value.replace(/-0(\d)/g, "-$1") : "待定";

Page({
  ...communityGate,
  data: { pool: null, reward: null, poolRules: "", poolAmount: "待公布", rewardAmount: "—", startDate: "待定", endDate: "待定", myPoints: 0, rulesOpen: true, loaded: false, error: "", experience: false },
  async onLoad(options = {}) {
    this.communityEntryOptions = options;
    if (!await requireCommunityMember(undefined, this)) return;
    this.setData({ experience: Boolean(readExperience()) });
    return this.refresh();
  },
  onShow() { if (this.data.communityAccessBlocked) return this.onLoad(this.communityEntryOptions || {}); if (this.data.loaded) return this.refresh(); },
  refresh(options = {}) {
    if(this.data.communityAccessBlocked)return Promise.resolve();
    if (this.data.experience) {
      this.setData({ pool: { label: "第二季", status: "draft", amount: null, unit: "Token", start: "2026-09-14", rules: "" }, reward: { amount: null, status: "pending" }, startDate: "2026-9-14", endDate: "待定", loaded: true });
      return Promise.resolve();
    }
    return readCommunityPage(this, async () => {
      const apply = (result) => this.setData({ ...result, poolRules: result.pool.amount >= 1000 ? String(result.pool.rules || "").replace(new RegExp("\\b" + result.pool.amount + "\\b", "g"), formatAmount(result.pool.amount, "待公布")) : result.pool.rules, poolAmount: formatAmount(result.pool.amount, "待公布"), rewardAmount: formatAmount(result.reward.amount, "—"), loaded: true, startDate: displayDate(result.pool.start), endDate: displayDate(result.pool.end), issuedDate: result.reward.issuedAt.slice(0, 10) });
      apply(await communityRequest("token-benefits", { force: Boolean(options.force), onCached: apply }));
    }, () => this.setData({ pool: null, reward: null, myPoints: 0 }));
  },
  async onPullDownRefresh() { try { await this.refresh({ force: true }); } finally { wx.stopPullDownRefresh(); } },
  toggleRules() { this.setData({ rulesOpen: !this.data.rulesOpen }); },
});
