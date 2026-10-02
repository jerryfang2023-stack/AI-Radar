#!/bin/bash
set -euo pipefail
umask 077
export PATH=/opt/guanlan-financing-tools/node/bin:/usr/bin:/bin
export GUANLAN_FINANCING_RUNTIME=/srv/guanlan-financing/runtime
export GUANLAN_EVIDENCE_BACKUP_ROOT=/srv/guanlan-financing/private-evidence/store
export HERMES_HOME=/srv/guanlan-financing/hermes-home
export GUANLAN_HERMES_SOURCE=/opt/guanlan-financing-tools/hermes-agent
export PYTHONPATH="$GUANLAN_HERMES_SOURCE"
exec 9>"$GUANLAN_FINANCING_RUNTIME/supervisor.lock"
flock -n 9 || exit 0
cd /srv/guanlan-financing/WaveSight
test -z "$(git status --porcelain --untracked-files=no)"
git fetch --quiet origin main
git checkout --quiet --detach origin/main
git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" pull --quiet --ff-only origin main
node agent-workflow/financing/vps-supervisor.mjs "$@"
