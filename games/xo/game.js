// XO lawan komputer. Kamu X dan selalu jalan duluan.
// Komputer: menang kalau bisa, blokir kalau perlu, selain itu acak (jadi bisa dikalahkan).
// Rekor = kemenangan beruntun terpanjang.
(function () {
  var KEY = 'xo:best';
  var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var COMPUTER_DELAY = 450;

  var boardEl = document.getElementById('board');
  var msg = document.getElementById('msg');
  var streakEl = document.getElementById('streak');
  var bestEl = document.getElementById('best');
  var again = document.getElementById('again');

  var cells = [];
  var board, over, locked, streak = 0;

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

  function winner(b) {
    for (var i = 0; i < LINES.length; i++) {
      var l = LINES[i];
      if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { mark: b[l[0]], line: l };
    }
    return null;
  }

  function emptyCells(b) {
    var out = [];
    for (var i = 0; i < 9; i++) if (!b[i]) out.push(i);
    return out;
  }

  // Cari kotak yang membuat `mark` menang pada giliran ini.
  function findWinningMove(b, mark) {
    var free = emptyCells(b);
    for (var i = 0; i < free.length; i++) {
      b[free[i]] = mark;
      var w = winner(b);
      b[free[i]] = null;
      if (w) return free[i];
    }
    return -1;
  }

  function computerMove() {
    var move = findWinningMove(board, 'O');
    if (move < 0) move = findWinningMove(board, 'X');
    if (move < 0) {
      var free = emptyCells(board);
      move = free[Math.floor(Math.random() * free.length)];
    }
    return move;
  }

  function render(winLine) {
    cells.forEach(function (c, i) {
      var mark = board[i];
      c.textContent = mark || '';
      if (mark) c.dataset.mark = mark; else delete c.dataset.mark;
      c.disabled = !!mark || over || locked;
      c.classList.toggle('win', !!winLine && winLine.indexOf(i) >= 0);
      c.setAttribute('aria-label', 'Kotak ' + (i + 1) + ', ' + (mark || 'kosong'));
    });
  }

  function finish(result) {
    over = true;
    if (result && result.mark === 'X') {
      streak++;
      var best = loadBest();
      if (!best || streak > best) { saveBest(streak); showBest(); }
      msg.textContent = 'Kamu menang!';
    } else if (result) {
      streak = 0;
      msg.textContent = 'Komputer menang.';
    } else {
      msg.textContent = 'Seri.';
    }
    streakEl.textContent = 'Beruntun: ' + streak;
    render(result && result.line);
    again.hidden = false;
    again.focus();
  }

  function play(i) {
    if (over || locked || board[i]) return;
    board[i] = 'X';
    var w = winner(board);
    if (w) return finish(w);
    if (!emptyCells(board).length) return finish(null);

    locked = true;
    msg.textContent = 'Komputer berpikir…';
    render();
    setTimeout(function () {
      board[computerMove()] = 'O';
      locked = false;
      var r = winner(board);
      if (r) return finish(r);
      if (!emptyCells(board).length) return finish(null);
      msg.textContent = 'Giliranmu.';
      render();
    }, COMPUTER_DELAY);
  }

  function start() {
    board = [null, null, null, null, null, null, null, null, null];
    over = false;
    locked = false;
    msg.textContent = 'Giliranmu.';
    again.hidden = true;
    render();
    showBest();
  }

  for (var i = 0; i < 9; i++) {
    (function (index) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell';
      b.dataset.index = index;
      b.addEventListener('click', function () { play(index); });
      boardEl.appendChild(b);
      cells.push(b);
    })(i);
  }

  again.addEventListener('click', start);
  start();
})();
