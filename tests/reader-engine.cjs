// 阅读引擎浏览器测试：模拟来源章节模板，检查解扰、翻页、合页、模式切换、条漫、过渡页和自动翻页。
// 依赖：playwright-core（Edge）与 acorn，用 NODE_PATH 指向临时安装目录。
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {chromium} = require('playwright-core');
const engine = fs.readFileSync(path.join(__dirname, '../src/reader-layout.js'), 'utf8');
const protect = fs.readFileSync(path.join(__dirname, '../src/reader-protection.js'), 'utf8');
const SITE = 'https://site.test';

function sliceCount(aid, stem) {
  let key = crypto.createHash('md5').update(String(aid) + stem).digest('hex').slice(-1).charCodeAt(0);
  if (aid >= 268850 && aid <= 421925) key %= 10; else if (aid >= 421926) key %= 8;
  return key >= 0 && key <= 9 ? key * 2 + 2 : 10;
}

// 生成带页码和色带的页面原图，以及按来源规则打乱后的图片。
async function makeImages(browser, specs) {
  const tab = await browser.newPage();
  const out = await tab.evaluate(specs => specs.map(s => {
    const a = document.createElement('canvas'); a.width = s.w; a.height = s.h;
    const g = a.getContext('2d');
    if (s.tone) {
      // 细网点：每 3 像素一个黑点，缩小时如果只做双线性取样就会出现摩尔纹。
      const data = g.createImageData(s.w, s.h), px = data.data;
      for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
        const k = (y * s.w + x) * 4, v = x % 3 === 0 && y % 3 === 0 ? 0 : 255;
        px[k] = px[k + 1] = px[k + 2] = v; px[k + 3] = 255;
      }
      g.putImageData(data, 0, 0);
    } else {
      for (let y = 0; y < s.h; y += 10) { g.fillStyle = 'hsl(' + ((y * 7 + s.n * 40) % 360) + ',70%,' + (35 + (y / 10 % 3) * 15) + '%)'; g.fillRect(0, y, s.w, 10); }
      g.fillStyle = '#fff'; g.font = 'bold ' + Math.floor(s.h / 4) + 'px sans-serif'; g.textAlign = 'center';
      g.fillText(String(s.n + 1), s.w / 2, s.h / 2);
    }
    const plain = a.toDataURL('image/png');
    let scrambled = plain;
    if (s.slices > 1) {
      const b = document.createElement('canvas'); b.width = s.w; b.height = s.h;
      const ctx = b.getContext('2d'), num = s.slices, rest = s.h % num, base = Math.floor(s.h / num);
      for (let i = 0; i < num; i++) {
        let height = base, to = base * i;
        const from = s.h - base * (i + 1) - rest;
        if (i === 0) height += rest; else to += rest;
        ctx.drawImage(a, 0, to, s.w, height, 0, from, s.w, height);
      }
      scrambled = b.toDataURL('image/png');
    }
    return {plain, scrambled};
  }), specs);
  await tab.close();
  return out.map(o => ({plain: Buffer.from(o.plain.split(',')[1], 'base64'), scrambled: Buffer.from(o.scrambled.split(',')[1], 'base64')}));
}

function templateHtml({aid, count, withGetNum}) {
  const files = Array.from({length: count}, (_, i) => String(i + 1).padStart(5, '0') + '.webp');
  return `<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://ads.test/gtag.js"></script>
${withGetNum ? '<script src="/templates/js/getnum.js"></script>' : ''}
<script>var aid = ${aid}; var speed = ''; var scramble_id = 220980;</script>
<style>img{vertical-align:middle}.hide{display:none!important}</style></head>
<body style="margin:0 !important;"><div id="container"><div id="photo-container">
<div class="ad-body"><a href="https://ads.test/x"><img src="https://ads.test/banner.gif"></a></div>
<div class="center scramble-page thewayhome"><a href="/payment"><img src="/static/ad.jpg"></a></div>
</div></div>
<div id="photo-container_tpl" style="display:none;"><div class="center scramble-page"><div style="height:0"></div>
<img src="/templates/img/app-loading.gif" class="lazy_img" data-original="" style="min-height:200px"/></div></div>
<script>
const result = {images: ${JSON.stringify(files)}};
const config = {jmid: '${aid}', imghost: '${SITE}', cache: ''};
const template = document.getElementById("photo-container_tpl").children[0];
const container = document.getElementById("photo-container");
const secondDiv = container.children[1];
result.images.forEach((image, index) => {
  const clone = template.cloneNode(true); clone.id = image;
  const div1 = clone.querySelector("div"); div1.id = 'page_' + index; div1.setAttribute("data-page", index);
  const img = clone.querySelector("img"); img.id = 'album_photo_' + index;
  img.setAttribute("data-original", config.imghost + '/media/photos/' + config.jmid + '/' + image + config.cache);
  if (secondDiv) container.insertBefore(clone, secondDiv); else container.appendChild(clone);
});
</script></body></html>`;
}

async function openReader(browser, {aid = 350234, count = 6, specs, options = {}, withGetNum = false, viewport = {width: 400, height: 640}, delay = 0, gates = {}}) {
  const all = specs || Array.from({length: count}, (_, n) => ({n, w: 300, h: 450}));
  all.forEach(s => { s.slices = aid >= 220980 ? sliceCount(aid, String(s.n + 1).padStart(5, '0')) : 1; });
  const images = await makeImages(browser, all);
  const context = await browser.newContext({viewport, hasTouch: false});
  const page = await context.newPage();
  const stats = {requests: [], blocked: 0};
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== SITE) { stats.blocked++; return route.abort(); }
    if (url.pathname === '/chapter_view_template') return route.fulfill({contentType: 'text/html', body: templateHtml({aid, count, withGetNum})});
    if (url.pathname === '/templates/js/getnum.js') {
      // 来源 get_num 的等价实现：由测试端预先算好分块数。
      const table = {}; all.forEach(s => { table[String(s.n + 1).padStart(5, '0')] = s.slices; });
      return route.fulfill({contentType: 'text/javascript', body: 'window.md5=function(){};window.getNumCalls=0;window.get_num=function(a,p){window.getNumCalls++;return ' + JSON.stringify(table) + '[atob(p)];};'});
    }
    const m = /^\/media\/photos\/\d+\/(\d+)\.webp$/.exec(url.pathname);
    if (m) {
      const i = Number(m[1]) - 1;
      stats.requests.push(i);
      if (delay) await new Promise(r => setTimeout(r, delay));
      if (gates[i]) await gates[i];
      return route.fulfill({contentType: 'image/png', body: aid >= 220980 ? images[i].scrambled : images[i].plain});
    }
    return route.fulfill({status: 404, body: ''});
  });
  await page.addInitScript(() => {
    window.events = [];
    window.ReactNativeWebView = {postMessage: raw => window.events.push(JSON.parse(raw))};
  });
  const opts = Object.assign({session: 9, count, mode: 'horizontal', initial: 0, cache: {keep: 6, ahead: 2}}, options);
  await page.addInitScript(`;(${protect})();(${engine})(${JSON.stringify(opts)});`);
  await page.goto(SITE + '/chapter_view_template?id=' + aid + '&mode=vertical&page=0', {waitUntil: 'domcontentloaded'});
  await page.waitForFunction(() => events.some(e => e.type === 'jm2Mounted'));
  return {page, context, images, stats, specs: all};
}

const last = (page, type) => page.evaluate(t => { const list = events.filter(e => e.type === t); return list[list.length - 1] || null; }, type);
const shownAt = (page, n) => page.waitForFunction(n => events.some(e => e.type === 'jm2Shown' && e.page === n), n, {timeout: 5000});
const settle = page => page.waitForTimeout(420);
async function currentPage(page) { const e = await last(page, 'jm2Page'); return e && [e.page, e.end]; }
async function tapAt(page, fx, fy = 0.5) {
  const v = page.viewportSize();
  await page.mouse.click(Math.round(v.width * fx), Math.round(v.height * fy));
}
async function drag(page, fromX, toX, steps = 8, y = 0.5) {
  const v = page.viewportSize();
  await page.mouse.move(v.width * fromX, v.height * y);
  await page.mouse.down();
  await page.mouse.move(v.width * toX, v.height * y, {steps});
  await page.mouse.up();
}
// 当前视口里能看到的页（按屏幕从左到右）。
function visiblePages(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('.jm2-page')).map(b => {
    const r = b.getBoundingClientRect();
    return {page: Number(b.getAttribute('data-page')), left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height};
  }).filter(r => r.right > 1 && r.left < innerWidth - 1 && r.bottom > 1 && r.top < innerHeight - 1).sort((a, b) => a.left - b.left));
}
// 比对页面上解扰后的画面与原图（抽样像素）。
async function samePixels(page, n, plain) {
  return page.evaluate(async ({n, data}) => {
    const box = document.querySelector('.jm2-page[data-page="' + n + '"]');
    const surface = box && box.querySelector('canvas,img');
    if (!surface) return 'no surface';
    const img = new Image(); img.src = 'data:image/png;base64,' + data; await img.decode();
    const w = img.naturalWidth, h = img.naturalHeight;
    const a = document.createElement('canvas'); a.width = w; a.height = h; a.getContext('2d').drawImage(img, 0, 0);
    const b = document.createElement('canvas'); b.width = w; b.height = h; b.getContext('2d').drawImage(surface, 0, 0, w, h);
    const pa = a.getContext('2d').getImageData(0, 0, w, h).data, pb = b.getContext('2d').getImageData(0, 0, w, h).data;
    let bad = 0;
    for (let y = 5; y < h; y += 23) for (let x = 3; x < w; x += 37) {
      const k = (y * w + x) * 4;
      if (Math.abs(pa[k] - pb[k]) + Math.abs(pa[k + 1] - pb[k + 1]) + Math.abs(pa[k + 2] - pb[k + 2]) > 12) bad++;
    }
    return bad;
  }, {n, data: plain.toString('base64')});
}

(async () => {
  const acorn = require('acorn');
  acorn.parse(engine, {ecmaVersion: 2017});
  acorn.parse(protect, {ecmaVersion: 2017});
  console.log('PASS 引擎与保护脚本仅用 ES2017 语法');

  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    // 1. 解扰：三个分块规则区间、来源 get_num 委托、未打乱的旧本子。
    for (const [aid, withGetNum] of [[350234, false], [500000, false], [250000, false], [350234, true], [100000, false]]) {
      const r = await openReader(browser, {aid, withGetNum, options: {initial: 2}});
      await shownAt(r.page, 2);
      assert.equal(await samePixels(r.page, 2, r.images[2].plain), 0, 'unscramble aid ' + aid);
      if (withGetNum) assert(await r.page.evaluate(() => window.getNumCalls > 0), 'delegates to source get_num');
      assert.equal(await r.page.evaluate(() => document.querySelectorAll('#container,.ad-body,.thewayhome').length), 0, 'template removed');
      assert.equal(await r.page.evaluate(() => typeof window.gtagLoaded), 'undefined');
      await r.context.close();
    }
    console.log('PASS 解扰与来源 get_num 一致，模板和广告节点已清除');

    // 2. 单页左右翻：点按分区、方向、连点不丢页、拖动与回弹。
    for (const mode of ['horizontal', 'rtl']) {
      const r = await openReader(browser, {count: 8, options: {mode}});
      const page = r.page, forward = mode === 'rtl' ? 0.1 : 0.9, back = mode === 'rtl' ? 0.9 : 0.1;
      await shownAt(page, 0);
      await tapAt(page, forward); await settle(page);
      assert.deepEqual(await currentPage(page), [1, 1], mode + ' tap forward');
      await tapAt(page, back); await settle(page);
      assert.deepEqual(await currentPage(page), [0, 0], mode + ' tap back');
      for (let i = 0; i < 4; i++) { await tapAt(page, forward); await page.waitForTimeout(40); }
      await settle(page);
      assert.deepEqual(await currentPage(page), [4, 4], mode + ' rapid taps');
      const v = await visiblePages(page);
      assert.equal(v.length, 1, mode + ' one page on screen'); assert.equal(v[0].page, 4);
      const sx = mode === 'rtl' ? [0.2, 0.8] : [0.8, 0.2];
      await drag(page, sx[0], sx[1]); await settle(page);
      assert.deepEqual(await currentPage(page), [5, 5], mode + ' swipe forward');
      await drag(page, sx[1], sx[0]); await settle(page);
      assert.deepEqual(await currentPage(page), [4, 4], mode + ' swipe back');
      await drag(page, 0.5, mode === 'rtl' ? 0.55 : 0.45, 12); await settle(page);
      assert.deepEqual(await currentPage(page), [4, 4], mode + ' short drag returns');
      assert.equal((await visiblePages(page))[0].left, (await visiblePages(page))[0].left);
      const box = (await visiblePages(page))[0];
      assert(Math.abs(box.left + box.width / 2 - 200) < 1.5, mode + ' centered after snap');
      await tapAt(page, 0.5); await page.waitForTimeout(50);
      assert(await last(page, 'jm2Menu'), 'center tap opens menu');
      await page.evaluate(() => jm2Pager.setChrome(true));
      const before = await currentPage(page);
      await tapAt(page, forward); await settle(page);
      assert.deepEqual(await currentPage(page), before, 'taps only close the menu while it is shown');
      await r.context.close();
    }
    console.log('PASS 单页点按、连点、拖动、回弹和菜单开关');

    // 流畅度：按住再松的连点不让画面停顿、动画途中不改 DOM、图片在动画途中到达时等停稳再上屏。
    {
      const r = await openReader(browser, {count: 10, options: {mode: 'horizontal', cache: {keep: 6, ahead: 8}}});
      const page = r.page;
      await shownAt(page, 0); await page.waitForTimeout(500);
      await page.evaluate(() => {
        const track = document.getElementById('jm2-track');
        window.samples = []; window.mutations = 0;
        const tick = () => { const m = /translate3d\((-?[\d.]+)px/.exec(track.style.transform); samples.push(-Number(m[1])); window.sampler = requestAnimationFrame(tick); };
        window.sampler = requestAnimationFrame(tick);
        new MutationObserver(list => { mutations += list.length; }).observe(track, {childList: true, subtree: true});
      });
      const v = page.viewportSize(), x = () => page.evaluate(() => samples[samples.length - 1]);
      await page.mouse.click(v.width * 0.9, v.height / 2);
      await page.waitForTimeout(30);
      await page.mouse.move(v.width * 0.9, v.height / 2); await page.mouse.down();
      const pressed = await x();
      await page.waitForTimeout(60);
      const held = await x();
      assert(held - pressed > 40, 'a finger resting on the screen does not freeze the turn: ' + pressed + ' -> ' + held);
      await page.mouse.up();
      for (let i = 0; i < 2; i++) {
        await page.waitForTimeout(30);
        await page.mouse.down(); await page.waitForTimeout(70); await page.mouse.up();
      }
      const during = await page.evaluate(() => mutations);
      await settle(page); await page.waitForTimeout(200);
      const xs = await page.evaluate(() => { cancelAnimationFrame(sampler); return samples; });
      assert.deepEqual(await currentPage(page), [4, 4], 'held taps still add up');
      const start = xs.findIndex(x => x > 0.5), end = xs.findIndex(x => x >= 4 * 400 - 2);
      assert(start >= 0 && end > start, 'animation reaches page 5');
      for (let k = start + 1; k <= end; k++) assert(xs[k] >= xs[k - 1] - 0.5, 'never moves backwards at frame ' + k);
      assert(during <= 3, 'at most one unit added per retarget while moving: ' + during);
      await r.context.close();
    }
    {
      let release;
      const gate = new Promise(res => { release = res; });
      const r = await openReader(browser, {count: 6, options: {mode: 'horizontal', cache: {keep: 0, ahead: 0}}, gates: {1: gate}});
      const page = r.page;
      await shownAt(page, 0); await page.waitForTimeout(200);
      await page.evaluate(() => {
        const track = document.getElementById('jm2-track');
        window.flight = [];
        new MutationObserver(() => { const m = /translate3d\((-?[\d.]+)px/.exec(track.style.transform); flight.push(-Number(m[1])); })
          .observe(track, {childList: true, subtree: true, attributes: true, attributeFilter: ['data-state']});
        jm2Pager.turn(1);
      });
      release();
      await shownAt(page, 1); await settle(page);
      const xs = await page.evaluate(() => flight);
      assert(xs.length > 0, 'page 2 was placed');
      assert(xs.every(x => Math.abs(x - Math.round(x / 400) * 400) < 0.5), 'DOM only changes while the track is at rest: ' + xs.join(','));
      await r.context.close();
    }
    console.log('PASS 连点不停顿、动画途中不改 DOM、图片停稳后上屏');

    // 设置面板打开时画面缩到面板上方；关掉后复原。切换排版淡出淡入。
    {
      const r = await openReader(browser, {count: 6, options: {mode: 'horizontal', initial: 1}});
      const page = r.page;
      await shownAt(page, 1); await page.waitForTimeout(300);
      await page.evaluate(() => jm2Pager.setInset(300)); await page.waitForTimeout(450);
      let box = (await visiblePages(page)).find(b => b.page === 1);
      assert(box.bottom <= 640 - 300 + 1 && box.top >= 0, 'page fits above the sheet: ' + box.top + '-' + box.bottom);
      assert(Math.abs(box.left + box.width / 2 - 200) < 1.5, 'still centered horizontally');
      const hidden = await page.evaluate(() => Array.from(document.querySelectorAll('.jm2-unit')).filter(u => getComputedStyle(u).visibility === 'visible').length);
      assert.equal(hidden, 1, 'neighbours stay hidden while scaled');
      await page.evaluate(() => jm2Pager.setInset(0)); await page.waitForTimeout(500);
      box = (await visiblePages(page)).find(b => b.page === 1);
      assert(Math.abs(box.height - 600) < 1 && Math.abs(box.top - 20) < 1, 'back to full size: ' + box.top + ' ' + box.height);
      assert(!(await page.evaluate(() => document.getElementById('jm2').classList.contains('jm2-inset'))));
      await page.evaluate(() => jm2Pager.setMode('spread-ltr', 7));
      assert.equal(await page.evaluate(() => document.getElementById('jm2').style.opacity), '0', 'fades out before switching');
      await page.waitForFunction(() => events.some(e => e.type === 'jm2Mode' && e.request === 7), null, {timeout: 1000});
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate(() => document.getElementById('jm2').style.opacity), '', 'fades back in');
      await page.evaluate(() => jm2Pager.setInset(260)); await page.waitForTimeout(450);
      await page.evaluate(() => jm2Pager.pair('shift', 1)); await page.waitForTimeout(450);
      box = (await visiblePages(page)).find(b => b.page === 1);
      assert(box && box.bottom <= 640 - 260 + 1, 'still fits after shifting the pairs');
      await r.context.close();
    }
    console.log('PASS 面板打开时画面缩到上方、关闭复原、切换排版淡入淡出');

    // 3. 双页：并排无缝、方向、错开一页、横版宽图自动单独显示。
    for (const mode of ['spread-ltr', 'spread-rtl']) {
      const specs = Array.from({length: 9}, (_, n) => ({n, w: n === 6 ? 600 : 300, h: n === 6 ? 300 : 450}));
      const r = await openReader(browser, {count: 9, specs, options: {mode, initial: 2, cache: {keep: 6, ahead: 6}}, viewport: {width: 640, height: 480}});
      const page = r.page;
      await shownAt(page, 2);
      assert.deepEqual(await currentPage(page), [2, 3], mode + ' default pairs from page 1');
      let v = await visiblePages(page);
      assert.deepEqual(v.map(b => b.page), mode === 'spread-rtl' ? [3, 2] : [2, 3], mode + ' order');
      assert(Math.abs(v[0].right - v[1].left) < 1, mode + ' no seam between pages');
      assert(Math.abs(v[0].height - v[1].height) < 1, mode + ' same height');
      assert(v[0].left >= 0 && v[1].right <= 640, mode + ' nothing bleeds in from neighbours');
      await page.waitForTimeout(500);
      assert.deepEqual((await last(page, 'jm2Page')).shift, {can: true, on: false, wide: false});
      // 错开一页：以第 3 页为准，3-4 变成 2-3；再按一次回到 3-4。
      await page.evaluate(() => jm2Pager.pair('shift', 2)); await settle(page);
      assert.deepEqual(await currentPage(page), [1, 2], 'page 3 now pairs with page 2');
      assert.deepEqual((await last(page, 'jm2Pairs')).singles, [0]);
      assert.equal((await last(page, 'jm2Pairs')).shift.on, true);
      await page.evaluate(() => jm2Pager.pair('shift', 2)); await settle(page);
      assert.deepEqual(await currentPage(page), [2, 3], 'shifting again restores the original pair');
      assert.deepEqual((await last(page, 'jm2Pairs')).singles, []);
      assert.equal((await last(page, 'jm2Page')).shift.on, false);
      await page.evaluate(() => jm2Pager.pair('shift', 3)); await settle(page);
      assert.deepEqual(await currentPage(page), [3, 4], 'anchoring on the right-hand page');
      // 横版跨页图之后的一段单独计算，跨页图本身不能错开。
      await page.evaluate(() => jm2Pager.go(7)); await settle(page);
      assert.deepEqual(await currentPage(page), [7, 8]);
      await page.evaluate(() => jm2Pager.pair('shift', 7)); await settle(page);
      assert.deepEqual(await currentPage(page), [7, 7], 'the run after the wide page shifts on its own');
      assert.deepEqual((await last(page, 'jm2Pairs')).singles, [0, 7]);
      await page.evaluate(() => jm2Pager.go(6)); await settle(page);
      assert.deepEqual((await last(page, 'jm2Page')).shift, {can: false, on: false, wide: true});
      await page.evaluate(() => jm2Pager.pair('reset', 2)); await settle(page);
      assert.deepEqual(await currentPage(page), [2, 3]);
      assert.deepEqual((await last(page, 'jm2Pairs')).singles, []);
      await page.evaluate(() => jm2Pager.go(4)); await shownAt(page, 4); await settle(page);
      assert.deepEqual(await currentPage(page), [4, 5]);
      await page.waitForFunction(() => events.some(e => e.type === 'jm2Page' && e.page === 6 || (e.wide || []).indexOf(6) >= 0) || true);
      await page.evaluate(() => jm2Pager.turn(1)); await settle(page);
      assert.deepEqual(await currentPage(page), [6, 6], 'wide page shown alone');
      await page.evaluate(() => jm2Pager.turn(1)); await settle(page);
      assert.deepEqual(await currentPage(page), [7, 8]);
      await r.context.close();
    }
    console.log('PASS 双页并排无缝、错开一页开了再关复原、跨页图前后分段、宽图单独显示');

    // 摩尔纹：大图缩到双页大小时按屏幕像素重采样，网点应缩成均匀的灰，不出现明暗波纹。
    {
      const specs = Array.from({length: 4}, (_, n) => ({n, w: 1200, h: 1800, tone: true}));
      const r = await openReader(browser, {count: 4, specs, options: {mode: 'spread-ltr', initial: 0}, viewport: {width: 640, height: 480}});
      const page = r.page;
      await shownAt(page, 0); await page.waitForTimeout(500);
      const measure = async () => {
        const box = (await visiblePages(page)).find(b => b.page === 0);
        const png = await page.screenshot({clip: {x: box.left + 20, y: box.top + 20, width: box.width - 40, height: box.height - 40}});
        return page.evaluate(async data => {
          const img = new Image(); img.src = 'data:image/png;base64,' + data; await img.decode();
          const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
          const g = c.getContext('2d'); g.drawImage(img, 0, 0);
          const px = g.getImageData(0, 0, c.width, c.height).data;
          let sum = 0, sq = 0, n = 0;
          for (let k = 0; k < px.length; k += 4) { const v = px[k]; sum += v; sq += v * v; n++; }
          const mean = sum / n;
          return {mean: Math.round(mean), std: Math.sqrt(sq / n - mean * mean)};
        }, png.toString('base64'));
      };
      const flat = await measure();
      assert(flat.std < 8, 'screentone shrinks to an even grey without moire: std ' + flat.std.toFixed(1) + ', mean ' + flat.mean);
      const surface = await page.evaluate(() => { const c = document.querySelector('.jm2-page[data-page="0"]>canvas'); return c && [c.width, c.getBoundingClientRect().width * devicePixelRatio]; });
      assert(surface && Math.abs(surface[0] - surface[1]) < 2, 'shown at screen resolution: ' + surface);
      await page.evaluate(() => jm2Pager.setInset(240)); await page.waitForTimeout(700);
      const preview = await measure();
      assert(preview.std < 10, 'no moire in the settings preview either: std ' + preview.std.toFixed(1));
      await page.evaluate(() => jm2Pager.setInset(0)); await page.waitForTimeout(500);
      await r.context.close();
    }
    console.log('PASS 大图缩小按屏幕像素重采样，双页和面板预览都没有摩尔纹');

    // 4. 模式来回切换：页码保持，画面落在对应页。
    {
      const r = await openReader(browser, {count: 12, options: {mode: 'horizontal', initial: 5}});
      const page = r.page;
      await shownAt(page, 5);
      for (const [mode, expect] of [['spread-rtl', [4, 5]], ['vertical', [4, 4]], ['rtl', [4, 4]], ['spread-ltr', [4, 5]], ['horizontal', [4, 4]], ['vertical', [4, 4]], ['spread-rtl', [4, 5]]]) {
        await page.evaluate(m => jm2Pager.setMode(m, 1), mode); await settle(page);
        const res = await last(page, 'jm2Mode');
        assert(res.ok && res.mode === mode, mode);
        assert.deepEqual(await currentPage(page), expect, 'switch to ' + mode);
        const v = await visiblePages(page);
        assert(v.some(b => b.page === expect[0]), mode + ' shows page ' + (expect[0] + 1));
      }
      await r.context.close();
    }
    console.log('PASS 模式来回切换页码一致');

    // 5. 条漫：定位、点按滚屏、上方图片加载时不跳。
    {
      const specs = Array.from({length: 10}, (_, n) => ({n, w: 300, h: n % 2 ? 900 : 450}));
      const r = await openReader(browser, {count: 10, specs, options: {mode: 'vertical', initial: 5}, delay: 60});
      const page = r.page;
      await shownAt(page, 5);
      await page.waitForTimeout(500);
      const top5 = await page.evaluate(() => document.querySelector('.jm2-page[data-page="5"]').getBoundingClientRect().top);
      assert(Math.abs(top5) < 2, 'page 6 stays at the top after neighbours load: ' + top5);
      await tapAt(page, 0.9); await page.waitForTimeout(450);
      const moved = await page.evaluate(() => document.getElementById('jm2-scroll').scrollTop);
      assert(moved > 0, 'tap scrolls down');
      await page.evaluate(() => jm2Pager.go(9)); await page.waitForTimeout(300);
      assert.deepEqual(await currentPage(page), [9, 9]);
      await page.evaluate(() => { const s = document.getElementById('jm2-scroll'); s.scrollTop = s.scrollHeight; });
      await page.waitForTimeout(200);
      assert(await page.evaluate(() => !!document.querySelector('.jm2-card')), 'end card present');
      await r.context.close();
    }
    console.log('PASS 条漫定位、点按滚屏、加载补偿');

    // 6. 章节过渡页与自动翻页。
    {
      const r = await openReader(browser, {count: 3, options: {mode: 'horizontal', next: {title: '第 2 话'}, prev: {title: '第 0 话'}}});
      const page = r.page;
      await shownAt(page, 0);
      await page.evaluate(() => jm2Pager.turn(-1)); await settle(page);
      assert(await page.evaluate(() => Array.from(document.querySelectorAll('.jm2-card-sub')).some(n => n.textContent.indexOf('第 0 话') >= 0)));
      await page.evaluate(() => jm2Pager.turn(-1)); await page.waitForTimeout(50);
      assert.equal((await last(page, 'jm2Chapter')).delta, -1, 'previous chapter from the first card');
      await page.evaluate(() => jm2Pager.go(0)); await settle(page);
      await page.evaluate(() => jm2Pager.setAuto(2, 3));
      await page.waitForFunction(() => events.some(e => e.type === 'jm2Page' && e.page === 1), null, {timeout: 4000});
      await page.waitForFunction(() => events.some(e => e.type === 'jm2Auto' && e.reason === 'end'), null, {timeout: 7000});
      assert.deepEqual(await currentPage(page), [2, 2], 'auto stops on the last page');
      await page.evaluate(() => jm2Pager.turn(1)); await settle(page);
      await page.evaluate(() => jm2Pager.turn(1)); await page.waitForTimeout(50);
      assert.equal((await last(page, 'jm2Chapter')).delta, 1, 'next chapter after the end card');
      await r.context.close();
    }
    console.log('PASS 过渡页进出章节、自动翻页到末页停止');

    // 7. 缓存窗口：远处的图会释放，向后预加载按设置进行。
    {
      const r = await openReader(browser, {count: 20, options: {mode: 'horizontal', cache: {keep: 1, ahead: 3}}});
      const page = r.page;
      await shownAt(page, 0); await page.waitForTimeout(400);
      assert.deepEqual(r.stats.requests.slice().sort((a, b) => a - b), [0, 1, 2, 3], 'preloads three ahead');
      await page.evaluate(() => jm2Pager.go(15)); await shownAt(page, 15); await page.waitForTimeout(300);
      const live = await page.evaluate(() => Array.from(document.querySelectorAll('.jm2-page canvas')).length);
      assert(live <= 6, 'old surfaces released: ' + live);
      await r.context.close();
    }
    console.log('PASS 预加载与释放');

    // 双指缩放：放大后单指拖动平移，点侧边翻页时复原。
    {
      const r = await openReader(browser, {count: 4, options: {mode: 'horizontal'}});
      const page = r.page, cdp = await r.context.newCDPSession(page);
      await shownAt(page, 0);
      const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', {type, touchPoints: points.map((p, id) => ({x: p[0], y: p[1], id}))});
      await touch('touchStart', [[170, 320], [230, 320]]);
      for (let i = 1; i <= 6; i++) await touch('touchMove', [[170 - i * 15, 320], [230 + i * 15, 320]]);
      await touch('touchEnd', []);
      const scale = await page.evaluate(() => { const m = /scale\(([\d.]+)\)/.exec(document.querySelector('.jm2-zoom').style.transform); return m ? Number(m[1]) : 1; });
      assert(scale > 2 && scale <= 4, 'pinch zooms in: ' + scale);
      assert.deepEqual(await currentPage(page), [0, 0], 'pinching does not turn the page');
      await touch('touchStart', [[200, 300]]);
      for (let i = 1; i <= 5; i++) await touch('touchMove', [[200 + i * 12, 300]]);
      await touch('touchEnd', []);
      await settle(page);
      assert.deepEqual(await currentPage(page), [0, 0], 'dragging a zoomed page pans instead of turning');
      await tapAt(page, 0.9); await settle(page);
      assert.deepEqual(await currentPage(page), [1, 1]);
      assert.equal(await page.evaluate(() => Array.from(document.querySelectorAll('.jm2-zoom')).filter(z => z.style.transform).length), 0, 'zoom resets after turning');
      await r.context.close();
    }
    console.log('PASS 双指缩放、放大后平移、翻页复原');

    // 8. 本地图包：file:// 页面、按需解压、释放时通知删除、读取失败上报。
    {
      const os = require('node:os'), {pathToFileURL} = require('node:url');
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jm2-engine-local-'));
      try {
        const imgs = await makeImages(browser, Array.from({length: 1}, (_, n) => ({n, w: 260, h: 380, slices: 1})));
        const count = 8, rows = [];
        for (let i = 0; i < count; i++) {
          rows.push('<section class=scramble-page id=page_' + i + '><img id=album_photo_' + i + " data-original='p" + i + ".jpg'></section>");
          fs.writeFileSync(path.join(dir, 'p' + i + '.jpg'), imgs[0].plain);
        }
        fs.writeFileSync(path.join(dir, 'index.html'), "<!doctype html><html><head><meta name=viewport content='width=device-width, initial-scale=1'><meta http-equiv='Content-Security-Policy' content=\"default-src 'none'; img-src file:; style-src 'unsafe-inline'\"><style>body{margin:0}</style></head><body><main id=photo-container>" + rows.join('') + '</main></body></html>');
        const context = await browser.newContext({viewport: {width: 400, height: 640}});
        const page = await context.newPage();
        await page.addInitScript(() => {
          window.events = []; window.extracted = new Set(); window.failPage = -1;
          window.ReactNativeWebView = {postMessage(raw) {
            const msg = JSON.parse(raw); events.push(msg);
            if (msg.type === 'jm2ZipPage') { extracted.add(msg.index); setTimeout(() => jm2Pager.zipPage(msg.index, msg.ticket, msg.index !== failPage), 15); }
            else if (msg.type === 'jm2ZipDrop') extracted.delete(msg.index);
          }};
        });
        await page.addInitScript(`;(${protect})();(${engine})(${JSON.stringify({session: 4, count, mode: 'spread-rtl', initial: 3, offline: true, cache: {keep: 0, ahead: 0}})});`);
        await page.goto(pathToFileURL(path.join(dir, 'index.html')).href);
        await shownAt(page, 2);
        assert.deepEqual(await currentPage(page), [2, 3], 'offline spread restores the saved pair');
        assert.deepEqual(await page.evaluate(() => Array.from(extracted).sort()), [2, 3, 4, 5], 'only current and next pair extracted');
        await page.evaluate(() => { window.failPage = 7; jm2Pager.go(6); });
        await page.waitForFunction(() => events.some(e => e.type === 'jm2ZipError' && e.index === 7), null, {timeout: 6000});
        assert(await page.evaluate(() => !extracted.has(2) && !extracted.has(3)), 'released pages are dropped');
        await page.evaluate(() => { window.failPage = -1; document.querySelector('.jm2-fail').dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, pointerId: 1, clientX: 100, clientY: 300, button: 0, pointerType: 'mouse'})); document.querySelector('.jm2-fail').dispatchEvent(new PointerEvent('pointerup', {bubbles: true, pointerId: 1, clientX: 100, clientY: 300, button: 0, pointerType: 'mouse'})); });
        await shownAt(page, 6);
        await context.close();
      } finally { fs.rmSync(dir, {recursive: true, force: true}); }
    }
    console.log('PASS 本地图包按需解压、释放、失败重试');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
