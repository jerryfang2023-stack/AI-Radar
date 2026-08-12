Component({
  properties: {
    title: { type: String, value: "" },
    showBack: { type: Boolean, value: false },
    rightLabel: { type: String, value: "" },
  },
  data: { statusBarHeight: 20, rightInset: 96, tabSafeHeight: 80, menuTop: 26, menuHeight: 32 },
  lifetimes: {
    attached() {
      const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      this.setData({
        statusBarHeight: getApp().globalData.statusBarHeight || 20,
        rightInset: menu?.left ? windowInfo.windowWidth - menu.left + 6 : 96,
        tabSafeHeight: menu?.bottom ? menu.bottom + 8 : (windowInfo.statusBarHeight || 20) + 52,
        menuTop: menu?.top || (windowInfo.statusBarHeight || 20) + 6,
        menuHeight: menu?.height || 32,
      });
    },
  },
  methods: {
    back() { wx.navigateBack(); },
    rightTap() { this.triggerEvent("righttap"); },
  },
});
