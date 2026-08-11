Component({
  properties: {
    title: { type: String, value: "" },
    showBack: { type: Boolean, value: false },
    rightLabel: { type: String, value: "" },
  },
  data: { statusBarHeight: 20 },
  lifetimes: {
    attached() {
      this.setData({ statusBarHeight: getApp().globalData.statusBarHeight || 20 });
    },
  },
  methods: {
    back() { wx.navigateBack(); },
    rightTap() { this.triggerEvent("righttap"); },
  },
});
