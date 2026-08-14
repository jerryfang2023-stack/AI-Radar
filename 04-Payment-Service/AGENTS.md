# Guanlan Payment Service

- This service owns Mini Program identities, payment orders, and paid membership entitlements.
- Never commit AppSecret, APIv3 keys, merchant private keys, WeChat Pay public keys, production databases, or access tokens.
- Product prices are server-owned: CNY 30 / 30 days, CNY 168 / 180 days, CNY 300 / 365 days.
- A client payment callback is not proof of payment. Grant entitlement only after a verified WeChat Pay notification or a verified order query.
- Payment notifications must be signature-verified, decrypted, amount-checked, AppID/MchID-checked, and idempotent.
- SQLite is acceptable for the initial scale. Use transactions for order and entitlement updates.
- Community membership is resolved through `COMMUNITY_SERVICE_URL` using `COMMUNITY_SERVICE_TOKEN`. Link an existing member only with a server-verified phone number; never trust a client-supplied phone or name for account merging.
- `users.point_balance` is spendable, `users.point_lifetime` drives the eight growth levels, and `users.community_points` is the latest social-system snapshot. Community corrections update all three by the remote delta; point redemption changes only `point_balance`.
- Community applications submitted through the Mini Program must enter the existing membership review queue; the payment service does not maintain a second application database.
- Run `python -m pytest -q` before deployment.
