// Tumpuk Kontainer: kontainer geser di atas. Ketuk untuk jatuhin ke tumpukan.
// Kontainer ikut miring pas geser. Jatuhin pas hampir rata.
// Meleset sama sekali atau kemiringan kebanyakan = game over.
(function () {
  var W = 340, H = 440, GROUND = 400;
  var SIZE = 40;               // sisi kontainer (persegi: lebar = tinggi)
  var GAP = 2;                 // jarak antar tingkat
  var BH = SIZE + GAP;         // jarak antar tingkat di layar
  var BW = SIZE;               // lebar kontainer
  var CRANE_Y = 40;
  var TICK = 16, SWING = 2.2, FALL = 6;
  var TILT_MAX = 0.45;    // miring maksimal saat geser (radian, sekitar 26 derajat)
  var TILT_OK = 0.15;     // miring yang masih aman saat jatuh (sekitar 9 derajat)
  var TILT_SPEED = 0.05;  // kecepatan ayunan miring
  var COLORS = ['#e5483a', '#2f6fed', '#2e9a55', '#f5b700', '#8b5cf6'];
  var KEY = 'tumpuk-kontainer:best';
  var canvas = document.getElementById('field');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msgEl = document.getElementById('msg');
  var startBtn = document.getElementById('start');

  var stack = [], swing = null, falling = null, running = false, timer = null, score = 0;

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

  // Kontainer baru di atas. Fase acak biar miringnya beda tiap kali.
  function newSwing() {
    return { x: 0, w: BW, c: randColor(), dir: 1, ph: Math.random() * Math.PI * 2 };
  }

  // Sudut miring sekarang, dari fase ayunan.
  function tiltOf(s) {
    return Math.sin(s.ph) * TILT_MAX;
  }

  // Kamera naik pelan kalau tumpukan sudah tinggi.
  function camOffset() {
    return Math.max(0, stack.length * BH - 270);
  }

  function topScreenY() {
    return GROUND - stack.length * BH + camOffset();
  }

  // angle (radian) = kemiringan, diputar dari tengah kotak.
  function drawBlock(x, y, w, c, angle) {
    ctx.save();
    ctx.translate(x + w / 2, y + SIZE / 2);
    ctx.rotate(angle || 0);
    ctx.fillStyle = COLORS[c];
    ctx.fillRect(-w / 2, -SIZE / 2, w, SIZE);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2, -SIZE / 2, w, SIZE);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#eef2fa';
    ctx.fillRect(0, GROUND + camOffset(), W, H);
    var cam = camOffset();
    stack.forEach(function (b, i) {
      drawBlock(b.x, GROUND - (i + 1) * BH + cam, b.w, b.c);
    });
    if (falling) {
      drawBlock(falling.x, falling.y, falling.w, falling.c, falling.angle);
    } else if (swing) {
      drawBlock(swing.x, CRANE_Y, swing.w, swing.c, tiltOf(swing));
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
    if (Math.abs(falling.angle) > TILT_OK) {
      gameOver('Kotaknya miring!');
      return;
    }
    var top = stack[stack.length - 1];
    var lo = Math.max(falling.x, top.x);
    var hi = Math.min(falling.x + falling.w, top.x + top.w);
    if (hi - lo <= 0) {
      gameOver('Meleset!');
      return;
    }
    stack.push({ x: falling.x, w: falling.w, c: falling.c });
    falling = null;
    score = stack.length - 1;
    showScore();
    recordScore();
    msgEl.textContent = '';
    swing = newSwing();
  }

  function tick() {
    if (!running) return;
    if (falling) {
      falling.y += FALL;
      // Posisi tepat tingkat berikutnya, sesuai tempat blok itu digambar.
      var target = topScreenY() - BH;
      if (falling.y >= target) {
        falling.y = target;
        land();
      }
    } else if (swing) {
      swing.ph += TILT_SPEED;
      swing.x += SWING * swing.dir;
      if (swing.x <= 0) { swing.x = 0; swing.dir = 1; }
      if (swing.x >= W - swing.w) { swing.x = W - swing.w; swing.dir = -1; }
    }
    draw();
  }

  function drop() {
    if (!running || falling || !swing) return;
    falling = { x: swing.x, w: swing.w, c: swing.c, y: CRANE_Y, angle: tiltOf(swing) };
    swing = null;
  }

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    drop();
  });

  function start() {
    stack = [{ x: (W - BW) / 2, w: BW, c: randColor() }];
    swing = newSwing();
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
