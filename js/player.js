// Pemutar: muat satu game dari katalog ke dalam iframe.
// Hanya id yang ada di games.json yang boleh dimuat.
const stage = document.getElementById('stage');
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
    // allow-same-origin supaya game bisa pakai localStorage.
    // Tanpa itu, localStorage error di iframe sandbox.
    frame.sandbox = 'allow-scripts allow-same-origin allow-forms';
    frame.src = 'games/' + encodeURIComponent(game.id) + '/index.html';
    stage.replaceChildren(frame);
  })
  .catch(() => fail('Katalog gagal dimuat.'));
