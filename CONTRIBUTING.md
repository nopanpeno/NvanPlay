# Cara berkontribusi

Terima kasih sudah mau menambah game. Satu pull request, satu game.

## Langkah

1. Fork repo ini, buat branch baru, misalnya `game-nama-game`.
2. Tambah folder `games/<id>/` dengan `index.html` dan `cover.png`.
3. Tambah satu entri di `games.json` (lihat contoh di bawah).
4. Jalankan pengecekan: `node scripts/check-games.mjs`. Harus keluar `OK`. Pengecekan yang sama jalan otomatis di GitHub Actions saat kamu mengirim pull request.
5. Coba game lewat pemutar, bukan hanya `index.html` langsung:
   `python3 -m http.server 8000`, buka `http://localhost:8000/player.html?id=<id>`.
6. Kirim pull request dan isi daftar periksa di formulir.

## Entri katalog

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

- `id`: huruf kecil, angka, tanda hubung. Sama dengan nama folder.
- `description`: satu kalimat.
- `author`: nama GitHub kamu.
- `license`: lisensi game dan asetnya (gambar, suara, font). Kalau ada aset dari orang lain, tulis sumber dan lisensinya di sini, misalnya `"MIT; ikon: CC0 dari kenney.nl"`.
- `color`: warna khas game, hex enam digit. Dipakai untuk bayangan kartu di katalog. Opsional; ambil dari warna dominan `cover.png`.
- `touch`: `true` kalau bisa dimainkan dengan sentuhan saja.

## Aturan game

- Berjalan penuh di browser. Tanpa permintaan ke server sendiri.
- Folder game maksimal 5 MB. `cover.png` rasio 16:9, maksimal 200 KB.
- Pakai `window.nvanplayStorage.getItem(key)` dan `window.nvanplayStorage.setItem(key, value)` untuk menyimpan data. Kunci diawali id game, misalnya `tebak-angka:best`. Jangan akses `localStorage` langsung; pemutar menyediakan data melalui jembatan yang hanya menerima prefix game tersebut.
- Tanpa skrip pelacak, iklan, atau pustaka dari luar situs. Taruh semua file di folder game.
- Nyaman di layar selebar 360 px. Tombol cukup besar untuk jari.
- Game jalan di iframe dengan `sandbox="allow-scripts allow-forms"` pada origin terisolasi. Jangan buka popup atau pindah halaman.
- Jangan pakai karakter, gambar, atau suara yang kamu tidak punya haknya.

## Yang dicek pengelola

Pengelola membaca kode game sebelum menggabungkan. Origin sandbox memisahkan DOM game dari situs utama; jembatan penyimpanan hanya menerima kunci berprefix ID game. Tinjauan manusia tetap wajib untuk menilai perilaku game. Kode yang dikaburkan atau diminifikasi tanpa sumber aslinya akan ditolak.

## Mengubah platform

Untuk perubahan di `index.html`, `player.html`, `data.html`, `css/`, atau `js/`, buka issue dulu supaya arahnya cocok. Platform sengaja kecil: HTML, CSS, dan JS biasa, tanpa build.

Perubahan tampilan perlu dites di layar 360 px, mode terang dan gelap.

## Perilaku

Ikuti [kode etik](CODE_OF_CONDUCT.md).
