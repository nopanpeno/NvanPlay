// Terbang Pesawat. Ketuk atau Spasi untuk naik, lepas untuk turun.
// Lewati celah antar gedung. Skor = jumlah gedung yang terlewati. Rekor = skor terbaik.
(function () {
  var W = 480, H = 360;
  var KEY = 'terbang-pesawat:best';
  var GRAVITY = 0.3;
  var LIFT = -5.6;
  var SPEED = 2.6;
  var GAP = 110;
  var PILLAR_W = 44;
  var SPAWN_EVERY = 95; // frame
  var PLANE_X = 90;
  var PLANE_W = 40;
  var PLANE_H = 22;

  var canvas = document.getElementById('arena');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');
  var startBtn = document.getElementById('start');

  var plane = null;
  var pillars = [];
  var score = 0;
  var frame = 0;
  var running = false;
  var raf = 0;

  function loadBest() {
    try {
      var v = parseInt(window.nvanplayStorage.getItem(KEY), 10);
      return v > 0 ? v : null;
    } catch (e) { return null; }
  }

  function saveBest(n) {
    try { window.nvanplayStorage.setItem(KEY, String(n)); } catch (e) { /* abaikan */ }
  }

  function showBest() {
    var b = loadBest();
    bestEl.textContent = b ? 'Terbaik: ' + b : '';
  }

  // Pesawat sederhana: badan, hidung, ekor, sayap, dan jendela.
  function drawPlane() {
    var x = PLANE_X, y = plane.y;
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(x, y + 8, 34, 10);
    ctx.beginPath();
    ctx.moveTo(x + 34, y + 8);
    ctx.lineTo(x + 40, y + 13);
    ctx.lineTo(x + 34, y + 18);
    ctx.fill();
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(x, y + 4, 6, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 12, y + 16, 12, 5);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(x + 22, y + 10, 6, 4);
  }

  // Gedung: badan berwarna, atap di tepi celah, dan jendela.
  var BUILDING_COLORS = ['#64748b', '#0ea5e9', '#f59e0b', '#8b5cf6'];

  function drawBuilding(x, y, w, h, color, capAtBottom) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(x, capAtBottom ? y : y + h - 6, 6, 6);
    ctx.fillStyle = '#fef08a';
    for (var wy = y + 10; wy < y + h - 12; wy += 16) {
      for (var wx = x + 10; wx < x + w - 12; wx += 14) {
        ctx.fillRect(wx, wy, 6, 8);
      }
    }
  }

  function drawPillars() {
    pillars.forEach(function (p, i) {
      var color = BUILDING_COLORS[i % BUILDING_COLORS.length];
      // Gedung atas: dari langit-langit sampai tepi bawah celah.
      drawBuilding(p.x, 0, PILLAR_W, p.top, color, false);
      // Gedung bawah: dari tepi atas celah sampai tanah.
      drawBuilding(p.x, p.top + GAP, PILLAR_W, H - 8 - (p.top + GAP), color, true);
      // Atap kecil di kedua tepi celah.
      ctx.fillStyle = '#334155';
      ctx.fillRect(p.x - 4, p.top - 10, PILLAR_W + 8, 10);
      ctx.fillRect(p.x - 4, p.top + GAP, PILLAR_W + 8, 10);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#bfe9ff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#86d37a';
    ctx.fillRect(0, H - 8, W, 8);
    drawPillars();
    if (plane) drawPlane();
  }

  function hit() {
    var py = plane.y;
    return pillars.some(function (p) {
      var overlapX = PLANE_X + PLANE_W > p.x && PLANE_X < p.x + PILLAR_W;
      var inGap = py > p.top && py + PLANE_H < p.top + GAP;
      return overlapX && !inGap;
    });
  }

  function update() {
    plane.vy += GRAVITY;
    plane.y += plane.vy;
    frame++;
    if (frame % SPAWN_EVERY === 0) {
      var top = 30 + Math.random() * (H - GAP - 60);
      pillars.push({ x: W, top: top, passed: false });
    }
    pillars.forEach(function (p) {
      p.x -= SPEED;
      if (!p.passed && p.x + PILLAR_W < PLANE_X) {
        p.passed = true;
        score++;
        scoreEl.textContent = 'Skor: ' + score;
      }
    });
    while (pillars.length && pillars[0].x + PILLAR_W < 0) pillars.shift();
    if (plane.y < 0 || plane.y + PLANE_H > H - 8 || hit()) crash();
  }

  function crash() {
    running = false;
    cancelAnimationFrame(raf);
    draw();
    var best = loadBest();
    var record = score > 0 && (!best || score > best);
    if (record) saveBest(score);
    showBest();
    msg.textContent = 'Nabrak! Skor ' + score + '.' + (record ? ' Rekor baru!' : '');
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
  }

  function loop() {
    if (!running) return;
    update();
    if (!running) return;
    draw();
    raf = requestAnimationFrame(loop);
  }

  function flap() {
    if (running) plane.vy = LIFT;
  }

  function start() {
    if (running) return;
    plane = { y: H / 2 - PLANE_H / 2, vy: 0 };
    pillars = [];
    score = 0;
    frame = 0;
    scoreEl.textContent = 'Skor: 0';
    msg.textContent = '';
    running = true;
    startBtn.hidden = true;
    flap();
    raf = requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (running) flap(); else start();
  });

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (running) flap(); else start();
    }
  });

  startBtn.addEventListener('click', start);

  plane = { y: H / 2 - PLANE_H / 2, vy: 0 };
  draw();
  showBest();
})();
