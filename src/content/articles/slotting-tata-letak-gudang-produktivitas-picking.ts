import type { Article } from "./types";

export const article: Article = {
  slug: "slotting-tata-letak-gudang-produktivitas-picking",
  layout: "primer",
  format: "Data Breakdown",
  title: "Menghitung Prioritas Slotting SKU dari Enam Variabel, Bukan Frekuensi Saja",
  metaTitle: "Enam Variabel yang Menentukan Prioritas Slotting Gudang",
  description:
    "Frekuensi baris pesanan cuma salah satu dari enam variabel yang menentukan penempatan SKU. Cara menghitung volume, batasan penanganan, afinitas, replenishment, dan musiman dari data yang biasanya sudah ada di WMS.",
  keywords: [
    "slotting gudang",
    "cube movement gudang",
    "afinitas SKU gudang",
    "replenishment gudang",
    "produktivitas picking",
    "tata letak gudang",
  ],
  category: "gudang",
  publishedAt: "2026-06-08",
  updatedAt: "2026-08-06",
  summary:
    "ABC analysis berdasarkan frekuensi pengambilan cuma menjawab satu dari enam pertanyaan yang sebenarnya menentukan penempatan SKU di gudang. Tulisan ini memecah perhitungan itu jadi enam variabel, frekuensi baris pesanan, volume yang dipindah, batasan penanganan, afinitas antar-SKU, replenishment, dan pergeseran musiman, lengkap dengan cara menghitung tiap variabel dari data yang biasanya sudah ada di WMS, dan contoh ilustratif dampaknya pada jarak tempuh picker.",
  takeaways: [
    "Frekuensi baris pesanan cuma satu dari enam variabel yang menentukan penempatan SKU. Dipakai sendirian, sering keliru menaikkan SKU bervolume besar atau berpenanganan khusus ke zona yang sebenarnya tidak cocok untuknya.",
    "Volume yang dipindah (cube), batasan penanganan, afinitas antar-SKU, replenishment, dan pergeseran musiman masing-masing bisa mengubah keputusan penempatan yang dihasilkan frekuensi saja.",
    "Keenam variabel ini bisa dihitung dari data yang biasanya sudah ada di WMS atau catatan pengambilan manual, tanpa perlu proyek atau alat baru untuk mulai menghitung.",
    "Contoh perhitungan menunjukkan proyeksi penghematan waktu dari rencana frekuensi-saja dan rencana enam-variabel bisa hampir sama besar, bedanya rencana enam-variabel benar-benar bisa dijalankan tanpa perlu dibongkar ulang.",
  ],
  blocks: [
    {
      type: "p",
      text: "Kalau prioritas slotting cuma dihitung dari satu angka, frekuensi baris pesanan per SKU, hasilnya kelihatan presisi padahal cuma mengukur separuh soal. Dua SKU bisa punya jumlah baris pesanan yang identik dan tetap butuh penempatan yang sama sekali berbeda begitu volume yang dipindah, cara penanganannya, atau barang apa yang biasa dipesan berbarengan dengannya ikut dihitung.",
    },
    {
      type: "p",
      text: "ABC analysis, yang selama ini jadi rujukan utama audit slotting, sebenarnya cuma menjawab satu pertanyaan: SKU mana yang paling sering diambil. Itu pertanyaan yang tepat untuk memulai, tapi tidak cukup untuk menentukan zona rak sendirian. Tulisan ini memecah perhitungan prioritas slotting jadi enam variabel yang masing-masing bisa mengubah jawabannya, dan menunjukkan cara menghitung tiap variabel dari data yang biasanya sudah ada di WMS atau catatan pengambilan manual.",
    },
    {
      type: "h2",
      id: "frekuensi-baris-pesanan",
      text: "Frekuensi Baris Pesanan: Input Pertama, Bukan Jawaban Akhir",
    },
    {
      type: "p",
      text: "Variabel pertama, dan yang paling mudah dihitung, adalah frekuensi baris pesanan per SKU selama periode representatif, idealnya 3-6 bulan yang tidak bertepatan dengan musim puncak atau promo besar. SKU diurutkan dari frekuensi tertinggi ke terendah, lalu dihitung persentase kumulatifnya terhadap total baris pesanan. Titik potong kelas A, B, dan C ditentukan dari bentuk kurva itu sendiri, bukan angka baku 80/15/5 yang dipaksakan sama untuk semua gudang.",
    },
    {
      type: "p",
      text: "Contoh berikut disederhanakan untuk menunjukkan cara menghitungnya, bukan catatan satu gudang tertentu: pada katalog dengan sekitar 1.100 SKU aktif, sekitar 165 SKU (15% dari katalog) bisa saja menyumbang sekitar 78% dari total baris pesanan harian, kelas A yang jumlah SKU-nya jauh lebih kecil dari porsi permintaannya.",
    },
    {
      type: "table",
      caption: "Distribusi kelas ABC berdasarkan frekuensi baris pesanan (angka ilustrasi, sesuaikan dengan data gudang masing-masing)",
      head: ["Kelas", "Porsi SKU", "Porsi baris pesanan", "Kandidat penempatan awal"],
      rows: [
        ["A", "~15%", "~78%", "Kandidat zona terdekat titik proses"],
        ["B", "~25%", "~17%", "Kandidat zona tengah"],
        ["C", "~60%", "~5%", "Kandidat zona terjauh"],
      ],
    },
    {
      type: "p",
      text: "Sejauh ini perhitungan ini sama persis dengan ABC analysis konvensional. Bedanya baru terlihat begitu SKU kelas A yang sama diperiksa lewat lima variabel berikutnya, karena frekuensi tinggi tidak berarti golden zone otomatis jadi pilihan yang benar untuk SKU itu.",
    },
    {
      type: "h2",
      id: "volume-yang-dipindah",
      text: "Volume yang Dipindah per SKU, Bukan Cuma Jumlah Baris",
    },
    {
      type: "p",
      text: "Dua SKU dengan frekuensi baris pesanan yang sama bisa memindahkan volume barang yang jauh berbeda. Satu SKU mungkin dipesan 14 kali sehari dengan rata-rata satu dus kecil tiap pengambilan. SKU lain dipesan 14 kali sehari juga, tapi rata-rata satu pallet parsial tiap pengambilan. Frekuensinya sama, tapi kebutuhan ruang, alat bantu, dan jenis slotnya sama sekali berbeda.",
    },
    {
      type: "table",
      caption: "Contoh perhitungan volume yang dipindah per SKU (angka disederhanakan untuk ilustrasi, bukan data satu gudang tertentu)",
      head: ["SKU (ilustrasi)", "Baris pesanan/hari", "Rata-rata volume per pengambilan", "Total volume dipindah/hari", "Kebutuhan slot"],
      rows: [
        ["Sabun cuci piring 800 ml (dus)", "14", "~0,03 m³", "~0,42 m³", "Rak kecil, cocok untuk golden zone"],
        ["Minyak goreng galon isi ulang (pallet parsial)", "14", "~1,1 m³", "~15,4 m³", "Flow lane pallet dekat titik proses, bukan rak shelving kecil"],
      ],
    },
    {
      type: "p",
      text: "SKU dengan volume besar per pengambilan lebih cocok ditempatkan di flow lane pallet dekat titik proses ketimbang rak shelving kecil yang dirancang untuk pengambilan satuan. Menaruh SKU bervolume besar di rak shelving kecil bukan cuma kurang efisien, biasanya juga tidak muat secara fisik atau memaksa picker bolak-balik mengambil dari beberapa slot untuk satu baris pesanan.",
    },
    {
      type: "h2",
      id: "batasan-penanganan",
      text: "Batasan Penanganan yang Mengalahkan Urutan Frekuensi",
    },
    {
      type: "p",
      text: "Frekuensi dan volume menentukan seberapa dekat SKU idealnya ditempatkan. Batasan penanganan menentukan apakah SKU itu boleh ditempatkan di sana sama sekali, terlepas dari seberapa sering atau seberapa besar volumenya.",
    },
    {
      type: "table",
      caption: "Batasan penanganan yang mengalahkan urutan frekuensi",
      head: ["Batasan", "Kenapa mengalahkan urutan frekuensi", "Perlakuan umum"],
      rows: [
        [
          "Karton yang beratnya melebihi batas nyaman diangkat manual berulang kali",
          "Rak level bahu (golden zone) dirancang untuk pengambilan cepat satuan, bukan angkat beban berat berulang sepanjang shift",
          "Ditaruh di rak level bawah atau pallet flow lane meski frekuensinya tinggi",
        ],
        [
          "Barang mudah pecah atau rusak",
          "Rak sempit berdekatan dengan lalu lintas picker lain menaikkan risiko tertabrak atau terjatuh",
          "Zona dengan jarak aman dari lorong utama, meski tetap dekat titik proses",
        ],
        [
          "Barang berbahaya atau mudah terbakar sesuai lembar data keselamatan (MSDS)",
          "Perlu tersegregasi dari barang lain berapa pun frekuensinya",
          "Zona khusus tersendiri, kadang di luar alur zonasi ABC sama sekali",
        ],
        [
          "Barang bersuhu khusus (cold chain)",
          "Butuh unit pendingin sendiri, tidak bisa mengikuti zona ambient",
          "Ruang atau chamber terpisah dengan pengendalian suhu",
        ],
      ],
    },
    {
      type: "p",
      text: "Begitu batasan penanganan diterapkan, sebagian SKU kelas A biasanya keluar dari kandidat golden zone berapa pun frekuensinya. Ini bukan pengecualian kecil, di banyak gudang consumer goods dan farmasi, batasan penanganan menyingkirkan lebih banyak SKU kelas A dari golden zone dibanding yang disingkirkan variabel volume.",
    },
    {
      type: "h2",
      id: "afinitas-antar-sku",
      text: "Afinitas: SKU yang Sering Dipesan Bersamaan",
    },
    {
      type: "p",
      text: "Variabel keempat sering terlewat karena butuh data yang sedikit lebih rumit ditarik: baris pesanan mana yang sering muncul bersamaan dalam satu order. SKU yang secara individual masuk kelas B, bahkan kelas C, bisa tetap layak ditempatkan dekat SKU kelas A kalau keduanya rutin dipesan dalam order yang sama.",
    },
    {
      type: "table",
      caption: "Contoh analisis afinitas antar-SKU (angka ilustrasi untuk menunjukkan caranya, bukan hasil audit satu gudang tertentu)",
      head: ["Pasangan SKU (ilustrasi)", "Porsi order yang memuat keduanya", "Implikasi penempatan"],
      rows: [
        [
          "Sabun cuci piring 800 ml (kelas A) + spons cuci piring (kelas B)",
          "~60% dari order yang memuat sabun cuci piring",
          "Spons ditempatkan di rak bersebelahan meski frekuensi individunya sendiri tidak cukup tinggi untuk masuk golden zone",
        ],
        [
          "Deterjen bubuk kemasan besar (kelas A) + pewangi pakaian (kelas C)",
          "~35% dari order yang memuat deterjen",
          "Pewangi dipindah ke zona lebih dekat dari yang seharusnya diberikan frekuensinya sendiri",
        ],
      ],
    },
    {
      type: "p",
      text: "Analisis afinitas biasanya ditarik dari data co-occurrence sederhana: untuk tiap order, catat SKU apa saja yang muncul bersamaan, lalu hitung frekuensi tiap pasangan. Pasangan dengan porsi kemunculan tinggi jadi kandidat penempatan berdekatan, meski salah satu anggotanya sendirian tidak cukup sering untuk masuk kelas A.",
    },
    {
      type: "h2",
      id: "replenishment-dan-ukuran-pick-face",
      text: "Replenishment dan Ukuran Pick Face",
    },
    {
      type: "p",
      text: "Variabel kelima bukan soal di mana SKU ditaruh, tapi seberapa besar slotnya. SKU dengan frekuensi tinggi butuh pengisian ulang (replenishment) dari gudang reserve ke pick face lebih sering dibanding SKU yang jarang bergerak. Kalau pick face-nya terlalu kecil untuk volume yang lewat, replenishment terjadi berkali-kali dalam satu shift, dan setiap kali itu terjadi di jam sibuk, lorong utama tersendat karena picker lain harus mengalah memberi jalan.",
    },
    {
      type: "table",
      caption: "Frekuensi replenishment dan kebutuhan ukuran pick face",
      head: ["Frekuensi replenishment per shift", "Implikasi ukuran pick face"],
      rows: [
        ["1 kali atau kurang", "Pick face standar biasanya cukup"],
        ["2-3 kali", "Pick face diperbesar, atau jadwalkan replenishment di luar jam sibuk"],
        ["Lebih dari 3 kali", "Pertimbangkan flow lane atau pallet langsung di pick face, bukan rak shelf kecil"],
      ],
    },
    {
      type: "p",
      text: "SKU kelas A dengan pick face yang terlalu kecil sering terlihat 'sering kosong' di lantai, padahal masalahnya bukan kekurangan stok, tapi ukuran slotnya yang tidak sepadan dengan kecepatan barang itu bergerak.",
    },
    {
      type: "h2",
      id: "pergeseran-musiman",
      text: "Pergeseran Musiman pada Kelas SKU",
    },
    {
      type: "p",
      text: "Variabel keenam mengubah semua perhitungan di atas tergantung kapan datanya ditarik. Kelas ABC yang dihitung dari data bulan biasa bisa meleset jauh untuk SKU yang permintaannya melonjak musiman, produk terkait Lebaran, musim hujan, atau periode promosi besar.",
    },
    {
      type: "table",
      caption: "Contoh pergeseran kelas SKU antar musim (ilustrasi, bukan hasil pengamatan satu gudang tertentu)",
      head: ["SKU (ilustrasi)", "Kelas di musim normal", "Kelas di musim puncak", "Implikasi"],
      rows: [
        [
          "Parsel atau hampers",
          "Kelas C sepanjang tahun",
          "Kelas A di 6-8 minggu menjelang Lebaran",
          "Perlu zona sementara dekat titik proses selama periode itu, bukan reslotting permanen",
        ],
        [
          "Perlengkapan musim hujan (jas hujan, terpal)",
          "Kelas C di musim kemarau",
          "Kelas A di awal musim hujan",
          "Sama, zona sementara yang dibuka dan ditutup mengikuti musim",
        ],
      ],
    },
    {
      type: "p",
      text: "Untuk SKU dengan pola musiman yang jelas, solusinya bukan reslotting permanen dua kali setahun, tapi zona cadangan dekat titik proses yang dibuka khusus selama periode puncak, lalu dikembalikan ke penempatan normal begitu musim itu lewat. Gudang yang kapasitasnya sudah mepet saat peak season biasanya juga menghadapi masalah lonjakan volume secara umum, bukan cuma soal slotting SKU musiman.",
    },
    {
      type: "h2",
      id: "menggabungkan-enam-variabel",
      text: "Menggabungkan Enam Variabel Jadi Satu Urutan Penempatan",
    },
    {
      type: "table",
      caption: "Ringkasan enam variabel penentu prioritas slotting",
      head: ["Variabel", "Yang diukur", "Sumber data", "Mengubah keputusan apa"],
      rows: [
        ["Frekuensi baris pesanan", "Berapa kali SKU diambil per periode", "Laporan pengambilan WMS atau tally manual", "Menentukan kandidat awal kelas A/B/C"],
        ["Volume dipindah (cube)", "Total volume kubik yang berpindah per periode", "Dimensi SKU dikali jumlah pengambilan", "Menentukan jenis slot: rak kecil vs flow lane pallet"],
        ["Batasan penanganan", "Berat, kerapuhan, bahaya, kebutuhan suhu", "Spesifikasi produk, lembar data keselamatan", "Menyaring SKU yang tidak boleh masuk golden zone meski frekuensinya tinggi"],
        ["Afinitas antar-SKU", "Porsi order yang memuat pasangan SKU bersamaan", "Data co-occurrence per order", "Menaikkan prioritas penempatan SKU yang individunya tidak cukup sering"],
        ["Replenishment", "Frekuensi pengisian ulang pick face per shift", "Log replenishment WMS", "Menentukan ukuran slot, bukan cuma lokasinya"],
        ["Pergeseran musiman", "Perubahan kelas ABC antar periode", "Data historis per musim", "Menentukan perlu tidaknya zona cadangan sementara"],
      ],
    },
    {
      type: "p",
      text: "Urutan praktisnya bukan menghitung keenam variabel serentak lalu menjumlahkannya jadi satu skor tunggal, itu perhitungan yang gampang terlihat presisi tapi angkanya sulit dipertanggungjawabkan begitu ditanya asal bobotnya. Urutan yang lebih bisa dikerjakan: hitung frekuensi dan volume dulu untuk mendapat kandidat kelas A, saring dengan batasan penanganan sebagai filter keras, cek afinitas untuk kandidat tambahan yang layak ikut pindah, sesuaikan ukuran slot dengan pola replenishment, lalu tandai SKU yang perlu perlakuan musiman terpisah dari layout permanen.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Kenapa Bukan Satu Skor Gabungan Saja",
      body: "Skor tunggal yang menjumlahkan keenam variabel dengan bobot tertentu kelihatan rapi di spreadsheet, tapi bobot itu nyaris selalu ditentukan secara sembarang, bukan dari data. Menjalankan enam variabel sebagai filter bertahap, bukan satu rumus gabungan, membuat setiap keputusan penempatan bisa dijelaskan variabel mana yang jadi alasannya.",
    },
    {
      type: "h2",
      id: "contoh-sebelum-sesudah",
      text: "Sebelum-Sesudah: Proyeksi Dampak Frekuensi Saja vs Enam Variabel",
    },
    {
      type: "p",
      text: "Contoh berikut disederhanakan untuk menunjukkan dampaknya, bukan catatan satu gudang tertentu, memakai angka dari ilustrasi kelas A di atas: 42 SKU kelas A yang tersimpan di zona jauh, rata-rata 70 meter dari titik proses, masing-masing dipesan 14 kali per hari, dengan kecepatan jalan picker diasumsikan 1,2 meter per detik.",
    },
    {
      type: "table",
      caption: "Proyeksi dampak tiga skenario penempatan (angka ilustrasi, disederhanakan dari kasus di atas)",
      head: ["Skenario", "Penempatan", "Proyeksi dampak"],
      rows: [
        [
          "Sebelum (posisi asal, tidak pernah ditinjau)",
          "42 SKU tersebar di zona jauh, rata-rata 70 m dari titik proses",
          "588 pengambilan/hari untuk 42 SKU ini, jarak tempuh jadi komponen waktu picking yang paling besar",
        ],
        [
          "Reslotting berbasis frekuensi saja (ABC-only)",
          "Seluruh 42 SKU dipindah ke golden zone, rata-rata ~5 m",
          "Proyeksi hemat sekitar 8,85 jam kerja/hari (selisih 65 m x 588 pengambilan pada 1,2 m/detik), setara ±Rp3,3 juta/bulan pada upah harian Rp150.000, tapi rencana ini belum memperhitungkan 3 SKU berkarton berat yang tidak aman ditaruh di rak setinggi bahu",
        ],
        [
          "Reslotting enam variabel",
          "39 SKU pindah ke golden zone (~5 m); 3 SKU karton berat pindah ke pallet flow lane lantai dekat titik proses (~15 m) karena batasan penanganan",
          "Proyeksi hemat sekitar 8,75 jam kerja/hari, hampir sama besar dengan skenario ABC-only, tapi rencana ini benar-benar bisa dijalankan tanpa perlu dibongkar ulang",
        ],
      ],
    },
    {
      type: "p",
      text: "Selisih proyeksi antara dua skenario itu kecil, sekitar 6 menit kerja per hari. Yang membedakan bukan besar penghematannya, tapi apakah rencana itu bisa benar-benar dijalankan tanpa perlu dibongkar ulang begitu picker mengangkat karton berat dari rak setinggi bahu berkali-kali sehari.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Ongkos Membongkar Ulang Rencana yang Terburu-buru",
      body: "Kalau rencana ABC-only sempat dijalankan dulu sebelum batasan penanganan diperiksa, karton berat yang sudah ditaruh di rak bahu biasanya harus dipindah lagi begitu ada keluhan ergonomis atau insiden nyaris cedera. Ongkos gangguan operasionalnya jadi dua kali, sekali saat reslotting pertama, sekali lagi saat membenahi kesalahannya, padahal pemeriksaan batasan penanganan di awal cuma butuh beberapa jam menyilangkan daftar SKU kelas A dengan spesifikasi berat produknya.",
    },
    {
      type: "h2",
      id: "menerapkan-metode-ke-data-sendiri",
      text: "Menerapkan Metode Ini ke Data Gudang Anda Sendiri",
    },
    {
      type: "p",
      text: "Keenam variabel di atas tidak butuh alat baru untuk mulai dihitung. Sebagian besar sudah tersimpan di WMS atau sistem order yang berjalan, dan yang belum tersedia bisa didekati dari catatan manual selama beberapa minggu.",
    },
    {
      type: "ol",
      items: [
        "**Tarik data frekuensi dan volume per SKU** selama 3-6 bulan representatif, lalu hitung kelas ABC dari kurva kumulatifnya, bukan angka baku 80/15/5.",
        "**Susun daftar batasan penanganan** sebagai filter keras: berat di atas ambang angkat manual, mudah pecah, berbahaya, atau butuh suhu khusus. Saring kandidat kelas A dengan daftar ini sebelum menentukan zona.",
        "**Jalankan analisis co-occurrence sederhana** dari data order untuk menemukan pasangan SKU yang sering dipesan bersamaan, lalu tandai kandidat yang layak ikut dipindah berdekatan meski frekuensi individunya biasa saja.",
        "**Bandingkan frekuensi replenishment dengan ukuran pick face saat ini** untuk SKU kelas A, terutama yang sering terlihat kosong padahal stoknya sebenarnya ada di gudang reserve.",
        "**Ulangi kelas ABC untuk periode musiman** kalau bisnis Anda punya pola permintaan yang jelas berubah mengikuti musim, dan siapkan zona cadangan sementara alih-alih reslotting permanen berulang kali.",
        "**Baru setelah lima langkah di atas, petakan hasilnya ke zona rak**, dan urutkan pengerjaan reslotting dari SKU dengan selisih jarak dan volume terbesar dulu.",
      ],
    },
    {
      type: "p",
      text: "Picker paling produktif bukan yang paling cepat berjalan, tapi yang jaraknya paling pendek karena tata letak di belakangnya sudah dihitung dari enam variabel itu, bukan cuma dari satu angka frekuensi yang kebetulan paling gampang ditarik dari laporan.",
    },
  ],
  faq: [
    {
      q: "Apakah gudang kecil dengan SKU sedikit tetap perlu menghitung keenam variabel ini?",
      a: "Belum tentu semuanya sekaligus. Untuk katalog di bawah beberapa ratus SKU dengan variasi berat dan penanganan yang kecil, frekuensi dan batasan penanganan biasanya sudah cukup. Variabel afinitas, replenishment, dan musiman baru terasa dampaknya begitu jumlah SKU dan variasi jenis barang bertambah.",
    },
    {
      q: "Bagaimana penerapannya untuk gudang 3PL yang menyimpan banyak customer sekaligus?",
      a: "Keenam variabel dihitung per customer dalam zona alokasinya masing-masing, karena SKU kelas A milik satu customer belum tentu relevan bagi customer lain yang berbagi ruang. Untuk gudang dengan layout yang digabung lintas customer, perhitungan afinitas dan replenishment bisa dijalankan gabungan, asal jalur pickingnya memang dipakai bersama.",
    },
  ],
  cta: {
    title: "Hitung Volume Kubik SKU Sebelum Menentukan Jenis Slot",
    body: "Variabel kedua di atas, volume yang dipindah, butuh angka CBM per SKU, bukan cuma jumlah baris pesanan, untuk menentukan mana yang cocok di rak shelving kecil dan mana yang perlu flow lane pallet. Kalkulator CBM CargoGrid mengubah dimensi karton atau pallet jadi angka kubik yang bisa langsung dibandingkan antar SKU sebelum reslotting dijalankan.",
    linkHref: "/alat/kalkulator-cbm",
    linkLabel: "Buka Kalkulator CBM",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Catatan ini disusun dari pola audit slotting yang berulang di gudang consumer goods dan FMCG skala menengah, tempat data frekuensi pengambilan biasanya sudah tersedia di WMS tapi jarang disilangkan dengan volume, batasan penanganan, afinitas, dan pola musiman.",
  },
  related: ["wms-3pl-level-bin", "kpi-operasional-logistik", "lonjakan-musiman-kapasitas-peak-season"],
  relatedTools: ["kalkulator-cbm", "kamus-logistik"],
};
