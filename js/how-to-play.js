(function () {
  const guides ={
  "2048": {
    "goal": "Gabungkan ubin bernilai sama sampai membentuk ubin 2048. Kamu bisa lanjut bermain untuk mengejar skor lebih tinggi.",
    "steps": [
      "Geser semua ubin ke satu arah.",
      "Saat dua ubin dengan angka sama bertemu, keduanya bergabung menjadi angka dua kali lipat.",
      "Setiap langkah menambahkan ubin baru. Permainan berakhir saat tak ada langkah yang tersedia."
    ],
    "controls": [
      "Geser papan, gunakan tombol panah, atau ketuk tombol arah di layar."
    ]
  },
  "tebak-angka": {
    "goal": "Temukan angka rahasia dari 1 sampai 100 sebelum kesempatan menebak habis.",
    "steps": [
      "Masukkan tebakan, lalu tekan Tebak.",
      "Gunakan petunjuk “terlalu kecil” atau “terlalu besar” untuk mempersempit pilihan.",
      "Kamu punya 7 kali tebakan."
    ],
    "controls": [
      "Ketik angka pada kolom, lalu tekan tombol Tebak."
    ]
  },
  "kartu-memori": {
    "goal": "Buka semua kartu dengan mencocokkan pasangan yang sama sesedikit mungkin langkah.",
    "steps": [
      "Ketuk satu kartu untuk melihat gambarnya.",
      "Ketuk kartu lain untuk mencari pasangan.",
      "Kartu yang tidak cocok akan tertutup kembali; ingat posisinya."
    ],
    "controls": [
      "Ketuk kartu untuk membaliknya."
    ]
  },
  "klik-cepat": {
    "goal": "Dapatkan ketukan sebanyak mungkin sebelum hitung mundur 10 detik selesai.",
    "steps": [
      "Tekan Mulai.",
      "Ketuk tombol permainan secepat mungkin sampai waktunya habis."
    ],
    "controls": [
      "Ketuk tombol Ketuk di layar."
    ]
  },
  "suit": {
    "goal": "Menang melawan komputer dan bangun rekor kemenangan beruntun.",
    "steps": [
      "Pilih batu, gunting, atau kertas.",
      "Batu mengalahkan gunting, gunting mengalahkan kertas, dan kertas mengalahkan batu.",
      "Pilihan sama menghasilkan seri."
    ],
    "controls": [
      "Ketuk salah satu pilihan."
    ]
  },
  "tebak-warna": {
    "goal": "Pilih warna tinta yang benar, bukan arti kata yang tertulis, sebanyak mungkin dalam 30 detik.",
    "steps": [
      "Perhatikan warna tulisan pada kata yang tampil.",
      "Pilih tombol dengan nama warna yang sesuai dengan warna tintanya.",
      "Jawaban benar menambah skor; jawaban salah mengurangi skor."
    ],
    "controls": [
      "Ketuk tombol warna yang cocok dengan tinta."
    ]
  },
  "hitung-kilat": {
    "goal": "Jawab soal hitung sebanyak mungkin dalam 30 detik.",
    "steps": [
      "Baca soal yang tampil.",
      "Pilih jawaban yang benar dari pilihan yang tersedia.",
      "Lanjutkan ke soal berikutnya sebelum waktu habis."
    ],
    "controls": [
      "Ketuk salah satu pilihan jawaban."
    ]
  },
  "ingat-urutan": {
    "goal": "Ulangi urutan warna yang menyala. Urutan bertambah panjang setiap level.",
    "steps": [
      "Tekan Mulai dan perhatikan warna yang menyala satu per satu.",
      "Setelah giliranmu dimulai, ketuk warna dengan urutan yang sama.",
      "Satu kesalahan mengakhiri permainan."
    ],
    "controls": [
      "Ketuk tombol warna di layar."
    ]
  },
  "reaksi": {
    "goal": "Ukur seberapa cepat kamu bereaksi saat layar berubah hijau.",
    "steps": [
      "Ketuk untuk memulai dan tunggu.",
      "Begitu layar berubah hijau, ketuk secepat mungkin.",
      "Jangan mengetuk saat masih menunggu; kalau terlalu cepat, ronde diulang."
    ],
    "controls": [
      "Ketuk area permainan saat berubah hijau."
    ]
  },
  "xo": {
    "goal": "Susun tiga tanda X segaris sebelum komputer menyusun tiga O.",
    "steps": [
      "Ketuk kotak kosong untuk menaruh X.",
      "Komputer membalas dengan O.",
      "Buat garis mendatar, tegak, atau diagonal; cegah komputer melakukan hal yang sama."
    ],
    "controls": [
      "Ketuk kotak yang ingin diisi."
    ]
  },
  "tebak-kata": {
    "goal": "Tebak kata tersembunyi huruf demi huruf sebelum kesempatan salah habis.",
    "steps": [
      "Lihat kategori dan jumlah huruf pada kata.",
      "Pilih huruf yang menurutmu ada di dalam kata.",
      "Huruf yang benar membuka semua posisinya; huruf salah mengurangi kesempatan."
    ],
    "controls": [
      "Pilih huruf di papan tombol pada layar."
    ]
  },
  "ludo-lokal": {
    "goal": "Jadilah pemain pertama yang membawa bidak ke rumah. Bisa dimainkan 2–4 orang bergantian di satu perangkat.",
    "steps": [
      "Atur jumlah pemain dan nama, lalu mulai.",
      "Lempar angka 6 untuk mengeluarkan bidak dari markas. Angka 6 memberimu lemparan lagi.",
      "Mendarat di bidak lawan mengirimnya kembali ke markas. Kotak mulai aman.",
      "Masuk jalur rumah dan dapatkan angka yang pas untuk sampai tujuan."
    ],
    "controls": [
      "Ketuk Lempar dadu saat giliranmu.",
      "Pilih bidak yang ingin dijalankan."
    ]
  },
  "ular-tangga": {
    "goal": "Jadilah pemain pertama yang mencapai kotak 100. Main bergiliran untuk 2–4 orang.",
    "steps": [
      "Atur pemain dan mulai permainan.",
      "Lempar dadu, lalu maju sejumlah kotak sesuai hasilnya.",
      "Tangga membawamu naik; kepala ular membuatmu turun. Angka 6 memberimu giliran tambahan.",
      "Kamu harus mendapat angka yang pas untuk mencapai kotak 100."
    ],
    "controls": [
      "Ketuk Lempar dadu saat giliranmu."
    ]
  },
  "labirin": {
    "goal": "Temukan jalan dari titik hijau menuju pintu keluar merah di labirin acak.",
    "steps": [
      "Mulai dari titik hijau.",
      "Jelajahi lorong tanpa menembus dinding.",
      "Selesaikan secepat mungkin dan dengan langkah sesedikit mungkin."
    ],
    "controls": [
      "Gunakan tombol panah atau tombol arah pada layar."
    ]
  },
  "empat-segaris": {
    "goal": "Jadilah pemain pertama yang menyusun empat bidak sewarna dalam satu garis.",
    "steps": [
      "Pilih jumlah pemain/nama dan mulai.",
      "Pemain bergantian memilih kolom; bidak jatuh ke ruang kosong paling bawah.",
      "Susun empat bidak mendatar, tegak, atau diagonal sebelum lawan."
    ],
    "controls": [
      "Ketuk kolom untuk menjatuhkan bidak."
    ]
  },
  "sapu-ranjau": {
    "goal": "Buka semua kotak aman tanpa menyentuh 12 ranjau.",
    "steps": [
      "Ketuk kotak untuk membukanya.",
      "Angka di kotak menunjukkan jumlah ranjau di delapan kotak sekelilingnya.",
      "Gunakan mode bendera untuk menandai kotak yang kamu curigai sebagai ranjau."
    ],
    "controls": [
      "Ketuk kotak untuk membuka. Aktifkan Mode bendera, lalu ketuk kotak untuk menandai atau melepas bendera."
    ]
  },
  "tangkap-cacing": {
    "goal": "Makan buah untuk mendapat skor, tetapi jangan menabrak dinding atau tubuh cacing sendiri.",
    "steps": [
      "Tekan Mulai atau arahkan cacing untuk memulai.",
      "Arahkan kepala ke buah merah untuk menambah skor dan panjang tubuh.",
      "Gunakan Jeda bila perlu; tabrakan mengakhiri permainan."
    ],
    "controls": [
      "Gunakan tombol panah, WASD, geser papan, atau tombol arah di layar."
    ]
  },
  "tebak-emoji": {
    "goal": "Jawab 10 teka-teki emoji sebanyak mungkin dengan benar.",
    "steps": [
      "Baca petunjuk emoji dan keterangan kecilnya.",
      "Pilih satu jawaban. Jawaban benar menambah skor.",
      "Tekan Lanjut untuk soal berikutnya, lalu lihat skor akhir."
    ],
    "controls": [
      "Ketuk salah satu pilihan jawaban."
    ]
  },
  "ping-pong-lokal": {
    "goal": "Kalahkan lawan dengan menjadi pemain pertama yang mencapai 5 poin.",
    "steps": [
      "Tekan Mulai. Bola akan diluncurkan.",
      "Gerakkan pemukul untuk memantulkan bola melewati pemukul lawan.",
      "Jika bola melewati sisi lawan, poin diberikan kepadamu. Tekan Atur ulang untuk mulai lagi."
    ],
    "controls": [
      "Pemain 1: tahan W/S atau tombol ▲/▼ sisi kiri.",
      "Pemain 2: tahan ↑/↓ atau tombol ▲/▼ sisi kanan."
    ]
  },
  "pecah-balok": {
    "goal": "Hancurkan semua balok dan pertahankan bola agar tidak jatuh lebih dari tiga kali.",
    "steps": [
      "Tekan Mulai, lalu ketuk arena atau tekan Spasi untuk meluncurkan bola.",
      "Gerakkan pemukul tepat di bawah bola agar memantul kembali ke atas.",
      "Setiap bola jatuh mengurangi satu nyawa. Pecahkan semua balok untuk menang."
    ],
    "controls": [
      "Sentuh atau gerakkan pointer/mouse di arena untuk menggeser pemukul.",
      "Di komputer, gunakan ←/→. Tekan Spasi untuk meluncurkan bola."
    ]
  },
  "sudoku-mini": {
    "goal": "Isi papan 4×4 dengan angka 1–4 tanpa mengulang di baris, kolom, atau kotak 2×2.",
    "steps": [
      "Pilih kotak kosong, lalu pilih angka 1–4.",
      "Setiap baris, kolom, dan kotak 2×2 harus memiliki angka yang berbeda.",
      "Lengkapi semua kotak; angka awal tidak bisa diubah."
    ],
    "controls": [
      "Ketuk kotak dan angka di layar, atau gunakan tombol angka 1–4 pada keyboard.",
      "Tekan Backspace atau Delete untuk menghapus angka pilihan."
    ]
  },
  "puzzle-geser": {
    "goal": "Susun keping angka dari 1 sampai 15, dengan ruang kosong di pojok kanan bawah.",
    "steps": [
      "Geser keping yang berdampingan dengan ruang kosong ke dalamnya.",
      "Terus susun angka dari kiri ke kanan dan baris demi baris.",
      "Papan diacak dengan langkah legal, jadi susunannya selalu bisa dipecahkan."
    ],
    "controls": [
      "Ketuk keping di sebelah ruang kosong.",
      "Di komputer, tombol panah menggeser ruang kosong ke arah yang ditekan."
    ]
  },
  "reversi-lokal": {
    "goal": "Kuasai papan dengan memiliki bidak terbanyak saat tidak ada langkah yang bisa dimainkan.",
    "steps": [
      "Main berdua di satu perangkat. Hitam memulai dari posisi tengah.",
      "Letakkan bidak di kotak kosong yang mengapit rangkaian bidak lawan dengan bidakmu.",
      "Semua bidak lawan yang terjepit dalam garis lurus akan dibalik menjadi warnamu.",
      "Jika tidak ada langkah legal, giliranmu dilewati. Pemain dengan bidak terbanyak menang saat permainan berakhir."
    ],
    "controls": [
      "Ketuk kotak bertanda titik untuk menaruh bidak."
    ]
  },
  "lari-retro": {
    "goal": "Berlari sejauh mungkin dengan melewati rintangan tanpa tersandung.",
    "steps": [
      "Tekan Mulai untuk memulai lari.",
      "Lompat saat ada rintangan di depanmu.",
      "Lari makin cepat seiring waktu. Tabrakan mengakhiri permainan; coba pecahkan rekormu."
    ],
    "controls": [
      "Tekan Spasi atau tombol panah atas pada keyboard.",
      "Di ponsel, ketuk tombol Lompat atau area permainan."
    ]
  },
  "mini-golf": {
    "goal": "Masukkan bola ke tiga hole dengan jumlah pukulan sesedikit mungkin.",
    "steps": [
      "Tarik dari bola ke arah yang berlawanan dengan tujuanmu untuk mengatur arah dan kekuatan.",
      "Lepaskan untuk memukul bola. Bola akan memantul dari dinding dan bumper.",
      "Masukkan bola ke hole, lalu lanjutkan sampai ketiga hole selesai."
    ],
    "controls": [
      "Di HP atau dengan mouse, tarik dari bola lalu lepaskan untuk memukul.",
      "Di komputer, gunakan tombol panah untuk mengubah arah bidik dan Spasi untuk memukul."
    ]
  },
  "blok-susun": {
    "goal": "Isi baris penuh sebanyak mungkin dan jangan biarkan blok menumpuk sampai atas papan.",
    "steps": [
      "Blok jatuh sendiri dari atas, satu per satu.",
      "Geser blok ke kiri atau kanan, putar, turunkan lebih cepat, atau jatuhkan langsung.",
      "Blok terkunci saat menyentuh dasar atau tumpukan.",
      "Baris yang penuh terisi hilang dan memberi skor. Hapus beberapa baris sekaligus untuk poin lebih besar.",
      "Tiap 10 baris, level naik dan blok jatuh makin cepat. Blok berikutnya tampil di atas papan.",
      "Game berakhir saat tumpukan penuh."
    ],
    "controls": [
      "Panah kiri dan kanan untuk geser, panah atas untuk putar, panah bawah untuk turun, Spasi untuk jatuhkan langsung. Atau pakai tombol di layar."
    ]
  }
};

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const status = document.getElementById('guide-status');
  const panel = document.getElementById('guide');

  function showUnavailable(message) {
    status.textContent = message;
  }

  function fillList(selector, items) {
    const list = document.querySelector(selector);
    items.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item;
      list.append(li);
    });
  }

  fetch('games.json')
    .then(function (response) {
      if (!response.ok) throw new Error('catalog');
      return response.json();
    })
    .then(function (games) {
      const game = games.find(function (item) {
        return item.id === id;
      });
      if (!game) {
        showUnavailable('Game tidak ditemukan. Kembali ke katalog untuk memilih game lain.');
        return;
      }

      const guide = guides[game.id];
      if (!guide) {
        showUnavailable('Panduan game ini belum tersedia.');
        return;
      }

      document.title = 'Cara main ' + game.title + ' · NvanPlay';
      document.getElementById('guide-title').textContent = game.title;
      document.getElementById('guide-description').textContent = game.description;
      document.getElementById('guide-tags').textContent = (game.tags || []).join(' · ');
      document.getElementById('guide-goal').textContent = guide.goal;
      fillList('#guide-steps', guide.steps);
      fillList('#guide-controls', guide.controls);
      document.getElementById('play-link').href =
        'player.html?id=' + encodeURIComponent(game.id);

      status.hidden = true;
      panel.hidden = false;
    })
    .catch(function () {
      showUnavailable('Katalog gagal dimuat. Coba muat ulang halaman.');
    });
})();
