const TABS = [
  { pagePath: "/pages/terminal/index", text: "融资" },
  { pagePath: "/pages/market/index", text: "生态" },
  { pagePath: "/pages/watchlist/index", text: "观察" },
  { pagePath: "/pages/profile/index", text: "我的" },
];

Component({
  data: {
    selected: 0,
    list: TABS,
  },

  lifetimes: {
    attached() { this.syncSelected(); },
  },

  pageLifetimes: {
    show() { this.syncSelected(); },
  },

  methods: {
    syncSelected() {
      const pages = getCurrentPages();
      const route = pages.length ? `/${pages[pages.length - 1].route}` : "";
      const selected = TABS.findIndex((item) => item.pagePath === route);
      if (selected >= 0 && selected !== this.data.selected) this.setData({ selected });
    },

    switchTab(event) {
      const { index, path } = event.currentTarget.dataset;
      if (index === this.data.selected) return;
      this.setData({ selected: index });
      wx.switchTab({ url: path });
    },
  },
});
