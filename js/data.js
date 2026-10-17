// Ekspor dan impor data pemain (localStorage). Hanya kunci milik game di katalog.
// Kunci game selalu diawali "<id-game>:" (aturan kontrak game).
const FORMAT = 'nvanplay';
const VERSION = 1;
const MAX_FILE = 1024 * 1024; // 1 MB
const MAX_VALUE = 10000;      // karakter per nilai

const summary = document.getElementById('summary');
const exportBtn = document.getElementById('export');
const fileInput = document.getElementById('file');
const status = document.getElementById('status');

let ids = [];

function say(message, isError) {
  status.textContent = message;
  status.classList.toggle('error', !!isError);
}

function isGameKey(key) {
  return ids.some(id => key.startsWith(id + ':'));
}

function collect() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (isGameKey(key)) data[key] = localStorage.getItem(key);
  }
  return data;
}

function refresh() {
  let count = 0;
  try { count = Object.keys(collect()).length; } catch (e) {
    summary.textContent = 'Browser ini tidak mengizinkan penyimpanan lokal.';
    exportBtn.disabled = true;
    return;
  }
  summary.textContent = count
    ? count + ' data tersimpan dari game.'
    : 'Belum ada data tersimpan. Main dulu, lalu kembali ke sini.';
  exportBtn.disabled = count === 0;
}

function doExport() {
  const payload = {
    app: FORMAT,
    version: VERSION,
    exported: new Date().toISOString(),
    data: collect()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nvanplay-data-' + payload.exported.slice(0, 10) + '.json';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  say('Cadangan diunduh: ' + Object.keys(payload.data).length + ' data.');
}

function doImport(file) {
  if (file.size > MAX_FILE) return say('File terlalu besar (maksimal 1 MB).', true);
  file.text().then(text => {
    let payload;
    try { payload = JSON.parse(text); } catch (e) {
      return say('File bukan JSON yang valid.', true);
    }
    const ok = payload && payload.app === FORMAT && payload.version === VERSION &&
      payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data);
    if (!ok) return say('Ini bukan file cadangan NvanPlay.', true);

    const entries = Object.entries(payload.data);
    const eligible = entries.filter(([key, value]) =>
      isGameKey(key) && typeof value === 'string' && value.length <= MAX_VALUE
    );
    const skipped = entries.length - eligible.length;
    const previous = new Map();
    const written = [];

    try {
      // Ambil semua nilai lama sebelum menulis agar kegagalan bisa dibatalkan.
      for (const [key] of eligible) previous.set(key, localStorage.getItem(key));
      for (const [key, value] of eligible) {
        localStorage.setItem(key, value);
        written.push(key);
      }
    } catch (e) {
      let rollbackFailed = false;
      for (const key of written.reverse()) {
        try {
          const oldValue = previous.get(key);
          if (oldValue === null) localStorage.removeItem(key);
          else localStorage.setItem(key, oldValue);
        } catch (rollbackError) {
          rollbackFailed = true;
        }
      }
      refresh();
      return say(
        rollbackFailed
          ? 'Gagal menyimpan dan pemulihan otomatis tidak tuntas.'
          : 'Gagal menyimpan. Perubahan impor dibatalkan.',
        true
      );
    }
    refresh();
    say('Dipulihkan: ' + eligible.length + ' data' + (skipped ? ', dilewati: ' + skipped : '') + '.', !eligible.length && skipped > 0);
  }).catch(() => say('File tidak bisa dibaca.', true))
    .finally(() => { fileInput.value = ''; });
}

exportBtn.addEventListener('click', doExport);
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) doImport(fileInput.files[0]);
});

fetch('games.json')
  .then(r => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(games => {
    ids = games.map(g => g.id);
    refresh();
  })
  .catch(() => {
    summary.textContent = 'Katalog gagal dimuat.';
  });
