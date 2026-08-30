const { leaderboard, pointRules } = require("../../utils/community-data.js");
const { getCommunity } = require("../../utils/member.js");
const { readExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const { readCommunityPage } = require("../../utils/community-loading.js");

Page({
  data: { mode: "list", leaderboard: [], pointRules, myPoints: 0, myRank: "—", myName: "", experience: false, latestPoints: "—", ledger: [], loading: false, error: "", sessionCount: 0, updatedAt: "—" },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    const preview = readExperience();
    const community = preview ? { name: preview.profile.name || "体验用户", points: 80 } : getCommunity();
    const list = preview ? leaderboard.map((entry) => entry.memberId === "me" ? { ...entry, name: community.name, avatar: community.name.slice(0, 1), isMe: true } : entry) : [];
    const mine = list.find((entry) => entry.isMe);
    this.setData({
      mode: options.mode || "list", experience: Boolean(preview), leaderboard: list, loaded: Boolean(preview) || options.mode === "rules",
      myName: community.name || "我的积分", myPoints: Number(community.points) || 0, myRank: mine ? mine.rank : "—",
      latestPoints: preview ? "+10" : "—",
      ledger: preview ? [{ date: "08.27", title: "关键提问 · 体验记录", points: "+10" }, { date: "08.25", title: "有效互动 · 体验记录", points: "+6" }] : [],
    });
    if (!preview && this.data.mode !== "rules") return this.refresh();
  },
  onShow() { if (this.data.loaded && !this.data.experience && this.data.mode !== "rules") return this.refresh(); },
  refresh() {
    return readCommunityPage(this, async () => {
      const apply = (result) => {
        const ledger = result.ledger.map((entry) => ({ ...entry, date: entry.date.slice(0, 10), points: entry.points > 0 ? `+${entry.points}` : String(entry.points) }));
        this.setData({ ...result, loaded: true, showLoading: false, ledger, latestPoints: ledger[0]?.points || "—", updatedAt: result.updatedAt.slice(5) || "—" });
      };
      apply(await communityRequest("points", { onCached: apply }));
    }, () => this.setData({ leaderboard: [], ledger: [], myPoints: 0, myRank: "—", latestPoints: "—" }));
  },
  openRules() { wx.navigateTo({ url: "/pages/community-points/index?mode=rules" }); },
  openDetail() { wx.navigateTo({ url: "/pages/community-points/index?mode=detail" }); },
});
