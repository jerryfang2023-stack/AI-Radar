#!/bin/bash
set -euo pipefail
test "$#" -eq 1
[[ "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]
test "$(date -d "$1" +%F)" = "$1"
# This root-owned entry accepts a date only, never commands or file paths.
directory="/srv/guanlan-financing-publisher/runtime/$1"
/usr/bin/install -d -o ubuntu -g ubuntu -m 750 "$directory"
/usr/sbin/runuser -u ubuntu -- /opt/guanlan-financing-tools/publish.sh "$1" >"$directory/publisher.log" 2>&1
/bin/cat "$directory/published.json"
