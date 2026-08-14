# Guanlan Payment Service

- This service owns Mini Program identities, payment orders, and paid membership entitlements.
- Never commit AppSecret, APIv3 keys, merchant private keys, WeChat Pay public keys, production databases, or access tokens.
- Product prices are server-owned: CNY 30 / 30 days, CNY 168 / 180 days, CNY 300 / 365 days.
- A client payment callback is not proof of payment. Grant entitlement only after a verified WeChat Pay notification or a verified order query.
- Payment notifications must be signature-verified, decrypted, amount-checked, AppID/MchID-checked, and idempotent.
- SQLite is acceptable for the initial scale. Use transactions for order and entitlement updates.
- Phone authorization codes must be exchanged server-side and never persisted. Store only a masked display value and an HMAC digest keyed by the service secret; do not store or return raw phone numbers.
- Run `python -m pytest -q` before deployment.
