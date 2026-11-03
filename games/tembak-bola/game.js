// Tembak Bola: bola jalan di jalur berliku menuju lubang. Tembak warna sama 3 atau lebih untuk hapus.
// Sisa rantai nutup celah. Hapus beruntun dapat kombo.
(function () {
  var W = 340, H = 420, R = 13, STEP = 26, TICK = 30, SHOT = 9, BALL_SCORE = 10;
  var COLORS = ['#e5483a', '#2f6fed', '#2e9a55', '#f5b700'];
  var KEY = 'tembak-bola:best';
  var PATH = [[-10, 50], [310, 50], [310, 120], [30, 120], [30, 190], [310, 190], [310, 260], [30, 260], [30, 330], [310, 380]];
  var SHOOTER = { x: 170, y: 400 };
  var NEXT_SLOT = { x: 218, y: 400 };
  var segLen = [], total = 0;
  for (var s = 0; s < PATH.length - 1; s++) {
    var dx = PATH[s + 1][0] - PATH[s][0], dy = PATH[s + 1][1] - PATH[s][1];
    segLen.push(Math.hypot(dx, dy));
    total += segLen[s];
  }

  var canvas = document.getElementById('lane');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var msgEl = document.getElementById('msg');
  var startBtn = document.getElementById('start');

  var items = [], offset = 0, score = 0, running = false, timer = null;
  var shot = null, loaded = 0, nextC = 0, aimX = SHOOTER.x, aimY = 0;
  // Animasi celah: bola dari index lagStart ke depan geser pelan ke posisi baru.
  var lagStart = 0, lag = 0;

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
    return 0.5 + Math.min(score, 400) / 250;
  }

  function randColor() {
    return Math.floor(Math.random() * COLORS.length);
  }

  // Titik di jalur pada jarak d dari awal.
  function pointAt(d) {
    if (d <= 0) return { x: PATH[0][0], y: PATH[0][1] };
    for (var i = 0; i < segLen.length; i++) {
      if (d <= segLen[i]) {
        var t = d / segLen[i], a = PATH[i], b = PATH[i + 1];
        return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t };
      }
      d -= segLen[i];
    }
    var last = PATH[PATH.length - 1];
    return { x: last[0], y: last[1] };
  }

  function distOf(i) {
    return offset + i * STEP + (i >= lagStart ? lag : 0);
  }

  function posOf(i) {
    return pointAt(distOf(i));
  }

  function drawBall(x, y, c) {
    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[c];
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    PATH.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.strokeStyle = '#d9dde8';
    ctx.lineWidth = R * 2 + 6;
    ctx.stroke();
    ctx.strokeStyle = '#b8bfd0';
    ctx.lineWidth = 2;
    ctx.stroke();

    var end = PATH[PATH.length - 1];
    ctx.beginPath();
    ctx.arc(end[0], end[1], R + 4, 0, Math.PI * 2);
    ctx.fillStyle = '#20203a';
    ctx.fill();

    items.forEach(function (c, i) {
      if (distOf(i) < 0) return;
      var p = posOf(i);
      drawBall(p.x, p.y, c);
    });

    ctx.beginPath();
    ctx.setLineDash([4, 6]);
    ctx.moveTo(SHOOTER.x, SHOOTER.y);
    var len = Math.hypot(aimX - SHOOTER.x, aimY - SHOOTER.y) || 1;
    ctx.lineTo(SHOOTER.x + (aimX - SHOOTER.x) / len * 90, SHOOTER.y + (aimY - SHOOTER.y) / len * 90);
    ctx.strokeStyle = '#8a91a6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    drawBall(SHOOTER.x, SHOOTER.y, loaded);
    ctx.beginPath();
    ctx.arc(NEXT_SLOT.x, NEXT_SLOT.y, R + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#8a91a6';
    ctx.lineWidth = 2;
    ctx.stroke();
    drawBall(NEXT_SLOT.x, NEXT_SLOT.y, nextC);
    if (shot) drawBall(shot.x, shot.y, shot.c);
  }

  function reachedEnd() {
    if (!items.length) return false;
    return distOf(items.length - 1) >= total;
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    shot = null;
    recordScore();
    msgEl.textContent = 'Bola masuk lubang! Skor kamu ' + score + '.';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
    draw();
  }

  // Cari run warna sama yang memuat index k. Hapus kalau 3 atau lebih.
  // Return info hapusan, atau null kalau tidak ada.
  function clearRunAt(k) {
    var c = items[k];
    var l = k, r = k;
    while (l > 0 && items[l - 1] === c) l--;
    while (r < items.length - 1 && items[r + 1] === c) r++;
    var n = r - l + 1;
    if (n < 3) return null;
    items.splice(l, n);
    lagStart = l;
    lag = n * STEP;
    return { n: n, at: l };
  }

  function resolve(k) {
    var result = clearRunAt(k);
    if (!result) return;
    var combo = 1;
    var gained = result.n * BALL_SCORE;
    // Kombo: sisa rantai yang nyambung otomatis ikut hilang.
    var at = result.at;
    while (at > 0 && at < items.length && items[at - 1] === items[at]) {
      var next = clearRunAt(at);
      if (!next) break;
      combo++;
      gained += next.n * BALL_SCORE * combo;
      at = next.at;
    }
    score += gained;
    showScore();
    recordScore();
    msgEl.textContent = combo > 1 ? 'Kombo x' + combo + '!' : '';
  }

  function insertAt(k, c) {
    items.splice(k, 0, c);
    lagStart = k;
    lag = -STEP;
    resolve(k);
  }

  function distTo(p, q) {
    return Math.hypot(p.x - q.x, p.y - q.y);
  }

  function stepShot() {
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (shot.x < -R || shot.x > W + R || shot.y < -R) { shot = null; return; }

    var best = -1, bd = Infinity;
    for (var i = 0; i < items.length; i++) {
      if (distOf(i) < 0 || distOf(i) > total) continue;
      var dd = distTo(posOf(i), shot);
      if (dd < bd) { bd = dd; best = i; }
    }
    if (best < 0 || bd >= 2 * R) return;

    // Masukkan di sisi yang lebih dekat dengan bola tembakan.
    var k = best;
    if (best + 1 < items.length) {
      var nextD = distTo(posOf(best + 1), shot);
      var prevD = best - 1 >= 0 ? distTo(posOf(best - 1), shot) : Infinity;
      if (nextD < prevD) k = best + 1;
    }
    var c = shot.c;
    shot = null;
    insertAt(k, c);
    if (reachedEnd()) gameOver();
  }

  function tick() {
    if (!running) return;
    offset += speed();
    while (offset >= STEP) {
      offset -= STEP;
      items.unshift(randColor());
      lagStart++;
    }
    lag *= 0.8;
    if (Math.abs(lag) < 0.5) lag = 0;
    if (shot) stepShot();
    if (!running) return;
    draw();
    if (reachedEnd()) gameOver();
  }

  function setAim(e) {
    var rect = canvas.getBoundingClientRect();
    aimX = (e.clientX - rect.left) * W / rect.width;
    aimY = (e.clientY - rect.top) * H / rect.height;
    if (!running) draw();
  }

  function swapAmmo() {
    var t = loaded;
    loaded = nextC;
    nextC = t;
  }

  function fire() {
    if (!running || shot) return;
    var dx = aimX - SHOOTER.x, dy = aimY - SHOOTER.y;
    if (dy > -5) return;
    var len = Math.hypot(dx, dy);
    shot = { x: SHOOTER.x, y: SHOOTER.y, vx: dx / len * SHOT, vy: dy / len * SHOT, c: loaded };
    loaded = nextC;
    nextC = randColor();
  }

  canvas.addEventListener('pointermove', setAim);
  canvas.addEventListener('pointerdown', function (e) {
    setAim(e);
    if (!running) return;
    // Ketuk bola berikutnya untuk tukar dengan bola yang siap ditembak.
    if (distTo({ x: aimX, y: aimY }, NEXT_SLOT) < R + 8) {
      swapAmmo();
      draw();
      return;
    }
    fire();
  });

  function start() {
    items = [];
    offset = 0;
    score = 0;
    shot = null;
    lagStart = 0;
    lag = 0;
    loaded = randColor();
    nextC = randColor();
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
  draw();
})();
