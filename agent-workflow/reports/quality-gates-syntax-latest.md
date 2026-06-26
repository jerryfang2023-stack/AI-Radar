# Quality Gates Report

鐢熸垚鏃堕棿锛?026/6/26 11:22:31

## 缁撹

- 妯″紡锛歴yntax
- 鏃ユ湡鍙傛暟锛?026-06-26
- 鐘舵€侊細passed
- 妫€鏌ラ」锛?8
- 澶辫触椤癸細0

## 妫€鏌ユ槑缁?
### 1. v2 frontend app syntax

- 鍛戒护锛歚node --check 01-SiteV2/site/assets/app.js`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 2. v2 dev-server syntax

- 鍛戒护锛歚node --check 01-SiteV2/site/dev-server.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 3. run-quality-gates syntax

- 鍛戒护锛歚node --check agent-workflow/tools/run-quality-gates.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 4. v2-source-probe syntax

- 鍛戒护锛歚node --check agent-workflow/tools/v2-source-probe.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 5. v2-source-quality-gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/v2-source-quality-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 6. guanlan monitor quality gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 7. guanlan daily monitor syntax

- 鍛戒护锛歚node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 8. guanlan daily monitor with qc syntax

- 鍛戒护锛歚node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 9. writer-style-gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/writer-style-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 10. v2-typography-gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/v2-typography-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 11. frontstage regression gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/frontstage-regression-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 12. v2-raw-evidence-gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/v2-raw-evidence-gate.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 13. tag quality gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/check-tags.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 14. daily production chain gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/assert-daily-production-chain.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 15. pool-to-card dedupe gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/assert-pool-to-card-dedupe.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 16. follow-builders data gate syntax

- 鍛戒护锛歚node --check agent-workflow/tools/assert-follow-builders-data.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 17. trend candidate decision syntax

- 鍛戒护锛歚node --check agent-workflow/tools/run-trend-candidate-decision.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?

### 18. automation readiness report syntax

- 鍛戒护锛歚node --check agent-workflow/tools/write-automation-readiness-report.mjs`
- 鐘舵€侊細passed (0)
- stdout锛歴kipped: child_process spawn blocked (EPERM) in this environment
- stderr锛?


## 璇存槑

- 鏈剼鏈槸 `quality-gates.md` 鐨勭粺涓€鍏ュ彛銆?- SITE-V3.3.8.3 闃舵榛樿妫€鏌?`01-SiteV2/site/` 涓庡綋鍓?`agent-workflow/tools/` 鑴氭湰銆?- `all` 浼氳繍琛屽綋鍓嶅彲鐢ㄧ殑鍐呭銆佸墠鍙板洖褰掑拰 tag 璐ㄩ噺闂紱闇€瑕佹寚瀹氭棩鏈熸椂浣跨敤 `--date=YYYY-MM-DD`銆?- `style` 浼氭鏌ヤ笁涓?writer 鐨勬枃绔犱骇鐗╂槸鍚﹀嚭鐜扮璇嶃€佹娊璞″悕璇嶅拰楂橀閲嶅鍙ュ紡銆?- `regression` 浼氭鏌ュ墠鍙版槸鍚﹀嚭鐜版棫鐗堟湰鍙ｅ緞銆佸凡閫€浼戠粍浠躲€佹棫妯″潡鏂囨銆佸悎鎴?fallback 鍐呭銆佽繃鏈熷墠鍙版棩鏈熴€佽繃鏈熺紦瀛樺弬鏁版垨瓒嬪娍娉涘叧鑱斻€?- `automation` 妫€鏌?SITE-V3.3.8.3 Business Signals / Intelligence Map / Weekly Report / First-Line Viewpoints / Community Intelligence / Dashboard 鐢熶骇绾跨浉鍏宠剼鏈娉曘€?- 鏈鐩栫殑娴忚鍣ㄦ埅鍥俱€佸韬唤鏉冮檺鍜屼汉宸ュ唴瀹瑰垽鏂紝浠嶉渶 Build & Release 鍙戝竷妫€鏌ユ垨 Product Commander 涓撻」澶嶆牳銆?