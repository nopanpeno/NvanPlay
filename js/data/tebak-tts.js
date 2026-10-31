// Data untuk Tebak TTS. Tiap puzzle = satu susunan TTS yang sudah dicek.
// rows/cols: ukuran grid. words: kata, petunjuk, baris/kolom awal (0-based), arah, nomor.
// Dibuat dengan susun acak, lalu dicek: tidak ada kata nyasar, tidak ada huruf bentrok.
var TEBAK_TTS_DATA = [
 {
  "rows": 9,
  "cols": 8,
  "words": [
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 0,
    "col": 1,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "KERETA",
    "clue": "kendaraan di atas rel",
    "row": 1,
    "col": 4,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "KASUR",
    "clue": "tempat tidur empuk",
    "row": 1,
    "col": 6,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "JENDELA",
    "clue": "lubang kaca di dinding",
    "row": 2,
    "col": 0,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "SEMUT",
    "clue": "serangga kecil pekerja",
    "row": 4,
    "col": 3,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "MEJA",
    "clue": "tempat menaruh barang",
    "row": 5,
    "col": 2,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "LEBAH",
    "clue": "penghasil madu",
    "row": 6,
    "col": 1,
    "dir": "across",
    "num": 7
   },
   {
    "answer": "TANGGA",
    "clue": "alat naik ke lantai atas",
    "row": 8,
    "col": 1,
    "dir": "across",
    "num": 8
   }
  ]
 },
 {
  "rows": 9,
  "cols": 8,
  "words": [
   {
    "answer": "HIJAU",
    "clue": "warna daun",
    "row": 0,
    "col": 3,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "TANGGA",
    "clue": "alat naik ke lantai atas",
    "row": 0,
    "col": 5,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "BUKU",
    "clue": "bahan bacaan",
    "row": 1,
    "col": 1,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "IKAN",
    "clue": "hewan yang hidup di air",
    "row": 1,
    "col": 3,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "DOKTER",
    "clue": "merawat orang sakit",
    "row": 2,
    "col": 7,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "SUSU",
    "clue": "minuman putih dari hewan",
    "row": 4,
    "col": 0,
    "dir": "across",
    "num": 6
   },
   {
    "answer": "SABUN",
    "clue": "pembersih tangan",
    "row": 4,
    "col": 0,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "LAUT",
    "clue": "air asin yang luas",
    "row": 5,
    "col": 4,
    "dir": "across",
    "num": 7
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "LAMPU",
    "clue": "sumber cahaya di rumah",
    "row": 0,
    "col": 4,
    "dir": "across",
    "num": 1
   },
   {
    "answer": "PAYUNG",
    "clue": "pelindung dari hujan",
    "row": 0,
    "col": 7,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "JENDELA",
    "clue": "lubang kaca di dinding",
    "row": 1,
    "col": 2,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "BIRU",
    "clue": "warna langit cerah",
    "row": 2,
    "col": 5,
    "dir": "down",
    "num": 4
   },
   {
    "answer": "SUNGAI",
    "clue": "aliran air tawar",
    "row": 3,
    "col": 0,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 5,
    "col": 4,
    "dir": "across",
    "num": 6
   },
   {
    "answer": "BUKU",
    "clue": "bahan bacaan",
    "row": 5,
    "col": 4,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 7,
    "col": 4,
    "dir": "across",
    "num": 7
   }
  ]
 },
 {
  "rows": 8,
  "cols": 9,
  "words": [
   {
    "answer": "MANGGA",
    "clue": "buah manis dan harum",
    "row": 0,
    "col": 3,
    "dir": "across",
    "num": 1
   },
   {
    "answer": "GURU",
    "clue": "orang yang mengajar",
    "row": 0,
    "col": 6,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "SEMUT",
    "clue": "serangga kecil pekerja",
    "row": 3,
    "col": 3,
    "dir": "across",
    "num": 3
   },
   {
    "answer": "SUSU",
    "clue": "minuman putih dari hewan",
    "row": 3,
    "col": 3,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "TEH",
    "clue": "minuman dari daun",
    "row": 3,
    "col": 7,
    "dir": "down",
    "num": 4
   },
   {
    "answer": "BIRU",
    "clue": "warna langit cerah",
    "row": 4,
    "col": 0,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "IKAN",
    "clue": "hewan yang hidup di air",
    "row": 4,
    "col": 1,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "KASUR",
    "clue": "tempat tidur empuk",
    "row": 6,
    "col": 0,
    "dir": "across",
    "num": 7
   }
  ]
 },
 {
  "rows": 8,
  "cols": 9,
  "words": [
   {
    "answer": "BULAN",
    "clue": "benda langit malam",
    "row": 0,
    "col": 2,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "PETANI",
    "clue": "menanam padi di sawah",
    "row": 0,
    "col": 7,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 1,
    "col": 5,
    "dir": "across",
    "num": 3
   },
   {
    "answer": "MOBIL",
    "clue": "kendaraan beroda empat",
    "row": 2,
    "col": 0,
    "dir": "down",
    "num": 4
   },
   {
    "answer": "SAWAH",
    "clue": "tempat menanam padi",
    "row": 3,
    "col": 4,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "SABUN",
    "clue": "pembersih tangan",
    "row": 3,
    "col": 4,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 4,
    "col": 0,
    "dir": "across",
    "num": 6
   },
   {
    "answer": "AWAN",
    "clue": "gumpalan putih di langit",
    "row": 7,
    "col": 1,
    "dir": "across",
    "num": 7
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "IKAN",
    "clue": "hewan yang hidup di air",
    "row": 0,
    "col": 2,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "SUSU",
    "clue": "minuman putih dari hewan",
    "row": 1,
    "col": 0,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "SABUN",
    "clue": "pembersih tangan",
    "row": 2,
    "col": 4,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "SUNGAI",
    "clue": "aliran air tawar",
    "row": 3,
    "col": 0,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "PINTU",
    "clue": "jalan masuk rumah",
    "row": 4,
    "col": 6,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "NASI",
    "clue": "makanan pokok orang Indonesia",
    "row": 4,
    "col": 8,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "BUKU",
    "clue": "bahan bacaan",
    "row": 5,
    "col": 1,
    "dir": "across",
    "num": 7
   },
   {
    "answer": "BIRU",
    "clue": "warna langit cerah",
    "row": 5,
    "col": 1,
    "dir": "down",
    "num": 7
   },
   {
    "answer": "NANAS",
    "clue": "buah berduri",
    "row": 6,
    "col": 4,
    "dir": "across",
    "num": 8
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 8,
    "col": 0,
    "dir": "across",
    "num": 9
   }
  ]
 },
 {
  "rows": 9,
  "cols": 8,
  "words": [
   {
    "answer": "PINTU",
    "clue": "jalan masuk rumah",
    "row": 0,
    "col": 0,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "SUSU",
    "clue": "minuman putih dari hewan",
    "row": 0,
    "col": 3,
    "dir": "across",
    "num": 2
   },
   {
    "answer": "SEMUT",
    "clue": "serangga kecil pekerja",
    "row": 0,
    "col": 3,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "NYAMUK",
    "clue": "serangga pengisap darah",
    "row": 2,
    "col": 0,
    "dir": "across",
    "num": 3
   },
   {
    "answer": "TEMPE",
    "clue": "olahan kedelai",
    "row": 4,
    "col": 3,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "PASAR",
    "clue": "tempat jual beli",
    "row": 4,
    "col": 6,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 6,
    "col": 4,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "BULAN",
    "clue": "benda langit malam",
    "row": 7,
    "col": 3,
    "dir": "across",
    "num": 7
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "NANAS",
    "clue": "buah berduri",
    "row": 0,
    "col": 2,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "KUNING",
    "clue": "warna matahari",
    "row": 1,
    "col": 5,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "JENDELA",
    "clue": "lubang kaca di dinding",
    "row": 2,
    "col": 8,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "AWAN",
    "clue": "gumpalan putih di langit",
    "row": 3,
    "col": 2,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "IKAN",
    "clue": "hewan yang hidup di air",
    "row": 4,
    "col": 5,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "GURU",
    "clue": "orang yang mengajar",
    "row": 5,
    "col": 1,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "KUCING",
    "clue": "hewan berkumis suka ikan",
    "row": 6,
    "col": 0,
    "dir": "across",
    "num": 7
   },
   {
    "answer": "KERETA",
    "clue": "kendaraan di atas rel",
    "row": 8,
    "col": 3,
    "dir": "across",
    "num": 8
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 0,
    "col": 1,
    "dir": "across",
    "num": 1
   },
   {
    "answer": "KOPI",
    "clue": "minuman hitam dari biji",
    "row": 0,
    "col": 1,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 0,
    "col": 5,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "LAMPU",
    "clue": "sumber cahaya di rumah",
    "row": 2,
    "col": 3,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "NASI",
    "clue": "makanan pokok orang Indonesia",
    "row": 2,
    "col": 5,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "PISANG",
    "clue": "buah kuning",
    "row": 3,
    "col": 0,
    "dir": "across",
    "num": 5
   },
   {
    "answer": "PETANI",
    "clue": "menanam padi di sawah",
    "row": 3,
    "col": 0,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "KURSI",
    "clue": "tempat duduk",
    "row": 6,
    "col": 2,
    "dir": "across",
    "num": 6
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "SUSU",
    "clue": "minuman putih dari hewan",
    "row": 0,
    "col": 3,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 1,
    "col": 2,
    "dir": "across",
    "num": 2
   },
   {
    "answer": "GUNUNG",
    "clue": "daratan yang tinggi",
    "row": 1,
    "col": 5,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "BIRU",
    "clue": "warna langit cerah",
    "row": 3,
    "col": 0,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "IKAN",
    "clue": "hewan yang hidup di air",
    "row": 3,
    "col": 1,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "SAWAH",
    "clue": "tempat menanam padi",
    "row": 4,
    "col": 8,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "TANGGA",
    "clue": "alat naik ke lantai atas",
    "row": 5,
    "col": 3,
    "dir": "across",
    "num": 7
   },
   {
    "answer": "RUMAH",
    "clue": "tempat tinggal keluarga",
    "row": 8,
    "col": 4,
    "dir": "across",
    "num": 8
   }
  ]
 },
 {
  "rows": 9,
  "cols": 9,
  "words": [
   {
    "answer": "LEBAH",
    "clue": "penghasil madu",
    "row": 0,
    "col": 4,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 1,
    "col": 2,
    "dir": "across",
    "num": 2
   },
   {
    "answer": "NANAS",
    "clue": "buah berduri",
    "row": 1,
    "col": 8,
    "dir": "down",
    "num": 3
   },
   {
    "answer": "BUNGA",
    "clue": "bagian tumbuhan yang berwarna",
    "row": 2,
    "col": 4,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "NELAYAN",
    "clue": "menangkap ikan di laut",
    "row": 2,
    "col": 6,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "GURU",
    "clue": "orang yang mengajar",
    "row": 5,
    "col": 3,
    "dir": "down",
    "num": 6
   },
   {
    "answer": "BIRU",
    "clue": "warna langit cerah",
    "row": 6,
    "col": 0,
    "dir": "across",
    "num": 7
   },
   {
    "answer": "KUNING",
    "clue": "warna matahari",
    "row": 8,
    "col": 2,
    "dir": "across",
    "num": 8
   }
  ]
 },
 {
  "rows": 8,
  "cols": 9,
  "words": [
   {
    "answer": "ANGIN",
    "clue": "udara yang bergerak",
    "row": 0,
    "col": 5,
    "dir": "down",
    "num": 1
   },
   {
    "answer": "BULAN",
    "clue": "benda langit malam",
    "row": 1,
    "col": 8,
    "dir": "down",
    "num": 2
   },
   {
    "answer": "TANGGA",
    "clue": "alat naik ke lantai atas",
    "row": 2,
    "col": 1,
    "dir": "across",
    "num": 3
   },
   {
    "answer": "MANGGA",
    "clue": "buah manis dan harum",
    "row": 4,
    "col": 3,
    "dir": "across",
    "num": 4
   },
   {
    "answer": "MEJA",
    "clue": "tempat menaruh barang",
    "row": 4,
    "col": 3,
    "dir": "down",
    "num": 4
   },
   {
    "answer": "GURU",
    "clue": "orang yang mengajar",
    "row": 4,
    "col": 6,
    "dir": "down",
    "num": 5
   },
   {
    "answer": "KUE",
    "clue": "makanan manis",
    "row": 5,
    "col": 1,
    "dir": "across",
    "num": 6
   },
   {
    "answer": "HUJAN",
    "clue": "air jatuh dari langit",
    "row": 7,
    "col": 0,
    "dir": "across",
    "num": 7
   }
  ]
 }
];
