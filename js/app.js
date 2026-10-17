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

const filters = document.getElementById('filters');
let allGames = [];
let query = '';
let activeTag = '';

function matches(game) {
  if (activeTag && !(game.tags || []).includes(activeTag)) return false;
  if (!query) return true;
  const text = [game.title, game.description, ...(game.tags || [])].join(' ').toLowerCase();
  return text.includes(query);
}

function render() {
  catalog.replaceChildren();
  if (!allGames.length) {
    catalog.append(el('p', 'empty', 'Belum ada game.'));
    return;
  }
  const shown = allGames.filter(matches);
  if (!shown.length) {
    catalog.append(el('p', 'empty', 'Tidak ada game yang cocok.'));
    return;
  }
  const grid = el('div', 'grid');
  shown.forEach(g => grid.append(card(g)));
  catalog.append(grid);
}

function buildFilters() {
  const tags = [...new Set(allGames.flatMap(g => g.tags || []))].sort();

  const search = el('input', 'search');
  search.type = 'search';
  search.placeholder = 'Cari game…';
  search.setAttribute('aria-label', 'Cari game');
  search.addEventListener('input', () => {
    query = search.value.trim().toLowerCase();
    render();
  });

  const chips = el('div', 'chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'Saring per tag');
  tags.forEach(tag => {
    const chip = el('button', 'chip', tag);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      activeTag = activeTag === tag ? '' : tag;
      chips.querySelectorAll('.chip').forEach(c =>
        c.setAttribute('aria-pressed', String(c.textContent === activeTag)));
      render();
    });
    chips.append(chip);
  });

  filters.replaceChildren(search, chips);
}

fetch('games.json')
  .then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(games => {
    allGames = games;
    if (games.length) buildFilters();
    render();
  })
  .catch(() => {
    catalog.replaceChildren(el('p', 'empty', 'Katalog gagal dimuat.'));
  });
