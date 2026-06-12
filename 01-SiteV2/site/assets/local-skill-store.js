(function () {
  const data = window.WaveSightLocalSkillStore || { meta: {}, skills: [] };
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const initialParams = new URLSearchParams(location.search);
  const state = { view: initialParams.get("view") === "cleanup" ? "cleanup" : "catalog", filter: "all", group: "lane", sort: "priority", query: "", activeGroup: "", selectedCleanup: new Set(), selectedTrash: new Set(), trashItems: [], trashLoaded: false };
  const cleanupOpsApi = "http://127.0.0.1:8787";

  const $ = (selector, node = document) => node.querySelector(selector);
  const $$ = (selector, node = document) => Array.from(node.querySelectorAll(selector));
  const html = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

  function formatSize(kb) {
    const value = Number(kb) || 0;
    if (value < 1) return "<1 KB";
    if (value < 1024) return `${value} KB`;
    return `${(value / 1024).toFixed(1)} MB`;
  }

  function lifecycleLabel(value) {
    return {
      current: "current",
      supporting: "supporting",
      governance: "governance",
      candidate: "candidate",
      dormant: "dormant",
      retired: "retired",
    }[value] || value || "unknown";
  }

  function cleanupActionLabel(value) {
    return {
      keep: "保留",
      observe: "观察",
      merge: "合并复核",
      archive: "归档候选",
      delete_candidate: "删除候选",
      cleanup: "建议清理",
    }[value] || value || "未知";
  }

  function cleanupReasonSummary(skill) {
    const labels = {
      retired: "已退役",
      dormant: "休眠",
      "no observed usage": "无观测使用",
      "recommended cleanup": "推荐清理",
      "in 30 day observation": "观察中",
      "30 day observation expired": "观察满30天",
      "no evals": "缺 eval",
      "no examples": "缺 examples",
      "unused scripts": "有脚本未使用",
    };
    const reasons = (skill.cleanup_reasons || [])
      .map((reason) => labels[reason] || reason)
      .filter(Boolean);
    return [...new Set(reasons)].join(" / ") || cleanupActionLabel(skill.cleanup_action);
  }

  function cleanupListAction(skill) {
    if (skill.cleanup_action === "archive") return "先归档";
    if (skill.cleanup_action === "delete_candidate") return "删除复核";
    if (skill.cleanup_action === "merge") return "合并复核";
    if (skill.cleanup_action === "observe") return "观察";
    return cleanupActionLabel(skill.cleanup_action);
  }

  function cleanupCandidates() {
    return Array.isArray(data.cleanupQueue) ? data.cleanupQueue : [];
  }

  function skillByName(name) {
    return skills.find((skill) => skill.name === name) || {};
  }

  function skillBrief(skill) {
    return skill.description || skill.originalDescription || "暂无描述";
  }

  function isProtectedSkill(skill) {
    return Boolean(skill.current || /lane owner/i.test(skill.status || "") || ["current", "supporting", "governance"].includes(skill.lifecycle));
  }

  function trashItems() {
    return Array.isArray(state.trashItems) ? state.trashItems : [];
  }

  function syncLabel(value) {
    return {
      synced: "已同步",
      drift: "分叉",
      "store-only": "仅安装",
      "project-only": "仅项目",
      missing: "缺失",
    }[value] || value || "未知";
  }

  function statusLabel(skill) {
    if (skill.status) return skill.status;
    if (skill.isGuanlan) return "installed Guanlan skill";
    return "installed skill";
  }

  function isVisible(skill) {
    if (state.view === "cleanup" && !skill.cleanup_candidate) return false;
    if (state.filter === "current" && !skill.current) return false;
    if (state.filter === "lane-owner" && !/lane owner/i.test(skill.status || "")) return false;
    if (state.filter === "needs-action" && !skill.issueCount) return false;
    if (state.filter === "sync-issue" && !skill.issues.some((issue) => ["not-installed", "not-mirrored", "sync-drift"].includes(issue.key))) return false;
    if (state.filter === "missing-evals" && skill.hasEvals) return false;
    if (state.filter === "missing-examples" && skill.hasExamples) return false;
    if (state.filter === "missing-version" && skill.version) return false;
    if (state.filter === "retired-risk" && !skill.issues.some((issue) => issue.key === "retired-risk")) return false;
    if (state.filter === "cleanup" && !skill.cleanup_candidate) return false;
    if (state.filter === "cleanup-archive" && skill.cleanup_action !== "archive") return false;
    if (state.filter === "cleanup-delete" && skill.cleanup_action !== "delete_candidate") return false;
    if (state.filter === "cleanup-merge" && skill.cleanup_action !== "merge") return false;
    if (state.filter === "cleanup-observe" && skill.cleanup_action !== "observe") return false;
    if (state.filter === "dormant" && skill.lifecycle !== "dormant") return false;
    if (state.filter === "retired" && skill.lifecycle !== "retired") return false;
    if (state.filter === "unused" && skill.usage_count > 0) return false;
    if (state.filter === "guanlan" && !skill.isGuanlan) return false;
    if (state.filter === "scripts" && !skill.hasScripts) return false;
    if (state.activeGroup && groupKey(skill) !== state.activeGroup) return false;
    if (!state.query) return true;
    const haystack = [
      skill.name,
      skill.description,
      skill.lane,
      skill.status,
      skill.role,
      skill.gates,
      skill.learning,
      skill.lifecycle,
      skill.cleanup_action,
      skill.cleanup_owner,
      skill.cleanup_reason,
      skill.replacement_skill,
      skill.installedAt,
      skill.last_used,
      skill.cleanup_reasons?.join(" "),
      skill.localPath,
      skill.projectPath,
    ].join(" ").toLowerCase();
    return haystack.includes(state.query.toLowerCase());
  }

  function sortItems(items) {
    const severity = { high: 0, medium: 1, low: 2, "": 3 };
    return [...items].sort((a, b) => {
      if (state.sort === "modified") return (b.modifiedTime || 0) - (a.modifiedTime || 0);
      if (state.sort === "size") return (b.sizeKB || 0) - (a.sizeKB || 0);
      if (state.sort === "files") return (b.fileCount || 0) - (a.fileCount || 0);
      if (state.sort === "usage") return (b.usage_count || 0) - (a.usage_count || 0);
      if (state.sort === "cleanup") return (b.cleanup_score || 0) - (a.cleanup_score || 0);
      if (state.sort === "name") return a.name.localeCompare(b.name, "en");
      if (a.current !== b.current) return a.current ? -1 : 1;
      if ((severity[a.issueSeverity] ?? 3) !== (severity[b.issueSeverity] ?? 3)) return (severity[a.issueSeverity] ?? 3) - (severity[b.issueSeverity] ?? 3);
      if (a.isGuanlan !== b.isGuanlan) return a.isGuanlan ? -1 : 1;
      return a.name.localeCompare(b.name, "en");
    });
  }

  function groupKey(skill) {
    if (state.group === "lifecycle") return lifecycleLabel(skill.lifecycle);
    if (state.group === "cleanup_action") return cleanupActionLabel(skill.cleanup_action);
    if (state.group === "status") return statusLabel(skill);
    if (state.group === "sync") return syncLabel(skill.syncState);
    if (state.group === "category") return skill.category || "Other";
    return skill.lane || skill.category || "Other";
  }

  function tags(skill) {
    const result = [];
    if (skill.current) result.push(`<span class="tag blue">current</span>`);
    if (/lane owner/i.test(skill.status || "")) result.push(`<span class="tag gold">lane owner</span>`);
    if (skill.hasEvals) result.push(`<span class="tag green">eval</span>`);
    if (skill.hasExamples) result.push(`<span class="tag green">examples</span>`);
    if (skill.hasMemory) result.push(`<span class="tag">memory</span>`);
    if (skill.hasScripts) result.push(`<span class="tag purple">scripts</span>`);
    if (skill.version) result.push(`<span class="tag">v${html(skill.version)}</span>`);
    result.push(`<span class="tag ${skill.syncState === "synced" ? "green" : "orange"}">${html(syncLabel(skill.syncState))}</span>`);
    for (const issue of skill.issues.slice(0, 3)) result.push(`<span class="tag ${issue.severity === "high" ? "red" : issue.severity === "medium" ? "orange" : ""}">${html(issue.label)}</span>`);
    return result.join("");
  }

  function card(skill) {
    return `<article class="skill-card ${skill.isGuanlan ? "is-guanlan" : ""} ${skill.issueCount ? "has-issue" : ""}" tabindex="0" data-skill="${html(skill.name)}">
      <div class="skill-top">
        <div>
          <strong>${html(skill.name)}</strong>
          <span>${html(skill.lane || skill.category || "Unclassified")}</span>
        </div>
        <em>${html(statusLabel(skill))}</em>
      </div>
      <p>${html(skill.description || skill.originalDescription || "暂无描述")}</p>
      <div class="tag-row">${tags(skill)}</div>
      <div class="skill-foot">
        <span>${html(skill.usage_count || 0)} uses</span>
        <span>${html(skill.last_used || "unused")}</span>
      </div>
    </article>`;
  }

  function renderMetrics() {
    const summary = data.meta?.summary || {};
    const version = data.meta?.version || {};
    const versionText = version.version ? `Skill Store v${version.version}` : "Skill Store";
    const quality = `${summary.evalCoverage || 0}% / ${summary.exampleCoverage || 0}%`;
    const metrics = [
      ["当前", summary.current || 0],
      ["生产入口", summary.laneOwners || 0],
      ["待处理", summary.needsAction || 0],
      summary.syncIssues ? ["同步问题", summary.syncIssues] : ["休眠", summary.dormant || 0],
      ["清理", summary.cleanupQueue || 0],
      ["覆盖", quality],
    ];
    $("[data-metrics]").innerHTML = metrics.map(([label, value]) => `<article class="metric"><span>${html(label)}</span><strong>${html(value)}</strong></article>`).join("");
    $("[data-generated]").textContent = `${versionText.replace("Skill Store v", "版本 ")} · 更新 ${data.meta?.generatedAt || "-"} · ${summary.total || skills.length} 项能力 · 观澜相关 ${summary.guanlan || 0}`;
  }

  function renderLaneOwners() {
    const container = $("[data-lane-owners]");
    if (!container) return;
    const owners = skills.filter((skill) => /lane owner/i.test(skill.status || ""));
    container.innerHTML = owners.map((skill) => `<article class="lane-row" data-skill="${html(skill.name)}">
      <span>${html(skill.lane)}</span>
      <strong>${html(skill.name)}</strong>
      <em>${skill.issueCount ? `${skill.issueCount} issue` : "ready"}</em>
    </article>`).join("");
  }

  function renderIssueList() {
    const container = $("[data-issues]");
    if (!container) return;
    const issueItems = sortItems(skills.filter((skill) => skill.issueCount)).slice(0, 8);
    container.innerHTML = issueItems.length ? issueItems.map((skill) => `<button type="button" class="issue-row" data-skill="${html(skill.name)}">
      <span>${html(skill.name)}</span>
      <strong>${skill.issues.map((issue) => html(issue.label)).join(" / ")}</strong>
    </button>`).join("") : `<div class="empty-line">暂无需处理项</div>`;
  }

  function renderCleanupQueue() {
    const row = (item) => {
      const skill = { ...skillByName(item.name), ...item };
      return `<label class="cleanup-row">
      <input type="checkbox" data-cleanup-select="${html(item.name)}" ${state.selectedCleanup.has(item.name) ? "checked" : ""}>
      <strong title="${html(item.name)}">${html(item.name)}</strong>
      <span class="cleanup-desc" title="${html(skillBrief(skill))}">${html(skillBrief(skill))}</span>
      <span class="cleanup-status">
        <em title="${html(cleanupReasonSummary(skill))}">${html(cleanupReasonSummary(skill))}</em>
        <button type="button" class="row-action" data-mark-common="${html(item.name)}">标为常用</button>
      </span>
    </label>`;
    };
    const candidates = cleanupCandidates();
    $("[data-cleanup-candidate-count]").textContent = `${candidates.length} 个`;
    $("[data-cleanup-delete-candidates]").innerHTML = candidates.length ? candidates.map(row).join("") : `<div class="empty-line">暂无建议清理项</div>`;
    updateCleanupSelection();
  }

  function renderTrashZone() {
    const list = $("[data-trash-items]");
    const count = $("[data-trash-count]");
    if (!list || !count) return;
    const items = trashItems();
    count.textContent = `${items.length} 个`;
    if (!state.trashLoaded) {
      list.innerHTML = `<div class="empty-line">正在读取暂存区</div>`;
      updateTrashSelection();
      return;
    }
    const row = (item) => `<label class="cleanup-row trash-row">
      <input type="checkbox" data-trash-select="${html(item.id)}" ${state.selectedTrash.has(item.id) ? "checked" : ""}>
      <strong title="${html(item.name)}">${html(item.name)}</strong>
      <span class="cleanup-desc" title="${html(item.batch || "暂存区")}">${html(item.batch ? `暂存批次 ${item.batch}` : "暂存区 skill")}</span>
      <span class="cleanup-status"><em title="${html(item.batch || "暂存区")}">${html(item.deletedAt || "-")} · ${html(formatSize(item.sizeKB || 0))} · ${html(item.fileCount || 0)} files</em></span>
    </label>`;
    list.innerHTML = items.length ? items.map(row).join("") : `<div class="empty-line">暂存区为空</div>`;
    updateTrashSelection();
  }

  function renderSidebar(items) {
    const counts = new Map();
    for (const skill of items) counts.set(groupKey(skill), (counts.get(groupKey(skill)) || 0) + 1);
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
    $("[data-sidebar]").innerHTML = [`<button type="button" class="${!state.activeGroup ? "active" : ""}" data-group-key="">全部 <span>${items.length}</span></button>`]
      .concat(rows.map(([key, count]) => `<button type="button" class="${state.activeGroup === key ? "active" : ""}" data-group-key="${html(key)}">${html(key)} <span>${count}</span></button>`))
      .join("");
  }

  function renderSkills() {
    const visible = sortItems(skills.filter(isVisible));
    renderSidebar(skills.filter((skill) => {
      const previous = state.activeGroup;
      state.activeGroup = "";
      const ok = isVisible(skill);
      state.activeGroup = previous;
      return ok;
    }));
    const groups = new Map();
    for (const skill of visible) {
      const key = groupKey(skill);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(skill);
    }
    $("[data-results-count]").textContent = `${visible.length} 个匹配`;
    $("[data-skill-list]").innerHTML = visible.length ? [...groups.entries()].map(([key, items]) => `<section class="skill-section">
      <header><strong>${html(key)}</strong><span>${items.length}</span></header>
      <div class="skill-grid">${items.map(card).join("")}</div>
    </section>`).join("") : `<div class="empty">没有匹配的 Skill</div>`;
    postHeight();
  }

  function renderAll() {
    renderView();
    renderMetrics();
    renderLaneOwners();
    renderIssueList();
    renderCleanupQueue();
    renderTrashZone();
    renderSkills();
  }

  function renderView() {
    $(".shell")?.setAttribute("data-skill-view", state.view);
    $$("[data-view]").forEach((button) => button.setAttribute("aria-current", String(button.dataset.view === state.view)));
    $$("[data-view-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === state.view));
    const controls = $("[data-controls]");
    if (controls) controls.hidden = state.view !== "catalog";
    const catalogList = $("[data-catalog-list]");
    if (catalogList) catalogList.hidden = state.view !== "catalog";
    const cleanupFilter = $("[data-cleanup-filter]");
    if (cleanupFilter) {
      cleanupFilter.hidden = state.view !== "cleanup";
      cleanupFilter.value = state.filter.startsWith("cleanup") ? state.filter : "cleanup";
    }
  }

  function setView(view) {
    state.view = view === "cleanup" ? "cleanup" : "catalog";
    state.activeGroup = "";
    if (state.view === "cleanup") {
      state.filter = "cleanup";
      state.group = "cleanup_action";
      state.sort = "cleanup";
      if (!state.trashLoaded) loadTrashItems({ silent: true });
    } else {
      state.filter = "all";
      state.group = "lane";
      state.sort = "priority";
    }
    const sort = $("[data-sort]");
    const group = $("[data-group]");
    if (sort) sort.value = state.sort;
    if (group) group.value = state.group;
    const params = new URLSearchParams(location.search);
    if (state.view === "cleanup") params.set("view", "cleanup");
    else params.delete("view");
    const nextQuery = params.toString();
    history.replaceState(null, "", `${location.pathname}${nextQuery ? `?${nextQuery}` : ""}${location.hash}`);
    renderAll();
  }

  function detailItem(label, value) {
    return `<div class="detail-item"><span>${html(label)}</span><strong>${html(value || "未记录")}</strong></div>`;
  }

  function detailCleanupAction(skill) {
    if (skill.cleanup_candidate) return `<button type="button" class="action-button" disabled>已在建议清理</button>`;
    if (isProtectedSkill(skill)) return `<button type="button" class="action-button" disabled>受保护</button>`;
    return `<button type="button" class="action-button primary" data-detail-cleanup="${html(skill.name)}">放入清理列表</button>`;
  }

  function openDetail(name) {
    const skill = skills.find((item) => item.name === name);
    if (!skill) return;
    $("[data-detail-title]").innerHTML = `<h2>${html(skill.name)}</h2><p>${html(skill.lane || skill.category || "Skill")} · ${html(statusLabel(skill))}</p>`;
    $("[data-detail-body]").innerHTML = `
      <section class="detail-block">
        <h3>责任</h3>
        <p>${html(skill.description || skill.originalDescription || "暂无描述")}</p>
        <div class="detail-actions">
          ${detailCleanupAction(skill)}
        </div>
        <div class="cleanup-action-status detail-action-status" data-detail-action-status aria-live="polite" hidden></div>
      </section>
      <section class="detail-grid">
        ${detailItem("版本", skill.version ? `v${skill.version}` : "未标注")}
        ${detailItem("Lifecycle", lifecycleLabel(skill.lifecycle))}
        ${detailItem("清理动作", cleanupActionLabel(skill.cleanup_action))}
        ${detailItem("负责人", skill.cleanup_owner || "-")}
        ${detailItem("替代 skill", skill.replacement_skill || "-")}
        ${detailItem("安装日期", skill.installedAt || "-")}
        ${detailItem("使用次数", skill.usage_count || 0)}
        ${detailItem("最近使用", skill.last_used || "未观测")}
        ${detailItem("同步状态", syncLabel(skill.syncState))}
        ${detailItem("eval", skill.hasEvals ? "有" : "缺")}
        ${detailItem("examples", skill.hasExamples ? "有" : "缺")}
        ${detailItem("MEMORY", skill.hasMemory ? "有" : "缺")}
        ${detailItem("references", skill.hasReferences ? "有" : "缺")}
      </section>
      <section class="detail-block">
        <h3>上下游与 gates</h3>
        <p><b>上游：</b>${html(skill.upstream || "-")}</p>
        <p><b>下游：</b>${html(skill.downstream || "-")}</p>
        <p><b>主要 gates：</b>${html(skill.gates || "-")}</p>
      </section>
      <section class="detail-block">
        <h3>最近学习</h3>
        <p>${html(skill.learning || "-")}</p>
      </section>
      <section class="detail-grid">
        ${detailItem("项目镜像", skill.projectPath)}
        ${detailItem("运行时安装", skill.localPath)}
        ${detailItem("文件统计", `${formatSize(skill.sizeKB)} · ${skill.fileCount} files`)}
        ${detailItem("最近修改", skill.modifiedAt)}
      </section>
      <section class="detail-block">
        <h3>清理判断</h3>
        <p><b>清理分：</b>${html(skill.cleanup_score || 0)}</p>
        <p><b>建议动作：</b>${html(cleanupActionLabel(skill.cleanup_action))}</p>
        <p><b>处理理由：</b>${html(skill.cleanup_reason || (skill.cleanup_reasons || []).join(" / ") || "不建议清理")}</p>
        <p><b>替代项：</b>${html(skill.replacement_skill || "-")}</p>
      </section>
      <section class="detail-block">
        <h3>需处理</h3>
        <div class="tag-row">${skill.issues.length ? skill.issues.map((issue) => `<span class="tag ${issue.severity === "high" ? "red" : issue.severity === "medium" ? "orange" : ""}">${html(issue.label)}</span>`).join("") : "<span class=\"tag green\">暂无</span>"}</div>
      </section>
    `;
    $("[data-detail]").classList.add("open");
    postHeight();
  }

  function closeDetail() {
    $("[data-detail]")?.classList.remove("open");
    postHeight();
  }

  function updateCleanupSelection() {
    const count = state.selectedCleanup.size;
    const label = $("[data-cleanup-selection]");
    if (label) label.textContent = `已选 ${count}`;
  }

  function updateTrashSelection() {
    const count = state.selectedTrash.size;
    const label = $("[data-trash-selection]");
    if (label) label.textContent = `已选 ${count}`;
  }

  async function loadTrashItems({ silent = false } = {}) {
    const status = $("[data-trash-action-status]");
    if (!silent && status) {
      status.hidden = false;
      status.innerHTML = `<h3>正在刷新暂存区</h3><p>正在读取已经移入 .skill-store-trash 的 skill。</p>`;
    }
    try {
      const response = await fetch(`${cleanupOpsApi}/skill-store/trash`);
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "读取暂存区失败");
      state.trashItems = Array.isArray(result.items) ? result.items : [];
      state.trashLoaded = true;
      state.selectedTrash = new Set([...state.selectedTrash].filter((id) => state.trashItems.some((item) => item.id === id)));
      renderTrashZone();
      if (!silent && status) {
        status.hidden = false;
        status.innerHTML = `<h3>暂存区已刷新</h3><p>当前暂存区共有 ${html(state.trashItems.length)} 个 skill。</p>`;
      }
    } catch (error) {
      state.trashLoaded = true;
      state.trashItems = [];
      renderTrashZone();
      if (status) {
        status.hidden = false;
        status.innerHTML = `<h3>暂存区服务未连接</h3><p>需要先启动本地 Skill Store 管理服务，才能查看暂存区或永久删除。</p><p>${html(error.message || error)}</p>`;
      }
    } finally {
      updateTrashSelection();
      postHeight();
    }
  }

  async function deleteSelectedCleanup() {
    const status = $("[data-cleanup-action-status]");
    if (!status) return;
    const names = [...state.selectedCleanup];
    status.hidden = false;
    if (!names.length) {
      status.innerHTML = `<h3>未选择 skill</h3><p>先勾选列表里的 skill，再点击移入暂存区。</p>`;
      return;
    }
    status.innerHTML = `<h3>正在移入暂存区</h3><p>正在移出 ${html(names.length)} 个 skill，并重建 Skill Store 数据。</p>`;
    try {
      const response = await fetch(`${cleanupOpsApi}/skill-store/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "移入暂存区失败");
      const deleted = result.deleted?.length || 0;
      const refused = result.refused?.length || 0;
      status.innerHTML = `<h3>已移入暂存区</h3><p>已移出 ${html(deleted)} 个 skill；拒绝 ${html(refused)} 个受保护或不在清理列表内的 skill。</p><p>页面即将刷新。</p>`;
      state.selectedCleanup.clear();
      window.setTimeout(() => location.reload(), 900);
    } catch (error) {
      status.innerHTML = `<h3>管理服务未连接</h3><p>本地管理服务未启动或连接失败。请先让我启动 Skill Store 管理服务，再回到页面点击移入暂存区。</p><p>${html(error.message || error)}</p>`;
    } finally {
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
      updateCleanupSelection();
      postHeight();
    }
  }

  async function markCommon(name) {
    const status = $("[data-cleanup-action-status]");
    if (!status) return;
    status.hidden = false;
    status.innerHTML = `<h3>正在标为常用</h3><p>正在把 ${html(name)} 移回正常 skill 目录。</p>`;
    try {
      const response = await fetch(`${cleanupOpsApi}/skill-store/mark-common`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: [name] }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "标为常用失败");
      const updated = result.updated?.length || 0;
      const refused = result.refused?.length || 0;
      status.innerHTML = `<h3>已标为常用</h3><p>已更新 ${html(updated)} 个 skill；拒绝 ${html(refused)} 个不在清理列表中的 skill。页面即将刷新。</p>`;
      state.selectedCleanup.delete(name);
      window.setTimeout(() => location.reload(), 700);
    } catch (error) {
      status.innerHTML = `<h3>管理服务未连接</h3><p>本地管理服务未启动或连接失败。请先让我启动 Skill Store 管理服务，再回到页面点击标为常用。</p><p>${html(error.message || error)}</p>`;
    } finally {
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
      updateCleanupSelection();
      postHeight();
    }
  }

  async function markCleanup(name) {
    const status = $("[data-detail-action-status]") || $("[data-cleanup-action-status]");
    if (!status) return;
    status.hidden = false;
    status.innerHTML = `<h3>正在放入清理列表</h3><p>正在把 ${html(name)} 加入建议清理。</p>`;
    try {
      const response = await fetch(`${cleanupOpsApi}/skill-store/mark-cleanup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: [name] }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "放入清理列表失败");
      const updated = result.updated?.length || 0;
      const refused = result.refused?.length || 0;
      status.innerHTML = `<h3>已放入清理列表</h3><p>已更新 ${html(updated)} 个 skill；拒绝 ${html(refused)} 个受保护或不存在的 skill。页面即将刷新。</p>`;
      window.setTimeout(() => location.reload(), 700);
    } catch (error) {
      status.innerHTML = `<h3>管理服务未连接</h3><p>本地管理服务未启动或连接失败。请先让我启动 Skill Store 管理服务，再回到详情里点击放入清理列表。</p><p>${html(error.message || error)}</p>`;
    } finally {
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
      postHeight();
    }
  }

  async function permanentlyDeleteSelectedTrash() {
    const status = $("[data-trash-action-status]");
    if (!status) return;
    const ids = [...state.selectedTrash];
    status.hidden = false;
    if (!ids.length) {
      status.innerHTML = `<h3>未选择 skill</h3><p>先勾选暂存区里的 skill，再点击永久删除。</p>`;
      return;
    }
    status.innerHTML = `<h3>正在永久删除</h3><p>正在从 .skill-store-trash 里永久删除 ${html(ids.length)} 个 skill。这个动作不会影响主 Skill Store。</p>`;
    try {
      const response = await fetch(`${cleanupOpsApi}/skill-store/trash/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "永久删除失败");
      const deleted = result.deleted?.length || 0;
      const refused = result.refused?.length || 0;
      state.trashItems = Array.isArray(result.items) ? result.items : [];
      state.trashLoaded = true;
      state.selectedTrash.clear();
      renderTrashZone();
      status.innerHTML = `<h3>永久删除完成</h3><p>已永久删除 ${html(deleted)} 个 skill；拒绝 ${html(refused)} 个不存在或不安全的条目。</p>`;
    } catch (error) {
      status.innerHTML = `<h3>永久删除失败</h3><p>本地管理服务未连接，或暂存区条目已变化。</p><p>${html(error.message || error)}</p>`;
    } finally {
      status.scrollIntoView({ block: "nearest", behavior: "smooth" });
      updateTrashSelection();
      postHeight();
    }
  }

  function postHeight() {
    requestAnimationFrame(() => {
      const shell = $(".shell");
      const rect = shell ? shell.getBoundingClientRect() : document.body.getBoundingClientRect();
      parent.postMessage({ type: "wavesight-skill-store-height", height: Math.ceil(rect.top + rect.height + 42) }, "*");
    });
  }

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }
    const cleanupButton = event.target.closest("[data-cleanup-action]");
    if (cleanupButton) {
      if (cleanupButton.dataset.cleanupAction === "select-all") {
        for (const skill of cleanupCandidates()) state.selectedCleanup.add(skill.name);
        renderCleanupQueue();
      }
      if (cleanupButton.dataset.cleanupAction === "delete-selected") deleteSelectedCleanup();
      return;
    }
    const markCommonButton = event.target.closest("[data-mark-common]");
    if (markCommonButton) {
      event.preventDefault();
      event.stopPropagation();
      markCommon(markCommonButton.dataset.markCommon);
      return;
    }
    const detailCleanupButton = event.target.closest("[data-detail-cleanup]");
    if (detailCleanupButton) {
      markCleanup(detailCleanupButton.dataset.detailCleanup);
      return;
    }
    const trashButton = event.target.closest("[data-trash-action]");
    if (trashButton) {
      if (trashButton.dataset.trashAction === "refresh") loadTrashItems();
      if (trashButton.dataset.trashAction === "select-all") {
        for (const item of trashItems()) state.selectedTrash.add(item.id);
        renderTrashZone();
      }
      if (trashButton.dataset.trashAction === "permanent-delete") permanentlyDeleteSelectedTrash();
      return;
    }
    const group = event.target.closest("[data-group-key]");
    if (group) {
      state.activeGroup = group.dataset.groupKey;
      renderSkills();
      return;
    }
    const card = event.target.closest("[data-skill]");
    if (card) {
      openDetail(card.dataset.skill);
      return;
    }
    if (event.target.closest("[data-close-detail]") || event.target === $("[data-detail]")) closeDetail();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetail();
    if ((event.key === "Enter" || event.key === " ") && event.target.closest(".skill-card")) {
      event.preventDefault();
      openDetail(event.target.closest(".skill-card").dataset.skill);
    }
  });

  $("[data-search]")?.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    state.activeGroup = "";
    renderSkills();
  });
  $("[data-sort]")?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderSkills();
  });
  $("[data-group]")?.addEventListener("change", (event) => {
    state.group = event.target.value;
    state.activeGroup = "";
    renderSkills();
  });
  $("[data-cleanup-filter]")?.addEventListener("change", (event) => {
    state.filter = event.target.value;
    state.activeGroup = "";
    renderSkills();
  });
  document.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-cleanup-select]");
    if (checkbox) {
      if (checkbox.checked) state.selectedCleanup.add(checkbox.dataset.cleanupSelect);
      else state.selectedCleanup.delete(checkbox.dataset.cleanupSelect);
      updateCleanupSelection();
      return;
    }
    const trashCheckbox = event.target.closest("[data-trash-select]");
    if (trashCheckbox) {
      if (trashCheckbox.checked) state.selectedTrash.add(trashCheckbox.dataset.trashSelect);
      else state.selectedTrash.delete(trashCheckbox.dataset.trashSelect);
      updateTrashSelection();
    }
  });

  window.addEventListener("load", postHeight);
  window.addEventListener("resize", postHeight);
  setView(state.view);
})();
