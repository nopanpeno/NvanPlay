// Ingat Urutan: ulangi urutan warna yang makin panjang.
(function () {
  var KEY = 'ingat-urutan:best';
  var pads = Array.from(document.querySelectorAll('.pad'));
  var levelEl = document.getElementById('level');
  var bestEl = document.getElementById('best');
  var messageEl = document.getElementById('message');
  var startBtn = document.getElementById('start');
  var sequence = [];
  var inputIndex = 0;
  var level = 1;
  var showing = false;
  var running = false;

  function loadBest() {
    try {
      var value = parseInt(window.nvanplayStorage.getItem(KEY), 10);
      return value > 0 ? value : 0;
    } catch (e) { return 0; }
  }

  function showBest() {
    bestEl.textContent = 'Rekor level: ' + loadBest();
  }

  function recordBest() {
    var best = loadBest();
    if (level > best) {
      try { window.nvanplayStorage.setItem(KEY, String(level)); } catch (e) { /* penyimpanan opsional */ }
      showBest();
    }
  }

  function flash(index) {
    pads[index].classList.add('lit');
    window.setTimeout(function () { pads[index].classList.remove('lit'); }, 260);
  }

  function playSequence(position) {
    if (!running) return;
    if (position >= sequence.length) {
      showing = false;
      messageEl.textContent = 'Giliran kamu!';
      return;
    }
    window.setTimeout(function () {
      if (!running) return;
      flash(sequence[position]);
      window.setTimeout(function () { playSequence(position + 1); }, 420);
    }, position === 0 ? 250 : 150);
  }

  function nextLevel() {
    showing = true;
    inputIndex = 0;
    sequence.push(Math.floor(Math.random() * pads.length));
    levelEl.textContent = 'Level: ' + level;
    messageEl.textContent = 'Perhatikan urutannya…';
    playSequence(0);
  }

  function endGame() {
    running = false;
    showing = false;
    pads.forEach(function (pad) { pad.disabled = true; });
    messageEl.textContent = 'Permainan selesai! Kamu mencapai level ' + (level - 1) + '.';
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
  }

  function start() {
    sequence = [];
    inputIndex = 0;
    level = 1;
    running = true;
    startBtn.hidden = true;
    pads.forEach(function (pad) { pad.disabled = false; });
    nextLevel();
  }

  pads.forEach(function (pad, index) {
    pad.addEventListener('click', function () {
      if (!running || showing) return;
      flash(index);
      if (index !== sequence[inputIndex]) {
        endGame();
        return;
      }
      inputIndex++;
      if (inputIndex === sequence.length) {
        recordBest();
        level++;
        showing = true;
        messageEl.textContent = 'Benar!';
        window.setTimeout(nextLevel, 650);
      }
    });
  });

  startBtn.addEventListener('click', start);
  pads.forEach(function (pad) { pad.disabled = true; });
  levelEl.textContent = 'Level: 1';
  showBest();
})();
