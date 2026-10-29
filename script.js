(function () {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* theme */
    var root = document.documentElement, tb = document.getElementById('theme'), ti = document.getElementById('ti');
    function cur() { return root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') }
    function show() { var d = cur() === 'dark'; ti.textContent = d ? '☀' : '☾'; tb.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme') }
    try { var t = localStorage.getItem('theme'); if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t) } catch (e) { }
    show();
    tb.addEventListener('click', function () {
        var n = cur() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', n); try { localStorage.setItem('theme', n) } catch (e) { }
        show(); document.dispatchEvent(new Event('themechange'));
    });
    var links = [].slice.call(document.querySelectorAll('nav a')), secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')) });
    function spy() { var y = innerHeight * .4, c = -1; secs.forEach(function (e, i) { if (e.getBoundingClientRect().top <= y) c = i }); links.forEach(function (a, i) { a.classList.toggle('on', i === c) }) }
    addEventListener('scroll', spy, { passive: true }); spy();
    /* typing */
    var words = ['Manual testing', 'Test case design', 'Defect reporting', 'Regression testing', 'Selenium automation'], el = document.getElementById('type'), wi = 0, ci = 0, del = false;
    function tick() {
        var w = words[wi];
        if (reduce) { el.textContent = w; wi = (wi + 1) % words.length; setTimeout(tick, 2200); return }
        el.textContent = w.slice(0, ci);
        if (!del && ci === w.length) { del = true; return setTimeout(tick, 1400) }
        if (del && ci === 0) { del = false; wi = (wi + 1) % words.length }
        ci += del ? -1 : 1; setTimeout(tick, del ? 35 : 70);
    }
    tick();
    /* test run */
    var tests = [["TC-01", "Login with valid credentials", "pass"], ["TC-02", "Login rejects wrong password", "pass"], ["TC-03", "Registration blocks empty email", "fail"], ["TC-04", "Submitted answers are saved", "pass"], ["TC-05", "Regression: results page loads", "pass"]];
    var ul = document.getElementById('tests'), count = document.getElementById('count'), go = document.getElementById('go'), pg = document.getElementById('pg'), busy = false;
    function lab(s) { return s === 'pass' ? 'PASS' : s === 'fail' ? 'FAIL' : s === 'run' ? 'RUNNING' : 'PENDING' }
    function draw() { ul.innerHTML = ''; tests.forEach(function (t, i) { var li = document.createElement('li'); li.innerHTML = '<span><code>' + t[0] + '</code>' + t[1] + '</span><span class="st" id="s' + i + '">PENDING</span>'; ul.appendChild(li) }); pg.style.width = '0'; count.textContent = 'running…' }
    function set(i, s) { var e = document.getElementById('s' + i); e.className = 'st ' + s; e.textContent = lab(s) }
    function run() {
        if (busy) return; busy = true; go.disabled = true; draw(); var i = 0, d = reduce ? 0 : 520;
        (function next() {
            if (i >= tests.length) { var f = tests.filter(function (t) { return t[2] === 'fail' }).length; count.textContent = (tests.length - f) + ' passed · ' + f + ' failed'; go.disabled = false; busy = false; return }
            var n = i; set(n, 'run');
            setTimeout(function () { set(n, tests[n][2]); pg.style.width = ((n + 1) / tests.length * 100) + '%'; i++; next() }, d);
        })();
    }
    go.onclick = run; draw(); new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { o.disconnect(); run() } }, { threshold: .5 }).observe(document.getElementById('term'));
    /* scroll progress + timeline */
    var bar = document.getElementById('bar'), tl = document.getElementById('tl');
    addEventListener('scroll', function () {
        var h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
        var r = tl.getBoundingClientRect(); tl.style.setProperty('--h', Math.max(0, Math.min(100, (innerHeight * .8 - r.top) / r.height * 100)) + '%');
    }, { passive: true });
    /* reveal + counters */
    function count_(b) {
        var n = parseFloat(b.dataset.n), d = +b.dataset.d || 0, s = b.dataset.s || '', st = null;
        if (reduce) { b.textContent = n.toFixed(d) + s; return }
        (function f(ts) { st = st || ts; var p = Math.min((ts - st) / 1200, 1); b.textContent = (n * (1 - Math.pow(1 - p, 3))).toFixed(d) + s; if (p < 1) requestAnimationFrame(f) })(performance.now());
    }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); e.target.querySelectorAll('[data-n]').forEach(count_); io.unobserve(e.target) } }) }, { threshold: .15 });
    document.querySelectorAll('.rv').forEach(function (x, i) { x.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(x) });
    /* card glow + tilt */
    document.querySelectorAll('.card').forEach(function (c) {
        c.addEventListener('mousemove', function (e) {
            var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
            c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
            if (c.classList.contains('tilt') && !reduce) c.style.transform = 'perspective(900px) rotateY(' + ((x / r.width - .5) * 7) + 'deg) rotateX(' + ((.5 - y / r.height) * 7) + 'deg) translateY(-4px)';
        });
        c.addEventListener('mouseleave', function () { c.style.transform = '' });
    });
    var hero = document.querySelector('.hero'), pt = document.getElementById('pt');
    if (!reduce) hero.addEventListener('mousemove', function (e) { var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; document.querySelector('.b1').style.translate = (x * 50) + 'px ' + (y * 40) + 'px'; document.querySelector('.b2').style.translate = (-x * 60) + 'px ' + (-y * 40) + 'px'; pt.style.rotate = (x * 3) + 'deg' });
})();
(function () {
    var c = document.getElementById('bg'), x = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var toks = ['PASS', 'FAIL', 'assert', '200 OK', '404', '{ }', '</>', 'TC-01', '===', 'null', 'true', 'login()', 'verify()', 'SELECT *', 'bug', 'QA', 'git diff', 'if (ok)', 'expect()', '@Test', '500', 'v1.0.2'];
    var fs = 15, W, H, cols, ys, tk, sp, C = {};
    function colors() { var g = getComputedStyle(document.documentElement);['--muted', '--ok', '--fail', '--b'].forEach(function (k) { C[k] = g.getPropertyValue(k).trim() || '#888' }) }
    function size() {
        var d = devicePixelRatio || 1; W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); cols = Math.ceil(W / 92); ys = []; tk = []; sp = [];
        for (var i = 0; i < cols; i++) { ys.push(Math.random() * H); sp.push(.35 + Math.random() * .6); var t = []; for (var k = 0; k < 7; k++)t.push(toks[Math.floor(Math.random() * toks.length)]); tk.push(t) }
    }
    function draw() {
        x.clearRect(0, 0, W, H); x.font = '500 ' + fs + 'px "IBM Plex Mono",ui-monospace,monospace';
        for (var i = 0; i < cols; i++) {
            for (var k = 0; k < 7; k++) {
                var y = ys[i] - k * 26, t = tk[i][k]; if (y < -20 || y > H + 20) continue;
                x.fillStyle = t === 'PASS' || t === '200 OK' ? C['--ok'] : (t === 'FAIL' || t === '404' || t === '500' || t === 'bug') ? C['--fail'] : C['--muted'];
                x.globalAlpha = (k === 0 ? .34 : .2) * (1 - k / 8); x.fillText(t, i * 92 + 8, y);
            }
        }
        x.globalAlpha = 1;
    }
    var last = 0;
    function loop(ts) {
        if (!document.hidden && ts - last > 45) { last = ts; for (var i = 0; i < cols; i++) { ys[i] += sp[i] * 2.2; if (ys[i] - 7 * 26 > H) { ys[i] = -20; sp[i] = .35 + Math.random() * .6; tk[i][0] = toks[Math.floor(Math.random() * toks.length)] } } draw() }
        requestAnimationFrame(loop);
    }
    colors(); size(); draw();
    addEventListener('resize', function () { size(); draw() });
    document.addEventListener('themechange', function () { colors(); draw() });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { setTimeout(function () { colors(); draw() }, 50) });
    if (!reduce) requestAnimationFrame(loop);
})();