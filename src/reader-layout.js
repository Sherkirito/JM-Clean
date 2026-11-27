// 阅读引擎：在来源章节模板（或本地图包页）里接管整个画面。
// 来源模板只提供图片地址和解扰参数；取图、解扰、排版、手势、预加载和自动翻页都由这里负责。
// 只用 ES2017 语法和旧版 Chrome 已支持的 CSS，兼容较旧的 Android 系统 WebView。
function installLayout(options) {
  if (window.jm2Pager) return;
  if (options.offline ? location.protocol !== 'file:' : location.pathname.indexOf('chapter_view_template') < 0) return;
  const count = options.count, session = options.session;
  const MODES = ['vertical', 'horizontal', 'rtl', 'spread-ltr', 'spread-rtl'];
  let mode = MODES.indexOf(options.mode) >= 0 ? options.mode : 'vertical';
  let cache = validCache(options.cache) ? options.cache : {keep: 6, ahead: 2};
  let singles = new Set(cleanList(options.singles));
  let defaults = cleanList(options.defaultSingles);
  const wide = new Set();
  const chapters = {prev: options.prev || null, next: options.next || null};
  let reduceMotion = !!options.reduceMotion, chromeShown = false;
  let W = window.innerWidth || 360, H = window.innerHeight || 640;
  let units = [], unitOf = [];
  let pos = 0, unit = 0, goal = 0, anim = 0, spring = null;
  let anchor = clampPage(options.initial);
  let mounted = false, suspended = false, booted = false;
  let root = null, stage = null, track = null, scroller = null, column = null;
  let inset = 0, insetCss = '', insetTimer = 0, insetFit = 1, insetFitTimer = 0, fitQueue = [], fitFrame = 0, held = [], flushFrame = 0, fading = 0, fadeJobs = [];
  let stripGoal = 0, stripSpring = null;
  let aid = 0, scrambleId = Infinity, speed = '';
  const pages = [], rendered = new Map(), recent = [];
  let tallRatio = 0, active = 0, ticketSeq = 0, zipWake = 0;
  let lastStart = -1, lastEnd = -1, shownKey = '';
  const zoom = {s: 1, tx: 0, ty: 0, el: null};
  let heights = [], tops = [], headHeight = 0, stripFrame = 0, stripAnim = 0;
  let autoMs = 0, autoRequest = 0, autoTimer = 0, autoWatch = 0;

  function cleanList(list) {
    return Array.isArray(list) ? list.filter(n => Number.isInteger(n) && n >= 0 && n < count) : [];
  }
  function validCache(c) {
    return !!c && Number.isInteger(c.keep) && c.keep >= 0 && c.keep <= 100 && Number.isInteger(c.ahead) && c.ahead >= 0 && c.ahead <= 20;
  }
  function clampPage(n) { return Math.max(0, Math.min(count - 1, Math.floor(Number(n) || 0))); }
  function kind() { return mode === 'vertical' ? 'strip' : mode.indexOf('spread') === 0 ? 'spread' : 'single'; }
  function rtl() { return mode === 'rtl' || mode === 'spread-rtl'; }
  function dir() { return rtl() ? -1 : 1; }
  function now() { return window.performance && performance.now ? performance.now() : Date.now(); }
  function send(type, extra) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({type: type, session: session}, extra || {})));
    } catch (_) {}
  }

  // ---- 解扰：与来源 jquery.photo 的 get_num 一致，优先调用来源自己的实现 ----
  function md5hex(input) {
    const s = unescape(encodeURIComponent(input)), n = s.length, words = [];
    for (let i = 0; i < n; i++) words[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    words[n >> 2] |= 0x80 << ((n % 4) * 8);
    const total = (((n + 8) >> 6) + 1) * 16;
    words[total - 2] = n * 8;
    const K = [], S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < total; i += 16) {
      let A = a, B = b, C = c, D = d;
      for (let j = 0; j < 64; j++) {
        let f, g;
        if (j < 16) { f = (B & C) | (~B & D); g = j; }
        else if (j < 32) { f = (D & B) | (~D & C); g = (5 * j + 1) % 16; }
        else if (j < 48) { f = B ^ C ^ D; g = (3 * j + 5) % 16; }
        else { f = C ^ (B | ~D); g = (7 * j) % 16; }
        const next = D; D = C; C = B;
        const x = (A + f + K[j] + (words[i + g] | 0)) | 0, r = S[(j >> 4) * 4 + (j % 4)];
        B = (B + ((x << r) | (x >>> (32 - r)))) | 0;
        A = next;
      }
      a = (a + A) | 0; b = (b + B) | 0; c = (c + C) | 0; d = (d + D) | 0;
    }
    let out = '';
    [a, b, c, d].forEach(v => { for (let k = 0; k < 4; k++) out += ('0' + ((v >>> (k * 8)) & 255).toString(16)).slice(-2); });
    return out;
  }
  function sliceCount(stem) {
    if (typeof window.get_num === 'function' && typeof window.md5 === 'function') {
      try {
        const n = Number(window.get_num(btoa(String(aid)), btoa(stem)));
        if (n > 0 && n <= 64) return n;
      } catch (_) {}
    }
    const id = parseInt(aid, 10);
    let key = md5hex(String(aid) + stem).slice(-1).charCodeAt(0);
    if (id >= 268850 && id <= 421925) key %= 10;
    else if (id >= 421926) key %= 8;
    return key >= 0 && key <= 9 ? key * 2 + 2 : 10;
  }
  function unscramble(img, stem) {
    const w = img.naturalWidth, h = img.naturalHeight, num = sliceCount(stem);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d'), rest = h % num, base = Math.floor(h / num);
    for (let i = 0; i < num; i++) {
      let height = base, to = base * i;
      const from = h - base * (i + 1) - rest;
      if (i === 0) height += rest; else to += rest;
      ctx.drawImage(img, 0, from, w, height, 0, to, w, height);
    }
    return canvas;
  }

  // ---- 接管来源页面 ----
  function background() { return /^#[0-9a-f]{6}$/i.test(options.background || '') ? options.background : '#000000'; }
  function palette(hex) {
    const v = parseInt(hex.slice(1), 16), light = ((v >> 16) * 299 + ((v >> 8) & 255) * 587 + (v & 255) * 114) / 1000 > 140;
    return light ? {ink: '#1d1d1d', muted: '#7a7a7a', line: 'rgba(0,0,0,.14)'} : {ink: '#ededed', muted: '#8d8d8d', line: 'rgba(255,255,255,.16)'};
  }
  function applyBackground(hex) {
    const p = palette(hex), style = document.documentElement.style;
    style.setProperty('--jm2-bg', hex); style.setProperty('--jm2-ink', p.ink);
    style.setProperty('--jm2-muted', p.muted); style.setProperty('--jm2-line', p.line);
  }
  const css = [
    'html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:var(--jm2-bg,#000)!important}',
    'body>*:not(#jm2){display:none!important}',
    '#jm2{position:fixed;left:0;top:0;right:0;bottom:0;overflow:hidden;background:var(--jm2-bg);color:var(--jm2-ink);font:14px/1.5 sans-serif;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}',
    '#jm2.jm2-paged{touch-action:none}',
    '#jm2-stage{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% 50%}',
    '#jm2-track{position:absolute;left:0;top:0;width:100%;height:100%;will-change:transform}',
    '.jm2-inset .jm2-unit{visibility:hidden}',
    '.jm2-inset .jm2-unit.jm2-now{visibility:visible}',
    '.jm2-unit{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;display:flex;align-items:center;justify-content:center}',
    '.jm2-zoom{display:flex;flex-direction:row;align-items:center;justify-content:center;flex:none}',
    '.jm2-rtl .jm2-zoom{flex-direction:row-reverse}',
    '.jm2-page{position:relative;flex:none;overflow:hidden}',
    '.jm2-page>canvas,.jm2-page>img{position:absolute;left:0;top:0;width:100%;height:100%;display:block;border:0;margin:0;padding:0;max-width:none}',
    '.jm2-wait{position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-30px 0 0 -16px;border-radius:50%;border:3px solid var(--jm2-line);border-top-color:#ff7a00;animation:jm2spin .8s linear infinite}',
    '.jm2-num{position:absolute;left:0;right:0;top:50%;margin-top:6px;text-align:center;color:var(--jm2-muted);font-size:13px}',
    '@keyframes jm2spin{to{transform:rotate(360deg)}}',
    '.jm2-fail{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:10px 18px;border-radius:20px;border:1px solid var(--jm2-line);color:var(--jm2-ink);font-size:14px;white-space:nowrap}',
    '#jm2-scroll{position:absolute;left:0;top:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;touch-action:pan-y;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;overflow-anchor:none}',
    '#jm2-column{position:relative;width:100%}',
    '#jm2-column>.jm2-page{width:100%}',
    '.jm2-card{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box}',
    '.jm2-unit>.jm2-card{width:100%;height:100%}',
    '.jm2-card-title{font-size:18px;font-weight:bold;color:var(--jm2-ink)}',
    '.jm2-card-sub{margin-top:8px;font-size:14px;color:var(--jm2-muted);max-width:80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.jm2-btn{margin-top:22px;padding:11px 26px;border-radius:22px;background:#ff7a00;color:#232323;font-size:15px;font-weight:bold}',
    '.jm2-card-hint{margin-top:14px;font-size:12px;color:var(--jm2-muted)}'
  ].join('\n');

  function early() {
    if (!document.documentElement) {
      const wait = new MutationObserver(() => { if (document.documentElement) { wait.disconnect(); early(); } });
      wait.observe(document, {childList: true});
      return;
    }
    applyBackground(background());
    const style = document.createElement('style');
    style.id = 'jm2-style'; style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    if (!options.offline && document.readyState === 'loading') guardScripts();
  }
  // 来源页面里的广告和统计脚本在解析阶段就拦下，不让它们运行。
  function guardScripts() {
    const blocked = /googletagmanager|google-analytics|chnsrv|td_ga_tracker|webp-hero|\/f_\d+\.js/i;
    function check(node) {
      if (node.nodeType !== 1) return;
      if (node.matches && node.matches('.ad-body,.thewayhome,iframe,ins')) { node.remove(); return; }
      const scripts = node.tagName === 'SCRIPT' ? [node] : node.querySelectorAll ? node.querySelectorAll('script') : [];
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i], src = script.getAttribute('src') || '';
        let foreign = false;
        if (src) { try { foreign = new URL(src, document.baseURI).origin !== location.origin; } catch (_) { foreign = true; } }
        if (foreign || blocked.test(src) || script.closest('.ad-body')) { script.type = 'javascript/blocked'; script.remove(); }
      }
    }
    const watch = new MutationObserver(records => records.forEach(r => r.addedNodes.forEach(check)));
    watch.observe(document.documentElement, {childList: true, subtree: true});
    document.addEventListener('DOMContentLoaded', () => watch.disconnect(), {once: true});
  }
  function harvest() {
    const found = [], images = document.querySelectorAll('img[id^="album_photo_"]');
    for (let k = 0; k < images.length; k++) {
      const img = images[k], m = /^album_photo_(\d+)$/.exec(img.id);
      if (!m) continue;
      const i = Number(m[1]);
      if (i >= count || found[i]) continue;
      const raw = img.getAttribute('data-original') || img.getAttribute('data-src') || '';
      if (!raw || /app-loading|\/blank\.jpg/i.test(raw)) continue;
      let url;
      try { url = new URL(raw, document.baseURI).href; } catch (_) { continue; }
      const holder = img.parentElement;
      let stem = holder && holder.id ? holder.id.split('.')[0] : '';
      if (!/^[\w-]+$/.test(stem) || /^page_/.test(stem)) stem = url.split('?')[0].split('/').pop().split('.')[0];
      found[i] = {url: url, stem: stem};
    }
    for (let i = 0; i < count; i++) if (!found[i]) return null;
    if (!options.offline) {
      aid = Number(window.aid) || 0;
      scrambleId = Number(window.scramble_id);
      if (!isFinite(scrambleId)) scrambleId = 220980;
      speed = window.speed == null ? '' : String(window.speed);
    }
    return found;
  }
  function clearTemplate() {
    const $ = window.jQuery;
    try {
      if ($) {
        const owl = $('#photo-container');
        if (owl.data && owl.data('owl.carousel')) owl.trigger('destroy.owl.carousel');
        $(window).off(); $(document).off();
      }
    } catch (_) {}
    window.scramble_image = function () {};
    Array.prototype.slice.call(document.body.children).forEach(node => { if (node !== root) node.remove(); });
    Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"],style:not(#jm2-style)')).forEach(node => node.remove());
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; (document.head || document.documentElement).appendChild(meta); }
    meta.content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';
  }

  // ---- 单页图片：加载、解扰、释放 ----
  function makePages(found) {
    for (let i = 0; i < count; i++) {
      const rec = {i: i, url: found[i].url, stem: found[i].stem, w: 0, h: 0, state: 'idle', surface: null, loader: null,
        ticket: 0, tries: 0, box: null, shown: '', cssW: 0, cssH: 0, view: null, viewKey: '', alt: null, altKey: '', fitF: 1,
        scrambled: !options.offline && aid >= scrambleId && speed !== '1' && !/\.gif(\?|#|$)/i.test(found[i].url)};
      pages.push(rec);
    }
  }

  // ---- 显示用的缩小版 ----
  // 浏览器把大画布缩到页面框里时只做双线性取样，漫画网点缩到一半以下就会出现摩尔纹。
  // 画面停稳后按屏幕实际像素重采样，显示时基本是 1:1，不再交给合成器缩放。
  // 缩小前先按倍数做一次轻微的高斯模糊，把屏幕显示不了的网点细节抹匀，再逐级减半缩到目标尺寸。
  // 模糊半径取缩小倍数的 0.4：细网点缩小后起伏压到肉眼看不出，细线保留约三分之二的对比度。
  const BLUR = 0.4;
  function shrink(src, sw, sh, tw, th) {
    let cur = src, cw = sw, ch = sh;
    const k = Math.min(sw / tw, sh / th);
    const step = (w, h) => {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
      g.drawImage(cur, 0, 0, cw, ch, 0, 0, w, h);
      if (cur !== src) { cur.width = 0; cur.height = 0; }
      cur = c; cw = w; ch = h;
    };
    if (k > 1.15) {
      const c = document.createElement('canvas'); c.width = sw; c.height = sh;
      const g = c.getContext('2d');
      if ('filter' in g) {
        // 先画一遍原图垫底，模糊后的边缘半透明部分叠在上面，页面边上不会发暗。
        g.drawImage(src, 0, 0);
        g.filter = 'blur(' + Math.min(4, BLUR * k).toFixed(2) + 'px)';
        g.drawImage(src, 0, 0);
        g.filter = 'none';
        cur = c;
      } else { c.width = 0; c.height = 0; }
    }
    while (cw >= tw * 2 && ch >= th * 2) step(Math.max(tw, Math.round(cw / 2)), Math.max(th, Math.round(ch / 2)));
    step(tw, th);
    return cur;
  }
  function dropCanvas(c) { if (c) { c.width = 0; c.height = 0; c.remove(); } }
  // 当前这一组在放大或设置面板预览时另有缩放，其他页按原尺寸。
  function factorOf(rec) {
    if (kind() === 'strip' || unit < 0 || unit >= units.length) return 1;
    const u = units[unit];
    if (rec.i < u[0] || rec.i > u[1]) return 1;
    return (zoom.s > 1.01 ? zoom.s : 1) * insetFit;
  }
  function sizeFor(rec, f) {
    const dpr = window.devicePixelRatio || 1;
    const tw = Math.round(rec.cssW * dpr * f), th = Math.round(rec.cssH * dpr * f);
    // 只比原图小一点时直接用原图，省掉一次重采样。
    if (!tw || !th || tw * 1.15 >= rec.w || th * 1.15 >= rec.h) return null;
    return [tw, th];
  }
  function ensure(rec, slot, size) {
    const key = size ? size[0] + 'x' + size[1] : '';
    if (rec[slot + 'Key'] === key && (!size || rec[slot])) return;
    dropCanvas(rec[slot]);
    rec[slot] = size ? shrink(rec.surface, rec.w, rec.h, size[0], size[1]) : null;
    rec[slot + 'Key'] = key;
  }
  function wants(rec) {
    const f = factorOf(rec), scaled = Math.abs(f - 1) > 0.01;
    const v = sizeFor(rec, 1), a = scaled ? sizeFor(rec, f) : null;
    return {f: scaled ? f : 1, v: v, a: a, vk: v ? v[0] + 'x' + v[1] : '', ak: a ? a[0] + 'x' + a[1] : ''};
  }
  function fittable(rec) { return rec.state === 'ready' && !!rec.surface && !!rec.cssW && !!rec.cssH && !!rec.w; }
  // 已有合适尺寸的就地切换；需要重采样的排队，当前画面优先，每帧只做一小段，动画和拖动时暂停。
  function fit(rec) {
    if (!fittable(rec)) return;
    const w = wants(rec);
    if (rec.viewKey === w.vk && rec.altKey === w.ak && (!w.vk || rec.view) && (!w.ak || rec.alt)) {
      if (rec.fitF !== w.f) { rec.fitF = w.f; place(rec); }
      return;
    }
    if (fitQueue.indexOf(rec) < 0) fitQueue.push(rec);
    pumpFits();
  }
  function pumpFits() {
    if (fitFrame || !fitQueue.length) return;
    fitFrame = requestAnimationFrame(() => {
      fitFrame = 0;
      if (holding()) { if (held.indexOf(pumpFits) < 0) held.push(pumpFits); return; }
      const t0 = now(), u = unit >= 0 && unit < units.length ? units[unit] : [-1, -2];
      const near = r => r.i >= u[0] && r.i <= u[1] ? 1 : 0;
      fitQueue.sort((a, b) => near(b) - near(a));
      do fitNow(fitQueue.shift()); while (fitQueue.length && now() - t0 < 6);
      pumpFits();
    });
  }
  function fitNow(rec) {
    if (!fittable(rec)) return;
    const w = wants(rec);
    try {
      ensure(rec, 'view', w.v);
      ensure(rec, 'alt', w.a);
      rec.fitF = w.f;
    } catch (_) { dropCanvas(rec.view); dropCanvas(rec.alt); rec.view = rec.alt = null; rec.viewKey = rec.altKey = ''; rec.fitF = 1; }
    place(rec);
  }
  function shown(rec) { return rec.fitF !== 1 ? rec.alt || rec.surface : rec.view || rec.surface; }
  function fitCurrent() {
    if (kind() === 'strip' || unit < 0 || unit >= units.length) return;
    for (let p = units[unit][0]; p <= units[unit][1]; p++) fit(pages[p]);
  }
  function ratio(p) { const r = pages[p]; return r.w && r.h ? r.h / r.w : tallRatio || 1.42; }
  function start(rec) {
    rec.state = 'loading'; active++;
    if (options.offline) {
      rec.ticket = ++ticketSeq;
      send('jm2ZipPage', {index: rec.i, ticket: rec.ticket});
      if (!zipWake) zipWake = setTimeout(wakeZip, 200);
      return;
    }
    fetchImage(rec, rec.url);
  }
  // 这台设备的 WebView 可能把桥接回调压在静止页面上，解压未完成时持续唤醒。
  function wakeZip() {
    zipWake = 0;
    if (suspended || !pages.some(r => r.state === 'loading' && r.ticket && !r.loader)) return;
    send('jm2ZipWaiting');
    zipWake = setTimeout(wakeZip, 200);
  }
  function fetchImage(rec, src) {
    const img = new Image();
    rec.loader = img;
    img.onload = () => { if (rec.loader === img) decodeImage(rec, img); };
    img.onerror = () => { if (rec.loader === img) failed(rec); };
    img.src = src;
  }
  function decodeImage(rec, img) {
    const done = () => {
      if (rec.loader !== img) return;
      // 翻页动画和拖动进行中不做解扰和上屏，等画面停稳再处理，避免动画掉帧。
      if (holding()) { if (held.indexOf(done) < 0) held.push(done); return; }
      const w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h) { failed(rec); return; }
      rec.loader = null; active--;
      let surface = img;
      try { if (rec.scrambled) { surface = unscramble(img, rec.stem); img.removeAttribute('src'); } } catch (_) { surface = img; }
      rec.surface = surface; rec.state = 'ready'; rec.tries = 0;
      measured(rec, w, h);
      place(rec); fit(rec); pump(); report();
      if (autoMs && !autoTimer) autoArm();
    };
    if (typeof img.decode === 'function') img.decode().then(done, done); else done();
  }
  function holding() {
    return kind() !== 'strip' && (!!anim || !!spring || !!(gesture && (gesture.type === 'drag' || gesture.type === 'pinch' || gesture.type === 'pan')));
  }
  function scheduleFlush() {
    if (flushFrame || !held.length) return;
    flushFrame = requestAnimationFrame(() => {
      flushFrame = 0;
      if (holding()) return;
      const list = held; held = [];
      list.forEach(fn => fn());
    });
  }
  function failed(rec) {
    if (rec.loader) { rec.loader.onload = rec.loader.onerror = null; rec.loader = null; }
    active--; rec.tries++;
    rec.state = rec.tries < 2 ? 'retry' : 'error';
    if (rec.state === 'retry') setTimeout(() => { if (rec.state === 'retry') { rec.state = 'idle'; pump(); } }, 1200);
    else if (options.offline && isCurrent(rec.i)) send('jm2ZipError', {index: rec.i});
    place(rec); pump();
  }
  function release(rec) {
    if (rec.loader) { rec.loader.onload = rec.loader.onerror = null; rec.loader.removeAttribute('src'); rec.loader = null; }
    if (rec.state === 'loading') active--;
    if (rec.ticket) { send('jm2ZipDrop', {index: rec.i, ticket: rec.ticket}); rec.ticket = 0; }
    if (rec.surface) {
      if (rec.surface.tagName === 'CANVAS') { rec.surface.width = 0; rec.surface.height = 0; }
      else rec.surface.removeAttribute('src');
      rec.surface.remove(); rec.surface = null;
    }
    dropCanvas(rec.view); dropCanvas(rec.alt);
    rec.view = rec.alt = null; rec.viewKey = rec.altKey = ''; rec.fitF = 1;
    if (rec.state !== 'error') rec.state = 'idle';
    place(rec);
  }
  function zipPage(i, ticket, ok) {
    const rec = pages[i];
    if (!rec || rec.ticket !== ticket || rec.state !== 'loading' || rec.loader) return;
    if (!ok) { failed(rec); return; }
    fetchImage(rec, new URL('p' + i + '.jpg', document.baseURI).href);
  }
  function measured(rec, w, h) {
    const first = !rec.w;
    rec.w = w; rec.h = h;
    if (first) {
      const known = pages.filter(r => r.w);
      if (known.length) tallRatio = known.reduce((sum, r) => sum + r.h / r.w, 0) / known.length;
    }
    // 横版跨页图在双页模式下自动单独显示。
    if (w > h * 1.1 && !wide.has(rec.i)) {
      wide.add(rec.i);
      if (mounted && kind() === 'spread') {
        // 只有当前画面的分组跟着变时才淡入淡出，远处的宽图悄悄重新分组。
        const page = visibleRange()[0];
        if (wouldChange(page)) fadeSwap(() => rebuild(visibleRange()[0])); else rebuild(page);
        return;
      }
    }
    if (kind() === 'strip') resizeStrip(rec.i);
    else if (mounted && unitOf[rec.i] != null && rendered.has(unitOf[rec.i])) sizeUnit(unitOf[rec.i]);
  }
  function place(rec) {
    const box = rec.box;
    if (!box) return;
    const state = rec.state === 'ready' && rec.surface ? 'ready' : rec.state === 'error' ? 'error' : 'wait';
    if (state === 'ready') {
      const el = shown(rec);
      if (el.parentNode !== box || box.childNodes.length !== 1) { box.textContent = ''; box.appendChild(el); }
    } else if (box.getAttribute('data-state') !== state) {
      box.textContent = '';
      if (state === 'error') {
        const fail = document.createElement('div');
        fail.className = 'jm2-fail'; fail.setAttribute('data-act', 'retry'); fail.setAttribute('data-page', rec.i);
        fail.textContent = '第 ' + (rec.i + 1) + ' 页加载失败，轻点重试';
        box.appendChild(fail);
      } else {
        const spin = document.createElement('div'), num = document.createElement('div');
        spin.className = 'jm2-wait'; num.className = 'jm2-num'; num.textContent = String(rec.i + 1);
        box.appendChild(spin); box.appendChild(num);
      }
    }
    box.setAttribute('data-state', state);
  }

  // ---- 预加载窗口：当前画面优先，其次向后预加载，最近看过的保留 ----
  function visibleRange() {
    if (kind() === 'strip') {
      if (!scroller) return [anchor, anchor];
      const top = scroller.scrollTop, bottom = top + H;
      let first = locate(top + 1), last = first;
      while (last + 1 < count && tops[last + 1] < bottom) last++;
      return [first, last];
    }
    const k = Math.max(0, Math.min(units.length - 1, unit));
    return units.length ? [units[k][0], units[k][1]] : [0, 0];
  }
  function isCurrent(i) { const r = visibleRange(); return i >= r[0] && i <= r[1]; }
  function wanted() {
    const order = [], seen = new Set();
    const add = i => { if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i); } };
    const r = visibleRange();
    for (let i = r[0]; i <= r[1]; i++) add(i);
    if (kind() !== 'strip') {
      const next = unitOf[r[1] + 1];
      if (next != null) for (let i = units[next][0]; i <= units[next][1]; i++) add(i);
    }
    for (let i = r[1] + 1; i <= r[1] + cache.ahead; i++) add(i);
    if (kind() === 'strip') add(r[0] - 1);
    else {
      const prev = unitOf[r[0] - 1];
      if (prev != null && cache.keep > 0) for (let i = units[prev][0]; i <= units[prev][1]; i++) add(i);
    }
    for (let i = recent.length - 1, kept = 0; i >= 0 && kept < cache.keep; i--, kept++) add(recent[i]);
    return order;
  }
  let pumpFrame = 0;
  function pump() {
    if (pumpFrame || suspended) return;
    pumpFrame = requestAnimationFrame(() => {
      pumpFrame = 0;
      if (suspended || !mounted) return;
      const order = wanted(), keep = new Set(order);
      pages.forEach(rec => { if (!keep.has(rec.i) && (rec.surface || rec.state === 'loading')) release(rec); });
      for (let k = 0; k < order.length && active < 3; k++) {
        const rec = pages[order[k]];
        if (rec.state === 'idle') start(rec);
      }
    });
  }
  function remember(range) {
    for (let i = range[0]; i <= range[1]; i++) {
      const at = recent.indexOf(i);
      if (at >= 0) recent.splice(at, 1);
      recent.push(i);
    }
    while (recent.length > 120) recent.shift();
  }

  // ---- 状态上报 ----
  function report() {
    if (!mounted) return;
    if (kind() === 'strip') { stripReport(); return; }
    const r = visibleRange(), start = r[0], end = r[1];
    if ((pos < 0 || pos > units.length - 1) && Math.round(pos) === pos) return;
    if (start !== lastStart || end !== lastEnd) {
      lastStart = start; lastEnd = end; anchor = start;
      const near = [];
      for (let i = Math.max(0, start - 1); i <= Math.min(count - 1, end + 1); i++) if (wide.has(i)) near.push(i);
      send('jm2Page', {page: start, end: end, wide: near, shift: shiftState(start)});
    }
    const shown = currentShown();
    const key = mode + ':' + r[0] + '-' + r[1];
    if (shown && shownKey !== key) {
      shownKey = key; remember(r);
      send('jm2Shown', {page: start, end: end});
      autoArm();
    }
  }
  function currentShown() {
    if (kind() !== 'strip' && Math.round(pos) !== pos) return false;
    const r = visibleRange();
    for (let i = r[0]; i <= r[1]; i++) if (pages[i].state !== 'ready') return false;
    return true;
  }

  // ---- 分组（双页合页） ----
  function buildUnits() {
    units = []; unitOf = new Array(count);
    const solo = p => singles.has(p) || wide.has(p);
    let i = 0;
    while (i < count) {
      if (kind() !== 'spread' || i === count - 1 || solo(i) || solo(i + 1)) { unitOf[i] = units.length; units.push([i, i]); i++; }
      else { unitOf[i] = unitOf[i + 1] = units.length; units.push([i, i + 1]); i += 2; }
    }
  }
  // 试算新的分组，看指定页所在的那一组会不会变；算完恢复原分组，画面还没换之前保持一致。
  function trial(fn) {
    const saved = [units, unitOf];
    try { buildUnits(); return fn(); } finally { units = saved[0]; unitOf = saved[1]; }
  }
  function wouldChange(page) {
    const before = units[unitOf[page]].join('-');
    return trial(() => units[unitOf[page]].join('-') !== before);
  }
  // 配对只有两种相位：一段的第一页和第二页配（1-2、3-4），或者第一页单独、之后错开一位（1、2-3、4-5）。
  // 横版跨页图把整话分成几段，各段的相位分开计算。
  function runOf(p) {
    if (wide.has(p)) return null;
    let a = p, b = p;
    while (a > 0 && !wide.has(a - 1)) a--;
    while (b + 1 < count && !wide.has(b + 1)) b++;
    return [a, b];
  }
  function phaseAt(p, run) {
    const u = units[unitOf[p]], r = run[0];
    const s = p === r ? r : r + 1 + 2 * Math.floor((p - r - 1) / 2), e = s === r ? r : Math.min(run[1], s + 1);
    return u[0] === s && u[1] === e ? 1 : 0;
  }
  function shiftState(p) {
    if (kind() !== 'spread') return null;
    const run = runOf(p);
    if (!run || run[0] === run[1]) return {can: false, on: false, wide: wide.has(p)};
    return {can: true, on: phaseAt(p, run) !== (defaults.indexOf(run[0]) >= 0 ? 1 : 0), wide: false};
  }
  function pair(action, page, list) {
    const p = clampPage(page);
    if (action === 'reset') {
      if (Array.isArray(list)) defaults = cleanList(list);
      singles = new Set(defaults);
    } else if (action === 'shift') {
      // 错开一页：把这一段换成另一种相位，段内的单独设置一并理顺；画面停在原来看的那一页上。
      const run = runOf(p);
      if (!run || run[0] === run[1]) return;
      const next = 1 - phaseAt(p, run);
      for (let i = run[0]; i <= run[1]; i++) singles.delete(i);
      if (next === 1) singles.add(run[0]);
    } else return;
    const sorted = Array.from(singles).sort((a, b) => a - b);
    fadeSwap(() => {
      anchor = p;
      rebuild(p);
      send('jm2Pairs', {singles: sorted, page: lastStart, end: lastEnd, shift: shiftState(lastStart)});
    });
  }
  function rebuild(page) {
    buildUnits();
    if (kind() === 'strip') return;
    cancelAnim(); resetZoom(); gesture = null;
    clearRendered();
    const k = unitOf[clampPage(page)];
    unit = goal = k; setPos(k); renderWindow(k);
    lastStart = -1;
    report(); pump(); applyInset();
  }
  // 换排版、改合页时整体淡出再淡入，不让画面硬切。
  function fadeSwap(job) {
    const run = fn => { try { fn(); } catch (e) { setTimeout(() => { throw e; }); } };
    if (reduceMotion || !root || document.hidden) { run(job); return; }
    fadeJobs.push(job);
    if (fading) return;
    root.style.transition = 'opacity 90ms ease-in';
    root.style.opacity = '0';
    fading = setTimeout(() => {
      fading = 0;
      const jobs = fadeJobs; fadeJobs = [];
      jobs.forEach(run);
      root.style.transition = 'opacity 180ms ease-out';
      root.style.opacity = '';
    }, 100);
  }

  // ---- 翻页模式 ----
  function minPos() { return chapters.prev ? -1 : 0; }
  function maxPos() { return units.length; }
  function clearRendered() { rendered.forEach(el => el.remove()); rendered.clear(); pages.forEach(r => { r.box = null; }); zoom.el = null; }
  function cardElement(side) {
    const card = document.createElement('div'), title = document.createElement('div'), sub = document.createElement('div');
    card.className = 'jm2-card'; title.className = 'jm2-card-title'; sub.className = 'jm2-card-sub';
    const target = side < 0 ? chapters.prev : chapters.next;
    title.textContent = side < 0 ? '已是本话开头' : '本话完';
    sub.textContent = target ? (side < 0 ? '上一话：' : '下一话：') + target.title : '已是最后一话';
    card.appendChild(title); card.appendChild(sub);
    if (target) {
      const btn = document.createElement('div'), hint = document.createElement('div');
      btn.className = 'jm2-btn'; btn.setAttribute('data-act', 'chapter'); btn.setAttribute('data-delta', String(side));
      btn.textContent = side < 0 ? '回到上一话' : '进入下一话';
      hint.className = 'jm2-card-hint'; hint.textContent = '继续翻页也可以' + (side < 0 ? '回到上一话' : '进入下一话');
      card.appendChild(btn); card.appendChild(hint);
    }
    return card;
  }
  function unitElement(k) {
    const el = document.createElement('div');
    el.className = 'jm2-unit' + (rtl() ? ' jm2-rtl' : '');
    if (k < 0 || k >= units.length) el.appendChild(cardElement(k < 0 ? -1 : 1));
    else {
      const wrap = document.createElement('div');
      wrap.className = 'jm2-zoom';
      for (let p = units[k][0]; p <= units[k][1]; p++) {
        const box = document.createElement('div');
        box.className = 'jm2-page'; box.setAttribute('data-page', p);
        wrap.appendChild(box); pages[p].box = box; place(pages[p]);
      }
      el.appendChild(wrap);
    }
    el.style.transform = 'translate3d(' + (dir() * k * W) + 'px,0,0)';
    return el;
  }
  function sizeUnit(k) {
    const el = rendered.get(k);
    if (!el || k < 0 || k >= units.length) return;
    const u = units[k], boxes = el.querySelectorAll('.jm2-page');
    const ra = 1 / ratio(u[0]), rb = u[1] > u[0] ? 1 / ratio(u[1]) : 0;
    const h = Math.min(H, W / (ra + rb));
    const wa = Math.round(ra * h), wb = u[1] > u[0] ? Math.min(Math.round(rb * h), Math.floor(W) - wa) : 0;
    boxes[0].style.width = wa + 'px'; boxes[0].style.height = Math.round(h) + 'px';
    if (boxes[1]) { boxes[1].style.width = wb + 'px'; boxes[1].style.height = Math.round(h) + 'px'; }
    const a = pages[u[0]];
    a.cssW = wa; a.cssH = Math.round(h); fit(a);
    if (u[1] > u[0]) { const b = pages[u[1]]; b.cssW = wb; b.cssH = Math.round(h); fit(b); }
    if (k === unit) applyInset();
  }
  // 当前组前后各两组常驻；只在画面停稳时增删，动画途中不动 DOM。
  function renderWindow(center) {
    const lo = Math.max(minPos(), center - 2), hi = Math.min(maxPos(), center + 2);
    rendered.forEach((el, k) => {
      if (k < lo || k > hi) {
        if (k >= 0 && k < units.length) for (let p = units[k][0]; p <= units[k][1]; p++) if (pages[p].box && el.contains(pages[p].box)) pages[p].box = null;
        el.remove(); rendered.delete(k);
      }
    });
    prepare(lo, hi);
    markCurrent();
  }
  function prepare(lo, hi) {
    for (let k = Math.max(minPos(), lo); k <= Math.min(maxPos(), hi); k++) {
      if (rendered.has(k)) continue;
      const el = unitElement(k);
      rendered.set(k, el); track.appendChild(el); sizeUnit(k);
    }
  }
  function markCurrent() { rendered.forEach((el, k) => el.classList.toggle('jm2-now', k === unit)); }
  function setPos(p) {
    pos = p;
    track.style.transform = 'translate3d(' + (-dir() * p * W) + 'px,0,0)';
  }
  // 翻页动画用临界阻尼弹簧：松手时的速度直接接上，连点时中途改目标也不会顿一下。
  const OMEGA = 26;
  function springAt(s, t) {
    const A = s.x0, B = s.v0 + OMEGA * A, e = Math.exp(-OMEGA * t);
    return [(A + B * t) * e, (B - OMEGA * (A + B * t)) * e];
  }
  function noOvershoot(x0, v0) { return x0 > 0 ? Math.max(v0, -OMEGA * x0) : Math.min(v0, -OMEGA * x0); }
  function velocity() { return spring ? springAt(spring, (now() - spring.t0) / 1000)[1] : 0; }
  function cancelAnim() { if (anim) { cancelAnimationFrame(anim); anim = 0; } spring = null; }
  function animateTo(target, speed) {
    const v = speed == null ? velocity() : speed;
    if (anim) { cancelAnimationFrame(anim); anim = 0; }
    spring = null;
    goal = target;
    const x0 = pos - target;
    if (reduceMotion || (Math.abs(x0) * W < 0.5 && Math.abs(v) * W < 30)) { setPos(target); settle(); return; }
    // 先登记弹簧再补建页面，补建时的重采样会排到画面停稳以后。
    const s = spring = {target: target, x0: x0, v0: noOvershoot(x0, v), t0: now()};
    prepare(Math.min(Math.round(pos), target), Math.max(Math.round(pos), target));
    const step = () => {
      if (spring !== s) return;
      const t = (now() - s.t0) / 1000, r = springAt(s, t);
      if ((Math.abs(r[0]) * W < 0.6 && Math.abs(r[1]) * W < 40) || t > 1.2) { anim = 0; spring = null; setPos(target); settle(); return; }
      setPos(target + r[0]);
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  function settle() {
    const k = Math.max(minPos(), Math.min(maxPos(), Math.round(pos)));
    setPos(k); goal = k;
    if (k !== unit) { resetZoom(); unit = k; }
    renderWindow(k);
    if (k >= 0 && k < units.length) { report(); pump(); }
    applyInset();
    scheduleFlush();
  }
  function jumpPaged(page) {
    cancelAnim(); resetZoom();
    const k = unitOf[clampPage(page)];
    unit = goal = k; setPos(k); renderWindow(k); report(); pump(); applyInset();
  }
  function turnPaged(delta, base) {
    const from = base == null ? goal : base;
    const next = from + delta;
    if (next > maxPos()) { if (chapters.next) send('jm2Chapter', {delta: 1}); else bounce(1); return; }
    if (next < minPos()) { if (chapters.prev && from === -1) send('jm2Chapter', {delta: -1}); else bounce(-1); return; }
    animateTo(next);
  }
  function bounce(side) {
    if (reduceMotion || anim) return;
    const from = goal, t0 = now();
    const step = () => {
      const t = Math.min(1, (now() - t0) / 260);
      setPos(from + side * 0.06 * Math.sin(Math.PI * t));
      if (t < 1) anim = requestAnimationFrame(step); else { anim = 0; setPos(from); scheduleFlush(); }
    };
    anim = requestAnimationFrame(step);
  }

  // ---- 设置面板打开时，把当前画面缩放到面板上方的空间里，边调边看 ----
  function unitHeight() {
    if (unit < 0 || unit >= units.length) return 0;
    const u = units[unit], ra = 1 / ratio(u[0]), rb = u[1] > u[0] ? 1 / ratio(u[1]) : 0;
    return Math.min(H, W / (ra + rb));
  }
  function applyInset() {
    if (!stage || !root) return;
    const on = inset > 0 && kind() !== 'strip';
    let css = '', s = 1;
    if (on) {
      const room = Math.max(120, H - inset - 16), h = unitHeight();
      s = h > room ? room / h : 1;
      css = 'translate3d(0,' + (-inset / 2).toFixed(1) + 'px,0) scale(' + s.toFixed(4) + ')';
    }
    clearTimeout(insetTimer); insetTimer = 0;
    if (on) root.classList.add('jm2-inset');
    else if (root.classList.contains('jm2-inset')) insetTimer = setTimeout(() => { insetTimer = 0; root.classList.remove('jm2-inset'); }, reduceMotion ? 0 : 300);
    if (css === insetCss) return;
    insetCss = css;
    stage.style.transition = reduceMotion ? 'none' : 'transform 260ms cubic-bezier(.2,.8,.2,1)';
    stage.style.transform = css;
    // 缩小预览停稳后，当前这组按缩小后的尺寸重采样；收起时立刻换回原尺寸那份。
    clearTimeout(insetFitTimer); insetFitTimer = 0;
    if (s < 0.99) insetFitTimer = setTimeout(() => { insetFitTimer = 0; insetFit = s; fitCurrent(); }, reduceMotion ? 0 : 300);
    else if (insetFit !== 1) { insetFit = 1; fitCurrent(); }
  }
  function setInset(px) {
    const next = Math.max(0, Math.min(H * 0.85, Math.round(Number(px) || 0)));
    if (next === inset) return;
    inset = next; applyInset();
  }
  function applyZoom() {
    if (!zoom.el) return;
    zoom.el.style.transform = zoom.s === 1 ? '' : 'translate(' + zoom.tx + 'px,' + zoom.ty + 'px) scale(' + zoom.s + ')';
  }
  function resetZoom() {
    const el = zoom.el, was = zoom.s;
    if (el) el.style.transform = '';
    zoom.s = 1; zoom.tx = 0; zoom.ty = 0; zoom.el = null;
    if (el && was > 1.01) Array.prototype.forEach.call(el.querySelectorAll('.jm2-page'), b => fit(pages[Number(b.getAttribute('data-page'))]));
  }
  function zoomTarget() {
    const el = rendered.get(unit);
    return el && unit >= 0 && unit < units.length ? el.querySelector('.jm2-zoom') : null;
  }
  function clampZoom() {
    if (!zoom.el) return;
    const w = zoom.el.offsetWidth * zoom.s, h = zoom.el.offsetHeight * zoom.s;
    const mx = Math.max(0, (w - W) / 2), my = Math.max(0, (h - H) / 2);
    zoom.tx = Math.max(-mx, Math.min(mx, zoom.tx)); zoom.ty = Math.max(-my, Math.min(my, zoom.ty));
  }

  // ---- 条漫模式 ----
  function stripHeight(p) { return Math.max(40, Math.round(W * ratio(p))); }
  function buildStrip() {
    scroller = document.createElement('div'); scroller.id = 'jm2-scroll';
    column = document.createElement('div'); column.id = 'jm2-column';
    headHeight = 0;
    if (chapters.prev) {
      const head = cardElement(-1);
      head.style.height = Math.round(H * 0.5) + 'px';
      headHeight = Math.round(H * 0.5);
      column.appendChild(head);
    }
    heights = []; tops = [];
    for (let p = 0; p < count; p++) {
      const box = document.createElement('div');
      box.className = 'jm2-page'; box.setAttribute('data-page', p);
      heights[p] = stripHeight(p); box.style.height = heights[p] + 'px';
      column.appendChild(box); pages[p].box = box; place(pages[p]);
      pages[p].cssW = W; pages[p].cssH = heights[p]; fit(pages[p]);
    }
    const tail = cardElement(1);
    tail.style.height = Math.round(H * 0.6) + 'px';
    column.appendChild(tail);
    computeTops();
    scroller.appendChild(column);
    stage.appendChild(scroller);
    scroller.addEventListener('scroll', onStripScroll, {passive: true});
  }
  function computeTops() {
    let y = headHeight;
    for (let p = 0; p < count; p++) { tops[p] = y; y += heights[p]; }
  }
  function locate(y) {
    let lo = 0, hi = count - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (tops[mid] <= y) lo = mid; else hi = mid - 1; }
    return lo;
  }
  function readingPage() { return locate(scroller.scrollTop + H * 0.3); }
  function stripRange() {
    const top = scroller.scrollTop, bottom = top + H;
    let first = locate(Math.max(0, top)), last = first;
    while (last + 1 < count && tops[last + 1] < bottom) last++;
    return [first, last];
  }
  function onStripScroll() {
    if (stripFrame) return;
    stripFrame = requestAnimationFrame(() => {
      stripFrame = 0;
      if (!mounted || kind() !== 'strip' || !scroller) return;
      stripReport(); pump();
    });
  }
  function stripReport() {
    if (!scroller) return;
    const page = readingPage();
    if (page !== lastStart) {
      lastStart = lastEnd = page; anchor = page;
      send('jm2Page', {page: page, end: page, wide: []});
    }
    stripShown();
  }
  function stripShown() {
    const r = stripRange();
    for (let i = r[0]; i <= r[1]; i++) if (pages[i].state !== 'ready') return;
    const key = 'strip:' + r[0] + '-' + r[1];
    if (shownKey !== key) {
      shownKey = key; remember(r);
      send('jm2Shown', {page: readingPage(), end: readingPage()});
      autoArm();
    }
  }
  function resizeStrip(p) {
    if (!scroller || !pages[p].box) return;
    const next = stripHeight(p), old = heights[p];
    if (Math.abs(next - old) < 1) return;
    const top = scroller.scrollTop, edge = tops[p];
    heights[p] = next; pages[p].box.style.height = next + 'px';
    pages[p].cssW = W; pages[p].cssH = next; fit(pages[p]);
    computeTops();
    // 视口上方的页面高度变化时补偿滚动位置，正在读的画面不跳。
    if (edge + old <= top + 1) scroller.scrollTop = top + next - old;
    else if (edge < top) scroller.scrollTop = edge + (top - edge) * next / old;
  }
  function jumpStrip(page) {
    cancelStripAnim();
    scroller.scrollTop = page === 0 && !chapters.prev ? 0 : tops[clampPage(page)];
    lastStart = -1; onStripScroll();
  }
  function cancelStripAnim() { if (stripAnim) { cancelAnimationFrame(stripAnim); stripAnim = 0; } stripSpring = null; }
  // 点按滚屏也用弹簧；连点时在上一次的目标上继续累加，速度接续。
  function scrollStrip(delta, done) {
    const max = scroller.scrollHeight - H, from = scroller.scrollTop;
    const moving = stripSpring, v = moving ? springAt(moving, (now() - moving.t0) / 1000)[1] : 0;
    const to = Math.max(0, Math.min(max, (moving ? stripGoal : from) + delta * Math.floor(H * 0.85)));
    cancelStripAnim();
    if (Math.abs(to - from) < 1) { if (done) done(); return; }
    if (reduceMotion) { scroller.scrollTop = to; if (done) done(); return; }
    stripGoal = to;
    const x0 = from - to, s = stripSpring = {x0: x0, v0: noOvershoot(x0, v), t0: now()};
    const step = () => {
      if (stripSpring !== s) return;
      const t = (now() - s.t0) / 1000, r = springAt(s, t);
      if ((Math.abs(r[0]) < 0.6 && Math.abs(r[1]) < 40) || t > 1.2) {
        scroller.scrollTop = to; stripAnim = 0; stripSpring = null;
        if (done) done();
        return;
      }
      scroller.scrollTop = to + r[0];
      stripAnim = requestAnimationFrame(step);
    };
    stripAnim = requestAnimationFrame(step);
  }
  function stripAtEnd() { return scroller.scrollTop + H >= tops[count - 1] + heights[count - 1] - 2; }

  // ---- 搭建与切换排版 ----
  function layout(page) {
    cancelAnim(); cancelStripAnim(); resetZoom();
    clearRendered();
    if (scroller) { scroller.remove(); scroller = null; column = null; }
    if (track) { track.remove(); track = null; }
    pages.forEach(r => { r.box = null; });
    buildUnits();
    lastStart = -1; lastEnd = -1; shownKey = ''; gesture = null;
    root.classList.toggle('jm2-strip', kind() === 'strip');
    root.classList.toggle('jm2-paged', kind() !== 'strip');
    if (kind() === 'strip') {
      buildStrip();
      anchor = clampPage(page);
      jumpStrip(anchor);
      applyInset();
    } else {
      track = document.createElement('div'); track.id = 'jm2-track';
      stage.appendChild(track);
      jumpPaged(page);
    }
  }
  function setMode(next, request) {
    if (MODES.indexOf(next) < 0 || !mounted) { send('jm2Mode', {ok: false, mode: mode, request: request}); return; }
    stopAuto('mode');
    fadeSwap(() => {
      const page = kind() === 'strip' ? readingPage() : visibleRange()[0];
      mode = next;
      layout(page);
      send('jm2Mode', {ok: true, mode: mode, request: request, page: lastStart});
    });
  }
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    if (!mounted || !w || !h || (w === W && h === H)) return;
    const page = kind() === 'strip' ? readingPage() : visibleRange()[0];
    W = w; H = h;
    if (kind() === 'strip') {
      for (let p = 0; p < count; p++) {
        heights[p] = stripHeight(p); pages[p].box.style.height = heights[p] + 'px';
        pages[p].cssW = W; pages[p].cssH = heights[p]; fit(pages[p]);
      }
      computeTops(); jumpStrip(page);
    } else { clearRendered(); jumpPaged(page); }
  }

  // ---- 手势：轻点分区、跟手拖动、惯性吸附、双指缩放 ----
  const points = new Map();
  let gesture = null;
  function onDown(e) {
    if (!mounted || (e.pointerType === 'mouse' && e.button !== 0)) return;
    stopAuto('touch');
    points.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (kind() !== 'strip') { try { root.setPointerCapture(e.pointerId); } catch (_) {} }
    if (points.size === 1) {
      // 按下时不打断正在进行的翻页；确定是拖动才接管，确定是点按就在原动画上改目标。
      gesture = {type: 'pending', x0: e.clientX, y0: e.clientY, t0: now(), pos0: pos, base: goal, moving: !!anim,
        samples: [[now(), e.clientX]], tx0: zoom.tx, ty0: zoom.ty, target: e.target};
    } else if (points.size === 2 && kind() !== 'strip') {
      if (anim || Math.round(pos) !== pos) { cancelAnim(); settle(); }
      if (unit < 0 || unit >= units.length) return;
      if (!zoom.el) zoom.el = zoomTarget();
      const p = Array.from(points.values());
      gesture = {type: 'pinch', d0: Math.max(10, Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)), s0: zoom.s, tx0: zoom.tx, ty0: zoom.ty,
        fx: (p[0].x + p[1].x) / 2, fy: (p[0].y + p[1].y) / 2};
    }
  }
  function onMove(e) {
    if (!points.has(e.pointerId) || !gesture) return;
    points.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (gesture.type === 'pinch') {
      if (points.size < 2 || !zoom.el) return;
      const p = Array.from(points.values());
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const s = Math.max(1, Math.min(4, gesture.s0 * d / gesture.d0));
      const fx = (p[0].x + p[1].x) / 2 - W / 2, fy = (p[0].y + p[1].y) / 2 - H / 2;
      const ox = gesture.fx - W / 2, oy = gesture.fy - H / 2;
      zoom.s = s;
      zoom.tx = fx - (ox - gesture.tx0) * s / gesture.s0;
      zoom.ty = fy - (oy - gesture.ty0) * s / gesture.s0;
      clampZoom(); applyZoom();
      return;
    }
    if (gesture.type === 'pending' && Math.hypot(e.clientX - gesture.x0, e.clientY - gesture.y0) > 8) {
      const dx0 = e.clientX - gesture.x0, dy0 = e.clientY - gesture.y0;
      if (kind() === 'strip') { gesture.type = 'scroll'; cancelStripAnim(); }
      else if (zoom.s > 1.01) gesture.type = 'pan';
      else gesture.type = Math.abs(dx0) >= Math.abs(dy0) * 0.7 ? 'drag' : 'none';
      if (gesture.type === 'drag' || gesture.type === 'pan') {
        // 从越过判定距离的这一刻起算位移，画面不会突然跳一下；动画中途接住时从当前位置开始跟手。
        cancelAnim();
        gesture.x0 = e.clientX; gesture.y0 = e.clientY; gesture.pos0 = pos;
        gesture.tx0 = zoom.tx; gesture.ty0 = zoom.ty;
        gesture.samples = [[now(), e.clientX]];
        if (gesture.type === 'drag') prepare(Math.floor(pos) - 1, Math.ceil(pos) + 1);
      }
    }
    const dx = e.clientX - gesture.x0, dy = e.clientY - gesture.y0;
    if (gesture.type === 'drag') {
      const raw = gesture.pos0 - dir() * dx / W;
      gesture.raw = raw;
      const lo = minPos(), hi = maxPos();
      setPos(raw < lo ? lo - (lo - raw) * 0.3 : raw > hi ? hi + (raw - hi) * 0.3 : raw);
      gesture.samples.push([now(), e.clientX]);
      while (gesture.samples.length > 2 && now() - gesture.samples[0][0] > 100) gesture.samples.shift();
    } else if (gesture.type === 'pan') {
      zoom.tx = gesture.tx0 + dx; zoom.ty = gesture.ty0 + dy;
      clampZoom(); applyZoom();
    }
  }
  function onUp(e) {
    const known = points.delete(e.pointerId);
    if (!known || !gesture) return;
    if (gesture.type === 'pinch') {
      if (points.size === 1) {
        const p = Array.from(points.values())[0];
        gesture = {type: 'pan', x0: p.x, y0: p.y, tx0: zoom.tx, ty0: zoom.ty, t0: now()};
      } else if (!points.size) {
        gesture = null;
        // 松开后按放大后的尺寸重采样，放大的画面保持清晰。
        if (zoom.s < 1.05) resetZoom(); else fitCurrent();
        scheduleFlush();
      }
      return;
    }
    if (points.size) return;
    const g = gesture;
    gesture = null;
    if (e.type === 'pointercancel') { restore(g); scheduleFlush(); return; }
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (g.type === 'pending') {
      if (now() - g.t0 < 500 && Math.hypot(dx, dy) <= 8) tap(e.clientX, g.target, g);
      else restore(g);
    } else if (g.type === 'drag') finishDrag(g);
    else if (g.type === 'none') restore(g);
    else if (g.type === 'pan' && zoom.s > 1.01) fitCurrent();
    scheduleFlush();
  }
  // 手势被打断或不算翻页时：动画还在走就让它走完，否则回到最近的一组。
  function restore(g) {
    if (kind() === 'strip' || !g || anim) return;
    if (Math.round(pos) !== pos) animateTo(g.type === 'drag' ? Math.round(g.pos0) : goal, 0);
  }
  function finishDrag(g) {
    const s = g.samples, last = s[s.length - 1], first = s[0];
    const v = last[0] > first[0] && now() - last[0] < 120 ? (last[1] - first[1]) / (last[0] - first[0]) : 0;
    const forward = -dir() * v, speed = forward * 1000 / W;
    const base = Math.round(g.pos0), raw = g.raw == null ? pos : g.raw;
    if (base === maxPos() && raw > maxPos() + 0.22 && chapters.next) { animateTo(base, 0); send('jm2Chapter', {delta: 1}); return; }
    if (base === minPos() && base < 0 && raw < minPos() - 0.22 && chapters.prev) { animateTo(base, 0); send('jm2Chapter', {delta: -1}); return; }
    let target;
    // 快速甩动也要拖过一小段距离才算翻页，避免轻触时手指抖动误翻。
    if (Math.abs(v) > 0.3 && Math.abs(pos - base) * W > 24) target = forward > 0 ? Math.floor(pos + 0.001) + 1 : Math.ceil(pos - 0.001) - 1;
    else if (pos - base > 0.2) target = base + 1;
    else if (pos - base < -0.2) target = base - 1;
    else target = base;
    target = Math.max(minPos(), Math.min(maxPos(), Math.max(base - 1, Math.min(base + 1, target))));
    // 越过两端的橡皮筋区域时不带速度回弹。
    animateTo(target, pos < minPos() || pos > maxPos() ? 0 : speed);
  }
  function tap(x, target, g) {
    const action = target && target.closest ? target.closest('[data-act]') : null;
    if (action) {
      const act = action.getAttribute('data-act');
      if (act === 'retry') {
        const rec = pages[Number(action.getAttribute('data-page'))];
        if (rec) { rec.tries = 0; rec.state = 'idle'; place(rec); pump(); }
      } else if (act === 'chapter') send('jm2Chapter', {delta: Number(action.getAttribute('data-delta')) < 0 ? -1 : 1});
      restore(g);
      return;
    }
    const zone = x < W * 0.3 ? -1 : x > W * 0.7 ? 1 : 0;
    if (chromeShown || !zone) {
      restore(g);
      send('jm2Menu');
      return;
    }
    if (kind() === 'strip') { scrollStrip(zone); return; }
    resetZoom();
    turnPaged(zone * dir(), g.moving ? g.base : null);
  }

  // ---- 自动翻页 ----
  function setAuto(seconds, request) {
    stopAuto(null);
    autoRequest = request;
    if (!seconds) return;
    if (!mounted || suspended || !Number.isInteger(seconds) || seconds < 2 || seconds > 30) { send('jm2Auto', {running: false, request: request}); return; }
    autoMs = seconds * 1000;
    send('jm2Auto', {running: true, request: request});
    autoArm();
  }
  function stopAuto(reason) {
    if (!autoMs) return;
    autoMs = 0; clearTimeout(autoTimer); clearTimeout(autoWatch); autoTimer = autoWatch = 0;
    if (reason) send('jm2Auto', {running: false, reason: reason, request: autoRequest});
  }
  // 当前画面显示完整后才开始计时；图片没到就等，超过 25 秒停下。
  function autoArm() {
    if (!autoMs || suspended) return;
    clearTimeout(autoTimer); autoTimer = 0;
    let ready = kind() === 'strip' ? !!scroller : currentShown();
    if (ready && kind() === 'strip') {
      const r = stripRange();
      for (let i = r[0]; i <= r[1]; i++) if (pages[i].state !== 'ready') ready = false;
    }
    if (!ready) {
      if (!autoWatch) autoWatch = setTimeout(() => { autoWatch = 0; stopAuto('timeout'); }, 25000);
      return;
    }
    clearTimeout(autoWatch); autoWatch = 0;
    autoTimer = setTimeout(() => {
      autoTimer = 0;
      if (!autoMs) return;
      if (kind() === 'strip') {
        if (stripAtEnd()) { stopAuto('end'); return; }
        scrollStrip(1, () => { stripReport(); pump(); autoArm(); });
      } else {
        if (unit >= units.length - 1) { stopAuto('end'); return; }
        animateTo(unit + 1, 0);
      }
    }, autoMs);
  }

  // ---- 对外接口 ----
  function suspend() {
    suspended = true; stopAuto('hidden'); cancelAnim(); cancelStripAnim();
    held = [];
    pages.forEach(rec => { if (rec.surface || rec.state === 'loading') release(rec); if (rec.state === 'retry') rec.state = 'idle'; });
  }
  function resume() {
    if (!suspended) return;
    suspended = false;
    pages.forEach(rec => { if (rec.state === 'error') { rec.state = 'idle'; rec.tries = 0; place(rec); } });
    pump();
  }
  window.jm2Pager = {
    go(page) {
      if (!mounted) { anchor = clampPage(page); return; }
      stopAuto('manual');
      if (kind() === 'strip') jumpStrip(clampPage(page)); else jumpPaged(page);
    },
    turn(delta) {
      if (!mounted || (delta !== 1 && delta !== -1)) return;
      stopAuto('manual');
      if (kind() === 'strip') scrollStrip(delta); else { resetZoom(); turnPaged(delta); }
    },
    setMode: setMode,
    pair(action, page, list) {
      if (!mounted) return;
      if (kind() === 'spread') pair(action, page, list);
      else if (action === 'reset') {
        if (Array.isArray(list)) defaults = cleanList(list);
        singles = new Set(defaults);
        send('jm2Pairs', {singles: Array.from(singles).sort((a, b) => a - b), page: lastStart, end: lastEnd});
      }
    },
    setAuto: setAuto,
    setCache(value) { if (validCache(value)) { cache = value; pump(); } },
    setChrome(shown) { chromeShown = !!shown; },
    setBackground(hex) { if (/^#[0-9a-f]{6}$/i.test(hex)) applyBackground(hex); },
    setReduceMotion(value) { reduceMotion = !!value; },
    setInset: setInset,
    suspend: suspend, resume: resume, zipPage: zipPage
  };

  // ---- 启动 ----
  let tries = 0;
  function boot() {
    if (booted) return;
    const found = harvest();
    if (!found) {
      if (++tries < 40) { setTimeout(boot, 125); return; }
      booted = true; send('jm2Unavailable'); return;
    }
    booted = true;
    root = document.createElement('div'); root.id = 'jm2';
    stage = document.createElement('div'); stage.id = 'jm2-stage';
    root.appendChild(stage);
    clearTemplate();
    document.body.appendChild(root);
    makePages(found);
    W = window.innerWidth || W; H = window.innerHeight || H;
    mounted = true;
    layout(anchor);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('contextmenu', e => e.preventDefault());
    root.addEventListener('dragstart', e => e.preventDefault());
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto('hidden'); });
    window.addEventListener('pagehide', suspend);
    window.addEventListener('pageshow', resume);
    send('jm2Mounted', {page: lastStart < 0 ? anchor : lastStart, mode: mode});
    report(); pump();
  }
  early();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once: true});
  else boot();
}
