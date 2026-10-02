import fs from 'node:fs';
import path from 'node:path';

// Explicit opt-in for publishers running on the deployment host. Keep the
// existing publication checks, locking and rollback in their owning scripts.
export function localVpsTransport(command, args, options, spawn, {enabled = process.env.GUANLAN_LOCAL_PUBLICATION === '1', host = 'hermes-vps'} = {}) {
  if (!enabled || !['ssh', 'scp'].includes(command)) return null;
  if (process.platform === 'win32') throw new Error('local_publication_requires_linux');
  const values = args.filter((value, index) => value !== '-q' && !(index > 0 && args[index - 1] === '-o') && value !== '-o');
  if (command === 'ssh') {
    if (values.length !== 2 || values[0] !== host) throw new Error('local_publication_host_rejected');
    return spawn('/bin/sh', ['-c', values[1]], options);
  }
  const destination = values.at(-1);
  const match = destination?.match(/^([^:]+):(\/tmp\/(?:[A-Za-z0-9._-]+)?)$/u);
  if (!match || match[1] !== host || values.length < 2) throw new Error('local_publication_destination_rejected');
  const sources = values.slice(0, -1);
  if (!match[2].endsWith('/') && sources.length !== 1) throw new Error('local_publication_multiple_sources');
  for (const source of sources) {
    const target = match[2].endsWith('/') ? path.join(match[2], path.basename(source)) : match[2];
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('local_publication_symlink_rejected');
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  }
  return {status: 0, stdout: '', stderr: ''};
}
