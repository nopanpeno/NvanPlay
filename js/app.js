// Muat katalog dari games.json dan tampilkan sebagai kartu.
const catalog = document.getElementById('catalog');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function bestOf(id) {
  try {
    const v = parseInt(localStorage.getItem(id + ':best'), 10);
    return v > 0 ? v : null;
  } catch (e) {
    return null;
  }
}

function card(game, index) {
  const link = el('a', 'card');
  link.href = 'player.html?id=' + encodeURIComponent(game.id);
  if (/^#[0-9a-f]{6}$/i.test(game.color || '')) link.style.setProperty('--tile', game.color);

  const cover = el('img', 'card-cover');
  cover.src = 'games/' + encodeURIComponent(game.id) + '/cover.png';
  cover.alt = '';
  // Kartu pertama ada di layar saat dibuka, jadi jangan ditunda.
  cover.loading = index < 4 ? 'eager' : 'lazy';
  cover.addEventListener('error', () => cover.classList.add('no-cover'));

  const body = el('div', 'card-body');
  body.append(el('h2', 'card-title', game.title));
  body.append(el('p', 'card-desc', game.description));

  const best = bestOf(game.id);
  if (best) body.append(el('p', 'card-record', 'Rekormu: ' + best));

  const tags = el('ul', 'tags');
  (game.tags || []).forEach(t => tags.append(el('li', 'tag', t)));
  body.append(tags);

  link.append(cover, body);
  return link;
}

const filters = document.getElementById('filters');
const randomBtn = document.getElementById('random');
let allGames = [];
let query = '';
let activeTag = '';
let sortMode = 'default';

function matches(game) {
  if (activeTag && !(game.tags || []).includes(activeTag)) return false;
  if (!query) return true;
  const text = [game.title, game.description, ...(game.tags || [])].join(' ').toLowerCase();
  return text.includes(query);
}

function orderGames(games) {
  const ordered = [...games];
  if (sortMode === 'title') {
    return ordered.sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));
  }
  if (sortMode === 'recorded') {
    return ordered.sort((a, b) => {
      const aHasRecord = bestOf(a.id) !== null;
      const bHasRecord = bestOf(b.id) !== null;
      return Number(bHasRecord) - Number(aHasRecord) || a.title.localeCompare(b.title, 'id', { sensitivity: 'base' });
    });
  }
  return ordered;
}

function render() {
  catalog.replaceChildren();
  if (!allGames.length) {
    catalog.append(el('p', 'empty', 'Belum ada game.'));
    return;
  }
  const shown = allGames.filter(matches);
  const status = el('p', 'results-count', shown.length + ' dari ' + allGames.length + ' game ditampilkan');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  catalog.append(status);

  if (!shown.length) {
    catalog.append(el('p', 'empty', 'Tidak ada game yang cocok. Hapus pencarian atau filter untuk melihat semua game.'));
    return;
  }
  const grid = el('div', 'grid');
  orderGames(shown).forEach((g, i) => grid.append(card(g, i)));
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
    clearButton.hidden = !(query || activeTag);
    render();
  });

  const sortLabel = el('label', 'sort-control', 'Urutkan');
  const sortSelect = el('select', 'sort-select');
  sortSelect.setAttribute('aria-label', 'Urutkan game');
  [['default', 'Urutan awal'], ['title', 'Judul A–Z'], ['recorded', 'Rekor tersimpan dulu']].forEach(([value, label]) => {
    const option = el('option', '', label);
    option.value = value;
    sortSelect.append(option);
  });
  sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    render();
  });
  sortLabel.append(sortSelect);

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
      clearButton.hidden = !(query || activeTag);
      render();
    });
    chips.append(chip);
  });

  const clearButton = el('button', 'clear-filters', 'Hapus pencarian dan filter');
  clearButton.type = 'button';
  clearButton.hidden = true;
  clearButton.addEventListener('click', () => {
    query = '';
    activeTag = '';
    search.value = '';
    chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    clearButton.hidden = true;
    render();
    search.focus();
  });

  filters.replaceChildren(search, sortLabel, chips, clearButton);
}

fetch('games.json')
  .then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(games => {
    allGames = games;
    if (games.length) {
      buildFilters();
      randomBtn.disabled = false;
    }
    render();
  })
  .catch(() => {
    catalog.replaceChildren(el('p', 'empty', 'Katalog gagal dimuat.'));
  });

// Perbarui rekor setiap katalog ditampilkan kembali setelah bermain.
window.addEventListener('pageshow', () => {
  if (allGames.length) render();
});

randomBtn.addEventListener('click', () => {
  if (!allGames.length) return;
  const pick = allGames[Math.floor(Math.random() * allGames.length)];
  location.href = 'player.html?id=' + encodeURIComponent(pick.id);
});
