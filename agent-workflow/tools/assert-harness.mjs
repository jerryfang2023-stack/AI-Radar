#!/usr/bin/env node
// Read-only reference audit. Registered check commands are never evaluated.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const layers = ['rules', 'design', 'execution', 'closure'];
export function safeTarget(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || path.posix.isAbsolute(relative)
      || /^[A-Za-z]:/u.test(relative) || relative.split('/').includes('..')) throw Error('unsafe relative path');
  const base = path.resolve(root), target = path.resolve(base, relative);
  const inside = (p) => p === base || p.startsWith(base + path.sep);
  if (!inside(target)) throw Error('path escapes root');
  if (fs.existsSync(target) && fs.existsSync(base)) {
    const actualBase = fs.realpathSync(base), actual = fs.realpathSync(target);
    if (actual !== actualBase && !actual.startsWith(actualBase + path.sep)) throw Error('link escapes root');
  }
  return target;
}

export function auditHarness(manifest, { roots = {}, modules, evidence = {} } = {}) {
  const errors = [], warnings = [], entries = [], ids = new Set();
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.entries) || !manifest.entries.length
      || !Array.isArray(manifest.rootIds)) return { ok: false, errors: ['Invalid Harness manifest'], warnings, entries };
  const moduleMap = new Map((modules || []).map(m => [m.id, m]));
  for (const item of manifest.entries) {
    const issues = [], unresolved = [];
    if (!/^H-[a-z0-9-]+$/u.test(item.id || '') || ids.has(item.id)) issues.push('Invalid or duplicate ID');
    ids.add(item.id);
    for (const field of ['moduleId', 'title', 'acceptance', 'recovery', 'evidenceRequirement']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) issues.push(`Missing ${field}`);
    }
    if (!['current', 'historical', 'retired'].includes(item.lifecycle)) issues.push('Invalid lifecycle');
    if (!item.check?.command || !['explicit-only', 'manual-review'].includes(item.check.mode)) issues.push('Invalid check descriptor');
    const cwd = String(item.check?.cwd || '').match(/^([a-z-]+):(.+)$/u);
    if (!cwd || !manifest.rootIds.includes(cwd[1])) issues.push('Invalid check cwd');
    else {
      try { safeTarget(roots[cwd[1]] || '.', cwd[2]); } catch { issues.push('Unsafe check cwd'); }
    }
    if (!Array.isArray(item.tracking)) issues.push('tracking must be an array');
    const module = moduleMap.get(item.moduleId);
    if (modules && (!module || !module.owner)) issues.push('Unknown module or missing responsible role');
    const refs = Array.isArray(item.refs) ? item.refs : [];
    for (const layer of layers) if (!refs.some(r => r.layer === layer)) issues.push(`Missing ${layer} mapping`);
    const resolved = refs.map(ref => {
      if (!layers.includes(ref.layer) || !manifest.rootIds.includes(ref.root)
          || !['source', 'mirror', 'generated', 'evidence'].includes(ref.kind)) {
        issues.push('Invalid reference metadata'); return { ...ref, availability: 'invalid' };
      }
      try {
        // Validate syntax even when an external checkout is not mounted in CI.
        safeTarget(roots[ref.root] || '.', ref.path);
        if (!roots[ref.root]) { unresolved.push(ref.root); return { ...ref, availability: 'unavailable' }; }
        const absolute = safeTarget(roots[ref.root], ref.path);
        const exists = fs.existsSync(absolute);
        if (!exists) issues.push(`Missing reference: ${ref.root}:${ref.path}`);
        return { ...ref, absolute, availability: exists ? 'present' : 'missing' };
      } catch (e) { issues.push(`Unsafe reference ${ref.root}:${ref.path}: ${e.message}`); return { ...ref, availability: 'invalid' }; }
    });
    const evidenceRefs = (evidence[item.id] || []).map(ref => {
      try {
        if (!manifest.rootIds.includes(ref.root) || !roots[ref.root]) return { ...ref, availability: 'unavailable' };
        const absolute = safeTarget(roots[ref.root], ref.path);
        return { ...ref, absolute, availability: fs.existsSync(absolute) ? 'present' : 'missing' };
      } catch { return { ...ref, availability: 'invalid' }; }
    });
    for (const ref of evidenceRefs) if (ref.availability !== 'present') warnings.push(`${item.id}: evidence ${ref.availability}: ${ref.path}`);
    if (unresolved.length) warnings.push(`${item.id}: external roots unavailable: ${[...new Set(unresolved)].join(', ')}`);
    errors.push(...issues.map(s => `${item.id}: ${s}`));
    entries.push({ ...item, refs: resolved, evidenceRefs, owner: module?.owner || '见模块登记',
      moduleName: module?.name || item.moduleId, issues,
      status: issues.length ? '关联错误' : unresolved.length ? '外部待核验' : '关联完整',
      acceptanceStatus: '业务验收需查证据',
    });
  }
  for (const module of modules || []) {
    if (!entries.some(e => e.moduleId === module.id)) errors.push(`Module has no Harness mapping: ${module.id}`);
  }
  return { ok: errors.length === 0, errors, warnings, entries };
}

function main() {
  const args = process.argv.slice(2);
  const arg = name => args.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  const root = process.cwd();
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'agent-workflow/harness/manifest.json'), 'utf8'));
  const registry = arg('registry') ? JSON.parse(fs.readFileSync(arg('registry'), 'utf8').replace(/^\uFEFF/u, '')) : null;
  const evidence = arg('evidence') ? JSON.parse(fs.readFileSync(arg('evidence'), 'utf8').replace(/^\uFEFF/u, '')) : {};
  const roots = { ...Object.fromEntries((registry?.roots || []).map(r => [r.id, r.path])), wavesight: root };
  const result = auditHarness(manifest, { roots, modules: registry?.modules, evidence });
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true });
  const state = spawnSync('git', ['status', '--porcelain=v1'], { cwd: root, encoding: 'utf8', windowsHide: true });
  const report = { schemaVersion: 1, checkedAt: new Date().toISOString(), sourceCommit: git.status === 0 ? git.stdout.trim() : null,
    workingTreeChanged: state.status === 0 ? Boolean(state.stdout.trim()) : null,
    scope: registry ? 'configured-local-roots' : 'repository-only',
    note: 'Checks reference structure and file presence only; no registered commands, model evaluation or deployment executed. Working-tree content may differ from sourceCommit.', ...result };
  console.log(JSON.stringify(report, null, 2));
  if (!result.ok) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
