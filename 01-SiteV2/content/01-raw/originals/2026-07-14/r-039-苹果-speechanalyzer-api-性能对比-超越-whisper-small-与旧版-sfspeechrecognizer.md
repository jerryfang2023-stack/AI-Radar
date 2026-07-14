---
schema_version: raw-evidence-v2
raw_id: R-039
title: "苹果 SpeechAnalyzer API 性能对比：超越 Whisper Small 与旧版 SFSpeechRecognizer"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://get-inscribe.com/blog/apple-speech-api-benchmark.html"
canonical_url: "https://get-inscribe.com/blog/apple-speech-api-benchmark.html"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: formal_report
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-13T00:00:00.000Z"
collected_at: 2026-07-14T01:56:51.538Z
language: mixed
full_text_hash: 156378d52014b4a2
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-039-苹果-speechanalyzer-api-性能对比-超越-whisper-small-与旧版-sfspeechrecognizer.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-039-苹果-speechanalyzer-api-性能对比-超越-whisper-small-与旧版-sfspeechrecognizer.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":8348,"paragraph_count":55,"sentence_count":72,"boilerplate_hits":0,"symbol_ratio":0.0004,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 8348
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"156378d52014b4a2","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"苹果 SpeechAnalyzer API 性能对比：超越 Whisper Small 与旧版 SFSpeechRecognizer","discovery_summary":"苹果在 iOS/macOS 26 中推出 SpeechAnalyzer 和 SpeechTranscriber API，取代旧版 SFSpeechRecognizer。实测显示，SpeechAnalyzer 在 LibriSpeech test-clean 上词错误率（WER）为 2.12%，test-other 为 4.56%，均优于 Whisper Small（3.74%/7.95%），且处理每秒钟音频的速度约为 Whisper Small 的 3 倍。旧版 SFSpeechRecognizer 在 clean 和 noisy 语音上 WER 分别为 9.02% 和 16.25%，新 API 将其降低约 3.5-4 倍。所有引擎均在 Apple M2 Pro（32GB，macOS 26.5.1）上完全端侧运行。Whisper 仍支持约 30 种语言且跨平台，但英语转录场景下苹果内置引擎已成为更优选择。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://get-inscribe.com/blog/apple-speech-api-benchmark.html","discovered_at":"2026-07-14T01:48:14.388Z","rank_on_page":103,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 2676c016c6c62d55
content_hash: 156378d52014b4a2
semantic_hash: 6e0d7a3d0746b759
duplicate_of: ""
first_seen_at: "2026-07-13T00:00:00.000Z"
last_seen_at: 2026-07-14T01:56:51.538Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","OpenAI","Apple"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["26","2.12%","4.56%","3.74%","7.95%","3 倍","9.02%","16.25%"],"quotes":[]}
evidence_seed: {"company_actions":["The result, up front Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested.","It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small.","And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"苹果在 iOS/macOS 26 中推出 SpeechAnalyzer 和 SpeechTranscriber API，取代旧版 SFSpeechRecognizer。实测显示，SpeechAnalyzer 在 LibriSpeech test-clean 上词错误率（WER）为 2.12%，test-other 为 4.56%，均优于 Whisper Small（3.74%/7.95%），且处理每秒钟音频的速度约为 Whisper Small 的 3 倍。旧版 SFSpeechRecognizer 在 clean 和 noisy 语音上 WER 分别为 9.02% 和 16.25%，新 API 将其降低约 3.5-4 倍。所有引擎均在 Apple M2 Pro（32GB，macOS 26.5.1）上完全端侧运行。Whisper 仍支持约 30 种语言且跨平台，但英语转录场景下苹果内置引擎已成为更优选择。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The result, up front Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Engine test-clean WER test-other WER Model size Apple SpeechAnalyzer (iOS/macOS 26) 2.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"number","text":"56% system Whisper Small (WhisperKit CoreML) 3.","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-14T01:56:51.538Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 苹果 SpeechAnalyzer API 性能对比：超越 Whisper Small 与旧版 SFSpeechRecognizer

## clean_text

The result, up front
Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested. It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small. And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model.
Engine test-clean WER test-other WER Model size
Apple SpeechAnalyzer (iOS/macOS 26) 2.12% 4.56% system
Whisper Small (WhisperKit CoreML) 3.74% 7.95% ~460MB
Whisper Base 5.42% 12.51% ~140MB
Whisper Tiny 7.88% 17.04% ~40MB
Apple SFSpeechRecognizer (legacy) 9.02% 16.25% system
Lower is better: WER is word error rate, the percentage of words an engine substitutes, drops, or invents. LibriSpeech test-clean is 2,620 utterances of clean read speech; test-other is 2,939 harder, noisier utterances. Every engine ran fully on-device on an Apple M2 Pro (32GB, macOS 26.5.1).
Apple SpeechAnalyzer 2.12%
Whisper Small 3.74%
Whisper Base 5.42%
Whisper Tiny 7.88%
SFSpeechRecognizer (legacy) 9.02%
Why we ran this
With iOS 26 and macOS 26, Apple replaced SFSpeechRecognizer with a new API, SpeechAnalyzer and SpeechTranscriber. It published no accuracy figures for either one. So every developer deciding whether to migrate, and everyone comparing Apple's built-in recognition against Whisper, has been guessing.
We ship both Apple engines and three Whisper models side by side in Inscribe , a private on-device AI workspace, which puts us in an unusual position: we can run all five through identical production code paths on the same machine and the same audio. So we did.
Should you migrate off SFSpeechRecognizer?
Yes. This is the clearest result in the data. The new API cuts word error rate by 3.5 to 4x on the same audio: from 9.02% to 2.12% on clean speech, and from 16.25% to 4.56% on noisy speech. There is no accuracy trade-off to weigh; the new API wins everywhere we measured, and it produces punctuated, cased text where the legacy engine's output is rougher.
Put differently: an hour-long meeting transcribed with the legacy API contains roughly four times as many wrong words as the same meeting through SpeechAnalyzer. If your app still uses SFSpeechRecognizer for anything longer than a voice command, the migration is worth it on accuracy alone.
SpeechAnalyzer vs Whisper
The more surprising result: Apple's new engine also beat Whisper Small, the largest model we ship, by a comfortable margin on both splits, at roughly a third of Whisper Small's compute time per second of audio. For English, on Apple hardware, the built-in engine is now the strongest on-device option we can measure.
Whisper keeps two real advantages. It covers far more languages (SpeechTranscriber supports around 30 locales), and it runs anywhere, not just on Apple platforms with OS 26. But for English transcription on a current iPhone or Mac, the days of Whisper being the automatic accuracy pick are over.
We changed our own product on this result: Inscribe's Auto engine now prefers SpeechAnalyzer for the languages it supports, and Whisper for everything else. Shipping a benchmark and ignoring it in your own defaults would be a strange kind of honesty.
Speed
All five engines ran comfortably faster than real time: between roughly 12x and 40x on the M2 Pro, meaning an hour of audio transcribes in about 1.5 to 5 minutes on-device. SpeechAnalyzer was about 3x faster than Whisper Small per second of audio while beating it on accuracy. We are deliberately not printing a precise per-engine timing table yet: the accuracy runs shared the machine with a development workload, which does not affect WER but does add noise to timing. We will update this page with timings from a dedicated idle run.
Methodology, and why you can check it
A benchmark from a company that sells one of the engines should be treated with suspicion. Ours has two properties designed for that suspicion.
The Whisper column is reproducible against OpenAI's own numbers
We used LibriSpeech precisely because OpenAI published Whisper's WER on it. If our harness measured Whisper correctly, our numbers should land on theirs. They do, on all six measurements:
Engine / split Ours OpenAI published Delta
Whisper Tiny, test-clean 7.88% 7.6% +0.28
Whisper Base, test-clean 5.42% 5.0% +0.42
Whisper Small, test-clean 3.74% 3.4% +0.34
Whisper Tiny, test-other 17.04% 16.9% +0.14
Whisper Base, test-other 12.51% 12.4% +0.11
Whisper Small, test-other 7.95% 7.6% +0.35
The small, consistent positive offset (a slightly stricter text normalizer plus CoreML quantization) is what honest reproduction looks like; random error would scatter in both directions. Since the same corpus, normalizer, and scorer produced the Apple columns, the numbers nobody else can check inherit the validation from the numbers anyone can.
The raw transcripts are public
Every per-utterance hypothesis for both Apple engines is downloadable below, next to the reference text and per-utterance WER. Disagree with our normalization? Rescore it yourself.
summary.json - all ten measurements, machine-readable (3KB)
raw-transcripts-apple.json.gz - SpeechAnalyzer, all 5,559 utterances (620KB)
raw-transcripts-legacy.json.gz - SFSpeechRecognizer, all 5,559 utterances (620KB)
Details that decide whether a WER number means anything
Same production code paths. Each engine ran through the exact code Inscribe users get, not a lab harness with different buffering or settings.
Text normalization. LibriSpeech references are uppercase, unpunctuated, with numbers spelled out; modern engines emit punctuation and digits. Both sides pass through the same normalizer (casing, punctuation, digits-to-words, contractions), mirroring OpenAI's English normalizer. Score raw text and you punish engines for formatting nicely rather than for mishearing.
Corpus WER, not averaged WER. Total errors divided by total reference words, so short utterances are not over-weighted.
Fully on-device, verified. SFSpeechRecognizer sends audio to Apple's servers by default. We forced on-device recognition and made the harness refuse to run rather than silently fall back to the cloud, both because a cloud result would invalidate the comparison and because we were not going to upload 5,559 utterances from a privacy product.
Failures counted, not hidden. An engine returning nothing scores 100% WER for that utterance. It happened once in 27,795 transcriptions (legacy, test-other).
What building this taught us about our own app
The benchmark found a shipping bug in Inscribe. Our Apple-engine file import fed audio to SpeechAnalyzer and closed the input stream, but never called finalizeAndFinishThroughEndOfInput() . Without that call the analyzer never delivers its final results, and the import hangs forever. It had gone unnoticed because our Auto setting preferred Whisper. The fix shipped the same day, and it is part of why we publish the harness details: measuring your own product carefully has a way of finding the things you were not looking for.
Limitations
English only. LibriSpeech is English read speech. These numbers say nothing about the 100+ languages Whisper supports that SpeechTranscriber does not.
Read audiobook speech, not meetings. LibriSpeech is the standard, comparable corpus, which is why we started with it. Accented, far-field, and multi-speaker meeting audio is the obvious follow-up.
One machine. M2 Pro, macOS 26.5.1. Accuracy should transfer across Apple Silicon; speed will vary by chip.
Whisper via WhisperKit CoreML. Quantized on-device conversions, the same builds Inscribe ships. Reference GPU implementations may differ slightly, which the validation table quantifies.
What this means if you just want good transcription
If you are on a current iPhone or Mac, the best on-device transcription engine for English is already in the operating system, and the private option is no longer the compromise option. Inscribe uses exactly the engines measured here: SpeechAnalyzer where it supports your language, Whisper where it does not, all fully on-device, nothing uploaded. The benchmark is not separate from the product; it is how we decide what the product does.
Related reading
Apple Intelligence transcription
Best offline transcription apps
Private transcription apps
Benchmark
SpeechAnalyzer
Whisper
← Back to Blog

## full_text

The result, up front
Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested. It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small. And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model.
Engine test-clean WER test-other WER Model size
Apple SpeechAnalyzer (iOS/macOS 26) 2.12% 4.56% system
Whisper Small (WhisperKit CoreML) 3.74% 7.95% ~460MB
Whisper Base 5.42% 12.51% ~140MB
Whisper Tiny 7.88% 17.04% ~40MB
Apple SFSpeechRecognizer (legacy) 9.02% 16.25% system
Lower is better: WER is word error rate, the percentage of words an engine substitutes, drops, or invents. LibriSpeech test-clean is 2,620 utterances of clean read speech; test-other is 2,939 harder, noisier utterances. Every engine ran fully on-device on an Apple M2 Pro (32GB, macOS 26.5.1).
Apple SpeechAnalyzer 2.12%
Whisper Small 3.74%
Whisper Base 5.42%
Whisper Tiny 7.88%
SFSpeechRecognizer (legacy) 9.02%
Why we ran this
With iOS 26 and macOS 26, Apple replaced SFSpeechRecognizer with a new API, SpeechAnalyzer and SpeechTranscriber. It published no accuracy figures for either one. So every developer deciding whether to migrate, and everyone comparing Apple's built-in recognition against Whisper, has been guessing.
We ship both Apple engines and three Whisper models side by side in Inscribe , a private on-device AI workspace, which puts us in an unusual position: we can run all five through identical production code paths on the same machine and the same audio. So we did.
Should you migrate off SFSpeechRecognizer?
Yes. This is the clearest result in the data. The new API cuts word error rate by 3.5 to 4x on the same audio: from 9.02% to 2.12% on clean speech, and from 16.25% to 4.56% on noisy speech. There is no accuracy trade-off to weigh; the new API wins everywhere we measured, and it produces punctuated, cased text where the legacy engine's output is rougher.
Put differently: an hour-long meeting transcribed with the legacy API contains roughly four times as many wrong words as the same meeting through SpeechAnalyzer. If your app still uses SFSpeechRecognizer for anything longer than a voice command, the migration is worth it on accuracy alone.
SpeechAnalyzer vs Whisper
The more surprising result: Apple's new engine also beat Whisper Small, the largest model we ship, by a comfortable margin on both splits, at roughly a third of Whisper Small's compute time per second of audio. For English, on Apple hardware, the built-in engine is now the strongest on-device option we can measure.
Whisper keeps two real advantages. It covers far more languages (SpeechTranscriber supports around 30 locales), and it runs anywhere, not just on Apple platforms with OS 26. But for English transcription on a current iPhone or Mac, the days of Whisper being the automatic accuracy pick are over.
We changed our own product on this result: Inscribe's Auto engine now prefers SpeechAnalyzer for the languages it supports, and Whisper for everything else. Shipping a benchmark and ignoring it in your own defaults would be a strange kind of honesty.
Speed
All five engines ran comfortably faster than real time: between roughly 12x and 40x on the M2 Pro, meaning an hour of audio transcribes in about 1.5 to 5 minutes on-device. SpeechAnalyzer was about 3x faster than Whisper Small per second of audio while beating it on accuracy. We are deliberately not printing a precise per-engine timing table yet: the accuracy runs shared the machine with a development workload, which does not affect WER but does add noise to timing. We will update this page with timings from a dedicated idle run.
Methodology, and why you can check it
A benchmark from a company that sells one of the engines should be treated with suspicion. Ours has two properties designed for that suspicion.
The Whisper column is reproducible against OpenAI's own numbers
We used LibriSpeech precisely because OpenAI published Whisper's WER on it. If our harness measured Whisper correctly, our numbers should land on theirs. They do, on all six measurements:
Engine / split Ours OpenAI published Delta
Whisper Tiny, test-clean 7.88% 7.6% +0.28
Whisper Base, test-clean 5.42% 5.0% +0.42
Whisper Small, test-clean 3.74% 3.4% +0.34
Whisper Tiny, test-other 17.04% 16.9% +0.14
Whisper Base, test-other 12.51% 12.4% +0.11
Whisper Small, test-other 7.95% 7.6% +0.35
The small, consistent positive offset (a slightly stricter text normalizer plus CoreML quantization) is what honest reproduction looks like; random error would scatter in both directions. Since the same corpus, normalizer, and scorer produced the Apple columns, the numbers nobody else can check inherit the validation from the numbers anyone can.
The raw transcripts are public
Every per-utterance hypothesis for both Apple engines is downloadable below, next to the reference text and per-utterance WER. Disagree with our normalization? Rescore it yourself.
summary.json - all ten measurements, machine-readable (3KB)
raw-transcripts-apple.json.gz - SpeechAnalyzer, all 5,559 utterances (620KB)
raw-transcripts-legacy.json.gz - SFSpeechRecognizer, all 5,559 utterances (620KB)
Details that decide whether a WER number means anything
Same production code paths. Each engine ran through the exact code Inscribe users get, not a lab harness with different buffering or settings.
Text normalization. LibriSpeech references are uppercase, unpunctuated, with numbers spelled out; modern engines emit punctuation and digits. Both sides pass through the same normalizer (casing, punctuation, digits-to-words, contractions), mirroring OpenAI's English normalizer. Score raw text and you punish engines for formatting nicely rather than for mishearing.
Corpus WER, not averaged WER. Total errors divided by total reference words, so short utterances are not over-weighted.
Fully on-device, verified. SFSpeechRecognizer sends audio to Apple's servers by default. We forced on-device recognition and made the harness refuse to run rather than silently fall back to the cloud, both because a cloud result would invalidate the comparison and because we were not going to upload 5,559 utterances from a privacy product.
Failures counted, not hidden. An engine returning nothing scores 100% WER for that utterance. It happened once in 27,795 transcriptions (legacy, test-other).
What building this taught us about our own app
The benchmark found a shipping bug in Inscribe. Our Apple-engine file import fed audio to SpeechAnalyzer and closed the input stream, but never called finalizeAndFinishThroughEndOfInput() . Without that call the analyzer never delivers its final results, and the import hangs forever. It had gone unnoticed because our Auto setting preferred Whisper. The fix shipped the same day, and it is part of why we publish the harness details: measuring your own product carefully has a way of finding the things you were not looking for.
Limitations
English only. LibriSpeech is English read speech. These numbers say nothing about the 100+ languages Whisper supports that SpeechTranscriber does not.
Read audiobook speech, not meetings. LibriSpeech is the standard, comparable corpus, which is why we started with it. Accented, far-field, and multi-speaker meeting audio is the obvious follow-up.
One machine. M2 Pro, macOS 26.5.1. Accuracy should transfer across Apple Silicon; speed will vary by chip.
Whisper via WhisperKit CoreML. Quantized on-device conversions, the same builds Inscribe ships. Reference GPU implementations may differ slightly, which the validation table quantifies.
What this means if you just want good transcription
If you are on a current iPhone or Mac, the best on-device transcription engine for English is already in the operating system, and the private option is no longer the compromise option. Inscribe uses exactly the engines measured here: SpeechAnalyzer where it supports your language, Whisper where it does not, all fully on-device, nothing uploaded. The benchmark is not separate from the product; it is how we decide what the product does.
Related reading
Apple Intelligence transcription
Best offline transcription apps
Private transcription apps
Benchmark
SpeechAnalyzer
Whisper
← Back to Blog

## extraction_diagnostics

- extraction_method: article
- readability_score: 97
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":8348,"paragraph_count":55,"sentence_count":72,"boilerplate_hits":0,"symbol_ratio":0.0004,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   苹果在 iOS/macOS 26 中推出 SpeechAnalyzer 和 SpeechTranscriber API，取代旧版 SFSpeechRecognizer。实测显示，SpeechAnalyzer 在 LibriSpeech test-clean 上词错误率（WER）为 2.12%，test-other 为 4.56%，均优于 Whisper Small（3.74%/7.95%），且处理每秒钟音频的速度约为 Whisper Small 的 3 倍。旧版 SFSpeechRecognizer 在 clean 和 noisy 语音上 WER 分别为 9.02% 和 16.25%，新 API 将其降低约 3.5-4 倍。所有引擎均在 Apple M2 Pro（32GB，macOS 26.5.1）上完全端侧运行。Whisper 仍支持约 30 种语言且跨平台，但英语转录场景下苹果内置引擎已成为更优选择。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   The result, up front Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Engine test-clean WER test-other WER Model size Apple SpeechAnalyzer (iOS/macOS 26) 2.

6. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   56% system Whisper Small (WhisperKit CoreML) 3.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, OpenAI, Apple
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 26, 2.12%, 4.56%, 3.74%, 7.95%, 3 倍, 9.02%, 16.25%
- quotes: 暂无公开信息

## evidence_seed

- company_actions: The result, up front Apple's new SpeechAnalyzer is the most accurate on-device speech engine we tested. / It beat every Whisper model we ship, including Whisper Small, on both the clean and the noisy half of LibriSpeech, while running roughly three times faster than Small. / And the API it replaces, SFSpeechRecognizer, came last on clean speech: behind even Whisper Tiny, a 40MB model.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- emerging_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"苹果 SpeechAnalyzer API 性能对比：超越 Whisper Small 与旧版 SFSpeechRecognizer","discovery_summary":"苹果在 iOS/macOS 26 中推出 SpeechAnalyzer 和 SpeechTranscriber API，取代旧版 SFSpeechRecognizer。实测显示，SpeechAnalyzer 在 LibriSpeech test-clean 上词错误率（WER）为 2.12%，test-other 为 4.56%，均优于 Whisper Small（3.74%/7.95%），且处理每秒钟音频的速度约为 Whisper Small 的 3 倍。旧版 SFSpeechRecognizer 在 clean 和 noisy 语音上 WER 分别为 9.02% 和 16.25%，新 API 将其降低约 3.5-4 倍。所有引擎均在 Apple M2 Pro（32GB，macOS 26.5.1）上完全端侧运行。Whisper 仍支持约 30 种语言且跨平台，但英语转录场景下苹果内置引擎已成为更优选择。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://get-inscribe.com/blog/apple-speech-api-benchmark.html","discovered_at":"2026-07-14T01:48:14.388Z","rank_on_page":103,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

苹果在 iOS/macOS 26 中推出 SpeechAnalyzer 和 SpeechTranscriber API，取代旧版 SFSpeechRecognizer。实测显示，SpeechAnalyzer 在 LibriSpeech test-clean 上词错误率（WER）为 2.12%，test-other 为 4.56%，均优于 Whisper Small（3.74%/7.95%），且处理每秒钟音频的速度约为 Whisper Small 的 3 倍。旧版 SFSpeechRecognizer 在 clean 和 noisy 语音上 WER 分别为 9.02% 和 16.25%，新 API 将其降低约 3.5-4 倍。所有引擎均在 Apple M2 Pro（32GB，macOS 26.5.1）上完全端侧运行。Whisper 仍支持约 30 种语言且跨平台，但英语转录场景下苹果内置引擎已成为更优选择。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
