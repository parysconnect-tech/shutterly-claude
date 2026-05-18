/* =================================================================
   Shutterly — shared front-end logic (vanilla JS).
   - Theme (light/dark/system)
   - Locale (en/af)
   - Header + footer injection
   - Local auth (mock, browser-only)
   - Progress tracking via localStorage
   - Toasts + tiny dialog helpers
   ================================================================= */

(function () {
  const DATA = window.SHUTTERLY_DATA;
  const STORAGE_KEYS = {
    theme: 'shutterly:theme',
    locale: 'shutterly:locale',
    session: 'shutterly:session',
    users: 'shutterly:users',
    progress: 'shutterly:progress',
    submissions: 'shutterly:submissions',
    wizard: 'shutterly:wizard',
    settings: 'shutterly:settings'
  };

  /* ----------------------- Theme ----------------------- */
  const Theme = {
    get() { return localStorage.getItem(STORAGE_KEYS.theme) || 'system'; },
    set(v) {
      localStorage.setItem(STORAGE_KEYS.theme, v);
      this.apply();
      document.dispatchEvent(new CustomEvent('shutterly:theme', { detail: v }));
    },
    apply() {
      const v = this.get();
      const root = document.documentElement;
      if (v === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', v);
    },
    resolved() {
      const v = this.get();
      if (v !== 'system') return v;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  };
  Theme.apply();

  /* ----------------------- Locale ---------------------- */
  const Locale = {
    get() { return localStorage.getItem(STORAGE_KEYS.locale) || 'en'; },
    set(v) {
      localStorage.setItem(STORAGE_KEYS.locale, v);
      document.documentElement.setAttribute('lang', v);
      document.dispatchEvent(new CustomEvent('shutterly:locale', { detail: v }));
      location.reload();
    },
    t(path, vars = {}) {
      const parts = path.split('.');
      let cur = DATA.i18n[this.get()] || DATA.i18n.en;
      for (const p of parts) cur = cur && cur[p];
      if (typeof cur !== 'string') return path;
      return cur.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
    }
  };
  document.documentElement.setAttribute('lang', Locale.get());

  /* ----------------------- Session (mock) -------------- */
  const Auth = {
    getSession() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null'); }
      catch { return null; }
    },
    setSession(s) { localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(s)); },
    clearSession() { localStorage.removeItem(STORAGE_KEYS.session); },
    getUsers() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]'); }
      catch { return []; }
    },
    saveUsers(arr) { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(arr)); },
    signUp({ name, email, password }) {
      const users = this.getUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with that email already exists.');
      }
      const adminEmail = (Settings.get('adminEmail') || '').toLowerCase();
      const role = adminEmail === email.toLowerCase() ? 'SUPERADMIN' : 'STUDENT';
      const user = {
        id: 'u_' + Math.random().toString(36).slice(2, 10),
        name, email, role,
        passwordHash: btoa(password), // mock — replace in real backend
        createdAt: new Date().toISOString()
      };
      users.push(user);
      this.saveUsers(users);
      this.setSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
      return user;
    },
    signIn({ email, password }) {
      const user = this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.passwordHash !== btoa(password)) {
        throw new Error('Wrong email or password.');
      }
      this.setSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
      return user;
    },
    signOut() { this.clearSession(); }
  };

  /* ----------------------- Settings (admin) ------------- */
  const Settings = {
    all() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}'); }
      catch { return {}; }
    },
    get(key) { return this.all()[key]; },
    set(key, value) {
      const s = this.all();
      s[key] = value;
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(s));
    }
  };

  /* ----------------------- Progress -------------------- */
  const Progress = {
    all() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || '{}'); }
      catch { return {}; }
    },
    forUser(userId) {
      const all = this.all();
      return all[userId] || {};
    },
    setLesson(userId, key, payload) {
      const all = this.all();
      all[userId] = all[userId] || {};
      all[userId][key] = Object.assign({}, all[userId][key], payload, { lastViewedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(all));
    },
    isComplete(userId, key) {
      return this.forUser(userId)[key]?.status === 'completed';
    },
    countCompleted(userId) {
      const data = this.forUser(userId);
      return Object.values(data).filter(p => p.status === 'completed').length;
    },
    recent(userId, n = 5) {
      const data = this.forUser(userId);
      return Object.entries(data)
        .sort((a, b) => (b[1].lastViewedAt || 0) - (a[1].lastViewedAt || 0))
        .slice(0, n)
        .map(([k, v]) => ({ key: k, ...v }));
    }
  };

  /* ----------------------- Submissions ----------------- */
  const Submissions = {
    all() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.submissions) || '[]'); }
      catch { return []; }
    },
    add({ userId, userName, challengeSlug, caption, dataUrl }) {
      const list = this.all();
      list.unshift({
        id: 's_' + Math.random().toString(36).slice(2, 10),
        userId, userName, challengeSlug, caption, dataUrl,
        createdAt: Date.now(),
        likes: 0
      });
      // Cap at 60 most recent to keep localStorage in check
      list.splice(60);
      try {
        localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(list));
      } catch (err) {
        throw new Error('Browser storage is full. Try a smaller image, or upgrade to the Next.js version.');
      }
    },
    forUser(userId) { return this.all().filter(s => s.userId === userId); }
  };

  /* ----------------------- Toast ----------------------- */
  function ensureToastContainer() {
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }
  function toast(message, type = 'default') {
    const c = ensureToastContainer();
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = message;
    c.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; }, 3000);
    setTimeout(() => el.remove(), 3300);
  }

  /* ----------------------- Icons (inline SVG) ---------- */
  const ICONS = {
    sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    monitor: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>',
    menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    home: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    book: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/></svg>',
    trophy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1 0-4h2M18 9h2a2 2 0 0 0 0-4h-2M4 22h16M10 14.66V17c0 .55.47.98.97 1.21C12 18.75 12 20 12 20s0-1.25 1.03-1.79c.5-.23.97-.66.97-1.21v-2.34M18 2H6v7a6 6 0 0 0 12 0z"/></svg>',
    images: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    flame: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    camera: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    upload: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/></svg>',
    youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
    mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    compass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>'
  };

  /* ----------------------- Logo HTML ------------------- */
  function logoHTML(href = 'index.html') {
    return `
      <a href="${href}" class="logo" aria-label="Shutterly">
        <span class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="4"/><path d="M3 9a2 2 0 0 1 2-2h2l1.5-2.4A2 2 0 0 1 10.2 4h3.6a2 2 0 0 1 1.7.9L17 7h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/></svg>
        </span>
        <span>Shutter<span class="logo-text-accent">ly</span></span>
      </a>`;
  }

  /* ----------------------- Header ---------------------- */
  function renderHeader() {
    const session = Auth.getSession();
    const t = (k) => Locale.t(k);
    const path = location.pathname.split('/').pop();
    const links = [
      { href: 'courses.html', label: t('nav.courses'), match: ['courses.html', 'course.html', 'lesson.html'] },
      { href: 'challenges.html', label: t('nav.challenges'), match: ['challenges.html', 'challenge.html'] },
      { href: 'gallery.html', label: t('nav.gallery'), match: ['gallery.html'] }
    ];
    const navHTML = links.map(l => {
      const active = l.match.includes(path) ? ' active' : '';
      return `<a class="nav-link${active}" href="${l.href}">${l.label}</a>`;
    }).join('');

    const linkHTML = `
      <a href="search.html" aria-label="${t('common.search')}" class="icon-btn">${ICONS.search}</a>
    `;
    const themeHTML = `
      <button id="theme-toggle-btn" class="icon-btn" aria-label="Toggle theme">${Theme.resolved() === 'dark' ? ICONS.sun : ICONS.moon}</button>
    `;
    const localeHTML = `
      <div class="locale-switcher" role="group" aria-label="${t('common.language')}">
        ${ICONS.globe}
        <button data-locale="en" class="${Locale.get() === 'en' ? 'active' : ''}">EN</button>
        <button data-locale="af" class="${Locale.get() === 'af' ? 'active' : ''}">AF</button>
      </div>
    `;
    const authHTML = session
      ? `
        <a class="btn btn-outline btn-sm" href="dashboard.html">${t('nav.dashboard')}</a>
        <button id="signout-btn" class="btn btn-ghost btn-sm">${t('nav.signout')}</button>
      `
      : `
        <a class="btn btn-ghost btn-sm" href="signin.html">${t('nav.signin')}</a>
        <a class="btn btn-primary btn-sm" href="signup.html">${t('nav.signup')}</a>
      `;

    return `
      <header class="site-header" id="site-header">
        <div class="container-wide">
          <div class="site-header-inner">
            ${logoHTML()}
            <nav class="md:flex" style="display:none; margin-left:24px; gap:4px;">
              ${navHTML}
            </nav>
            <div style="margin-left:auto; display:flex; align-items:center; gap:8px;">
              <div class="sm:flex" style="display:none; align-items:center; gap:8px;">
                ${linkHTML}
                ${localeHTML}
              </div>
              ${themeHTML}
              <div class="sm:flex" style="display:none; align-items:center; gap:8px;">${authHTML}</div>
              <button id="mobile-menu-btn" class="icon-btn md:hidden" aria-label="Menu">${ICONS.menu}</button>
            </div>
          </div>
        </div>
        <div id="mobile-menu" class="mobile-menu">
          <nav>
            ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
            <div class="divider"></div>
            <div style="display:flex; justify-content:space-between; padding:8px;">
              ${localeHTML}
              <button id="theme-toggle-btn-mobile" class="btn btn-outline btn-sm">${Theme.resolved() === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
            </div>
            ${session
              ? `<a class="btn btn-outline" href="dashboard.html">${t('nav.dashboard')}</a><button id="signout-btn-mobile" class="btn btn-ghost">${t('nav.signout')}</button>`
              : `<a class="btn btn-outline" href="signin.html">${t('nav.signin')}</a><a class="btn btn-primary" href="signup.html">${t('nav.signup')}</a>`
            }
          </nav>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    const t = (k) => Locale.t(k);
    return `
      <footer class="site-footer">
        <div class="container-wide">
          <div class="site-footer-grid">
            <div>
              ${logoHTML()}
              <p class="text-sm text-muted" style="margin-top:12px; max-width:360px;">${t('brand.blurb')}</p>
              <div class="social-row">
                <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
                <a href="#" aria-label="YouTube">${ICONS.youtube}</a>
                <a href="mailto:hello@shutterly.co.za" aria-label="Email">${ICONS.mail}</a>
              </div>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-muted font-semibold">Learn</p>
              <ul style="margin-top:12px; display:flex; flex-direction:column; gap:8px;" class="text-sm">
                <li><a href="courses.html">${t('nav.courses')}</a></li>
                <li><a href="challenges.html">${t('nav.challenges')}</a></li>
                <li><a href="gallery.html">${t('nav.gallery')}</a></li>
                <li><a href="dashboard.html">${t('nav.dashboard')}</a></li>
              </ul>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wider text-muted font-semibold">About</p>
              <ul style="margin-top:12px; display:flex; flex-direction:column; gap:8px;" class="text-sm">
                <li><a href="about.html">About Shutterly</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="privacy.html">Privacy</a></li>
                <li><a href="terms.html">Terms</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Shutterly · Made in South Africa with care.</p>
            <p>${t('common.freeForever')}.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function attachHeaderHandlers() {
    const header = document.getElementById('site-header');
    if (!header) return;

    // Scroll shadow
    function onScroll() {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Theme toggle
    const cycle = () => {
      const next = Theme.resolved() === 'dark' ? 'light' : 'dark';
      Theme.set(next);
      const btn = document.getElementById('theme-toggle-btn');
      if (btn) btn.innerHTML = next === 'dark' ? ICONS.sun : ICONS.moon;
    };
    document.getElementById('theme-toggle-btn')?.addEventListener('click', cycle);
    document.getElementById('theme-toggle-btn-mobile')?.addEventListener('click', cycle);

    // Locale buttons (both rows)
    document.querySelectorAll('[data-locale]').forEach(btn => {
      btn.addEventListener('click', () => Locale.set(btn.getAttribute('data-locale')));
    });

    // Sign out
    const signout = () => { Auth.signOut(); location.href = 'index.html'; };
    document.getElementById('signout-btn')?.addEventListener('click', signout);
    document.getElementById('signout-btn-mobile')?.addEventListener('click', signout);

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobile = document.getElementById('mobile-menu');
    if (mobileBtn && mobile) {
      mobileBtn.addEventListener('click', () => {
        const open = mobile.classList.toggle('open');
        mobileBtn.innerHTML = open ? ICONS.x : ICONS.menu;
      });
    }
  }

  function mountChrome() {
    const headerSlot = document.querySelector('[data-header]');
    const footerSlot = document.querySelector('[data-footer]');
    if (headerSlot) headerSlot.outerHTML = renderHeader();
    if (footerSlot) footerSlot.outerHTML = renderFooter();
    attachHeaderHandlers();
  }

  /* ----------------------- DOM-ready ------------------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(mountChrome);

  /* ----------------------- Markdown (light) ------------ */
  function renderMarkdown(md) {
    if (!md) return '';
    const lines = md.split(/\r?\n/);
    const out = [];
    let listType = null;
    function close() { if (listType) { out.push('</' + listType + '>'); listType = null; } }
    function inline(s) {
      return s
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    }
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { close(); continue; }
      const ol = line.match(/^(\d+)\.\s+(.*)$/);
      const ul = line.match(/^[-*]\s+(.*)$/);
      if (ol) {
        if (listType !== 'ol') { close(); out.push('<ol>'); listType = 'ol'; }
        out.push('<li>' + inline(ol[2]) + '</li>');
      } else if (ul) {
        if (listType !== 'ul') { close(); out.push('<ul>'); listType = 'ul'; }
        out.push('<li>' + inline(ul[1]) + '</li>');
      } else {
        close(); out.push('<p>' + inline(line) + '</p>');
      }
    }
    close();
    return out.join('\n');
  }

  /* ----------------------- Curriculum helpers ---------- */
  function getCourse(slug) { return DATA.courses.find(c => c.slug === slug); }
  function getModule(courseSlug, moduleSlug) {
    return getCourse(courseSlug)?.modules.find(m => m.slug === moduleSlug);
  }
  function getLesson(courseSlug, moduleSlug, lessonSlug) {
    return getModule(courseSlug, moduleSlug)?.lessons.find(l => l.slug === lessonSlug);
  }
  function flatLessons(courseSlug) {
    const course = getCourse(courseSlug);
    if (!course) return [];
    return course.modules.flatMap(m =>
      m.lessons.map(l => ({ course, module: m, lesson: l, key: m.slug + '/' + l.slug }))
    );
  }
  function totalLessons(courseSlug) { return flatLessons(courseSlug).length; }

  /* ----------------------- Public API ------------------ */
  window.Shutterly = {
    Theme, Locale, Auth, Settings, Progress, Submissions,
    toast, ICONS, renderMarkdown,
    getCourse, getModule, getLesson, flatLessons, totalLessons,
    mountChrome
  };
})();
