const { leaderboard, pointRules } = require("../../utils/community-data.js");
const { readExperience } = require("../../utils/experience.js");
const { getCommunity } = require("../../utils/member.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const seasons = [{ id: "total", label: "总积分" }, { id: "season-2", label: "第二季" }, { id: "season-1", label: "第一季" }];

Page({
  data: { mode: "list", season: "total", seasons, totalPoints: 0, totalMembers: 0, totalSessions: 0, leaderboard: [], pointRules, myPoints: 0, myRank: "—", myName: "", experience: false, latestPoints: "—", ledger: [], loading: false, error: "", sessionCount: 0, updatedAt: "—" },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    const preview = readExperience();
    this.setData({
      mode: ["list", "rules", "detail"].includes(options.mode) ? options.mode : "list",
      season: seasons.some((s) => s.id === options.season) ? options.season : "total",
      experience: Boolean(preview), myName: preview ? (preview.profile?.name || "体验用户") : (getCommunity().name || "我的积分"),
      loaded: Boolean(preview) || options.mode === "rules",
    });
    if (this.data.mode !== "rules") return this.refresh();
  },
  onShow() { if (this.data.loaded && !this.data.experience && this.data.mode !== "rules") return this.refresh(); },
  async refresh(options = {}) {
    const season = this.data.season;
    const generation = this._generation = (this._generation || 0) + 1;
    if (this.data.experience) {
      const list = leaderboard.map((entry) => ({ ...entry, ...(entry.memberId === "me" ? { name: this.data.myName, avatar: this.data.myName.slice(0, 1), isMe: true } : {}), ...(season === "season-2" ? { points: 0, rank: "—" } : {}) }));
      const mine = list.find((entry) => entry.isMe);
      this.setData({ leaderboard: list, myPoints: mine?.points || 0, myRank: mine?.rank || "—", totalPoints: 80, totalMembers: list.length, totalSessions: 15, loaded: true, ledger: [] });
      return;
    }
    this.setData({ loading: true, error: "" });
    const timer = setTimeout(() => { if (generation === this._generation && !this.data.loaded) this.setData({ showLoading: true }); }, 180);
    try {
      const apply = (result) => {
        if (generation !== this._generation || season !== this.data.season) return;
        const ledger = result.ledger.map((entry) => ({ ...entry, date: entry.date.slice(0, 10), points: entry.points > 0 ? "+" + entry.points : String(entry.points) }));
        this.setData({ ...result, loaded: true, showLoading: false, ledger, latestPoints: ledger[0]?.points || "—", updatedAt: result.updatedAt.slice(5) || "—" });
      };
      apply(await communityRequest("season-points?season=" + season, { onCached: apply, force: Boolean(options.force) }));
    } catch (error) {
      if (generation === this._generation) this.setData({ error: error.message, loaded: false, leaderboard: [], ledger: [], myPoints: 0, myRank: "—", totalPoints: 0, totalMembers: 0, totalSessions: 0 });
    } finally {
      clearTimeout(timer);
      if (generation === this._generation) this.setData({ loading: false, showLoading: false });
    }
  },
  switchSeason(event) {
    const season = event.currentTarget.dataset.season;
    if (!seasons.some((s) => s.id === season) || season === this.data.season) return;
    this.__shareOptions = { ...this.__shareOptions, season };
    this.setData({ season, leaderboard: [], ledger: [], myPoints: 0, myRank: "—", loaded: false });
    return this.refresh();
  },
  onUnload() { this._generation = (this._generation || 0) + 1; },
  async onPullDownRefresh() { try { if (this.data.mode !== "rules") await this.refresh({ force: true }); } finally { wx.stopPullDownRefresh(); } },
  openRules() { wx.navigateTo({ url: "/pages/community-points/index?mode=rules" }); },
  openDetail() { wx.navigateTo({ url: "/pages/community-points/index?mode=detail&season=" + this.data.season }); },
});
