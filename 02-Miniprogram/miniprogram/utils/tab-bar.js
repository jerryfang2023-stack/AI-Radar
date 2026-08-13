function syncTabBar(page, selected) {
  const tabBar = typeof page.getTabBar === "function" ? page.getTabBar() : null;
  if (tabBar) tabBar.setData({ selected });
}

module.exports = { syncTabBar };
