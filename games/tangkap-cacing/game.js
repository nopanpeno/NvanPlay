// Tangkap Cacing (snake) 16x16. Dinding mematikan. Skor = jumlah buah.
// Kontrol: panah/WASD, geser di papan, atau tombol layar. Spasi atau tombol = jeda.
// Rekor = skor tertinggi.
(function () {
  'use strict';
  var SIZE = 16;
  var KEY = 'tangkap-cacing:best';
  var START_DELAY = 150;
  var MIN_DELAY = 80;
  var DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

  var boardEl = document.getElementById('board');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');
  var startBtn = document.getElementById('start');
  var pauseBtn = document.getElementById('pause');
  var cells = [];
  var snake, dir, queue, food, score, delay, timer, running, paused, over;

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
    bestEl.textContent = b ? 'Rekor: ' + b : '';
  }

  function idx(p) { return p[0] * SIZE + p[1]; }

  function draw() {
    for (var i = 0; i < cells.length; i++) cells[i].className = 'cell';
    snake.forEach(function (p, k) { cells[idx(p)].className = 'cell ' + (k === 0 ? 'head' : 'body'); });
    if (food) cells[idx(food)].className = 'cell food';
    scoreEl.textContent = 'Skor: ' + score;
  }

  function placeFood() {
    var taken = {};
    snake.forEach(function (p) { taken[idx(p)] = true; });
    var empty = [];
    for (var i = 0; i < SIZE * SIZE; i++) if (!taken[i]) empty.push(i);
    if (!empty.length) { food = null; return; }
    var pick = empty[Math.floor(Math.random() * empty.length)];
    food = [Math.floor(pick / SIZE), pick % SIZE];
  }

  function stop() { clearInterval(timer); timer = null; }
  function schedule() { stop(); timer = setInterval(step, delay); }

  function end(won) {
    over = true; running = false;
    stop();
    pauseBtn.hidden = true;
    startBtn.hidden = false;
    startBtn.textContent = 'Main lagi';
    var best = loadBest();
    var extra = '';
    if (score > 0 && (!best || score > best)) { saveBest(score); showBest(); extra = ' Rekor baru!'; }
    msg.textContent = (won ? 'Papan penuh, kamu menang! ' : 'Game over. ') + 'Skor ' + score + '.' + extra;
  }

  function step() {
    if (queue.length) {
      var want = queue.shift();
      var cur = DIRS[dir], nxt = DIRS[want];
      if (cur[0] + nxt[0] !== 0 || cur[1] + nxt[1] !== 0) dir = want;
    }
    var d = DIRS[dir];
    var head = [snake[0][0] + d[0], snake[0][1] + d[1]];
    if (head[0] < 0 || head[0] >= SIZE || head[1] < 0 || head[1] >= SIZE) return end(false);
    var eating = food && head[0] === food[0] && head[1] === food[1];
    var body = eating ? snake : snake.slice(0, -1);
    for (var i = 0; i < body.length; i++) {
      if (body[i][0] === head[0] && body[i][1] === head[1]) return end(false);
    }
    snake.unshift(head);
    if (eating) {
      score++;
      delay = Math.max(MIN_DELAY, START_DELAY - score * 3);
      placeFood();
      if (!food) { draw(); return end(true); }
      schedule();
    } else {
      snake.pop();
    }
    draw();
  }

  function begin() {
    running = true; paused = false; over = false;
    startBtn.hidden = true;
    pauseBtn.hidden = false;
    pauseBtn.textContent = 'Jeda';
    msg.textContent = 'Jalan!';
    schedule();
  }

  function newGame() {
    stop();
    var mid = SIZE / 2;
    snake = [[mid, mid], [mid, mid - 1], [mid, mid - 2]];
    dir = 'right'; queue = []; score = 0; delay = START_DELAY;
    running = false; paused = false; over = false;
    placeFood();
    draw();
    startBtn.hidden = false; startBtn.textContent = 'Mulai';
    pauseBtn.hidden = true;
    msg.textContent = 'Tekan Mulai atau arah apa saja.';
    showBest();
  }

  function turn(name) {
    if (over) return;
    if (!running) {
      // Arah pertama langsung memulai; mundur ke badan tidak diterima.
      var cur = DIRS[dir], nxt = DIRS[name];
      if (cur[0] + nxt[0] === 0 && cur[1] + nxt[1] === 0) return;
      dir = name;
      begin();
      return;
    }
    if (paused) return;
    var last = queue.length ? queue[queue.length - 1] : dir;
    if (last !== name && queue.length < 2) queue.push(name);
  }

  function togglePause() {
    if (!running || over) return;
    paused = !paused;
    if (paused) { stop(); pauseBtn.textContent = 'Lanjut'; msg.textContent = 'Dijeda.'; }
    else { schedule(); pauseBtn.textContent = 'Jeda'; msg.textContent = 'Jalan!'; }
  }

  var KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var name = KEYS[e.key];
    if (name) { e.preventDefault(); turn(name); return; }
    if ((e.key === ' ' || e.key === 'p' || e.key === 'P') && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      togglePause();
    }
  });

  ['up', 'down', 'left', 'right'].forEach(function (n) {
    document.querySelector('#pad .' + n).addEventListener('click', function () { turn(n); });
  });

  var sx = null, sy = null;
  boardEl.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; });
  boardEl.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null; sy = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });
  boardEl.addEventListener('pointercancel', function () { sx = null; sy = null; });

  startBtn.addEventListener('click', function () {
    if (over) newGame();
    begin();
  });
  pauseBtn.addEventListener('click', togglePause);
  document.addEventListener('visibilitychange', function () { if (document.hidden && running && !paused) togglePause(); });

  for (var i = 0; i < SIZE * SIZE; i++) {
    var c = document.createElement('div');
    c.className = 'cell';
    boardEl.appendChild(c);
    cells.push(c);
  }
  newGame();
})();
