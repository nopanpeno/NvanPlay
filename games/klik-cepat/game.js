// Klik Cepat. Timer mulai di ketukan pertama. Skor terbaik = ketukan terbanyak.
(function () {
  var DURATION = 10000;
  var KEY = 'klik-cepat:best';

  var tap = document.getElementById('tap');
  var timeEl = document.getElementById('time');
  var countEl = document.getElementById('count');
  var msg = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var again = document.getElementById('again');

  var count, startAt, timer, running;

  function loadBest() {
    try {
      var v = parseInt(localStorage.getItem(KEY), 10);
      return v > 0 ? v : null;
    } catch (e) { return null; }
  }

  function saveBest(n) {
    try { localStorage.setItem(KEY, String(n)); } catch (e) { /* abaikan */ }
  }

  function showBest() {
    var b = loadBest();
    bestEl.textContent = b ? 'Terbaik: ' + b + ' ketukan' : '';
  }

  function showTime(ms) {
    timeEl.textContent = 'Waktu: ' + (ms / 1000).toFixed(1).replace('.', ',');
  }

  function reset() {
    clearInterval(timer);
    count = 0;
    running = false;
    tap.disabled = false;
    tap.textContent = 'Mulai!';
    countEl.textContent = 'Ketukan: 0';
    showTime(DURATION);
    msg.textContent = '';
    again.hidden = true;
    showBest();
  }

  function finish() {
    clearInterval(timer);
    running = false;
    tap.disabled = true;
    showTime(0);
    var best = loadBest();
    var record = !best || count > best;
    if (record) saveBest(count);
    showBest();
    msg.textContent = count + ' ketukan' + (record ? '. Rekor baru!' : '.');
    again.hidden = false;
    again.focus();
  }

  function tick() {
    var left = DURATION - (performance.now() - startAt);
    if (left <= 0) return finish();
    showTime(left);
  }

  tap.addEventListener('click', function () {
    if (!running) {
      running = true;
      startAt = performance.now();
      timer = setInterval(tick, 100);
      tap.textContent = 'Ketuk!';
    }
    count++;
    countEl.textContent = 'Ketukan: ' + count;
  });

  again.addEventListener('click', reset);
  reset();
})();
