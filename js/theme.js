// Tombol mode gelap/terang. Pilihan disimpan di localStorage.
// Tanpa pilihan tersimpan, ikut pengaturan sistem.
(function () {
  var KEY = 'nvanplay:theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var t = root.dataset.theme;
    return t ? t === 'dark' : media.matches;
  }

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.textContent = 'Mode gelap';

  function update() {
    var dark = isDark();
    btn.textContent = dark ? 'Mode terang' : 'Mode gelap';
    btn.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    btn.setAttribute('aria-pressed', String(dark));
  }

  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) { /* abaikan */ }
    update();
    document.dispatchEvent(new CustomEvent('nvanplay:themechange', { detail: { theme: next } }));
  });

  media.addEventListener('change', update);

  var bar = document.querySelector('.site-header, .player-bar');
  if (bar) {
    bar.appendChild(btn);
    update();
  }
})();
