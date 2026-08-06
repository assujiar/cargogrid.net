import type { Article } from "./types";

export const article: Article = {
  slug: "tracking-multimoda-indonesia",
  layout: "primer",
  format: "Regulatory Explainer",
  title: "Batas Realistis Tracking Multimoda per Moda Pengiriman",
  metaTitle: "Tracking Multimoda per Moda: Standar dan Batas Realistis",
  description:
    "Referensi tracking per moda pengiriman: standar industri seperti DCSA dan Cargo-iQ, praktik operasional trucking dan gudang di Indonesia, serta cara membedakan status terkonfirmasi, estimasi, dan menunggu update sebelum menjanjikan ETA ke customer.",
  keywords: [
    "tracking multimoda indonesia",
    "standar tracking pengiriman",
    "eta pengiriman logistik",
    "milestone tracking kargo",
    "dcsa track and trace",
  ],
  category: "operasional",
  publishedAt: "2026-06-23",
  updatedAt: "2026-08-06",
  summary:
    "\"Real-time tracking\" berarti berbeda-beda tergantung sumber datanya: laut dan udara bersandar pada kerangka milestone industri yang diadopsi sukarela, trucking dan gudang berjalan di atas praktik internal tanpa standar eksternal. Referensi ini memetakan sumber, kepastian, dan pemilik data di tiap moda, supaya janji ETA yang Anda berikan ke customer sesuai dengan yang benar-benar bisa dipenuhi sistem Anda.",
  takeaways: [
    "\"Real-time tracking\" tidak berdiri di atas satu standar. Laut condong ke kerangka macam DCSA Track & Trace, udara ke Cargo-iQ, sementara trucking dan gudang berjalan di atas praktik internal masing-masing operator.",
    "Setiap status logistik jatuh ke salah satu dari tiga kategori: terkonfirmasi, estimasi, atau menunggu update, dan customer berhak tahu yang mana yang sedang mereka lihat.",
    "Kepastian data tertinggi ada di titik yang paling dekat dengan aktivitas fisik: GPS truk, pemindaian gudang. Makin jauh dari situ, jadwal kapal, milestone maskapai, makin besar porsi estimasi di dalamnya.",
    "Menempelkan status kepastian di sebelah setiap update jauh lebih murah dan lebih efektif meredam salah paham dibanding menambah satu integrasi baru.",
  ],
  blocks: [
    {
      type: "p",
      text: "\"Real-time tracking\" bukan satu standar yang sama di semua moda. Istilah yang sering disebut sebagai satu hal itu sebenarnya empat sumber data berbeda, masing-masing dengan kerangka acuan, kecepatan, dan tingkat kepastian sendiri: laut dan udara berjalan di atas kerangka milestone industri yang diadopsi sukarela oleh pelayaran dan maskapai, sementara trucking dan gudang berjalan di atas praktik internal masing-masing operator, tanpa standar eksternal yang mengikat.",
    },
    {
      type: "p",
      text: "Referensi ini memetakan keempatnya berdampingan: dari mana setiap update datang, seberapa sering datang, seberapa pasti isinya, siapa yang memegang kendali atas datanya, dan janji seperti apa yang jujur untuk disampaikan ke customer untuk masing-masing moda. Tujuannya bukan membuat tracking terlihat lebih canggih di layar, tapi memastikan setiap status yang Anda tampilkan bisa dipertanggungjawabkan sumbernya.",
    },
    {
      type: "h2",
      id: "dasar-kecepatan-data",
      text: "Kerangka berpikir dasar: kecepatan update harus mengikuti kecepatan keputusan",
    },
    {
      type: "p",
      text: "Insinyur elektro punya istilah untuk ini: prinsip Nyquist, intinya menyampling sesuatu jauh lebih cepat daripada laju perubahan sinyal aslinya cuma menghabiskan sumber daya tanpa menambah informasi baru. Ini bukan standar industri logistik, cuma alat bantu berpikir dari bidang lain yang kebetulan pas dipakai di sini: nilai sebuah update ditentukan oleh seberapa cocok frekuensinya dengan irama keputusan yang diambil orang berdasarkan data itu.",
    },
    {
      type: "p",
      text: "Kalau posisi truk diperbarui tiap menit sementara dispatcher baru mengambil keputusan sekali per jam, sebagian besar pembaruan di antaranya cuma menghabiskan kuota data tanpa mengubah satu keputusan pun. Sebaliknya, menambahkan satu keterangan kecil, status kepastian di sebelah setiap update, sering memberi manfaat lebih besar daripada membangun satu integrasi baru yang mahal, karena tanpa keterangan itu siapa pun yang membaca status tidak punya cara menilai apakah data itu masih relevan untuk keputusan yang sedang mereka ambil.",
    },
    {
      type: "h2",
      id: "matriks-referensi-per-moda",
      text: "Matriks referensi: kerangka acuan, kepastian, dan pemilik data per moda",
    },
    {
      type: "p",
      text: "Tabel berikut menyandingkan empat moda yang biasanya muncul dalam satu shipment gabungan. Baris paling atas sengaja memisahkan mana yang benar-benar standar industri dan mana yang sekadar praktik operasional, karena dua hal itu sering tercampur jadi satu klaim \"real-time\" yang terdengar sama meyakinkannya padahal dasarnya jauh berbeda.",
    },
    {
      type: "table",
      caption: "Sumber, kepastian, dan pemilik data per moda",
      head: ["", "Trucking darat", "Laut / kontainer", "Udara / kargo udara", "Gudang"],
      rows: [
        [
          "Kerangka acuan",
          "Tidak ada standar industri tunggal; format data mengikuti vendor GPS/telematika masing-masing (praktik pasar)",
          "Banyak pelayaran besar mengacu ke kerangka milestone DCSA Track & Trace (standar industri, adopsi sukarela)",
          "Sebagian maskapai dan agen kargo mengikuti pola milestone Cargo-iQ dari IATA (standar industri, adopsi bervariasi)",
          "Ditentukan konfigurasi WMS internal; tidak ada standar eksternal yang mengikat",
        ],
        [
          "Sumber event",
          "GPS di ponsel atau perangkat driver",
          "EDI/API dari pelayaran dan operator terminal",
          "Status dari maskapai dan agen ground handling",
          "Pemindaian barcode/RFID di titik proses",
        ],
        [
          "Latensi khas",
          "Hitungan menit",
          "Hitungan jam sampai hari",
          "Hitungan jam, lebih rapat dari laut tapi tetap per milestone, bukan posisi kontinu",
          "Per peristiwa, waktunya tidak menentu",
        ],
        [
          "Status default",
          "Terkonfirmasi (posisi aktual dari GPS)",
          "Terkonfirmasi untuk milestone yang sudah lewat, estimasi untuk yang masih di depan",
          "Sama seperti laut, jendela waktu estimasinya lebih sempit",
          "Terkonfirmasi begitu discan; menunggu update sebelum itu",
        ],
        [
          "Pemilik data",
          "Perusahaan sendiri untuk armada milik, subkontraktor untuk sisanya",
          "Pelayaran dan operator terminal, di luar kendali Anda",
          "Maskapai dan agen ground handling, di luar kendali Anda",
          "Tim internal Anda sendiri",
        ],
        [
          "Janji realistis ke customer",
          "Posisi terkini (terkonfirmasi)",
          "Milestone terakhir tercatat, plus estimasi tiba dalam bentuk rentang",
          "Milestone terakhir tercatat, plus estimasi tiba dengan rentang yang lebih sempit",
          "Status terakhir yang tercatat, dengan jam pastinya, atau tanda menunggu update",
        ],
      ],
    },
    {
      type: "p",
      text: "Baris \"Status default\" dan \"Pemilik data\" adalah dua baris yang paling menentukan janji apa yang boleh Anda berikan. Kalau pemilik datanya bukan tim Anda sendiri, pelayaran, maskapai, subkontraktor, anggap status itu berpotensi tertunda pelaporannya. Itu bukan berarti keliru, hanya belum tentu sinkron dengan kejadian yang sebenarnya sedang terjadi di lapangan.",
    },
    {
      type: "h3",
      text: "Laut / kontainer: standar resmi ada, kecepatan pelaporan tetap soal praktik",
    },
    {
      type: "p",
      text: "Untuk kapal kontainer, ada kerangka acuan yang cukup mapan: banyak pelayaran besar, termasuk yang melayani rute Indonesia, sudah mengadopsi format event milestone yang sejalan dengan standar Digital Container Shipping Association (DCSA) Track & Trace, semacam \"vessel departed\", \"vessel arrived\", \"container discharged\". Itu standar resmi di level industri pelayaran global, bukan regulasi pemerintah Indonesia. Yang membedakan satu pelayaran dari pelayaran lain adalah seberapa cepat dan seberapa konsisten mereka mengirim update itu ke sistem Anda, dan itu soal praktik operasional, bukan soal standarnya.",
    },
    {
      type: "p",
      text: "Dari pengalaman operasional kami mendampingi forwarder, milestone yang paling sering terlambat dilaporkan bukan keberangkatan atau kedatangan kapal, justru status di pelabuhan transit, karena beban kerja terminal dan urutan prioritas bongkar yang berubah-ubah, sesuatu yang tidak pernah tercermin di dokumentasi standar mana pun.",
    },
    {
      type: "h3",
      text: "Udara / kargo udara: Cargo-iQ sebagai acuan, pelaporan manual sebagai kenyataan",
    },
    {
      type: "p",
      text: "Kargo udara punya kerangka acuan sendiri: Cargo-iQ, inisiatif dari IATA, asosiasi maskapai internasional, mendefinisikan urutan milestone standar untuk pengiriman via udara, mulai dari booking sampai delivery. Sama seperti DCSA di laut, ini standar industri yang diadopsi maskapai dan agen kargo secara sukarela, bukan kewajiban hukum, jadi tingkat kepatuhannya berbeda-beda antar operator dan rute.",
    },
    {
      type: "p",
      text: "Latensi udara umumnya lebih rapat daripada laut karena siklus penerbangannya sendiri jauh lebih pendek, tapi jangan disamakan dengan trucking: update tetap datang per milestone (check-in, uplift, transit, breakdown, delivery), bukan posisi yang mengalir terus-menerus. Untuk rute domestik Indonesia, banyak agen kargo udara masih melaporkan status secara manual ke sistem forwarder, jadi kepastian datanya jatuh ke praktik operasional agen tersebut, bukan ke standar Cargo-iQ itu sendiri.",
    },
    {
      type: "h3",
      text: "Trucking darat: moda paling minim standar formalnya",
    },
    {
      type: "p",
      text: "Trucking darat justru moda yang paling minim standar formalnya. Tidak ada kerangka milestone industri yang setara DCSA atau Cargo-iQ untuk angkutan barang jalan raya di Indonesia. Yang ada hanya praktik pasar: perangkat GPS di ponsel driver atau di kendaraan, dengan format data yang berbeda-beda tergantung vendor telematika yang dipakai.",
    },
    {
      type: "p",
      text: "Absennya standar ini justru yang membuat trucking jadi moda paling fleksibel sekaligus paling rawan disamaratakan begitu saja dengan moda lain di satu dashboard. Update GPS yang mengalir setiap menit terlihat jauh lebih \"real-time\" dibanding milestone laut atau udara, padahal keduanya menjawab pertanyaan yang berbeda: satu memberi posisi, dua lainnya memberi tahapan proses.",
    },
    {
      type: "h3",
      text: "Gudang: tanpa standar eksternal, tapi kepastian datanya paling tinggi",
    },
    {
      type: "p",
      text: "Gudang tidak punya standar eksternal sama sekali; semuanya ditentukan konfigurasi WMS internal masing-masing perusahaan. Sebuah status hanya berubah kalau ada pemindaian, jadi kepastiannya justru paling tinggi di antara empat moda ini, datanya langsung dari aktivitas fisik, tapi frekuensinya paling tidak menentu karena bergantung kapan proses berikutnya benar-benar terjadi.",
    },
    {
      type: "h2",
      id: "tiga-status-tracking",
      text: "Tiga status yang perlu dibedakan: terkonfirmasi, estimasi, menunggu update",
    },
    {
      type: "p",
      text: "Supaya matriks di atas berguna di lapangan, tiga istilah itu perlu didefinisikan dengan jelas dan dipakai konsisten, bukan cuma jadi kata-kata di kepala tim internal:",
    },
    {
      type: "ul",
      items: [
        "**Terkonfirmasi.** Event sudah benar-benar terjadi dan tercatat langsung dari sumbernya: GPS yang baru saja mengirim ping, barcode yang baru dipindai, milestone carrier yang sudah lewat waktunya.",
        "**Estimasi.** Proyeksi ke depan, dihitung dari jadwal atau histori performa, bukan dari kejadian yang sudah terjadi. ETA kedatangan kapal minggu depan, misalnya, selalu estimasi, sepasti apa pun kelihatannya di layar.",
        "**Menunggu update.** Sumber data belum melapor. Ini bukan berarti tidak ada progres, barang bisa saja sedang bergerak normal, hanya saja informasinya belum sampai ke sistem Anda.",
      ],
    },
    {
      type: "callout",
      tone: "insight",
      title: "Tiga label, satu baris teks",
      body: "\"Dalam perjalanan · terkonfirmasi 4 menit lalu\" berbeda dari \"Estimasi tiba: Kamis–Jumat\", dan keduanya berbeda lagi dari \"Menunggu update dari mitra di tujuan\". Ketiganya bisa ditulis dalam satu baris teks pendek di sebelah status, dan tidak butuh satu integrasi baru pun: datanya sudah ada di sistem Anda sekarang, cuma belum pernah dipilah dan ditampilkan sejelas ini ke pengguna.",
    },
    {
      type: "p",
      text: "Risiko terbesar bukan datang dari moda tertentu, tapi dari kebiasaan menyamakan tampilan ketiganya. Status truk yang terkonfirmasi dua menit lalu dan status kapal yang terkonfirmasi dua hari lalu gampang sekali muncul dengan lencana hijau yang sama persis. Siapa pun yang membacanya akan menyimpulkan keduanya sama segarnya, lalu mengambil keputusan, entah mengabari customer atau menjadwalkan tim bongkar, berdasarkan usia data yang sebenarnya tidak pernah mereka ketahui.",
    },
    {
      type: "h2",
      id: "yang-dibutuhkan-customer",
      text: "Yang customer cari lewat status ini",
    },
    {
      type: "p",
      text: "Saat customer menghubungi menanyakan posisi barangnya, koordinat GPS jarang jadi hal yang benar-benar mereka cari. Yang sedang mereka putuskan biasanya salah satu dari ini: perlukah tim bongkar disiapkan besok pagi, beranikah mereka menjanjikan tanggal kirim ke pelanggan mereka sendiri, atau sudah waktunya mencari jalur lain.",
    },
    {
      type: "p",
      text: "Yang bernilai bagi mereka adalah estimasi waktu tiba lengkap dengan status kepastiannya, jauh lebih dari sekadar titik di peta. Peta memuaskan rasa penasaran sesaat; estimasi yang jujur soal kepastiannya menjawab pertanyaan yang sebenarnya sedang mereka tanyakan.",
    },
    {
      type: "h2",
      id: "milestone-yang-berguna",
      text: "Lima milestone yang sejalan dengan pola DCSA dan Cargo-iQ, disederhanakan",
    },
    {
      type: "p",
      text: "Kalau sumber daya terbatas dan Anda harus memilih hanya beberapa titik pencatatan, lima milestone berikut sudah mendekati pola yang dipakai kerangka acuan industri seperti DCSA di laut dan Cargo-iQ di udara, disederhanakan supaya bisa dijalankan tim operasional yang belum tentu punya integrasi API langsung ke carrier atau maskapai:",
    },
    {
      type: "ol",
      items: [
        "**Barang diterima dari shipper.** Jam ini menandai mulainya tanggung jawab Anda, dan langsung menjawab pertanyaan berulang \"sudah diambil belum?\".",
        "**Berangkat dari titik asal.** Baru dari sini estimasi waktu tiba punya dasar untuk mulai dihitung.",
        "**Tiba di titik transit atau pelabuhan.** Di sinilah keterlambatan paling sering bersembunyi, karena dari luar semuanya masih terlihat baik-baik saja.",
        "**Keluar dari pelabuhan / selesai kepabeanan.** Status yang paling ditunggu sepanjang proses impor.",
        "**Diterima di tujuan, dengan bukti.** Titik ini menutup siklus tracking sekaligus membuka proses penagihan.",
      ],
    },
    {
      type: "p",
      text: "Lima titik itu sudah menjawab mayoritas pertanyaan yang masuk ke tim customer service Anda setiap hari. Menambah titik keenam dan ketujuh biasanya memberi tambahan tipis dibanding memastikan lima titik pertama tercatat disiplin setiap kali, tanpa terlewat.",
    },
    {
      type: "h2",
      id: "praktik-data-yang-tidak-lengkap",
      text: "Praktik di lapangan: data yang bolong bukan pelanggaran standar, tapi kenyataan operasional",
    },
    {
      type: "p",
      text: "Mayoritas shipment gabungan melewati tangan pihak ketiga: pelayaran, agen di kota tujuan, subkontraktor trucking. Masing-masing punya sistem sendiri, kalau punya sistem sama sekali, dan tidak satu pun dari itu melanggar aturan apa pun, karena memang tidak ada aturan yang mewajibkan mereka melapor ke sistem Anda.",
    },
    {
      type: "p",
      text: "Integrasi otomatis dengan pelayaran besar masih realistis dikerjakan meski butuh usaha yang tidak sedikit, karena mereka umumnya sudah punya API atau EDI yang mengikuti kerangka semacam DCSA. Persoalannya beda kalau lawan bicaranya subkontraktor trucking beranggota lima truk yang koordinasinya lewat grup WhatsApp: di sana tidak ada sistem apa pun yang bisa diintegrasikan, jadi soal mudah-sulitnya teknologi jadi tidak relevan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Kejujuran soal cakupan mengalahkan peta yang bolong-bolong",
      body: "Kalau 30% pengiriman Anda ditangani subkontraktor yang tidak pernah melaporkan status, jangan paksakan tracking untuk seluruh shipment sementara sebagian titiknya memang diam tak bergerak. Status yang membeku tiga hari langsung dibaca customer sebagai tanda barangnya bermasalah, dan telepon ke tim Anda pun berdering. Fitur yang tadinya dibuat untuk mengurangi pertanyaan itu malah jadi sumber pertanyaan baru.",
    },
    {
      type: "p",
      text: "Pendekatan yang lebih realistis: beri tanda jelas pada shipment yang datanya bersumber dari laporan manual, dengan status \"menunggu update\" sebagai default sebelum ada laporan masuk, lalu sepakati ritme pelaporan bersama subkontraktor, dua kali sehari lewat pesan singkat yang diteruskan admin ke sistem, misalnya. Data manual dengan ritme yang konsisten jauh lebih berguna daripada data otomatis yang cakupannya bolong di sana-sini.",
    },
    {
      type: "h2",
      id: "menyampaikan-estimasi-dengan-jujur",
      text: "Menyampaikan status estimasi dengan jujur, bukan optimis",
    },
    {
      type: "p",
      text: "Ada godaan untuk memberi estimasi yang enak didengar customer. Godaan itu merugikan dalam jangka menengah: begitu customer dua kali menerima estimasi yang meleset, kepercayaan mereka pada sistem Anda ikut turun, bahkan di saat estimasi berikutnya ternyata tepat.",
    },
    {
      type: "p",
      text: "Sampaikan rentang waktu, bukan satu angka pasti yang gampang meleset. \"Tiba Kamis sampai Jumat\" lebih berguna daripada \"tiba Kamis pukul 14.00\" yang berakhir mundur. Begitu ada perubahan, kabari lebih dulu sebelum customer sempat bertanya sendiri. Estimasi yang direvisi lebih awal jauh lebih gampang diterima daripada estimasi yang dipertahankan sampai jelas-jelas meleset.",
    },
    {
      type: "quote",
      text: "Customer masih bisa memaafkan keterlambatan yang dikabari lebih dulu. Yang sulit dimaafkan adalah keterlambatan yang mereka temukan sendiri, tanpa pernah diberi tahu.",
    },
  ],
  faq: [
    {
      q: "Apakah ada regulasi Indonesia yang mewajibkan GPS di semua truk barang?",
      a: "Tidak ada regulasi yang mewajibkan GPS pada seluruh truk angkutan barang secara umum. Yang biasanya berlaku adalah persyaratan kontraktual dari shipper tertentu, terutama untuk kargo bernilai tinggi atau kategori berbahaya, dan praktik pasar yang berkembang sendiri karena perangkat GPS di ponsel driver sudah cukup murah untuk dipasang tanpa perlu didorong regulasi.",
    },
    {
      q: "Apakah DCSA dan Cargo-iQ wajib diikuti pelayaran dan maskapai yang melayani Indonesia?",
      a: "Tidak. Keduanya standar industri yang diadopsi sukarela oleh operator yang bersangkutan, bukan regulasi pemerintah. Itu sebabnya tingkat kepatuhan dan kecepatan pelaporan tetap berbeda dari satu pelayaran atau maskapai ke pelayaran atau maskapai lain, meski sama-sama mengklaim mengikuti kerangka yang sama.",
    },
    {
      q: "Status yang belum pasti sebaiknya tetap ditampilkan, atau disembunyikan?",
      a: "Tetap tampilkan, dengan label \"menunggu update\" yang jelas. Kolom yang dibiarkan kosong akan diisi sendiri oleh customer dengan dugaan terburuk, dan itu berujung telepon ke meja Anda. Keterangan sesederhana \"menunggu konfirmasi mitra di tujuan\" sudah cukup meredam pertanyaan itu, karena menunjukkan keadaannya diketahui dan sedang ditangani, bukan diabaikan.",
    },
  ],
  cta: {
    title: "Terapkan pelabelan status ini di portal customer Anda",
    body: "Matriks di atas menentukan apa yang jujur untuk dijanjikan; langkah berikutnya adalah menampilkannya dengan benar ke customer. Artikel customer portal logistik CargoGrid membahas elemen apa saja yang perlu ada di layar supaya status terkonfirmasi, estimasi, dan menunggu update ini benar-benar kelihatan bedanya, bukan cuma tercatat rapi di database Anda.",
    linkHref: "/artikel/customer-portal-logistik",
    linkLabel: "Baca panduan customer portal",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Catatan referensi ini menggabungkan kerangka milestone yang sudah jadi standar industri (DCSA Track & Trace untuk laut, Cargo-iQ untuk udara) dengan pengamatan operasional CargoGrid mendampingi forwarder dan trucking company di Indonesia menyatukan data lintas moda; dua sumber itu sengaja dibedakan, bukan dicampur jadi satu suara otoritatif.",
  },
  related: ["customer-portal-logistik", "demurrage-detention-pelabuhan", "adopsi-aplikasi-driver"],
  relatedTools: ["kamus-logistik", "kalkulator-demurrage"],
};
