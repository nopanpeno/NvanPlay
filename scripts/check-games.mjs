// Cek kontrak game: node scripts/check-games.mjs
// Keluar dengan kode 1 kalau ada pelanggaran. Tanpa dependensi.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX_FOLDER = 5 * 1024 * 1024;
const MAX_COVER = 200 * 1024;
const problems = [];
const fail = (id, msg) => problems.push(`[${id}] ${msg}`);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

let games;
try {
  games = JSON.parse(readFileSync('games.json', 'utf8'));
} catch (e) {
  console.error('games.json tidak bisa dibaca: ' + e.message);
  process.exit(1);
}
if (!Array.isArray(games)) {
  console.error('games.json harus berupa array.');
  process.exit(1);
}

const seen = new Set();
for (const g of games) {
  const id = g && g.id;
  if (typeof id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    fail(String(id), 'id harus huruf kecil, angka, dan tanda hubung.');
    continue;
  }
  if (seen.has(id)) fail(id, 'id dobel.');
  seen.add(id);

  for (const f of ['title', 'description', 'author', 'license']) {
    if (typeof g[f] !== 'string' || !g[f].trim()) fail(id, `field "${f}" wajib berupa teks.`);
  }
  if (!Array.isArray(g.tags) || !g.tags.length || !g.tags.every(t => typeof t === 'string' && t.trim())) {
    fail(id, 'field "tags" wajib berupa daftar teks, minimal satu.');
  }
  if (typeof g.touch !== 'boolean') fail(id, 'field "touch" wajib true atau false.');

  const dir = join('games', id);
  if (!existsSync(dir)) { fail(id, `folder ${dir} tidak ada.`); continue; }
  if (!existsSync(join(dir, 'index.html'))) fail(id, 'index.html tidak ada.');

  const files = walk(dir);
  const total = files.reduce((n, f) => n + statSync(f).size, 0);
  if (total > MAX_FOLDER) fail(id, `folder ${(total / 1048576).toFixed(1)} MB, maksimal 5 MB.`);

  const cover = join(dir, 'cover.png');
  if (!existsSync(cover)) {
    fail(id, 'cover.png tidak ada.');
  } else {
    const buf = readFileSync(cover);
    if (buf.length > MAX_COVER) fail(id, `cover.png ${Math.round(buf.length / 1024)} KB, maksimal 200 KB.`);
    const isPng = buf.length > 24 && buf.toString('latin1', 1, 4) === 'PNG';
    if (!isPng) {
      fail(id, 'cover.png bukan file PNG.');
    } else {
      const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
      if (Math.abs(w / h - 16 / 9) > 0.02) fail(id, `cover.png ${w}x${h}, harus rasio 16:9.`);
    }
  }

  const code = files.filter(f => /\.(html|js|css)$/.test(f)).map(f => ({ f, text: readFileSync(f, 'utf8') }));
  for (const { f, text } of code) {
    if (/<script[^>]+src=["']?(https?:)?\/\//i.test(text)) fail(id, `${f}: skrip dari luar situs.`);
    if (/<link[^>]+href=["']?(https?:)?\/\//i.test(text)) fail(id, `${f}: stylesheet dari luar situs.`);
    if (/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\b[^;\n]*["'`](https?:)?\/\//.test(text)) {
      fail(id, `${f}: permintaan jaringan ke luar.`);
    }
  }
  const usesStorage = code.some(c => /localStorage/.test(c.text));
  if (usesStorage && !code.some(c => c.text.includes(`'${id}:`) || c.text.includes(`"${id}:`) || c.text.includes('`' + id + ':'))) {
    fail(id, `memakai localStorage, tapi tidak ada kunci berawalan "${id}:".`);
  }
}

if (existsSync('games')) {
  for (const e of readdirSync('games', { withFileTypes: true })) {
    if (e.isDirectory() && !seen.has(e.name)) problems.push(`[${e.name}] folder ada di games/ tapi tidak terdaftar di games.json.`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} masalah.`);
  process.exit(1);
}
console.log(`OK: ${games.length} game memenuhi kontrak.`);
