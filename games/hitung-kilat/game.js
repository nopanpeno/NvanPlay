// Hitung Kilat: jawab soal penjumlahan sebanyak mungkin dalam 30 detik.
(function () {
  var DURATION = 30000;
  var KEY = 'hitung-kilat:best';
  var questionEl = document.getElementById('question');
  var choicesEl = document.getElementById('choices');
  var timeEl = document.getElementById('time');
  var scoreEl = document.getElementById('score');
  var msgEl = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('start');
  var score = 0, startAt = 0, timer = null, running = false, answer = 0;

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

  function makeQuestion() {
    var a = 2 + Math.floor(Math.random() * 19);
    var b = 2 + Math.floor(Math.random() * 19);
    answer = a + b;
    questionEl.textContent = a + ' + ' + b + ' = ?';

    var options = [answer];
    while (options.length < 4) {
      var candidate = answer + Math.floor(Math.random() * 15) - 7;
      if (candidate !== answer && candidate > 0 && options.indexOf(candidate) === -1) options.push(candidate);
    }
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = options[i]; options[i] = options[j]; options[j] = temp;
    }
    choicesEl.replaceChildren();
    options.forEach(function (value) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(value);
      button.disabled = !running;
      button.addEventListener('click', function () {
        if (!running) return;
        if (value === answer) {
          score++;
          scoreEl.textContent = 'Skor: ' + score;
          recordScore();
        } else {
          msgEl.textContent = 'Belum tepat, lanjut!';
        }
        makeQuestion();
      });
      choicesEl.appendChild(button);
    });
  }

  function finish() {
    clearInterval(timer);
    running = false;
    choicesEl.querySelectorAll('button').forEach(function (button) { button.disabled = true; });
    timeEl.textContent = 'Waktu: 0';
    recordScore();
    msgEl.textContent = 'Waktu habis! Skor kamu ' + score + '.';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
  }

  function tick() {
    var remaining = DURATION - (performance.now() - startAt);
    if (remaining <= 0) return finish();
    timeEl.textContent = 'Waktu: ' + Math.ceil(remaining / 1000);
  }

  function start() {
    score = 0;
    running = true;
    scoreEl.textContent = 'Skor: 0';
    msgEl.textContent = '';
    startBtn.hidden = true;
    makeQuestion();
    startAt = performance.now();
    timeEl.textContent = 'Waktu: 30';
    timer = setInterval(tick, 100);
  }

  startBtn.addEventListener('click', start);
  makeQuestion();
  showBest();
})();
