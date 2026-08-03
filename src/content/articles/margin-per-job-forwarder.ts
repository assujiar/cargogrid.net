import type { Article } from "./types";

export const article: Article = {
  slug: "margin-per-job-forwarder",
  layout: "brief",
  title: "Margin Per Job: Kenapa Baru Ketahuan di Akhir Bulan, dan Apa Akibatnya",
  metaTitle: "Cara Menghitung Margin Per Job di Perusahaan Logistik | CargoGrid OS",
  description:
    "Perusahaan logistik biasanya tahu berapa margin bulan ini, tapi jarang tahu job mana yang sebenarnya merugi. Akibatnya, customer yang menggerus margin terus dilayani, dan sales dinilai dari omzet yang sebenarnya menyesatkan.",
  keywords: [
    "margin per job logistik",
    "profitabilitas customer logistik",
    "cost control freight forwarding",
    "analisa untung rugi shipment",
    "harga pokok jasa logistik",
  ],
  category: "keuangan",
  publishedAt: "2026-05-08",
  summary:
    "Margin bulanan yang terlihat sehat bisa menyembunyikan kenyataan pahit: sepertiga job Anda merugi, dan kerugiannya ditutupi sepertiga job lain yang untung besar. Selama margin hanya muncul di level bulanan, tidak ada yang bisa mengambil keputusan untuk mengubahnya.",
  takeaways: [
    "Margin gabungan menyembunyikan sebarannya, padahal yang menentukan keputusan justru margin per job.",
    "Biaya yang datang belakangan adalah alasan utama kenapa margin sulit dihitung selagi job masih berjalan.",
    "Estimasi biaya di awal job jauh lebih berguna daripada angka akurat yang baru muncul 40 hari kemudian.",
    "Sales yang dinilai dari omzet pasti akan mengejar job bervolume besar bermargin tipis, itu bukan kesalahan, itu respons rasional terhadap ukuran yang keliru.",
  ],
  blocks: [
    {
      type: "p",
      text: "Hampir semua perusahaan logistik bisa menjawab berapa margin bulan lalu. Jauh lebih sedikit yang bisa menjawab job mana yang justru merugi bulan lalu. Selisih antara dua kemampuan ini yang menentukan apakah Anda benar-benar mengelola profitabilitas, atau cuma mengamatinya dari jauh.",
    },
    {
      type: "p",
      text: "Angka margin gabungan punya sifat menenangkan yang justru berbahaya. Lihat margin 14%, rasanya sehat-sehat saja. Padahal 14% itu bisa berarti semua job sama-sama menghasilkan 14%, bisa juga berarti separuh job menghasilkan 25% sementara separuh lainnya cuma 3%. Dua situasi yang jauh berbeda ini, di laporan, terlihat identik, dan menuntut tindakan yang sama sekali berbeda.",
    },
    {
      type: "h2",
      id: "dasar-agregasi",
      text: "Dasar masalahnya: kenapa angka gabungan bisa menyesatkan arah keputusan",
    },
    {
      type: "p",
      text: "Dalam statistik ada yang namanya paradoks Simpson: sebuah pola yang tampak jelas di data gabungan, begitu dipecah per kelompok, ternyata berbalik arah sama sekali. Gejala yang lebih ringan dari hal yang sama sebenarnya terjadi setiap kali sebaran data diringkas jadi satu angka rata-rata.",
    },
    {
      type: "p",
      text: "Margin agregat adalah ringkasan semacam itu. Ia menjawab pertanyaan \"berapa\", tapi tidak pernah menjawab \"di mana\". Padahal keputusan yang perlu Anda ambil selalu berbentuk \"di mana\", customer mana, rute mana, sales mana. Karena itu, betapapun akurat perhitungannya, angka gabungan memang tidak dirancang untuk memandu keputusan semacam itu.",
    },
    {
      type: "h2",
      id: "kenapa-margin-per-job-sulit",
      text: "Kenapa margin per job susah dihitung selagi job masih berjalan",
    },
    {
      type: "p",
      text: "Bukan karena rumusnya rumit, pendapatan dikurangi biaya, selesai. Yang bikin susah adalah waktu: pendapatan sudah diketahui sejak awal, sementara biaya baru diketahui belakangan.",
    },
    {
      type: "p",
      text: "Begitu quotation disetujui, Anda langsung tahu persis berapa yang akan ditagihkan ke customer. Tapi biaya sebenarnya baru lengkap setelah semua vendor mengirim tagihan masing-masing: trucking beberapa hari kemudian, biaya pelabuhan seminggu setelahnya, agen di tujuan entah kapan. Sampai tagihan terakhir masuk, margin job itu masih sekadar dugaan.",
    },
    {
      type: "p",
      text: "Akibatnya, keputusan yang paling penting, terima atau tidak job ini, dengan harga segini, untuk customer ini, selalu diambil tanpa data lengkap. Sementara data lengkapnya baru tersedia setelah keputusan itu tidak bisa diubah lagi.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Estimasi hari ini mengalahkan kepastian bulan depan",
      body: "Catat dulu biaya perkiraan saat job dibuat, berdasarkan rate vendor yang berlaku. Job pun berjalan dengan margin estimasi. Begitu tagihan asli masuk, angkanya dikoreksi. Justru selisih antara estimasi dan aktual ini yang jadi informasi berharga tersendiri: kalau satu rute selalu meleset ke arah yang sama, itu tandanya rate acuan Anda untuk rute itu sudah kedaluwarsa.",
    },
    {
      type: "h2",
      id: "biaya-yang-selalu-terlupa",
      text: "Biaya yang nyaris selalu terlupa dimasukkan",
    },
    {
      type: "p",
      text: "Bahkan perusahaan yang sudah menghitung margin per job pun biasanya menghitungnya terlalu optimis, karena beberapa komponen biaya ini nyaris tidak pernah dibebankan ke job yang bersangkutan:",
    },
    {
      type: "ul",
      items: [
        "**Waktu tunggu truk.** Truk yang antre lima jam di gudang customer itu kapasitas yang hilang percuma, tapi jarang masuk hitungan biaya job.",
        "**Pengiriman ulang.** Kalau bongkar gagal dan harus diulang besok, biayanya sering nyasar ke biaya operasional umum, bukan ke job yang sebenarnya menyebabkannya.",
        "**Demurrage dan detention.** Sering dicatat di akun terpisah, jadi job penyebabnya tetap terlihat sehat-sehat saja di atas kertas.",
        "**Waktu administrasi yang tidak wajar.** Customer yang minta format laporan khusus dan tiga kali revisi invoice sebenarnya memakan biaya nyata, cuma biaya itu tidak pernah tercatat di mana pun.",
        "**Biaya modal.** Job dengan termin pembayaran 90 hari sebenarnya lebih mahal bagi Anda dibanding job dengan termin 14 hari, meski margin nominalnya sama persis.",
      ],
    },
    {
      type: "p",
      text: "Tiga poin terakhir ini yang menjelaskan fenomena yang sering bikin bingung: ada customer besar dengan volume mengesankan, yang di atas kertas terlihat menguntungkan, tapi setiap kali volumenya naik, kas perusahaan malah makin sesak.",
    },
    {
      type: "h2",
      id: "melihat-sebaran-bukan-rata-rata",
      text: "Melihat sebarannya, bukan rata-ratanya",
    },
    {
      type: "p",
      text: "Begitu Anda punya margin per job, jangan buru-buru menghitung rata-ratanya. Rata-rata cuma akan membawa Anda kembali ke masalah semula.",
    },
    {
      type: "p",
      text: "Yang lebih berguna adalah mengurutkan seluruh job bulan lalu dari margin terendah ke tertinggi, lalu perhatikan sepuluh yang paling bawah. Hampir selalu ada pola yang muncul: satu customer tertentu, satu rute tertentu, satu jenis komoditas, atau satu sales tertentu.",
    },
    {
      type: "table",
      caption: "Contoh ilustratif: dua bulan dengan margin agregat yang sama persis",
      head: ["", "Bulan A", "Bulan B"],
      rows: [
        ["Margin agregat", "14%", "14%"],
        ["Job margin di atas 20%", "12 job", "31 job"],
        ["Job margin 5–20%", "48 job", "14 job"],
        ["Job margin di bawah 5%", "6 job", "21 job"],
        ["Yang perlu dilakukan", "Jaga stabilitas, cari peluang naik", "Segera periksa 21 job bermargin tipis"],
      ],
    },
    {
      type: "p",
      text: "Di laporan bulanan, dua bulan ini terlihat kembar identik. Padahal bulan B adalah bisnis yang sedang terbelah dua: sepertiga volumenya nyaris tidak menghasilkan apa-apa, kondisi yang bisa berubah jadi kerugian nyata hanya gara-gara satu kenaikan tarif vendor.",
    },
    {
      type: "h2",
      id: "insentif-yang-salah-arah",
      text: "Ukuran yang keliru menghasilkan perilaku yang keliru juga",
    },
    {
      type: "p",
      text: "Kalau sales dinilai dan dikomisi berdasarkan omzet, ya wajar kalau mereka mengejar job bervolume besar bermargin tipis. Itu bukan kelalaian, itu respons yang benar-benar rasional terhadap ukuran yang Anda pilih sendiri.",
    },
    {
      type: "p",
      text: "Masalahnya, mengubah dasar komisi dari omzet ke margin baru mungkin dilakukan kalau margin per job memang sudah diketahui saat penjualan terjadi, bukan 40 hari kemudian. Inilah alasan paling praktis untuk memperbaiki cara mengukur margin: bukan supaya laporannya lebih cantik, tapi supaya insentifnya bisa diperbaiki sama sekali.",
    },
    {
      type: "quote",
      text: "Anda tidak bisa memberi komisi atas margin yang belum diketahui saat komisinya dihitung.",
    },
    {
      type: "h2",
      id: "customer-yang-merugikan",
      text: "Lalu, apa yang harus dilakukan pada customer yang merugikan",
    },
    {
      type: "p",
      text: "Menemukan bahwa satu customer konsisten merugikan bukan berarti hubungan itu harus langsung diputus. Ada beberapa kemungkinan penyebab, dan masing-masing menuntut tindakan yang berbeda:",
    },
    {
      type: "ol",
      items: [
        "**Harganya memang terlalu rendah sejak awal**, mungkin diberikan demi merebut akun tersebut. Ini bisa dinegosiasikan ulang, apalagi kalau ada data yang menunjukkan komponen biaya mana yang sudah naik.",
        "**Ada biaya tersembunyi yang spesifik pada customer itu**, waktu tunggu yang panjang, persyaratan dokumen yang tidak biasa, tingkat pengiriman ulang yang tinggi. Ini bisa diperbaiki secara operasional, atau dibebankan sebagai biaya terpisah.",
        "**Bauran jobnya timpang.** Customer mengambil rute-rute yang menguntungkan untuk pesaing, dan menyisakan rute-rute sulit untuk Anda. Ini butuh pembicaraan soal porsi, bukan soal harga.",
        "**Memang ini strategi yang disengaja.** Kadang melayani akun bermargin tipis masuk akal karena volumenya, karena jadi referensi, atau karena kepadatan rutenya. Ini sah-sah saja, asal memang keputusan sadar, bukan sesuatu yang baru ketahuan setahun kemudian.",
      ],
    },
    {
      type: "p",
      text: "Yang membedakan perusahaan yang mengelola margin dari yang cuma mengamatinya adalah kemampuan membedakan keempat kondisi di atas. Tanpa data per job, keempatnya terlihat sama saja: satu customer besar yang entah kenapa tidak menghasilkan sebagaimana mestinya.",
    },
    {
      type: "h2",
      id: "mulai-dari-mana",
      text: "Kalau datanya belum ada, mulai dari mana",
    },
    {
      type: "p",
      text: "Tidak perlu menunggu sistem lengkap dulu. Ambil 30 job terbesar bulan lalu, bukan semua job, cukup yang terbesar, karena di situlah uangnya berputar. Untuk masing-masing job, kumpulkan pendapatan dan seluruh biayanya, termasuk biaya-biaya yang biasanya nyasar ke akun umum.",
    },
    {
      type: "p",
      text: "Kerjanya memang melelahkan dan mungkin makan waktu dua hari kerja penuh. Tapi hasilnya hampir selalu mengubah setidaknya satu keyakinan yang selama ini dipegang manajemen soal customer atau rute mana yang paling berharga. Kalaupun ternyata tidak ada yang berubah, setidaknya Anda baru saja memastikan bahwa intuisi tim Anda memang tajam, dan itu pun informasi yang layak dibayar dengan dua hari kerja.",
    },
  ],
  faq: [
    {
      q: "Apakah biaya overhead perlu dialokasikan ke tiap job?",
      a: "Untuk keputusan sehari-hari, margin kontribusi (pendapatan dikurangi biaya langsung) biasanya lebih berguna dan jauh lebih cepat dihitung. Alokasi overhead penuh baru berguna untuk penetapan harga tahunan dan evaluasi lini bisnis, tapi metodenya selalu bisa diperdebatkan, dan perdebatan itu sering menunda keputusan yang sebenarnya sederhana.",
    },
    {
      q: "Bagaimana menghitung margin kalau tagihan vendor baru masuk sebulan kemudian?",
      a: "Pakai biaya estimasi dari rate yang berlaku saat job dibuat, lalu koreksi begitu tagihan aslinya datang. Pantau selisih antara estimasi dan aktual sebagai indikator tersendiri: kalau selisihnya konsisten di satu rute, artinya rate acuan Anda sudah usang dan perlu diperbarui.",
    },
    {
      q: "Apakah margin per job relevan untuk perusahaan trucking?",
      a: "Sangat relevan, meski unit ukurannya beda. Untuk trucking, yang lebih bermakna biasanya margin per rit atau per kendaraan per hari, karena aset utamanya memang kapasitas armada. Prinsipnya tetap sama: angka agregat menyembunyikan rute-rute yang konsisten tidak menutup biayanya sendiri.",
    },
    {
      q: "Seberapa sering margin per job perlu ditinjau?",
      a: "Sebarannya sebaiknya ditinjau tiap bulan, dan sepuluh job bermargin terendah ditinjau tiap minggu kalau volumenya besar. Yang lebih penting daripada frekuensi sebenarnya konsistensi: tinjauan bulanan yang benar-benar rutin jauh lebih berguna daripada analisis mendalam yang cuma dilakukan sekali waktu ada masalah.",
    },
  ],
  related: ["rekonsiliasi-invoice-forwarder-terlambat", "alur-rfq-freight-forwarding", "kpi-operasional-logistik"],
};
