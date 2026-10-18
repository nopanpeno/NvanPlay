// Tebak Kata. Tebak huruf satu per satu, salah maksimal 6 kali.
// Rekor = kata benar beruntun terpanjang.
(function () {
  var KEY = 'tebak-kata:best';
  var MAX_WRONG = 6;
  var WORDS = [
    ['KUCING', 'Hewan'], ['JERAPAH', 'Hewan'], ['BURUNG', 'Hewan'], ['KELINCI', 'Hewan'],
    ['BEBEK', 'Hewan'], ['KEPITING', 'Hewan'], ['TUPAI', 'Hewan'], ['HARIMAU', 'Hewan'],
    ['SEPEDA', 'Benda'], ['PAYUNG', 'Benda'], ['JENDELA', 'Benda'], ['GITAR', 'Benda'],
    ['LAYANGAN', 'Benda'], ['KERETA', 'Benda'], ['PERAHU', 'Benda'], ['KURSI', 'Benda'],
    ['PELANGI', 'Alam'], ['GUNUNG', 'Alam'], ['SUNGAI', 'Alam'], ['BINTANG', 'Alam'],
    ['MATAHARI', 'Alam'], ['HUJAN', 'Alam'], ['PANTAI', 'Alam'], ['AWAN', 'Alam'],
    ['DURIAN', 'Buah'], ['NANAS', 'Buah'], ['KELAPA', 'Buah'], ['JERUK', 'Buah'],
    ['SEMANGKA', 'Buah'], ['MANGGA', 'Buah'], ['PISANG', 'Buah'], ['RAMBUTAN', 'Buah'],
    ['SEKOLAH', 'Tempat'], ['PASAR', 'Tempat'], ['BANDARA', 'Tempat'], ['PERPUSTAKAAN', 'Tempat'],
    ['STASIUN', 'Tempat'], ['MASJID', 'Tempat'], ['TAMAN', 'Tempat'], ['RUMAH', 'Tempat']
  ];

  var hintEl = document.getElementById('hint');
  var wordEl = document.getElementById('word');
  var keysEl = document.getElementById('keys');
  var msg = document.getElementById('msg');
  var streakEl = document.getElementById('streak');
  var bestEl = document.getElementById('best');
  var again = document.getElementById('again');
  var parts = Array.prototype.slice.call(document.querySelectorAll('#gallows .part'));

  var keyButtons = {};
  var bag = [];
  var answer, guessed, wrong, over, streak = 0;

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
    bestEl.textContent = b ? 'Rekor beruntun: ' + b : '';
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Ambil kata dari "kantong" acak supaya tidak ada kata yang berulang sebelum semuanya keluar.
  function nextWord() {
    if (!bag.length) bag = shuffle(WORDS.slice());
    return bag.pop();
  }

  function renderWord(revealAll) {
    var labels = [];
    wordEl.classList.toggle('long', answer.word.length > 9);
    wordEl.replaceChildren();
    answer.word.split('').forEach(function (ch) {
      var slot = document.createElement('span');
      slot.className = 'slot';
      var known = guessed[ch];
      if (known || revealAll) {
        slot.textContent = ch;
        if (!known) slot.classList.add('miss');
      }
      wordEl.appendChild(slot);
      labels.push(known || revealAll ? ch : 'kosong');
    });
    wordEl.setAttribute('aria-label', 'Kata: ' + labels.join(' '));
  }

  function renderGallows() {
    parts.forEach(function (p, i) { p.classList.toggle('on', i < wrong); });
  }

  function isSolved() {
    return answer.word.split('').every(function (ch) { return guessed[ch]; });
  }

  function lockKeys() {
    Object.keys(keyButtons).forEach(function (k) { keyButtons[k].disabled = true; });
  }

  function end(won) {
    over = true;
    lockKeys();
    if (won) {
      streak++;
      var best = loadBest();
      if (!best || streak > best) { saveBest(streak); showBest(); }
      msg.textContent = 'Benar! Katanya ' + answer.word + '.';
    } else {
      streak = 0;
      msg.textContent = 'Salah terus. Katanya ' + answer.word + '.';
      renderWord(true);
    }
    streakEl.textContent = 'Beruntun: ' + streak;
    again.hidden = false;
    again.focus();
  }

  function guess(letter) {
    if (over || guessed[letter]) return;
    guessed[letter] = true;
    var hit = answer.word.indexOf(letter) >= 0;
    var btn = keyButtons[letter];
    btn.disabled = true;
    btn.classList.add(hit ? 'ok' : 'no');
    btn.setAttribute('aria-label', 'Huruf ' + letter + ', ' + (hit ? 'ada' : 'tidak ada'));
    if (!hit) wrong++;
    renderGallows();
    renderWord(false);
    if (hit && isSolved()) return end(true);
    if (wrong >= MAX_WRONG) return end(false);
    msg.textContent = hit ? 'Ada.' : 'Tidak ada. Sisa salah: ' + (MAX_WRONG - wrong) + '.';
  }

  function start() {
    var pick = nextWord();
    answer = { word: pick[0], hint: pick[1] };
    guessed = {};
    wrong = 0;
    over = false;
    hintEl.textContent = 'Petunjuk: ' + answer.hint + ' (' + answer.word.length + ' huruf)';
    msg.textContent = 'Pilih huruf.';
    again.hidden = true;
    Object.keys(keyButtons).forEach(function (k) {
      var b = keyButtons[k];
      b.disabled = false;
      b.className = '';
      b.setAttribute('aria-label', 'Huruf ' + k);
    });
    renderGallows();
    renderWord(false);
    streakEl.textContent = 'Beruntun: ' + streak;
    showBest();
  }

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (letter) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = letter;
    b.addEventListener('click', function () { guess(letter); });
    keysEl.appendChild(b);
    keyButtons[letter] = b;
  });

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.length === 1 ? e.key.toUpperCase() : '';
    if (keyButtons[k] && !keyButtons[k].disabled) guess(k);
  });

  again.addEventListener('click', start);
  start();
})();
