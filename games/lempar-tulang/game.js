// Lempar Tulang: dua pemain gantian. Tahan layar buat isi tenaga, lepas buat lempar.
(function () {
  var W = 340, H = 420, GROUND = 380, CHARGE_MS = 1500, GRAV = 0.25, TICK = 16, THROWS = 5, HIT = 20;
  var FENCE_X = 164, FENCE_W = 12, FENCE_TOP = GROUND - 70;
  var KEY = 'lempar-tulang:best';
  var PLAYERS = [
    { name: 'Anjing', emoji: '🐶', ammo: '🦴', x: 60, dir: 1, score: 0 },
    { name: 'Kucing', emoji: '🐱', ammo: '🥫', x: 280, dir: -1, score: 0 }
  ];
  var canvas = document.getElementById('field');
  var ctx = canvas.getContext('2d');
  var turnEl = document.getElementById('turn');
  var scoreEl = document.getElementById('score');
  var msgEl = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('start');

  var turn = 0, left = [THROWS, THROWS], running = false, timer = null;
  var charging = false, chargeStart = 0, power = 0, proj = null;

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

  function recordBest(value) {
    var best = loadBest();
    if (!best || value > best) {
      try { window.nvanplayStorage.setItem(KEY, String(value)); } catch (e) { /* penyimpanan opsional */ }
      showBest();
    }
  }

  function showScore() {
    scoreEl.textContent = PLAYERS[0].emoji + ' ' + PLAYERS[0].score + '   ' + PLAYERS[1].emoji + ' ' + PLAYERS[1].score;
  }

  function showTurn() {
    turnEl.textContent = 'Giliran: ' + PLAYERS[turn].name + ' (sisa ' + left[turn] + ')';
  }

  function currentPower() {
    return Math.min(1, (performance.now() - chargeStart) / CHARGE_MS);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#c9e7a3';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#b98a4e';
    ctx.fillRect(FENCE_X, FENCE_TOP, FENCE_W, GROUND - FENCE_TOP);
    PLAYERS.forEach(function (p) { ctx.fillText(p.emoji, p.x, GROUND); });
    if (proj) {
      ctx.font = '26px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(PLAYERS[proj.owner].ammo, proj.x, proj.y);
    }
    if (charging) {
      var p = currentPower();
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(30, H - 24, W - 60, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(30, H - 24, (W - 60) * p, 12);
    }
  }

  function showResult() {
    var a = PLAYERS[0].score, b = PLAYERS[1].score;
    if (a === b) return 'Seri ' + a + ' - ' + b + '!';
    var w = a > b ? PLAYERS[0] : PLAYERS[1];
    return w.name + ' menang ' + Math.max(a, b) + ' - ' + Math.min(a, b) + '!';
  }

  function finish() {
    running = false;
    clearInterval(timer);
    timer = null;
    recordBest(Math.max(PLAYERS[0].score, PLAYERS[1].score));
    msgEl.textContent = showResult();
    turnEl.textContent = 'Selesai';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
    draw();
  }

  function land(x, blocked) {
    var opp = PLAYERS[1 - turn];
    if (blocked) {
      msgEl.textContent = 'Kena pagar!';
    } else if (Math.abs(x - opp.x) <= HIT) {
      PLAYERS[turn].score++;
      showScore();
      msgEl.textContent = 'Kena ' + opp.name + '!';
    } else {
      msgEl.textContent = 'Meleset.';
    }
    proj = null;
    if (left[1 - turn] > 0) turn = 1 - turn;
    if (left[0] === 0 && left[1] === 0) return finish();
    showTurn();
  }

  function launch() {
    var p = PLAYERS[turn];
    var v = 4 + 10 * power, ang = 55 * Math.PI / 180;
    proj = {
      owner: turn,
      x: p.x + 24 * p.dir,
      y: GROUND - 50,
      vx: p.dir * v * Math.cos(ang),
      vy: -v * Math.sin(ang)
    };
    left[turn]--;
    msgEl.textContent = '';
    showTurn();
  }

  function tick() {
    if (proj) {
      var prevX = proj.x;
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.vy += GRAV;
      var lo = Math.min(prevX, proj.x), hi = Math.max(prevX, proj.x);
      var hitFence = hi >= FENCE_X && lo <= FENCE_X + FENCE_W && proj.y >= FENCE_TOP;
      if (hitFence) land(proj.x, true);
      else if (proj.y >= GROUND || proj.x < -30 || proj.x > W + 30) land(proj.x, false);
    }
    draw();
  }

  function release() {
    if (!charging) return;
    power = currentPower();
    charging = false;
    launch();
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (!running || proj || left[turn] <= 0) return;
    e.preventDefault();
    charging = true;
    chargeStart = performance.now();
  });
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  function start() {
    turn = 0;
    left = [THROWS, THROWS];
    PLAYERS.forEach(function (p) { p.score = 0; });
    proj = null;
    charging = false;
    power = 0;
    running = true;
    msgEl.textContent = 'Tahan di layar buat isi tenaga, lepas buat lempar.';
    startBtn.hidden = true;
    showScore();
    showTurn();
    clearInterval(timer);
    timer = setInterval(tick, TICK);
    draw();
  }

  startBtn.addEventListener('click', start);
  turnEl.textContent = 'Tekan Mulai';
  showScore();
  showBest();
  draw();
})();
