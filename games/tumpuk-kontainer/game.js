// Tumpuk Kontainer: kontainer geser di atas. Ketuk untuk jatuhin ke tumpukan.
// Meleset sama sekali = game over.
(function () {
  var W = 340, H = 440, GROUND = 400, BH = 24, BW = 200, CRANE_Y = 40;
  var TICK = 16, SWING = 2.2, FALL = 6;
  var COLORS = ['#e5483a', '#2f6fed', '#2e9a55', '#f5b700', '#8b5cf6'];
  var KEY = 'tumpuk-kontainer:best';
  var canvas = document.getElementById('field');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msgEl = document.getElementById('msg');
  var startBtn = document.getElementById('start');

  var MIN_W = 8;
  var stack = [], debris = [], swing = null, falling = null, running = false, timer = null, score = 0;

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

  function randColor() {
    return Math.floor(Math.random() * COLORS.length);
  }

  // Kamera naik pelan kalau tumpukan sudah tinggi.
  function camOffset() {
    return Math.max(0, stack.length * BH - 270);
  }

  function topScreenY() {
    return GROUND - stack.length * BH + camOffset();
  }

  function drawBlock(x, y, w, c) {
    ctx.fillStyle = COLORS[c];
    ctx.fillRect(x, y, w, BH - 2);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, BH - 2);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#eef2fa';
    ctx.fillRect(0, GROUND + camOffset(), W, H);
    var cam = camOffset();
    stack.forEach(function (b, i) {
      drawBlock(b.x, GROUND - (i + 1) * BH + cam, b.w, b.c);
    });
    debris.forEach(function (d) {
      drawBlock(d.x, d.y, d.w, d.c);
    });
    if (falling) {
      drawBlock(falling.x, falling.y, falling.w, falling.c);
    } else if (swing) {
      drawBlock(swing.x, CRANE_Y, swing.w, swing.c);
    }
  }

  function gameOver(text) {
    running = false;
    clearInterval(timer);
    recordScore();
    msgEl.textContent = text + ' Skor kamu ' + score + '.';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
    draw();
  }

  function land() {
    var top = stack[stack.length - 1];
    var fx = falling.x, fw = falling.w;
    var lo = Math.max(fx, top.x);
    var hi = Math.min(fx + fw, top.x + top.w);
    if (hi - lo <= 0) {
      gameOver('Meleset!');
      return;
    }
    // Bagian yang tidak nempel jatuh sebagai sisa potongan.
    if (lo > fx) debris.push({ x: fx, y: falling.y, w: lo - fx, vy: 0, c: falling.c });
    if (hi < fx + fw) debris.push({ x: hi, y: falling.y, w: fx + fw - hi, vy: 0, c: falling.c });
    stack.push({ x: lo, w: hi - lo, c: falling.c });
    falling = null;
    score = stack.length - 1;
    showScore();
    recordScore();
    if (hi - lo < MIN_W) {
      gameOver('Kontainer habis!');
      return;
    }
    msgEl.textContent = '';
    swing = { x: 0, w: hi - lo, c: randColor(), dir: 1 };
  }

  function tick() {
    if (!running) return;
    debris = debris.filter(function (d) {
      d.vy += 0.6;
      d.y += d.vy;
      return d.y < H;
    });
    if (falling) {
      falling.y += FALL;
      if (falling.y + BH - 2 >= topScreenY()) {
        falling.y = topScreenY() - (BH - 2);
        land();
      }
    } else if (swing) {
      swing.x += SWING * swing.dir;
      if (swing.x <= 0) { swing.x = 0; swing.dir = 1; }
      if (swing.x >= W - swing.w) { swing.x = W - swing.w; swing.dir = -1; }
    }
    draw();
  }

  function drop() {
    if (!running || falling || !swing) return;
    falling = { x: swing.x, w: swing.w, c: swing.c, y: CRANE_Y };
    swing = null;
  }

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    drop();
  });

  function start() {
    stack = [{ x: (W - BW) / 2, w: BW, c: randColor() }];
    debris = [];
    swing = { x: 0, w: BW, c: randColor(), dir: 1 };
    falling = null;
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
  showScore();
  showBest();
  stack = [{ x: (W - BW) / 2, w: BW, c: 0 }];
  draw();
})();
