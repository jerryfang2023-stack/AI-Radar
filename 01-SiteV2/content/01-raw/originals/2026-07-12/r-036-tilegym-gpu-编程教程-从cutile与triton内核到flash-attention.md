---
schema_version: raw-evidence-v2
raw_id: R-036
title: "TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention"
title_zh: "TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.marktechpost.com/2026/07/11/a-coding-guide-to-nvidias-tile-based-gpu-programming-from-cutile-and-triton-kernels-to-flash-attention"
canonical_url: "https://marktechpost.com/2026/07/11/a-coding-guide-to-nvidias-tile-based-gpu-programming-from-cutile-and-triton-kernels-to-flash-attention"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-12T00:01:06.000Z"
collected_at: 2026-07-12T06:10:50.093Z
language: mixed
full_text_hash: 37ba949a7354a85f
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-036-tilegym-gpu-编程教程-从cutile与triton内核到flash-attention.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-036-tilegym-gpu-编程教程-从cutile与triton内核到flash-attention.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":60000,"paragraph_count":599,"sentence_count":59,"boilerplate_hits":2,"symbol_ratio":0.0112,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 60000
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"37ba949a7354a85f","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention","discovery_summary":"本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/11/a-coding-guide-to-nvidias-tile-based-gpu-programming-from-cutile-and-triton-kernels-to-flash-attention","discovered_at":"2026-07-12T06:01:47.591Z","rank_on_page":43,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 7b122ad87442b2f7
content_hash: 0b219907879282b5
semantic_hash: 9af90c3b110df26f
duplicate_of: ""
first_seen_at: "2026-07-12T00:01:06.000Z"
last_seen_at: 2026-07-12T06:10:50.093Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["MarkTechPost（RSS）","GitHub","Nvidia"],"products":["Agent"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","合作 / 联盟"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["13.1","78","0","1","4","8","13","13x"],"quotes":["):\nprint("," * 78)\nif t: print(t)\nprint("," * 78)\nrule(",")\ntry:\nimport torch\nexcept ImportError:\nprint(",")\nos.system(f"]}
evidence_seed: {"company_actions":["We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack.","Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back.","We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking."],"case_details":["本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。"],"workflow_changes":["Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Applications Technology Staff Tutorials In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势"]
key_excerpts: [{"type":"case_detail","text":"本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Applications Technology Staff Tutorials In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"quote","text":"CUDA Environment Probe Copy Code Copied Use a different Browser import os, sys, math, time, textwrap def rule(t=\"\"): print(\"\\n\" + \"=\" * 78) if t: print(t) print(\"=\" * 78) rule(\"0.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T06:10:50.093Z
theme: outside-core-exploration
keyword_group: outside-core-exploration
copyright_note: local research archive only
---

# TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention

## clean_text

Editors Pick
Agentic AI
Artificial Intelligence
AI Infrastructure
Applications
Technology
Staff
Tutorials
In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions. We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack. Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back. We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking.
CUDA Environment Probe
Copy Code Copied Use a different Browser
import os, sys, math, time, textwrap
def rule(t=""):
print("\n" + "=" * 78)
if t: print(t)
print("=" * 78)
rule("0. ENVIRONMENT PROBE")
try:
import torch
except ImportError:
print("Installing torch ...")
os.system(f"{sys.executable} -m pip install -q torch")
import torch
HAS_CUDA = torch.cuda.is_available()
DEV = "cuda" if HAS_CUDA else "cpu"
cc = (0, 0)
if HAS_CUDA:
cc = torch.cuda.get_device_capability()
print(f"GPU : {torch.cuda.get_device_name(0)}")
print(f"Compute capability : {cc[0]}.{cc[1]}")
print(f"Torch CUDA runtime : {torch.version.cuda}")
print(f"Driver / torch : {torch.__version__}")
else:
print("No CUDA GPU found. In Colab: Runtime -> Change runtime type -> GPU (T4).")
print("The tutorial will still run its correctness math on CPU where possible.")
CUTILE_HW_OK = HAS_CUDA and cc[0] >= 8
CUDA_MAJOR = int((torch.version.cuda or "0").split(".")[0]) if HAS_CUDA else 0
CUTILE_TOOLKIT_OK = CUDA_MAJOR >= 13
rule("1. ATTEMPTING REAL cuTile (NVIDIA CUDA Tile) BACKEND")
ct = None
CUTILE_READY = False
if CUTILE_HW_OK and CUTILE_TOOLKIT_OK:
try:
import cuda.tile as ct
CUTILE_READY = True
print("cuda.tile is already importable.")
except Exception:
print("Installing cuda-tile[tileiras] (this can take a while)...")
os.system(f"{sys.executable} -m pip install -q 'cuda-tile[tileiras]' cupy-cuda13x")
try:
import cuda.tile as ct
CUTILE_READY = True
except Exception as e:
print("cuTile import still failed:", repr(e))
else:
reasons = []
if not HAS_CUDA: reasons.append("no CUDA GPU")
if HAS_CUDA and cc[0] < 8: reasons.append(f"compute capability {cc[0]}.{cc[1]} < 8.0 (Turing/T4 unsupported)")
if not CUTILE_TOOLKIT_OK: reasons.append(f"CUDA {torch.version.cuda} < 13.1 required by tileiras")
print("Skipping real cuTile install because:", "; ".join(reasons) + ".")
print("This is expected on a standard Colab T4 — we fall back to Triton below,")
print("which teaches the exact same tile-based programming model.")
if CUTILE_READY:
BACKEND = "cutile"
else:
try:
import triton, triton.language as tl
BACKEND = "triton" if HAS_CUDA else "torch"
except ImportError:
if HAS_CUDA:
print("Installing triton ...")
os.system(f"{sys.executable} -m pip install -q triton")
try:
import triton, triton.language as tl
BACKEND = "triton"
except Exception:
BACKEND = "torch"
else:
BACKEND = "torch"
rule(f"ACTIVE EXECUTION BACKEND: {BACKEND.upper()}")
print({
"cutile": "Running NVIDIA cuTile kernels on your Ampere+/CUDA13 GPU. Nice hardware!",
"triton": "Running Triton tile kernels on your GPU (the standard Colab path).",
"torch": "No usable GPU kernel backend; showing reference math on CPU only.",
}[BACKEND])
print(textwrap.dedent("""
------------------------------------------------------------------
SIMT (classic CUDA) | TILE model (cuTile / Triton)
------------------------------------------------------------------
You write code for ONE | You write code for ONE BLOCK that
thread. You compute a global | owns a whole TILE (e.g. 1024 elems
index, bounds-check it, and | or a 128x128 sub-matrix). You load
touch a single element. | the tile, do math on the WHOLE tile,
| store it. The compiler maps the tile
C[i] = A[i] + B[i] | onto threads / tensor cores for you.
------------------------------------------------------------------
cuTile primitives: ct.bid(0), ct.load(...), ct.store(...), a @ b, ct.launch
Triton primitives: tl.program_id, tl.load, tl.store, tl.dot, grid[...]
Same idea, two spellings. Below, every kernel is shown in BOTH.
"""))
CUTILE_SOURCE = {
"vector_add": '''
import cuda.tile as ct
@ct.kernel
def vector_add(a, b, c, tile_size: ct.Constant[int]):
pid = ct.bid(0)
a_tile = ct.load(a, index=(pid,), shape=(tile_size,))
b_tile = ct.load(b, index=(pid,), shape=(tile_size,))
ct.store(c, index=(pid,), tile=a_tile + b_tile)
''',
"matmul": '''
import cuda.tile as ct
@ct.kernel
def matmul(A, B, C, K: ct.Constant[int],
BM: ct.Constant[int], BN: ct.Constant[int], BK: ct.Constant[int]):
m, n = ct.bid(0), ct.bid(1)
acc = ct.zeros((BM, BN), dtype=ct.float32)
for k in range(ct.cdiv(K, BK)):
a = ct.load(A, index=(m, k), shape=(BM, BK))
b = ct.load(B, index=(k, n), shape=(BK, BN))
acc = a @ b + acc
ct.store(C, index=(m, n), tile=acc)
'''}
We begin by setting up the environment, importing the required libraries, and checking whether CUDA is available on the current runtime. We inspect the GPU capabilities, CUDA version, and PyTorch setup to determine whether the real cuTile backend is usable. We then select the active execution backend, explain the tile programming model, and store reference cuTile kernel source strings for comparison.
Defining Triton Kernels
Copy Code Copied Use a different Browser
if BACKEND == "triton":
@triton.jit
def _vadd_kernel(a_ptr, b_ptr, c_ptr, n, BLOCK: tl.constexpr):
pid = tl.program_id(0)
offs = pid * BLOCK + tl.arange(0, BLOCK)
mask = offs < n
a = tl.load(a_ptr + offs, mask=mask)
b = tl.load(b_ptr + offs, mask=mask)
tl.store(c_ptr + offs, a + b, mask=mask)
@triton.jit
def _fused_gelu_kernel(x_ptr, w_ptr, b_ptr, o_ptr, n, BLOCK: tl.constexpr):
pid = tl.program_id(0)
offs = pid * BLOCK + tl.arange(0, BLOCK)
mask = offs < n
x = tl.load(x_ptr + offs, mask=mask)
w = tl.load(w_ptr + offs, mask=mask)
b = tl.load(b_ptr + offs, mask=mask)
h = x * w + b
c = 0.7978845608028654
z = c * (h + 0.044715 * h * h * h)
e = tl.exp(-2.0 * z)
tanh = (1.0 - e) / (1.0 + e)
g = 0.5 * h * (1.0 + tanh)
tl.store(o_ptr + offs, g, mask=mask)
@triton.jit
def _softmax_kernel(x_ptr, o_ptr, stride, n_cols, BLOCK: tl.constexpr):
row = tl.program_id(0)
cols = tl.arange(0, BLOCK)
mask = cols < n_cols
ptr = x_ptr + row * stride + cols
x = tl.load(ptr, mask=mask, other=-float("inf"))
x = x - tl.max(x, axis=0)
num = tl.exp(x)
den = tl.sum(num, axis=0)
tl.store(o_ptr + row * stride + cols, num / den, mask=mask)
@triton.jit
def _matmul_kernel(A, B, C, M, N, K,
sam, sak, sbk, sbn, scm, scn,
BM: tl.constexpr, BN: tl.constexpr, BK: tl.constexpr):
pid_m = tl.program_id(0)
pid_n = tl.program_id(1)
offs_m = pid_m * BM + tl.arange(0, BM)
offs_n = pid_n * BN + tl.arange(0, BN)
offs_k = tl.arange(0, BK)
a_ptr = A + offs_m[:, None] * sam + offs_k[None, :] * sak
b_ptr = B + offs_k[:, None] * sbk + offs_n[None, :] * sbn
acc = tl.zeros((BM, BN), dtype=tl.float32)
for k in range(0, K, BK):
a = tl.load(a_ptr, mask=offs_k[None, :] < K - k, other=0.0)
b = tl.load(b_ptr, mask=offs_k[:, None] < K - k, other=0.0)
acc += tl.dot(a, b)
a_ptr += BK * sak
b_ptr += BK * sbk
c_ptr = C + offs_m[:, None] * scm + offs_n[None, :] * scn
cmask = (offs_m[:, None] < M) & (offs_n[None, :] < N)
tl.store(c_ptr, acc.to(C.dtype.element_ty), mask=cmask)
@triton.jit
def _flash_kernel(Q, K, V, O, sqz, skz, svz, soz,
L, D, scale,
BL: tl.constexpr, BD: tl.constexpr):
pid_l = tl.program_id(0)
z = tl.program_id(1)
offs_l = pid_l * BL + tl.arange(0, BL)
offs_d = tl.arange(0, BD)
q_ptr = Q + z * sqz + offs_l[:, None] * D + offs_d[None, :]
q = tl.load(q_ptr, mask=offs_l[:, None] < L, other=0.0)
m_i = tl.full((BL,), -float("inf"), dtype=tl.float32)
l_i = tl.zeros((BL,), dtype=tl.float32)
acc = tl.zeros((BL, BD), dtype=tl.float32)
for start in range(0, L, BL):
offs_k = start + tl.arange(0, BL)
k_ptr = K + z * skz + offs_k[:, None] * D + offs_d[None, :]
v_ptr = V + z * svz + offs_k[:, None] * D + offs_d[None, :]
k = tl.load(k_ptr, mask=offs_k[:, None] < L, other=0.0)
v = tl.load(v_ptr, mask=offs_k[:, None] < L, other=0.0)
s = tl.dot(q, tl.trans(k)) * scale
s = tl.where(offs_k[None, :] < L, s, -float("inf"))
m_ij = tl.maximum(m_i, tl.max(s, axis=1))
p = tl.exp(s - m_ij[:, None])
alpha = tl.exp(m_i - m_ij)
l_i = l_i * alpha + tl.sum(p, axis=1)
acc = acc * alpha[:, None] + tl.dot(p.to(v.dtype), v)
m_i = m_ij
acc = acc / l_i[:, None]
o_ptr = O + z * soz + offs_l[:, None] * D + offs_d[None, :]
tl.store(o_ptr, acc.to(O.dtype.element_ty), mask=offs_l[:, None] < L)
def run_vadd(a, b):
c = torch.empty_like(a); n = a.numel()
grid = (triton.cdiv(n, 1024),)
_vadd_kernel[grid](a, b, c, n, BLOCK=1024)
return c
def run_fused_gelu(x, w, b):
o = torch.empty_like(x); n = x.numel()
grid = (triton.cdiv(n, 1024),)
_fused_gelu_kernel[grid](x, w, b, o, n, BLOCK=1024)
return o
def run_softmax(x):
m, ncols = x.shape
o = torch.empty_like(x)
BLOCK = triton.next_power_of_2(ncols)
_softmax_kernel[(m,)](x, o, x.stride(0), ncols, BLOCK=BLOCK)
return o
def run_matmul(a, b):
M, K = a.shape; K2, N = b.shape
c = torch.empty((M, N), device=a.device, dtype=a.dtype)
BM = BN = 64; BK = 32
grid = (triton.cdiv(M, BM), triton.cdiv(N, BN))
_matmul_kernel[grid](a, b, c, M, N, K,
a.stride(0), a.stride(1), b.stride(0), b.stride(1),
c.stride(0), c.stride(1), BM=BM, BN=BN, BK=BK)
return c
def run_flash(q, k, v):
Z, L, D = q.shape
o = torch.empty_like(q)
scale = 1.0 / math.sqrt(D)
BL = 64
grid = (triton.cdiv(L, BL), Z)
_flash_kernel[grid](q, k, v, o,
q.stride(0), k.stride(0), v.stride(0), o.stride(0),
L, D, scale, BL=BL, BD=D)
return o
else:
def run_vadd(a, b): return a + b
def run_fused_gelu(x, w, b): return torch.nn.functional.gelu(x * w + b, approximate="tanh")
def run_softmax(x): return torch.softmax(x, dim=-1)
def run_matmul(a, b): return a @ b
def run_flash(q, k, v): return torch.nn.functional.scaled_dot_product_attention(q, k, v)
We define the Triton implementations for vector addition, fused GELU, row softmax, tiled matrix multiplication, and flash attention. We express each operation using tile-level loads, computations, reductions, dot products, and stores, so that the GPU can handle blocks of data efficiently. We also provide pure PyTorch fallback functions so the tutorial still runs when Triton or a supported GPU backend is unavailable.
Vector Add and GELU
Copy Code Copied Use a different Browser
def bench(fn, *a, iters=50, warmup=10):
if HAS_CUDA:
for _ in range(warmup): fn(*a)
torch.cuda.synchronize()
t0 = time.perf_counter()
for _ in range(iters): fn(*a)
torch.cuda.synchronize()
return (time.perf_counter() - t0) / iters * 1e3
else:
t0 = time.perf_counter()
for _ in range(iters): fn(*a)
return (time.perf_counter() - t0) / iters * 1e3
def check(name, got, ref, atol=1e-2, rtol=1e-2):
got = got.float().cpu(); ref = ref.float().cpu()
ok = torch.allclose(got, ref, atol=atol, rtol=rtol)
md = (got - ref).abs().max().item()
print(f" correctness [{name:12s}] : {'PASS' if ok else 'FAIL'} (max abs diff {md:.2e})")
return ok
dtype = torch.float16 if HAS_CUDA else torch.float32
rule("KERNEL 1 — VECTOR ADD (load tile -> add -> store tile)")
print("cuTile version of this kernel:\n" + CUTILE_SOURCE["vector_add"])
n = 1 << 20
a = torch.randn(n, device=DEV, dtype=torch.float32)
b = torch.randn(n, device=DEV, dtype=torch.float32)
check("vector_add", run_vadd(a, b), a + b)
if BACKEND != "torch":
print(f" {BACKEND} time: {bench(run_vadd, a, b):.4f} ms torch: {bench(lambda x,y:x+y, a, b):.4f} ms")
rule("KERNEL 2 — FUSED GELU(x*w + b) (three ops fused into one memory pass)")
x = torch.randn(n, device=DEV, dtype=torch.float32)
w = torch.randn(n, device=DEV, dtype=torch.float32)
bb = torch.randn(n, device=DEV, dtype=torch.float32)
ref = torch.nn.functional.gelu(x * w + bb, approximate="tanh")
check("fused_gelu", run_fused_gelu(x, w, bb), ref)
if BACKEND != "torch":
torch_fn = lambda x,w,b: torch.nn.functional.gelu(x*w+b, approximate="tanh")
print(f" {BACKEND} (1 pass): {bench(run_fused_gelu, x, w, bb):.4f} ms "
f"torch (3 passes): {bench(torch_fn, x, w, bb):.4f} ms")
We build benchmarking and correctness-checking utilities that compare each custom kernel against a PyTorch reference implementation. We then run the vector-addition kernel and verify that the tile-based output matches the standard PyTorch addition. We also test the fused GELU kernel, demonstrating how multiplication, bias addition, and GELU activation are combined into a single efficient pass.
Softmax and Tiled Matmul
Copy Code Copied Use a different Browser
rule("KERNEL 3 — ROW SOFTMAX (tile reductions: max then sum, numerically stable)")
rows, cols = 4096, 1024
x = torch.randn(rows, cols, device=DEV, dtype=torch.float32)
check("softmax", run_softmax(x), torch.softmax(x, dim=-1))
if BACKEND != "torch":
print(f" {BACKEND} time: {bench(run_softmax, x):.4f} ms "
f"torch: {bench(lambda z: torch.softmax(z,-1), x):.4f} ms")
rule("KERNEL 4 — TILED MATMUL (K-loop accumulation -> tensor cores)")
print("cuTile version of this kernel:\n" + CUTILE_SOURCE["matmul"])
M = N = K = 1024
a = torch.randn(M, K, device=DEV, dtype=dtype)
b = torch.randn(K, N, device=DEV, dtype=dtype)
check("matmul", run_matmul(a, b), a @ b, atol=1e-1, rtol=1e-1)
if BACKEND != "torch":
t = bench(run_matmul, a, b)
flops = 2 * M * N * K
print(f" {BACKEND}: {t:.4f} ms ({flops/ (t*1e-3) / 1e12:.2f} TFLOP/s) "
f"torch: {bench(lambda x,y:x@y, a, b):.4f} ms")
We run the row-wise softmax kernel and compare it against PyTorch’s softmax to verify numerical correctness. We then perform tiled matrix multiplication, multiplying matrix blocks and accumulating along the K dimension. We benchmark these kernels against PyTorch to observe how tile-based execution performs on the active backend.
Flash Attention Kernel
Copy Code Copied Use a different Browser
rule("KERNEL 5 — FLASH ATTENTION (online softmax; the advanced capstone)")
Z, L, D = 8, 512, 64
q = torch.randn(Z, L, D, device=DEV, dtype=dtype)
k = torch.randn(Z, L, D, device=DEV, dtype=dtype)
v = torch.randn(Z, L, D, device=DEV, dtype=dtype)
ref = torch.nn.functional.scaled_dot_product_attention(q, k, v)
check("flash_attn", run_flash(q, k, v), ref, atol=2e-2, rtol=2e-2)
if BACKEND != "torch":
sdpa = lambda q,k,v: torch.nn.functional.scaled_dot_product_attention(q,k,v)
print(f" {BACKEND}: {bench(run_flash, q, k, v):.4f} ms "
f"torch sdpa: {bench(sdpa, q, k, v):.4f} ms")
rule("DONE")
print(f"""
Summary
-------
Backend that ran : {BACKEND}
What you learned : the tile programming model (whole-tile load/compute/store),
fusion, tile reductions, K-loop matmul on tensor cores, and
an online-softmax flash-attention kernel.
To run the REAL cuTile kernels shown above you need CUDA 13.1+ and an
Ampere/Ada/Blackwell GPU. On such a machine:
pip install 'cuda-tile[tileiras]' cupy-cuda13x
pip install tilegym[tileiras]
Then the strings in CUTILE_SOURCE run as-is via ct.launch(...).
""")
We finish with the flash attention kernel, which applies online softmax to compute attention without materializing the full attention matrix. We compare its output to PyTorch’s scaled dot-product attention and benchmark runtime performance when a GPU backend is available. We close the tutorial by summarizing the backend we used and the main tile programming concepts we learned.
Conclusion
In conclusion, we understood how tile-based kernels map high-level mathematical operations onto efficient GPU execution patterns. We saw how fusion reduces memory traffic, how tile reductions stabilize and make softmax efficient, how tiled matrix multiplication accumulates over K-blocks, and how flash attention uses online softmax to avoid materializing the full attention matrix. We also gained a path for experimentation: we ran Triton kernels on common Colab GPUs today while still seeing how the same concepts translate to real cuTile kernels on newer CUDA 13.1+ Ampere, Ada, or Blackwell systems.
Check out the Full Codes with Notebook . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
How to Build a T4-Friendly Autonomous Data Science Agent with DeepAnalyze-8B, Sandboxed Code Execution, and Iterative Analysis
Sana Hassan
Datalab Lift vs the Field: How a 9B Schema-First Extractor Compares with NuExtract3, LlamaExtract, Marker, and Docling
Sana Hassan
NVIDIA’s Cosmos-Framework Tutorial: Designing a Colab-Friendly Miniature of Cosmos 3 World Models with Omnimodal Mixture-of-Transformers
Sana Hassan
Building a Scaffold-Split Random Forest QSAR Co-Scientist for EGFR Inhibitor Discovery Using ChEMBL, RDKit, SHAP, and BRICS
Sana Hassan
Training Gemma-3 for Structured Mathematical Reasoning with Tunix GRPO, LoRA Adapters, and GSM8K Rewards
Sana Hassan
Designing a Schema-Guided Invoice Intelligence Pipeline with lift-pdf for Accounts-Payable Extraction, Validation, and Ledger Generation
Sana Hassan
RAG-Anything Tutorial: Build a Multimodal Retrieval Pipeline for Text, Tables, Equations, and Images in Colab
Sana Hassan
Using Lift to Turn Research PDFs into Structured JSON with Controlled, Schema-Guided Field-Level Evaluation
Sana Hassan
CUP (Common Useful Python): Building Reliable Python Workflows with Baidu’s Utility Toolkit
Sana Hassan
PyGraphistry Implementation Workflow for Interactive Graph Intelligence P

## full_text

Editors Pick
Agentic AI
Artificial Intelligence
AI Infrastructure
Applications
Technology
Staff
Tutorials
In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions. We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack. Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back. We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking.
CUDA Environment Probe
Copy Code Copied Use a different Browser
import os, sys, math, time, textwrap
def rule(t=""):
print("\n" + "=" * 78)
if t: print(t)
print("=" * 78)
rule("0. ENVIRONMENT PROBE")
try:
import torch
except ImportError:
print("Installing torch ...")
os.system(f"{sys.executable} -m pip install -q torch")
import torch
HAS_CUDA = torch.cuda.is_available()
DEV = "cuda" if HAS_CUDA else "cpu"
cc = (0, 0)
if HAS_CUDA:
cc = torch.cuda.get_device_capability()
print(f"GPU : {torch.cuda.get_device_name(0)}")
print(f"Compute capability : {cc[0]}.{cc[1]}")
print(f"Torch CUDA runtime : {torch.version.cuda}")
print(f"Driver / torch : {torch.__version__}")
else:
print("No CUDA GPU found. In Colab: Runtime -> Change runtime type -> GPU (T4).")
print("The tutorial will still run its correctness math on CPU where possible.")
CUTILE_HW_OK = HAS_CUDA and cc[0] >= 8
CUDA_MAJOR = int((torch.version.cuda or "0").split(".")[0]) if HAS_CUDA else 0
CUTILE_TOOLKIT_OK = CUDA_MAJOR >= 13
rule("1. ATTEMPTING REAL cuTile (NVIDIA CUDA Tile) BACKEND")
ct = None
CUTILE_READY = False
if CUTILE_HW_OK and CUTILE_TOOLKIT_OK:
try:
import cuda.tile as ct
CUTILE_READY = True
print("cuda.tile is already importable.")
except Exception:
print("Installing cuda-tile[tileiras] (this can take a while)...")
os.system(f"{sys.executable} -m pip install -q 'cuda-tile[tileiras]' cupy-cuda13x")
try:
import cuda.tile as ct
CUTILE_READY = True
except Exception as e:
print("cuTile import still failed:", repr(e))
else:
reasons = []
if not HAS_CUDA: reasons.append("no CUDA GPU")
if HAS_CUDA and cc[0] < 8: reasons.append(f"compute capability {cc[0]}.{cc[1]} < 8.0 (Turing/T4 unsupported)")
if not CUTILE_TOOLKIT_OK: reasons.append(f"CUDA {torch.version.cuda} < 13.1 required by tileiras")
print("Skipping real cuTile install because:", "; ".join(reasons) + ".")
print("This is expected on a standard Colab T4 — we fall back to Triton below,")
print("which teaches the exact same tile-based programming model.")
if CUTILE_READY:
BACKEND = "cutile"
else:
try:
import triton, triton.language as tl
BACKEND = "triton" if HAS_CUDA else "torch"
except ImportError:
if HAS_CUDA:
print("Installing triton ...")
os.system(f"{sys.executable} -m pip install -q triton")
try:
import triton, triton.language as tl
BACKEND = "triton"
except Exception:
BACKEND = "torch"
else:
BACKEND = "torch"
rule(f"ACTIVE EXECUTION BACKEND: {BACKEND.upper()}")
print({
"cutile": "Running NVIDIA cuTile kernels on your Ampere+/CUDA13 GPU. Nice hardware!",
"triton": "Running Triton tile kernels on your GPU (the standard Colab path).",
"torch": "No usable GPU kernel backend; showing reference math on CPU only.",
}[BACKEND])
print(textwrap.dedent("""
------------------------------------------------------------------
SIMT (classic CUDA) | TILE model (cuTile / Triton)
------------------------------------------------------------------
You write code for ONE | You write code for ONE BLOCK that
thread. You compute a global | owns a whole TILE (e.g. 1024 elems
index, bounds-check it, and | or a 128x128 sub-matrix). You load
touch a single element. | the tile, do math on the WHOLE tile,
| store it. The compiler maps the tile
C[i] = A[i] + B[i] | onto threads / tensor cores for you.
------------------------------------------------------------------
cuTile primitives: ct.bid(0), ct.load(...), ct.store(...), a @ b, ct.launch
Triton primitives: tl.program_id, tl.load, tl.store, tl.dot, grid[...]
Same idea, two spellings. Below, every kernel is shown in BOTH.
"""))
CUTILE_SOURCE = {
"vector_add": '''
import cuda.tile as ct
@ct.kernel
def vector_add(a, b, c, tile_size: ct.Constant[int]):
pid = ct.bid(0)
a_tile = ct.load(a, index=(pid,), shape=(tile_size,))
b_tile = ct.load(b, index=(pid,), shape=(tile_size,))
ct.store(c, index=(pid,), tile=a_tile + b_tile)
''',
"matmul": '''
import cuda.tile as ct
@ct.kernel
def matmul(A, B, C, K: ct.Constant[int],
BM: ct.Constant[int], BN: ct.Constant[int], BK: ct.Constant[int]):
m, n = ct.bid(0), ct.bid(1)
acc = ct.zeros((BM, BN), dtype=ct.float32)
for k in range(ct.cdiv(K, BK)):
a = ct.load(A, index=(m, k), shape=(BM, BK))
b = ct.load(B, index=(k, n), shape=(BK, BN))
acc = a @ b + acc
ct.store(C, index=(m, n), tile=acc)
'''}
We begin by setting up the environment, importing the required libraries, and checking whether CUDA is available on the current runtime. We inspect the GPU capabilities, CUDA version, and PyTorch setup to determine whether the real cuTile backend is usable. We then select the active execution backend, explain the tile programming model, and store reference cuTile kernel source strings for comparison.
Defining Triton Kernels
Copy Code Copied Use a different Browser
if BACKEND == "triton":
@triton.jit
def _vadd_kernel(a_ptr, b_ptr, c_ptr, n, BLOCK: tl.constexpr):
pid = tl.program_id(0)
offs = pid * BLOCK + tl.arange(0, BLOCK)
mask = offs < n
a = tl.load(a_ptr + offs, mask=mask)
b = tl.load(b_ptr + offs, mask=mask)
tl.store(c_ptr + offs, a + b, mask=mask)
@triton.jit
def _fused_gelu_kernel(x_ptr, w_ptr, b_ptr, o_ptr, n, BLOCK: tl.constexpr):
pid = tl.program_id(0)
offs = pid * BLOCK + tl.arange(0, BLOCK)
mask = offs < n
x = tl.load(x_ptr + offs, mask=mask)
w = tl.load(w_ptr + offs, mask=mask)
b = tl.load(b_ptr + offs, mask=mask)
h = x * w + b
c = 0.7978845608028654
z = c * (h + 0.044715 * h * h * h)
e = tl.exp(-2.0 * z)
tanh = (1.0 - e) / (1.0 + e)
g = 0.5 * h * (1.0 + tanh)
tl.store(o_ptr + offs, g, mask=mask)
@triton.jit
def _softmax_kernel(x_ptr, o_ptr, stride, n_cols, BLOCK: tl.constexpr):
row = tl.program_id(0)
cols = tl.arange(0, BLOCK)
mask = cols < n_cols
ptr = x_ptr + row * stride + cols
x = tl.load(ptr, mask=mask, other=-float("inf"))
x = x - tl.max(x, axis=0)
num = tl.exp(x)
den = tl.sum(num, axis=0)
tl.store(o_ptr + row * stride + cols, num / den, mask=mask)
@triton.jit
def _matmul_kernel(A, B, C, M, N, K,
sam, sak, sbk, sbn, scm, scn,
BM: tl.constexpr, BN: tl.constexpr, BK: tl.constexpr):
pid_m = tl.program_id(0)
pid_n = tl.program_id(1)
offs_m = pid_m * BM + tl.arange(0, BM)
offs_n = pid_n * BN + tl.arange(0, BN)
offs_k = tl.arange(0, BK)
a_ptr = A + offs_m[:, None] * sam + offs_k[None, :] * sak
b_ptr = B + offs_k[:, None] * sbk + offs_n[None, :] * sbn
acc = tl.zeros((BM, BN), dtype=tl.float32)
for k in range(0, K, BK):
a = tl.load(a_ptr, mask=offs_k[None, :] < K - k, other=0.0)
b = tl.load(b_ptr, mask=offs_k[:, None] < K - k, other=0.0)
acc += tl.dot(a, b)
a_ptr += BK * sak
b_ptr += BK * sbk
c_ptr = C + offs_m[:, None] * scm + offs_n[None, :] * scn
cmask = (offs_m[:, None] < M) & (offs_n[None, :] < N)
tl.store(c_ptr, acc.to(C.dtype.element_ty), mask=cmask)
@triton.jit
def _flash_kernel(Q, K, V, O, sqz, skz, svz, soz,
L, D, scale,
BL: tl.constexpr, BD: tl.constexpr):
pid_l = tl.program_id(0)
z = tl.program_id(1)
offs_l = pid_l * BL + tl.arange(0, BL)
offs_d = tl.arange(0, BD)
q_ptr = Q + z * sqz + offs_l[:, None] * D + offs_d[None, :]
q = tl.load(q_ptr, mask=offs_l[:, None] < L, other=0.0)
m_i = tl.full((BL,), -float("inf"), dtype=tl.float32)
l_i = tl.zeros((BL,), dtype=tl.float32)
acc = tl.zeros((BL, BD), dtype=tl.float32)
for start in range(0, L, BL):
offs_k = start + tl.arange(0, BL)
k_ptr = K + z * skz + offs_k[:, None] * D + offs_d[None, :]
v_ptr = V + z * svz + offs_k[:, None] * D + offs_d[None, :]
k = tl.load(k_ptr, mask=offs_k[:, None] < L, other=0.0)
v = tl.load(v_ptr, mask=offs_k[:, None] < L, other=0.0)
s = tl.dot(q, tl.trans(k)) * scale
s = tl.where(offs_k[None, :] < L, s, -float("inf"))
m_ij = tl.maximum(m_i, tl.max(s, axis=1))
p = tl.exp(s - m_ij[:, None])
alpha = tl.exp(m_i - m_ij)
l_i = l_i * alpha + tl.sum(p, axis=1)
acc = acc * alpha[:, None] + tl.dot(p.to(v.dtype), v)
m_i = m_ij
acc = acc / l_i[:, None]
o_ptr = O + z * soz + offs_l[:, None] * D + offs_d[None, :]
tl.store(o_ptr, acc.to(O.dtype.element_ty), mask=offs_l[:, None] < L)
def run_vadd(a, b):
c = torch.empty_like(a); n = a.numel()
grid = (triton.cdiv(n, 1024),)
_vadd_kernel[grid](a, b, c, n, BLOCK=1024)
return c
def run_fused_gelu(x, w, b):
o = torch.empty_like(x); n = x.numel()
grid = (triton.cdiv(n, 1024),)
_fused_gelu_kernel[grid](x, w, b, o, n, BLOCK=1024)
return o
def run_softmax(x):
m, ncols = x.shape
o = torch.empty_like(x)
BLOCK = triton.next_power_of_2(ncols)
_softmax_kernel[(m,)](x, o, x.stride(0), ncols, BLOCK=BLOCK)
return o
def run_matmul(a, b):
M, K = a.shape; K2, N = b.shape
c = torch.empty((M, N), device=a.device, dtype=a.dtype)
BM = BN = 64; BK = 32
grid = (triton.cdiv(M, BM), triton.cdiv(N, BN))
_matmul_kernel[grid](a, b, c, M, N, K,
a.stride(0), a.stride(1), b.stride(0), b.stride(1),
c.stride(0), c.stride(1), BM=BM, BN=BN, BK=BK)
return c
def run_flash(q, k, v):
Z, L, D = q.shape
o = torch.empty_like(q)
scale = 1.0 / math.sqrt(D)
BL = 64
grid = (triton.cdiv(L, BL), Z)
_flash_kernel[grid](q, k, v, o,
q.stride(0), k.stride(0), v.stride(0), o.stride(0),
L, D, scale, BL=BL, BD=D)
return o
else:
def run_vadd(a, b): return a + b
def run_fused_gelu(x, w, b): return torch.nn.functional.gelu(x * w + b, approximate="tanh")
def run_softmax(x): return torch.softmax(x, dim=-1)
def run_matmul(a, b): return a @ b
def run_flash(q, k, v): return torch.nn.functional.scaled_dot_product_attention(q, k, v)
We define the Triton implementations for vector addition, fused GELU, row softmax, tiled matrix multiplication, and flash attention. We express each operation using tile-level loads, computations, reductions, dot products, and stores, so that the GPU can handle blocks of data efficiently. We also provide pure PyTorch fallback functions so the tutorial still runs when Triton or a supported GPU backend is unavailable.
Vector Add and GELU
Copy Code Copied Use a different Browser
def bench(fn, *a, iters=50, warmup=10):
if HAS_CUDA:
for _ in range(warmup): fn(*a)
torch.cuda.synchronize()
t0 = time.perf_counter()
for _ in range(iters): fn(*a)
torch.cuda.synchronize()
return (time.perf_counter() - t0) / iters * 1e3
else:
t0 = time.perf_counter()
for _ in range(iters): fn(*a)
return (time.perf_counter() - t0) / iters * 1e3
def check(name, got, ref, atol=1e-2, rtol=1e-2):
got = got.float().cpu(); ref = ref.float().cpu()
ok = torch.allclose(got, ref, atol=atol, rtol=rtol)
md = (got - ref).abs().max().item()
print(f" correctness [{name:12s}] : {'PASS' if ok else 'FAIL'} (max abs diff {md:.2e})")
return ok
dtype = torch.float16 if HAS_CUDA else torch.float32
rule("KERNEL 1 — VECTOR ADD (load tile -> add -> store tile)")
print("cuTile version of this kernel:\n" + CUTILE_SOURCE["vector_add"])
n = 1 << 20
a = torch.randn(n, device=DEV, dtype=torch.float32)
b = torch.randn(n, device=DEV, dtype=torch.float32)
check("vector_add", run_vadd(a, b), a + b)
if BACKEND != "torch":
print(f" {BACKEND} time: {bench(run_vadd, a, b):.4f} ms torch: {bench(lambda x,y:x+y, a, b):.4f} ms")
rule("KERNEL 2 — FUSED GELU(x*w + b) (three ops fused into one memory pass)")
x = torch.randn(n, device=DEV, dtype=torch.float32)
w = torch.randn(n, device=DEV, dtype=torch.float32)
bb = torch.randn(n, device=DEV, dtype=torch.float32)
ref = torch.nn.functional.gelu(x * w + bb, approximate="tanh")
check("fused_gelu", run_fused_gelu(x, w, bb), ref)
if BACKEND != "torch":
torch_fn = lambda x,w,b: torch.nn.functional.gelu(x*w+b, approximate="tanh")
print(f" {BACKEND} (1 pass): {bench(run_fused_gelu, x, w, bb):.4f} ms "
f"torch (3 passes): {bench(torch_fn, x, w, bb):.4f} ms")
We build benchmarking and correctness-checking utilities that compare each custom kernel against a PyTorch reference implementation. We then run the vector-addition kernel and verify that the tile-based output matches the standard PyTorch addition. We also test the fused GELU kernel, demonstrating how multiplication, bias addition, and GELU activation are combined into a single efficient pass.
Softmax and Tiled Matmul
Copy Code Copied Use a different Browser
rule("KERNEL 3 — ROW SOFTMAX (tile reductions: max then sum, numerically stable)")
rows, cols = 4096, 1024
x = torch.randn(rows, cols, device=DEV, dtype=torch.float32)
check("softmax", run_softmax(x), torch.softmax(x, dim=-1))
if BACKEND != "torch":
print(f" {BACKEND} time: {bench(run_softmax, x):.4f} ms "
f"torch: {bench(lambda z: torch.softmax(z,-1), x):.4f} ms")
rule("KERNEL 4 — TILED MATMUL (K-loop accumulation -> tensor cores)")
print("cuTile version of this kernel:\n" + CUTILE_SOURCE["matmul"])
M = N = K = 1024
a = torch.randn(M, K, device=DEV, dtype=dtype)
b = torch.randn(K, N, device=DEV, dtype=dtype)
check("matmul", run_matmul(a, b), a @ b, atol=1e-1, rtol=1e-1)
if BACKEND != "torch":
t = bench(run_matmul, a, b)
flops = 2 * M * N * K
print(f" {BACKEND}: {t:.4f} ms ({flops/ (t*1e-3) / 1e12:.2f} TFLOP/s) "
f"torch: {bench(lambda x,y:x@y, a, b):.4f} ms")
We run the row-wise softmax kernel and compare it against PyTorch’s softmax to verify numerical correctness. We then perform tiled matrix multiplication, multiplying matrix blocks and accumulating along the K dimension. We benchmark these kernels against PyTorch to observe how tile-based execution performs on the active backend.
Flash Attention Kernel
Copy Code Copied Use a different Browser
rule("KERNEL 5 — FLASH ATTENTION (online softmax; the advanced capstone)")
Z, L, D = 8, 512, 64
q = torch.randn(Z, L, D, device=DEV, dtype=dtype)
k = torch.randn(Z, L, D, device=DEV, dtype=dtype)
v = torch.randn(Z, L, D, device=DEV, dtype=dtype)
ref = torch.nn.functional.scaled_dot_product_attention(q, k, v)
check("flash_attn", run_flash(q, k, v), ref, atol=2e-2, rtol=2e-2)
if BACKEND != "torch":
sdpa = lambda q,k,v: torch.nn.functional.scaled_dot_product_attention(q,k,v)
print(f" {BACKEND}: {bench(run_flash, q, k, v):.4f} ms "
f"torch sdpa: {bench(sdpa, q, k, v):.4f} ms")
rule("DONE")
print(f"""
Summary
-------
Backend that ran : {BACKEND}
What you learned : the tile programming model (whole-tile load/compute/store),
fusion, tile reductions, K-loop matmul on tensor cores, and
an online-softmax flash-attention kernel.
To run the REAL cuTile kernels shown above you need CUDA 13.1+ and an
Ampere/Ada/Blackwell GPU. On such a machine:
pip install 'cuda-tile[tileiras]' cupy-cuda13x
pip install tilegym[tileiras]
Then the strings in CUTILE_SOURCE run as-is via ct.launch(...).
""")
We finish with the flash attention kernel, which applies online softmax to compute attention without materializing the full attention matrix. We compare its output to PyTorch’s scaled dot-product attention and benchmark runtime performance when a GPU backend is available. We close the tutorial by summarizing the backend we used and the main tile programming concepts we learned.
Conclusion
In conclusion, we understood how tile-based kernels map high-level mathematical operations onto efficient GPU execution patterns. We saw how fusion reduces memory traffic, how tile reductions stabilize and make softmax efficient, how tiled matrix multiplication accumulates over K-blocks, and how flash attention uses online softmax to avoid materializing the full attention matrix. We also gained a path for experimentation: we ran Triton kernels on common Colab GPUs today while still seeing how the same concepts translate to real cuTile kernels on newer CUDA 13.1+ Ampere, Ada, or Blackwell systems.
Check out the Full Codes with Notebook . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
How to Build a T4-Friendly Autonomous Data Science Agent with DeepAnalyze-8B, Sandboxed Code Execution, and Iterative Analysis
Sana Hassan
Datalab Lift vs the Field: How a 9B Schema-First Extractor Compares with NuExtract3, LlamaExtract, Marker, and Docling
Sana Hassan
NVIDIA’s Cosmos-Framework Tutorial: Designing a Colab-Friendly Miniature of Cosmos 3 World Models with Omnimodal Mixture-of-Transformers
Sana Hassan
Building a Scaffold-Split Random Forest QSAR Co-Scientist for EGFR Inhibitor Discovery Using ChEMBL, RDKit, SHAP, and BRICS
Sana Hassan
Training Gemma-3 for Structured Mathematical Reasoning with Tunix GRPO, LoRA Adapters, and GSM8K Rewards
Sana Hassan
Designing a Schema-Guided Invoice Intelligence Pipeline with lift-pdf for Accounts-Payable Extraction, Validation, and Ledger Generation
Sana Hassan
RAG-Anything Tutorial: Build a Multimodal Retrieval Pipeline for Text, Tables, Equations, and Images in Colab
Sana Hassan
Using Lift to Turn Research PDFs into Structured JSON with Controlled, Schema-Guided Field-Level Evaluation
Sana Hassan
CUP (Common Useful Python): Building Reliable Python Workflows with Baidu’s Utility Toolkit
Sana Hassan
PyGraphistry Implementation Workflow for Interactive Graph Intelligence Pipelines in Security Analytics and Risk Investigation
Sana Hassan
OCRmyPDF Tutorial: Convert Scanned Documents into Searchable PDF/A Files with Sidecar Text Extraction and Batch Processing
Sana Hassan
Building a Stable Fable 5 Traces Workflow in Colab: Parsing Tool Calls, Auditing Data, and Training Baselines
Sana Hassan
Building Supervised Fine-Tuning Data from NVIDIA Open-SWE-Traces: Trajectory Parsing, Patch Analysis, Token Budgets, and Tool-Use Metrics
Sana Hassan
Build a Nanobot-Style AI Agent in Google Colab with Tool Calling, Session Memory, Skills, and MCP Servers
Sana Hassan
How to Design an OpenHarness Style Agent Runtime with Tools, Memory, Permissions, Skills, and Multi-Agent Coordination
Sana Hassan
Using Graphify and NetworkX to Map Python Codebase Structure with God Nodes, Communities, and Architecture Visualizations
Sana Hassan
How to Use NVIDIA Canary-1B-v2 for ASR, Translation, and Automatic SRT Subtitle Export in Python
Sana Hassan
GLM-5.2 OpenAI-Compatible API: A Hands-On Guide to Reasoning Effort, Function Calling, and Long-Context Retrieval
Sana Hassan
How to Design Python-First Interactive Dashboards with Prefab Reactive UI Components and Static HTML Export
Sana Hassan
Crawlee for Python: Build a Web Crawling Pipeline with Robots Handling, Link Graphs, and RAG Chunk Export
Sana Hassan
How to Build a Forecasting Pipeline with TimeCopilot Using Foundation Models and Automated Anomaly Detection
Sana Hassan
Salesforce CodeGen Tutorial: Generate, Validate, and Rerank Python Functions With Unit Tests and Safety Checks
Sana Hassan
NVIDIA SkillSpector Guide: Scanning AI Skills for Security Risks with Static Analysis and SARIF Reports
Sana Hassan
How to Build Memory-Efficient Transformers with xFormers Using Packed Sequences, GQA, ALiBi, SwiGLU, and Causal Attention
Sana Hassan
How to Build a Parsing Pipeline with Docling Parse for Layout-Aware Document Intelligence
Sana Hassan
A Coding Hands-On on FineWeb for Streaming, Filtering, Deduplication, Tokenization, and Large-Scale Web Corpus Analytics
Sana Hassan
How to Build a QwenPaw Agent Workspace with Custom Skills, Model Providers, Console Access, and Streaming API Testing
Sana Hassan
A Coding Implementation on Spatial Graph Neural Networks for Urban Function Inference Using city2graph, OSMnx, and PyTorch Geometric
Sana Hassan
A Coding Implementation on MONAI for End-to-End 3D Spleen Segmentation Using UNet on Medical CT Volumes
Sana Hassan
A Coding Implementation on Microsoft SkillOpt for Instrumented Prompt Optimization, Skill Evolution Analysis, and Baseline Comparison
Sana Hassan
Building a Code Dataset Pipeline from NVIDIA Nemotron-Pretraining-Code-v3 Metadata with Streaming, Pandas, and tiktoken
Sana Hassan
NVIDIA cuTile Python Tutorial: Building Tiled GPU Kernels for Vector Addition, Matrix Addition, and Matrix Multiplication in Colab
Sana Hassan
ClawHub Security Signals: A Coding Guide to End-to-End Security Signal Analysis and Verdict Classification on the AI Skills Dataset
Sana Hassan
Building Reflective Prompt Optimization with GEPA: Multi-Component Prompts, Structured Feedback, and Held-Out Validation
Sana Hassan
NVIDIA garak Tutorial: Build a Complete Defensive LLM Red-Teaming Workflow with Custom Probes and Detectors
Sana Hassan
A Hands-On Coding Tutorial on Qualcomm AI Hub Models for Classification, Object Detection, and Hardware-Aware Deployment
Sana Hassan
Microsoft Fara Tutorial: Run a Browser-Use Agent in Google Colab with a Mock OpenAI-Compatible Endpoint
Sana Hassan
Building a Semantic Search Engine and Open-Status Classifier over the ResearchMath-14k Dataset
Sana Hassan
How to Build a Document Intelligence Backend with iii Using Workers, Functions, and Cron Triggers
Sana Hassan
How to Fine-Tune LFM2 Using QLoRA and DPO: A Complete Step-by-Step Coding Tutorial on Google Colab
Sana Hassan
How to Speed Up Transformer Training Using NVIDIA Apex (FusedAdam, FusedLayerNorm) and Native torch.amp
Sana Hassan
An Implementation of the Microsoft Agent Governance Toolkit for Safe AI Agent Tool Use with Policies, Approvals, Audit Logs, and Risk Controls
Sana Hassan
A Coding Implementation on Loguru for Designing Robust, Structured, Concurrent, and Production-Ready Python Logging Pipelines
Sana Hassan
Build Skill-Augmented AI Agents with SkillNet for Search, Evaluation, Graph Analysis, and Task Planning
Sana Hassan
How to Use AgentTrove: Streaming 1.7M Agentic Traces and Building a Clean ShareGPT SFT Dataset in Python
Sana Hassan
How to Design an End-to-End Ansible Automation Lab with Playbooks, Inventories, Roles, Vault, Dynamic Inventory, and Custom Modules
Sana Hassan
A Coding Guide to Implement a pgvector-Powered Semantic, Hybrid, Sparse, and Quantized Vector Search System
Sana Hassan
Design a High-Precision Retrieve-and-Rerank Pipeline with ZeroEntropy Zerank-2 Reranker
Sana Hassan
Design a Complete Multimodal RLVR Pipeline with Open-MM-RL, Vision-Language Prompting, Reward Scoring, and GRPO Export
Sana Hassan
Step by Step Guide to Build and Compare FedAvg and FedProx Federated Learning on Non-IID CIFAR-10 with NVIDIA FLARE
Sana Hassan
Build a Complete Langfuse Observability and Evaluation Pipeline for Tracing, Prompt Management, Scoring, and Experiments
Sana Hassan
Build a SuperClaude Framework Workflow with Commands, Agents, Modes, and Session Memory
Sana Hassan
Build Recurrent-Depth Transformers with OpenMythos for MLA, GQA, Sparse MoE, and Loop-Scaled Reasoning
Sana Hassan
How to Build Knowledge Graph Generation Pipelines From Text With kg-gen, NetworkX Analytics, and Interactive Visualizations
Sana Hassan
How to Build an Advanced Agentic AI System with Planning, Tool Calling, Memory, and Self-Critique Using OpenAI API
Sana Hassan
A Coding Implementation to Compress and Benchmark Instruction-Tuned LLMs with FP8, GPTQ, and SmoothQuant Quantization using llmcompressor
Sana Hassan
A Coding Guide Implementing SHAP Explainability Workflows with Explainer Comparisons, Maskers, Interactions, Drift, and Black-Box Models
Sana Hassan
How to Build Repository-Level Code Intelligence with Repowise Using Graph Analysis, Dead-Code Detection, Decisions, and AI Context
Sana Hassan
How to Build an MCP Style Routed AI Agent System with Dynamic Tool Exposure Planning, Execution, and Context Injection
Sana Hassan
How to Build a Django-Unfold Admin Dashboard with Custom Models, Filters, Actions, and KPIs
Sana Hassan
A Coding Implementation to Master GPU Computing with CuPy, Custom CUDA Kernels, Streams, Sparse Matrices, and Profiling
Sana Hassan
How to Build a Dynamic Zero-Trust Network Simulation with Graph-Based Micro-Segmentation, Adaptive Policy Engine, and Insider Threat Detection
Sana Hassan
Build a Hybrid-Memory Autonomous Agent with Modular Architecture and Tool Dispatch Using OpenAI
Sana Hassan
A Coding Implementation to Portfolio Optimization with skfolio for Building Testing, Tuning, and Comparing Modern Investment Strategies
Sana Hassan
How to Build Technical Analysis and Backtesting Workflow with pandas-ta-classic, Strategy Signals, and Performance Metrics
Sana Hassan
A Coding Implementation to Build Agent-Native Memory Infrastructure with Memori for Persistent Multi-User and Multi-Session LLM Applications
Sana Hassan
How to Build a Cost-Aware LLM Routing System with NadirClaw Using Local Prompt Classification and Gemini Model Switching
Sana Hassan
A Coding Implementation to Recover Hidden Malware IOCs with FLARE-FLOSS Beyond Classic Strings Analysis
Sana Hassan
How to Build a Single-Cell RNA-seq Analysis Pipeline with Scanpy for PBMC Clustering, Annotation, and Trajectory Discovery
Sana Hassan
Build a CloakBrowser Automation Workflow with Stealth Chromium, Persistent Profiles, and Browser Signal Inspection
Sana Hassan
How to Build a Fully Interactive Multi-Page NiceGUI Application with Real-Time Dashboard, CRUD Operations, File Upload, and Async Chat
Sana Hassan
Build a Modular Skill-Based Agent System for LLMs with Dynamic Tool Routing in Python
Sana Hassan
A Coding Guide to Survey Bias Correction Using Facebook Research Balance with IPW CBPS Ranking and Post Stratification Methods
Sana Hassan
How to Build an End-to-End Production Grade Machine Learning Pipeline with ZenML, Including Custom Materializers, Metadata Tracking, and Hyperparameter Optimization
Sana Hassan
A Coding Implementation to Explore and Analyze the TaskTrove Dataset with Streaming Parsing Visualization and Verifier Detection
Sana Hassan
A Coding Implementation of End-to-End Brain Decoding from MEG Signals Using NeuralSet and Deep Learning for Predicting Linguistic Features
Sana Hassan
A Coding Guide on LLM Post Training with TRL from Supervised Fine Tuning to DPO and GRPO Reasoning
Sana Hassan
A Coding Deep Dive into Agentic UI, Generative UI, State Synchronization, and Interrupt-Driven Approval Flows
Sana Hassan
A Coding Implementation on Pyright Type Checking Covering Generics, Protocols, Strict Mode, Type Narrowing, and Modern Python Typing
Sana Hassan
A Coding Implementation on Document Parsing Benchmarking with LlamaIndex ParseBench Using Python, Hugging Face, and Evaluation Metrics
Sana Hassan
How to Build Traceable and Evaluated LLM Workflows Using Promptflow, Prompty, and OpenAI
Sana Hassan
How to Build a Lightweight Vision-Language-Action-Inspired Embodied Agent with Latent World Modeling and Model Predictive Control
Sana Hassan
How to Build a Fully Searchable AI Knowledge Base with OpenKB, OpenRouter, and Llama
Sana Hassan
How to Build Smarter Multilingual Text Wrapping with BudouX Through Parsing, HTML Rendering, Model Introspection, and Toy Training
Sana Hassan
A Coding Tutorial on Datashader on Rendering Massive Datasets with High-Performance Python Visual Analytics
Sana Hassan
A Coding Implementation on kvcached for Elastic KV Cache Memory, Bursty LLM Serving, and Multi-Model GPU Sharing
Sana Hassan
A Coding Implementation on Microsoft’s OpenMementos with Trace Structure Analysis, Context Compression, and Fine-Tuning Data Preparation
Sana Hassan
A Detailed Implementation on Equinox with JAX Native Modules, Filtered Transforms, Stateful Layers, and End-to-End Training Workflows
Sana Hassan
A Coding Implementation to Build a Conditional Bayesian Hyperparameter Optimization Pipeline with Hyperopt, TPE, and Early Stopping
Sana Hassan
A Coding Implementation on Qwen 3.6-35B-A3B Covering Multimodal Inference, Thinking Control, Tool Calling, MoE Routing, RAG, and Session Persistence
Sana Hassan
A Coding Implementation on Microsoft’s Phi-4-Mini for Quantized Inference Reasoning Tool Use RAG and LoRA Fine-Tuning
Sana Hassan
A Coding Implementation to Build an AI-Powered File Type Detection and Security Analysis Pipeline with Magika and OpenAI
Sana Hassan
A Coding Implementation of Quantum State Evolution, Decoherence, and Entanglement Dynamics using QuTiP
Sana Hassan
Google AI Introduced Guardrailed-AMIE (g-AMIE): A Multi-Agent Approach to Accountability in Conversational Medical AI
Sana Hassan
Prefix-RFT: A Unified Machine Learning Framework to blend Supervised Fine-Tuning (SFT) and Reinforcement Fine-Tuning (RFT)
Sana Hassan
Huawei CloudMatrix: A Peer-to-Peer AI Datacenter Architecture for Scalable and Efficient LLM Serving
Sana Hassan
ZenFlow: A New DeepSpeed Extension Designed as a Stall-Free Offloading Engine for Large Language Model (LLM) Training
Sana Hassan
A Coding Implementation to Build a Complete Self-Hosted LLM Workflow with Ollama, REST API, and Gradio Chat Interface
Sana Hassan
Memp: A Task-Agnostic Framework that Elevates Procedural Memory to a Core Optimization Target in LLM-based Agent
Sana Hassan
A Coding Guide to Build and Validate End-to-End Partitioned Data Pipelines in Dagster with Machine Learning Integration
Sana Hassan
Efficient AI Agents Don’t Have to Be Expensive: Here’s Proof
Sana Hassan
Genie Envisioner: A Unified Video-Generative Platform for Scalable, Instruction-Driven Robotic Manipulation
Sana Hassan
Building an Advanced Portfolio Analysis and Market Intelligence Tool with OpenBB
Sana Hassan
Graph-R1: An Agentic GraphRAG Framework for Structured, Multi-Turn Reasoning with Reinforcement Learning
Sana Hassan
MIT Researchers Develop Methods to Control Transformer Sensitivity with Provable Lipschitz Bounds and Muon
Sana Hassan
TransEvalnia: A Prompting-Based System for Fine-Grained, Human-Aligned Translation Evaluation Using LLMs
Sana Hassan
Why Context Matters: Transforming AI Model Evaluation with Contextualized Queries
Sana Hassan
URBAN-SIM: Advancing Autonomous Micromobility with Scalable Urban Simulation
Sana Hassan
GPT-4o Understands Text, But Does It See Clearly? A Benchmarking Study of MFMs on Vision Tasks
Sana Hassan
A Code Implementation to Efficiently Leverage LangChain to Automate PubMed Literature Searches, Parsing, and Trend Visualization
Sana Hassan
Can LLM Reward Models Be Trusted? Master-RM Exposes and Fixes Their Weaknesses
Sana Hassan
EG-CFG: Enhancing Code Generation with Real-Time Execution Feedback
Sana Hassan
Mirage: Multimodal Reasoning in VLMs Without Rendering Images
Sana Hassan
NeuralOS: A Generative Framework for Simulating Interactive Operating System Interfaces
Sana Hassan
Efficient and Adaptable Speech Enhancement via Pre-trained Generative Audioencoders and Vocoders
Sana Hassan
SDBench and MAI-DxO: Advancing Realistic, Cost-Aware Clinical Reasoning with AI
Sana Hassan
From Perception to Action: The Role of World Models in Embodied AI Systems
Sana Hassan
Mistral AI Releases Devstral 2507 for Code-Centric Language Modeling
Sana Hassan
Perplexity Introduces Comet—An AI-First Alternative to Traditional Browsers
Sana Hassan
Microsoft Open-Sources GitHub Copilot Chat Extension for VS Code—Now Free for All Developers
Sana Hassan
How Radial Attention Cuts Costs in Video Diffusion by 4.4× Without Sacrificing Quality
Sana Hassan
SynPref-40M and Skywork-Reward-V2: Scalable Human-AI Alignment for State-of-the-Art Reward Models
Sana Hassan
A Coding Guide to Build Modular and Self-Correcting QA Systems with DSPy
Sana Hassan
AbstRaL: Teaching LLMs Abstract Reasoning via Reinforcement to Boost Robustness on GSM Benchmarks
Sana Hassan
Kyutai Releases 2B Parameter Streaming Text-to-Speech TTS with 220ms Latency and 2.5M Hours of Training
Sana Hassan
A Tutorial on Using OpenAI Codex with GitHub Repositories for Seamless AI-Powered Development
Sana Hassan
Thought Anchors: A Machine Learning Framework for Identifying and Measuring Key Reasoning Steps in Large Language Models with Precision
Sana Hassan
Building a BioCypher-Powered AI Agent for Biomedical Knowledge Graph Generation and Querying
Sana Hassan
LongWriter-Zero: A Reinforcement Learning Framework for Ultra-Long Text Generation Without Synthetic Data
Sana Hassan
MDM-Prime: A generalized Masked Diffusion Models (MDMs) Framework that Enables Partially Unmasked Tokens during Sampling
Sana Hassan
UC San Diego Researchers Introduced Dex1B: A Billion-Scale Dataset for Dexterous Hand Manipulation in Robotics
Sana Hassan
DeepRare: The First AI-Powered Agentic Diagnostic System Transforming Clinical Decision-Making in Rare Disease Management
Sana Hassan
GURU: A Reinforcement Learning Framework that Bridges LLM Reasoning Across Six Domains
Sana Hassan
MIT and NUS Researchers Introduce MEM1: A Memory-Efficient Framework for Long-Horizon Language Agents
Sana Hassan
ETH and Stanford Researchers Introduce MIRIAD: A 5.8M Pair Dataset to Improve LLM Accuracy in Medical AI
Sana Hassan
ByteDance Researchers Introduce Seed-Coder: A Model-Centric Code LLM Trained on 6 Trillion Tokens
Sana Hassan
A Coding Implementation for Creating, Annotating, and Visualizing Complex Biological Knowledge Graphs Using PyBEL
Sana Hassan
ByteDance Researchers Introduce ProtoReasoning: Enhancing LLM Generalization via Logic-Based Prototypes
Sana Hassan
Build a Groundedness Verification Tool Using Upstage API and LangChain
Sana Hassan
A Coding Guide to Build a Production-Ready Asynchronous Python SDK with Rate Limiting, In-Memory Caching, and Authentication
Sana Hassan
EmbodiedGen: A Scalable 3D World Generator for Realistic Embodied AI Simulations
Sana Hassan
Texas A&M Researchers Introduce a Two-Phase Machine Learning Method Named ‘ShockCast’ for High-Speed Flow Simulation with Neural Temporal Re-Meshing
Sana Hassan
Mistral AI Releases Mistral Small 3.2: Enhanced Instruction Following, Reduced Repetition, and Stronger Function Calling for AI Integration
Sana Hassan
PoE-World + Planner Outperforms Reinforcement Learning RL Baselines in Montezuma’s Revenge with Minimal Demonstration Data
Sana Hassan
ReVisual-R1: An Open-Source 7B Multimodal Large Language Model (MLLMs) that Achieves Long, Accurate and Thoughtful Reasoning
Sana Hassan
Why Small Language Models (SLMs) Are Poised to Redefine Agentic AI: Efficiency, Cost, and Practical Deployment
Sana Hassan
AREAL: Accelerating Large Reasoning Model Training with Fully Asynchronous Reinforcement Learning
Sana Hassan
Building High-Performance Financial Analytics Pipelines with Polars: Lazy Evaluation, Advanced Expressions, and SQL Integration
Sana Hassan
OThink-R1: A Dual-Mode Reasoning Framework to Cut Redundant Computation in LLMs
Sana Hassan
Building AI-Powered Applications Using the Plan → Files → Code Workflow in TinyDev
Sana Hassan
MemOS: A Memory-Centric Operating System for Evolving and Adaptive Large Language Models
Sana Hassan
Google AI Unveils a Hybrid AI-Physics Model for Accurate Regional Climate Risk Forecasts with Better Uncertainty Assessment
Sana Hassan
Run Multiple AI Coding Agents in Parallel with Container-Use from Dagger
Sana Hassan
How Do LLMs Really Reason? A Framework to Separate Logic from Knowledge
Sana Hassan
From Text to Action: How Tool-Augmented AI Agents Are Redefining Language Models with Reasoning, Memory, and Autonomy
Sana Hassan
Meet BioReason: The World’s First Reasoning Model in Biology that Enables AI to Reason about Genomics like a Biology Expert
Sana Hassan
Darwin Gödel Machine: A Self-Improving AI Agent That Evolves Code Using Foundation Models and Real-World Benchmarks
Sana Hassan
Salesforce AI Introduces CRMArena-Pro: The First Multi-Turn and Enterprise-Grade Benchmark for LLM Agents
Sana Hassan
LifelongAgentBench: A Benchmark for Evaluating Continuous Learning in LLM-Based Agents
Sana Hassan
Mistral AI Introduces Codestral Embed: A High-Performance Code Embedding Model for Scalable Retrieval and Semantic Understanding
Sana Hassan
Off-Policy Reinforcement Learning RL with KL Divergence Yields Superior Reasoning in Large Language Models
Sana Hassan
This AI Paper from Microsoft Introduces WINA: A Training-Free Sparse Activation Framework for Efficient Large Language Model Inference
Sana Hassan
Apple and Duke Researchers Present a Reinforcement Learning Approach That Enables LLMs to Provide Intermediate Answers, Enhancing Speed and Accuracy
Sana Hassan
National University of Singapore Researchers Introduce Dimple: A Discrete Diffusion Multimodal Language Model for Efficient and Controllable Text Generation
Sana Hassan
LLMs Can Now Reason Beyond Language: Researchers Introduce Soft Thinking to Replace Discrete Tokens with Continuous Concept Embeddings
Sana Hassan
Researchers at UT Austin Introduce Panda: A Foundation Model for Nonlinear Dynamics Pretrained on 20,000 Chaotic ODE Discovered via Evolutionary Search
Sana Hassan
Microsoft Releases NLWeb: An Open Project that Allows Developers to Easily Turn Any Website into an AI-Powered App with Natural Language Interfaces
Sana Hassan
Optimizing Assembly Code with LLMs: Reinforcement Learning Outperforms Traditional Compilers
Sana Hassan
Evaluating Enterprise-Grade AI Assistants: A Benchmark for Complex, Voice-Driven Workflows
Sana Hassan
Beyond Aha Moments: Structuring Reasoning in Large Language Models
Sana Hassan
RXTX: A Machine Learning-Guided Algorithm for Efficient Structured Matrix Multiplication
Sana Hassan
From Protocol to Production: How Model Context Protocol (MCP) Gateways Enable Secure, Scalable, and Seamless AI Integrations Across Enterprises
Sana Hassan
Researchers from Renmin University and Huawei Propose MemEngine: A Unified Modular AI Library for Customizing Memory in LLM-Based Agents
Sana Hassan
Meta Introduces KernelLLM: An 8B LLM that Translates PyTorch Modules into Efficient Triton GPU Kernels
Sana Hassan
Omni-R1: Advancing Audio Question Answering with Text-Driven Reinforcement Learning and Auto-Generated Data
Sana Hassan
Reinforcement Learning Makes LLMs Search-Savvy: Ant Group Researchers Introduce SEM to Optimize Tool Usage and Reasoning Efficiency
Sana Hassan
SWE-Bench Performance Reaches 50.8% Without Tool Use: A Case for Monolithic State-in-Context Agents
Sana Hassan
This AI paper from DeepSeek-AI Explores How DeepSeek-V3 Delivers High-Performance Language Modeling by Minimizing Hardware Overhead and Maximizing Computational Efficiency
Sana Hassan
Meet LangGraph Multi-Agent Swarm: A Python Library for Creating Swarm-Style Multi-Agent Systems Using LangGraph
Sana Hassan
ByteDance Introduces Seed1.5-VL: A Vision-Language Foundation Model Designed to Advance General-Purpose Multimodal Understanding and Reasoning
Sana Hassan
Researchers from Tsinghua and ModelBest Release Ultra-FineWeb: A Trillion-Token Dataset Enhancing LLM Accuracy Across Benchmarks
Sana Hassan
Coding Agents See 75% Surge: SimilarWeb’s AI Usage Report Highlights the Sectors Winning and Losing in 2025’s Generative AI Boom
Sana Hassan
Rethinking Toxic Data in LLM Pretraining: A Co-Design Approach for Improved Steerability and Detoxification
Sana Hassan
A Step-by-Step Guide on Building, Customizing, and Publishing an AI-Focused Blogging Website with Lovable.dev and Seamless GitHub Integration
Sana Hassan
NVIDIA AI Introduces Audio-SDS: A Unified Diffusion-Based Framework for Prompt-Guided Audio Synthesis and Source Separation without Specialized Datasets
Sana Hassan
Tencent Released PrimitiveAnything: A New AI Framework That Reconstructs 3D Shapes Using Auto-Regressive Primitive Generation
Sana Hassan
Microsoft Researchers Introduce ARTIST: A Reinforcement Learning Framework That Equips LLMs with Agentic Reasoning and Dynamic Tool Use
Sana Hassan
A Deep Technical Dive into Next-Generation Interoperability Protocols: Model Context Protocol (MCP), Agent Communication Protocol (ACP), Agent-to-Agent Protocol (A2A), and Agent Network Protocol (ANP)
Sana Hassan
Ming-Lite-Uni: An Open-Source AI Framework Designed to Unify Text and Vision through an Autoregressive Multimodal Structure
Sana Hassan
Multimodal LLMs Without Compromise: Researchers from UCLA, UW–Madison, and Adobe Introduce X-Fusion to Add Vision to Frozen Language Models Without Losing Language Capabilities
Sana Hassan
NVIDIA Open-Sources Open Code Reasoning Models (32B, 14B, 7B)
Sana Hassan
Is Automated Hallucination Detection in LLMs Feasible? A Theoretical and Empirical Investigation
Sana Hassan
Google Releases 76-Page Whitepaper on AI Agents: A Deep Technical Dive into Agentic RAG, Evaluation Frameworks, and Real-World Architectures
Sana Hassan
How AI Agents Store, Forget, and Retrieve? A Fresh Look at Memory Operations for the Next-Gen LLMs
Sana Hassan
8 Comprehensive Open-Source and Hosted Solutions to Seamlessly Convert Any API into AI-Ready MCP Servers
Sana Hassan
How the Model Context Protocol (MCP) Standardizes, Simplifies, and Future-Proofs AI Agent Tool Calling Across Models for Scalable, Secure, Interoperable Workflows Traditional Approaches to AI–Tool Integration
Sana Hassan
Multimodal Queries Require Multimodal RAG: Researchers from KAIST and DeepAuto.ai Propose UniversalRAG—A New Framework That Dynamically Routes Across Modalities and Granularities for Accurate and Efficient Retrieval-Augmented Generation
Sana Hassan
Google Researchers Advance Diagnostic AI: AMIE Now Matches or Outperforms Primary Care Physicians Using Multimodal Reasoning with Gemini 2.0 Flash
Sana Hassan
LLMs Can Learn Complex Math from Just One Example: Researchers from University of Washington, Microsoft, and USC Unlock the Power of 1-Shot Reinforcement Learning with Verifiable Reward
Sana Hassan
Building the Internet of Agents: A Technical Dive into AI Agent Protocols and Their Role in Scalable Intelligence Systems
Sana Hassan
Meta AI Introduces First Version of Its Llama 4-Powered AI App: A Standalone AI Assistant to Rival ChatGPT
Sana Hassan
Exploring the Sparse Frontier: How Researchers from Edinburgh, Cohere, and Meta Are Rethinking Attention Mechanisms for Long-Context LLMs
Sana Hassan
Can Coding Agents Improve Themselves? Researchers from University of Bristol and iGent AI Propose SICA (Self-Improving Coding Agent) that Iteratively Enhances Its Own Code and Performance
Sana Hassan
UniME: A Two-Stage Framework for Enhancing Multimodal Representation Learning with MLLMs
Sana Hassan
ViSMaP: Unsupervised Summarization of Hour-Long Videos Using Meta-Prompting and Short-Form Datasets
Sana Hassan
Tiny Models, Big Reasoning Gains: USC Researchers Introduce Tina for Cost-Effective Reinforcement Learning with LoRA
Sana Hassan
Microsoft Releases a Comprehensive Guide to Failure Modes in Agentic AI Systems
Sana Hassan
This AI Paper from China Proposes a Novel Training-Free Approach DEER that Allows Large Reasoning Language Models to Achieve Dynamic Early Exit in Reasoning
Sana Hassan
AgentA/B: A Scalable AI System Using LLM Agents that Simulate Real User Behavior to Transform Traditional A/B Testing on Live Web Platforms
Sana Hassan
Skywork AI Advances Multimodal Reasoning: Introducing Skywork R1V2 with Hybrid Reinforcement Learning
Sana Hassan
Microsoft Research Introduces MMInference to Accelerate Pre-filling for Long-Context Vision-Language Models
Sana Hassan
Meet Rowboat: An Open-Source IDE for Building Complex Multi-Agent Systems
Sana Hassan
A New Citibank Report/Guide Shares How Agentic AI Will Reshape Finance with Autonomous Analysis and Intelligent Automation
Sana Hassan
Sequential-NIAH: A Benchmark for Evaluating LLMs in Extracting Sequential Information from Long Texts
Sana Hassan
LLMs Can Now Learn without Labels: Researchers from Tsinghua University and Shanghai AI Lab Introduce Test-Time Reinforcement Learning (TTRL) to Enable Self-Evolving Language Models Using Unlabeled Data
Sana Hassan
Meet VoltAgent: A TypeScript AI Framework for Building and Orchestrating Scalable AI Agents
Sana Hassan
Decoupled Diffusion Transformers: Accelerating High-Fidelity Image Generation via Semantic-Detail Separation and Encoder Sharing
Sana Hassan
A Code Implementation of a Real‑Time In‑Memory Sensor Alert Pipeline in Google Colab with FastStream, RabbitMQ, TestRabbitBroker, Pydantic
Sana Hassan
LLMs Still Struggle to Cite Medical Sources Reliably: Stanford Researchers Introduce SourceCheckup to Audit Factual Support in AI-Generated Responses
Sana Hassan
Stanford Researchers Propose FramePack: A Compression-based AI Framework to Tackle Drifting and Forgetting in Long-Sequence Video Generation Using Efficient Context Management and Sampling
Sana Hassan
LLMs Can Be Misled by Surprising Data: Google DeepMind Introduces New Techniques to Predict and Reduce Unintended Knowledge Contamination
Sana Hassan
LLMs Can Now Learn to Try Again: Researchers from Menlo Introduce ReZero, a Reinforcement Learning Framework That Rewards Query Retrying to Improve Search-Based Reasoning in RAG Systems
Sana Hassan
Model Context Protocol (MCP) vs Function Calling: A Deep Dive into AI Integration Architectures
Sana Hassan
Google Unveils Gemini 2.5 Flash in Preview through the Gemini API via Google AI Studio and Vertex AI.
Sana Hassan
Do Reasoning Models Really Need Transformers?: Researchers from TogetherAI, Cornell, Geneva, and Princeton Introduce M1—A Hybrid Mamba-Based AI that Matches SOTA Performance at 3x Inference Speed
Sana Hassan
Do We Still Need Complex Vision-Language Pipelines? Researchers from ByteDance and WHU Introduce Pixel-SAIL—A Single Transformer Model for Pixel-Level Understanding That Outperforms 7B MLLMs
Sana Hassan
Biophysical Brain Models Get a 2000× Speed Boost: Researchers from NUS, UPenn, and UPF Introduce DELSSOME to Replace Numerical Integration with Deep Learning Without Sacrificing Accuracy
Sana Hassan
SyncSDE: A Probabilistic Framework for Task-Adaptive Diffusion Synchronization in Collaborative Generation
Sana Hassan
Transformers Can Now Predict Spreadsheet Cells without Fine-Tuning: Researchers Introduce TabPFN Trained on 100 Million Synthetic Datasets
Sana Hassan
A Coding Guide to Build a Finance Analytics Tool for Extracting Yahoo Finance Data, Computing Financial Analysis, and Creating Custom PDF Reports
Sana Hassan
Traditional RAG Frameworks Fall Short: Megagon Labs Introduces ‘Insight-RAG’, a Novel AI Method Enhancing Retrieval-Augmented Generation through Intermediate Insight Extraction
Sana Hassan
Google AI Introduce the Articulate Medical Intelligence Explorer (AMIE): A Large Language Model Optimized for Diagnostic Reasoning, and Evaluate its Ability to Generate a Differential Diagnosis
Sana Hassan
Moonsight AI Released Kimi-VL: A Compact and Powerful Vision-Language Model Series Redefining Multimodal Reasoning, Long-Context Understanding, and High-Resolution Visual Processing
Sana Hassan
Balancing Accuracy and Efficiency in Language Models: A Two-Phase RL Post-Training Approach for Concise Reasoning
Sana Hassan
RoR-Bench: Revealing Recitation Over Reasoning in Large Language Models Through Subtle Context Shifts
Sana Hassan
T* and LV-Haystack: A Spatially-Guided Temporal Search Framework for Efficient Long-Form Video Understanding
Sana Hassan
Unveiling Attention Sinks: The Functional Role of First-Token Focus in Stabilizing Large Language Models
Sana Hassan
RARE (Retrieval-Augmented Reasoning Modeling): A Scalable AI Framework for Domain-Specific Reasoning in Lightweight Language Models
Sana Hassan
Scalable and Principled Reward Modeling for LLMs: Enhancing Generalist Reward Models RMs with SPCT and Inference-Time Optimization
Sana Hassan
Reducto AI Released RolmOCR: A SoTA OCR Model Built on Qwen 2.5 VL, Fully Open-Source and Apache 2.0 Licensed for Advanced Document Understanding
Sana Hassan
Scalable Reinforcement Learning with Verifiable Rewards: Generative Reward Modeling for Unstructured, Multi-Domain Tasks
Sana Hassan
Meet GenSpark Super Agent: The All-in-One AI Agent that Autonomously Think, Plan, Act, and Use Tools to Handle All Your Everyday Tasks
Sana Hassan
UB-Mesh: A Cost-Efficient, Scalable Network Architecture for Large-Scale LLM Training
Sana Hassan
Advancing Vision-Language Reward Models: Challenges, Benchmarks, and the Role of Process-Supervised Learning
Sana Hassan
Enhancing Strategic Decision-Making in Gomoku Using Large Language Models and Reinforcement Learning
Sana Hassan
Mitigating Hallucinations in Large Vision-Language Models: A Latent Space Steering Approach
Sana Hassan
A Comprehensive Guide to LLM Routing: Tools and Frameworks
Sana Hassan
Understanding AI Agent Memory: Building Blocks for Intelligent Systems
Sana Hassan
Advancing Medical Reasoning with Reinforcement Learning from Verifiable Rewards (RLVR): Insights from MED-RLVR
Sana Hassan
Efficient Inference-Time Scaling for Flow Models: Enhancing Sampling Diversity and Compute Allocation
Sana Hassan
UCLA Researchers Released OpenVLThinker-7B: A Reinforcement Learning Driven Model for Enhancing Complex Visual Reasoning and Step-by-Step Problem Solving in Multimodal Systems
Sana Hassan
Vision-R1: Redefining Reinforcement Learning for Large Vision-Language Models
Sana Hassan
Understanding and Mitigating Failure Modes in LLM-Based Multi-Agent Systems
Sana Hassan
RWKV-7: Advancing Recurrent Neural Networks for Efficient Sequence Modeling
Sana Hassan
Lyra: A Computationally Efficient Subquadratic Architecture for Biological Sequence Modeling
Sana Hassan
Fin-R1: A Specialized Large Language Model for Financial Reasoning and Decision-Making
Sana Hassan
Microsoft AI Releases RD-Agent: An AI-Driven Tool for Performing R&D with LLM-based Agents
Sana Hassan
KBLAM: Efficient Knowledge Base Augmentation for Large Language Models Without Retrieval Overhead
Sana Hassan
MemQ: Enhancing Knowledge Graph Question Answering with Memory-Augmented Query Reconstruction
Sana Hassan
VisualWebInstruct: A Large-Scale Multimodal Reasoning Dataset for Enhancing Vision-Language Models
Sana Hassan
Groundlight Research Team Released an Open-Source AI Framework that Makes It Easy to Build Visual Reasoning Agents (with GRPO)
Sana Hassan
Dynamic Tanh DyT: A Simplified Alternative to Normalization in Transformers
Sana Hassan
Optimizing Test-Time Compute for LLMs: A Meta-Reinforcement Learning Approach with Cumulative Regret Minimization
Sana Hassan
MMR1-Math-v0-7B Model and MMR1-Math-RL-Data-v0 Dataset Released: New State of the Art Benchmark in Efficient Multimodal Mathematical Reasoning with Minimal Data
Sana Hassan
Google AI Introduces Gemini Embedding: A Novel Embedding Model Initialized from the Powerful Gemini Large Language Model
Sana Hassan
Enhancing LLM Reasoning with Multi-Attempt Reinforcement Learning
Sana Hassan
What if You Could Control How Long a Reasoning Model “Thinks”? CMU Researchers Introduce L1-1.5B: Reinforcement Learning Optimizes AI Thought Process
Sana Hassan
Google AI Introduces Differentiable Logic Cellular Automata (DiffLogic CA): A Differentiable Logic Approach to Neural Cellular Automata
Sana Hassan
Evaluating Brain Alignment in Large Language Models: Insights into Linguistic Competence and Neural Representations
Sana Hassan
Salesforce AI Proposes ViUniT (Visual Unit Testing): An AI Framework to Improve the Reliability of Visual Programs by Automatically Generating Unit Tests by Leveraging LLMs and Diffusion Models
Sana Hassan
Microsoft AI Introduces Belief State Transformer (BST): Enhancing Goal-Conditioned Sequence Modeling with Bidirectional Context
Sana Hassan
Meta AI Introduces Brain2Qwerty: Advancing Non-Invasive Sentence Decoding with MEG and Deep Learning
Sana Hassan
Researchers at Stanford Introduces LLM-Lasso: A Novel Machine Learning Framework that Leverages Large Language Models (LLMs) to Guide Feature Selection in Lasso ℓ1 Regression
Sana Hassan
Few-Shot Preference Optimization (FSPO): A Novel Machine Learning Framework Designed to Model Diverse Sub-Populations in Preference Datasets to Elicit Personalization in Language Models for Open-Ended Question Answering
Sana Hassan
Agentic AI vs. AI Agents: A Technical Deep Dive
Sana Hassan
HippoRAG 2: Advancing Long-Term Memory and Contextual Retrieval in Large Language Models
Sana Hassan
Self-Rewarding Reasoning in LLMs: Enhancing Autonomous Error Detection and Correction for Mathematical Reasoning
Sana Hassan
Stanford Researchers Uncover Prompt Caching Risks in AI APIs: Revealing Security Flaws and Data Vulnerabilities
Sana Hassan
Beyond a Single LLM: Advancing AI Through Multi-Model Collaboration
Sana Hassan
LongPO: Enhancing Long-Context Alignment in LLMs Through Self-Optimized Short-to-Long Preference Learning
Sana Hassan
Enhancing Instruction Tuning in LLMs: A Diversity-Aware Data Selection Strategy Using Sparse Autoencoders
Sana Hassan
Optimizing LLM Reasoning: Balancing Internal Knowledge and Tool Use with SMART
Sana Hassan
Meta AI Introduces MLGym: A New AI Framework and Benchmark for Advancing AI Research Agents
Sana Hassan
Meta AI Releases the Video Joint Embedding Predictive Architecture (V-JEPA) Model: A Crucial Step in Advancing Machine Intelligence
Sana Hassan
Meet Baichuan-M1: A New Series of Large Language Models Trained on 20T Tokens with a Dedicated Focus on Enhancing Medical Capabilities
Sana Hassan
xAI Releases Grok 3 Beta: A Super Advanced AI Model Blending Strong Reasoning with Extensive Pretraining Knowledge
Sana Hassan
Learning Intuitive Physics: Advancing AI Through Predictive Representation Models
Sana Hassan
Microsoft AI Releases OmniParser V2: An AI Tool that Turns Any LLM into a Computer Use Agent
Sana Hassan
Enhancing Diffusion Models: The Role of Sparsity and Regularization in Efficient Generative AI
Sana Hassan
Rethinking AI Safety: Balancing Existential Risks and Practical Challenges
Sana Hassan
Nous Research Released DeepHermes 3 Preview: A Llama-3-8B Based Model Combining Deep Reasoning, Advanced Function Calling, and Seamless Conversational Intelligence
Sana Hassan
Layer Parallelism: Enhancing LLM Inference Efficiency Through Parallel Execution of Transformer Layers
Sana Hassan
Can 1B LLM Surpass 405B LLM? Optimizing Computation for Small LLMs to Outperform Larger Models
Sana Hassan
Meet OpenThinker-32B: A State-of-the-Art Open-Data Reasoning Model
Sana Hassan
Stanford Researchers Introduce SIRIUS: A Self-Improving Reasoning-Driven Optimization Framework for Multi-Agent Systems
Sana Hassan
Frame-Dependent Agency: Implications for Reinforcement Learning and Intelligence
Sana Hassan
Advancing Scalable Text-to-Speech Synthesis: Llasa’s Transformer-Based Framework for Improved Speech Quality and Emotional Expressiveness
Sana Hassan
Google DeepMind Introduces AlphaGeometry2: A Significant Upgrade to AlphaGeometry Surpassing the Average Gold Medalist in Solving Olympiad Geometry
Sana Hassan
BARE: A Synthetic Data Generation AI Method that Combines the Diversity of Base Models with the Quality of Instruct-Tuned Models
Sana Hassan
ChunkKV: Optimizing KV Cache Compression for Efficient Long-Context Inference in LLMs
Sana Hassan
Singapore University of Technology and Design (SUTD) Explores Advancements and Challenges in Multimodal Reasoning for AI Models Through Puzzle-Based Evaluations and Algorithmic Problem-Solving Analysis
Sana Hassan
Optimizing Large Model Inference with Ladder Residual: Enhancing Tensor Parallelism through Communication-Computing Overlap
Sana Hassan
Microsoft AI Researchers Introduce Advanced Low-Bit Quantization Techniques to Enable Efficient LLM Deployment on Edge Devices without High Computational Costs
Sana Hassan
Google DeepMind Achieves State-of-the-Art Data-Efficient Reinforcement Learning RL with Improved Transformer World Models
Sana Hassan
Deep Agent Released R1-V: Reinforcing Super Generalization in Vision-Language Models with Cost-Effective Reinforcement Learning to Outperform Larger Models
Sana Hassan
ARM: Enhancing Open-Domain Question Answering with Structured Retrieval and Efficient Data Alignment
Sana Hassan
Google AI Introduces Parfait: A Privacy-First AI System for Secure Data Aggregation and Analytics
Sana Hassan
Exploration Challenges in LLMs: Balancing Uncertainty and Empowerment in Open-Ended Tasks
Sana Hassan
Creating an AI-Powered Tutor Using Vector Database and Groq for Retrieval-Augmented Generation (RAG): Step by Step Guide
Sana Hassan
Mistral AI Releases the Mistral-Small-24B-Instruct-2501: A Latency-Optimized 24B-Parameter Model Released Under the Apache 2.0 License
Sana Hassan
Agentic AI: The Foundations Based on Perception Layer, Knowledge Representation and Memory Systems
Sana Hassan
Open Thoughts: An Open Source Initiative Advancing AI Reasoning with High-Quality Datasets and Models Like OpenThoughts-114k and OpenThinker-7B
Sana Hassan
YuE: An Open-Source Music Generation AI Model Family Capable of Creating Full-Length Songs with Coherent Vocals, Instrumental Harmony, and Multi-Genre Creativity
Sana Hassan
TensorLLM: Enhancing Reasoning and Efficiency in Large Language Models through Multi-Head Attention Compression and Tensorisation
Sana Hassan
A Comprehensive Guide to Concepts in Fine-Tuning of Large Language Models (LLMs)
Sana Hassan
Microsoft AI Introduces CoRAG (Chain-of-Retrieval Augmented Generation): An AI Framework for Iterative Retrieval and Reasoning in Knowledge-Intensive Tasks
Sana Hassan
Leveraging Hallucinations in Large Language Models to Enhance Drug Discovery
Sana Hassan
Advancing Single-Cell Genomics with Self-Supervised Learning: Techniques, Applications, and Insights
Sana Hassan
Autonomy-of-Experts (AoE): A Router-Free Paradigm for Efficient and Adaptive Mixture-of-Experts Models
Sana Hassan
DeepSeek-R1 vs. OpenAI’s o1: A New Step in Open Source and Proprietary Models
Sana Hassan
Meta AI Releases the First Stable Version of Llama Stack: A Unified Platform Transforming Generative AI Development with Backward Compatibility, Safety, and Seamless Multi-Environment Deployment
Sana Hassan
LLaSA-3B: A Llama 3.2B Fine-Tuned Text-to-Speech Model with Ultra-Realistic Audio, Emotional Expressiveness, and Multilingual Support
Sana Hassan
Researchers at Stanford Propose a Unified Regression-based Machine Learning Framework for Sequence Models with Associative Memory
Sana Hassan
Advancing Protein Science with Large Language Models: From Sequence Understanding to Drug Discovery
Sana Hassan
Google DeepMind Introduces Mind Evolution: Enhancing Natural Language Planning with Evolutionary Search in Large Language Models
Sana Hassan
What are Haystack Agents? A Comprehensive Guide to Tool-Driven NLP with Code Implementation
Sana Hassan
Generative AI versus Predictive AI
Sana Hassan
AutoCBT: An Adaptive Multi-Agent Framework for Enhanced Automated Cognitive Behavioral Therapy
Sana Hassan
OmniThink: A Cognitive Framework for Enhanced Long-Form Article Generation Through Iterative Reflection and Expansion
Sana Hassan
Stanford Researchers Introduce BIOMEDICA: A Scalable AI Framework for Advancing Biomedical Vision-Language Models with Large-Scale Multimodal Datasets
Sana Hassan
ChemAgent: Enhancing Large Language Models for Complex Chemical Reasoning with Dynamic Memory Frameworks
Sana Hassan
Enhancing Retrieval-Augmented Generation: Efficient Quote Extraction for Scalable and Accurate NLP Systems
Sana Hassan
Enhancing Language Model Performance and Diversity Through Multiagent Fine-Tuning
Sana Hassan
Outcome-Refining Process Supervision: Advancing Code Generation with Structured Reasoning and Execution Feedback
Sana Hassan
What is Artificial Intelligence (AI)?
Sana Hassan
R3GAN: A Simplified and Stable Baseline for Generative Adversarial Networks GANs
Sana Hassan
ProVision: A Scalable Programmatic Approach to Vision-Centric Instruction Data for Multimodal Language Models
Sana Hassan
Top 9 Different Typ

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":60000,"paragraph_count":599,"sentence_count":59,"boilerplate_hits":2,"symbol_ratio":0.0112,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Applications Technology Staff Tutorials In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking.

6. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   CUDA Environment Probe Copy Code Copied Use a different Browser import os, sys, math, time, textwrap def rule(t=""): print("\n" + "=" * 78) if t: print(t) print("=" * 78) rule("0.

## business_elements

- companies: MarkTechPost（RSS）, GitHub, Nvidia
- products: Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 合作 / 联盟
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 13.1, 78, 0, 1, 4, 8, 13, 13x
- quotes: ):
print( /  * 78)
if t: print(t)
print( /  * 78)
rule( / )
try:
import torch
except ImportError:
print( / )
os.system(f

## evidence_seed

- company_actions: We begin by probing the available CUDA environment, checking whether NVIDIA cuTile runs directly, and falling back to Triton when standard Colab GPUs lack the required cuTile stack. / Through this setup, we learn the core tile-programming idea: instead of writing code for one thread at a time, we operate on entire data tiles, load them into the kernel, compute on them efficiently, and store the results back. / We use this model to implement vector addition, fused GELU, row-wise softmax, tiled matrix multiplication, and flash attention, while comparing each result against PyTorch for correctness and benchmarking.
- case_details: 本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。
- workflow_changes: Editors Pick Agentic AI Artificial Intelligence AI Infrastructure Applications Technology Staff Tutorials In this tutorial, we explore TileGym GPU programming by building a practical Colab workflow that runs across different hardware conditions.
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: true
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention","discovery_summary":"本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/11/a-coding-guide-to-nvidias-tile-based-gpu-programming-from-cutile-and-triton-kernels-to-flash-attention","discovered_at":"2026-07-12T06:01:47.591Z","rank_on_page":43,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

本教程通过Colab工作流讲解TileGym GPU编程。首先探测CUDA环境，在标准Colab GPU上回退至Triton，在CUDA 13.1+及Ampere/Ada/Blackwell GPU上使用NVIDIA cuTile后端。核心思想是以数据块（tile）为单位进行加载、计算与存储。教程实现了向量加法、融合GELU、行式softmax、分块矩阵乘法及Flash Attention内核，并与PyTorch对比验证正确性与性能。Flash Attention采用在线softmax避免完整注意力矩阵的显存占用。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
