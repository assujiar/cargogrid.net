import type { Article } from "./types";

export const article: Article = {
  slug: "margin-per-job-forwarder",
  title: "Margin Per Job: Kenapa Baru Ketahuan Akhir Bulan, dan Apa Akibatnya",
  metaTitle: "Menghitung Margin Per Job di Perusahaan Logistik | CargoGrid OS",
  description:
    "Perusahaan logistik sering tahu margin bulanan tapi tidak margin per job. Akibatnya customer yang merugikan terus dilayani, dan sales dinilai dari omzet yang menyesatkan.",
  keywords: [
    "margin per job logistik",
    "profitabilitas customer logistik",
    "cost control freight forwarding",
    "analisa untung rugi shipment",
    "harga pokok jasa logistik",
  ],
  category: "keuangan",
  publishedAt: "2026-08-03",
  summary:
    "Margin bulanan yang sehat bisa menyembunyikan bahwa sepertiga job Anda merugi dan ditutupi sepertiga lainnya. Selama angkanya hanya muncul di tingkat bulanan, tidak seorang pun bisa mengambil keputusan yang mengubahnya.",
  takeaways: [
    "Margin agregat menyembunyikan sebaran; yang menentukan keputusan adalah margin per job.",
    "Biaya yang datang belakangan adalah penyebab utama margin tidak bisa dihitung saat job berjalan.",
    "Estimasi biaya di awal job lebih berguna daripada angka akurat yang datang 40 hari kemudian.",
    "Sales yang dinilai dari omzet akan membawa job bervolume besar bermargin tipis, itu respons rasional terhadap ukuran yang salah.",
  ],
  blocks: [
    {
      type: "p",
      text: "Sebagian besar perusahaan logistik bisa menjawab berapa margin bulan lalu. Jauh lebih sedikit yang bisa menjawab job mana yang merugi bulan lalu. Selisih antara dua kemampuan itu menentukan apakah Anda mengelola profitabilitas atau sekadar mengamatinya.",
    },
    {
      type: "p",
      text: "Margin agregat punya sifat menenangkan yang berbahaya. Angka 14% terasa sehat. Tetapi 14% bisa berarti semua job menghasilkan 14%, atau berarti setengah job menghasilkan 25% dan setengah lagi menghasilkan 3%. Keduanya menghasilkan laporan yang identik, dan menuntut tindakan yang sepenuhnya berbeda.",
    },
    {
      type: "h2",
      id: "kenapa-margin-per-job-sulit",
      text: "Kenapa margin per job sulit dihitung saat job masih berjalan",
    },
    {
      type: "p",
      text: "Bukan karena rumusnya rumit. Pendapatan dikurangi biaya, selesai. Kesulitannya ada pada waktu: pendapatan diketahui di awal, biaya diketahui di akhir.",
    },
    {
      type: "p",
      text: "Ketika quotation disetujui, Anda tahu persis berapa yang akan ditagihkan. Tetapi biaya sebenarnya baru lengkap setelah semua vendor menagih, trucking beberapa hari kemudian, biaya pelabuhan seminggu kemudian, agen di tujuan entah kapan. Sampai tagihan terakhir masuk, margin job itu adalah dugaan.",
    },
    {
      type: "p",
      text: "Akibatnya keputusan yang paling penting (apakah menerima job ini, dengan harga ini, untuk customer ini) selalu diambil tanpa data, sementara data lengkapnya baru tersedia ketika keputusan itu sudah tidak bisa diubah.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Estimasi hari ini mengalahkan kepastian bulan depan",
      body: "Catat biaya perkiraan saat job dibuat, dari rate vendor yang berlaku. Job berjalan dengan margin estimasi. Ketika tagihan asli masuk, angkanya dikoreksi. Selisih antara estimasi dan aktual justru menjadi informasi tersendiri yang berharga: kalau satu rute selalu meleset ke arah yang sama, berarti rate acuan Anda untuk rute itu sudah kedaluwarsa.",
    },
    {
      type: "h2",
      id: "biaya-yang-selalu-terlupa",
      text: "Biaya yang hampir selalu terlupa dimasukkan",
    },
    {
      type: "p",
      text: "Bahkan perusahaan yang menghitung margin per job biasanya menghitungnya terlalu optimis, karena beberapa komponen tidak pernah dibebankan ke job:",
    },
    {
      type: "ul",
      items: [
        "**Waktu tunggu truk.** Truk yang antre lima jam di gudang customer adalah kapasitas yang hilang, tapi jarang ada di perhitungan job.",
        "**Pengiriman ulang.** Ketika bongkar gagal dan harus diulang besok, biayanya sering masuk ke biaya operasional umum, bukan ke job yang menyebabkannya.",
        "**Demurrage dan detention.** Sering dicatat di akun terpisah, sehingga job yang menyebabkannya tetap terlihat sehat.",
        "**Waktu administrasi yang tidak wajar.** Customer yang menuntut format laporan khusus dan tiga kali revisi invoice memakan biaya nyata yang tidak pernah tercatat di mana pun.",
        "**Biaya modal.** Job dengan termin 90 hari lebih mahal bagi Anda daripada job dengan termin 14 hari pada margin nominal yang sama.",
      ],
    },
    {
      type: "p",
      text: "Tiga yang terakhir menjelaskan fenomena yang sering membingungkan: customer besar dengan volume mengesankan yang secara akuntansi menguntungkan, tetapi setiap kali volumenya naik, kas perusahaan justru makin sesak.",
    },
    {
      type: "h2",
      id: "melihat-sebaran-bukan-rata-rata",
      text: "Melihat sebaran, bukan rata-rata",
    },
    {
      type: "p",
      text: "Begitu Anda punya margin per job, langkah pertama bukan menghitung rata-ratanya. Rata-rata membawa Anda kembali ke masalah semula.",
    },
    {
      type: "p",
      text: "Yang berguna adalah mengurutkan seluruh job bulan lalu dari margin terendah ke tertinggi, lalu melihat sepuluh terbawah. Hampir selalu ada pola: satu customer tertentu, satu rute tertentu, satu jenis komoditas, atau satu sales tertentu.",
    },
    {
      type: "table",
      caption: "Contoh ilustratif: dua bulan dengan margin agregat identik",
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
      text: "Laporan bulanan menampilkan dua bulan ini sebagai kembar identik. Padahal bulan B adalah bisnis yang sedang terbelah, dengan sepertiga volumenya nyaris tidak menghasilkan apa-apa, kondisi yang bisa berubah jadi kerugian hanya karena satu kenaikan tarif vendor.",
    },
    {
      type: "h2",
      id: "insentif-yang-salah-arah",
      text: "Ukuran yang salah menghasilkan perilaku yang salah",
    },
    {
      type: "p",
      text: "Kalau sales dinilai dan diberi komisi berdasarkan omzet, mereka akan membawa job bervolume besar dengan margin tipis. Itu bukan kelalaian; itu respons yang benar-benar rasional terhadap ukuran yang Anda pilih.",
    },
    {
      type: "p",
      text: "Masalahnya, mengubah dasar komisi dari omzet ke margin hanya mungkin kalau margin per job memang diketahui pada saat penjualan terjadi, bukan 40 hari kemudian. Inilah alasan paling praktis untuk memperbaiki pengukuran margin: bukan demi laporan yang lebih cantik, melainkan agar insentif bisa diperbaiki sama sekali.",
    },
    {
      type: "quote",
      text: "Anda tidak bisa memberi komisi atas margin yang belum diketahui saat komisinya dihitung.",
    },
    {
      type: "h2",
      id: "customer-yang-merugikan",
      text: "Apa yang dilakukan pada customer yang merugikan",
    },
    {
      type: "p",
      text: "Menemukan bahwa satu customer secara konsisten merugikan bukan berarti hubungan itu harus diakhiri. Ada beberapa kemungkinan penjelasan, dan masing-masing menuntut tindakan berbeda:",
    },
    {
      type: "ol",
      items: [
        "**Harga memang terlalu rendah sejak awal**, mungkin diberikan saat merebut akun. Ini bisa dinegosiasikan ulang, terutama kalau ada data yang menunjukkan komponen biaya mana yang naik.",
        "**Biaya tersembunyi yang spesifik pada customer itu**, waktu tunggu panjang, persyaratan dokumen tidak biasa, tingkat pengiriman ulang tinggi. Ini bisa diperbaiki secara operasional atau dibebankan sebagai biaya terpisah.",
        "**Bauran job yang timpang.** Customer mengambil rute yang menguntungkan dari pesaing dan menyisakan rute sulit untuk Anda. Ini memerlukan pembicaraan tentang porsi, bukan tentang harga.",
        "**Memang strategi.** Kadang melayani akun bermargin tipis dibenarkan karena volume, referensi, atau kepadatan rute. Ini sah, asal merupakan keputusan sadar, bukan sesuatu yang baru diketahui setahun kemudian.",
      ],
    },
    {
      type: "p",
      text: "Yang membedakan perusahaan yang mengelola margin dari yang mengamatinya adalah kemampuan membedakan keempat kondisi ini. Tanpa data per job, semuanya terlihat sama: sebuah customer besar yang entah kenapa tidak menghasilkan seperti yang diharapkan.",
    },
    {
      type: "h2",
      id: "mulai-dari-mana",
      text: "Mulai dari mana kalau datanya belum ada",
    },
    {
      type: "p",
      text: "Tidak perlu menunggu sistem. Ambil 30 job terbesar bulan lalu, bukan semuanya, cukup yang terbesar karena di situlah uangnya. Untuk masing-masing, kumpulkan pendapatan dan seluruh biaya yang bisa Anda telusuri, termasuk yang biasanya masuk ke akun umum.",
    },
    {
      type: "p",
      text: "Kerjanya melelahkan dan mungkin memakan dua hari kerja. Hasilnya hampir selalu mengubah setidaknya satu keyakinan yang selama ini dipegang manajemen tentang customer atau rute mana yang paling berharga. Kalau ternyata tidak mengubah apa pun, Anda baru saja memastikan bahwa intuisi tim Anda memang tajam, dan itu pun informasi yang layak dibayar dengan dua hari kerja.",
    },
  ],
  faq: [
    {
      q: "Apakah biaya overhead perlu dialokasikan ke tiap job?",
      a: "Untuk keputusan sehari-hari, margin kontribusi (pendapatan dikurangi biaya langsung) biasanya lebih berguna dan jauh lebih cepat dihitung. Alokasi overhead penuh berguna untuk penetapan harga tahunan dan evaluasi lini bisnis, tapi metodenya selalu bisa diperdebatkan, dan perdebatan itu sering menunda keputusan yang seharusnya sederhana.",
    },
    {
      q: "Bagaimana menghitung margin kalau tagihan vendor baru masuk sebulan kemudian?",
      a: "Pakai biaya estimasi dari rate yang berlaku saat job dibuat, lalu koreksi saat tagihan asli datang. Pantau selisih estimasi versus aktual sebagai indikator tersendiri: selisih yang konsisten pada satu rute berarti rate acuan Anda sudah usang dan perlu diperbarui.",
    },
    {
      q: "Apakah margin per job relevan untuk perusahaan trucking?",
      a: "Sangat relevan, meski unit ukurannya berbeda. Untuk trucking, yang lebih berarti biasanya margin per rit atau per kendaraan per hari, karena aset utamanya adalah kapasitas armada. Prinsipnya sama: angka agregat menyembunyikan rute-rute yang secara konsisten tidak menutup biayanya.",
    },
    {
      q: "Seberapa sering margin per job perlu ditinjau?",
      a: "Sebaran per job sebaiknya ditinjau bulanan, dan sepuluh job bermargin terendah ditinjau setiap minggu kalau volumenya besar. Yang lebih penting daripada frekuensi adalah konsistensinya, tinjauan bulanan yang benar-benar rutin jauh lebih berguna daripada analisis mendalam yang dilakukan sekali saat ada masalah.",
    },
  ],
  related: ["rekonsiliasi-invoice-forwarder-terlambat", "alur-rfq-freight-forwarding", "kpi-operasional-logistik"],
};
