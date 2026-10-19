// Pemutar: muat satu game dari katalog ke dalam iframe.
// Hanya id yang ada di games.json yang boleh dimuat.
const stage = document.getElementById('stage');

function installStorageBridge(frame, game) {
  const prefix = game.id + ':';

  function sendState() {
    const values = Object.create(null);
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) values[key] = localStorage.getItem(key);
      }
    } catch (e) {
      // Game tetap berjalan tanpa nilai tersimpan jika storage tidak tersedia.
    }
    frame.contentWindow.postMessage({ app: 'nvanplay', type: 'storage:init', prefix, values }, '*');
  }

  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow) return;
    const message = event.data;
    if (!message || message.app !== 'nvanplay') return;
    if (message.type === 'storage:request') {
      sendState();
      return;
    }
    if (message.type !== 'storage:set' || typeof message.key !== 'string' ||
        !message.key.startsWith(prefix) || message.key.length > 256 ||
        typeof message.value !== 'string' || message.value.length > 10000) return;
    try { localStorage.setItem(message.key, message.value); } catch (e) {
      // Skor terbaik bersifat opsional; game tetap berjalan saat storage penuh.
    }
  });
}
const titleEl = document.getElementById('game-title');

function fail(message) {
  titleEl.textContent = 'Game tidak ditemukan';
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = message;
  stage.replaceChildren(p);
}

const id = new URLSearchParams(location.search).get('id');

fetch('games.json')
  .then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(games => {
    const game = games.find(g => g.id === id);
    if (!game) return fail('Game tidak ada di katalog.');

    document.title = game.title + ' · NvanPlay';
    titleEl.textContent = game.title;

    const frame = document.createElement('iframe');
    frame.className = 'game-frame';
    frame.title = game.title;
    // Opaque origin menjaga game terpisah dari DOM dan storage situs utama.
    frame.sandbox = 'allow-scripts allow-forms';
    installStorageBridge(frame, game);
    // Game ikut pilihan tema pemain: lewat alamat saat dimuat, lewat pesan saat tombol ditekan.
    const chosen = document.documentElement.dataset.theme;
    const themeHash = chosen === 'dark' || chosen === 'light' ? '#theme=' + chosen : '';
    frame.src = 'games/' + encodeURIComponent(game.id) + '/index.html' + themeHash;
    document.addEventListener('nvanplay:themechange', event => {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({ app: 'nvanplay', type: 'theme:set', theme: event.detail.theme }, '*');
      }
    });
    // Fokus ke game supaya tombol panah dan spasi langsung sampai tanpa klik dulu.
    frame.addEventListener('load', () => frame.focus());
    stage.replaceChildren(frame);
  })
  .catch(() => fail('Katalog gagal dimuat.'));
