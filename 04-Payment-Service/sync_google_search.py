"""Production timer entry point; no browser or administrator session required."""
from app import create_app

if __name__ == "__main__":
    app = create_app()
    connector = app.extensions["google_search_console"]
    ran = connector.sync_due()
    state = connector.status()
    # Only fixed status values; never log upstream payloads, credentials or tokens.
    print("Google Search Console:", state["status"], "attempted" if ran else "idle")
    if ran and state["status"] in {"failed", "reauthorize"}:
        raise SystemExit(1)
