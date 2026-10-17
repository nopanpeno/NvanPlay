// Muat katalog dari games.json dan tampilkan sebagai kartu.
const catalog = document.getElementById('catalog');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function card(game) {
  const link = el('a', 'card');
  link.href = 'player.html?id=' + encodeURIComponent(game.id);

  const cover = el('img', 'card-cover');
  cover.src = 'games/' + encodeURIComponent(game.id) + '/cover.png';
  cover.alt = '';
  cover.loading = 'lazy';
  cover.addEventListener('error', () => cover.classList.add('no-cover'));

  const body = el('div', 'card-body');
  body.append(el('h2', 'card-title', game.title));
  body.append(el('p', 'card-desc', game.description));

  const tags = el('ul', 'tags');
  (game.tags || []).forEach(t => tags.append(el('li', 'tag', t)));
  body.append(tags);

  link.append(cover, body);
  return link;
}

function render(games) {
  catalog.replaceChildren();
  if (!games.length) {
    catalog.append(el('p', 'empty', 'Belum ada game.'));
    return;
  }
  const grid = el('div', 'grid');
  games.forEach(g => grid.append(card(g)));
  catalog.append(grid);
}

fetch('games.json')
  .then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(render)
  .catch(() => {
    catalog.replaceChildren(el('p', 'empty', 'Katalog gagal dimuat.'));
  });
