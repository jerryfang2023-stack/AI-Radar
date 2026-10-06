#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { collect } from './collect.mjs';
import { verifyPending, finishVerification } from './verify.mjs';
import { config, queryPlan } from './discovery.mjs';
import { acquireLock, digest, read, write, runStages } from './state.mjs';
import { resolvePrivateEvidenceBackupRoot } from '../tools/private-evidence-backup-paths.mjs';
import { indexFinancingEvidence } from './evidence-index.mjs';
import { parseArgs } from './args.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const script = name => `agent-workflow/tools/${name}.mjs`;
const site = name => `01-SiteV2/site/scripts/${name}.mjs`;

export function financingExtractionScope(intake, collection, supplemental = {}) {
  const raws = new Map((intake?.raw_documents || []).map(raw => [raw.raw_id, raw]));
  const ids = [...new Set([...(collection?.raw_ids || []), ...(supplemental?.raw_ids || [])])];
  if (ids.some(id => !raws.get(id)?.source_artifact_id)) throw new Error('financing_extraction_source_missing');
  return { source_refs: [...new Set(ids.map(id => raws.get(id).source_artifact_id))] };
}

export function productionPlan(date, directory, { extract = true } = {}) {
  const d = `--date=${date}`;
  return [
    { id: 'facts', commands: [
      [script('build-data-center-v4'), d],
      ...(extract ? [[script('generate-data-center-model-assist'), d, '--write=true', '--concurrency=2', '--reuse-existing=true', '--tasks=claim_extraction,entity_resolution,qa_repair']] : []),
      [script('assert-data-center-model-assist'), d],
      [script('build-data-center-v4'), d],
      [script('backfill-source-title-translations'), d, '--write=true', '--concurrency=3'],
      [script('build-data-center-v4'), d],
      [script('assert-data-center-v4'), d],
    ], outputs: [`01-SiteV2/content/11-databases/data-center-v4/${date}/manifest.json`] },
    { id: 'research', commands: [
      [script('generate-funding-insights-deepseek'), d, '--write=true', `--checkpoint-dir=${path.join(directory, 'research')}`],
      [script('assert-funding-insights-v1'), d],
    ], outputs: [`01-SiteV2/content/12-applications/funding-insights/${date}.json`] },
    { id: 'projections', commands: [
      [site('build-funding-insights-frontstage')],
      [script('build-investment-institutions-v1')],
      [script('sync-light-data-lake'), '--v4-only=true', '--duckdb=skip'],
      [site('build-data-center-v4-frontstage')],
      [script('build-public-entity-profile-coverage-v1')],
      [script('apply-public-entity-profiles-v1')],
      [script('translate-public-structured-fields-deepseek'), '--write=true'],
      [site('build-funding-insights-frontstage')],
      [script('sync-light-data-lake'), '--v4-only=true', '--duckdb=skip'],
      [site('build-data-center-v4-frontstage')],
      [script('apply-public-entity-profiles-v1')],
    ], outputs: ['01-SiteV2/site/data/funding-insights-v1.json'] },
    { id: 'financing_tags', commands: [
      ['agent-workflow/financing/classify.mjs', '--write=true'],
      [site('build-funding-insights-frontstage')],
      // Classification can admit newly researched cards after the earlier
      // projection pass. Materialize their investor links from this final set.
      [script('build-investment-institutions-v1')],
      [site('build-data-center-v4-frontstage')],
      [script('build-public-entity-profile-coverage-v1')],
      [script('apply-public-entity-profiles-v1')],
      ['agent-workflow/financing/catalog.mjs'],
    ], outputs: ['01-SiteV2/site/data/financing-catalog-v1.json'] },
    { id: 'release_gate', commands: [
      ['agent-workflow/financing/read-model.mjs', '--database=false', `--output=${path.join(directory,'read-model-gate')}`],
      [script('assert-data-lake-v4'), '--duckdb=skip'],
      [script('assert-funding-insights-v1'), '--all=true', '--frontstage=true'],
      [script('assert-investment-institutions-v1')],
      [script('assert-public-entity-profiles-v1')],
      [script('assert-public-evidence-boundary'), d],
      [script('assert-taxonomy-consistency-v4-1')],
      [script('frontstage-regression-gate')],
    ], outputs: ['01-SiteV2/site/data/funding-insights-v1.json'] },
  ];
}

async function main() {
  const args = parseArgs();
  const date = args.get('date') || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  queryPlan(date);
  const phase = args.get('phase') || 'all';
  if (!['all','collect','verify','produce','plan'].includes(phase)) throw new Error('invalid_financing_phase');
  const directory = path.resolve(args.get('runtime-dir') || path.join(root, 'agent-workflow/reports/financing', date));
  if (phase === 'plan') { console.log(JSON.stringify({ version: config.version, date, queries: queryPlan(date), stages: productionPlan(date, directory) }, null, 2)); return; }
  const unlock = acquireLock(directory);
  try {
    process.chdir(root);
    const backupRoot = resolvePrivateEvidenceBackupRoot(root);
    if (['all','collect'].includes(phase)) await collect({ root, directory, backupRoot, date });
    if (phase === 'collect') return;
    const collection = read(path.join(directory, 'collection.json'));
    if (!collection?.accepted || collection.date !== date) throw new Error('accepted_financing_collection_required');
    await verifyPending({ root, directory, backupRoot, date });
    if (phase === 'verify') return;
    indexFinancingEvidence({root, backupRoot, date, collection});
    // A clean zero day is not an extraction failure or a reason to invent cards.
    const intake = read(path.join(root, `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`));
    const supplemental = read(path.join(directory, 'supplemental.json'));
    if (supplemental && (supplemental.date !== date || supplemental.version !== 'FINANCING-SUPPLEMENT-1' || supplemental.accepted !== true)) throw new Error('accepted_financing_supplement_required');
    const extractionScope = financingExtractionScope(intake, collection, supplemental);
    if (!intake?.raw_documents?.length) {
      const verification = finishVerification({ root, directory, date, backupRoot });
      write(path.join(directory, 'publication.json'), { version: config.version, date, status: verification.counts.pending ? 'pending_verification' : 'no_new_financing', counts: collection.counts, verification }); return;
    }
    const scopeFile = path.join(directory, 'extraction-scope.json');
    write(scopeFile, extractionScope);
    const plans = productionPlan(date, directory, { extract: extractionScope.source_refs.length > 0 });
    const codeVersion = digest([intake, extractionScope]);
    const reviewedClaims = path.join(root, `01-SiteV2/content/11-databases/model-assist-v1/${date}.json`);
    const dependencyText = (file, seen = new Set()) => {
      if (seen.has(file) || !fs.existsSync(file)) return ''; seen.add(file);
      const body = fs.readFileSync(file, 'utf8');
      return body + [...body.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/gu)].map(match => dependencyText(path.resolve(path.dirname(file),match[1]),seen)).join('');
    };
    const previous = read(path.join(root,'01-SiteV2/site/data/data-center-v4-frontstage.json'));
    if (previous?.meta?.generatedAt) process.env.WAVESIGHT_FRONTSTAGE_GENERATED_AT = previous.meta.generatedAt;
    if (previous?.entityHistoryManifest?.generatedAt) process.env.WAVESIGHT_ENTITY_HISTORY_GENERATED_AT = previous.entityHistoryManifest.generatedAt;
    const stages = plans.map(stage => ({ ...stage, version: digest(stage.commands.map(command => dependencyText(path.join(root,command[0]))).join('') + (stage.id === 'financing_tags' ? fs.readFileSync(new URL('./taxonomy.json', import.meta.url),'utf8') : '')), inputVersion: stage.id === 'facts' ? () => fs.existsSync(reviewedClaims) ? digest(fs.readFileSync(reviewedClaims,'utf8')) : 'missing_reviewed_claims' : undefined, valid: () => stage.outputs.every(file => fs.existsSync(path.join(root, file))) }));
    await runStages({ date, codeVersion, file: path.join(directory, 'stages.json'), stages, execute: async stage => {
      const fd = fs.openSync(path.join(directory, `${stage.id}.log`), 'a');
      try {
        for (const command of stage.commands) {
          fs.writeSync(fd, `\n${new Date().toISOString()} node ${command.join(' ')}\n`);
          const env = command[0] === script('generate-data-center-model-assist')
            ? { ...process.env, MODEL_ASSIST_SOURCE_REFS_FILE: scopeFile } : process.env;
          const result = spawnSync(process.execPath, command, { cwd: root, env, windowsHide: true, stdio: ['ignore', fd, fd], timeout: 1800000 });
          if (result.error || result.status !== 0) throw new Error(`${stage.id}:${path.basename(command[0])}:${result.status ?? result.error?.code}`);
        }
      } finally { fs.closeSync(fd); }
    } });
    const verification = finishVerification({ root, directory, date, backupRoot });
    write(path.join(directory, 'publication.json'), { verification, version: config.version, date, status: 'ready_for_review', counts: collection.counts, next: 'merge_pages_portal_and_live_parity', generated_at: new Date().toISOString() });
    console.log(JSON.stringify({ date, status: 'ready_for_review', report: path.join(directory, 'publication.json') }));
  } finally { unlock(); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
