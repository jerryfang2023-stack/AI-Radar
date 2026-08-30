# Guanlan Payment Service

- This service owns Mini Program identities, payment orders, and paid membership entitlements.
- Never commit AppSecret, APIv3 keys, merchant private keys, WeChat Pay public keys, production databases, or access tokens.
- Product prices and virtual product IDs are server-owned: `membership_30d` at CNY 30 / 30 days, `membership_180d` at CNY 168 / 180 days, and `membership_365d` at CNY 300 / 365 days.
- New cash orders use WeChat Mini Program virtual payment in direct-goods mode. They never auto-renew and allow full refunds within 15 days.
- A client payment callback is not proof of payment. Grant entitlement only after a verified WeChat virtual-payment notification or a verified XPay order query.
- Payment notifications must be signature-verified, decrypted, amount-checked, AppID/MchID-checked, and idempotent.
- SQLite is acceptable for the initial scale. Use transactions for order and entitlement updates.
- Community membership is resolved through `COMMUNITY_SERVICE_URL` using `COMMUNITY_SERVICE_TOKEN`. Link an existing member only with a server-verified phone number; never trust a client-supplied phone or name for account merging.
- `users.point_balance` is spendable, `users.point_lifetime` drives the eight growth levels, and `users.community_points` is the latest social-system snapshot. Community corrections update all three by the remote delta; point redemption changes only `point_balance`.
- Community applications submitted through the Mini Program must enter the existing membership review queue; the payment service does not maintain a second application database.
- Phone authorization codes must be exchanged server-side and never persisted. Store only a masked display value and an HMAC digest keyed by the service secret; do not store or return raw phone numbers.
- Run `python -m pytest -q` before deployment.
- Application analytics stores anonymous visitor/session IDs and server-owned conversion facts. Never collect raw phone numbers, WeChat identifiers, IP addresses, or client-asserted payment success in `analytics_events`; admin summaries require `ANALYTICS_ADMIN_TOKEN` from the runtime environment. The user-authorized passwordless `GET /api/v1/analytics/summary` exposes aggregates only, never raw identities, events, or order details; it must not weaken admin, membership, or payment authentication.
