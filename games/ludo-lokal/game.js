// Ludo lokal sederhana: satu bidak untuk tiap pemain, 2-4 pemain satu perangkat.
(function () {
  'use strict';

  var SVG = 'http://www.w3.org/2000/svg';
  var ORIGIN = 48;
  var CELL = 36;
  var TRACK_LENGTH = 52;
  var HOME_FINISH = 58;
  var COLORS = [
    { name: 'Merah', fill: '#ef4444', pale: '#fee2e2', entry: 5, base: [1, 1], lane: [[5,1],[5,2],[5,3],[5,4],[5,5],[5,6]] },
    { name: 'Biru', fill: '#3b82f6', pale: '#dbeafe', entry: 18, base: [9, 1], lane: [[12,5],[11,5],[10,5],[9,5],[8,5],[7,5]] },
    { name: 'Hijau', fill: '#22c55e', pale: '#dcfce7', entry: 31, base: [9, 9], lane: [[8,12],[8,11],[8,10],[8,9],[8,8],[8,7]] },
    { name: 'Kuning', fill: '#eab308', pale: '#fef9c3', entry: 44, base: [1, 9], lane: [[1,8],[2,8],[3,8],[4,8],[5,8],[6,8]] }
  ];
  var PATH = makePath();
  var SAFE_SQUARES = COLORS.map(function (color) { return color.entry; });
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

  function makePath() {
    var path = [];
    for (var x = 0; x <= 13; x++) path.push([x, 0]);
    for (var y = 1; y <= 13; y++) path.push([13, y]);
    for (var bottomX = 12; bottomX >= 0; bottomX--) path.push([bottomX, 13]);
    for (var leftY = 12; leftY >= 1; leftY--) path.push([0, leftY]);
    return path;
  }

  function svgNode(tag, attributes) {
    var node = document.createElementNS(SVG, tag);
    Object.keys(attributes || {}).forEach(function (key) {
      node.setAttribute(key, attributes[key]);
    });
    return node;
  }

  function unitX(x) { return ORIGIN + x * CELL; }
  function unitY(y) { return ORIGIN + y * CELL; }
  function centerOf(point) {
    return [unitX(point[0]) + CELL / 2, unitY(point[1]) + CELL / 2];
  }

  function drawBoard() {
    board.replaceChildren();
    board.appendChild(svgNode('rect', { x: 22, y: 22, width: 556, height: 556, rx: 22, fill: '#fff', stroke: '#d8d4e8', 'stroke-width': 3 }));

    COLORS.forEach(function (color) {
      board.appendChild(svgNode('rect', {
        x: unitX(color.base[0]), y: unitY(color.base[1]), width: CELL * 4, height: CELL * 4,
        rx: 14, fill: color.pale
      }));
    });

    PATH.forEach(function (point, index) {
      var start = COLORS.findIndex(function (color) { return color.entry === index; });
      board.appendChild(svgNode('rect', {
        x: unitX(point[0]), y: unitY(point[1]), width: CELL - 3, height: CELL - 3, rx: 4,
        fill: start >= 0 ? COLORS[start].fill : '#e8e6ef',
        stroke: '#fff', 'stroke-width': 1
      }));
    });

    COLORS.forEach(function (color) {
      color.lane.forEach(function (point) {
        board.appendChild(svgNode('rect', {
          x: unitX(point[0]), y: unitY(point[1]), width: CELL - 3, height: CELL - 3, rx: 4,
          fill: color.pale, stroke: color.fill, 'stroke-width': 1.5
        }));
      });
      var baseCenter = basePosition(color);
      board.appendChild(svgNode('circle', {
        cx: baseCenter[0], cy: baseCenter[1], r: 29, fill: color.fill, stroke: '#fff', 'stroke-width': 4
      }));
    });

    var cx = 300, cy = 300;
    board.appendChild(svgNode('polygon', { points: '300,258 342,300 300,300', fill: COLORS[1].pale }));
    board.appendChild(svgNode('polygon', { points: '258,300 300,258 300,300', fill: COLORS[0].pale }));
    board.appendChild(svgNode('polygon', { points: '300,342 258,300 300,300', fill: COLORS[3].pale }));
    board.appendChild(svgNode('polygon', { points: '342,300 300,342 300,300', fill: COLORS[2].pale }));
    board.appendChild(svgNode('circle', { cx: cx, cy: cy, r: 8, fill: '#6d4bd1' }));

    players.forEach(function (player, index) {
      var point = playerPosition(player);
      var offsets = [[0, 0], [-8, 8], [8, -8], [8, 8]];
      var offset = offsets[index] || [0, 0];
      board.appendChild(svgNode('circle', {
        cx: point[0] + offset[0], cy: point[1] + offset[1], r: 13,
        fill: player.color.fill, stroke: '#fff', 'stroke-width': 3
      }));
    });
  }

  function basePosition(color) {
    return [unitX(color.base[0] + 2) + CELL / 2, unitY(color.base[1] + 2) + CELL / 2];
  }

  function playerPosition(player) {
    if (player.progress < 0) return basePosition(player.color);
    if (player.progress < TRACK_LENGTH) {
      var trackIndex = (player.color.entry + player.progress) % TRACK_LENGTH;
      return centerOf(PATH[trackIndex]);
    }
    if (player.progress < HOME_FINISH) {
      return centerOf(player.color.lane[player.progress - TRACK_LENGTH]);
    }
    return [300, 300];
  }

  function createNameInputs() {
    nameList.replaceChildren();
    var count = Number(countSelect.value);
    var colorIndexes = BASES_FOR_COUNT[count];
    colorIndexes.forEach(function (colorIndex, index) {
      var label = document.createElement('label');
      label.textContent = 'Pemain ' + (index + 1) + ' — ' + COLORS[colorIndex].name;
      var input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 16;
      input.autocomplete = 'off';
      input.value = 'Pemain ' + (index + 1);
      input.dataset.colorIndex = String(colorIndex);
      input.setAttribute('aria-label', label.textContent);
      label.appendChild(input);
      nameList.appendChild(label);
    });
  }

  function progressText(player) {
    if (player.progress < 0) return 'Di markas';
    if (player.progress < TRACK_LENGTH) return 'Di lintasan';
    if (player.progress < HOME_FINISH) return 'Jalur rumah ' + (player.progress - TRACK_LENGTH + 1) + '/6';
    return 'Sampai rumah';
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
      position.textContent = progressText(player);
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
      var color = COLORS[Number(input.dataset.colorIndex)];
      return {
        name: input.value.trim() || 'Pemain ' + (index + 1),
        color: color,
        progress: -1
      };
    });
    current = 0;
    finished = false;
    diceLabel.textContent = 'Dadu: —';
    status.textContent = 'Game dimulai. Lempar dadu untuk mulai.';
    setup.hidden = true;
    game.hidden = false;
    render();
    rollButton.focus();
  }

  function nextTurn() {
    current = (current + 1) % players.length;
  }

  function capturedPlayers(mover) {
    if (mover.progress < 0 || mover.progress >= TRACK_LENGTH) return [];
    var square = (mover.color.entry + mover.progress) % TRACK_LENGTH;
    if (SAFE_SQUARES.includes(square)) return [];
    var captured = [];
    players.forEach(function (other) {
      if (other === mover || other.progress < 0 || other.progress >= TRACK_LENGTH) return;
      var otherSquare = (other.color.entry + other.progress) % TRACK_LENGTH;
      if (otherSquare === square) {
        other.progress = -1;
        captured.push(other.name);
      }
    });
    return captured;
  }

  function takeTurn() {
    if (finished) return;
    var player = players[current];
    var roll = Math.floor(Math.random() * 6) + 1;
    diceLabel.textContent = 'Dadu: ' + roll;

    if (player.progress < 0) {
      if (roll !== 6) {
        status.textContent = player.name + ' perlu angka 6 untuk keluar dari markas.';
        nextTurn();
        render();
        return;
      }
      player.progress = 0;
      status.textContent = player.name + ' dapat 6 dan keluar dari markas.';
    } else {
      var nextProgress = player.progress + roll;
      if (nextProgress > HOME_FINISH) {
        status.textContent = player.name + ' perlu angka tepat ' + (HOME_FINISH - player.progress) + ' untuk sampai rumah.';
        if (roll !== 6) nextTurn();
        render();
        return;
      }
      player.progress = nextProgress;
      var captured = capturedPlayers(player);
      status.textContent = player.name + ' maju ' + roll + ' langkah.';
      if (captured.length) status.textContent += ' ' + captured.join(' dan ') + ' kembali ke markas.';
    }

    if (player.progress === HOME_FINISH) {
      finished = true;
      status.textContent = player.name + ' sampai rumah dan menang!';
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
