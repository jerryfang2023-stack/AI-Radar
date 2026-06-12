(function () {
  const data = window.WaveSightLocalSkillStore || { meta: {}, skills: [] };
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const state = { filter: "all", group: "lane", sort: "priority", query: "", activeGroup: "" };

  const $ = (selector, node = document) => node.querySelector(selector);
  const $$ = (selector, node = document) => Array.from(node.querySelectorAll(selector));
  const html = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

  function formatSize(kb) {
    const value = Number(kb) || 0;
    if (value < 1) return "<1 KB";
    if (value < 1024) return `${value} KB`;
    return `${(value / 1024).toFixed(1)} MB`;
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
    if (state.filter === "current" && !skill.current) return false;
    if (state.filter === "lane-owner" && !/lane owner/i.test(skill.status || "")) return false;
    if (state.filter === "needs-action" && !skill.issueCount) return false;
    if (state.filter === "sync-issue" && !skill.issues.some((issue) => ["not-installed", "not-mirrored", "sync-drift"].includes(issue.key))) return false;
    if (state.filter === "missing-evals" && skill.hasEvals) return false;
    if (state.filter === "missing-examples" && skill.hasExamples) return false;
    if (state.filter === "missing-version" && skill.version) return false;
    if (state.filter === "retired-risk" && !skill.issues.some((issue) => issue.key === "retired-risk")) return false;
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
      if (state.sort === "name") return a.name.localeCompare(b.name, "en");
      if (a.current !== b.current) return a.current ? -1 : 1;
      if ((severity[a.issueSeverity] ?? 3) !== (severity[b.issueSeverity] ?? 3)) return (severity[a.issueSeverity] ?? 3) - (severity[b.issueSeverity] ?? 3);
      if (a.isGuanlan !== b.isGuanlan) return a.isGuanlan ? -1 : 1;
      return a.name.localeCompare(b.name, "en");
    });
  }

  function groupKey(skill) {
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
        <span>${html(formatSize(skill.sizeKB))}</span>
        <span>${html(skill.fileCount)} files</span>
        <span>${html(skill.modifiedAt || "-")}</span>
      </div>
    </article>`;
  }

  function renderMetrics() {
    const summary = data.meta?.summary || {};
    const metrics = [
      ["Current", summary.current || 0, "当前治理技能"],
      ["Lane Owner", summary.laneOwners || 0, "三条生产 lane"],
      ["Needs Action", summary.needsAction || 0, "缺口 / 分叉 / 历史风险"],
      ["Sync Issues", summary.syncIssues || 0, "项目镜像 vs .skill-store"],
      ["Eval", `${summary.evalCoverage || 0}%`, "current 覆盖"],
      ["Examples", `${summary.exampleCoverage || 0}%`, "current 覆盖"],
    ];
    $("[data-metrics]").innerHTML = metrics.map(([label, value, note]) => `<article class="metric"><span>${html(label)}</span><strong>${html(value)}</strong><em>${html(note)}</em></article>`).join("");
    $("[data-generated]").textContent = `更新于 ${data.meta?.generatedAt || "-"} · ${summary.total || skills.length} skills · ${summary.guanlan || 0} Guanlan-related`;
  }

  function renderLaneOwners() {
    const owners = skills.filter((skill) => /lane owner/i.test(skill.status || ""));
    $("[data-lane-owners]").innerHTML = owners.map((skill) => `<article class="lane-row" data-skill="${html(skill.name)}">
      <span>${html(skill.lane)}</span>
      <strong>${html(skill.name)}</strong>
      <em>${skill.issueCount ? `${skill.issueCount} issue` : "ready"}</em>
    </article>`).join("");
  }

  function renderIssueList() {
    const issueItems = sortItems(skills.filter((skill) => skill.issueCount)).slice(0, 8);
    $("[data-issues]").innerHTML = issueItems.length ? issueItems.map((skill) => `<button type="button" class="issue-row" data-skill="${html(skill.name)}">
      <span>${html(skill.name)}</span>
      <strong>${skill.issues.map((issue) => html(issue.label)).join(" / ")}</strong>
    </button>`).join("") : `<div class="empty-line">暂无需处理项</div>`;
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
    renderMetrics();
    renderLaneOwners();
    renderIssueList();
    renderSkills();
  }

  function detailItem(label, value) {
    return `<div class="detail-item"><span>${html(label)}</span><strong>${html(value || "未记录")}</strong></div>`;
  }

  function openDetail(name) {
    const skill = skills.find((item) => item.name === name);
    if (!skill) return;
    $("[data-detail-title]").innerHTML = `<h2>${html(skill.name)}</h2><p>${html(skill.lane || skill.category || "Skill")} · ${html(statusLabel(skill))}</p>`;
    $("[data-detail-body]").innerHTML = `
      <section class="detail-block">
        <h3>责任</h3>
        <p>${html(skill.description || skill.originalDescription || "暂无描述")}</p>
      </section>
      <section class="detail-grid">
        ${detailItem("版本", skill.version ? `v${skill.version}` : "未标注")}
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

  function postHeight() {
    requestAnimationFrame(() => {
      const shell = $(".shell");
      const rect = shell ? shell.getBoundingClientRect() : document.body.getBoundingClientRect();
      parent.postMessage({ type: "wavesight-skill-store-height", height: Math.ceil(rect.top + rect.height + 42) }, "*");
    });
  }

  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-filter]");
    if (filter) {
      state.filter = filter.dataset.filter;
      state.activeGroup = "";
      $$("[data-filter]").forEach((item) => item.classList.toggle("active", item === filter));
      renderSkills();
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

  window.addEventListener("load", postHeight);
  window.addEventListener("resize", postHeight);
  renderAll();
})();
