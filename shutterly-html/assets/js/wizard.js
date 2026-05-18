/* =================================================================
   Shutterly — Admin Launch Wizard (static-version host).
   Stores progress in localStorage. Step list comes from data.js.
   ================================================================= */

(function () {
  const DATA = window.SHUTTERLY_DATA;
  const S = window.Shutterly;
  const KEY = 'shutterly:wizard';
  const steps = DATA.wizardSteps;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      return {};
    }
  }
  function saveState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  function copyToClipboard(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.append(ta);
      ta.select(); document.execCommand('copy');
      ta.remove();
    }
  }

  function fieldNode(field, value, onInput) {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const lbl = document.createElement('label');
    lbl.className = 'field-label';
    lbl.textContent = field.label;
    wrap.appendChild(lbl);

    let input;
    if (field.kind === 'select') {
      input = document.createElement('select');
      input.className = 'select';
      const blank = document.createElement('option');
      blank.value = ''; blank.textContent = '— Choose —';
      input.append(blank);
      field.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.value; opt.textContent = o.label;
        if (value === o.value) opt.selected = true;
        input.append(opt);
      });
    } else if (field.kind === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'textarea';
      input.value = value || '';
    } else if (field.kind === 'checkbox') {
      const wrap2 = document.createElement('label');
      wrap2.className = 'checkbox';
      input = document.createElement('input');
      input.type = 'checkbox'; input.checked = !!value;
      wrap2.append(input, document.createTextNode(' ' + field.label));
      wrap.innerHTML = ''; // drop the lbl, we use inline
      wrap.append(wrap2);
      input.addEventListener('change', () => onInput(input.checked));
      return wrap;
    } else {
      input = document.createElement('input');
      input.className = 'input';
      input.type = field.kind === 'email' ? 'email' : field.kind === 'password' ? 'password' : field.kind === 'number' ? 'number' : 'text';
      input.value = value || '';
      if (field.placeholder) input.placeholder = field.placeholder;
    }

    input.addEventListener('input', () => onInput(input.value));
    input.addEventListener('change', () => onInput(input.value));
    wrap.appendChild(input);
    if (field.hint) {
      const h = document.createElement('p');
      h.className = 'field-hint'; h.textContent = field.hint;
      wrap.appendChild(h);
    }
    return wrap;
  }

  function render(idx) {
    const state = loadState();
    state.currentStep = Math.max(0, Math.min(idx, steps.length - 1));
    saveState(state);
    const root = document.getElementById('wizard-root');
    if (!root) return;

    const step = steps[state.currentStep];
    const percent = Math.round((state.currentStep / Math.max(1, steps.length - 1)) * 100);
    const payload = state.payload || {};
    const stepData = payload[step.slug] || {};

    root.innerHTML = '';
    root.append(buildHeader(step, percent));
    root.append(buildBody(step, state, stepData));
    root.append(buildSidebar(state));
    root.append(buildFooter(state));
  }

  function buildHeader(step, percent) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="flex justify-between items-end flex-wrap gap-3">
        <div>
          <span class="badge badge-brand">${S.ICONS.sparkles} ${DATA.i18n[S.Locale.get()].wizard.title}</span>
          <h1 class="heading-display text-3xl" style="margin-top:8px">${escapeHtml(step.title)}</h1>
          <p class="text-muted" style="margin-top:4px">${escapeHtml(step.subtitle)}</p>
          ${step.group ? `<span class="badge badge-default" style="margin-top:6px">${step.group}</span>` : ''}
        </div>
        <div class="text-right">
          <p class="text-sm text-muted">Step ${(loadState().currentStep ?? 0) + 1} of ${steps.length}</p>
          <p class="text-xs text-muted">${percent}% complete</p>
        </div>
      </div>
      <div class="progress" style="margin-top:16px"><div class="progress-bar" style="width:${percent}%"></div></div>
    `;
    return wrap;
  }

  function buildBody(step, state, stepData) {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; gap:16px; margin-top:24px; grid-template-columns: 1fr;';
    if (window.innerWidth >= 1024) grid.style.gridTemplateColumns = '1fr 280px';

    // Primary
    const main = document.createElement('div');
    main.className = 'card';
    main.style.padding = '24px';

    const intro = document.createElement('p');
    intro.className = 'text-base';
    intro.style.marginBottom = '12px';
    intro.textContent = step.intro;
    main.appendChild(intro);

    if (step.doc) {
      const det = document.createElement('details');
      det.open = true;
      det.style.cssText = 'background:var(--muted); padding:14px; border-radius:12px; border:1px solid var(--border); margin-bottom:14px;';
      const sum = document.createElement('summary');
      sum.style.cssText = 'cursor:pointer; font-weight:500; font-size:13px;';
      sum.textContent = 'What this step does';
      det.appendChild(sum);
      const pre = document.createElement('div');
      pre.style.cssText = 'white-space:pre-wrap; margin-top:10px; font-size:14px; line-height:1.6;';
      pre.innerHTML = S.renderMarkdown(step.doc);
      det.appendChild(pre);
      main.appendChild(det);
    }

    if (step.commands && step.commands.length) {
      const cmdBox = document.createElement('div');
      cmdBox.className = 'wizard-doc';
      const t = document.createElement('p');
      t.className = 'text-xs uppercase tracking-wider';
      t.style.opacity = '0.7';
      t.style.marginBottom = '8px';
      t.textContent = 'Commands';
      cmdBox.appendChild(t);
      step.commands.forEach(c => {
        const row = document.createElement('div');
        row.className = 'wizard-cmd';
        const code = document.createElement('code');
        code.textContent = c.cmd;
        const btn = document.createElement('button');
        btn.className = 'wizard-copy-btn';
        btn.innerHTML = S.ICONS.copy + ' Copy';
        btn.addEventListener('click', () => { copyToClipboard(c.cmd); S.toast('Copied', 'success'); });
        const label = document.createElement('div');
        label.style.cssText = 'font-size:11px; opacity:0.6; margin-bottom:4px;';
        label.textContent = c.label;
        const wrap = document.createElement('div');
        wrap.appendChild(label);
        const inner = document.createElement('div');
        inner.style.cssText = 'display:flex; justify-content:space-between; align-items:center; gap:8px;';
        inner.append(code, btn);
        wrap.appendChild(inner);
        cmdBox.appendChild(wrap);
      });
      main.appendChild(cmdBox);
    }

    if (step.fields && step.fields.length) {
      const fieldsWrap = document.createElement('div');
      fieldsWrap.style.cssText = 'display:grid; gap:12px; margin-top:16px;' + (step.fields.length > 1 ? 'grid-template-columns:1fr 1fr;' : '');
      step.fields.forEach(f => {
        const node = fieldNode(f, stepData[f.key], (v) => {
          const s = loadState();
          s.payload = s.payload || {};
          s.payload[step.slug] = s.payload[step.slug] || {};
          s.payload[step.slug][f.key] = v;
          saveState(s);
          // Persist site-wide settings keys
          if (f.key === 'siteName' || f.key === 'tagline' || f.key === 'defaultLocale' || f.key === 'adminEmail' || f.key === 'storage' || f.key === 'siteUrl') {
            S.Settings.set(f.key, v);
          }
        });
        fieldsWrap.appendChild(node);
      });
      main.appendChild(fieldsWrap);
    }

    grid.appendChild(main);
    return grid;
  }

  function buildSidebar(state) {
    const aside = document.createElement('div');
    aside.className = 'card';
    aside.style.cssText = 'padding:16px; align-self:flex-start;';

    const head = document.createElement('p');
    head.className = 'text-xs uppercase tracking-wider text-muted';
    head.textContent = 'All steps';
    aside.appendChild(head);

    const list = document.createElement('div');
    list.className = 'wizard-progress-rail';
    list.style.marginTop = '8px';
    steps.forEach((s, i) => {
      const item = document.createElement('button');
      item.className = 'wizard-progress-item' + (i === state.currentStep ? ' active' : '');
      const num = document.createElement('span');
      num.className = 'wizard-progress-num';
      num.textContent = String(i + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'line-clamp-1';
      label.append(num, document.createTextNode(s.title));
      item.append(label);
      if (s.optional) {
        const opt = document.createElement('span');
        opt.className = 'text-xs text-muted';
        opt.textContent = 'optional';
        item.append(opt);
      }
      item.addEventListener('click', () => render(i));
      list.appendChild(item);
    });
    aside.appendChild(list);

    // Attach as a column in the grid (parent already in place)
    const grid = document.getElementById('wizard-root').querySelector('div[style*="grid"]');
    if (grid) grid.appendChild(aside);
    return aside;
  }

  function buildFooter(state) {
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-top:24px;';

    const dismiss = document.createElement('button');
    dismiss.className = 'btn btn-ghost';
    dismiss.innerHTML = S.ICONS.x + ' Dismiss wizard';
    dismiss.addEventListener('click', () => {
      const s = loadState(); s.dismissed = true; saveState(s);
      location.href = 'admin.html';
    });

    const rightBox = document.createElement('div');
    rightBox.style.cssText = 'display:flex; gap:8px;';

    const prev = document.createElement('button');
    prev.className = 'btn btn-outline';
    prev.innerHTML = S.ICONS.chevronLeft + ' Previous';
    prev.disabled = state.currentStep === 0;
    prev.addEventListener('click', () => render(state.currentStep - 1));

    const isLast = state.currentStep === steps.length - 1;
    const next = document.createElement('button');
    next.className = 'btn btn-primary';
    if (isLast) {
      next.innerHTML = S.ICONS.check + ' Mark setup complete';
      next.addEventListener('click', () => {
        const s = loadState(); s.completed = true; saveState(s);
        S.toast('Setup complete. Welcome to Shutterly.', 'success');
        setTimeout(() => location.href = 'admin.html', 500);
      });
    } else {
      next.innerHTML = 'Next step ' + S.ICONS.chevronRight;
      next.addEventListener('click', () => render(state.currentStep + 1));
    }

    rightBox.append(prev, next);
    footer.append(dismiss, rightBox);
    return footer;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  }

  /* ----------------------- Boot ----------------------- */
  function boot() {
    const session = S.Auth.getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
      const root = document.getElementById('wizard-root');
      if (!root) return;
      root.innerHTML = `
        <div class="card" style="padding:24px; text-align:center; max-width:480px; margin:80px auto;">
          <h2 class="heading-display text-2xl">Admin only</h2>
          <p class="text-muted" style="margin-top:8px">The Launch Wizard is only available to admin accounts. Sign in with your bootstrap email or check your role in Settings.</p>
          <a class="btn btn-primary" style="margin-top:16px" href="signin.html?next=admin-wizard.html">Sign in</a>
        </div>
      `;
      return;
    }
    const state = loadState();
    render(state.currentStep || 0);
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
