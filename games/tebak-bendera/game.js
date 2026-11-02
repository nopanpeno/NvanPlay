// Tebak Bendera. Lihat emoji bendera, pilih nama negara dari 4 pilihan.
// Skor = jumlah jawaban benar dari 10 soal. Rekor disimpan di tebak-bendera:best.
(function () {
  var TOTAL = 10;
  var KEY = 'tebak-bendera:best';

  var progressEl = document.getElementById('progress');
  var scoreEl = document.getElementById('score');
  var flagEl = document.getElementById('flag');
  var choicesEl = document.getElementById('choices');
  var statusEl = document.getElementById('status');
  var nextBtn = document.getElementById('next');
  var restartBtn = document.getElementById('restart');
  var bestEl = document.getElementById('best');

  var deck = [];
  var index = 0;
  var score = 0;
  var answered = false;
  var best = 0;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Kode dua huruf jadi emoji bendera (dua simbol huruf regional).
  function flagEmoji(code) {
    return String.fromCodePoint.apply(null, code.split('').map(function (ch) {
      return 0x1F1E6 + ch.charCodeAt(0) - 65;
    }));
  }

  function loadBest() {
    try { best = Number(window.nvanplayStorage.getItem(KEY, 0)) || 0; } catch (e) { best = 0; }
    bestEl.textContent = 'Rekor terbaik: ' + best;
  }

  function saveBest() {
    try { window.nvanplayStorage.setItem(KEY, best); } catch (e) { /* abaikan */ }
  }

  // Pengecoh: nama negara lain, acak, tanpa nama yang sama.
  function makeQuestion(item) {
    var wrong = shuffle(BENDERA_DATA.filter(function (x) { return x.code !== item.code; }))
      .slice(0, 3).map(function (x) { return x.name; });
    return { flag: flagEmoji(item.code), answer: item.name, options: shuffle([item.name].concat(wrong)) };
  }

  function buildDeck() {
    deck = shuffle(BENDERA_DATA).slice(0, TOTAL).map(makeQuestion);
  }

  function show() {
    answered = false;
    var q = deck[index];
    progressEl.textContent = 'Soal ' + (index + 1) + '/' + TOTAL;
    scoreEl.textContent = score;
    flagEl.textContent = q.flag;
    flagEl.setAttribute('aria-label', 'Bendera soal ' + (index + 1));
    statusEl.textContent = '';
    nextBtn.hidden = true;
    choicesEl.replaceChildren();
    q.options.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.textContent = opt;
      b.addEventListener('click', function () { choose(b, opt, q.answer); });
      choicesEl.append(b);
    });
  }

  function choose(button, picked, answer) {
    if (answered) return;
    answered = true;
    var correct = picked === answer;
    choicesEl.querySelectorAll('button').forEach(function (b) {
      b.disabled = true;
      if (b.textContent === answer) b.classList.add('correct');
    });
    if (correct) {
      score++;
      statusEl.textContent = 'Benar!';
    } else {
      button.classList.add('wrong');
      statusEl.textContent = 'Salah. Jawabannya: ' + answer;
    }
    scoreEl.textContent = score;
    nextBtn.hidden = false;
  }

  function finish() {
    choicesEl.replaceChildren();
    flagEl.textContent = '🏁';
    progressEl.textContent = 'Selesai';
    var record = score > best;
    if (record) {
      best = score;
      saveBest();
      bestEl.textContent = 'Rekor terbaik: ' + best;
    }
    statusEl.textContent = 'Skormu ' + score + ' dari ' + TOTAL + '.' + (record ? ' Rekor baru!' : '');
    nextBtn.hidden = true;
    restartBtn.hidden = false;
  }

  function start() {
    score = 0;
    index = 0;
    restartBtn.hidden = true;
    buildDeck();
    show();
  }

  nextBtn.addEventListener('click', function () {
    index++;
    if (index < TOTAL) show(); else finish();
  });
  restartBtn.addEventListener('click', start);

  loadBest();
  start();
})();
