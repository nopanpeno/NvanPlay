// Blok Susun (mirip Tetris). Dibangun bertahap.
// Step 1: papan, 7 bentuk jatuh, geser kiri/kanan/turun, kunci di dasar, game over.
// Step 2: putar blok searah jarum jam, geser otomatis dari dinding.
// Step 3: hapus baris penuh, skor, hitung baris.
// Step 4: level (tiap 10 baris, jatuh makin cepat), drop keras, blok berikutnya.
// Step 5: rekor tersimpan (blok-susun:best), kontrol sentuh di papan.
// Sentuh: geser kiri/kanan = pindah kolom, ketuk = putar, geser cepat ke bawah = jatuhkan.
// Step 6: bayangan blok dan pita ke bawah, supaya mudah membidik tempat mendarat.
(function () {
  var COLS = 10;
  var ROWS = 20;
  var CELL = 24;
  var START_DROP_MS = 600;   // jeda jatuh di level 1
  var FASTER_MS = 50;        // makin cepat tiap level
  var MIN_DROP_MS = 100;     // batas tercepat
  var LINES_PER_LEVEL = 10;
  var KEY = 'blok-susun:best';
  // Poin menurut jumlah baris yang dihapus sekaligus (0 sampai 4).
  var POINTS = [0, 100, 300, 500, 800];

  // Tiap bentuk: daftar kotak [x, y] relatif ke pojok kiri atas.
  // size = sisi kotak putar. 0 = tidak berputar (bentuk O).
  var SHAPES = [
    { color: '#2bb3c0', size: 4, cells: [[0,1],[1,1],[2,1],[3,1]] }, // I
    { color: '#e5c53a', size: 0, cells: [[1,0],[2,0],[1,1],[2,1]] }, // O
    { color: '#9b59d0', size: 3, cells: [[1,0],[0,1],[1,1],[2,1]] }, // T
    { color: '#4caf50', size: 3, cells: [[1,0],[2,0],[0,1],[1,1]] }, // S
    { color: '#e5483a', size: 3, cells: [[0,0],[1,0],[1,1],[2,1]] }, // Z
    { color: '#2f6fed', size: 3, cells: [[0,0],[0,1],[1,1],[2,1]] }, // J
    { color: '#f08a24', size: 3, cells: [[2,0],[0,1],[1,1],[2,1]] }  // L
  ];

  var canvas = document.getElementById('arena');
  var ctx = canvas.getContext('2d');
  var msg = document.getElementById('msg');
  var startBtn = document.getElementById('start');
  var scoreEl = document.getElementById('score');
  var linesEl = document.getElementById('lines');
  var levelEl = document.getElementById('level');
  var bestEl = document.getElementById('best');
  var nextCtx = document.getElementById('next').getContext('2d');

  var grid;      // grid[y][x] = warna kotak terkunci, atau null
  var piece;     // { color, cells, x, y }
  var score = 0;
  var lines = 0;
  var level = 1;
  var best = 0;
  var upcoming;  // bentuk yang keluar berikutnya
  var running = false;
  var timer = 0;

  function emptyGrid() {
    var g = [];
    for (var y = 0; y < ROWS; y++) {
      g.push([]);
      for (var x = 0; x < COLS; x++) g[y].push(null);
    }
    return g;
  }

  function fits(cells, px, py) {
    for (var i = 0; i < cells.length; i++) {
      var x = px + cells[i][0];
      var y = py + cells[i][1];
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && grid[y][x]) return false;
    }
    return true;
  }

  function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }

  function spawn() {
    var shape = upcoming || randomShape();
    upcoming = randomShape();
    drawNext();
    piece = { color: shape.color, size: shape.size, cells: shape.cells, x: 3, y: 0 };
    if (!fits(piece.cells, piece.x, piece.y)) gameOver();
  }

  function lockPiece() {
    piece.cells.forEach(function (c) {
      grid[piece.y + c[1]][piece.x + c[0]] = piece.color;
    });
    clearLines();
    spawn();
  }

  // Hapus baris yang penuh, turunkan sisanya, tambah skor.
  function clearLines() {
    var cleared = 0;
    var y = ROWS - 1;
    while (y >= 0) {
      if (grid[y].every(Boolean)) {
        grid.splice(y, 1);
        grid.unshift(emptyGrid()[0]);
        cleared++;
      } else {
        y--;
      }
    }
    if (!cleared) return;
    lines += cleared;
    score += POINTS[cleared];
    var newLevel = Math.floor(lines / LINES_PER_LEVEL) + 1;
    if (newLevel > level) {
      level = newLevel;
      restartTimer();
    }
    showStats();
  }

  function showStats() {
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelEl.textContent = level;
  }

  function dropDelay() {
    return Math.max(MIN_DROP_MS, START_DROP_MS - (level - 1) * FASTER_MS);
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(tick, dropDelay());
  }

  // Jatuhkan blok langsung ke dasar dan kunci.
  function hardDrop() {
    if (!running) return;
    while (fits(piece.cells, piece.x, piece.y + 1)) piece.y++;
    lockPiece();
    if (running) {
      draw();
      restartTimer();
    }
  }

  // Pratinjau blok berikutnya.
  function drawNext() {
    nextCtx.clearRect(0, 0, 80, 40);
    if (!upcoming) return;
    nextCtx.fillStyle = upcoming.color;
    upcoming.cells.forEach(function (c) {
      nextCtx.fillRect(c[0] * 20 + 1, c[1] * 20 + 1, 18, 18);
    });
  }

  function move(dx, dy) {
    if (!running) return false;
    if (fits(piece.cells, piece.x + dx, piece.y + dy)) {
      piece.x += dx;
      piece.y += dy;
      draw();
      return true;
    }
    return false;
  }

  // Putar 90 derajat searah jarum jam. Coba geser samping kalau menabrak.
  function rotate() {
    if (!running || !piece.size) return;
    var n = piece.size;
    var turned = piece.cells.map(function (c) { return [n - 1 - c[1], c[0]]; });
    var kicks = [0, -1, 1, -2, 2];
    for (var i = 0; i < kicks.length; i++) {
      if (fits(turned, piece.x + kicks[i], piece.y)) {
        piece.cells = turned;
        piece.x += kicks[i];
        draw();
        return;
      }
    }
  }

  function tick() {
    if (!move(0, 1)) {
      lockPiece();
      if (running) draw();
    }
  }

  // Baris tempat blok akan mendarat kalau dijatuhkan sekarang.
  function landingY() {
    var y = piece.y;
    while (fits(piece.cells, piece.x, y + 1)) y++;
    return y;
  }

  // Pita tipis di kolom blok, dan garis tepi di tempat mendarat.
  function drawGuide() {
    var gy = landingY();
    var lowest = {};  // kolom -> kotak paling bawah blok di kolom itu
    piece.cells.forEach(function (c) {
      if (!(c[0] in lowest) || c[1] > lowest[c[0]]) lowest[c[0]] = c[1];
    });
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = piece.color;
    Object.keys(lowest).forEach(function (k) {
      var x = piece.x + Number(k);
      for (var y = piece.y + lowest[k] + 1; y <= gy + lowest[k]; y++) {
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      }
    });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = piece.color;
    ctx.lineWidth = 2;
    piece.cells.forEach(function (c) {
      ctx.strokeRect((piece.x + c[0]) * CELL + 2, (gy + c[1]) * CELL + 2, CELL - 4, CELL - 4);
    });
  }

  function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (grid[y][x]) drawCell(x, y, grid[y][x]);
      }
    }
    if (piece && running) {
      drawGuide();
      piece.cells.forEach(function (c) {
        drawCell(piece.x + c[0], piece.y + c[1], piece.color);
      });
    }
  }

  function loadBest() {
    try {
      var v = parseInt(window.nvanplayStorage.getItem(KEY), 10);
      return v > 0 ? v : 0;
    } catch (e) { return 0; }
  }

  function saveBest(n) {
    try { window.nvanplayStorage.setItem(KEY, String(n)); } catch (e) { /* abaikan */ }
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    startBtn.disabled = false;
    startBtn.textContent = 'Main lagi';
    msg.textContent = 'Tumpukan penuh. Skor akhir: ' + score + '.';
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      saveBest(best);
      msg.textContent += ' Rekor baru!';
    }
    draw();
  }

  function start() {
    clearInterval(timer);
    grid = emptyGrid();
    score = 0;
    lines = 0;
    level = 1;
    upcoming = null;
    showStats();
    running = true;
    startBtn.disabled = true;
    msg.textContent = 'Panah atau sentuh papan: geser, ketuk putar, geser bawah jatuhkan.';
    spawn();
    draw();
    if (running) restartTimer();
  }

  startBtn.addEventListener('click', start);
  document.getElementById('drop').addEventListener('click', hardDrop);
  document.getElementById('rotate').addEventListener('click', rotate);
  document.getElementById('left').addEventListener('click', function () { move(-1, 0); });
  document.getElementById('right').addEventListener('click', function () { move(1, 0); });
  document.getElementById('down').addEventListener('click', function () { move(0, 1); });

  // Sentuh di papan. Satu kolom = lebar papan di layar dibagi 10.
  var touch = null;

  function columnWidth() {
    return canvas.getBoundingClientRect().width / COLS;
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (!running) return;
    canvas.setPointerCapture(e.pointerId);
    touch = { x: e.clientX, startX: e.clientX, startY: e.clientY, moved: false };
  });

  canvas.addEventListener('pointermove', function (e) {
    if (!touch || !running) return;
    var col = columnWidth();
    var dx = e.clientX - touch.x;
    while (Math.abs(dx) >= col) {
      var dir = dx > 0 ? 1 : -1;
      move(dir, 0);
      touch.x += dir * col;
      touch.moved = true;
      dx = e.clientX - touch.x;
    }
  });

  canvas.addEventListener('pointerup', function (e) {
    if (!touch) return;
    var col = columnWidth();
    var dx = e.clientX - touch.startX;
    var dy = e.clientY - touch.startY;
    if (!touch.moved && Math.abs(dx) < col / 2 && Math.abs(dy) < col / 2) rotate();
    else if (dy > col * 3 && dy > Math.abs(dx) * 2) hardDrop();
    touch = null;
  });

  canvas.addEventListener('pointercancel', function () { touch = null; });

  document.addEventListener('keydown', function (e) {
    var handled = true;
    if (e.key === 'ArrowLeft') move(-1, 0);
    else if (e.key === 'ArrowRight') move(1, 0);
    else if (e.key === 'ArrowDown') move(0, 1);
    else if (e.key === 'ArrowUp') rotate();
    else if (e.key === ' ') hardDrop();
    else handled = false;
    if (handled) e.preventDefault();
  });

  best = loadBest();
  bestEl.textContent = best;
  grid = emptyGrid();
  draw();
})();
