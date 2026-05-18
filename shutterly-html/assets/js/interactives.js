/* =================================================================
   Shutterly — interactive simulators (vanilla JS).
   Each `mount<Name>(host)` takes a container element and renders into it.
   ================================================================= */

(function () {
  function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) e.setAttribute(k, '');
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    for (const c of children) {
      if (c == null) continue;
      if (Array.isArray(c)) c.forEach(x => e.append(x));
      else if (c instanceof Node) e.append(c);
      else e.append(document.createTextNode(String(c)));
    }
    return e;
  }

  function slider({ min, max, step = 1, value, label, format, onChange }) {
    const wrap = el('div');
    const row = el('div', { class: 'slider-row' });
    const lbl = el('label', { class: 'text-sm text-muted' }, label);
    const val = el('span', { class: 'slider-value text-sm' }, format ? format(value) : value);
    row.append(lbl, val);
    const input = el('input', { type: 'range', min, max, step, value, class: 'slider' });
    input.addEventListener('input', () => {
      const v = Number(input.value);
      val.textContent = format ? format(v) : v;
      onChange(v);
    });
    wrap.append(row, input);
    return wrap;
  }

  function cardShell(title, description) {
    const card = el('div', { class: 'card' });
    const header = el('div', { class: 'card-header' },
      el('h3', { class: 'card-title' }, title),
      description ? el('p', { class: 'card-description' }, description) : null
    );
    const content = el('div', { class: 'card-content' });
    card.append(header, content);
    return { card, content };
  }

  /* ----------------------- Exposure Triangle ----------- */
  function mountExposureTriangle(host) {
    const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
    const SHUTTERS = [
      { s: 1, label: '1s' }, { s: 0.5, label: '1/2' }, { s: 0.125, label: '1/8' },
      { s: 1/30, label: '1/30' }, { s: 1/60, label: '1/60' }, { s: 1/125, label: '1/125' },
      { s: 1/250, label: '1/250' }, { s: 1/500, label: '1/500' }, { s: 1/1000, label: '1/1000' },
      { s: 1/2000, label: '1/2000' }
    ];
    const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
    let api = 3, shu = 5, iso = 0;

    const { card, content } = cardShell('Exposure Triangle Simulator',
      'Move any slider. Brightness, depth of field, motion and noise are all the same story.');

    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    // Preview
    const preview = el('div', { class: 'sim-preview', style: { background: '#1a1a1a' } });
    const sky = el('div', { style: { position: 'absolute', inset: '0 0 50% 0', background: 'linear-gradient(to bottom, #fde68a, #fb7185, #f43f5e)' } });
    const ground = el('div', { style: { position: 'absolute', inset: '50% 0 0 0', background: 'linear-gradient(to bottom, #44403c, #1c1917)' } });
    const mountains = el('div', { style: { position: 'absolute', inset: '30% 0 30% 0' } });
    mountains.innerHTML = '<svg viewBox="0 0 400 100" preserveAspectRatio="none" style="width:100%;height:100%"><polygon points="0,100 80,30 140,60 220,10 300,55 400,30 400,100" fill="#0f172a" opacity="0.92"/></svg>';
    const subject = el('div', {
      style: {
        position: 'absolute', left: '50%', top: '55%',
        width: '88px', height: '88px',
        borderRadius: '50%', background: '#fef3c7',
        transform: 'translate(-50%, -50%)',
        transition: 'all 200ms ease'
      }
    });
    const darkVeil = el('div', { style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 200ms' }});
    const brightVeil = el('div', { style: { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0)', transition: 'background 200ms', mixBlendMode: 'screen' }});
    const noiseLayer = el('div', { style: {
      position: 'absolute', inset: 0, opacity: 0, mixBlendMode: 'overlay', pointerEvents: 'none',
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")"
    }});
    const labels = el('div', { class: 'sim-label' });
    const apertureBadge = el('span', { class: 'badge badge-brand' });
    const shutterBadge = el('span', { class: 'badge badge-accent' });
    const isoBadge = el('span', { class: 'badge badge-default' });
    labels.append(apertureBadge, shutterBadge, isoBadge);
    const expBadge = el('span', { class: 'badge', style: { position: 'absolute', top: '12px', right: '12px' } });
    preview.append(sky, ground, mountains, subject, darkVeil, brightVeil, noiseLayer, labels, expBadge);

    // Controls
    const controls = el('div', { class: 'sim-controls' });
    const apSlider = slider({
      min: 0, max: APERTURES.length - 1, value: api,
      label: 'Aperture (wide ← → narrow)', format: i => 'f/' + APERTURES[i],
      onChange: v => { api = v; update(); }
    });
    const shSlider = slider({
      min: 0, max: SHUTTERS.length - 1, value: shu,
      label: 'Shutter (long ← → fast)', format: i => SHUTTERS[i].label,
      onChange: v => { shu = v; update(); }
    });
    const isoSlider = slider({
      min: 0, max: ISOS.length - 1, value: iso,
      label: 'ISO (clean ← → noisy)', format: i => 'ISO ' + ISOS[i],
      onChange: v => { iso = v; update(); }
    });
    const evReadout = el('div', { class: 'card', style: { padding: '10px 14px', display: 'flex', justifyContent: 'space-between' } });
    const hint = el('p', { class: 'text-xs text-muted' },
      'Try this: open the aperture by 2 stops, then make shutter twice as fast — twice. Same brightness, different photo.');
    controls.append(apSlider, shSlider, isoSlider, evReadout, hint);

    grid.append(preview, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const a = APERTURES[api], s = SHUTTERS[shu].s, i = ISOS[iso];
      const ev = Math.log2((a * a) / s) - Math.log2(i / 100);
      const target = 10;
      const diff = ev - target;
      const brightnessPct = Math.max(8, Math.min(180, 100 * Math.pow(2, -diff)));
      const dofBlur = (a / 16) * 8;
      const motionBlurX = (1 / s) < 60 ? Math.min(40, 60 / (1 / s)) : 0;
      const noiseOpacity = Math.min(0.55, (Math.log2(i / 100) / 7) * 0.55);

      subject.style.filter = `blur(${dofBlur}px) brightness(${brightnessPct}%)`;
      subject.style.transform = `translate(calc(-50% + ${motionBlurX}px), -50%)`;
      darkVeil.style.background = diff > 0 ? `rgba(0,0,0,${Math.min(0.8, diff / 5)})` : 'rgba(0,0,0,0)';
      brightVeil.style.background = diff < 0 ? `rgba(255,255,255,${Math.min(0.6, -diff / 5)})` : 'rgba(255,255,255,0)';
      noiseLayer.style.opacity = noiseOpacity;

      apertureBadge.textContent = 'f/' + a;
      shutterBadge.textContent = SHUTTERS[shu].label;
      isoBadge.textContent = 'ISO ' + i;
      const label = Math.abs(diff) < 0.3 ? 'Spot on'
        : diff < -2 ? 'Over-exposed'
        : diff > 2 ? 'Under-exposed'
        : diff < 0 ? 'A touch bright' : 'A touch dark';
      expBadge.textContent = label;
      expBadge.className = 'badge ' + (Math.abs(diff) < 0.5 ? 'badge-success' : Math.abs(diff) < 1.5 ? 'badge-warning' : 'badge-danger');

      evReadout.innerHTML = `<span class="text-muted">EV difference</span><span class="font-mono">${diff.toFixed(1)} stops</span>`;
    }
    update();
  }

  /* ----------------------- Aperture -------------------- */
  function mountApertureSim(host) {
    const F = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
    let idx = 2;
    const { card, content } = cardShell('Aperture Simulator',
      'Watch the iris close as the f-number rises. Foreground sharpens, background loses its glow.');
    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    // Preview
    const preview = el('div', { class: 'sim-preview' });
    const bokehLayer = el('div', { style: { position: 'absolute', inset: 0 } });
    const dots = [];
    for (let k = 0; k < 18; k++) {
      const color = ['#f59e0b', '#ef4444', '#22d3ee', '#a855f7', '#fff'][k % 5];
      const d = el('span', { style: {
        position: 'absolute',
        left: ((k * 53) % 100) + '%', top: ((k * 37) % 100) + '%',
        width: (10 + (k % 5) * 5) + 'px', height: (10 + (k % 5) * 5) + 'px',
        borderRadius: '50%', background: color, opacity: 0.45
      }});
      dots.push(d); bokehLayer.append(d);
    }
    const subject = el('div', { style: {
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '128px', height: '128px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fcd34d, #f43f5e)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)'
    }});
    const fBadge = el('span', { class: 'badge badge-brand', style: { position: 'absolute', top: '12px', left: '12px' } });
    preview.append(bokehLayer, subject, fBadge);

    // Controls
    const controls = el('div', { class: 'sim-controls' });
    const iris = el('div', { class: 'iris-outer' });
    const irisInner = el('div', { class: 'iris-inner' });
    iris.append(irisInner);
    const fSlider = slider({
      min: 0, max: F.length - 1, value: idx,
      label: 'Aperture', format: i => 'f/' + F[i],
      onChange: v => { idx = v; update(); }
    });
    const explain = el('div', { class: 'card', style: { padding: '10px 14px' } });
    controls.append(iris, fSlider, explain);

    grid.append(preview, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const f = F[idx];
      const bgBlur = Math.max(0, (16 - f) * 1.3);
      const fgBlur = Math.max(0, (f - 1.4) * 0.4);
      const irisSize = 100 - (idx / (F.length - 1)) * 70;
      bokehLayer.style.filter = `blur(${bgBlur}px)`;
      subject.style.filter = `blur(${fgBlur}px)`;
      irisInner.style.transform = `scale(${irisSize / 100})`;
      fBadge.textContent = 'f/' + f;
      explain.innerHTML = `<strong>${f <= 2.8 ? 'Shallow' : f >= 8 ? 'Deep' : 'Moderate'} depth of field.</strong> ${
        f <= 2.8 ? 'Great for portraits, weak for group shots.' :
        f >= 8 ? 'Landscapes stay sharp from foreground to horizon.' :
        'A safe middle for two-person portraits.'}`;
    }
    update();
  }

  /* ----------------------- Shutter --------------------- */
  function mountShutterSim(host) {
    const STEPS = [
      { label: '1s', s: 1 }, { label: '1/4', s: 0.25 }, { label: '1/15', s: 1/15 },
      { label: '1/30', s: 1/30 }, { label: '1/60', s: 1/60 }, { label: '1/125', s: 1/125 },
      { label: '1/250', s: 1/250 }, { label: '1/500', s: 1/500 }, { label: '1/2000', s: 1/2000 }
    ];
    let idx = 5;
    const { card, content } = cardShell('Shutter Speed Simulator',
      'The cyclist passes by. Long shutter blurs them; fast shutter freezes the spokes.');
    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    const preview = el('div', { class: 'sim-preview', style: {
      background: 'linear-gradient(to bottom, #fef3c7, #d6d3d1, #a8a29e)'
    }});
    const trail = el('div', { style: {
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      left: 'calc(50% - 80px)', height: '12px',
      borderRadius: '9999px', background: 'rgba(0,0,0,0.4)',
      filter: 'blur(3px)'
    }});
    const subject = el('div', { style: {
      position: 'absolute', top: '50%', left: 0,
      width: '40px', height: '40px',
      borderRadius: '50%', background: '#ef4444',
      boxShadow: '0 6px 24px -8px rgba(15,23,42,0.18)'
    }});
    const styleEl = el('style', {});
    styleEl.textContent = '@keyframes cyclist { from { transform: translate(-30%, -50%); } to { transform: translate(130%, -50%); } }';
    const speedBadge = el('span', { class: 'badge badge-brand', style: { position: 'absolute', top: '12px', left: '12px' } });
    const stateBadge = el('span', { class: 'badge badge-default', style: { position: 'absolute', top: '12px', right: '12px' } });
    preview.append(styleEl, trail, subject, speedBadge, stateBadge);

    const controls = el('div', { class: 'sim-controls' });
    const sl = slider({
      min: 0, max: STEPS.length - 1, value: idx,
      label: 'Shutter speed', format: i => STEPS[i].label,
      onChange: v => { idx = v; update(); }
    });
    const explain = el('div', { class: 'card', style: { padding: '10px 14px' } });
    controls.append(sl, explain);

    grid.append(preview, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const step = STEPS[idx];
      const dur = Math.max(0.05, Math.min(2.5, step.s * 60));
      const trailW = Math.min(160, (1 / step.s) / 4);
      trail.style.width = trailW + 'px';
      trail.style.display = trailW > 8 ? 'block' : 'none';
      subject.style.animation = `cyclist ${dur}s linear infinite`;
      speedBadge.textContent = step.label;
      stateBadge.textContent = step.s >= 1/60 ? 'Motion blur' : step.s >= 1/500 ? 'Slightly frozen' : 'Frozen';
      explain.innerHTML = `<strong>${
        step.s >= 1/30 ? 'Use a tripod or steady surface.' :
        step.s >= 1/250 ? 'Handheld is fine. Most subjects will stay sharp.' :
        'Action-freeze territory — sport, kids, Cape Town wind.'
      }</strong>`;
    }
    update();
  }

  /* ----------------------- ISO ------------------------- */
  function mountIsoSim(host) {
    const ISOS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
    let idx = 0;
    const { card, content } = cardShell('ISO & Noise Comparison',
      'Same scene, same exposure. Watch the grain bloom as ISO climbs.');
    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    const preview = el('div', { class: 'sim-preview' });
    const img = el('img', {
      src: 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=70',
      alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    });
    const noise = el('div', { style: {
      position: 'absolute', inset: 0, mixBlendMode: 'overlay', pointerEvents: 'none',
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
    }});
    const isoBadge = el('span', { class: 'badge badge-brand', style: { position: 'absolute', top: '12px', left: '12px' } });
    preview.append(img, noise, isoBadge);

    const controls = el('div', { class: 'sim-controls' });
    const sl = slider({
      min: 0, max: ISOS.length - 1, value: idx, label: 'ISO',
      format: i => String(ISOS[i]), onChange: v => { idx = v; update(); }
    });
    const explain = el('div', { class: 'card', style: { padding: '10px 14px' } });
    controls.append(sl, explain);

    grid.append(preview, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const v = ISOS[idx];
      const op = Math.min(0.85, (Math.log2(v / 100) / 8) * 0.85);
      noise.style.opacity = op;
      isoBadge.textContent = 'ISO ' + v;
      explain.innerHTML = v <= 400 ? 'Clean territory — daylight and tripod work.' :
        v <= 3200 ? 'Indoor handheld. Modern cameras handle this easily.' :
        'Last-resort or atmospheric. Embrace the grain.';
    }
    update();
  }

  /* ----------------------- Before / After -------------- */
  function mountBeforeAfter(host) {
    const { card, content } = cardShell('Before / After',
      'Drag the divider to compare a raw frame with a finished edit.');
    const frame = el('div', { class: 'ba-frame' });
    const after = el('div', { class: 'ba-after' });
    const afterImg = el('img', { src: 'https://images.unsplash.com/photo-1444930694458-01babe71870e?auto=format&fit=crop&w=1400&q=70', alt: 'After' });
    after.append(afterImg);
    const beforeWrap = el('div', { class: 'ba-before-wrap', style: { width: '50%' } });
    const beforeImg = el('img', {
      src: 'https://images.unsplash.com/photo-1444930694458-01babe71870e?auto=format&fit=crop&w=1400&q=70', alt: 'Before',
      class: 'ba-before',
      style: { width: '200%' }
    });
    beforeWrap.append(beforeImg);
    const handle = el('div', { class: 'ba-handle', style: { left: 'calc(50% - 1px)' } });
    const knob = el('div', { class: 'ba-handle-knob' });
    knob.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7"/></svg>';
    handle.append(knob);
    const tagBefore = el('div', { class: 'ba-tag', style: { left: '12px' } }, 'Before');
    const tagAfter = el('div', { class: 'ba-tag', style: { right: '12px' } }, 'After');
    frame.append(after, beforeWrap, handle, tagBefore, tagAfter);
    content.append(frame);
    host.append(card);

    let dragging = false;
    function move(clientX) {
      const rect = frame.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      beforeWrap.style.width = pct + '%';
      beforeImg.style.width = (100 * (100 / Math.max(1, pct))) + '%';
      handle.style.left = 'calc(' + pct + '% - 1px)';
    }
    frame.addEventListener('pointerdown', e => { dragging = true; move(e.clientX); });
    window.addEventListener('pointermove', e => { if (dragging) move(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
  }

  /* ----------------------- Composition Overlay --------- */
  function mountCompositionOverlay(host) {
    const { card, content } = cardShell('Composition Overlay',
      'Switch grids to see how a photograph is held together by invisible geometry.');
    const tabs = el('div', { class: 'tabs-list', style: { marginBottom: '16px' } });
    const GRIDS = ['none', 'thirds', 'golden', 'diagonal', 'centre'];
    let current = 'thirds';
    const triggers = GRIDS.map(g => {
      const b = el('button', { class: 'tab-trigger' }, g[0].toUpperCase() + g.slice(1));
      b.setAttribute('aria-selected', g === current);
      b.addEventListener('click', () => { current = g; triggers.forEach(t => t.setAttribute('aria-selected', t.dataset.g === g)); draw(); });
      b.dataset.g = g;
      return b;
    });
    triggers.forEach(t => tabs.append(t));
    const frame = el('div', { class: 'comp-frame' });
    const img = el('img', { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=70', alt: '' });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'comp-grid');
    svg.setAttribute('viewBox', '0 0 100 60');
    svg.setAttribute('preserveAspectRatio', 'none');
    frame.append(img, svg);
    content.append(tabs, frame);
    host.append(card);

    function draw() {
      svg.innerHTML = '';
      if (current === 'thirds') {
        svg.innerHTML = '<g stroke="white" stroke-width="0.15" opacity="0.85">' +
          '<line x1="33.33" y1="0" x2="33.33" y2="60"/><line x1="66.66" y1="0" x2="66.66" y2="60"/>' +
          '<line x1="0" y1="20" x2="100" y2="20"/><line x1="0" y1="40" x2="100" y2="40"/></g>';
      } else if (current === 'golden') {
        svg.innerHTML = '<g stroke="white" stroke-width="0.15" opacity="0.85">' +
          '<line x1="38.2" y1="0" x2="38.2" y2="60"/><line x1="61.8" y1="0" x2="61.8" y2="60"/>' +
          '<line x1="0" y1="22.9" x2="100" y2="22.9"/><line x1="0" y1="37.1" x2="100" y2="37.1"/></g>';
      } else if (current === 'diagonal') {
        svg.innerHTML = '<g stroke="white" stroke-width="0.15" opacity="0.85">' +
          '<line x1="0" y1="0" x2="100" y2="60"/><line x1="100" y1="0" x2="0" y2="60"/></g>';
      } else if (current === 'centre') {
        svg.innerHTML = '<g stroke="white" stroke-width="0.15" opacity="0.85" fill="none">' +
          '<line x1="50" y1="0" x2="50" y2="60"/><line x1="0" y1="30" x2="100" y2="30"/>' +
          '<circle cx="50" cy="30" r="6"/></g>';
      }
    }
    draw();
  }

  /* ----------------------- Drag-Drop Composition ------- */
  function mountDragDrop(host) {
    const DEFAULTS = [
      { id: 'mountain', emoji: '⛰️', x: 50, y: 60 },
      { id: 'tree', emoji: '🌳', x: 20, y: 80 },
      { id: 'person', emoji: '🧍', x: 80, y: 78 },
      { id: 'sun', emoji: '☀️', x: 70, y: 20 }
    ];
    let items = JSON.parse(JSON.stringify(DEFAULTS));

    const { card, content } = cardShell('Compose the Frame',
      'Drag the elements. Feel how the eye moves when subjects sit on intersections, not in the centre.');

    const topRow = el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } });
    const gridLabel = el('label', { class: 'checkbox' });
    const gridCheck = el('input', { type: 'checkbox', checked: true });
    gridLabel.append(gridCheck, el('span', {}, 'Show thirds grid'));
    const resetBtn = el('button', { class: 'btn btn-ghost btn-sm', onClick: () => { items = JSON.parse(JSON.stringify(DEFAULTS)); render(); }}, 'Reset');
    topRow.append(gridLabel, resetBtn);

    const board = el('div', { class: 'dd-board' });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 60');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute'; svg.style.inset = 0; svg.style.width = '100%'; svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.innerHTML = '<g stroke="white" stroke-width="0.2" opacity="0.7"><line x1="33.33" y1="0" x2="33.33" y2="60"/><line x1="66.66" y1="0" x2="66.66" y2="60"/><line x1="0" y1="20" x2="100" y2="20"/><line x1="0" y1="40" x2="100" y2="40"/></g>';
    board.append(svg);

    content.append(topRow, board);
    host.append(card);

    function render() {
      board.querySelectorAll('.dd-item').forEach(n => n.remove());
      items.forEach(it => {
        const node = el('button', {
          class: 'dd-item', 'aria-label': it.id,
          style: { left: it.x + '%', top: it.y + '%' }
        }, it.emoji);
        node.addEventListener('pointerdown', () => startDrag(it.id));
        board.append(node);
      });
      svg.style.display = gridCheck.checked ? 'block' : 'none';
    }
    gridCheck.addEventListener('change', render);

    function startDrag(id) {
      function move(e) {
        const rect = board.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        items = items.map(it => it.id === id ? { ...it, x, y } : it);
        render();
      }
      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    }
    render();
  }

  /* ----------------------- Histogram ------------------- */
  function mountHistogram(host) {
    const BINS = 32;
    let exposure = 0, contrast = 1;
    const { card, content } = cardShell('Read the Histogram',
      'Drag the sliders and watch the curve drift, stretch and clip against the walls.');
    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    const frame = el('div', { class: 'histogram-frame' });
    const bars = el('div', { class: 'histogram-bars' });
    for (let i = 0; i < BINS; i++) {
      const b = el('div', { class: 'histogram-bar' });
      const tone = i < BINS / 3 ? '#44403c' : i < (BINS * 2) / 3 ? '#a8a29e' : '#e7e5e4';
      b.style.background = tone;
      bars.append(b);
    }
    const axis = el('div', { class: 'flex justify-between text-xs text-muted', style: { marginTop: '8px' } });
    axis.innerHTML = '<span>SHADOWS</span><span>MID-TONES</span><span>HIGHLIGHTS</span>';
    const flagsRow = el('div', { class: 'flex gap-2', style: { marginTop: '12px' } });
    frame.append(bars, axis, flagsRow);

    const controls = el('div', { class: 'sim-controls' });
    const ex = slider({
      min: -3, max: 3, step: 0.1, value: exposure,
      label: 'Exposure (stops)', format: v => (v > 0 ? '+' : '') + v.toFixed(1),
      onChange: v => { exposure = v; update(); }
    });
    const co = slider({
      min: 0.5, max: 1.8, step: 0.05, value: contrast,
      label: 'Contrast', format: v => v.toFixed(2),
      onChange: v => { contrast = v; update(); }
    });
    controls.append(ex, co, el('p', { class: 'text-xs text-muted' },
      'Tip: aim for a curve that kisses both walls without stacking against them.'));

    grid.append(frame, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const data = [];
      for (let i = 0; i < BINS; i++) {
        const x = (i / (BINS - 1)) - 0.5;
        const shifted = x - exposure * 0.18;
        const stretched = shifted * contrast;
        data.push(Math.max(0.01, Math.exp(-(stretched * stretched) * 18)));
      }
      const barEls = bars.querySelectorAll('.histogram-bar');
      data.forEach((v, i) => barEls[i].style.height = (v * 100) + '%');
      const clipL = data[0] > 0.5, clipR = data[BINS - 1] > 0.5;
      flagsRow.innerHTML = '';
      if (clipL) flagsRow.append(el('span', { class: 'badge badge-danger' }, 'Crushed shadows'));
      if (clipR) flagsRow.append(el('span', { class: 'badge badge-danger' }, 'Blown highlights'));
      if (!clipL && !clipR) flagsRow.append(el('span', { class: 'badge badge-success' }, 'Headroom on both sides'));
    }
    update();
  }

  /* ----------------------- White Balance --------------- */
  function mountWhiteBalance(host) {
    let kelvin = 5500, tint = 0;
    const { card, content } = cardShell('White Balance Simulator',
      'Same scene, four different white balances. The colour cast lives in the camera, not the world.');
    const grid = el('div', { class: 'grid sm:grid-cols-2 gap-6' });

    const preview = el('div', { class: 'sim-preview' });
    const img = el('img', {
      src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=70',
      alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    });
    const warmLayer = el('div', { style: { position: 'absolute', inset: 0, mixBlendMode: 'color' }});
    const coolLayer = el('div', { style: { position: 'absolute', inset: 0, mixBlendMode: 'color' }});
    const tintLayer = el('div', { style: { position: 'absolute', inset: 0, mixBlendMode: 'color' }});
    const kBadge = el('span', { class: 'badge badge-brand', style: { position: 'absolute', top: '12px', left: '12px' } });
    preview.append(img, warmLayer, coolLayer, tintLayer, kBadge);

    const controls = el('div', { class: 'sim-controls' });
    const kSlider = slider({
      min: 2000, max: 10000, step: 100, value: kelvin,
      label: 'Temperature (Kelvin)', format: v => v + ' K',
      onChange: v => { kelvin = v; update(); }
    });
    const tSlider = slider({
      min: -50, max: 50, value: tint,
      label: 'Tint (green ↔ magenta)', format: v => String(v),
      onChange: v => { tint = v; update(); }
    });
    const presetRow = el('div', { class: 'grid grid-cols-4 gap-2', style: { fontSize: '12px' } });
    [
      { k: 3000, name: 'Tungsten' }, { k: 4500, name: 'Fluorescent' },
      { k: 5500, name: 'Daylight' }, { k: 7500, name: 'Overcast' }
    ].forEach(p => {
      const b = el('button', { class: 'card', style: { padding: '8px', textAlign: 'left' }, onClick: () => { kelvin = p.k; kSlider.querySelector('input').value = p.k; update(); }});
      b.innerHTML = `<span style="font-weight:500;display:block">${p.name}</span><span class="text-muted">${p.k} K</span>`;
      presetRow.append(b);
    });
    controls.append(kSlider, tSlider, presetRow);

    grid.append(preview, controls);
    content.append(grid);
    host.append(card);

    function update() {
      const warm = kelvin < 5500 ? (5500 - kelvin) / 3500 : 0;
      const cool = kelvin > 5500 ? (kelvin - 5500) / 5000 : 0;
      warmLayer.style.background = `rgba(${255 * warm},${120 * warm},${30 * warm},${warm * 0.55})`;
      coolLayer.style.background = `rgba(${30 * cool},${120 * cool},${255 * cool},${cool * 0.5})`;
      tintLayer.style.background = `rgba(${tint > 0 ? 200 : 30},${tint > 0 ? 30 : 200},${tint > 0 ? 200 : 30},${Math.abs(tint) / 80})`;
      kBadge.textContent = kelvin + ' K';
    }
    update();
  }

  /* ----------------------- Mount by key ---------------- */
  const mounters = {
    'exposure-triangle': mountExposureTriangle,
    'aperture-sim': mountApertureSim,
    'shutter-sim': mountShutterSim,
    'iso-sim': mountIsoSim,
    'before-after': mountBeforeAfter,
    'composition-overlay': mountCompositionOverlay,
    'drag-drop': mountDragDrop,
    'histogram': mountHistogram,
    'white-balance': mountWhiteBalance
  };

  window.ShutterlyInteractive = function (key, host) {
    if (!host) return;
    host.innerHTML = '';
    const fn = mounters[key];
    if (fn) fn(host);
  };
})();
