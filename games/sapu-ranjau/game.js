// Sapu Ranjau 10x10 dengan 12 ranjau. Klik pertama selalu aman (beserta sekelilingnya).
// Bendera: tombol "Mode bendera", klik kanan, atau tombol F saat kotak difokus.
// Rekor = waktu menang tercepat (detik); makin kecil makin baik.
(function () {
  'use strict';
  var SIZE = 10;
  var MINES = 12;
  var KEY = 'sapu-ranjau:best';

  var boardEl = document.getElementById('board');
  var minesEl = document.getElementById('mines');
  var timerEl = document.getElementById('timer');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');
  var flagBtn = document.getElementById('flag-mode');
  var again = document.getElementById('again');

  var cells = [];
  var mine, count, opened, flagged, started, over, flagMode, startedAt, timer, opens;

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
    bestEl.textContent = b ? 'Rekor: ' + b + ' d' : '';
  }

  function idx(r, c) { return r * SIZE + c; }
  function neighbors(i) {
    var r = Math.floor(i / SIZE), c = i % SIZE, out = [];
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(idx(nr, nc));
      }
    }
    return out;
  }

  function label(i) {
    var r = Math.floor(i / SIZE) + 1, c = (i % SIZE) + 1;
    var where = 'Baris ' + r + ' kolom ' + c + ', ';
    if (opened[i]) return where + (mine[i] ? 'ranjau' : (count[i] ? count[i] + ' ranjau di sekeliling' : 'kosong'));
    if (flagged[i]) return where + 'diberi bendera';
    return where + 'tertutup';
  }

  function paint(i) {
    var b = cells[i];
    b.className = 'cell';
    b.textContent = '';
    if (opened[i]) {
      b.classList.add('open');
      if (mine[i]) { b.classList.add('mine'); b.textContent = '💣'; }
      else if (count[i]) { b.classList.add('n' + Math.min(count[i], 4)); b.textContent = String(count[i]); }
    } else if (flagged[i]) {
      b.textContent = '🚩';
    }
    b.setAttribute('aria-label', label(i));
  }

  function updateMines() {
    minesEl.textContent = 'Ranjau: ' + (MINES - flagged.filter(Boolean).length);
  }

  function elapsed() { return Math.floor((Date.now() - startedAt) / 1000); }
  function tick() { timerEl.textContent = 'Waktu: ' + elapsed() + ' d'; }

  function placeMines(safe) {
    var banned = {};
    banned[safe] = true;
    neighbors(safe).forEach(function (n) { banned[n] = true; });
    var pool = [];
    for (var i = 0; i < SIZE * SIZE; i++) if (!banned[i]) pool.push(i);
    for (var k = 0; k < MINES; k++) {
      var j = k + Math.floor(Math.random() * (pool.length - k));
      var t = pool[k]; pool[k] = pool[j]; pool[j] = t;
      mine[pool[k]] = true;
    }
    for (var m = 0; m < SIZE * SIZE; m++) {
      count[m] = neighbors(m).filter(function (n) { return mine[n]; }).length;
    }
  }

  function flood(start) {
    var stack = [start];
    while (stack.length) {
      var i = stack.pop();
      if (opened[i] || flagged[i]) continue;
      opened[i] = true;
      opens++;
      paint(i);
      if (!count[i]) neighbors(i).forEach(function (n) { if (!opened[n]) stack.push(n); });
    }
  }

  function finish(won) {
    over = true;
    clearInterval(timer);
    var secs = Math.max(1, elapsed());
    timerEl.textContent = 'Waktu: ' + secs + ' d';
    for (var i = 0; i < SIZE * SIZE; i++) {
      cells[i].disabled = true;
      if (mine[i] && !flagged[i]) { opened[i] = true; paint(i); }
      else if (!mine[i] && flagged[i]) { paint(i); cells[i].classList.add('wrong'); cells[i].textContent = '✖'; }
    }
    if (won) {
      var best = loadBest();
      if (!best || secs < best) {
        saveBest(secs);
        showBest();
        msg.textContent = best ? 'Menang! Rekor baru: ' + secs + ' detik.' : 'Menang dalam ' + secs + ' detik!';
      } else {
        msg.textContent = 'Menang dalam ' + secs + ' detik.';
      }
    } else {
      msg.textContent = 'Kena ranjau! Coba lagi.';
    }
  }

  function toggleFlag(i) {
    if (over || opened[i]) return;
    flagged[i] = !flagged[i];
    paint(i);
    updateMines();
  }

  function open(i) {
    if (over || opened[i] || flagged[i]) return;
    if (!started) {
      started = true;
      placeMines(i);
      startedAt = Date.now();
      timer = setInterval(tick, 250);
      msg.textContent = 'Hati-hati.';
    }
    if (mine[i]) {
      opened[i] = true;
      paint(i);
      finish(false);
      return;
    }
    flood(i);
    if (opens === SIZE * SIZE - MINES) finish(true);
  }

  function press(i) {
    if (flagMode) toggleFlag(i); else open(i);
  }

  function setFlagMode(on) {
    flagMode = on;
    flagBtn.setAttribute('aria-pressed', String(on));
  }

  function newGame() {
    clearInterval(timer);
    mine = new Array(SIZE * SIZE).fill(false);
    count = new Array(SIZE * SIZE).fill(0);
    opened = new Array(SIZE * SIZE).fill(false);
    flagged = new Array(SIZE * SIZE).fill(false);
    started = false; over = false; opens = 0;
    setFlagMode(false);
    timerEl.textContent = 'Waktu: 0 d';
    msg.textContent = 'Ketuk kotak untuk mulai.';
    for (var i = 0; i < SIZE * SIZE; i++) { cells[i].disabled = false; paint(i); }
    updateMines();
    showBest();
  }

  function build() {
    for (var i = 0; i < SIZE * SIZE; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cell';
        b.addEventListener('click', function () { press(n); });
        b.addEventListener('contextmenu', function (e) { e.preventDefault(); toggleFlag(n); });
        b.addEventListener('keydown', function (e) {
          if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFlag(n); }
        });
        boardEl.appendChild(b);
        cells.push(b);
      })(i);
    }
  }

  flagBtn.addEventListener('click', function () { setFlagMode(!flagMode); });
  again.addEventListener('click', newGame);
  build();
  newGame();
})();
