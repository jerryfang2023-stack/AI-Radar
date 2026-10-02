#!/usr/bin/python3
"""Local transport for unmodified accepted publisher commits on their VPS."""
import os
from pathlib import Path
import re
import shutil
import sys

args = sys.argv[1:]
values = []
while args:
    current = args.pop(0)
    if current == '-o':
        if not args:
            raise SystemExit('missing_transport_option')
        args.pop(0)
    elif current != '-q':
        values.append(current)
if os.environ.get('GUANLAN_LOCAL_PUBLICATION') != '1':
    raise SystemExit('local_transport_not_enabled')
if Path(sys.argv[0]).name == 'ssh':
    if len(values) != 2 or values[0] != 'hermes-vps':
        raise SystemExit('local_transport_host_rejected')
    os.execv('/bin/sh', ['sh', '-c', values[1]])
else:
    if len(values) < 2 or not re.fullmatch(r'hermes-vps:/tmp/(?:[A-Za-z0-9._-]+)?', values[-1]):
        raise SystemExit('local_transport_destination_rejected')
    destination = values.pop()[len('hermes-vps:'):]
    if not destination.endswith('/') and len(values) != 1:
        raise SystemExit('local_transport_multiple_sources')
    for source in values:
        target = Path(destination) / Path(source).name if destination.endswith('/') else Path(destination)
        with open(source, 'rb') as incoming, target.open('xb') as outgoing:
            shutil.copyfileobj(incoming, outgoing)
