// Suit lawan komputer. Skor terbaik = kemenangan beruntun terpanjang.
(function () {
  var KEY = 'suit:best';
  var CHOICES = [
    { id: 'batu', name: 'Batu', icon: '✊', beats: 'gunting' },
    { id: 'gunting', name: 'Gunting', icon: '✌️', beats: 'kertas' },
    { id: 'kertas', name: 'Kertas', icon: '✋', beats: 'batu' }
  ];

  var box = document.getElementById('choices');
  var youEl = document.getElementById('you');
  var youName = document.getElementById('you-name');
  var cpuEl = document.getElementById('cpu');
  var cpuName = document.getElementById('cpu-name');
  var msg = document.getElementById('msg');
  var scoreEl = document.getElementById('score');
  var streakEl = document.getElementById('streak');
  var bestEl = document.getElementById('best');

  var win = 0, draw = 0, lose = 0, streak = 0;

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
    bestEl.textContent = b ? 'Rekor beruntun: ' + b : '';
  }

  function render() {
    scoreEl.textContent = 'Menang ' + win + ' · Seri ' + draw + ' · Kalah ' + lose;
    streakEl.textContent = 'Beruntun: ' + streak;
  }

  function play(you) {
    var cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    youEl.textContent = you.icon; youName.textContent = you.name;
    cpuEl.textContent = cpu.icon; cpuName.textContent = cpu.name;

    if (you.id === cpu.id) {
      draw++;
      msg.textContent = 'Seri.';
    } else if (you.beats === cpu.id) {
      win++; streak++;
      msg.textContent = 'Kamu menang!';
      var best = loadBest();
      if (!best || streak > best) { saveBest(streak); showBest(); }
    } else {
      lose++; streak = 0;
      msg.textContent = 'Kamu kalah.';
    }
    render();
  }

  CHOICES.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.id = c.id;
    var icon = document.createElement('span');
    icon.textContent = c.icon;
    icon.setAttribute('aria-hidden', 'true');
    b.append(icon, c.name);
    b.addEventListener('click', function () { play(c); });
    box.appendChild(b);
  });

  render();
  showBest();
})();
