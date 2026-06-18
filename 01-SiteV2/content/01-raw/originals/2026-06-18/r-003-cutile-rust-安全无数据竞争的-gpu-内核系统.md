---
schema_version: raw-evidence-v2
raw_id: R-003
title: "cuTile Rust：安全无数据竞争的 GPU 内核系统"
original_url: "https://github.com/nvlabs/cutile-rs"
canonical_url: "https://github.com/nvlabs/cutile-rs"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: developer
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
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
published_at: "2026-06-18T03:09:11.275Z"
collected_at: 2026-06-18T06:02:59.118Z
language: mixed
full_text_hash: 458b52d2290a66a6
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-18/r-003-cutile-rust-安全无数据竞争的-gpu-内核系统.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-18/r-003-cutile-rust-安全无数据竞争的-gpu-内核系统.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":9459,"paragraph_count":97,"sentence_count":56,"boilerplate_hits":2,"symbol_ratio":0.0127,"method":"main"}
has_full_text: true
content_length: 9459
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"458b52d2290a66a6","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"cuTile Rust：安全无数据竞争的 GPU 内核系统","discovery_summary":"cuTile Rust 是一个基于 tile 的 GPU 编程系统，允许用 Rust 编写内存安全、无数据竞争的内核。它通过 `#【cutile：：module】` 宏将内核 AST 嵌入主机二进制，在运行时经 CUDA Tile IR JIT 编译为 GPU cubin。可变张量在启动前分割，不可变张量共享，启动器在 GPU 工作期间保持所有权。在 NVIDIA B200 上，逐元素操作达 7 TB/s（约 91% 峰值带宽），GEMM 达 2 PFlop/s（约 92% 密集 f16 峰值）。基于 cuTile Rust 构建的 Grout 推理引擎在 RTX 5090 上解码 Qwen3-4B 达 171 tokens/s，在 B200 上解码 Qwen3-32B 达 82 tokens/s。项目处于早期研究阶段。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/nvlabs/cutile-rs","discovered_at":"2026-06-18T05:58:08.834Z","rank_on_page":48,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: f84a91804b44508b
content_hash: 458b52d2290a66a6
semantic_hash: bb76282d6fc6b1dd
duplicate_of: ""
first_seen_at: "2026-06-18T03:09:11.275Z"
last_seen_at: 2026-06-18T06:02:59.118Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","GitHub","Nvidia"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["计费 / 预算管理","权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["200","7","91%","2","92%","16","5090","3"],"quotes":[" /usr/local/cuda-13 "]}
evidence_seed: {"company_actions":["NVlabs cutile-rs Public Notifications You must be signed in to change notification settings Fork 34 Star 531 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 111 Commits 111 Commits .","github assets assets cuda-async cuda-async cuda-bindings cuda-bindings cuda-core cuda-core cuda-tile-rs cuda-tile-rs cutile-benchmarks cutile-benchmarks cutile-book cutile-book cutile-compiler cutile-compiler cutile-examples cutile-examples cutile-ir cutile-ir cutile-kernels cutile-kernels cutile-macro cutile-macro cutile cutile scripts scripts .","gitmodules CHANGELOG."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"cuTile Rust 是一个基于 tile 的 GPU 编程系统，允许用 Rust 编写内存安全、无数据竞争的内核。它通过 `#【cutile：：module】` 宏将内核 AST 嵌入主机二进制，在运行时经 CUDA Tile IR JIT 编译为 GPU cubin。可变张量在启动前分割，不可变张量共享，启动器在 GPU 工作期间保持所有权。在 NVIDIA B200 上，逐元素操作达 7 TB/s（约 91% 峰值带宽），GEMM 达 2 PFlop/s（约 92% 密集 f16 峰值）。基于 cuTile Rust 构建的 Grout 推理引擎在 RTX 5090 上解码 Qwen3-4B 达 171 tokens/s，在 B200 上解码 Qwen3-32B 达 82 tokens/s。项目处于早期研究阶段。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"NVlabs cutile-rs Public Notifications You must be signed in to change notification settings Fork 34 Star 531 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 111 Commits 111 Commits .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"github assets assets cuda-async cuda-async cuda-bindings cuda-bindings cuda-core cuda-core cuda-tile-rs cuda-tile-rs cutile-benchmarks cutile-benchmarks cutile-book cutile-book cutile-compiler cutile-compiler cutile-examples cutile-examples cutile-ir cutile-ir cutile-kernels cutile-kernels cutile-macro cutile-macro cutile cutile scripts scripts .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"gitmodules CHANGELOG.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"toml LICENSE-APACHE LICENSE-APACHE LICENSE-NVIDIA LICENSE-NVIDIA README.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"nix View all files Repository files navigation cuTile Rust ( cutile-rs ) is a tile-based system for writing memory-safe, data-race-free GPU kernels in idiomatic Rust.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# cuTile Rust：安全无数据竞争的 GPU 内核系统

## clean_text

NVlabs
cutile-rs
Public
Notifications
You must be signed in to change notification settings
Fork
34
Star
531
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
111 Commits
111 Commits
.github
.github
assets
assets
cuda-async
cuda-async
cuda-bindings
cuda-bindings
cuda-core
cuda-core
cuda-tile-rs
cuda-tile-rs
cutile-benchmarks
cutile-benchmarks
cutile-book
cutile-book
cutile-compiler
cutile-compiler
cutile-examples
cutile-examples
cutile-ir
cutile-ir
cutile-kernels
cutile-kernels
cutile-macro
cutile-macro
cutile
cutile
scripts
scripts
.gitignore
.gitignore
.gitmodules
.gitmodules
CHANGELOG.md
CHANGELOG.md
CONTRIBUTING.md
CONTRIBUTING.md
Cargo.lock
Cargo.lock
Cargo.toml
Cargo.toml
LICENSE-APACHE
LICENSE-APACHE
LICENSE-NVIDIA
LICENSE-NVIDIA
README.md
README.md
deny.toml
deny.toml
flake.lock
flake.lock
flake.nix
flake.nix
View all files
Repository files navigation
cuTile Rust ( cutile-rs ) is a tile-based system for writing memory-safe, data-race-free GPU kernels in idiomatic Rust. It extends Rust's ownership discipline across the GPU launch boundary: mutable tensors are partitioned into disjoint pieces before launch, immutable tensors are shared, and generated launchers preserve ownership while GPU work is in flight. The same model supports synchronous launches, asynchronous pipelines, and CUDA graph replay. The #[cutile::module] macro embeds a captured Rust AST for each kernel in the host binary; when a kernel is needed, cuTile Rust JIT-compiles that AST through CUDA Tile IR into a GPU cubin. Local opt-outs remain available when lower-level control is needed.
Project Status
We are excited to release this research project as a demonstration of how GPU programming can be made available in the Rust ecosystem. The software is in an early stage and under active development: you should expect bugs, incomplete features, and API breakage as we work to improve it. That being said, we hope you'll be interested to try it in your work and help shape its direction by providing feedback on your experience.
Please check out CONTRIBUTING.md if you're interested in contributing.
Quick Start
use cutile :: prelude :: * ;
# [ cutile :: module ]
mod kernel {
use cutile :: core :: * ;
# [ cutile :: entry ( ) ]
fn add < const B : i32 > (
z : & mut Tensor < f32 , { [ B ] } > ,
x : & Tensor < f32 , { [ - 1 ] } > ,
y : & Tensor < f32 , { [ - 1 ] } > ,
) {
let tx = load_tile_like ( x , z ) ;
let ty = load_tile_like ( y , z ) ;
z . store ( tx + ty ) ;
fn main ( ) -> Result < ( ) , Error > {
let x = api :: ones :: < f32 > ( & [ 1024 ] ) ;
let y = api :: ones :: < f32 > ( & [ 1024 ] ) ;
let z = api :: zeros :: < f32 > ( & [ 1024 ] ) . partition ( [ 128 ] ) ;
let ( _z , _x , _y ) = kernel :: add ( z , x , y ) . sync ( ) ? ;
Ok ( ( ) )
The #[cutile::module] macro transforms add into a GPU kernel and generates a host-side launcher. The host code constructs lazy tensor operations, partitions the mutable output into 128-element chunks, and calls .sync() to JIT-compile and execute the kernel.
The kernel signature carries the access discipline into device code: z is the exclusive mutable output, while x and y are shared read-only inputs. The body loads input tiles matching the output partition, adds them, and stores the result. The launch grid (8, 1, 1) is inferred from the partition: 1024÷128 = 8 tiles.
Run a similar example via cargo run -p cutile-examples --example saxpy .
More kernels and usage examples of the host-side API can be found here .
Paper
The cuTile Rust paper, Fearless Concurrency on the GPU , is available here . On NVIDIA B200, cuTile Rust reaches 7 TB/s for element-wise operations and 2 PFlop/s for GEMM, about 91% of peak memory bandwidth and 92% of dense f16 peak, respectively. The GEMM result is competitive with cuBLAS, and the B200 safety-overhead microbenchmarks show that cuTile Rust adds safety without measurable runtime overhead: safe Rust persistent GEMM reaches 2.07 PFlop/s at M=N=K=8192 (92% of the B200 dense f16 peak), within 0.3% of the corresponding low-level Tile IR variant.
The paper also evaluates Grout, a Qwen3 inference engine built with cuTile Rust in collaboration with Hugging Face. In batch-1 Qwen3 decode, Grout reaches 171 tokens/s for Qwen3-4B on NVIDIA GeForce RTX 5090 and 82 tokens/s for Qwen3-32B on B200, showing competitive state-of-the-art performance on memory-bound inference tasks as measured by our HBM roofline analysis.
Reproducibility artifacts for the paper evaluation are available here . The paper-facing measurements were run against cuTile Rust 0.2.0, and the version of Grout used for the paper is available here .
Citing
If you use cuTile Rust in research, please cite the paper:
@misc { elibol2026fearlessconcurrencygpu ,
title = { Fearless Concurrency on the GPU } ,
author = { Elibol, Melih and Roesch, Jared and Gelado, Isaac and Buehler, Eric and Garland, Michael } ,
year = { 2026 } ,
eprint = { 2606.15991 } ,
archivePrefix = { arXiv } ,
primaryClass = { cs.PL } ,
url = { https://arxiv.org/abs/2606.15991 }
Related Projects and References
Grout : Qwen 3 inference engine in Rust by Hugging Face, built with cuTile Rust and useful as a reference for production kernel call sites.
cuTile Python : Python kernel programming with CUDA Tile.
TileGym : CUDA Tile kernel examples and tuning patterns.
cuda-oxide : NVlabs experimental Rust-to-CUDA compiler for writing SIMT-style GPU kernels in Rust.
CUDA Tile IR documentation : CUDA Tile IR reference documentation.
CUDA documentation : CUDA toolkit documentation.
Rust NVPTX backend : rustc's target support for generating PTX for NVIDIA GPUs.
cuTile Rust targets tile-based kernels that lower through CUDA Tile IR, with APIs built around tensor partitions and tensor-core-oriented operations.
Setup
Requirements
NVIDIA GPU with compute capability sm_80 or higher (minimum supported architecture: sm_80 ).
sm_100+ is supported by CUDA 13.1+.
sm_8x support was added in CUDA 13.2.
CUDA 13.3 adds sm_90 support, so CUDA 13.3 users now have sm_80+ coverage.
CUDA 13.3 recommended ( sm_80+ support and CUDA Tile IR 13.3 features such as FP4 packing and block-scaled MMA).
Rust 1.89+
Linux (tested on Ubuntu 24.04)
Install
Rust
To install Rust:
curl --proto ' =https ' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
CUDA
Install CUDA 13.3 for your OS by following the official instructions:
https://developer.nvidia.com/cuda-downloads
Configure Environment
Set CUDA_TOOLKIT_PATH to your CUDA 13.3 install directory.
Example .cargo/config.toml :
[ env ]
CUDA_TOOLKIT_PATH = { value = " /usr/local/cuda-13 " , relative = false }
Verifying Installation
Run the hello world example:
cargo run -p cutile-examples --example hello_world
If everything works, you should see: Hello, I am tile <0, 0, 0> in a kernel with <1, 1, 1> tiles.
Via Nix
We provide a Nix flake for easy setup and development. Flakes must be enabled in your Nix configuration, if not already, add to ~/.config/nix/nix.conf :
experimental-features = nix-command flakes
Run a command directly:
nix develop -c cargo run -p cutile-examples --example saxpy
Or open an interactive shell:
nix develop
# cutile-rs dev shell
# ✓ CUDA /nix/store/...-cuda-toolkit-13.3
# ✓ Rust 1.90.0-nightly
The flake automatically locates host NVIDIA driver libraries on both NixOS and non-NixOS systems.
Tests
cuTile IR: cargo test --package cutile-ir
cuTile Rust Compiler: cargo test --package cutile-compiler
cuTile Rust Library: cargo test --package cutile
Examples: run an individual example, for example cargo run -p cutile-examples --example async_gemm
Benchmarks: cargo bench
Everything: ./scripts/run_all.sh (or pipe to a log file: ./scripts/run_all.sh 2>&1 | tee test_run.log )
Workspace Crates
cutile User-facing crate for authoring and executing tile kernels
├── cutile-macro
├── cutile-compiler
├── cuda-async
└── cuda-core
cutile-kernels Reusable cuTile Rust kernels
└── cutile
cutile-macro cuTile Rust proc-macro
└── cutile-compiler
cutile-compiler Compiles cuTile Rust kernels to executables
├── cutile-ir
├── cuda-async
└── cuda-core
cutile-ir Pure Rust Tile IR builder and bytecode writer
cuda-async Async CUDA execution via async Rust
└── cuda-core
cuda-core Idiomatic safe CUDA API
└── cuda-bindings
cuda-bindings NVIDIA CUDA bindings
License
The cuda-bindings crate is licensed under NVIDIA Software License: LICENSE-NVIDIA .
All other crates are licensed under the Apache License, Version 2.0 https://www.apache.org/licenses/LICENSE-2.0
About
cuTile Rust provides a safe, tile-based kernel programming DSL for the Rust programming language. It features a safe host-side API for passing tensors to asynchronously executed kernel functions.
nvlabs.github.io/cutile-rs/
Topics
rust
async
gpu
parallel-computing
cuda
nvidia
programming-languages
Resources
Readme
License
Apache-2.0, Unknown licenses found
Licenses found
Apache-2.0
LICENSE-APACHE
Unknown
LICENSE-NVIDIA
Contributing
Contributing
Uh oh!
There was an error while loading. Please reload this page .
Activity
Custom properties
Stars
531
stars
Watchers
watching
Forks
34
forks
Report repository
Releases
v0.2.0
Latest
Jun 16, 2026
+ 2 releases
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Rust
92.9%
Python
4.5%
Shell
1.7%
Cuda
0.3%
CSS
0.3%
Nix
0.1%
Other
0.2%

## full_text

NVlabs
cutile-rs
Public
Notifications
You must be signed in to change notification settings
Fork
34
Star
531
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
111 Commits
111 Commits
.github
.github
assets
assets
cuda-async
cuda-async
cuda-bindings
cuda-bindings
cuda-core
cuda-core
cuda-tile-rs
cuda-tile-rs
cutile-benchmarks
cutile-benchmarks
cutile-book
cutile-book
cutile-compiler
cutile-compiler
cutile-examples
cutile-examples
cutile-ir
cutile-ir
cutile-kernels
cutile-kernels
cutile-macro
cutile-macro
cutile
cutile
scripts
scripts
.gitignore
.gitignore
.gitmodules
.gitmodules
CHANGELOG.md
CHANGELOG.md
CONTRIBUTING.md
CONTRIBUTING.md
Cargo.lock
Cargo.lock
Cargo.toml
Cargo.toml
LICENSE-APACHE
LICENSE-APACHE
LICENSE-NVIDIA
LICENSE-NVIDIA
README.md
README.md
deny.toml
deny.toml
flake.lock
flake.lock
flake.nix
flake.nix
View all files
Repository files navigation
cuTile Rust ( cutile-rs ) is a tile-based system for writing memory-safe, data-race-free GPU kernels in idiomatic Rust. It extends Rust's ownership discipline across the GPU launch boundary: mutable tensors are partitioned into disjoint pieces before launch, immutable tensors are shared, and generated launchers preserve ownership while GPU work is in flight. The same model supports synchronous launches, asynchronous pipelines, and CUDA graph replay. The #[cutile::module] macro embeds a captured Rust AST for each kernel in the host binary; when a kernel is needed, cuTile Rust JIT-compiles that AST through CUDA Tile IR into a GPU cubin. Local opt-outs remain available when lower-level control is needed.
Project Status
We are excited to release this research project as a demonstration of how GPU programming can be made available in the Rust ecosystem. The software is in an early stage and under active development: you should expect bugs, incomplete features, and API breakage as we work to improve it. That being said, we hope you'll be interested to try it in your work and help shape its direction by providing feedback on your experience.
Please check out CONTRIBUTING.md if you're interested in contributing.
Quick Start
use cutile :: prelude :: * ;
# [ cutile :: module ]
mod kernel {
use cutile :: core :: * ;
# [ cutile :: entry ( ) ]
fn add < const B : i32 > (
z : & mut Tensor < f32 , { [ B ] } > ,
x : & Tensor < f32 , { [ - 1 ] } > ,
y : & Tensor < f32 , { [ - 1 ] } > ,
) {
let tx = load_tile_like ( x , z ) ;
let ty = load_tile_like ( y , z ) ;
z . store ( tx + ty ) ;
fn main ( ) -> Result < ( ) , Error > {
let x = api :: ones :: < f32 > ( & [ 1024 ] ) ;
let y = api :: ones :: < f32 > ( & [ 1024 ] ) ;
let z = api :: zeros :: < f32 > ( & [ 1024 ] ) . partition ( [ 128 ] ) ;
let ( _z , _x , _y ) = kernel :: add ( z , x , y ) . sync ( ) ? ;
Ok ( ( ) )
The #[cutile::module] macro transforms add into a GPU kernel and generates a host-side launcher. The host code constructs lazy tensor operations, partitions the mutable output into 128-element chunks, and calls .sync() to JIT-compile and execute the kernel.
The kernel signature carries the access discipline into device code: z is the exclusive mutable output, while x and y are shared read-only inputs. The body loads input tiles matching the output partition, adds them, and stores the result. The launch grid (8, 1, 1) is inferred from the partition: 1024÷128 = 8 tiles.
Run a similar example via cargo run -p cutile-examples --example saxpy .
More kernels and usage examples of the host-side API can be found here .
Paper
The cuTile Rust paper, Fearless Concurrency on the GPU , is available here . On NVIDIA B200, cuTile Rust reaches 7 TB/s for element-wise operations and 2 PFlop/s for GEMM, about 91% of peak memory bandwidth and 92% of dense f16 peak, respectively. The GEMM result is competitive with cuBLAS, and the B200 safety-overhead microbenchmarks show that cuTile Rust adds safety without measurable runtime overhead: safe Rust persistent GEMM reaches 2.07 PFlop/s at M=N=K=8192 (92% of the B200 dense f16 peak), within 0.3% of the corresponding low-level Tile IR variant.
The paper also evaluates Grout, a Qwen3 inference engine built with cuTile Rust in collaboration with Hugging Face. In batch-1 Qwen3 decode, Grout reaches 171 tokens/s for Qwen3-4B on NVIDIA GeForce RTX 5090 and 82 tokens/s for Qwen3-32B on B200, showing competitive state-of-the-art performance on memory-bound inference tasks as measured by our HBM roofline analysis.
Reproducibility artifacts for the paper evaluation are available here . The paper-facing measurements were run against cuTile Rust 0.2.0, and the version of Grout used for the paper is available here .
Citing
If you use cuTile Rust in research, please cite the paper:
@misc { elibol2026fearlessconcurrencygpu ,
title = { Fearless Concurrency on the GPU } ,
author = { Elibol, Melih and Roesch, Jared and Gelado, Isaac and Buehler, Eric and Garland, Michael } ,
year = { 2026 } ,
eprint = { 2606.15991 } ,
archivePrefix = { arXiv } ,
primaryClass = { cs.PL } ,
url = { https://arxiv.org/abs/2606.15991 }
Related Projects and References
Grout : Qwen 3 inference engine in Rust by Hugging Face, built with cuTile Rust and useful as a reference for production kernel call sites.
cuTile Python : Python kernel programming with CUDA Tile.
TileGym : CUDA Tile kernel examples and tuning patterns.
cuda-oxide : NVlabs experimental Rust-to-CUDA compiler for writing SIMT-style GPU kernels in Rust.
CUDA Tile IR documentation : CUDA Tile IR reference documentation.
CUDA documentation : CUDA toolkit documentation.
Rust NVPTX backend : rustc's target support for generating PTX for NVIDIA GPUs.
cuTile Rust targets tile-based kernels that lower through CUDA Tile IR, with APIs built around tensor partitions and tensor-core-oriented operations.
Setup
Requirements
NVIDIA GPU with compute capability sm_80 or higher (minimum supported architecture: sm_80 ).
sm_100+ is supported by CUDA 13.1+.
sm_8x support was added in CUDA 13.2.
CUDA 13.3 adds sm_90 support, so CUDA 13.3 users now have sm_80+ coverage.
CUDA 13.3 recommended ( sm_80+ support and CUDA Tile IR 13.3 features such as FP4 packing and block-scaled MMA).
Rust 1.89+
Linux (tested on Ubuntu 24.04)
Install
Rust
To install Rust:
curl --proto ' =https ' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
CUDA
Install CUDA 13.3 for your OS by following the official instructions:
https://developer.nvidia.com/cuda-downloads
Configure Environment
Set CUDA_TOOLKIT_PATH to your CUDA 13.3 install directory.
Example .cargo/config.toml :
[ env ]
CUDA_TOOLKIT_PATH = { value = " /usr/local/cuda-13 " , relative = false }
Verifying Installation
Run the hello world example:
cargo run -p cutile-examples --example hello_world
If everything works, you should see: Hello, I am tile <0, 0, 0> in a kernel with <1, 1, 1> tiles.
Via Nix
We provide a Nix flake for easy setup and development. Flakes must be enabled in your Nix configuration, if not already, add to ~/.config/nix/nix.conf :
experimental-features = nix-command flakes
Run a command directly:
nix develop -c cargo run -p cutile-examples --example saxpy
Or open an interactive shell:
nix develop
# cutile-rs dev shell
# ✓ CUDA /nix/store/...-cuda-toolkit-13.3
# ✓ Rust 1.90.0-nightly
The flake automatically locates host NVIDIA driver libraries on both NixOS and non-NixOS systems.
Tests
cuTile IR: cargo test --package cutile-ir
cuTile Rust Compiler: cargo test --package cutile-compiler
cuTile Rust Library: cargo test --package cutile
Examples: run an individual example, for example cargo run -p cutile-examples --example async_gemm
Benchmarks: cargo bench
Everything: ./scripts/run_all.sh (or pipe to a log file: ./scripts/run_all.sh 2>&1 | tee test_run.log )
Workspace Crates
cutile User-facing crate for authoring and executing tile kernels
├── cutile-macro
├── cutile-compiler
├── cuda-async
└── cuda-core
cutile-kernels Reusable cuTile Rust kernels
└── cutile
cutile-macro cuTile Rust proc-macro
└── cutile-compiler
cutile-compiler Compiles cuTile Rust kernels to executables
├── cutile-ir
├── cuda-async
└── cuda-core
cutile-ir Pure Rust Tile IR builder and bytecode writer
cuda-async Async CUDA execution via async Rust
└── cuda-core
cuda-core Idiomatic safe CUDA API
└── cuda-bindings
cuda-bindings NVIDIA CUDA bindings
License
The cuda-bindings crate is licensed under NVIDIA Software License: LICENSE-NVIDIA .
All other crates are licensed under the Apache License, Version 2.0 https://www.apache.org/licenses/LICENSE-2.0
About
cuTile Rust provides a safe, tile-based kernel programming DSL for the Rust programming language. It features a safe host-side API for passing tensors to asynchronously executed kernel functions.
nvlabs.github.io/cutile-rs/
Topics
rust
async
gpu
parallel-computing
cuda
nvidia
programming-languages
Resources
Readme
License
Apache-2.0, Unknown licenses found
Licenses found
Apache-2.0
LICENSE-APACHE
Unknown
LICENSE-NVIDIA
Contributing
Contributing
Uh oh!
There was an error while loading. Please reload this page .
Activity
Custom properties
Stars
531
stars
Watchers
watching
Forks
34
forks
Report repository
Releases
v0.2.0
Latest
Jun 16, 2026
+ 2 releases
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Rust
92.9%
Python
4.5%
Shell
1.7%
Cuda
0.3%
CSS
0.3%
Nix
0.1%
Other
0.2%

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":9459,"paragraph_count":97,"sentence_count":56,"boilerplate_hits":2,"symbol_ratio":0.0127,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   cuTile Rust 是一个基于 tile 的 GPU 编程系统，允许用 Rust 编写内存安全、无数据竞争的内核。它通过 `#【cutile：：module】` 宏将内核 AST 嵌入主机二进制，在运行时经 CUDA Tile IR JIT 编译为 GPU cubin。可变张量在启动前分割，不可变张量共享，启动器在 GPU 工作期间保持所有权。在 NVIDIA B200 上，逐元素操作达 7 TB/s（约 91% 峰值带宽），GEMM 达 2 PFlop/s（约 92% 密集 f16 峰值）。基于 cuTile Rust 构建的 Grout 推理引擎在 RTX 5090 上解码 Qwen3-4B 达 171 tokens/s，在 B200 上解码 Qwen3-32B 达 82 tokens/s。项目处于早期研究阶段。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   NVlabs cutile-rs Public Notifications You must be signed in to change notification settings Fork 34 Star 531 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 111 Commits 111 Commits .

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   github assets assets cuda-async cuda-async cuda-bindings cuda-bindings cuda-core cuda-core cuda-tile-rs cuda-tile-rs cutile-benchmarks cutile-benchmarks cutile-book cutile-book cutile-compiler cutile-compiler cutile-examples cutile-examples cutile-ir cutile-ir cutile-kernels cutile-kernels cutile-macro cutile-macro cutile cutile scripts scripts .

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   gitmodules CHANGELOG.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   toml LICENSE-APACHE LICENSE-APACHE LICENSE-NVIDIA LICENSE-NVIDIA README.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   nix View all files Repository files navigation cuTile Rust ( cutile-rs ) is a tile-based system for writing memory-safe, data-race-free GPU kernels in idiomatic Rust.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, GitHub, Nvidia
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 计费 / 预算管理, 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 200, 7, 91%, 2, 92%, 16, 5090, 3
- quotes:  /usr/local/cuda-13 

## evidence_seed

- company_actions: NVlabs cutile-rs Public Notifications You must be signed in to change notification settings Fork 34 Star 531 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 111 Commits 111 Commits . / github assets assets cuda-async cuda-async cuda-bindings cuda-bindings cuda-core cuda-core cuda-tile-rs cuda-tile-rs cutile-benchmarks cutile-benchmarks cutile-book cutile-book cutile-compiler cutile-compiler cutile-examples cutile-examples cutile-ir cutile-ir cutile-kernels cutile-kernels cutile-macro cutile-macro cutile cutile scripts scripts . / gitmodules CHANGELOG.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
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
- discovery_record: {"discovery_title":"cuTile Rust：安全无数据竞争的 GPU 内核系统","discovery_summary":"cuTile Rust 是一个基于 tile 的 GPU 编程系统，允许用 Rust 编写内存安全、无数据竞争的内核。它通过 `#【cutile：：module】` 宏将内核 AST 嵌入主机二进制，在运行时经 CUDA Tile IR JIT 编译为 GPU cubin。可变张量在启动前分割，不可变张量共享，启动器在 GPU 工作期间保持所有权。在 NVIDIA B200 上，逐元素操作达 7 TB/s（约 91% 峰值带宽），GEMM 达 2 PFlop/s（约 92% 密集 f16 峰值）。基于 cuTile Rust 构建的 Grout 推理引擎在 RTX 5090 上解码 Qwen3-4B 达 171 tokens/s，在 B200 上解码 Qwen3-32B 达 82 tokens/s。项目处于早期研究阶段。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/nvlabs/cutile-rs","discovered_at":"2026-06-18T05:58:08.834Z","rank_on_page":48,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

cuTile Rust 是一个基于 tile 的 GPU 编程系统，允许用 Rust 编写内存安全、无数据竞争的内核。它通过 `#【cutile：：module】` 宏将内核 AST 嵌入主机二进制，在运行时经 CUDA Tile IR JIT 编译为 GPU cubin。可变张量在启动前分割，不可变张量共享，启动器在 GPU 工作期间保持所有权。在 NVIDIA B200 上，逐元素操作达 7 TB/s（约 91% 峰值带宽），GEMM 达 2 PFlop/s（约 92% 密集 f16 峰值）。基于 cuTile Rust 构建的 Grout 推理引擎在 RTX 5090 上解码 Qwen3-4B 达 171 tokens/s，在 B200 上解码 Qwen3-32B 达 82 tokens/s。项目处于早期研究阶段。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
