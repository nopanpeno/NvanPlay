(function () {
  const guides = {
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
