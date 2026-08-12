Component({
  properties: {
    title: { type: String, value: "" },
    showBack: { type: Boolean, value: false },
    rightLabel: { type: String, value: "" },
  },
  data: { statusBarHeight: 20, rightInset: 96 },
  lifetimes: {
    attached() {
      const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      this.setData({
        statusBarHeight: getApp().globalData.statusBarHeight || 20,
        rightInset: menu?.left ? windowInfo.windowWidth - menu.left + 6 : 96,
      });
    },
  },
  methods: {
    back() { wx.navigateBack(); },
    rightTap() { this.triggerEvent("righttap"); },
  },
});
