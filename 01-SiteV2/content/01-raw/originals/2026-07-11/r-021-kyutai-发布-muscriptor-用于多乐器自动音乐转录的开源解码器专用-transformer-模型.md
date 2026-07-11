---
schema_version: raw-evidence-v2
raw_id: R-021
title: "Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型"
title_zh: "Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi"
canonical_url: "https://marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-10T20:21:08.000Z"
collected_at: 2026-07-11T04:43:02.852Z
language: mixed
full_text_hash: e16ed67b6cfcbc68
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-021-kyutai-发布-muscriptor-用于多乐器自动音乐转录的开源解码器专用-transformer-模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-11/r-021-kyutai-发布-muscriptor-用于多乐器自动音乐转录的开源解码器专用-transformer-模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":6003,"paragraph_count":55,"sentence_count":64,"boilerplate_hits":2,"symbol_ratio":0.0107,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 6003
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e16ed67b6cfcbc68","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型","discovery_summary":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi","discovered_at":"2026-07-11T04:33:00.810Z","rank_on_page":107,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 78114dafebc46f8b
content_hash: e16ed67b6cfcbc68
semantic_hash: e03997cf91e9877c
duplicate_of: ""
first_seen_at: "2026-07-10T20:21:08.000Z"
last_seen_at: 2026-07-11T04:43:02.852Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":5,"importance_reason":"technical trend or capability shift; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":3}
business_elements: {"companies":["MarkTechPost（RSS）","GitHub"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出","合作 / 联盟","部署 / 上线"],"affected_departments":["IT / 安全"],"numbers":["3","103M","307M","1.4B","145 万","17 万","11000","1"],"quotes":[" variant (also accepts ",")\nmodel = TranscriptionModel.load_model()\n# Stream note events; optionally condition on known instruments\nfor event in model.transcribe(",", instruments=[","]):\nprint(event) # NoteStartEvent / NoteEndEvent / ProgressEvent\n# Or write a MIDI file directly\nPath(",").write_bytes(model.transcribe_to_midi("]}
evidence_seed: {"company_actions":["Tech News AI Paper Summary Technology AI Shorts Artificial Intelligence Applications Language Model Audio Language Model Editors Pick Large Language Model New Releases Software Engineering Staff TTS Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI.","Single-instrument transcription already works reasonably well.","However, transcribing a full multi-instrument mix stays difficult."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Tech News AI Paper Summary Technology AI Shorts Artificial Intelligence Applications Language Model Audio Language Model Editors Pick Large Language Model New Releases Software Engineering Staff TTS Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Single-instrument transcription already works reasonably well.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"However, transcribing a full multi-instrument mix stays difficult.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Kyutai and Mirelo team now release MuScriptor to close that gap.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It is an open-weight model trained on real, multi-instrument recordings across many genres.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-11T04:43:02.852Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型

## clean_text

Tech News
AI Paper Summary
Technology
AI Shorts
Artificial Intelligence
Applications
Language Model
Audio Language Model
Editors Pick
Large Language Model
New Releases
Software Engineering
Staff
TTS
Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI. Single-instrument transcription already works reasonably well. However, transcribing a full multi-instrument mix stays difficult. Kyutai and Mirelo team now release MuScriptor to close that gap. It is an open-weight model trained on real, multi-instrument recordings across many genres.
This article explains how MuScriptor works, what the benchmarks show, and how to run it.
What is MuScriptor?
At its core, MuScriptor is a decoder-only Transformer for music transcription. First, it reads a mel-spectrogram of a short audio segment. Then it autoregressively predicts MIDI-like tokens for pitch, timing, and instrument. In effect, transcription becomes a language-modeling task, following the MT3 tokenization scheme.
The release ships three weight variants on Hugging Face. Their sizes are small (103M), medium (307M, default), and large (1.4B). The inference code uses the MIT license. The weights use CC BY-NC 4.0, so commercial use is restricted.
How the Three-Stage Pipeline Works
MuScriptor’s main idea is data, not architecture. Accordingly, training moves through three stages, and each builds on the last.
Pre-training uses D<sub>Synth</sub> , roughly 1.45M MIDI files. An on-the-fly pipeline synthesizes them during training. Augmentations include pitch shifting, tempo changes, velocity adjustment, and instrument randomization. Over 250 soundfonts plus random detuning yield near-infinite audio realizations.
Fine-tuning uses D<sub>Real</sub> , an internal set of 170,000 recordings. Together they total more than 11,000 hours with aligned note annotations. Most alignments come from audio-symbolic synchronization using interpolation and dynamic time warping. Poor pairs are filtered by warping distance and a maximum time-dilation factor.
Reinforcement learning post-training uses D<sub>RL</sub> , 300 manually verified tracks. The team applies a GRPO-like method combining REINFORCE with group-relative advantage normalization. The reward sums three F-scores: onset, frame, and offset. As a result, the model learns to favor cleaner transcriptions.
Performance
For evaluation, the research team use D<sub>Test</sub> , 372 held-out tracks with accurate annotations. They report instrument-agnostic metrics from the mir_eval library. Among them, Multi F1 is strictest, since it also requires the correct instrument.
The table below traces each training stage against the YourMT3+ baseline, using the large (~1.3B) model.
Model (D<sub>Test</sub>) Onset F1 Frame F1 Offset F1 Drums F1 Multi F1
YourMT3+ (baseline) 32.5 45.5 17.8 41.4 21.9
MuScriptor · D<sub>Synth</sub> 34.5 48.9 16.1 21.0 16.2
MuScriptor · D<sub>Synth</sub> + D<sub>Real</sub> 54.4 69.3 42.3 43.3 41.6
MuScriptor · D<sub>Synth</sub> + D<sub>Real</sub> + D<sub>RL</sub> 60.4 73.3 49.0 50.2 48.2
Clearly, every stage improves results, and real data matters most. Synthetic-only training reaches competitive frame F1 but weak onset and multi scores. Adding D<sub>Real</sub> then lifts all metrics by roughly 20 points. Finally, RL post-training reduces false negatives and sharpens onset timing.
Cross-dataset tests point the same way. For example, frame F1 on Dagstuhl ChoirSet rises from 51.0 to 80.7. Even so, onset and offset stay lower on hard styles like chorals.
Getting Started
Installation takes one command, and inference streams note events directly.
Copy Code Copied Use a different Browser
# pip install muscriptor (or: uv add muscriptor)
from pathlib import Path
from muscriptor import TranscriptionModel
# Downloads the default "medium" variant (also accepts "small" / "large")
model = TranscriptionModel.load_model()
# Stream note events; optionally condition on known instruments
for event in model.transcribe("audio.wav", instruments=["acoustic_piano", "drums"]):
print(event) # NoteStartEvent / NoteEndEvent / ProgressEvent
# Or write a MIDI file directly
Path("out.mid").write_bytes(model.transcribe_to_midi("audio.wav"))
For the released models, keep cfg_coef at 1, since they are already RL post-trained. Additionally, uvx muscriptor serve launches a browser web UI with a live piano roll.
Use Cases with Examples
Because the output is standard MIDI, many workflows open up:
Producers can extract a MIDI bassline from a mix, then re-voice it in a DAW.
Musicologists can convert historical recordings into editable scores for analysis.
MIR researchers can feed transcriptions into chord or key recognition systems.
Educators can build practice tools showing a live piano roll during playback.
Developers can transcribe only drums by passing instrument conditioning.
Strengths and Weaknesses
Strengths:
Trained on 170k real recordings spanning classical to heavy metal.
Open weights plus MIT-licensed inference code, in three size variants.
Multi F1 of 48.2 versus 21.9 for the YourMT3+ baseline on D<sub>Test</sub>.
Instrument conditioning customizes output and stabilizes cross-segment predictions.
A streaming API emits note events and MIDI, alongside a browser web UI.
Weaknesses:
Weights are CC BY-NC 4.0, so commercial deployment is restricted.
The tokenizer drops velocity and cannot represent overlapping same-pitch, same-instrument notes.
Onset and offset accuracy stay lower on chorals and similar styles.
The large model wants a GPU for practical speed.
The 5-second segment size limits long-range context and inference speed.
Check out the Paper , GitHub Repo and Model Weights . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us

## full_text

Tech News
AI Paper Summary
Technology
AI Shorts
Artificial Intelligence
Applications
Language Model
Audio Language Model
Editors Pick
Large Language Model
New Releases
Software Engineering
Staff
TTS
Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI. Single-instrument transcription already works reasonably well. However, transcribing a full multi-instrument mix stays difficult. Kyutai and Mirelo team now release MuScriptor to close that gap. It is an open-weight model trained on real, multi-instrument recordings across many genres.
This article explains how MuScriptor works, what the benchmarks show, and how to run it.
What is MuScriptor?
At its core, MuScriptor is a decoder-only Transformer for music transcription. First, it reads a mel-spectrogram of a short audio segment. Then it autoregressively predicts MIDI-like tokens for pitch, timing, and instrument. In effect, transcription becomes a language-modeling task, following the MT3 tokenization scheme.
The release ships three weight variants on Hugging Face. Their sizes are small (103M), medium (307M, default), and large (1.4B). The inference code uses the MIT license. The weights use CC BY-NC 4.0, so commercial use is restricted.
How the Three-Stage Pipeline Works
MuScriptor’s main idea is data, not architecture. Accordingly, training moves through three stages, and each builds on the last.
Pre-training uses D<sub>Synth</sub> , roughly 1.45M MIDI files. An on-the-fly pipeline synthesizes them during training. Augmentations include pitch shifting, tempo changes, velocity adjustment, and instrument randomization. Over 250 soundfonts plus random detuning yield near-infinite audio realizations.
Fine-tuning uses D<sub>Real</sub> , an internal set of 170,000 recordings. Together they total more than 11,000 hours with aligned note annotations. Most alignments come from audio-symbolic synchronization using interpolation and dynamic time warping. Poor pairs are filtered by warping distance and a maximum time-dilation factor.
Reinforcement learning post-training uses D<sub>RL</sub> , 300 manually verified tracks. The team applies a GRPO-like method combining REINFORCE with group-relative advantage normalization. The reward sums three F-scores: onset, frame, and offset. As a result, the model learns to favor cleaner transcriptions.
Performance
For evaluation, the research team use D<sub>Test</sub> , 372 held-out tracks with accurate annotations. They report instrument-agnostic metrics from the mir_eval library. Among them, Multi F1 is strictest, since it also requires the correct instrument.
The table below traces each training stage against the YourMT3+ baseline, using the large (~1.3B) model.
Model (D<sub>Test</sub>) Onset F1 Frame F1 Offset F1 Drums F1 Multi F1
YourMT3+ (baseline) 32.5 45.5 17.8 41.4 21.9
MuScriptor · D<sub>Synth</sub> 34.5 48.9 16.1 21.0 16.2
MuScriptor · D<sub>Synth</sub> + D<sub>Real</sub> 54.4 69.3 42.3 43.3 41.6
MuScriptor · D<sub>Synth</sub> + D<sub>Real</sub> + D<sub>RL</sub> 60.4 73.3 49.0 50.2 48.2
Clearly, every stage improves results, and real data matters most. Synthetic-only training reaches competitive frame F1 but weak onset and multi scores. Adding D<sub>Real</sub> then lifts all metrics by roughly 20 points. Finally, RL post-training reduces false negatives and sharpens onset timing.
Cross-dataset tests point the same way. For example, frame F1 on Dagstuhl ChoirSet rises from 51.0 to 80.7. Even so, onset and offset stay lower on hard styles like chorals.
Getting Started
Installation takes one command, and inference streams note events directly.
Copy Code Copied Use a different Browser
# pip install muscriptor (or: uv add muscriptor)
from pathlib import Path
from muscriptor import TranscriptionModel
# Downloads the default "medium" variant (also accepts "small" / "large")
model = TranscriptionModel.load_model()
# Stream note events; optionally condition on known instruments
for event in model.transcribe("audio.wav", instruments=["acoustic_piano", "drums"]):
print(event) # NoteStartEvent / NoteEndEvent / ProgressEvent
# Or write a MIDI file directly
Path("out.mid").write_bytes(model.transcribe_to_midi("audio.wav"))
For the released models, keep cfg_coef at 1, since they are already RL post-trained. Additionally, uvx muscriptor serve launches a browser web UI with a live piano roll.
Use Cases with Examples
Because the output is standard MIDI, many workflows open up:
Producers can extract a MIDI bassline from a mix, then re-voice it in a DAW.
Musicologists can convert historical recordings into editable scores for analysis.
MIR researchers can feed transcriptions into chord or key recognition systems.
Educators can build practice tools showing a live piano roll during playback.
Developers can transcribe only drums by passing instrument conditioning.
Strengths and Weaknesses
Strengths:
Trained on 170k real recordings spanning classical to heavy metal.
Open weights plus MIT-licensed inference code, in three size variants.
Multi F1 of 48.2 versus 21.9 for the YourMT3+ baseline on D<sub>Test</sub>.
Instrument conditioning customizes output and stabilizes cross-segment predictions.
A streaming API emits note events and MIDI, alongside a browser web UI.
Weaknesses:
Weights are CC BY-NC 4.0, so commercial deployment is restricted.
The tokenizer drops velocity and cannot represent overlapping same-pitch, same-instrument notes.
Onset and offset accuracy stay lower on chorals and similar styles.
The large model wants a GPU for practical speed.
The 5-second segment size limits long-range context and inference speed.
Check out the Paper , GitHub Repo and Model Weights . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":6003,"paragraph_count":55,"sentence_count":64,"boilerplate_hits":2,"symbol_ratio":0.0107,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

2. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   Tech News AI Paper Summary Technology AI Shorts Artificial Intelligence Applications Language Model Audio Language Model Editors Pick Large Language Model New Releases Software Engineering Staff TTS Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Single-instrument transcription already works reasonably well.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   However, transcribing a full multi-instrument mix stays difficult.

5. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   Kyutai and Mirelo team now release MuScriptor to close that gap.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   It is an open-weight model trained on real, multi-instrument recordings across many genres.

## business_elements

- companies: MarkTechPost（RSS）, GitHub
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出, 合作 / 联盟, 部署 / 上线
- affected_departments: IT / 安全
- numbers: 3, 103M, 307M, 1.4B, 145 万, 17 万, 11000, 1
- quotes:  variant (also accepts  / )
model = TranscriptionModel.load_model()
# Stream note events; optionally condition on known instruments
for event in model.transcribe( / , instruments=[ / ]):
print(event) # NoteStartEvent / NoteEndEvent / ProgressEvent
# Or write a MIDI file directly
Path( / ).write_bytes(model.transcribe_to_midi(

## evidence_seed

- company_actions: Tech News AI Paper Summary Technology AI Shorts Artificial Intelligence Applications Language Model Audio Language Model Editors Pick Large Language Model New Releases Software Engineering Staff TTS Automatic Music Transcription (AMT) converts an audio recording into symbolic notes, usually MIDI. / Single-instrument transcription already works reasonably well. / However, transcribing a full multi-instrument mix stays difficult.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 5
- importance_reason: technical trend or capability shift; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Kyutai 发布 MuScriptor：用于多乐器自动音乐转录的开源解码器专用 Transformer 模型","discovery_summary":"Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/10/kyutai-releases-muscriptor-an-open-weight-decoder-only-transformer-for-multi-instrument-music-transcription-to-midi","discovered_at":"2026-07-11T04:33:00.810Z","rank_on_page":107,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Kyutai 与 Mirelo 团队发布 MuScriptor，一款用于多乐器自动音乐转录（AMT）的开放权重解码器专用 Transformer 模型。它将音频转录建模为语言建模任务，采用 MT3 token 化方案。模型在 Hugging Face 上提供三个权重变体：small（103M）、medium（307M，默认）和 large（1.4B）。训练采用三阶段流程：在约 145 万 MIDI 文件上预训练，在 17 万段真实录音（超 11000 小时）上微调，再通过 GRPO 类强化学习后训练。在 D Test 基准上，large 模型 Multi F1 达 48.2，远超 YourMT3+ 基线的 21.9。推理代码采用 MIT 许可，权重采用 CC BY-NC 4.0（限制商业使用）。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
