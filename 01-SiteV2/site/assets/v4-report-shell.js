(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const sidebar = document.querySelector("[data-sidebar]");

  toggle?.addEventListener("click", () => {
    const open = sidebar?.dataset.open !== "true";
    if (sidebar) sidebar.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  sidebar?.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    sidebar.dataset.open = "false";
    toggle?.setAttribute("aria-expanded", "false");
  });
})();
