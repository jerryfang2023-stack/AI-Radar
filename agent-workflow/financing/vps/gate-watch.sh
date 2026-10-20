#!/usr/bin/env bash
set -euo pipefail

# The Hermes cron is a wake-up only. The official supervisor owns the shared
# lock, source review, exact-head CI approval, merge and verified publication.
# A CI success by itself must never become a second publication authority.
HOUR=$(TZ=Asia/Shanghai date +%H)
if (( 10#$HOUR < 8 || 10#$HOUR >= 23 )); then exit 0; fi
STATE=$(systemctl show guanlan-financing.service --property=ActiveState --value)
case "$STATE" in active|activating|reloading) exit 0 ;; esac
if ! sudo -n systemctl start --no-block guanlan-financing.service; then
  printf '融资正式控制器无法启动，请检查 guanlan-financing.service；未执行独立审批或合并。\n' >&2
  exit 1
fi
