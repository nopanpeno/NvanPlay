// Reaksi. Ketuk saat layar hijau. Skor terbaik = milidetik paling kecil.
(function () {
  var KEY = 'reaksi:best';
  var MIN_WAIT = 1500;
  var MAX_WAIT = 4000;

  var pad = document.getElementById('pad');
  var padText = document.getElementById('pad-text');
  var avgEl = document.getElementById('avg');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');

  var state = 'idle';
  var timer = null;
  var goAt = 0;
  var results = [];
  var viaPointer = false;

  function loadBest() {
    try {
      var v = parseInt(window.nvanplayStorage.getItem(KEY), 10);
      return v > 0 ? v : null;
    } catch (e) { return null; }
  }

  function saveBest(n) {
    try { window.nvanplayStorage.setItem(KEY, String(n)); } catch (e) { /* penyimpanan opsional */ }
  }

  function showBest() {
    var b = loadBest();
    bestEl.textContent = b ? 'Terbaik: ' + b + ' ms' : '';
  }

  function showAvg() {
    if (!results.length) { avgEl.textContent = 'Rata-rata: -'; return; }
    var sum = results.reduce(function (a, b) { return a + b; }, 0);
    avgEl.textContent = 'Rata-rata: ' + Math.round(sum / results.length) + ' ms (' + results.length + 'x)';
  }

  function set(next, text, hint) {
    state = next;
    pad.dataset.state = next;
    padText.textContent = '';
    padText.append(text);
    if (hint) {
      var small = document.createElement('small');
      small.textContent = hint;
      padText.append(small);
    }
  }

  function startWait() {
    set('wait', 'Tunggu…');
    msg.textContent = '';
    goAt = 0;
    timer = setTimeout(function () {
      set('go', 'Ketuk!');
      // Ukur dari frame saat hijau benar-benar tampil, bukan dari timer.
      requestAnimationFrame(function () { goAt = performance.now(); });
    }, MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT));
  }

  function press() {
    var now = performance.now();
    if (state === 'wait') {
      clearTimeout(timer);
      set('early', 'Terlalu cepat', 'Ketuk untuk coba lagi');
      msg.textContent = 'Tunggu sampai hijau.';
    } else if (state === 'go') {
      if (!goAt) return; // hijau belum sempat tampil
      var ms = Math.round(now - goAt);
      results.push(ms);
      var best = loadBest();
      var record = !best || ms < best;
      if (record) saveBest(ms);
      showBest();
      showAvg();
      set('result', ms + ' ms', 'Ketuk untuk main lagi');
      msg.textContent = record ? 'Rekor baru!' : '';
    } else {
      startWait();
    }
  }

  // pointerdown lebih cepat daripada click, jadi waktu lebih jujur.
  // click tetap dipakai untuk keyboard dan pembaca layar.
  pad.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    viaPointer = true;
    press();
  });
  pad.addEventListener('click', function () {
    if (viaPointer) { viaPointer = false; return; }
    press();
  });

  showBest();
  showAvg();
})();
