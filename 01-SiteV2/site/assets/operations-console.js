/**
 * 运营后台 · 选题中心
 * Operations Console — Topic Curation Center
 * 四种选题来源：Raw-Pool-Pitch / 产业链分析 / Builders 文章 / 爆款改编
 * 观澜AI · v1.1
 */

(function () {
  'use strict';

  const STATE = {
    tab: 'topic-center',
    data: null,
    pitchResult: null,
    importState: {
      industryChain: { status: 'pending', lastSync: null, sources: [] },
      builders: { status: 'pending', lastSync: null, sources: [] },
      viral: { status: 'pending', lastSync: null, sources: [] },
    },
  };

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ── Tab switching ── */
  function switchTab(tab) {
    STATE.tab = tab;
    $$('[data-ops-tab]').forEach(btn => {
      btn.removeAttribute('aria-current');
      if (btn.dataset.opsTab === tab) btn.setAttribute('aria-current', 'page');
    });
    $$('[data-ops-panel]').forEach(p => p.hidden = p.dataset.opsPanel !== tab);
  }

  /* ── Data loading ── */
  function loadSiteContent() {
    try {
      return window.WaveSightSiteData || window.__SITE_DATA__ || null;
    } catch (e) {
      return null;
    }
  }

  async function loadFromAPI() {
    try {
      const r = await fetch('data/site-content.json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  async function ensureData() {
    STATE.data = loadSiteContent() || await loadFromAPI();
    return STATE.data;
  }

  /* ── 四种选题来源渲染 ── */

  // Source 1: Raw-Pool-Pitch
  function renderRawPoolItems(data) {
    const container = $('[data-source-items="raw-pool"]');
    if (!container) return;

    const items = [];
    if (data) {
      if (Array.isArray(data.signal_cards)) {
        data.signal_cards.forEach(s => items.push({ type: 'signal-card', label: '📡 信号卡', title: s.title || s.name, meta: (s.type || '') + (s.source_level ? ' · ' + s.source_level : '') }));
      }
      if (Array.isArray(data.signals)) {
        data.signals.forEach(s => items.push({ type: 'signal', label: '📡 信号', title: s.title || s.name, meta: s.type || '' }));
      }
      if (Array.isArray(data.opinion_cards)) {
        data.opinion_cards.forEach(o => items.push({ type: 'opinion', label: '💬 观点', title: (o.person ? o.person + '：' : '') + (o.title || o.name), meta: o.opinion_tier || '' }));
      }
      if (Array.isArray(data.raw) || Array.isArray(data.raw_candidates)) {
        const rawList = data.raw || data.raw_candidates || [];
        rawList.slice(-5).forEach(r => items.push({ type: 'raw', label: '📥 Raw', title: r.title || r.name || r.url, meta: r.source_name || '' }));
      }
      if (Array.isArray(data.pool) || Array.isArray(data.pool_candidates)) {
        const poolList = data.pool || data.pool_candidates || [];
        poolList.slice(-5).forEach(p => items.push({ type: 'pool', label: '🗂 Pool', title: p.title || p.name || p.url, meta: p.category || '' }));
      }
    }

    if (!items.length) {
      container.innerHTML = '<p class="ops-source-empty">暂无数据 · 等待每日监测产出</p>';
      return;
    }

    container.innerHTML = items.slice(0, 15).map(it =>
      `<div class="ops-source-item">
        <span class="ops-source-item-tag">${it.label}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${it.title || '(未命名)'}</div>
          <div class="ops-source-item-meta">${it.meta || ''}</div>
        </div>
      </div>`
    ).join('');
  }

  // Source 2: 产业链分析 (placeholder - not yet built)
  function renderIndustryChainItems(state) {
    const container = $('[data-source-items="industry-chain"]');
    if (!container) return;
    const s = state || STATE.importState.industryChain;
    if (s.status === 'pending' || !s.sources.length) {
      container.innerHTML = `<p class="ops-source-empty">
        <span class="ops-helper-msg">⏳ Hermes 定时抓取 pipeline 尚未启动</span>
        <span class="ops-helper-msg" style="margin-top:8px;font-size:11px;">计划源: SEC EDGAR · arXiv · OpenAlex · HN · 公司 Blog/Docs/Career · 云市场</span>
      </p>`;
      return;
    }
    container.innerHTML = s.sources.map(src =>
      `<div class="ops-source-item">
        <span class="ops-source-item-tag">${src.source || '源'}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${src.title || ''}</div>
          <div class="ops-source-item-meta">${src.date || ''}${src.confidence ? ' · 置信度: ' + src.confidence : ''}</div>
        </div>
      </div>`
    ).join('');
  }

  // Source 3: Builders 文章 (placeholder)
  function renderBuildersItems(state) {
    const container = $('[data-source-items="builders"]');
    if (!container) return;
    const s = state || STATE.importState.builders;
    if (s.status === 'pending' || !s.sources.length) {
      container.innerHTML = `<p class="ops-source-empty">
        <span class="ops-helper-msg">⏳ 开发者源监控尚未启动</span>
        <span class="ops-helper-msg" style="margin-top:8px;font-size:11px;">计划源: follow-builders · GitHub Release/Issue/Trending · HN Show HN · 开发者博客</span>
      </p>`;
      return;
    }
    container.innerHTML = s.sources.map(src =>
      `<div class="ops-source-item">
        <span class="ops-source-item-tag">${src.source || '源'}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${src.title || ''}</div>
          <div class="ops-source-item-meta">${src.author || ''}${src.platform ? ' · ' + src.platform : ''}</div>
        </div>
      </div>`
    ).join('');
  }

  // Source 4: 爆款改编 (placeholder)
  function renderViralItems(state) {
    const container = $('[data-source-items="viral"]');
    if (!container) return;
    const s = state || STATE.importState.viral;
    if (s.status === 'pending' || !s.sources.length) {
      container.innerHTML = `<p class="ops-source-empty">
        <span class="ops-helper-msg">⏳ 热点监控尚未启动</span>
        <span class="ops-helper-msg" style="margin-top:8px;font-size:11px;">计划源: 公众号 · 小红书 · 视频号 · 播客 · AI 热点榜 · 微信文章搜索</span>
      </p>`;
      return;
    }
    container.innerHTML = s.sources.map(src =>
      `<div class="ops-source-item">
        <span class="ops-source-item-tag">${src.platform || '平台'}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${src.title || ''}</div>
          <div class="ops-source-item-meta">🔥 ${src.viral_score || '?'} · ${src.date || ''}</div>
        </div>
      </div>`
    ).join('');
  }

  /* ── 渲染所有来源 ── */
  function renderAllSources(data) {
    renderRawPoolItems(data);
    renderIndustryChainItems();
    renderBuildersItems();
    renderViralItems();
  }

  /* ── 运行主编选题 ── */
  async function runPitch() {
    const btn = $('[data-ops-run-pitch]');
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = '选题分析中…';

    const pitchContainer = $('[data-ops-pitch-results]');
    if (pitchContainer) pitchContainer.hidden = false;

    try {
      const result = await localPitchAnalysis(STATE.data);
      if (result && result.candidates.length) {
        STATE.pitchResult = result;
        renderPitchResult(result);
        addLogEntry('选题Agent', `选题分析完成 · 评分最高: ${result.candidates[0].title.slice(0, 40)} (${result.candidates[0].score}/100)`);
      } else {
        addLogEntry('选题Agent', '⚠ 无合适选题');
      }
    } catch (e) {
      addLogEntry('选题Agent', '❌ 选题分析失败: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '运行主编选题';
    }
  }

  /* ── 本地启发式选题分析 ── */
  async function localPitchAnalysis(data) {
    const candidates = [];

    if (!data) return { date: new Date().toISOString().slice(0, 10), candidates: [] };

    // Raw-Pool-Pitch 源
    const signalCards = data.signal_cards || data.signals || [];
    signalCards.forEach(s => {
      const type = (s.type || s.category || '').toLowerCase();
      let score = 40;
      if (type === 'funding') score += 20;
      else if (type === 'product_service') score += 12;
      else if (type === 'case') score += 10;
      if (s.source_level === 'S') score += 10;
      if (s.source_level === 'A') score += 5;
      candidates.push({
        title: s.title || s.name || '(未命名信号)',
        source: 'Raw-Pool-Pitch',
        sourceIcon: '📡',
        sourceType: type,
        score,
        desc: type === 'funding' ? '融资事件' : type === 'product_service' ? '产品/服务发布' : '案例',
      });
    });

    const opinionCards = data.opinion_cards || data.opinions || [];
    opinionCards.forEach(o => {
      const tier = (o.opinion_tier || '').toLowerCase();
      let score = 35;
      if (tier === 'feature') score += 20;
      else if (tier === 'sidebar') score += 8;
      candidates.push({
        title: (o.person ? o.person + '：' : '') + (o.title || o.name || '(未命名观点)'),
        source: 'Raw-Pool-Pitch',
        sourceIcon: '💬',
        sourceType: 'opinion',
        score,
        desc: tier === 'feature' ? '推荐观点' : tier === 'sidebar' ? '旁栏观点' : '观点',
      });
    });

    // 排序去重取 top 3
    const seen = new Set();
    candidates.sort((a, b) => b.score - a.score);
    const top = [];
    for (const c of candidates) {
      const key = c.title.slice(0, 30);
      if (!seen.has(key) && top.length < 3) {
        seen.add(key);
        top.push(c);
      }
    }

    return {
      date: new Date().toISOString().slice(0, 10),
      candidates: top,
    };
  }

  /* ── 渲染选题结果 ── */
  function renderPitchResult(result) {
    const container = $('[data-ops-pitch-results]');
    if (!container) return;
    container.hidden = false;

    $('[data-ops-pitch-date]').textContent = result.date || '';

    const lead = $('[data-ops-pitch-lead]');
    const sharpened = $('[data-ops-pitch-sharpened]');
    const hold = $('[data-ops-pitch-hold]');

    const c = result.candidates || [];
    if (c[0]) {
      lead.hidden = false;
      $('[data-ops-pitch-lead-title]').textContent = c[0].title;
      $('[data-ops-pitch-lead-desc]').textContent = c[0].desc + ' · 冲突度评估中';
      $('[data-ops-pitch-lead-source]').textContent = c[0].sourceIcon + ' ' + c[0].source;
      $('[data-ops-pitch-lead-score]').textContent = c[0].score + '/100';
    }
    if (c[1]) {
      sharpened.hidden = false;
      $('[data-ops-pitch-sharpened-title]').textContent = c[1].title;
      $('[data-ops-pitch-sharpened-desc]').textContent = c[1].desc;
      $('[data-ops-pitch-sharpened-source]').textContent = c[1].sourceIcon + ' ' + c[1].source;
      $('[data-ops-pitch-sharpened-score]').textContent = c[1].score + '/100';
    }
    if (c[2]) {
      hold.hidden = false;
      $('[data-ops-pitch-hold-title]').textContent = c[2].title;
      $('[data-ops-pitch-hold-desc]').textContent = c[2].desc;
      $('[data-ops-pitch-hold-source]').textContent = c[2].sourceIcon + ' ' + c[2].source;
      $('[data-ops-pitch-hold-score]').textContent = c[2].score + '/100';
    }
  }

  /* ── 日志 ── */
  function addLogEntry(agent, msg) {
    const feed = $('[data-ops-log-feed]');
    if (!feed) return;
    const empty = $('.ops-log-empty', feed);
    if (empty) empty.remove();

    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = document.createElement('div');
    entry.className = 'ops-log-entry';
    entry.innerHTML = `<span class="ops-log-time">${time}</span> <span class="ops-log-agent">[${agent}]</span> <span class="ops-log-msg">${msg}</span>`;
    feed.prepend(entry);
    while (feed.children.length > 100) feed.lastChild.remove();
  }

  /* ── 初始化 ── */
  async function init() {
    // Tab 切换
    $$('[data-ops-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.opsTab));
    });

    // 刷新
    const refreshBtn = $('[data-ops-refresh]');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.textContent = '加载中…';
        await ensureData();
        renderAllSources(STATE.data);
        addLogEntry('系统', '数据已刷新');
        refreshBtn.disabled = false;
        refreshBtn.textContent = '刷新数据';
      });
    }

    // 运行选题
    const pitchBtn = $('[data-ops-run-pitch]');
    if (pitchBtn) pitchBtn.addEventListener('click', runPitch);

    // 展开全部
    const expandBtn = $('[data-ops-pitch-expand]');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        $$('.ops-pitch-result-card[hidden]', $('[data-ops-pitch-results]')).forEach(c => c.hidden = false);
        expandBtn.hidden = true;
      });
    }

    // 设置表单
    const settingsForm = $('[data-ops-settings-form]');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
          const fd = new FormData(settingsForm);
          localStorage.setItem('ops_settings', JSON.stringify(Object.fromEntries(fd)));
          addLogEntry('系统', '设置已保存');
        } catch (err) {
          addLogEntry('系统', '❌ 保存失败: ' + err.message);
        }
      });
      settingsForm.addEventListener('reset', () => {
        localStorage.removeItem('ops_settings');
        addLogEntry('系统', '设置已恢复默认');
      });
      try {
        const saved = JSON.parse(localStorage.getItem('ops_settings') || '{}');
        Object.entries(saved).forEach(([k, v]) => {
          const el = settingsForm.querySelector(`[name="${k}"]`);
          if (el) el.value = v;
        });
      } catch (e) { /* ignore */ }
    }

    // 加载数据
    addLogEntry('系统', '运营后台 v1.1 初始化完成 · 四种选题源');
    await ensureData();
    if (STATE.data) {
      renderAllSources(STATE.data);
      const all = STATE.data.content || [];
      const sigs = (STATE.data.signals || STATE.data.signal_cards || []).length;
      const ops = (STATE.data.opinions || STATE.data.opinion_cards || []).length;
      addLogEntry('系统', `已加载数据 · 信号: ${sigs} · 观点: ${ops} · 内容: ${all.length}`);
    } else {
      addLogEntry('系统', '⚠ 未加载到数据');
    }

    // 最后同步时间
    const syncEl = $('[data-ops-last-sync]');
    if (syncEl) syncEl.textContent = '上次同步: ' + new Date().toLocaleString('zh-CN');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
