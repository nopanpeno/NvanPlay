// Tebak TTS. Isi susunan TTS dari petunjuk. Data di js/data/tebak-tts.js.
// Rekor = jumlah puzzle terbanyak diselesaikan dalam satu sesi. Disimpan di tebak-tts:best.
(function () {
  var KEY = 'tebak-tts:best';
  var gridEl = document.getElementById('grid');
  var acrossEl = document.getElementById('across');
  var downEl = document.getElementById('down');
  var kbd = document.getElementById('kbd');
  var statusEl = document.getElementById('status');
  var progressEl = document.getElementById('progress');
  var solvedEl = document.getElementById('solved');
  var bestEl = document.getElementById('best');
  var checkBtn = document.getElementById('check');
  var nextBtn = document.getElementById('next');

  var puzzle = null;
  var puzzleNo = 0;
  var cells = {};      // "r,c" -> { sol, input, num, entries: {across, down}, el }
  var entries = [];    // indeks sama dengan puzzle.words
  var active = -1;     // indeks entry aktif
  var currentKey = null;
  var solved = 0;
  var best = 0;
  var lastIndex = -1;

  function key(r, c) { return r + ',' + c; }
  function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }

  function loadBest() {
    try { best = Number(window.nvanplayStorage.getItem(KEY, 0)) || 0; } catch (e) { best = 0; }
    bestEl.textContent = 'Rekor terbaik: ' + best;
  }

  function saveBest() {
    try { window.nvanplayStorage.setItem(KEY, best); } catch (e) { /* abaikan */ }
  }

  function entryCells(idx) {
    var e = entries[idx];
    var out = [];
    for (var i = 0; i < e.answer.length; i++) {
      var r = e.row + (e.dir === 'down' ? i : 0);
      var c = e.col + (e.dir === 'across' ? i : 0);
      out.push(key(r, c));
    }
    return out;
  }

  function build(p) {
    puzzle = p;
    entries = p.words;
    cells = {};
    gridEl.replaceChildren();
    gridEl.style.gridTemplateColumns = 'repeat(' + p.cols + ', 1fr)';
    for (var r = 0; r < p.rows; r++) {
      for (var c = 0; c < p.cols; c++) {
        var cell = document.createElement('div');
        cell.className = 'cell blank';
        cell.dataset.r = r;
        cell.dataset.c = c;
        gridEl.append(cell);
        cells[key(r, c)] = { sol: null, input: '', num: 0, entries: {}, el: cell };
      }
    }
    entries.forEach(function (e, idx) {
      e.answer.split('').forEach(function (ch, i) {
        var r = e.row + (e.dir === 'down' ? i : 0);
        var c = e.col + (e.dir === 'across' ? i : 0);
        var cd = cells[key(r, c)];
        cd.sol = ch;
        cd.entries[e.dir] = idx;
        cd.el.classList.remove('blank');
        if (i === 0) cd.num = e.num;
      });
    });
    Object.keys(cells).forEach(function (k) {
      var cd = cells[k];
      if (cd.el.classList.contains('blank')) return;
      if (cd.num) {
        var n = document.createElement('span');
        n.className = 'num';
        n.textContent = cd.num;
        cd.el.append(n);
      }
      var letter = document.createElement('span');
      letter.className = 'letter';
      cd.el.append(letter);
    });
    renderClues();
    currentKey = null;
    active = -1;
    refresh();
  }

  function renderClues() {
    acrossEl.replaceChildren();
    downEl.replaceChildren();
    entries.forEach(function (e, idx) {
      var li = document.createElement('li');
      li.dataset.idx = idx;
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = e.num + '. ' + e.clue + ' (' + e.answer.length + ')';
      b.addEventListener('click', function () { focusEntry(idx); kbd.focus(); });
      li.append(b);
      (e.dir === 'across' ? acrossEl : downEl).append(li);
    });
  }

  function refresh() {
    var activeKeys = active >= 0 ? entryCells(active) : [];
    Object.keys(cells).forEach(function (k) {
      var cd = cells[k];
      if (cd.el.classList.contains('blank')) return;
      cd.el.classList.toggle('active', activeKeys.indexOf(k) >= 0);
      cd.el.classList.toggle('current', k === currentKey);
      cd.el.querySelector('.letter').textContent = cd.input;
    });
    document.querySelectorAll('#across li, #down li').forEach(function (li) {
      li.classList.toggle('on', Number(li.dataset.idx) === active);
    });
  }

  // Pilih entry dan kotak pertama yang kosong di dalamnya.
  function focusEntry(idx) {
    active = idx;
    var ks = entryCells(idx);
    var empty = ks.filter(function (k) { return !cells[k].input; })[0];
    currentKey = empty || ks[0];
    refresh();
  }

  // Klik kotak: pilih entry yang sama arahnya. Klik lagi di kotak yang sama: ganti arah.
  function selectCell(k) {
    var cd = cells[k];
    var curDir = active >= 0 ? entries[active].dir : 'across';
    var dir;
    if (k === currentKey) {
      dir = curDir === 'across' ? 'down' : 'across';
      if (cd.entries[dir] === undefined) dir = curDir;
    } else {
      dir = cd.entries[curDir] !== undefined ? curDir : (cd.entries.across !== undefined ? 'across' : 'down');
    }
    active = cd.entries[dir];
    currentKey = k;
    refresh();
  }

  function advance(step) {
    if (active < 0) return;
    var ks = entryCells(active);
    var i = ks.indexOf(currentKey) + step;
    if (i >= 0 && i < ks.length) { currentKey = ks[i]; refresh(); }
  }

  function typeLetter(ch) {
    if (!currentKey) return;
    cells[currentKey].input = ch;
    statusEl.textContent = '';
    refresh();
    advance(1);
  }

  function backspace() {
    if (!currentKey) return;
    var cd = cells[currentKey];
    if (cd.input) { cd.input = ''; refresh(); }
    else { advance(-1); cells[currentKey].input = ''; refresh(); }
  }

  gridEl.addEventListener('click', function (e) {
    var el = e.target.closest('.cell');
    if (!el || el.classList.contains('blank')) return;
    selectCell(key(el.dataset.r, el.dataset.c));
    kbd.focus();
  });

  kbd.addEventListener('input', function () {
    var v = kbd.value.slice(-1).toUpperCase();
    kbd.value = '';
    if (/^[A-Z]$/.test(v)) typeLetter(v);
  });

  kbd.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); advance(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); advance(-1); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (currentKey) selectCell(currentKey);
    }
  });

  function check() {
    var wrong = 0, filled = 0, total = 0;
    Object.keys(cells).forEach(function (k) {
      var cd = cells[k];
      if (cd.el.classList.contains('blank')) return;
      total++;
      cd.el.classList.remove('ok', 'bad');
      if (cd.input) filled++;
      if (cd.input) {
        if (cd.input === cd.sol) cd.el.classList.add('ok');
        else { cd.el.classList.add('bad'); wrong++; }
      }
    });
    if (filled === total && wrong === 0) return win();
    statusEl.textContent = wrong ? 'Ada ' + wrong + ' huruf salah. Coba lagi.' : 'Belum lengkap. Isi semua kotak dulu.';
  }

  function win() {
    solved++;
    solvedEl.textContent = solved;
    if (solved > best) { best = solved; saveBest(); bestEl.textContent = 'Rekor terbaik: ' + best; }
    statusEl.textContent = 'Benar semua! Lanjut ke puzzle berikutnya?';
    nextBtn.hidden = false;
    checkBtn.hidden = true;
  }

  function nextPuzzle() {
    var list = window.TEBAK_TTS_DATA;
    var idx;
    do { idx = Math.floor(Math.random() * list.length); } while (list.length > 1 && idx === lastIndex);
    lastIndex = idx;
    puzzleNo++;
    progressEl.textContent = 'Puzzle ' + puzzleNo;
    statusEl.textContent = '';
    nextBtn.hidden = true;
    checkBtn.hidden = false;
    build(list[idx]);
  }

  checkBtn.addEventListener('click', check);
  nextBtn.addEventListener('click', nextPuzzle);

  loadBest();
  nextPuzzle();
})();
