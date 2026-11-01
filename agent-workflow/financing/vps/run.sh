#!/bin/bash
set -euo pipefail
umask 077
export PATH=/opt/guanlan-financing-tools/node/bin:/usr/bin:/bin
case "$(gh api --help)" in
  *--slurp*) ;;
  *) printf '%s\n' 'Financing runtime requires a GitHub CLI supporting gh api --paginate --slurp; install the verified task CLI before running.' >&2; exit 1 ;;
esac
export GUANLAN_FINANCING_RUNTIME=/srv/guanlan-financing/runtime
# gh caches run logs below TMPDIR. The host-wide /tmp cache may belong to
# another operator; keep this service's cache private and independently writable.
export TMPDIR="$GUANLAN_FINANCING_RUNTIME/tmp"
mkdir -p "$TMPDIR"
chmod 700 "$TMPDIR"
# Startup happens before the Node watch loop. Retry only idempotent Git reads,
# so a brief network failure here does not require an operator to wake it again.
git_read() {
  local operation="$1" attempt diagnostic
  shift
  for attempt in 1 2 3; do
    diagnostic=$(mktemp "$TMPDIR/git-read.XXXXXX")
    if "$@" 2>"$diagnostic"; then rm -f -- "$diagnostic"; return 0; fi
    if grep -Eiq 'timed out|timeout|could not resolve|failed to connect|connection reset|TLS|HTTP[^[:cntrl:]]*50[234]' "$diagnostic" && [ "$attempt" -lt 3 ]; then
      printf '{"operation":"%s","attempt":%s,"retryable":true}\n' "$operation" "$attempt" >>"$GUANLAN_FINANCING_RUNTIME/git-read-attempts.jsonl"
      sleep "$((attempt * 5))"
    else
      cat "$diagnostic" >&2
      return 1
    fi
  done
}
export GUANLAN_EVIDENCE_BACKUP_ROOT=/srv/guanlan-financing/private-evidence/store
export HERMES_HOME=/srv/guanlan-financing/hermes-home
export GUANLAN_HERMES_SOURCE=/opt/guanlan-financing-tools/hermes-agent
export PYTHONPATH="$GUANLAN_HERMES_SOURCE"
exec 9>"$GUANLAN_FINANCING_RUNTIME/supervisor.lock"
flock -n 9 || exit 0
cd /srv/guanlan-financing/WaveSight
test -z "$(git status --porcelain --untracked-files=no)"
git_read fetch git fetch --quiet origin main
git checkout --quiet --detach origin/main
lock_hash=$(sha256sum package-lock.json | cut -d' ' -f1)
if [ ! -d node_modules/ajv ] || [ ! -d node_modules/cheerio ] || [ "$(cat "$GUANLAN_FINANCING_RUNTIME/dependencies.sha256" 2>/dev/null || true)" != "$lock_hash" ]; then
  npm ci --ignore-scripts --no-audit --no-fund
  printf '%s\n' "$lock_hash" > "$GUANLAN_FINANCING_RUNTIME/dependencies.sha256"
fi
test -z "$(git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" status --porcelain)"
git_read evidence_pull git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" pull --quiet --ff-only origin main
node agent-workflow/financing/vps-supervisor.mjs "$@"
