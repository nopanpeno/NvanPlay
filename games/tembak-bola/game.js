// Tembak Bola: bola jalan ke kanan. Tembak warna sama 3 atau lebih untuk hapus.
(function () {
  var W = 340, R = 14, STEP = 28, TICK = 50;
  var COLORS = ['#e5483a', '#2f6fed', '#2e9a55'];
  var KEY = 'tembak-bola:best';
  var canvas = document.getElementById('lane');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msgEl = document.getElementById('msg');
  var pickEl = document.getElementById('colors');
  var startBtn = document.getElementById('start');
  var items = [], offset = 0, score = 0, running = false, current = 0, timer = null;

  function loadBest() {
    try {
      var value = parseInt(window.nvanplayStorage.getItem(KEY), 10);
      return value > 0 ? value : null;
    } catch (e) { return null; }
  }

  function showBest() {
    var best = loadBest();
    bestEl.textContent = best ? 'Rekor: ' + best : '';
  }

  function recordScore() {
    var best = loadBest();
    if (!best || score > best) {
      try { window.nvanplayStorage.setItem(KEY, String(score)); } catch (e) { /* penyimpanan opsional */ }
      showBest();
    }
  }

  function showScore() {
    scoreEl.textContent = 'Skor: ' + score;
  }

  function speed() {
    return 1.2 + Math.min(score, 40) / 25;
  }

  function draw() {
    ctx.clearRect(0, 0, W, canvas.height);
    ctx.fillStyle = '#c43c30';
    ctx.fillRect(W - 4, 0, 4, canvas.height);
    items.forEach(function (c, i) {
      var x = R + offset + i * STEP;
      if (x < -R || x > W + R) return;
      ctx.beginPath();
      ctx.arc(x, canvas.height / 2, R, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[c];
      ctx.fill();
    });
  }

  function reachedEnd() {
    if (!items.length) return false;
    var tail = R + offset + (items.length - 1) * STEP;
    return tail + R >= W;
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    recordScore();
    msgEl.textContent = 'Bola sampai ujung! Skor kamu ' + score + '.';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
  }

  function insertAt(k, c) {
    items.splice(k, 0, c);
    var l = k, r = k;
    while (l > 0 && items[l - 1] === c) l--;
    while (r < items.length - 1 && items[r + 1] === c) r++;
    if (r - l + 1 >= 3) {
      items.splice(l, r - l + 1);
      score += r - l + 1;
      showScore();
      recordScore();
      msgEl.textContent = '';
    }
  }

  function tick() {
    if (!running) return;
    offset += speed();
    while (offset >= STEP) {
      offset -= STEP;
      items.unshift(Math.floor(Math.random() * COLORS.length));
    }
    draw();
    if (reachedEnd()) gameOver();
  }

  canvas.addEventListener('click', function (e) {
    if (!running) return;
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) * W / rect.width;
    var k = Math.round((x - R - offset) / STEP);
    k = Math.max(0, Math.min(items.length, k));
    insertAt(k, current);
    draw();
    if (reachedEnd()) gameOver();
  });

  function buildPicker() {
    pickEl.replaceChildren();
    COLORS.forEach(function (color, i) {
      var button = document.createElement('button');
      button.type = 'button';
      button.style.background = color;
      button.setAttribute('aria-label', 'Warna ' + (i + 1));
      button.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      button.addEventListener('click', function () {
        current = i;
        pickEl.querySelectorAll('button').forEach(function (b, j) {
          b.setAttribute('aria-pressed', j === current ? 'true' : 'false');
        });
      });
      pickEl.appendChild(button);
    });
  }

  function start() {
    items = [];
    offset = 0;
    score = 0;
    running = true;
    showScore();
    msgEl.textContent = '';
    startBtn.hidden = true;
    clearInterval(timer);
    timer = setInterval(tick, TICK);
    draw();
  }

  startBtn.addEventListener('click', start);
  buildPicker();
  showScore();
  showBest();
  draw();
})();
