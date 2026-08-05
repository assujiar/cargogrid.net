import type { Article } from "./types";

export const article: Article = {
  slug: "lonjakan-musiman-kapasitas-peak-season",
  layout: "primer",
  title:
    "Kapasitas Peak Season yang Selalu Salah Tebak: Kenapa Buffer Tahun Lalu Menganggur, Musim Ini Malah Kurang",
  metaTitle: "Kapasitas Peak Season: Newsvendor Problem dan Buffer",
  description:
    "Kapasitas ekstra Harbolnas menganggur, giliran Lebaran malah kurang. Newsvendor problem menjelaskan cara menentukan buffer kapasitas yang pas dari data historis.",
  keywords: [
    "perencanaan kapasitas peak season",
    "manajemen kapasitas logistik lebaran",
    "kapasitas armada harbolnas",
    "newsvendor problem logistik",
    "kontrak kapasitas fleksibel subkontraktor",
    "buffer kapasitas gudang musim puncak",
  ],
  category: "komersial",
  publishedAt: "2026-07-07",
  summary:
    "Menjelang Lebaran, kapasitas armada dan gudang Anda kewalahan dan customer komplain keterlambatan, padahal lima bulan sebelumnya kapasitas ekstra untuk Harbolnas berakhir menganggur jadi biaya sia-sia. Newsvendor problem, prinsip klasik riset operasi soal berapa banyak kapasitas cadangan optimal disiapkan menghadapi permintaan tak pasti, menjelaskan kenapa dua kejadian berlawanan ini bisa terjadi berurutan. Tulisan ini membahas cara memakai data historis, kontrak kapasitas fleksibel, dan komunikasi lebih awal ke customer untuk menentukan buffer yang masuk akal.",
  takeaways: [
    "Kapasitas cadangan musim puncak bersifat mudah rusak: begitu jendela waktunya lewat, kapasitas yang tak terpakai kehilangan nilainya seketika, sama seperti koran yang tak laku di sore hari.",
    "Rasio kritis, yaitu perbandingan ongkos kekurangan kapasitas dengan ongkos kelebihan kapasitas, menentukan persentil data historis mana yang layak jadi target buffer, bukan rata-rata dan bukan skenario terburuk.",
    "Data lonjakan lima musim terakhir sudah cukup membangun distribusi yang jauh lebih andal ketimbang menebak berdasar insting atau menambah persentase tetap tiap tahun.",
    "Kontrak kapasitas fleksibel dengan biaya siaga jauh lebih murah dibanding sewa penuh, dan itu mengubah rasio kritis sehingga buffer yang ekonomis bisa dipasang lebih tinggi.",
  ],
  blocks: [
    {
      type: "p",
      text: "Sepuluh hari menjelang Lebaran tahun ini, gudang fulfillment mitra Anda di Semarang penuh sesak. Truk yang biasanya datang jam tujuh pagi molor sampai sore, beberapa slot penjemputan bahkan kosong sama sekali. Volume harian yang normalnya 1.150 order melonjak ke 2.400 dalam kurang dari dua minggu. Tim dispatcher menelepon subkontraktor satu per satu mencari truk tambahan, tapi separuh dari mereka sudah terikat kontrak dengan pemain lain yang lebih dulu memesan dua bulan sebelumnya.",
    },
    {
      type: "p",
      text: "Customer komplain keterlambatan datang beruntun sepanjang minggu itu. Yang bikin cerita ini pahit: lima bulan sebelumnya, menjelang Harbolnas 2025, tim yang sama sudah menyewa 15 truk ekstra selama tiga minggu, mengantisipasi lonjakan seperti dua musim sebelumnya yang biasa tembus 65–70% di atas rata-rata. Realisasinya cuma naik 48%. Truk sewaan nganggur di pool, sementara tagihan sewa harian tetap berjalan penuh: sekitar Rp172 juta dari komitmen Rp315 juta jadi biaya tanpa hasil.",
    },
    {
      type: "p",
      text: "Dua kejadian ini berlawanan arah persis, dan itu bukan kebetulan buruk semata. Keduanya lahir dari akar yang sama, yaitu tidak adanya angka jelas yang menjawab pertanyaan paling mendasar: seberapa besar kapasitas cadangan yang masuk akal disiapkan, padahal permintaan musim puncak tidak pernah bisa ditebak persis.",
    },
    {
      type: "h2",
      id: "soal-newsvendor",
      text: "Newsvendor Problem: Nama Lama untuk Masalah yang Anda Hadapi Tiap Musim",
    },
    {
      type: "p",
      text: "Riset operasi sudah memecahkan masalah ini sejak lama, jauh sebelum ada Harbolnas atau belanja online. Namanya **newsvendor problem**, diambil dari penjual koran yang tiap pagi memutuskan berapa eksemplar dipesan dari distributor, padahal jumlah pembeli hari itu belum diketahui. Pesan kurang, ia kehilangan penjualan. Pesan kelebihan, koran sisa sore sudah basi dan tidak laku dijual besok.",
    },
    {
      type: "p",
      text: "Kapasitas ekstra musim puncak punya sifat sama: mudah rusak. Truk sewaan yang nganggur hari Selasa tidak bisa disimpan untuk dipakai hari Kamis kalau lonjakannya baru datang hari itu. Tenaga kerja harian yang sudah dibayar untuk shift tambahan tidak bisa dikembalikan begitu jam kerjanya lewat tanpa ada barang untuk dikerjakan. Begitu jendela waktu itu lewat, nilainya hilang seketika.",
    },
    {
      type: "p",
      text: "Newsvendor problem mengajarkan bahwa kapasitas optimal ditentukan oleh perbandingan dua ongkos: ongkos kekurangan melawan ongkos kelebihan. Titik keseimbangannya disebut **rasio kritis**, dan angka itu menentukan persentil dari distribusi permintaan historis yang layak dijadikan target, bukan rata-rata, apalagi skenario terburuk yang pernah tercatat.",
    },
    {
      type: "h2",
      id: "dua-ongkos-yang-tarik-menarik",
      text: "Dua Ongkos yang Selama Ini Jarang Dihitung Bersamaan",
    },
    {
      type: "p",
      text: "Rasio kritis kedengarannya abstrak sampai dipetakan ke angka yang dihadapi tim Anda tiap musim puncak.",
    },
    {
      type: "ul",
      items: [
        "**Ongkos kekurangan (Cu).** Kapasitas kurang dari permintaan riil. Sebagian besar kasus cuma kena kredit SLA kecil sekitar Rp50.000 per order. Sebagian naik jadi biaya reroute darurat lewat kurir instan, 3–4 kali lipat tarif normal. Sebagian kecil lagi berisiko membuat customer besar pindah kontrak musim depan.",
        "**Ongkos kelebihan (Co).** Kapasitas lebih besar dari yang terpakai. Sewa truk atau upah tenaga tambahan tetap dibayar penuh meski tidak ada barang untuk dikerjakan.",
      ],
    },
    {
      type: "p",
      text: "Dirata-ratakan tertimbang, ongkos kekurangan efektif di kasus Semarang berkisar Rp90.000 per order yang gagal dilayani sesuai janji. Satu truk yang nganggur sehari menanggung ongkos sewa penuh Rp900.000; dengan kapasitas 40 order per truk, ongkos kelebihan per unit jadi sekitar Rp22.500.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Rasio Kritis dari Angka di Atas",
      body: "Rasio kritis dihitung dari Cu dibagi (Cu ditambah Co): 90.000 ÷ (90.000 + 22.500) = 0,80. Target kapasitas seharusnya mengarah ke persentil ke-80 dari distribusi historis lonjakan. Begitu ongkos kelebihan berhasil diturunkan (misalnya lewat kontrak fleksibel yang dibahas nanti), target persentilnya ikut naik, karena menyiagakan kapasitas ekstra jadi lebih murah.",
    },
    {
      type: "h2",
      id: "data-tiga-tahun-lonjakan",
      text: "Membaca Lima Musim Puncak Terakhir, Bukan Cuma Satu",
    },
    {
      type: "p",
      text: "Satu musim puncak tidak pernah cukup jadi dasar keputusan. Lima musim terakhir, dari Lebaran 2024 sampai Lebaran 2026 yang baru lewat, sudah cukup melihat pola, alih-alih bergantung pada satu titik data yang gampang menyesatkan.",
    },
    {
      type: "table",
      caption: "Lonjakan lima musim puncak terakhir, di atas rata-rata harian",
      head: ["Musim", "Lonjakan di atas rata-rata"],
      rows: [
        ["Lebaran 2024", "+65%"],
        ["Harbolnas 2024", "+71%"],
        ["Lebaran 2025", "+52%"],
        ["Harbolnas 2025", "+48%"],
        ["Lebaran 2026", "+109%"],
      ],
    },
    {
      type: "p",
      text: "Diurutkan dari yang paling kecil: 48%, 52%, 65%, 71%, 109%. Rata-rata sederhananya sekitar 69%. Tapi rasio kritis 0,80 menunjuk ke persentil ke-80, yaitu 71%, nilai terbesar keempat dari lima data yang ada.",
    },
    {
      type: "p",
      text: "Gabungan armada milik sendiri dan kontrak tetap sanggup menangani sampai 1.400 order per hari. Target buffer 71% di atas baseline 1.150 berarti kapasitas total sekitar 2.000 order per hari, tambahan 600 order di atas kapasitas inti, setara 15 truk ekstra, persis jumlah yang disewa penuh menjelang Harbolnas 2025.",
    },
    {
      type: "p",
      text: "Angka +109% dari Lebaran 2026 tetap tercatat, tapi memaksakan kapasitas tetap sebesar itu tiap musim berarti membayar ongkos kelebihan penuh di empat dari lima kejadian, hanya untuk menutup satu skenario ekstrem yang jarang berulang.",
    },
    {
      type: "h2",
      id: "tiga-cara-menentukan-buffer",
      text: "Tiga Cara Menentukan Buffer, dan Kenapa Dua di Antaranya Gagal",
    },
    {
      type: "p",
      text: "Ada tiga cara menentukan buffer musim puncak, dan hanya satu yang benar-benar menghitung ongkos, bukan menebak.",
    },
    {
      type: "table",
      caption: "Tiga cara menentukan buffer musim puncak",
      head: ["Pendekatan", "Cara kerja", "Risiko"],
      rows: [
        [
          "Insting tim lapangan",
          "Menambah kapasitas berdasar perasaan “kayaknya perlu lebih banyak dari tahun lalu”",
          "Naik-turun tergantung siapa yang memutuskan, tidak ada cara mengevaluasinya setelah musim lewat",
        ],
        [
          "Pukul rata +30% tiap tahun",
          "Menambah persentase tetap tanpa melihat pola historis atau ongkos kekurangan-kelebihan",
          "Kadang kebesaran, kadang kekecilan, karena lonjakan riil tidak pernah sama tiap musim",
        ],
        [
          "Persentil data historis + rasio kritis",
          "Kumpulkan data lonjakan 2–3 tahun, hitung rasio kritis, arahkan buffer ke persentil yang sesuai",
          "Butuh disiplin mencatat data tiap musim dan memperbarui estimasi ongkos",
        ],
      ],
    },
    {
      type: "p",
      text: "Pendekatan ketiga tidak bebas dari kesalahan. Bedanya, kesalahannya bisa dijelaskan angkanya dan diperbaiki musim berikutnya.",
    },
    {
      type: "h2",
      id: "kontrak-kapasitas-fleksibel",
      text: "Kontrak Kapasitas Fleksibel: Bayar Murah untuk Siaga, Bayar Penuh Kalau Dipakai",
    },
    {
      type: "p",
      text: "Gap antara buffer yang dikomit penuh (71%, sekitar 2.000 order/hari) dan skenario ekstrem (109%, sekitar 2.400 order/hari) sekitar 400 order per hari, setara 10 truk. Menyewa penuh kapasitas sebesar itu untuk skenario yang cuma terjadi sekali dalam lima kali jelas mahal. Di sinilah kontrak kapasitas fleksibel jadi masuk akal.",
    },
    {
      type: "p",
      text: "Bentuknya sederhana: alih-alih menyewa truk penuh Rp900.000/hari untuk seluruh window, negosiasikan biaya siaga sekitar Rp150.000/truk/hari sebagai kompensasi subkontraktor menahan slotnya untuk Anda. Truk baru dikenakan tarif penuh pada hari ia benar-benar ditarik ke lapangan.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Skema Siaga untuk 10 Truk Cadangan",
      body: "Bandingkan dua skema untuk 10 truk cadangan selama 20 hari window Harbolnas. Skema sewa penuh: 10 × Rp900.000 × 20 hari = Rp180 juta, dibayar penuh apa pun realisasinya. Skema siaga: 10 truk × Rp150.000 × 20 hari = Rp30 juta biaya siaga, ditambah tarif penuh hanya untuk truk-hari yang ditarik. Kalau realisasinya cuma 4 truk selama 5 hari puncak (20 truk-hari), totalnya Rp30 juta + Rp18 juta = Rp48 juta, sekitar seperempat dari skema sewa penuh.",
    },
    {
      type: "p",
      text: "Catatan lima musim di atas menjelaskan insiden Harbolnas 2025 lebih tepat: buffer 15 truk yang disewa saat itu sebetulnya sudah dekat rasio kritis yang benar. Yang keliru adalah bentuk komitmennya: seluruhnya disewa penuh, padahal skema siaga akan membuat realisasi rendah seperti itu jauh lebih murah ditanggung.",
    },
    {
      type: "h2",
      id: "prinsip-yang-sama-untuk-gudang",
      text: "Prinsip yang Sama Berlaku untuk Tenaga Gudang",
    },
    {
      type: "p",
      text: "Gudang Semarang di awal cerita ini kewalahan karena dua sebab sekaligus: truk terlambat datang, dan tenaga picking-packing hariannya tidak ditambah cukup jauh-jauh hari.",
    },
    {
      type: "p",
      text: "Tenaga kerja harian menanggung ongkos yang sama: kalau kurang, order menumpuk dan molor; kalau lebih, upah harian tetap dibayar penuh meski jam kerja dihabiskan menunggu barang dari truk yang telat. Rasio kritis yang sama berlaku, hanya unitnya berubah dari truk per hari menjadi tenaga kerja per shift.",
    },
    {
      type: "p",
      text: "Bedanya, kapasitas tenaga kerja lebih gampang dilipat: agen penyalur bisa menyediakan tambahan dalam hitungan hari, jauh lebih cepat dibanding truk yang perlu dikoordinasikan lintas subkontraktor berminggu-minggu sebelumnya. Buffer inti gudang bisa dipasang dekat rata-rata historis, sementara ekstra untuk skenario ekstrem dipesan belakangan begitu tren mingguan mulai terlihat.",
    },
    {
      type: "h2",
      id: "komunikasi-kapasitas-ke-customer",
      text: "Mengabari Customer Sebelum Mereka Bertanya Sendiri",
    },
    {
      type: "p",
      text: "Buffer yang dihitung cermat masih bisa kebobolan kalau customer tidak pernah diberi tahu batasnya. Kapasitas 2.000 order per hari yang dikunci untuk Harbolnas 2026 perlu sampai ke customer besar jauh-jauh hari, idealnya delapan minggu sebelum window puncak dimulai.",
    },
    {
      type: "ul",
      items: [
        "**Tetapkan cutoff pemesanan.** Order yang masuk setelah H-14 sebelum window puncak otomatis masuk antrean prioritas kedua, dengan estimasi kirim yang sudah disesuaikan.",
        "**Bagi kuota berdasarkan proporsi historis.** Customer dengan volume rutin 20% dari kapasitas Anda mendapat jaminan proporsi yang sama dari buffer, dikunci sejak awal agar tidak jadi rebutan.",
        "**Perpanjang SLA khusus musim puncak.** SLA normal 1–2 hari diperpanjang jadi 2–4 hari selama window resmi, dikomunikasikan sebagai kebijakan tertulis sejak awal musim.",
        "**Kabari revisi lebih awal.** Begitu ada indikasi lonjakan melebihi buffer, informasikan customer prioritas paling lambat tiga hari sebelum dampaknya terasa.",
      ],
    },
    {
      type: "p",
      text: "Empat langkah ini tidak menambah satu unit kapasitas pun. Yang berubah cuma ekspektasi customer, dan ekspektasi realistis sejak awal jauh lebih murah dijaga ketimbang kepercayaan yang sudah terlanjur pecah.",
    },
    {
      type: "h2",
      id: "menjadikan-proses-tahunan",
      text: "Menjadikan Ini Proses Tahunan, Bukan Tebakan Ulang Tiap Musim",
    },
    {
      type: "p",
      text: "Tiga hal perlu diulang tiap tahun, idealnya delapan minggu sebelum window musim puncak berikutnya: masukkan data musim yang baru lewat ke distribusi historis, tinjau ulang estimasi Cu dan Co karena tarif bisa berubah, lalu hitung ulang rasio kritis beserta target persentilnya.",
    },
    {
      type: "p",
      text: "Pantau dua angka untuk menandai apakah proses ini berjalan benar. Pertama, service level yang tercapai dibanding persentil yang ditargetkan: kalau targetnya P80 tapi keterlambatan tetap tinggi, ongkos kekurangan kemungkinan dihitung terlalu rendah. Kedua, tingkat pemakaian buffer yang sudah dikomit: kalau truk siaga nyaris tidak pernah ditarik tiga musim berturut-turut, target persentilnya kemungkinan kelewat tinggi, dan sebagian komitmen bisa digeser ke skema siaga yang lebih murah.",
    },
    {
      type: "quote",
      text: "Kapasitas yang menganggur kelihatan jelas di laporan biaya bulan berikutnya. Customer yang diam-diam pindah karena kecewa musim lalu tidak pernah muncul di laporan mana pun, sampai omzetnya ikut hilang.",
    },
  ],
  faq: [
    {
      q: "Berapa lama sebelum musim puncak, kontrak kapasitas fleksibel sebaiknya sudah dikunci?",
      a: "Idealnya delapan minggu sebelum window musim puncak dimulai. Subkontraktor butuh waktu mengatur ulang komitmen dengan mitra lain, dan begitu mereka terikat kontrak dengan pemain lain yang lebih dulu booking, negosiasi Anda kehilangan daya tawar.",
    },
    {
      q: "Apakah rumus rasio kritis yang sama berlaku untuk tenaga kerja gudang, bukan cuma armada?",
      a: "Berlaku, prinsipnya sama persis. Yang berbeda cuma unit kapasitasnya: truk per hari jadi tenaga kerja per shift, dan ongkos kelebihannya jadi upah harian yang tetap dibayar meski jam kerja dihabiskan menunggu barang.",
    },
    {
      q: "Bagaimana kalau perusahaan baru berjalan dan data historisnya cuma satu tahun?",
      a: "Pakai data historis internal semampu yang tersedia, lengkapi dengan benchmark dari platform e-commerce atau asosiasi logistik yang biasa mempublikasikan pola kenaikan volume musiman. Pasang buffer sedikit konservatif di tahun pertama, lalu revisi begitu data milik sendiri terkumpul.",
    },
    {
      q: "Apakah menargetkan service level setinggi mungkin, misalnya P95 ke atas, selalu pilihan paling aman?",
      a: "Tidak selalu. Target service level ditentukan oleh rasio kritis, perbandingan ongkos kekurangan dengan ongkos kelebihan. Menaikkannya ke P95 tanpa menghitung ulang rasio itu sering berakhir jadi keputusan paling boros, meski kelihatannya paling aman di atas kertas.",
    },
  ],
  related: [
    "negosiasi-tarif-tahunan-kontrak-shipper",
    "manajemen-vendor-subkontraktor",
    "slotting-tata-letak-gudang-produktivitas-picking",
  ],
  relatedTools: ["kalkulator-muatan-truk", "jenis-truk-indonesia"],
};
