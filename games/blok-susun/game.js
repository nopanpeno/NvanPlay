// Blok Susun (mirip Tetris). Dibangun bertahap.
// Step 1: papan, 7 bentuk jatuh, geser kiri/kanan/turun, kunci di dasar, game over.
// Step 2: putar blok searah jarum jam, geser otomatis dari dinding.
// Belum ada: hapus baris, skor, level, rekor.
(function () {
  var COLS = 10;
  var ROWS = 20;
  var CELL = 24;
  var DROP_MS = 600;

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

  var grid;      // grid[y][x] = warna kotak terkunci, atau null
  var piece;     // { color, cells, x, y }
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

  function spawn() {
    var shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    piece = { color: shape.color, size: shape.size, cells: shape.cells, x: 3, y: 0 };
    if (!fits(piece.cells, piece.x, piece.y)) gameOver();
  }

  function lockPiece() {
    piece.cells.forEach(function (c) {
      grid[piece.y + c[1]][piece.x + c[0]] = piece.color;
    });
    spawn();
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
      piece.cells.forEach(function (c) {
        drawCell(piece.x + c[0], piece.y + c[1], piece.color);
      });
    }
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    startBtn.disabled = false;
    startBtn.textContent = 'Main lagi';
    msg.textContent = 'Tumpukan penuh. Game over.';
    draw();
  }

  function start() {
    clearInterval(timer);
    grid = emptyGrid();
    running = true;
    startBtn.disabled = true;
    msg.textContent = 'Geser dan putar dengan tombol panah atau tombol di layar.';
    spawn();
    draw();
    if (running) timer = setInterval(tick, DROP_MS);
  }

  startBtn.addEventListener('click', start);
  document.getElementById('rotate').addEventListener('click', rotate);
  document.getElementById('left').addEventListener('click', function () { move(-1, 0); });
  document.getElementById('right').addEventListener('click', function () { move(1, 0); });
  document.getElementById('down').addEventListener('click', function () { move(0, 1); });

  document.addEventListener('keydown', function (e) {
    var handled = true;
    if (e.key === 'ArrowLeft') move(-1, 0);
    else if (e.key === 'ArrowRight') move(1, 0);
    else if (e.key === 'ArrowDown') move(0, 1);
    else if (e.key === 'ArrowUp') rotate();
    else handled = false;
    if (handled) e.preventDefault();
  });

  grid = emptyGrid();
  draw();
})();
