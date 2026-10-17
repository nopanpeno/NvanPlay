// Kartu Memori. Skor terbaik = langkah paling sedikit.
(function () {
  var FACES = ['🍎', '🍌', '🍇', '🍒', '🍋', '🍉', '🥝', '🍑'];
  var KEY = 'kartu-memori:best';

  var board = document.getElementById('board');
  var movesEl = document.getElementById('moves');
  var bestEl = document.getElementById('best');
  var msg = document.getElementById('msg');
  var again = document.getElementById('again');

  var first, locked, moves, matched;

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

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function label(card, index) {
    var open = card.classList.contains('open') || card.classList.contains('done');
    card.setAttribute('aria-label', 'Kartu ' + (index + 1) + (open ? ': ' + card.dataset.face : ', tertutup'));
  }

  function start() {
    var faces = shuffle(FACES.concat(FACES));
    board.replaceChildren();
    faces.forEach(function (face, i) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.dataset.face = face;
      card.dataset.index = i;
      label(card, i);
      board.appendChild(card);
    });
    first = null; locked = false; moves = 0; matched = 0;
    movesEl.textContent = 'Langkah: 0';
    msg.textContent = '';
    again.hidden = true;
    showBest();
  }

  function reveal(card) {
    card.classList.add('open');
    card.textContent = card.dataset.face;
    label(card, +card.dataset.index);
  }

  function hide(card) {
    card.classList.remove('open');
    card.textContent = '';
    label(card, +card.dataset.index);
  }

  function win() {
    var best = loadBest();
    if (!best || moves < best) saveBest(moves);
    showBest();
    msg.textContent = 'Selesai dalam ' + moves + ' langkah!';
    again.hidden = false;
    again.focus();
  }

  board.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card || locked || card === first) return;
    if (card.classList.contains('open') || card.classList.contains('done')) return;

    reveal(card);
    if (!first) { first = card; return; }

    moves++;
    movesEl.textContent = 'Langkah: ' + moves;
    var a = first, b = card;
    first = null;

    if (a.dataset.face === b.dataset.face) {
      [a, b].forEach(function (c) {
        c.classList.remove('open');
        c.classList.add('done');
        label(c, +c.dataset.index);
      });
      matched++;
      if (matched === FACES.length) win();
    } else {
      locked = true;
      setTimeout(function () {
        hide(a); hide(b);
        locked = false;
      }, 800);
    }
  });

  again.addEventListener('click', start);
  start();
})();
