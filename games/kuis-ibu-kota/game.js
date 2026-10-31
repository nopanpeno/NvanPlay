// Kuis Ibu Kota. Tebak ibu kota dari 4 pilihan. Pengecoh dari grup yang sama.
// Skor = jumlah jawaban benar dari 10 soal. Rekor disimpan di kuis-ibu-kota:best.
(function () {
  var TOTAL = 10;
  var KEY = 'kuis-ibu-kota:best';

  var progressEl = document.getElementById('progress');
  var scoreEl = document.getElementById('score');
  var questionEl = document.getElementById('question');
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

  function loadBest() {
    try {
      best = Number(window.nvanplayStorage.getItem(KEY, 0)) || 0;
    } catch (e) { best = 0; }
    bestEl.textContent = 'Rekor terbaik: ' + best;
  }

  function saveBest() {
    try { window.nvanplayStorage.setItem(KEY, best); } catch (e) { /* abaikan */ }
  }

  // Ambil soal acak. Pengecoh diambil dari grup yang sama, tanpa ibu kota yang sama.
  function makeQuestion(item) {
    var pool = IBU_KOTA_DATA.filter(function (x) {
      return x.group === item.group && x.capital !== item.capital;
    });
    var wrong = shuffle(pool).slice(0, 3).map(function (x) { return x.capital; });
    return { name: item.name, answer: item.capital, options: shuffle([item.capital].concat(wrong)) };
  }

  function buildDeck() {
    deck = shuffle(IBU_KOTA_DATA).slice(0, TOTAL).map(makeQuestion);
  }

  function show() {
    answered = false;
    var q = deck[index];
    progressEl.textContent = 'Soal ' + (index + 1) + '/' + TOTAL;
    scoreEl.textContent = score;
    questionEl.textContent = 'Apa ibu kota ' + q.name + '?';
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
    questionEl.textContent = 'Selesai!';
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
