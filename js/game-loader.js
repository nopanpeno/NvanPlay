// Mulai kode game setelah pemutar mengirim data simpanan untuk game ini.
window.nvanplayStorage.ready.then(function () {
  var script = document.createElement('script');
  script.src = 'game.js';
  document.body.appendChild(script);
});
