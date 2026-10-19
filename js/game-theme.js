// Tema untuk game di dalam pemutar. Muat di <head> game, setelah css/game.css:
//   <script src="../../js/game-theme.js"></script>
// Pemutar mengirim tema pilihan pemain lewat #theme=dark|light di alamat (supaya tidak berkedip)
// dan lewat pesan saat tombol tema ditekan. Tanpa pilihan, game ikut pengaturan sistem.
(function () {
  var root = document.documentElement;

  function apply(theme) {
    if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
    else delete root.dataset.theme;
  }

  var fromHash = /[#&]theme=(dark|light)\b/.exec(location.hash);
  if (fromHash) apply(fromHash[1]);

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent) return;
    var message = event.data;
    if (message && message.app === 'nvanplay' && message.type === 'theme:set') apply(message.theme);
  });
})();
