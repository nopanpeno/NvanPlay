// Ular Tangga lokal sederhana untuk 2-4 pemain di satu perangkat.
(function () {
  'use strict';

  var SVG = 'http://www.w3.org/2000/svg';
  var ORIGIN = 50;
  var CELL = 50;
  var LADDERS = { 2: 23, 8: 34, 20: 77, 32: 68, 41: 79, 74: 88, 82: 100 };
  var SNAKES = { 29: 9, 38: 15, 47: 5, 53: 33, 62: 37, 86: 54, 97: 25 };
  var COLORS = [
    { name: 'Merah', fill: '#ef4444' },
    { name: 'Biru', fill: '#3b82f6' },
    { name: 'Hijau', fill: '#22c55e' },
    { name: 'Kuning', fill: '#eab308' }
  ];
  var BASES_FOR_COUNT = { 2: [0, 2], 3: [0, 1, 2], 4: [0, 1, 2, 3] };

  var countSelect = document.getElementById('player-count');
  var nameList = document.getElementById('name-list');
  var setup = document.getElementById('setup');
  var game = document.getElementById('game');
  var turnLabel = document.getElementById('turn');
  var diceLabel = document.getElementById('dice');
  var status = document.getElementById('status');
  var board = document.getElementById('board');
  var playerList = document.getElementById('player-list');
  var rollButton = document.getElementById('roll');
  var players = [];
  var current = 0;
  var finished = false;

  function svgNode(tag, attributes, text) {
    var node = document.createElementNS(SVG, tag);
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function tileCenter(number) {
    var rowFromBottom = Math.floor((number - 1) / 10);
    var offset = (number - 1) % 10;
    var col = rowFromBottom % 2 === 0 ? offset : 9 - offset;
    var row = 9 - rowFromBottom;
    return [ORIGIN + col * CELL + CELL / 2, ORIGIN + row * CELL + CELL / 2];
  }

  function drawLadder(from, to) {
    var a = tileCenter(from), b = tileCenter(to);
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var length = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / length * 8, ny = dx / length * 8;
    var group = svgNode('g', { fill: 'none', stroke: '#438563', 'stroke-width': 4, 'stroke-linecap': 'round' });
    group.appendChild(svgNode('line', { x1: a[0] + nx, y1: a[1] + ny, x2: b[0] + nx, y2: b[1] + ny }));
    group.appendChild(svgNode('line', { x1: a[0] - nx, y1: a[1] - ny, x2: b[0] - nx, y2: b[1] - ny }));
    for (var step = 1; step <= 6; step++) {
      var t = step / 7, x = a[0] + dx * t, y = a[1] + dy * t;
      group.appendChild(svgNode('line', { x1: x + nx, y1: y + ny, x2: x - nx, y2: y - ny }));
    }
    board.appendChild(group);
  }

  function drawSnake(from, to, index) {
    var a = tileCenter(from), b = tileCenter(to);
    var bend = index % 2 === 0 ? 42 : -42;
    var d = 'M ' + a[0] + ' ' + a[1] + ' C ' + (a[0] + bend) + ' ' + (a[1] + 8) + ', ' + (b[0] - bend) + ' ' + (b[1] - 8) + ', ' + b[0] + ' ' + b[1];
    board.appendChild(svgNode('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 12, 'stroke-linecap': 'round' }));
    board.appendChild(svgNode('path', { d: d, fill: 'none', stroke: '#d94f5c', 'stroke-width': 7, 'stroke-linecap': 'round' }));
    board.appendChild(svgNode('circle', { cx: a[0], cy: a[1], r: 11, fill: '#d94f5c', stroke: '#fff', 'stroke-width': 2 }));
    board.appendChild(svgNode('circle', { cx: a[0] - 3, cy: a[1] - 2, r: 1.7, fill: '#fff' }));
    board.appendChild(svgNode('circle', { cx: a[0] + 3, cy: a[1] - 2, r: 1.7, fill: '#fff' }));
  }

  function drawBoard() {
    board.replaceChildren();
    board.appendChild(svgNode('rect', { x: 42, y: 42, width: 516, height: 516, rx: 12, fill: '#fff', stroke: '#d8d4e8', 'stroke-width': 3 }));

    var ladderStarts = Object.keys(LADDERS).map(Number);
    var ladderEnds = Object.keys(LADDERS).map(function (key) { return LADDERS[key]; });
    var snakeStarts = Object.keys(SNAKES).map(Number);
    var snakeEnds = Object.keys(SNAKES).map(function (key) { return SNAKES[key]; });
    for (var number = 1; number <= 100; number++) {
      var center = tileCenter(number), x = center[0] - CELL / 2, y = center[1] - CELL / 2;
      var fill = (Math.floor((number - 1) / 10) + ((number - 1) % 10)) % 2 === 0 ? '#fff' : '#eeeaf7';
      if (ladderStarts.includes(number)) fill = '#dff2e6';
      if (snakeStarts.includes(number)) fill = '#ffe4e6';
      board.appendChild(svgNode('rect', { x: x, y: y, width: CELL, height: CELL, fill: fill, stroke: '#d8d4e8', 'stroke-width': 1 }));
    }

    Object.keys(LADDERS).forEach(function (from) { drawLadder(Number(from), LADDERS[from]); });
    Object.keys(SNAKES).forEach(function (from, index) { drawSnake(Number(from), SNAKES[from], index); });

    for (var label = 1; label <= 100; label++) {
      var point = tileCenter(label);
      board.appendChild(svgNode('text', {
        x: point[0] + 17, y: point[1] - 16, fill: '#514c63',
        'font-size': 10, 'font-family': 'system-ui, sans-serif', 'text-anchor': 'end'
      }, String(label)));
    }

    var offsets = [[-8, 8], [8, -8], [8, 8], [-8, -8]];
    players.forEach(function (player, index) {
      var point = tileCenter(player.position);
      var offset = offsets[index] || [0, 0];
      board.appendChild(svgNode('circle', {
        cx: point[0] + offset[0], cy: point[1] + offset[1], r: 10,
        fill: player.color.fill, stroke: '#fff', 'stroke-width': 2
      }));
    });
  }

  function createNameInputs() {
    nameList.replaceChildren();
    var indexes = BASES_FOR_COUNT[Number(countSelect.value)];
    indexes.forEach(function (colorIndex, index) {
      var labelText = 'Pemain ' + (index + 1) + ' — ' + COLORS[colorIndex].name;
      var label = document.createElement('label');
      label.textContent = labelText;
      var input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 16;
      input.autocomplete = 'off';
      input.value = 'Pemain ' + (index + 1);
      input.dataset.colorIndex = String(colorIndex);
      input.setAttribute('aria-label', labelText);
      label.appendChild(input);
      nameList.appendChild(label);
    });
  }

  function renderPlayers() {
    playerList.replaceChildren();
    players.forEach(function (player, index) {
      var row = document.createElement('li');
      row.className = 'player-card' + (index === current && !finished ? ' active' : '');
      var dot = document.createElement('span');
      dot.className = 'player-dot';
      dot.setAttribute('aria-hidden', 'true');
      dot.style.backgroundColor = player.color.fill;
      var copy = document.createElement('span');
      copy.className = 'player-copy';
      var name = document.createElement('strong');
      name.className = 'player-name';
      name.textContent = player.name;
      var position = document.createElement('span');
      position.className = 'player-position';
      position.textContent = 'Kotak ' + player.position;
      copy.append(name, position);
      row.append(dot, copy);
      playerList.appendChild(row);
    });
  }

  function render() {
    var player = players[current];
    turnLabel.textContent = finished ? 'Pemenang: ' + player.name : 'Giliran ' + player.name;
    rollButton.disabled = finished;
    drawBoard();
    renderPlayers();
  }

  function startGame() {
    var inputs = nameList.querySelectorAll('input');
    players = Array.from(inputs).map(function (input, index) {
      return {
        name: input.value.trim() || 'Pemain ' + (index + 1),
        color: COLORS[Number(input.dataset.colorIndex)],
        position: 1
      };
    });
    current = 0;
    finished = false;
    diceLabel.textContent = 'Dadu: —';
    status.textContent = 'Game dimulai di kotak 1. Lempar dadu untuk bergerak.';
    setup.hidden = true;
    game.hidden = false;
    render();
    rollButton.focus();
  }

  function nextTurn() {
    current = (current + 1) % players.length;
  }

  function takeTurn() {
    if (finished) return;
    var player = players[current];
    var roll = Math.floor(Math.random() * 6) + 1;
    var target = player.position + roll;
    diceLabel.textContent = 'Dadu: ' + roll;
    diceLabel.setAttribute('aria-label', 'Hasil dadu: ' + roll);

    if (target > 100) {
      status.textContent = player.name + ' perlu angka tepat ' + (100 - player.position) + ' untuk sampai ke kotak 100.';
    } else {
      player.position = target;
      if (LADDERS[player.position]) {
        status.textContent = player.name + ' naik tangga dari ' + player.position + ' ke ' + LADDERS[player.position] + '.';
        player.position = LADDERS[player.position];
      } else if (SNAKES[player.position]) {
        status.textContent = player.name + ' turun ular dari ' + player.position + ' ke ' + SNAKES[player.position] + '.';
        player.position = SNAKES[player.position];
      } else {
        status.textContent = player.name + ' maju ke kotak ' + player.position + '.';
      }
    }

    if (player.position === 100) {
      finished = true;
      status.textContent = player.name + ' sampai kotak 100 dan menang!';
      render();
      return;
    }
    if (roll === 6) {
      status.textContent += ' Dapat 6, lempar lagi.';
    } else {
      nextTurn();
    }
    render();
  }

  document.getElementById('start').addEventListener('click', startGame);
  document.getElementById('new-game').addEventListener('click', function () {
    game.hidden = true;
    setup.hidden = false;
    document.getElementById('start').focus();
  });
  countSelect.addEventListener('change', createNameInputs);
  rollButton.addEventListener('click', takeTurn);
  createNameInputs();
})();
