// Tebak Warna (efek Stroop). Pilih warna tulisan, bukan arti katanya.
// Skor terbaik = jawaban benar terbanyak dalam 30 detik.
(function () {
  var DURATION = 30000;
  var KEY = 'tebak-warna:best';
  var COLORS = [
    { name: 'Merah', hex: '#ff5252' },
    { name: 'Biru', hex: '#448aff' },
    { name: 'Hijau', hex: '#4caf50' },
    { name: 'Kuning', hex: '#ffd600' },
    { name: 'Ungu', hex: '#b388ff' }
  ];

  var wordEl = document.getElementById('word');
  var box = document.getElementById('choices');
  var timeEl = document.getElementById('time');
  var scoreEl = document.getElementById('score');
  var msg = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('start');

  var buttons = [];
  var score, wrong, startAt, timer, running, current;

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

  function recordScore() {
    var best = loadBest();
    if (!best || score > best) {
      saveBest(score);
      showBest();
    }
  }

  function setButtons(enabled) {
    buttons.forEach(function (b) { b.disabled = !enabled; });
  }

  function nextRound() {
    var word = COLORS[Math.floor(Math.random() * COLORS.length)];
    var others = COLORS.filter(function (c) { return c !== word; });
    var ink = others[Math.floor(Math.random() * others.length)];
    current = ink;
    wordEl.textContent = word.name;
    wordEl.style.color = ink.hex;
    wordEl.dataset.ink = ink.name;
  }

  function showTime(ms) {
    timeEl.textContent = 'Waktu: ' + Math.ceil(ms / 1000);
  }

  function finish() {
    clearInterval(timer);
    running = false;
    setButtons(false);
    showTime(0);
    recordScore();
    var best = loadBest();
    var record = best !== null && score === best && score > 0;
    msg.textContent = 'Skor ' + score + ', salah ' + wrong + (record ? '. Rekor terbaik!' : '.');
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
  }

  function tick() {
    var left = DURATION - (performance.now() - startAt);
    if (left <= 0) return finish();
    showTime(left);
  }

  function start() {
    score = 0; wrong = 0; running = true;
    scoreEl.textContent = 'Skor: 0';
    msg.textContent = '';
    startBtn.hidden = true;
    setButtons(true);
    nextRound();
    startAt = performance.now();
    showTime(DURATION);
    timer = setInterval(tick, 200);
  }

  COLORS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.name;
    b.style.background = c.hex;
    b.dataset.name = c.name;
    b.disabled = true;
    b.addEventListener('click', function () {
      if (!running) return;
      if (c === current) {
        score++;
        scoreEl.textContent = 'Skor: ' + score;
        recordScore();
      } else {
        wrong++;
      }
      nextRound();
    });
    box.appendChild(b);
    buttons.push(b);
  });

  startBtn.addEventListener('click', start);
  showBest();
})();
