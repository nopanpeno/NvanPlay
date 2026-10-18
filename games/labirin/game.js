// Labirin acak 15x15 dengan kontrol keyboard dan tombol layar.
(function () {
  'use strict';
  var SIZE = 15;
  var CELL = 28;
  var KEY = 'labirin:best';
  var DIRS = [[-1,0],[0,1],[1,0],[0,-1]];
  var mazeEl = document.getElementById('maze');
  var status = document.getElementById('status');
  var timerEl = document.getElementById('timer');
  var bestEl = document.getElementById('best');
  var stepsEl = document.getElementById('steps');
  var walls, row, col, steps, startedAt, won, best, timer;
  function node(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    return el;
  }
  function generate() {
    walls = Array.from({ length: SIZE }, function () {
      return Array.from({ length: SIZE }, function () { return [true, true, true, true]; });
    });
    var seen = Array.from({ length: SIZE }, function () { return new Array(SIZE).fill(false); });
    var stack = [[0, 0]];
    seen[0][0] = true;
    while (stack.length) {
      var current = stack[stack.length - 1];
      var choices = [];
      DIRS.forEach(function (direction, index) {
        var nr = current[0] + direction[0], nc = current[1] + direction[1];
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !seen[nr][nc]) choices.push([index, nr, nc]);
      });
      if (!choices.length) { stack.pop(); continue; }
      var choice = choices[Math.floor(Math.random() * choices.length)];
      var dir = choice[0], nr = choice[1], nc = choice[2];
      walls[current[0]][current[1]][dir] = false;
      walls[nr][nc][(dir + 2) % 4] = false;
      seen[nr][nc] = true;
      stack.push([nr, nc]);
    }
  }
  function draw() {
    mazeEl.replaceChildren();
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var x = c * CELL, y = r * CELL;
        var fill = r === 0 && c === 0 ? '#b7edca' : (r === SIZE - 1 && c === SIZE - 1 ? '#ffd8da' : '#fff');
        mazeEl.appendChild(node('rect', { x:x, y:y, width:CELL, height:CELL, fill:fill }));
        var sides = [
          [x,y,x+CELL,y], [x+CELL,y,x+CELL,y+CELL],
          [x,y+CELL,x+CELL,y+CELL], [x,y,x,y+CELL]
        ];
        for (var d = 0; d < 4; d++) {
          var isEntrance = (r === 0 && c === 0 && d === 3) || (r === SIZE - 1 && c === SIZE - 1 && d === 1);
          if (walls[r][c][d] && !isEntrance) {
            mazeEl.appendChild(node('line', {
              x1:sides[d][0], y1:sides[d][1], x2:sides[d][2], y2:sides[d][3],
              stroke:'#24573f', 'stroke-width':2.5
            }));
          }
        }
      }
    }
    mazeEl.appendChild(node('circle', { cx:col*CELL+CELL/2, cy:row*CELL+CELL/2, r:CELL*.31, fill:'#168a4a', stroke:'#fff', 'stroke-width':2 }));
  }
  function updateTimer() {
    if (!won) timerEl.textContent = Math.floor((Date.now() - startedAt) / 1000) + ' detik';
  }
  function startMaze() {
    if (timer) clearInterval(timer);
    generate();
    row = 0; col = 0; steps = 0; won = false; startedAt = Date.now();
    stepsEl.textContent = '0';
    status.textContent = 'Mulai dari titik hijau dan cari pintu keluar.';
    draw();
    updateTimer();
    timer = setInterval(updateTimer, 500);
  }
  function finish() {
    won = true;
    if (timer) clearInterval(timer);
    var seconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
    if (!best || seconds < best) {
      best = seconds;
      window.nvanplayStorage.setItem(KEY, String(best));
      bestEl.textContent = best + ' detik';
    }
    timerEl.textContent = seconds + ' detik';
    status.textContent = 'Berhasil keluar dalam ' + seconds + ' detik dan ' + steps + ' langkah!';
  }
  function move(direction) {
    if (won) return;
    if (walls[row][col][direction]) {
      status.textContent = 'Jalan tertutup. Coba arah lain.';
      return;
    }
    row += DIRS[direction][0];
    col += DIRS[direction][1];
    steps++;
    stepsEl.textContent = String(steps);
    draw();
    if (row === SIZE - 1 && col === SIZE - 1) { finish(); return; }
    status.textContent = 'Posisi baris ' + (row + 1) + ', kolom ' + (col + 1) + '.';
  }
  best = parseInt(window.nvanplayStorage.getItem(KEY), 10) || 0;
  bestEl.textContent = best ? best + ' detik' : '—';
  document.getElementById('new-maze').addEventListener('click', startMaze);
  document.querySelectorAll('[data-direction]').forEach(function (button) {
    button.addEventListener('click', function () { move(Number(button.dataset.direction)); });
  });
  document.addEventListener('keydown', function (event) {
    var map = { ArrowUp:0, ArrowRight:1, ArrowDown:2, ArrowLeft:3 };
    if (Object.prototype.hasOwnProperty.call(map, event.key)) {
      event.preventDefault();
      move(map[event.key]);
    }
  });
  startMaze();
})();