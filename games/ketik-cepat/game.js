// Ketik Cepat. Ketik kalimat yang tampil secepat mungkin dalam 30 detik.
// Skor = jumlah kata dari kalimat yang diketik benar. Rekor = skor terbaik.
(function () {
  var DURATION = 30000;
  var KEY = 'ketik-cepat:best';
  var SENTENCES = [
    'Hari ini cuaca cerah sekali.',
    'Saya suka membaca buku di sore hari.',
    'Adik makan nasi goreng dengan telur.',
    'Kereta api berangkat tepat waktu pagi ini.',
    'Langit malam penuh dengan bintang.',
    'Ibu membuat kue untuk acara keluarga.',
    'Jangan lupa membawa payung hari ini.',
    'Anak-anak bermain bola di lapangan desa.',
    'Sungai itu mengalir jernih sampai ke laut.',
    'Kopi hangat cocok untuk pagi yang dingin.',
    'Teman saya pandai sekali bermain gitar.',
    'Pasar malam selalu ramai pengunjung.'
  ];

  var textEl = document.getElementById('text');
  var input = document.getElementById('input');
  var timeEl = document.getElementById('time');
  var scoreEl = document.getElementById('score');
  var msg = document.getElementById('msg');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('start');

  var sentence = '';
  var score = 0;
  var startAt = 0;
  var timer = null;
  var running = false;

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
    bestEl.textContent = b ? 'Terbaik: ' + b + ' kata' : '';
  }

  // Warnai tiap huruf: hijau kalau benar, merah kalau salah.
  function render() {
    var typed = input.value;
    textEl.replaceChildren();
    sentence.split('').forEach(function (ch, i) {
      var span = document.createElement('span');
      span.textContent = ch;
      if (i < typed.length) span.className = typed[i] === ch ? 'ok' : 'bad';
      textEl.appendChild(span);
    });
  }

  function nextSentence() {
    var pick;
    do {
      pick = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    } while (pick === sentence && SENTENCES.length > 1);
    sentence = pick;
    input.value = '';
    render();
  }

  input.addEventListener('input', function () {
    if (!running) return;
    if (input.value === sentence) {
      score += sentence.split(' ').length;
      scoreEl.textContent = 'Skor: ' + score;
      nextSentence();
      return;
    }
    render();
  });

  function tick() {
    var left = DURATION - (performance.now() - startAt);
    if (left <= 0) return finish();
    timeEl.textContent = 'Waktu: ' + Math.ceil(left / 1000);
  }

  function finish() {
    clearInterval(timer);
    running = false;
    input.disabled = true;
    timeEl.textContent = 'Waktu: 0';
    var best = loadBest();
    var record = score > 0 && (!best || score > best);
    if (record) saveBest(score);
    showBest();
    msg.textContent = 'Waktu habis! Skor ' + score + ' kata' + (record ? '. Rekor baru!' : '.');
    startBtn.textContent = 'Main lagi';
    startBtn.hidden = false;
    startBtn.focus();
  }

  function start() {
    if (running) return;
    score = 0;
    running = true;
    scoreEl.textContent = 'Skor: 0';
    msg.textContent = '';
    startBtn.hidden = true;
    input.disabled = false;
    nextSentence();
    input.focus();
    startAt = performance.now();
    timeEl.textContent = 'Waktu: 30';
    timer = setInterval(tick, 100);
  }

  startBtn.addEventListener('click', start);
  showBest();
})();
