// Empat Segaris: dua pemain lokal menjatuhkan bidak ke kolom.
(function () {
  'use strict';
  var ROWS = 6, COLS = 7;
  var boardEl = document.getElementById('board');
  var turnEl = document.getElementById('turn');
  var setupEl = document.getElementById('setup');
  var playingEl = document.getElementById('playing');
  var status = document.getElementById('status');
  var names = ['Pemain 1', 'Pemain 2'];
  var cells, current, moves, finished;
  function start() {
    names[0] = document.getElementById('name-red').value.trim() || 'Pemain 1';
    names[1] = document.getElementById('name-yellow').value.trim() || 'Pemain 2';
    cells = Array.from({ length: ROWS }, function () { return new Array(COLS).fill(-1); });
    current = 0; moves = 0; finished = false;
    status.textContent = 'Pilih kolom untuk menjatuhkan bidak.';
    setupEl.hidden = true;
    playingEl.hidden = false;
    render();
  }
  function render() {
    boardEl.replaceChildren();
    for (var col = 0; col < COLS; col++) {
      (function (column) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'column';
        button.disabled = finished || cells[0][column] !== -1;
        button.setAttribute('aria-label', 'Kolom ' + (column + 1) + ', jatuhkan bidak');
        button.addEventListener('click', function () { drop(column); });
        for (var row = 0; row < ROWS; row++) {
          var slot = document.createElement('span');
          slot.className = 'slot';
          slot.setAttribute('aria-hidden', 'true');
          var disc = document.createElement('span');
          disc.className = 'disc' + (cells[row][column] === 0 ? ' red' : cells[row][column] === 1 ? ' yellow' : '');
          slot.appendChild(disc);
          button.appendChild(slot);
        }
        boardEl.appendChild(button);
      })(col);
    }
    turnEl.textContent = finished ? 'Permainan selesai' : 'Giliran ' + names[current];
  }
  function count(row, col, dr, dc, player) {
    var total = 0, r = row + dr, c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && cells[r][c] === player) {
      total++; r += dr; c += dc;
    }
    return total;
  }
  function hasFour(row, col, player) {
    return [[0,1],[1,0],[1,1],[1,-1]].some(function (direction) {
      return 1 + count(row,col,direction[0],direction[1],player) + count(row,col,-direction[0],-direction[1],player) >= 4;
    });
  }
  function drop(col) {
    if (finished) return;
    var row = ROWS - 1;
    while (row >= 0 && cells[row][col] !== -1) row--;
    if (row < 0) return;
    cells[row][col] = current;
    moves++;
    if (hasFour(row, col, current)) {
      finished = true;
      status.textContent = names[current] + ' menang dengan empat bidak segaris!';
      render();
      return;
    }
    if (moves === ROWS * COLS) {
      finished = true;
      status.textContent = 'Papan penuh. Hasilnya seri!';
      render();
      return;
    }
    current = 1 - current;
    status.textContent = names[1 - current] + ' menjatuhkan bidak. Giliran berganti.';
    render();
  }
  document.getElementById('start').addEventListener('click', start);
  document.getElementById('new-game').addEventListener('click', function () {
    playingEl.hidden = true;
    setupEl.hidden = false;
    document.getElementById('start').focus();
  });
})();