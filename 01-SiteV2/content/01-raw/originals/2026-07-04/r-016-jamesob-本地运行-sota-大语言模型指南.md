---
schema_version: raw-evidence-v2
raw_id: R-016
title: "Jamesob 本地运行 SOTA 大语言模型指南"
title_zh: "Jamesob 本地运行 SOTA 大语言模型指南"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://github.com/jamesob/local-llm"
canonical_url: "https://github.com/jamesob/local-llm"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: developer
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
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
published_at: "2026-07-03T18:47:44.003Z"
collected_at: 2026-07-04T04:50:50.112Z
language: mixed
full_text_hash: 328da27b70fb289b
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-016-jamesob-本地运行-sota-大语言模型指南.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-016-jamesob-本地运行-sota-大语言模型指南.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":12078,"paragraph_count":180,"sentence_count":78,"boilerplate_hits":2,"symbol_ratio":0.0059,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 12078
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"328da27b70fb289b","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Jamesob 本地运行 SOTA 大语言模型指南","discovery_summary":"Jamesob 发布预算 $2k 到 $40k 的本地部署方案。$2k 方案用 2×RTX 3090（48GB VRAM）运行 Qwen3.6-27B 和 whisper-large-v3 语音转文字；$40k 方案用 4×RTX PRO 6000（384GB VRAM）、EPYC 7313P 系统及 c-payne PCIe Gen4 交换机，运行 GLM-5.2-Int8Mix-NVFP4-REAP-594B，在 240k 上下文窗口下约 80 t/s。所有模型通过 Docker 容器管理，配置位于 `runners/` 目录。指南还包含硬件选型、PCIe 拓扑、BIOS 参数及功耗限制等细节。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/jamesob/local-llm","discovered_at":"2026-07-04T03:11:32.653Z","rank_on_page":75,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: fda2072231b00dde
content_hash: 328da27b70fb289b
semantic_hash: 51f4f2063ec7ca6c
duplicate_of: ""
first_seen_at: "2026-07-03T18:47:44.003Z"
last_seen_at: 2026-07-04T04:50:50.112Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":5}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","GitHub","Amazon","Nvidia"],"products":["Claude"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["计费 / 预算管理","权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["$2","$40","2","3090","48","3.6","27B","3"],"quotes":["directly","Gen1 downgraded"," iommu=off amd_iommu=off nomodeset "," -ne 0 ] ; then\necho ","\nexit 1\nfi\nfor BDF in $( lspci -d "]}
evidence_seed: {"company_actions":["jamesob local-llm Public Notifications You must be signed in to change notification settings Fork 12 Star 400 master Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 18 Commits 18 Commits images images runners runners tools tools README.","md View all files Repository files navigation jamesob's guide to running SOTA LLMs locally Note: nothing in this README aside from the tables was written by AI.","If Dario and Altman are giving you heartburn (they should be), read on to figure out how to run this new kind of computing locally."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Jamesob 发布预算 $2k 到 $40k 的本地部署方案。$2k 方案用 2×RTX 3090（48GB VRAM）运行 Qwen3.6-27B 和 whisper-large-v3 语音转文字；$40k 方案用 4×RTX PRO 6000（384GB VRAM）、EPYC 7313P 系统及 c-payne PCIe Gen4 交换机，运行 GLM-5.2-Int8Mix-NVFP4-REAP-594B，在 240k 上下文窗口下约 80 t/s。所有模型通过 Docker 容器管理，配置位于 `runners/` 目录。指南还包含硬件选型、PCIe 拓扑、BIOS 参数及功耗限制等细节。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"jamesob local-llm Public Notifications You must be signed in to change notification settings Fork 12 Star 400 master Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 18 Commits 18 Commits images images runners runners tools tools README.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"md View all files Repository files navigation jamesob's guide to running SOTA LLMs locally Note: nothing in this README aside from the tables was written by AI.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"number","text":"Have $2k burning a hole in your pocket and want some local, state-of-the-art machine intelligence?","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"If Dario and Altman are giving you heartburn (they should be), read on to figure out how to run this new kind of computing locally.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"In this repo you'll find the hardware I use to run SOTA locally, why I bought what and little-known secrets for configuring it, how I run speech-to-text (STT) locally, ready-to-run configuration for running models I think are good within Docker containers.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:50.112Z
theme: technical-iteration-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Jamesob 本地运行 SOTA 大语言模型指南

## clean_text

jamesob
local-llm
Public
Notifications
You must be signed in to change notification settings
Fork
12
Star
400
master
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
18 Commits
18 Commits
images
images
runners
runners
tools
tools
README.md
README.md
View all files
Repository files navigation
jamesob's guide to running SOTA LLMs locally
Note: nothing in this README aside from the tables was written by AI.
Have $2k burning a hole in your pocket and want some local, state-of-the-art machine
intelligence?
How about $40k?
If Dario and Altman are giving you heartburn (they should be), read on to figure out
how to run this new kind of computing locally.
In this repo you'll find
the hardware I use to run SOTA locally,
why I bought what and little-known secrets for configuring it,
how I run speech-to-text (STT) locally,
ready-to-run configuration for running models I think are good within Docker containers.
Contents
Section
TL;DR
How much are you willing to spend?
$2k gets you Qwen and good STT (pretty far!); $40k gets you almost-Opus
Base system
Last-gen EPYC + eBay DDR4 for $5.6k
GPUs
4× RTX PRO 6000, 384GB VRAM (where the money went)
c-payne switch sub-BOM
Indie PCIe switching from c-payne.com so GPUs talk peer-to-peer
GPU mount
A day of carpentry
Making the switch behave
BIOS bifurcation, link speed, ASPM
Kernel / GRUB params
iommu=off or NCCL hangs
ACS disable
Keep P2P traffic inside the switch fabric
GPU power limiting
Running $46k of silicon on a 110V circuit
Result
Gen4 line rate: 27.5/50.4 GB/s, sub-µs latency
runners/
Ready-to-run serving configs: GLM-5.2-594B : vLLM docker-compose, DCP4+MTP5, ~80 t/s @ 460k ctx
runners/stt
Ready-to-run speech-to-text config with whisper-large-v3
tools/
measure-gpu-speed.sh : P2P bandwidth/latency benchmark
Resources
rtx6kpro repo, c-payne
My setup
I was lucky/dumb enough to buy 4x RTX Pro 6000s back when they were cheaper. Because
RAM is now so expensive, I opted to build a last-gen DDR4 system to host these cards,
the parts for which I got off eBay. This allowed me to keep base system cost reasonable
while still getting a lot of VRAM.
Another somewhat unusual thing I did was to use PCIe4 switches (from
c-payne.com ). This allows the GPUs to communicate to one another
"directly" at wire speeds during the allreduce step in tensor parallelism, rather than
having to send all data through the PCI root complex. The upshot of this is reduced
latency between the cards with less of a need for expensive PCIe5 hardware.
Consequently, I'm spending money on VRAM (where it counts) rather than on a PCIe5/DDR5
base system, which is terrifically expensive as of July 2026.
My particular BOM is detailed below.
How much are you willing to spend?
~$2k
A great way to go is 2x RTX 3090s for a total of 48GB VRAM total. You can then run
Qwen3.6-27B , which is an awesome model.
You can also run SOTA speech-to-text (STT) with
whisper-large-v3 , which I find very
useful. That's the model - you'd then access it with my cross-platform stt
harness .
I've found local STT surprisingly useful - and I feel comfortable using it, unlike a
hosted equivalent. You can find a ready-to-run config in
./runners/stt that only assumes the presence of ~11GB of VRAM on an
Nvidia GPU.
~$40k
At this price level, you get the next step up in model intelligence. Something pretty
close to Claude Opus.
You'd buy 4x RTX 6000 Pros for a total of 384GB of VRAM .
Current best models for 4x RTX6kPRO
Date
Best model
My config
2026-07
GLM-5.2-Int8Mix-NVFP4-REAP-594B
Runner config
Other approaches
Note: these are my recommendations, but there are other completely valid ways to spend
your money. For example, there's probably also some regime where rather than getting 4
rtx6kpros, you allocate most of your money to building out a linked 4x DGX Spark
cluster for a total of 512GB VRAM
and use that as the slow, big brain to drive Qwen3.7-27b to do the rote tasks quickly.
Hardware
Here's the hardware I wound up purchasing for the 4x RTX 6000 pro machine.
Base system
A modest, last-gen EPYC system purchased in parts almost entirely from eBay.
Component
Spec
Price
Motherboard
ASRock Rack ROMED8-2T (SP3, 7× PCIe 4.0 x16, dual 10GbE)
$715
CPU
AMD EPYC Milan 7313P (16-core 3.0GHz)
$504
RAM
8× 16GB Crucial CT16G4RFD4213 DDR4 ECC RDIMM (128GB total, eBay)
$642
CPU Cooler
Dynatron T17 SP3 tower, 280W TDP
$40
Case
AAAWave Sluice V2 open frame
$100
PSUs
2× Super Flower 1700W
$750
PCIe Switch
c-payne Microchip Switchtec PM40100 Gen4 (see sub-BOM below)
~$1,330
Boot NVMe
4TB M.2
$291
Storage NVMe
(2x) 8TB M.2 (model weights)
$1,200
Fans
3× 120mm PWM
$15
Total
$5,587
GPUs
Component
Spec
Price
GPUs
4× NVIDIA RTX PRO 6000 Blackwell Workstation (96GB each, 384GB VRAM total )
~$46,000
c-payne PCIe Gen4 Switch Sub-BOM (c-payne.com)
Part
Qty
Unit (€)
Notes
PCIe gen4 Switch 5× x16 — Microchip Switchtec PM40100
1.050
2× SlimSAS 8i upstream, 5× x16 quad-width-spaced downstream, aux x4 SlimSAS, 3× 8-pin EPS power
SlimSAS PCIe gen4 Host Adapter x16 — REDRIVER AIC (DS160PR810)
140
Plugs into ROMED8-2T x16 slot, feeds switch upstream
SlimSAS SFF-8654 8i cable — PCIe gen4
~30
Each carries x8; pair = x16 upstream
Total
€1,220 ( $1,330 USD)
GPU mount
I had to custom fabricate a wood enclosure for the PCI switch and GPUs, which took
about a day.
I found the PCI switch's builtin fan very loud and seemingly useless, so I simply
unplugged that from the board.
Hoarding model weights
I save all model weights locally on a ZFS filesystem that's replicated across the two
8TB drives, which is mounted at ~/storage .
For any model I want to run, I first download the model using
hf download <model-name> --local-dir ~/storage/<model-name>
Running models
Once the model weights are cached locally, I have a specific directory for each model
that contains a docker-compose.yml file that cordones off the running of each model
to its own Docker container.
You can find these configurations in ./runners/ .
Each container mounts in ~/storage/models in read-only mode to obtain the weights
that I've cached locally.
I then use opencode hosted on a VM on another machine to access the models once
they're serving on http://clank.j.co:5000 .
I use a network-internal DNS server to point clank.j.co to the LLM machine, but you
could simply do http://<llm-machine-ip>:5000 too.
The harness itself
I created a VM and clanked up an application that basically just creates a tmux session
for each directory within the VM's ~/src tree, which then runs an opencode instance
that backs up to the inference machine's HTTP API ( http://clank.j.co:5000 ).
One key to making the opensource models good is tooling them properly; a summary of my
skills/ is:
camofox, kagi.com API key, and searXNG for web browsing and search,
Telegram bot for communication and alerting,
a local private Gitea instance for collaborating on source code.
The clanker will either work with me interactively in a session, or can be farmed off
to work on Gitea issues and file PRs there.
All this happens in a sandboxed VM where the only communication back to the host system
happens via a shared filesystem mount, so the thing can go ham and install whatever it
wants.
Getting the PCI switches to work properly
There was a lot of fiddling with the BIOS in order to make sure the motherboard wasn't
downregulating the PCI switch speeds.
BIOS Configuration (ROMED8-2T)
Setting
Value
Why
Chipset Configuration → AMD PCIE Link Width (switch slot)
x16 (was x8/x8)
Bifurcation was splitting the slot; upstream link trained at Gen4 x8. Requires both SlimSAS 8i cables connected (each carries x8).
PCIe Link Speed (switch slot)
Gen4 (not Auto)
Blackwell Gen5 devices auto-negotiating down through the Gen4 switch could fail training and fall to Gen1. Forcing Gen4 stabilizes it.
ASPM
Disabled
ASPM L1 drops idle links to 2.5GT/s. This turned out to be the explanation for the "Gen1 downgraded" lspci readings — links were actually running Gen4 under load (verified via p2pBandwidthLatencyTest), but disabling ASPM removes the cosmetic scare and any re-train latency.
Re-Size BAR
Enabled
Required for full 96GB VRAM BAR exposure and GPU P2P.
SR-IOV
Disabled
Bare-metal inference; avoids IOMMU overhead and P2P interference.
Preferred IO
Auto
Optionally set Manual → bus 81 (the c-payne switch) for marginal latency gains, but left at Auto — it's a squeeze-more optimization, not a fix, and bus numbers shift after BIOS changes.
Reducing gain on the redriver
Per c-payne's advice, I did reduce the gain to "lvl 3" using his
tool , which was probably the most finicky part of
the process.
The gain level is going to be a function of how long your SAS connector cables are.
Picking the right SAS cables
I screwed up and ordered too few of the cables from c-payne directly, so I bought what
I thought was the same SAS cable off of Amazon. There was actually a slight difference
that was causing issues, and I had to reorder cables - so double-check that you're
getting the right stuff!
Kernel / GRUB Parameters
# /etc/default/grub
GRUB_CMDLINE_LINUX= " iommu=off amd_iommu=off nomodeset "
sudo update-grub
# nvidia_uvm P2P fix
echo ' options nvidia_uvm uvm_disable_hmm=1 ' | sudo tee /etc/modprobe.d/uvm.conf
sudo update-initramfs -u
Without iommu=off , NCCL hangs on multi-GPU P2P.
ACS Disable (critical for switch P2P)
With ACS enabled (default), P2P traffic gets bounced through the CPU root port
instead of staying inside the switch fabric, negating the switch entirely.
pcie_acs_override requires a patched kernel, so we disable via setpci at runtime.
# /usr/local/bin/disable-acs.sh
#! /bin/bash
if [ " $EUID " -ne 0 ] ; then
echo " ERROR: must be run as root "
exit 1
fi
for BDF in $( lspci -d " *:*:* " | awk ' {print $1} ' ) ; do
setpci -v -s ${BDF} ECAP_ACS+0x6.w > /dev/null 2>&1
if [ $? -ne 0 ] ; then
continue
fi
echo " Disabling ACS on $( lspci -s ${BDF} ) "
setpci -v -s ${BDF} ECAP_ACS+0x6.w=0000
done
Run on every boot via systemd oneshot:
# /etc/systemd/system/disable-acs.service
[Unit]
Description =Disable PCIe ACS for GPU P2P
After =multi-user.target
[Service]
Type =oneshot
ExecStart =/usr/local/bin/disable-acs.sh
[Install]
WantedBy =multi-user.target
Verify: lspci -vvv | grep ACSCtl should show all minus signs, and
nvidia-smi topo -m should show PIX between all four GPUs (not PHB/NODE).
Use ./tools/measure-gpu-speed.sh to measure this easily.
GPU Power Limiting
In order to avoid installing a 220V circuit, I (probably unwisely) run this rig on a
single 110V circuit, but I power regulate the cards.
Persistence mode + power cap applied at boot via systemd
(install-gpu-power-limit.sh):
sudo nvidia-smi -pm 1
sudo nvidia-smi -pl 350 # 350W per GPU (default 600W)
350W/GPU = 1,400W GPU load, sized for the PSU budget. During the interim
single-1700W-PSU phase (before the 240V circuit), cards ran at ~260W
(4×260 = 1,040W GPUs + ~280W system ≈ 1,320W total).
Verify: nvidia-smi --query-gpu=index,power.limit,power.draw --format=csv
Result
Upstream: Gen4 x16 (~30 GB/s to CPU). P2P through switch: 27.5 GB/s
unidirectional / 50.4 GB/s bidirectional, 0.37–0.45 µs latency , i.e. Gen4 line
rate. Note: lspci may still show downstream GPU links as "2.5GT/s (downgraded)"
at idle if ASPM is active anywhere; this is cosmetic. Links retrain to Gen4
under load.
Resources
A frequently updated repo on getting the most out of 4, 6, or 8 RTX 6000 Pro cards: https://github.com/local-inference-lab/rtx6kpro
Indie PCI switches that I use: https://c-payne.com
RTX6kPRO discord server; lotta guys benching and testing new models: https://discord.gg/QMNvFkuDN
About
Everything I know about running LLMs locally
Resources
Readme
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
400
stars
Watchers
watching
Forks
12
forks
Report repository
Releases
No releases published
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Shell
96.5%
Dockerfile
3.5%

## full_text

jamesob
local-llm
Public
Notifications
You must be signed in to change notification settings
Fork
12
Star
400
master
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
18 Commits
18 Commits
images
images
runners
runners
tools
tools
README.md
README.md
View all files
Repository files navigation
jamesob's guide to running SOTA LLMs locally
Note: nothing in this README aside from the tables was written by AI.
Have $2k burning a hole in your pocket and want some local, state-of-the-art machine
intelligence?
How about $40k?
If Dario and Altman are giving you heartburn (they should be), read on to figure out
how to run this new kind of computing locally.
In this repo you'll find
the hardware I use to run SOTA locally,
why I bought what and little-known secrets for configuring it,
how I run speech-to-text (STT) locally,
ready-to-run configuration for running models I think are good within Docker containers.
Contents
Section
TL;DR
How much are you willing to spend?
$2k gets you Qwen and good STT (pretty far!); $40k gets you almost-Opus
Base system
Last-gen EPYC + eBay DDR4 for $5.6k
GPUs
4× RTX PRO 6000, 384GB VRAM (where the money went)
c-payne switch sub-BOM
Indie PCIe switching from c-payne.com so GPUs talk peer-to-peer
GPU mount
A day of carpentry
Making the switch behave
BIOS bifurcation, link speed, ASPM
Kernel / GRUB params
iommu=off or NCCL hangs
ACS disable
Keep P2P traffic inside the switch fabric
GPU power limiting
Running $46k of silicon on a 110V circuit
Result
Gen4 line rate: 27.5/50.4 GB/s, sub-µs latency
runners/
Ready-to-run serving configs: GLM-5.2-594B : vLLM docker-compose, DCP4+MTP5, ~80 t/s @ 460k ctx
runners/stt
Ready-to-run speech-to-text config with whisper-large-v3
tools/
measure-gpu-speed.sh : P2P bandwidth/latency benchmark
Resources
rtx6kpro repo, c-payne
My setup
I was lucky/dumb enough to buy 4x RTX Pro 6000s back when they were cheaper. Because
RAM is now so expensive, I opted to build a last-gen DDR4 system to host these cards,
the parts for which I got off eBay. This allowed me to keep base system cost reasonable
while still getting a lot of VRAM.
Another somewhat unusual thing I did was to use PCIe4 switches (from
c-payne.com ). This allows the GPUs to communicate to one another
"directly" at wire speeds during the allreduce step in tensor parallelism, rather than
having to send all data through the PCI root complex. The upshot of this is reduced
latency between the cards with less of a need for expensive PCIe5 hardware.
Consequently, I'm spending money on VRAM (where it counts) rather than on a PCIe5/DDR5
base system, which is terrifically expensive as of July 2026.
My particular BOM is detailed below.
How much are you willing to spend?
~$2k
A great way to go is 2x RTX 3090s for a total of 48GB VRAM total. You can then run
Qwen3.6-27B , which is an awesome model.
You can also run SOTA speech-to-text (STT) with
whisper-large-v3 , which I find very
useful. That's the model - you'd then access it with my cross-platform stt
harness .
I've found local STT surprisingly useful - and I feel comfortable using it, unlike a
hosted equivalent. You can find a ready-to-run config in
./runners/stt that only assumes the presence of ~11GB of VRAM on an
Nvidia GPU.
~$40k
At this price level, you get the next step up in model intelligence. Something pretty
close to Claude Opus.
You'd buy 4x RTX 6000 Pros for a total of 384GB of VRAM .
Current best models for 4x RTX6kPRO
Date
Best model
My config
2026-07
GLM-5.2-Int8Mix-NVFP4-REAP-594B
Runner config
Other approaches
Note: these are my recommendations, but there are other completely valid ways to spend
your money. For example, there's probably also some regime where rather than getting 4
rtx6kpros, you allocate most of your money to building out a linked 4x DGX Spark
cluster for a total of 512GB VRAM
and use that as the slow, big brain to drive Qwen3.7-27b to do the rote tasks quickly.
Hardware
Here's the hardware I wound up purchasing for the 4x RTX 6000 pro machine.
Base system
A modest, last-gen EPYC system purchased in parts almost entirely from eBay.
Component
Spec
Price
Motherboard
ASRock Rack ROMED8-2T (SP3, 7× PCIe 4.0 x16, dual 10GbE)
$715
CPU
AMD EPYC Milan 7313P (16-core 3.0GHz)
$504
RAM
8× 16GB Crucial CT16G4RFD4213 DDR4 ECC RDIMM (128GB total, eBay)
$642
CPU Cooler
Dynatron T17 SP3 tower, 280W TDP
$40
Case
AAAWave Sluice V2 open frame
$100
PSUs
2× Super Flower 1700W
$750
PCIe Switch
c-payne Microchip Switchtec PM40100 Gen4 (see sub-BOM below)
~$1,330
Boot NVMe
4TB M.2
$291
Storage NVMe
(2x) 8TB M.2 (model weights)
$1,200
Fans
3× 120mm PWM
$15
Total
$5,587
GPUs
Component
Spec
Price
GPUs
4× NVIDIA RTX PRO 6000 Blackwell Workstation (96GB each, 384GB VRAM total )
~$46,000
c-payne PCIe Gen4 Switch Sub-BOM (c-payne.com)
Part
Qty
Unit (€)
Notes
PCIe gen4 Switch 5× x16 — Microchip Switchtec PM40100
1.050
2× SlimSAS 8i upstream, 5× x16 quad-width-spaced downstream, aux x4 SlimSAS, 3× 8-pin EPS power
SlimSAS PCIe gen4 Host Adapter x16 — REDRIVER AIC (DS160PR810)
140
Plugs into ROMED8-2T x16 slot, feeds switch upstream
SlimSAS SFF-8654 8i cable — PCIe gen4
~30
Each carries x8; pair = x16 upstream
Total
€1,220 ( $1,330 USD)
GPU mount
I had to custom fabricate a wood enclosure for the PCI switch and GPUs, which took
about a day.
I found the PCI switch's builtin fan very loud and seemingly useless, so I simply
unplugged that from the board.
Hoarding model weights
I save all model weights locally on a ZFS filesystem that's replicated across the two
8TB drives, which is mounted at ~/storage .
For any model I want to run, I first download the model using
hf download <model-name> --local-dir ~/storage/<model-name>
Running models
Once the model weights are cached locally, I have a specific directory for each model
that contains a docker-compose.yml file that cordones off the running of each model
to its own Docker container.
You can find these configurations in ./runners/ .
Each container mounts in ~/storage/models in read-only mode to obtain the weights
that I've cached locally.
I then use opencode hosted on a VM on another machine to access the models once
they're serving on http://clank.j.co:5000 .
I use a network-internal DNS server to point clank.j.co to the LLM machine, but you
could simply do http://<llm-machine-ip>:5000 too.
The harness itself
I created a VM and clanked up an application that basically just creates a tmux session
for each directory within the VM's ~/src tree, which then runs an opencode instance
that backs up to the inference machine's HTTP API ( http://clank.j.co:5000 ).
One key to making the opensource models good is tooling them properly; a summary of my
skills/ is:
camofox, kagi.com API key, and searXNG for web browsing and search,
Telegram bot for communication and alerting,
a local private Gitea instance for collaborating on source code.
The clanker will either work with me interactively in a session, or can be farmed off
to work on Gitea issues and file PRs there.
All this happens in a sandboxed VM where the only communication back to the host system
happens via a shared filesystem mount, so the thing can go ham and install whatever it
wants.
Getting the PCI switches to work properly
There was a lot of fiddling with the BIOS in order to make sure the motherboard wasn't
downregulating the PCI switch speeds.
BIOS Configuration (ROMED8-2T)
Setting
Value
Why
Chipset Configuration → AMD PCIE Link Width (switch slot)
x16 (was x8/x8)
Bifurcation was splitting the slot; upstream link trained at Gen4 x8. Requires both SlimSAS 8i cables connected (each carries x8).
PCIe Link Speed (switch slot)
Gen4 (not Auto)
Blackwell Gen5 devices auto-negotiating down through the Gen4 switch could fail training and fall to Gen1. Forcing Gen4 stabilizes it.
ASPM
Disabled
ASPM L1 drops idle links to 2.5GT/s. This turned out to be the explanation for the "Gen1 downgraded" lspci readings — links were actually running Gen4 under load (verified via p2pBandwidthLatencyTest), but disabling ASPM removes the cosmetic scare and any re-train latency.
Re-Size BAR
Enabled
Required for full 96GB VRAM BAR exposure and GPU P2P.
SR-IOV
Disabled
Bare-metal inference; avoids IOMMU overhead and P2P interference.
Preferred IO
Auto
Optionally set Manual → bus 81 (the c-payne switch) for marginal latency gains, but left at Auto — it's a squeeze-more optimization, not a fix, and bus numbers shift after BIOS changes.
Reducing gain on the redriver
Per c-payne's advice, I did reduce the gain to "lvl 3" using his
tool , which was probably the most finicky part of
the process.
The gain level is going to be a function of how long your SAS connector cables are.
Picking the right SAS cables
I screwed up and ordered too few of the cables from c-payne directly, so I bought what
I thought was the same SAS cable off of Amazon. There was actually a slight difference
that was causing issues, and I had to reorder cables - so double-check that you're
getting the right stuff!
Kernel / GRUB Parameters
# /etc/default/grub
GRUB_CMDLINE_LINUX= " iommu=off amd_iommu=off nomodeset "
sudo update-grub
# nvidia_uvm P2P fix
echo ' options nvidia_uvm uvm_disable_hmm=1 ' | sudo tee /etc/modprobe.d/uvm.conf
sudo update-initramfs -u
Without iommu=off , NCCL hangs on multi-GPU P2P.
ACS Disable (critical for switch P2P)
With ACS enabled (default), P2P traffic gets bounced through the CPU root port
instead of staying inside the switch fabric, negating the switch entirely.
pcie_acs_override requires a patched kernel, so we disable via setpci at runtime.
# /usr/local/bin/disable-acs.sh
#! /bin/bash
if [ " $EUID " -ne 0 ] ; then
echo " ERROR: must be run as root "
exit 1
fi
for BDF in $( lspci -d " *:*:* " | awk ' {print $1} ' ) ; do
setpci -v -s ${BDF} ECAP_ACS+0x6.w > /dev/null 2>&1
if [ $? -ne 0 ] ; then
continue
fi
echo " Disabling ACS on $( lspci -s ${BDF} ) "
setpci -v -s ${BDF} ECAP_ACS+0x6.w=0000
done
Run on every boot via systemd oneshot:
# /etc/systemd/system/disable-acs.service
[Unit]
Description =Disable PCIe ACS for GPU P2P
After =multi-user.target
[Service]
Type =oneshot
ExecStart =/usr/local/bin/disable-acs.sh
[Install]
WantedBy =multi-user.target
Verify: lspci -vvv | grep ACSCtl should show all minus signs, and
nvidia-smi topo -m should show PIX between all four GPUs (not PHB/NODE).
Use ./tools/measure-gpu-speed.sh to measure this easily.
GPU Power Limiting
In order to avoid installing a 220V circuit, I (probably unwisely) run this rig on a
single 110V circuit, but I power regulate the cards.
Persistence mode + power cap applied at boot via systemd
(install-gpu-power-limit.sh):
sudo nvidia-smi -pm 1
sudo nvidia-smi -pl 350 # 350W per GPU (default 600W)
350W/GPU = 1,400W GPU load, sized for the PSU budget. During the interim
single-1700W-PSU phase (before the 240V circuit), cards ran at ~260W
(4×260 = 1,040W GPUs + ~280W system ≈ 1,320W total).
Verify: nvidia-smi --query-gpu=index,power.limit,power.draw --format=csv
Result
Upstream: Gen4 x16 (~30 GB/s to CPU). P2P through switch: 27.5 GB/s
unidirectional / 50.4 GB/s bidirectional, 0.37–0.45 µs latency , i.e. Gen4 line
rate. Note: lspci may still show downstream GPU links as "2.5GT/s (downgraded)"
at idle if ASPM is active anywhere; this is cosmetic. Links retrain to Gen4
under load.
Resources
A frequently updated repo on getting the most out of 4, 6, or 8 RTX 6000 Pro cards: https://github.com/local-inference-lab/rtx6kpro
Indie PCI switches that I use: https://c-payne.com
RTX6kPRO discord server; lotta guys benching and testing new models: https://discord.gg/QMNvFkuDN
About
Everything I know about running LLMs locally
Resources
Readme
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
400
stars
Watchers
watching
Forks
12
forks
Report repository
Releases
No releases published
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Shell
96.5%
Dockerfile
3.5%

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":12078,"paragraph_count":180,"sentence_count":78,"boilerplate_hits":2,"symbol_ratio":0.0059,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Jamesob 发布预算 $2k 到 $40k 的本地部署方案。$2k 方案用 2×RTX 3090（48GB VRAM）运行 Qwen3.6-27B 和 whisper-large-v3 语音转文字；$40k 方案用 4×RTX PRO 6000（384GB VRAM）、EPYC 7313P 系统及 c-payne PCIe Gen4 交换机，运行 GLM-5.2-Int8Mix-NVFP4-REAP-594B，在 240k 上下文窗口下约 80 t/s。所有模型通过 Docker 容器管理，配置位于 `runners/` 目录。指南还包含硬件选型、PCIe 拓扑、BIOS 参数及功耗限制等细节。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   jamesob local-llm Public Notifications You must be signed in to change notification settings Fork 12 Star 400 master Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 18 Commits 18 Commits images images runners runners tools tools README.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   md View all files Repository files navigation jamesob's guide to running SOTA LLMs locally Note: nothing in this README aside from the tables was written by AI.

4. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Have $2k burning a hole in your pocket and want some local, state-of-the-art machine intelligence?

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   If Dario and Altman are giving you heartburn (they should be), read on to figure out how to run this new kind of computing locally.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   In this repo you'll find the hardware I use to run SOTA locally, why I bought what and little-known secrets for configuring it, how I run speech-to-text (STT) locally, ready-to-run configuration for running models I think are good within Docker containers.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, GitHub, Amazon, Nvidia
- products: Claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 计费 / 预算管理, 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 财务 / 预算
- numbers: $2, $40, 2, 3090, 48, 3.6, 27B, 3
- quotes: directly / Gen1 downgraded /  iommu=off amd_iommu=off nomodeset  /  -ne 0 ] ; then
echo  / 
exit 1
fi
for BDF in $( lspci -d 

## evidence_seed

- company_actions: jamesob local-llm Public Notifications You must be signed in to change notification settings Fork 12 Star 400 master Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 18 Commits 18 Commits images images runners runners tools tools README. / md View all files Repository files navigation jamesob's guide to running SOTA LLMs locally Note: nothing in this README aside from the tables was written by AI. / If Dario and Altman are giving you heartburn (they should be), read on to figure out how to run this new kind of computing locally.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 5

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- emerging_pool
- user_feedback_pool
- watchlist

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
- discovery_record: {"discovery_title":"Jamesob 本地运行 SOTA 大语言模型指南","discovery_summary":"Jamesob 发布预算 $2k 到 $40k 的本地部署方案。$2k 方案用 2×RTX 3090（48GB VRAM）运行 Qwen3.6-27B 和 whisper-large-v3 语音转文字；$40k 方案用 4×RTX PRO 6000（384GB VRAM）、EPYC 7313P 系统及 c-payne PCIe Gen4 交换机，运行 GLM-5.2-Int8Mix-NVFP4-REAP-594B，在 240k 上下文窗口下约 80 t/s。所有模型通过 Docker 容器管理，配置位于 `runners/` 目录。指南还包含硬件选型、PCIe 拓扑、BIOS 参数及功耗限制等细节。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/jamesob/local-llm","discovered_at":"2026-07-04T03:11:32.653Z","rank_on_page":75,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Jamesob 发布预算 $2k 到 $40k 的本地部署方案。$2k 方案用 2×RTX 3090（48GB VRAM）运行 Qwen3.6-27B 和 whisper-large-v3 语音转文字；$40k 方案用 4×RTX PRO 6000（384GB VRAM）、EPYC 7313P 系统及 c-payne PCIe Gen4 交换机，运行 GLM-5.2-Int8Mix-NVFP4-REAP-594B，在 240k 上下文窗口下约 80 t/s。所有模型通过 Docker 容器管理，配置位于 `runners/` 目录。指南还包含硬件选型、PCIe 拓扑、BIOS 参数及功耗限制等细节。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
