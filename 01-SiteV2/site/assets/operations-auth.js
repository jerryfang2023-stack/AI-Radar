(function () {
  const shell = document.querySelector("[data-ops-console]");
  const logoutButton = document.querySelector("[data-ops-logout]");
  if (!shell || !logoutButton) return;

  const csrfCookie = () => document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith("guanlan_ops_csrf="))?.slice("guanlan_ops_csrf=".length) || "";
  const goToLogin = () => window.location.replace("/ops/login/");
  let closing = false;

  async function bootstrap() {
    try {
      const response = await fetch("/ops/api/session", { method: "GET", credentials: "same-origin", cache: "no-store" });
      const payload = await response.json();
      if (closing) return;
      const csrfToken = decodeURIComponent(csrfCookie());
      if (!response.ok || payload?.schemaVersion !== "OPS-AUTH-V1.0" || payload.authenticated !== true || csrfToken.length < 20) throw new Error("invalid session");
      shell.hidden = false;
      document.dispatchEvent(new CustomEvent("operations:authenticated", { detail: { csrfToken } }));
      shell.focus();
    } catch { if (!closing) goToLogin(); }
  }

  async function logout() {
    if (closing) return;
    closing = true;
    const csrfToken = decodeURIComponent(csrfCookie());
    document.dispatchEvent(new Event("operations:logout"));
    shell.hidden = true;
    try { await fetch("/ops/api/logout", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "X-CSRF-Token": csrfToken } }); } catch { /* Redirect still clears the visible local session. */ }
    goToLogin();
  }

  logoutButton.addEventListener("click", () => { void logout(); });
  document.addEventListener("operations:session-expired", () => { void logout(); });
  void bootstrap();
})();
