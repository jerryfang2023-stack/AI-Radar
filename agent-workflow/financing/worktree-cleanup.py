#!/usr/bin/env python3
"""Retire only registered, published review checkouts; preserve unknown work."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], text=True).strip()


def active_checkout(target):
    proc = Path('/proc')
    if not proc.exists():
        raise RuntimeError('process_inspection_unavailable')
    for entry in proc.iterdir():
        if not entry.name.isdigit():
            continue
        try:
            cwd = (entry / 'cwd').resolve(strict=True)
        except (OSError, RuntimeError):
            continue
        if cwd == target or target in cwd.parents:
            return True
    return False


def retire_checkout(repo, directory, entry, accepted='origin/main'):
    directory, repo = Path(directory).resolve(), Path(repo).resolve()
    target = Path(entry['checkout'])
    if not target.exists():
        return {'status': 'already_removed', 'checkout': str(target)}
    if not target.is_absolute() or target.resolve() != target or not target.is_relative_to(directory):
        raise RuntimeError('cleanup_path_rejected')
    relative = target.relative_to(directory).as_posix()
    if not re.fullmatch(r'review-[a-f0-9]{12}-[a-f0-9]{12}/attempt-[1-9][0-9]*/checkout', relative):
        raise RuntimeError('cleanup_unregistered_layout')
    if not re.fullmatch(r'[a-f0-9]{40}', entry.get('head', '')) or git(target, 'rev-parse', 'HEAD') != entry['head']:
        raise RuntimeError('cleanup_head_changed')
    common = lambda cwd: Path(git(cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir')).resolve()
    if common(target) != common(repo):
        raise RuntimeError('cleanup_repository_changed')
    subprocess.run(['git', '-C', str(repo), 'merge-base', '--is-ancestor', entry['head'], accepted], check=True, capture_output=True)
    if git(target, 'status', '--porcelain', '--untracked-files=no'):
        return {'status': 'preserved_dirty', 'checkout': str(target)}
    if active_checkout(target):
        return {'status': 'preserved_active', 'checkout': str(target)}
    raw = subprocess.check_output(['git', '-C', str(target), 'ls-files', '--others', '-z'])
    names = [name.decode('utf-8') for name in raw.split(b'\0') if name]
    archive = directory / ('preserved-' + hashlib.sha256(relative.encode()).hexdigest()[:16] + '.tgz')
    if names:
        if archive.exists():
            return {'status': 'preserved_existing_archive', 'checkout': str(target)}
        for name in names:
            item = target / name
            if Path(name).is_absolute() or '..' in Path(name).parts or not item.parent.resolve().is_relative_to(target):
                raise RuntimeError('cleanup_untracked_path_rejected')
            if not item.is_symlink() and not item.is_file():
                raise RuntimeError('cleanup_untracked_type_rejected')
        with tarfile.open(archive, 'w:gz', dereference=False) as tar:
            for name in names:
                tar.add(target / name, arcname=name, recursive=False)
        with tarfile.open(archive) as tar:
            if {member.name for member in tar.getmembers()} != set(names):
                raise RuntimeError('cleanup_archive_members_mismatch')
            for name in names:
                item, member = target / name, tar.getmember(name)
                if item.is_symlink():
                    if not member.issym() or member.linkname != os.readlink(item):
                        raise RuntimeError('cleanup_archive_link_mismatch')
                else:
                    if not member.isfile():
                        raise RuntimeError('cleanup_archive_type_mismatch')
                    with tar.extractfile(member) as archived, item.open('rb') as original:
                        if hashlib.file_digest(archived, 'sha256').digest() != hashlib.file_digest(original, 'sha256').digest():
                            raise RuntimeError('cleanup_archive_hash_mismatch')
    receipt = {'checkout': str(target), 'head': entry['head'], 'preserved_files': len(names),
               'archive': str(archive) if names else None,
               'archive_sha256': hashlib.sha256(archive.read_bytes()).hexdigest() if names else None,
               'status': 'archive_verified_before_remove'}
    receipt_file = directory / (archive.stem + '.receipt.json')
    receipt_file.write_text(json.dumps(receipt, indent=2), encoding='utf-8')
    for name in names:
        (target / name).unlink()
    # No recursive forced deletion. Git removes only an ordinary clean worktree.
    subprocess.run(['git', '-C', str(repo), 'worktree', 'remove', str(target)], check=True, capture_output=True)
    receipt['status'] = 'removed'
    receipt_file.write_text(json.dumps(receipt, indent=2), encoding='utf-8')
    return receipt


def cleanup(repo, directory):
    directory = Path(directory).resolve()
    registry = directory / 'temporary-checkouts.json'
    entries = json.loads(registry.read_text(encoding='utf-8')) if registry.exists() else []
    results = []
    for entry in entries:
        try:
            results.append(retire_checkout(repo, directory, entry))
        except Exception as error:
            results.append({'checkout': entry.get('checkout'), 'status': 'preserved', 'reason': str(error)[:1000]})
    report = {'verified_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'results': results}
    (directory / 'cleanup.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True)
    parser.add_argument('--directory', required=True)
    args = parser.parse_args()
    print(json.dumps(cleanup(args.repo, args.directory)))
