// Keep aligned with github-pages.yml push paths. These paths bind the artifact
// and all its gates; unrelated commits may reuse the same deployed contents.
export const pagesDeploymentInputs = [
  '01-SiteV2/site','01-SiteV2/content','agent-workflow/tools','agent-workflow/product',
  'context/version-ledger.md','context/frontstage-page-contracts.md','context/project-memory.md',
  'AGENTS.md','package.json','package-lock.json','.github/workflows/github-pages.yml',
];
