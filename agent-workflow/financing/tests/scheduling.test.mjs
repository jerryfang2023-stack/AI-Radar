import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acceptedPublicationStatus, pendingReviewStatus } from '../dispatch-state.mjs';
import { productionPlan, financingExtractionScope } from '../run.mjs';
import { allowedCheckpointPath } from '../checkpoint.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const date = '2026-10-01';

test('migration-only publication cannot suppress financing discovery', () => {
  const report = {date, status:'ready_for_review'};
  assert.equal(acceptedPublicationStatus({...report,migration:{new_discovery_not_run:true}},date),null);
  assert.equal(acceptedPublicationStatus(report,date),'awaiting_portal');
  assert.equal(acceptedPublicationStatus({...report,status:'no_new_financing'},date),'no_new_financing');
  assert.equal(acceptedPublicationStatus({...report,status:'pending_verification'},date),'verification_required');
  assert.equal(acceptedPublicationStatus(report,'2026-10-02'),null);
  assert.equal(acceptedPublicationStatus(null,date),null);
});

test('an open financing PR waits for Codex review instead of starting the same day again', () => {
  const pr={headRefName:`automation/financing-${date}`,state:'OPEN',url:'https://example.com/pull/42',headRefOid:'reviewed-sha'};
  assert.deepEqual(pendingReviewStatus([pr],date,'passed'),{
    date,status:'ready_for_review',pr_url:pr.url,head_sha:pr.headRefOid,
  });
  assert.equal(pendingReviewStatus([pr],date,'waiting').status,'checks_pending');
  assert.equal(pendingReviewStatus([pr],date,'failed').status,'ci_failed');
  assert.equal(pendingReviewStatus([{...pr,state:'CLOSED'}],date),null);
  assert.equal(pendingReviewStatus([pr],'2026-10-02'),null);
  assert.match(read('.github/workflows/funding-health-dispatch.yml'),/^  checks: read$/mu);
});

test('retired daily workflows are removed and weekly monitor code stays manual and paused', () => {
  for (const name of ['daily-persistent-assets-pr','daily-funding-insights-pr','china-funding-pr','business-signals-health-dispatch','daily-recovery-watchdog']) {
    assert.equal(fs.existsSync(path.join(root,`.github/workflows/${name}.yml`)),false,name);
  }
  for (const name of ['daily-community-intelligence-pr','daily-first-line-viewpoints-pr']) {
    const text=read(`.github/workflows/${name}.yml`);
    assert.match(text,/workflow_dispatch:/u);
    assert.doesNotMatch(text,/^  (?:schedule|push|workflow_run|repository_dispatch):/mu);
  }
  const installer=read('agent-workflow/tools/install-daily-automation-controller-tasks.ps1');
  assert.match(installer,/Unregister-ScheduledTask -TaskName \$name -Confirm:\$false/u);
  assert.match(installer,/WaveSight Community Intelligence Weekly/u);
  assert.match(installer,/WaveSight Follow-Builders Skill Weekly/u);
  assert.doesNotMatch(installer,/\bRegister-ScheduledTask\b|\bEnable-ScheduledTask\b/u);
});

test('unified producer gates facts, research and new taxonomy before publication', () => {
  const stages=productionPlan(date,'reports');
  assert.deepEqual(stages.map(s=>s.id),['facts','research','projections','financing_tags','release_gate']);
  // Global financing batches may contain only overseas events. The V4 gate
  // validates geography evidence without requiring a domestic-source quota.
  assert.ok(!stages[0].commands.some(c=>c[0].endsWith('assert-china-market-v1.mjs')));
  assert.ok(stages[0].commands.some(c=>c[0].endsWith('generate-data-center-model-assist.mjs')&&c.includes('--reuse-existing=true')));
  assert.ok(stages[0].commands.some(c=>c.includes('--tasks=claim_extraction,entity_resolution,qa_repair')));
  assert.ok(stages[1].commands.some(c=>c[0].endsWith('assert-funding-insights-v1.mjs')));
  assert.ok(stages[2].commands.some(c=>c[0].endsWith('build-investment-institutions-v1.mjs')));
  assert.ok(stages[2].commands.some(c=>c[0].endsWith('build-data-center-v4-frontstage.mjs')));
  assert.ok(stages[3].commands.some(c=>c[0]==='agent-workflow/financing/catalog.mjs'));
  assert.doesNotMatch(JSON.stringify(stages),/run-guanlan-daily-monitor|classify-funding-taxonomy-v4|build-trend-radar|build-opportunity-map/u);
  assert.equal(allowedCheckpointPath(`01-SiteV2/content/11-databases/data-center-v4/model-assist-v1/${date}.json`,date),true);
  assert.equal(allowedCheckpointPath('01-SiteV2/site/data/data-center-v4/manifest.json',date),true);
});

test('financing extraction excludes historical same-date raw and FDE/hardware enrichment', () => {
  const intake={raw_documents:[{raw_id:'old',source_artifact_id:'SA-old'},{raw_id:'new',source_artifact_id:'SA-new'}]};
  assert.deepEqual(financingExtractionScope(intake,{raw_ids:['new','new']}),{source_refs:['SA-new']});
  assert.throws(()=>financingExtractionScope(intake,{raw_ids:['missing']}),/financing_extraction_source_missing/u);
  assert.deepEqual(financingExtractionScope(intake,{raw_ids:[]}),{source_refs:[]});
  const noNew=productionPlan(date,'reports',{extract:false});
  assert.ok(noNew[0].commands.every(c=>!c[0].endsWith('generate-data-center-model-assist.mjs')));
  assert.ok(noNew[0].commands.some(c=>c[0].endsWith('assert-data-center-v4.mjs')));
});

test('only gated manifest outputs enter a PR for Codex review after current-head CI', () => {
  const text=read('.github/workflows/funding-daily-pr.yml');
  assert.match(text,/if: steps\.produce\.outcome == 'success'/u);
  assert.match(text,/for \(const \{file\} of manifest\.entries\)/u);
  assert.match(text,/wait-for-production-code-checks\.mjs --pr=/u);
  assert.doesNotMatch(text,/\bgh pr merge\b/u);
  assert.match(text,/review_required/u);
  assert.doesNotMatch(text,/sync-.*to-obsidian|build-guanlan-vault|git add -A/u);
  const persist=text.indexOf('git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" push origin HEAD:main');
  assert.ok(persist>0 && persist<text.indexOf('Extract facts, research financing'));
});
