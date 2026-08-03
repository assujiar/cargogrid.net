import type { Article } from "./types";

export const article: Article = {
  slug: "alur-rfq-freight-forwarding",
  layout: "primer",
  title: "Anatomi RFQ Freight Forwarding: Kenapa Quotation Anda Bisa Kalah Sebelum Harganya Sempat Dibaca",
  metaTitle: "Alur RFQ Freight Forwarding: dari Email Masuk sampai Quotation Terkirim | CargoGrid OS",
  description:
    "Sebagian besar RFQ tidak hilang karena kalah harga, tapi karena kalah cepat dan kalah lengkap. Di sini kita bedah tujuh tahap alur RFQ, dari email masuk sampai quotation terkirim, lalu cari tahu di tahap mana waktu Anda sebenarnya bocor.",
  keywords: [
    "RFQ freight forwarding",
    "quotation logistik",
    "rate management forwarder",
    "sales freight forwarding",
    "manajemen tarif logistik",
  ],
  category: "komersial",
  publishedAt: "2026-05-19",
  summary:
    "Dalam tender freight forwarding, quotation pertama yang datang lengkap sering kali sudah menang sebelum quotation termurah sempat dibaca. Tulisan ini memecah alur RFQ menjadi tujuh tahap, lalu menunjukkan tahap mana yang benar-benar menyita waktu Anda.",
  takeaways: [
    "Waktu respons RFQ nyaris seluruhnya habis di tahap mengumpulkan rate, bukan di tahap menyusun harga.",
    "RFQ yang masuk ke inbox pribadi sales tidak meninggalkan jejak apa pun, sehingga tidak bisa diukur, apalagi diperbaiki.",
    "Rate yang berserakan di banyak file bisa membuat dua sales memberi harga berbeda untuk rute yang sama.",
    "Data menang-kalah jadi tidak berguna kalau alasannya tidak pernah dicatat, dan kolom itu paling sering dibiarkan kosong.",
  ],
  blocks: [
    {
      type: "p",
      text: "Ada asumsi yang jarang diuji di tim komersial forwarding: RFQ dimenangkan oleh harga. Kalau asumsi ini benar, satu-satunya strategi yang masuk akal adalah menekan margin sedalam mungkin, dan pekerjaan sales pun berubah jadi sekadar pekerjaan kalkulator.",
    },
    {
      type: "p",
      text: "Kenyataannya, sebagian besar RFQ sudah diputuskan oleh dua hal sebelum harga sempat dipertimbangkan: apakah quotation Anda datang cukup cepat untuk ikut dibandingkan, dan apakah isinya cukup lengkap untuk bisa dibandingkan. Quotation yang baru masuk di hari ketiga, saat shortlist sudah disusun, bukan kalah karena mahal. Ia bahkan tidak sempat dinilai.",
    },
    {
      type: "h2",
      id: "dasar-waktu-tunggu",
      text: "Dasar masalahnya: waktu respons hampir seluruhnya adalah waktu tunggu",
    },
    {
      type: "p",
      text: "Dalam analisis proses, total waktu penyelesaian sebuah pekerjaan bisa dipecah jadi dua: waktu proses, yaitu saat pekerjaan itu benar-benar dikerjakan, dan waktu tunggu, yaitu saat pekerjaan itu diam menunggu sesuatu. Pada hampir semua proses administratif yang belum pernah diperiksa, waktu tunggu inilah yang mendominasi, dan selisihnya biasanya jauh lebih besar dari dugaan.",
    },
    {
      type: "p",
      text: "Ini penting untuk menentukan perbaikan yang tepat. Menambah orang atau mempercepat penyusunan harga hanya menyentuh waktu proses, yang porsinya kecil. Perbaikan yang benar-benar terasa datang dari memotong waktu tunggu, artinya mengurangi berapa kali sebuah RFQ harus berhenti untuk menunggu jawaban dari pihak lain.",
    },
    {
      type: "h2",
      id: "tujuh-tahap-rfq",
      text: "Tujuh tahap dari email masuk sampai quotation terkirim",
    },
    {
      type: "p",
      text: "Coba perhatikan, berapa banyak dari tujuh tahap ini yang sebenarnya sama sekali tidak butuh keahlian komersial.",
    },
    {
      type: "ol",
      items: [
        "**Penerimaan.** RFQ masuk lewat email, WhatsApp, atau telepon. Kadang langsung ke sales tertentu, kadang ke alamat umum yang siapa saja bisa cek.",
        "**Kualifikasi.** Apakah rutenya kita layani? Apakah customer ini layak dikejar? Apakah volumenya masuk akal untuk diproses?",
        "**Klarifikasi.** Incoterm apa? Berapa berat dan dimensinya? Butuh asuransi? Ada barang berbahaya? Siapa yang mengurus kepabeanan?",
        "**Pengumpulan rate.** Menghubungi pelayaran, trucking, gudang, agen di tujuan. Lalu menunggu balasan.",
        "**Penyusunan harga.** Menambahkan margin, surcharge, biaya dokumen, sambil mengecek kurs terbaru.",
        "**Persetujuan.** Kalau margin di bawah ambang batas atau nilainya besar, perlu tanda tangan atasan dulu.",
        "**Pengiriman & tindak lanjut.** Quotation dikirim, lalu (kalau ingat) ditindaklanjuti.",
      ],
    },
    {
      type: "p",
      text: "Kalau Anda mencatat waktu tiap tahap selama dua minggu saja, hasilnya hampir selalu sama: tahap 4 melahap 60–80% dari total waktu, sementara tahap 5, satu-satunya tahap yang benar-benar butuh penilaian komersial, justru memakan waktu paling sedikit.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Tahap paling lama adalah tahap yang paling tidak bernilai",
      body: "Menunggu balasan rate dari vendor bukan hal yang membedakan Anda dari pesaing, karena semua forwarder menunggu vendor yang sama. Yang membedakan justru berapa banyak pertanyaan yang tidak perlu Anda tanyakan lagi, sebab jawabannya sudah tersimpan dari transaksi terakhir kali.",
    },
    {
      type: "h2",
      id: "masalah-rate-yang-tersebar",
      text: "Masalah rate yang berserakan di mana-mana",
    },
    {
      type: "p",
      text: "Di kebanyakan forwarder ukuran menengah, rate hidup di banyak tempat sekaligus: file Excel di laptop manajer pricing, lampiran PDF yang terkubur di email, screenshot WhatsApp dari sales pelayaran, dan yang paling berisiko, di kepala orang yang sudah lama bekerja di sana.",
    },
    {
      type: "p",
      text: "Konsekuensinya bukan cuma soal rapi atau tidak rapi. Kondisi ini melahirkan tiga masalah nyata:",
    },
    {
      type: "ul",
      items: [
        "**Harga jadi tidak konsisten.** Dua sales bisa mengutip angka berbeda untuk rute yang sama di minggu yang sama. Kalau kebetulan keduanya menawar ke customer yang sama lewat jalur berbeda, kredibilitas Anda runtuh dalam satu percakapan.",
        "**Rate kedaluwarsa terus terpakai.** Rate laut punya masa berlaku pendek dan surcharge berubah tiap periode. Tapi file yang tidak dibubuhi tanggal seolah berlaku selamanya di mata siapa pun yang membukanya.",
        "**Pengetahuan menempel pada orang, bukan pada perusahaan.** Begitu manajer pricing resign, ia membawa serta pemahaman rute yang tidak pernah tertulis di mana pun. Penggantinya butuh berbulan-bulan hanya untuk kembali ke titik yang sama.",
      ],
    },
    {
      type: "h2",
      id: "rfq-yang-tidak-pernah-tercatat",
      text: "RFQ yang bahkan tidak pernah tercatat",
    },
    {
      type: "p",
      text: "Ini bagian yang paling sering luput dari perhatian. Kalau RFQ masuk langsung ke inbox pribadi seorang sales, maka satu-satunya orang yang tahu RFQ itu ada, ya sales tersebut. Begitu ia sibuk, cuti, atau sekadar lupa, RFQ itu seolah tidak pernah terjadi di catatan perusahaan.",
    },
    {
      type: "p",
      text: "Yang membuatnya sulit terdeteksi: tidak ada gejala sama sekali. Tidak ada laporan yang menunjukkan \"RFQ yang tidak dijawab\", karena sistem memang tidak pernah tahu RFQ itu masuk. Perusahaan hanya merasa pipeline-nya agak sepi, tanpa pernah tahu berapa banyak peluang yang sebenarnya sudah menguap.",
    },
    {
      type: "quote",
      text: "Anda tidak mungkin memperbaiki tingkat kemenangan kalau penyebutnya sendiri tidak pernah dihitung.",
    },
    {
      type: "p",
      text: "Perbaikannya tidak harus berupa sistem yang canggih. Langkah pertama cukup dengan menetapkan satu alamat masuk resmi, misalnya rfq@ perusahaan Anda, lalu mewajibkan setiap RFQ yang datang lewat jalur lain diteruskan ke sana sebelum dikerjakan. Sederhana, gratis, dan seketika memberi Anda penyebut yang selama ini tidak ada.",
    },
    {
      type: "h2",
      id: "klarifikasi-yang-terlambat",
      text: "Klarifikasi yang datangnya selalu terlambat",
    },
    {
      type: "p",
      text: "Pola yang sering terjadi begini: sales menerima RFQ, meneruskannya ke pricing, pricing mulai mengumpulkan rate, lalu di tengah jalan baru sadar bahwa incoterm-nya tidak disebutkan. Pertanyaan pun dikirim balik ke customer. Customer menjawab dua hari kemudian. Pengumpulan rate harus dimulai ulang karena asumsinya sudah berubah.",
    },
    {
      type: "p",
      text: "Dua hari itu bukan hilang karena ada yang lambat bekerja. Hilangnya karena pertanyaan itu baru diajukan di tahap 4, padahal seharusnya sudah selesai di tahap 3.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Daftar periksa sebelum menyentuh rate",
      body: "Incoterm · Pelabuhan/kota asal dan tujuan · Jenis komoditas dan kode HS bila ada · Berat kotor dan dimensi · Jenis dan jumlah kontainer, atau volume LCL · Perlu asuransi? · Termasuk kepabeanan? · Ada persyaratan khusus (reefer, DG, oversize)? · Perkiraan tanggal siap muat · Frekuensi kalau ini kontrak. Sepuluh pertanyaan ini, kalau ditanyakan sekaligus di jam pertama, menghemat waktu jauh lebih banyak daripada perbaikan proses lain mana pun di daftar ini.",
    },
    {
      type: "h2",
      id: "kenapa-menang-kalah-jarang-dicatat",
      text: "Kenapa kolom alasan menang-kalah nyaris selalu kosong",
    },
    {
      type: "p",
      text: "Hampir semua CRM punya kolom ini. Hampir tidak ada yang mengisinya, dan alasannya sebenarnya masuk akal: mengisi kolom itu tidak memberi manfaat apa pun bagi orang yang mengisi. Sales yang baru kalah tender sedang tidak ingin menuliskan kenapa ia kalah.",
    },
    {
      type: "p",
      text: "Padahal ini satu-satunya data yang bisa memberi tahu apakah Anda perlu menurunkan harga atau justru mempercepat respons. Tanpa data ini, setiap kekalahan otomatis dijelaskan sebagai \"harga pesaing lebih murah\", alasan yang selalu tersedia, tidak pernah bisa dibantah, dan diam-diam mendorong Anda menekan margin yang sebenarnya mungkin tidak bermasalah.",
    },
    {
      type: "p",
      text: "Cara yang lebih realistis: jangan minta esai. Sediakan lima pilihan tetap, harga, waktu respons, kapasitas/jadwal, syarat pembayaran, hubungan lama dengan pesaing, lalu wajibkan satu klik saja. Data kasar yang benar-benar terkumpul jauh lebih berguna daripada data rinci yang tidak pernah ada.",
    },
    {
      type: "h2",
      id: "apa-yang-realistis-berubah",
      text: "Apa yang realistis berubah kalau alur ini dirapikan",
    },
    {
      type: "table",
      caption: "Perubahan yang wajar diharapkan, dan yang tidak",
      head: ["Aspek", "Realistis", "Tidak realistis"],
      rows: [
        ["Waktu respons RFQ", "Turun signifikan untuk rute yang rate-nya sudah tersimpan", "Semua RFQ terjawab dalam 1 jam, termasuk rute baru"],
        ["Konsistensi harga", "Hilang sepenuhnya sebagai kelas masalah", "Harga jadi otomatis optimal"],
        ["Tingkat kemenangan", "Naik di segmen yang sensitif terhadap kecepatan", "Naik di semua segmen"],
        ["Beban kerja pricing", "Bergeser dari mengumpulkan ke menganalisis", "Turun jadi nol"],
        ["Visibilitas pipeline", "Muncul untuk pertama kalinya", "Prediksi penjualan yang akurat"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan kolom paling kanan. Semua yang tertulis di sana adalah janji yang sering muncul di presentasi vendor software, dan tidak satu pun benar-benar bisa ditepati. Sistem tidak tahu berapa harga yang seharusnya Anda pasang; ia hanya membuat harga yang sudah Anda tentukan sendiri jadi konsisten dan cepat diakses.",
    },
    {
      type: "h2",
      id: "langkah-pertama-tanpa-anggaran",
      text: "Tiga langkah pertama yang tidak butuh anggaran sepeser pun",
    },
    {
      type: "ol",
      items: [
        "Tetapkan satu alamat masuk resmi untuk RFQ, dan wajibkan semua jalur lain diteruskan ke sana. Langkah ini memberi Anda penyebut yang selama ini hilang.",
        "Susun daftar periksa klarifikasi sepuluh poin, lalu pakai di jam pertama setiap RFQ masuk. Langkah ini memotong tahap yang paling boros waktu.",
        "Catat tanggal dan jam RFQ masuk serta quotation terkirim, walau hanya di satu spreadsheet bersama. Setelah dua minggu, Anda akan tahu waktu respons Anda yang sebenarnya, dan angka itu biasanya jauh berbeda dari yang selama ini diperkirakan tim.",
      ],
    },
    {
      type: "p",
      text: "Ketiganya bisa langsung dijalankan Senin depan. Kalau sebulan kemudian angkanya menunjukkan waktu respons Anda memang sudah kompetitif, berarti Anda baru saja menghemat anggaran sistem yang sebenarnya tidak Anda butuhkan. Kalau ternyata belum, Anda sudah punya angka untuk membenarkan pengeluarannya, sekaligus garis dasar untuk membuktikan hasilnya nanti.",
    },
  ],
  faq: [
    {
      q: "Berapa waktu respons RFQ yang dianggap kompetitif di freight forwarding?",
      a: "Tidak ada angka baku yang berlaku untuk semua orang, karena ekspektasi spot dan tender kontrak jelas berbeda. Cara yang lebih berguna: tanyakan langsung ke tiga customer terbesar Anda, berapa lama biasanya mereka menunggu sebelum menyusun shortlist. Jawaban mereka jauh lebih relevan untuk bisnis Anda dibanding angka rata-rata industri yang digeneralisasi.",
    },
    {
      q: "Apakah rate management harus berupa sistem, atau cukup spreadsheet yang rapi?",
      a: "Spreadsheet terpusat dengan kolom masa berlaku dan riwayat perubahan sebenarnya sudah menyelesaikan sebagian besar masalah konsistensi, dan untuk tim di bawah lima orang itu biasanya sudah cukup. Batasnya baru terasa ketika beberapa orang perlu mengedit bersamaan, ketika Anda butuh jejak siapa mengubah apa, atau ketika rate harus otomatis terpakai saat quotation dibuat.",
    },
    {
      q: "Bagaimana menangani RFQ untuk rute yang belum pernah kami layani?",
      a: "Pisahkan alurnya sejak awal, dan sampaikan ke customer bahwa Anda sedang mencari rate baru, lengkap dengan tenggat yang jelas. Yang merusak hubungan bukan jawaban yang lambat, melainkan yang diam saja. Sebutkan kapan Anda akan kembali memberi kabar, lalu tepati, itu jauh lebih berharga daripada angka yang cepat tapi asal-asalan.",
    },
    {
      q: "Apakah menaruh semua rate di satu sistem berisiko kalau ada karyawan keluar?",
      a: "Justru sebaliknya. Ketika rate hanya ada di kepala dan file pribadi seseorang, kepergian orang itu benar-benar menghilangkan aset perusahaan. Sistem terpusat dengan hak akses berjenjang membuat pengetahuannya tetap tinggal, sementara aksesnya sendiri bisa dicabut dalam hitungan detik.",
    },
  ],
  related: ["margin-per-job-forwarder", "manajemen-vendor-subkontraktor", "memilih-software-logistik-pilot-30-hari"],
};
