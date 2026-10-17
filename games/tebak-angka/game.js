// Tebak Angka. Skor terbaik = jumlah tebakan paling sedikit.
(function () {
  var MAX_TRIES = 7;
  var KEY = 'tebak-angka:best';

  var form = document.getElementById('form');
  var input = document.getElementById('guess');
  var hint = document.getElementById('hint');
  var triesEl = document.getElementById('tries');
  var bestEl = document.getElementById('best');
  var again = document.getElementById('again');

  var secret, tries, over;

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
    bestEl.textContent = b ? 'Terbaik: ' + b + ' tebakan' : '';
  }

  function showTries() {
    triesEl.textContent = 'Sisa coba: ' + (MAX_TRIES - tries);
  }

  function start() {
    secret = Math.floor(Math.random() * 100) + 1;
    tries = 0;
    over = false;
    hint.textContent = 'Ayo mulai!';
    input.value = '';
    input.disabled = false;
    again.hidden = true;
    showTries();
    showBest();
    input.focus();
  }

  function finish(message) {
    over = true;
    hint.textContent = message;
    input.disabled = true;
    again.hidden = false;
    again.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (over) return;
    var n = parseInt(input.value, 10);
    if (!(n >= 1 && n <= 100)) {
      hint.textContent = 'Masukkan angka 1 sampai 100.';
      return;
    }
    tries++;
    input.value = '';
    if (n === secret) {
      var best = loadBest();
      if (!best || tries < best) saveBest(tries);
      showBest();
      return finish('Benar! Angkanya ' + secret + ', ' + tries + ' tebakan.');
    }
    showTries();
    if (tries >= MAX_TRIES) return finish('Habis. Angkanya ' + secret + '.');
    hint.textContent = n < secret ? n + ' terlalu kecil.' : n + ' terlalu besar.';
    input.focus();
  });

  again.addEventListener('click', start);
  start();
})();
