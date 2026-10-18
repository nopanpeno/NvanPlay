// 2048: geser angka yang sama untuk menggabungkannya.
(function () {
  'use strict';
  var KEY = '2048:best';
  var boardEl = document.getElementById('board');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var status = document.getElementById('status');
  var grid = new Array(16).fill(0);
  var score = 0;
  var best = readBest();
  var won = false;
  var over = false;
  var touchStart = null;

  function readBest() {
    var value = parseInt(window.nvanplayStorage.getItem(KEY), 10);
    return value > 0 ? value : 0;
  }
  function saveBest() {
    if (score > best) {
      best = score;
      window.nvanplayStorage.setItem(KEY, String(best));
    }
  }
  function addTile() {
    var empty = [];
    grid.forEach(function (value, index) { if (!value) empty.push(index); });
    if (!empty.length) return;
    var at = empty[Math.floor(Math.random() * empty.length)];
    grid[at] = Math.random() < 0.9 ? 2 : 4;
  }
  function render() {
    boardEl.replaceChildren();
    grid.forEach(function (value) {
      var tile = document.createElement('div');
      tile.className = 'tile' + (value > 64 ? ' high' : '');
      tile.setAttribute('role', 'gridcell');
      tile.dataset.value = String(value);
      tile.textContent = value ? String(value) : '';
      tile.setAttribute('aria-label', value ? String(value) : 'kosong');
      boardEl.appendChild(tile);
    });
    scoreEl.textContent = String(score);
    bestEl.textContent = String(best);
  }
  function lineIndexes(direction, line) {
    var indexes = [];
    for (var step = 0; step < 4; step++) {
      if (direction === 'left') indexes.push(line * 4 + step);
      if (direction === 'right') indexes.push(line * 4 + (3 - step));
      if (direction === 'up') indexes.push(step * 4 + line);
      if (direction === 'down') indexes.push((3 - step) * 4 + line);
    }
    return indexes;
  }
  function canMove() {
    for (var i = 0; i < 16; i++) {
      if (!grid[i]) return true;
      if (i % 4 < 3 && grid[i] === grid[i + 1]) return true;
      if (i < 12 && grid[i] === grid[i + 4]) return true;
    }
    return false;
  }
  function move(direction) {
    if (over) return;
    var before = grid.slice();
    for (var line = 0; line < 4; line++) {
      var indexes = lineIndexes(direction, line);
      var values = indexes.map(function (index) { return grid[index]; }).filter(Boolean);
      var merged = [];
      for (var i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          score += values[i];
          merged.push(values[i]);
          i++;
        } else {
          merged.push(values[i]);
        }
      }
      for (var cell = 0; cell < 4; cell++) grid[indexes[cell]] = merged[cell] || 0;
    }
    var changed = grid.some(function (value, index) { return value !== before[index]; });
    if (!changed) return;
    addTile();
    saveBest();
    if (!won && grid.includes(2048)) {
      won = true;
      status.textContent = 'Kamu mencapai 2048! Lanjutkan bermain atau mulai ulang.';
    } else if (!canMove()) {
      over = true;
      status.textContent = 'Tidak ada langkah lagi. Skor akhir: ' + score + '. Mulai ulang untuk bermain lagi.';
    } else {
      status.textContent = 'Skor ' + score + '. Terus gabungkan angkanya!';
    }
    render();
  }
  function start() {
    grid = new Array(16).fill(0);
    score = 0;
    won = false;
    over = false;
    addTile();
    addTile();
    status.textContent = 'Gunakan tombol panah, tombol di layar, atau geser papan.';
    render();
    boardEl.focus();
  }
  document.addEventListener('keydown', function (event) {
    var target = event.target;
    if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
    var directions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (directions[event.key]) {
      event.preventDefault();
      move(directions[event.key]);
    }
  });
  document.querySelectorAll('[data-direction]').forEach(function (button) {
    button.addEventListener('click', function () { move(button.dataset.direction); });
  });
  boardEl.addEventListener('touchstart', function (event) {
    var touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  boardEl.addEventListener('touchend', function (event) {
    if (!touchStart) return;
    var touch = event.changedTouches[0];
    var dx = touch.clientX - touchStart.x, dy = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }, { passive: true });
  document.getElementById('new-game').addEventListener('click', start);
  start();
})();