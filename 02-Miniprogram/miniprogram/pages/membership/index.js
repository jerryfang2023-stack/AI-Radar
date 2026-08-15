const { MEMBER_RIGHTS, getMembership, getWallet, syncMembership } = require("../../utils/member.js");
const { fetchMembership } = require("../../utils/payment.js");

Page({
  data: {
    rights: MEMBER_RIGHTS,
    membership: {},
    points: 0,
    registrationOpen: false,
  },
  onShow() {
    this.setData({ membership: getMembership(), points: getWallet().balance });
    this.refreshRemoteMembership();
  },
  openGrowth() { wx.navigateTo({ url: "/pages/growth/index" }); },
  async refreshRemoteMembership() {
    try {
      const result = await fetchMembership();
      if (result.membership) this.setData({ membership: syncMembership(result.membership) });
    } catch (_) {
      // Keep the last confirmed local snapshot when the account service is unavailable.
    }
  },
  openRegistration() { this.setData({ registrationOpen: true }); },
  closeRegistration() { this.setData({ registrationOpen: false }); },
  registrationCompleted(event) {
    this.setData({ membership: event.detail.membership });
  },
  continueAfterRegistration(event) {
    this.setData({ registrationOpen: false, membership: event.detail.membership });
  },
});
