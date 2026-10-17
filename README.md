# NvanPlay

Kumpulan game kecil yang langsung dimainkan di browser. Situs statis di GitHub Pages: tanpa server, tanpa database, tanpa akun.

Main di: https://nopanpeno.github.io/NvanPlay/

Skor dan progres disimpan di `localStorage` perangkat pemain oleh pemutar. Hapus data browser, skor ikut hilang.

## Struktur

```
index.html       katalog game
player.html      pemutar (iframe sandbox), dibuka dengan ?id=<id-game>
data.html        ekspor dan impor data pemain
games.json       daftar game, satu sumber data
games/<id>/      satu folder per game
css/ js/         kode platform dan jembatan penyimpanan game
fonts/           font Bricolage Grotesque (lisensi OFL di folder itu)
scripts/         pengecekan kontrak game
```

## Cadangan data pemain

Buka halaman **Data pemain** (tautan di bawah katalog). Unduh cadangan `.json`, lalu impor di browser atau HP lain. Hanya kunci milik game di `games.json` yang dibaca dan dipulihkan, yaitu kunci berawalan `<id-game>:`. Itu sebabnya aturan kunci `localStorage` di bawah wajib.

## Jalankan di komputer

Perlu server lokal, karena katalog dibaca lewat `fetch`.

```
python3 -m http.server 8000
```

Buka http://localhost:8000

## Tambah game

1. Buat folder `games/<id>/` berisi:
   - `index.html`: titik masuk game
   - `cover.png`: gambar 16:9, maksimal 200 KB
   - `game.js` dan file lain: opsional
2. Tambah satu entri di `games.json`:

```json
{
  "id": "tebak-angka",
  "title": "Tebak Angka",
  "description": "Tebak angka 1 sampai 100 dalam 7 kali coba.",
  "tags": ["angka", "santai"],
  "author": "nama-github",
  "license": "MIT",
  "color": "#2f6fed",
  "touch": true
}
```

3. Jalankan `node scripts/check-games.mjs` sampai keluar `OK`.
4. Kirim pull request.

Panduan lengkap ada di [CONTRIBUTING.md](CONTRIBUTING.md).

`id` harus sama dengan nama folder. `license` mencakup game dan semua asetnya.

### Aturan game

- Jalan penuh di browser, tanpa permintaan ke server sendiri.
- Total ukuran folder maksimal 5 MB.
- Game memakai `nvanplayStorage` untuk membaca dan menulis data. Kunci tetap diawali id game, misalnya `tebak-angka:best`.
- Tanpa skrip pelacak atau iklan pihak ketiga.
- Bisa dimainkan di layar selebar 360 px.
- Sandbox iframe memberi `allow-scripts`, `allow-same-origin`, dan `allow-forms`. Tanpa `allow-forms`, tombol submit tidak jalan. Game tidak boleh membuka popup atau pindah halaman.

Setiap pull request game ditinjau sebelum digabung. Sandbox ini tidak mengisolasi game sepenuhnya dari situs.

## Deploy

GitHub Pages dari branch `main`, folder root. Tiap merge ke `main` memperbarui situs sendiri.

## Berkontribusi

Baca [CONTRIBUTING.md](CONTRIBUTING.md) dan [kode etik](CODE_OF_CONDUCT.md).

## Lisensi

MIT. Lihat [LICENSE](LICENSE). Lisensi aset (gambar, suara) tiap game ikut pembuat game.
