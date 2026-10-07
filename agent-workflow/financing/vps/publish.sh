#!/bin/bash
set -euo pipefail
umask 022
export PATH=/opt/guanlan-financing-tools/local-publish/bin:/opt/guanlan-financing-tools/duckdb:/opt/guanlan-financing-tools/node/bin:/usr/bin:/bin
export GUANLAN_LOCAL_PUBLICATION=1
export GUANLAN_VAULT_ROOT=/srv/guanlan-financing-publisher/vault
export GUANLAN_EVIDENCE_BACKUP_ROOT=/srv/guanlan-financing-publisher/private-evidence
export GUANLAN_FUNDING_PORTAL_REPO=/srv/guanlan-financing-publisher/Guanlan-Funding-Portal
export LOCALAPPDATA=/srv/guanlan-financing-publisher/state
set -a
source /srv/guanlan-financing-publisher/provider.env
set +a
exec 9>/srv/guanlan-financing-publisher/runtime/publisher.lock
flock -n 9 || exit 75
cd /srv/guanlan-financing-publisher/WaveSight
test -z "$(git status --porcelain --untracked-files=no)"
git fetch --quiet origin main
git checkout --quiet --detach origin/main
git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" pull --quiet --ff-only origin main
lock_hash=$(sha256sum package-lock.json | cut -d' ' -f1)
if [ ! -d node_modules/ajv ] || [ ! -d node_modules/cheerio ] || [ "$(cat ../runtime/dependencies.sha256 2>/dev/null || true)" != "$lock_hash" ]; then
  npm ci --ignore-scripts --no-audit --no-fund
  printf '%s\n' "$lock_hash" > ../runtime/dependencies.sha256
fi
test -z "$(git -C "$GUANLAN_FUNDING_PORTAL_REPO" status --porcelain --untracked-files=no)"
git -C "$GUANLAN_FUNDING_PORTAL_REPO" fetch --quiet origin main
git -C "$GUANLAN_FUNDING_PORTAL_REPO" pull --quiet --ff-only origin main
portal_lock_hash=$(sha256sum "$GUANLAN_FUNDING_PORTAL_REPO/package-lock.json" | cut -d' ' -f1)
if [ ! -d "$GUANLAN_FUNDING_PORTAL_REPO/node_modules/jsdom" ] || [ "$(cat ../runtime/portal-dependencies.sha256 2>/dev/null || true)" != "$portal_lock_hash" ]; then
  npm ci --prefix "$GUANLAN_FUNDING_PORTAL_REPO" --ignore-scripts --no-audit --no-fund
  printf '%s\n' "$portal_lock_hash" > ../runtime/portal-dependencies.sha256
fi
node agent-workflow/financing/publish.mjs --date="$1" --runtime-dir="/srv/guanlan-financing-publisher/runtime/$1"
