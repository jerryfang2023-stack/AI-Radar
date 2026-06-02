/**
 * 运营后台 · 选题中心
 * Operations Console — Topic Curation Center
 * 观澜AI · v1.1
 */

(function () {
  'use strict';

  const STATE = {
    tab: 'topic-center',
    data: null,
    pitchResult: null,
    pipelineStatus: 'idle',
  };

  /* ── DOM refs ── */
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
      const w = window;
      const data = w.WaveSightSiteData || w.__SITE_DATA__ || null;
      if (!data) { console.warn('[ops] no site content data found'); return null; }
      return data;
    } catch (e) {
      console.warn('[ops] failed to load site content:', e);
      return null;
    }
  }

  async function loadFromAPI() {
    try {
      const r = await fetch('data/site-content.json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      console.warn('[ops] API fetch failed:', e.message);
      return null;
    }
  }

  async function ensureData() {
    STATE.data = loadSiteContent() || await loadFromAPI();
    return STATE.data;
  }

  /* ── 四种选题来源渲染 ── */

  function renderSignalItems(signals) {
    const container = $('[data-source-items="signals"]');
    if (!container) return;
    if (!signals || !signals.length) {
      container.innerHTML = '<p class="ops-source-empty">暂无信号数据</p>';
      $('[data-source-count="signals"]').textContent = '0';
      return;
    }
    container.innerHTML = signals.slice(0, 20).map(s => {
      const type = (s.type || s.category || '').toLowerCase();
      const typeLabel = { product_service: '产品', funding: '融资', case: '案例' }[type] || type;
      const typeClass = { product_service: 'ops-tag-product', funding: 'ops-tag-funding', case: 'ops-tag-case' }[type] || '';
      return `<div class="ops-source-item" data-signal-id="${s.id || ''}">
        <span class="ops-source-item-tag ${typeClass}">${typeLabel}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${s.title || s.name || '(未命名)'}</div>
          <div class="ops-source-item-meta">${s.source_url ? s.source_url.replace(/^https?:\/\//, '').slice(0, 40) : ''}${s.source_level ? ' · ' + s.source_level : ''}</div>
        </div>
      </div>`;
    }).join('');
    $('[data-source-count="signals"]').textContent = signals.length;
  }

  function renderOpinionItems(opinions) {
    const container = $('[data-source-items="opinions"]');
    if (!container) return;
    if (!opinions || !opinions.length) {
      container.innerHTML = '<p class="ops-source-empty">暂无观点数据</p>';
      $('[data-source-count="opinions"]').textContent = '0';
      return;
    }
    container.innerHTML = opinions.slice(0, 20).map(o => {
      const tier = (o.opinion_tier || '').toLowerCase();
      const tierLabel = { feature: '推荐', sidebar: '旁栏', archive: '存档', discard: '丢弃' }[tier] || tier;
      const tierClass = { feature: 'ops-tag-feature', sidebar: 'ops-tag-sidebar', archive: 'ops-tag-archive' }[tier] || '';
      return `<div class="ops-source-item" data-opinion-id="${o.id || ''}">
        <span class="ops-source-item-tag ${tierClass}">${tierLabel}</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${o.title || o.name || o.person || '(未命名)'}</div>
          <div class="ops-source-item-meta">${o.person || ''}${o.org ? ' · ' + o.org : ''}${o.published_date ? ' · ' + o.published_date : ''}</div>
        </div>
      </div>`;
    }).join('');
    $('[data-source-count="opinions"]').textContent = opinions.length;
  }

  function renderChangeItems(changes) {
    const container = $('[data-source-items="changes"]');
    if (!container) return;
    if (!changes || !changes.length) {
      container.innerHTML = '<p class="ops-source-empty">暂无变化候选</p>';
      $('[data-source-count="changes"]').textContent = '0';
      return;
    }
    container.innerHTML = changes.slice(0, 15).map(c => {
      return `<div class="ops-source-item">
        <span class="ops-source-item-tag">CHG</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${c.title || c.name || '(未命名)'}</div>
          <div class="ops-source-item-meta">${c.business_implication ? c.business_implication.slice(0, 80) + '…' : ''}</div>
        </div>
      </div>`;
    }).join('');
    $('[data-source-count="changes"]').textContent = changes.length;
  }

  function renderTrendItems(trends) {
    const container = $('[data-source-items="trends"]');
    if (!container) return;
    if (!trends || !trends.length) {
      container.innerHTML = '<p class="ops-source-empty">暂无趋势候选</p>';
      $('[data-source-count="trends"]').textContent = '0';
      return;
    }
    container.innerHTML = trends.slice(0, 10).map(t => {
      return `<div class="ops-source-item">
        <span class="ops-source-item-tag">TREND</span>
        <div class="ops-source-item-body">
          <div class="ops-source-item-title">${t.title || t.name || '(未命名)'}</div>
          <div class="ops-source-item-meta">${t.status || ''}${t.confidence ? ' · 置信度: ' + t.confidence : ''}</div>
        </div>
      </div>`;
    }).join('');
    $('[data-source-count="trends"]').textContent = trends.length;
  }

  /* ── 解析 site-content 数据 ── */
  function extractSources(data) {
    const out = { signals: [], opinions: [], changes: [], trends: [] };
    if (!data) return out;

    // 从 site-content 的 content 数组中提取
    if (Array.isArray(data.content)) {
      data.content.forEach(item => {
        const type = (item.type || item.contentType || '').toLowerCase();
        if (type.includes('signal') || type === 'product_service' || type === 'funding' || type === 'case') {
          out.signals.push(item);
        } else if (type.includes('opinion')) {
          out.opinions.push(item);
        } else if (type.includes('change') || type.includes('chg')) {
          out.changes.push(item);
        } else if (type.includes('trend')) {
          out.trends.push(item);
        }
      });
    }

    // 从专门字段提取
    if (Array.isArray(data.signals)) out.signals = data.signals;
    if (Array.isArray(data.signal_cards)) out.signals = data.signal_cards;
    if (Array.isArray(data.opinions)) out.opinions = data.opinions;
    if (Array.isArray(data.opinion_cards)) out.opinions = data.opinion_cards;
    if (Array.isArray(data.change_candidates)) out.changes = data.change_candidates;
    if (Array.isArray(data.selected_changes)) out.changes = data.selected_changes;
    if (Array.isArray(data.trend_candidates)) out.trends = data.trend_candidates;
    if (Array.isArray(data.trends)) out.trends = data.trends;

    return out;
  }

  /* ── 渲染所有来源 ── */
  function renderAllSources(data) {
    const sources = extractSources(data);
    renderSignalItems(sources.signals);
    renderOpinionItems(sources.opinions);
    renderChangeItems(sources.changes);
    renderTrendItems(sources.trends);
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
      // 尝试调用 VPS 上的 Hermes API 或直接本地分析
      const sources = extractSources(STATE.data);
      const result = await localPitchAnalysis(sources);

      if (result) {
        STATE.pitchResult = result;
        renderPitchResult(result);
        addLogEntry('选题Agent', '选题分析完成，输出 ' + (result.lead ? 'lead_story' : '结果') + ' 级选题');
      } else {
        addLogEntry('选题Agent', '⚠ 选题分析无结果');
      }
    } catch (e) {
      console.error('[ops] pitch failed:', e);
      addLogEntry('选题Agent', '❌ 选题分析失败: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '运行主编选题';
    }
  }

  /* ── 本地启发式选题分析（无后端时降级使用） ── */
  async function localPitchAnalysis(sources) {
    const candidates = [];

    // 从信号卡中提取候选
    (sources.signals || []).forEach(s => {
      const type = (s.type || s.category || '').toLowerCase();
      let score = 40;
      if (type === 'funding') score += 15;
      if (type === 'product_service') score += 10;
      if (s.source_level === 'S') score += 10;
      if (s.source_level === 'A') score += 5;
      const title = s.title || s.name || '';
      candidates.push({ title, type: 'signal', subType: type, score, sourceId: s.id });
    });

    // 从观点卡中提取候选
    (sources.opinions || []).forEach(o => {
      const tier = (o.opinion_tier || '').toLowerCase();
      let score = 35;
      if (tier === 'feature') score += 15;
      if (tier === 'sidebar') score += 5;
      const title = (o.person ? o.person + '：' : '') + (o.title || o.name || '');
      candidates.push({ title, type: 'opinion', subType: tier, score, sourceId: o.id });
    });

    // 从变化候选中提取
    (sources.changes || []).forEach(c => {
      let score = 50;
      const title = c.title || c.name || '';
      candidates.push({ title, type: 'change', subType: 'chg', score, sourceId: c.id });
    });

    // 从趋势候选中提取
    (sources.trends || []).forEach(t => {
      let score = 30;
      const title = t.title || t.name || '';
      candidates.push({ title, type: 'trend', subType: 'trend', score, sourceId: t.id });
    });

    // 排序取前三
    candidates.sort((a, b) => b.score - a.score);
    const top = candidates.slice(0, 3);

    if (!top.length) return null;

    const result = {
      date: new Date().toISOString().slice(0, 10),
      lead: top[0],
      sharpened: top[1] || null,
      hold: top[2] || null,
    };
    return result;
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

    if (result.lead) {
      lead.hidden = false;
      $('[data-ops-pitch-lead-title]').textContent = result.lead.title || '(未命名)';
      $('[data-ops-pitch-lead-desc]').textContent = `${result.lead.type === 'signal' ? '📡 信号' : result.lead.type === 'opinion' ? '💬 观点' : '🔄 变化'} · 类型: ${result.lead.subType}`;
      $('[data-ops-pitch-lead-score]').textContent = result.lead.score + '/100';
    }

    if (result.sharpened) {
      sharpened.hidden = false;
      $('[data-ops-pitch-sharpened-title]').textContent = result.sharpened.title || '(未命名)';
      $('[data-ops-pitch-sharpened-desc]').textContent = `${result.sharpened.type} · 类型: ${result.sharpened.subType}`;
      $('[data-ops-pitch-sharpened-score]').textContent = result.sharpened.score + '/100';
    }

    if (result.hold) {
      hold.hidden = false;
      $('[data-ops-pitch-hold-title]').textContent = result.hold.title || '(未命名)';
      $('[data-ops-pitch-hold-desc]').textContent = `${result.hold.type} · 类型: ${result.hold.subType}`;
      $('[data-ops-pitch-hold-score]').textContent = result.hold.score + '/100';
    }
  }

  /* ── 日志 ── */
  function addLogEntry(agent, msg) {
    const feed = $('[data-ops-log-feed]');
    if (!feed) return;
    const empty = $('.ops-log-empty', feed);
    if (empty) empty.remove();

    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour12: false });
    const entry = document.createElement('div');
    entry.className = 'ops-log-entry';
    entry.innerHTML = `<span class="ops-log-time">${time}</span> <span class="ops-log-agent">[${agent}]</span> <span class="ops-log-msg">${msg}</span>`;
    feed.prepend(entry);

    // 限制日志数量
    while (feed.children.length > 100) feed.lastChild.remove();
  }

  /* ── Pipeline 状态 ── */
  function updatePipelineStatus(statusMap) {
    Object.entries(statusMap).forEach(([stage, status]) => {
      const el = $(`[data-ops-stage-status="${stage}"]`);
      const timeEl = $(`[data-ops-stage-time="${stage}"]`);
      const stageCard = el?.closest('.ops-pipeline-stage');
      if (el) el.textContent = status.label || status;
      if (timeEl) timeEl.textContent = status.time || '';
      if (stageCard) {
        stageCard.dataset.status = status.val || 'idle';
      }
    });
  }

  /* ── 初始化 ── */
  async function init() {
    // Tab 切换
    $$('[data-ops-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.opsTab));
    });

    // 刷新数据
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
    if (pitchBtn) {
      pitchBtn.addEventListener('click', runPitch);
    }

    // 设置表单
    const settingsForm = $('[data-ops-settings-form]');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const settings = Object.fromEntries(formData);
        try {
          localStorage.setItem('ops_settings', JSON.stringify(settings));
          addLogEntry('系统', '设置已保存');
        } catch (err) {
          addLogEntry('系统', '❌ 保存设置失败: ' + err.message);
        }
      });
      // 恢复设置
      try {
        const saved = JSON.parse(localStorage.getItem('ops_settings') || '{}');
        if (saved.pitch_schedule) settingsForm.querySelector('[name="pitch_schedule"]').value = saved.pitch_schedule;
        if (saved.pitch_min_score) settingsForm.querySelector('[name="pitch_min_score"]').value = saved.pitch_min_score;
        if (saved.auto_write) settingsForm.querySelector('[name="auto_write"]').value = saved.auto_write;
        if (saved.notify_channel) settingsForm.querySelector('[name="notify_channel"]').value = saved.notify_channel;
      } catch (e) { /* ignore */ }
    }

    // 展开全部
    const expandBtn = $('[data-ops-pitch-expand]');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        $$('.ops-pitch-result-card[hidden]', $('[data-ops-pitch-results]')).forEach(c => c.hidden = false);
        expandBtn.hidden = true;
      });
    }

    // 加载数据
    addLogEntry('系统', '运营后台初始化完成');
    await ensureData();
    if (STATE.data) {
      renderAllSources(STATE.data);
      addLogEntry('系统', `加载了 ${STATE.data.content ? STATE.data.content.length : 0} 条内容`);
    } else {
      addLogEntry('系统', '⚠ 未加载到数据，请在数据同步后刷新');
    }

    // Pipeline状态（默认占位）
    updatePipelineStatus({
      monitor: { val: 'idle', label: '等待中' },
      signals: { val: 'idle', label: '等待中' },
      pitch: { val: 'idle', label: '等待中' },
      write: { val: 'idle', label: '等待中' },
      qc: { val: 'idle', label: '等待中' },
    });

    // 最后同步时间
    const syncEl = $('[data-ops-last-sync]');
    if (syncEl) {
      syncEl.textContent = '上次同步: ' + new Date().toLocaleString('zh-CN');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
