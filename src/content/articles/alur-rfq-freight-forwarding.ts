import type { Article } from "./types";

export const article: Article = {
  slug: "alur-rfq-freight-forwarding",
  title: "Anatomi RFQ Freight Forwarding: Kenapa Quotation Anda Kalah Sebelum Harganya Dibaca",
  metaTitle: "Alur RFQ Freight Forwarding: Dari Email Masuk sampai Quotation | CargoGrid OS",
  description:
    "Sebagian besar RFQ hilang bukan karena harga, tapi karena kecepatan dan kelengkapan. Kami bedah tujuh tahap dari email masuk sampai quotation, dan di mana biasanya bocor.",
  keywords: [
    "RFQ freight forwarding",
    "quotation logistik",
    "rate management forwarder",
    "sales freight forwarding",
    "manajemen tarif logistik",
  ],
  category: "komersial",
  publishedAt: "2026-08-03",
  summary:
    "Di tender freight forwarding, quotation pertama yang lengkap sering menang sebelum quotation termurah sempat dibaca. Tulisan ini memecah alur RFQ jadi tujuh tahap, dan menunjukkan tahap mana yang sebenarnya memakan waktu Anda.",
  takeaways: [
    "Waktu respons RFQ hampir seluruhnya habis di pengumpulan rate, bukan di penyusunan harga.",
    "RFQ yang masuk ke inbox pribadi sales tidak punya jejak, sehingga tidak bisa diukur atau diperbaiki.",
    "Rate yang tersebar di banyak file membuat dua orang bisa memberi harga berbeda untuk rute yang sama.",
    "Menang-kalah tidak berguna kalau alasannya tidak pernah dicatat, dan kolom itu paling sering kosong.",
  ],
  blocks: [
    {
      type: "p",
      text: "Ada asumsi yang jarang diperiksa di tim komersial forwarding: bahwa RFQ dimenangkan oleh harga. Kalau itu benar, satu-satunya strategi yang masuk akal adalah menekan margin, dan pekerjaan sales berubah jadi pekerjaan kalkulator.",
    },
    {
      type: "p",
      text: "Dalam praktiknya, sebagian besar RFQ diputuskan oleh dua hal sebelum harga jadi pertimbangan: apakah quotation Anda datang cukup cepat untuk ikut dibandingkan, dan apakah isinya cukup lengkap untuk bisa dibandingkan. Yang datang di hari ketiga saat shortlist sudah disusun tidak kalah karena mahal. Ia tidak ikut dinilai.",
    },
    {
      type: "h2",
      id: "tujuh-tahap-rfq",
      text: "Tujuh tahap dari email masuk sampai quotation terkirim",
    },
    {
      type: "p",
      text: "Perhatikan berapa banyak dari tahap ini yang sebenarnya tidak membutuhkan keahlian komersial sama sekali.",
    },
    {
      type: "ol",
      items: [
        "**Penerimaan.** RFQ masuk lewat email, WhatsApp, atau telepon. Kadang ke sales tertentu, kadang ke alamat umum.",
        "**Kualifikasi.** Apakah rutenya kita layani? Apakah customer ini layak? Apakah volumenya masuk akal?",
        "**Klarifikasi.** Incoterm apa? Berat dan dimensi? Butuh asuransi? Ada barang berbahaya? Siapa yang urus kepabeanan?",
        "**Pengumpulan rate.** Menghubungi pelayaran, trucking, gudang, agen tujuan. Menunggu balasan.",
        "**Penyusunan harga.** Menambahkan margin, surcharge, biaya dokumen, memeriksa kurs.",
        "**Persetujuan.** Kalau margin di bawah ambang atau nilainya besar, perlu tanda tangan atasan.",
        "**Pengiriman & tindak lanjut.** Kirim quotation, lalu ingat untuk menindaklanjuti.",
      ],
    },
    {
      type: "p",
      text: "Kalau Anda mencatat waktu tiap tahap selama dua minggu, hasilnya hampir selalu sama: tahap 4 memakan 60–80% dari total waktu, dan tahap 5 (satu-satunya tahap yang benar-benar butuh penilaian komersial) memakan paling sedikit.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Tahap yang paling lama adalah tahap yang paling tidak bernilai",
      body: "Menunggu balasan rate dari vendor bukan pekerjaan yang membedakan Anda dari pesaing. Semua forwarder menunggu vendor yang sama. Yang membedakan adalah berapa banyak pertanyaan yang tidak perlu Anda tanyakan karena jawabannya sudah tersimpan dari terakhir kali.",
    },
    {
      type: "h2",
      id: "masalah-rate-yang-tersebar",
      text: "Masalah rate yang tersebar",
    },
    {
      type: "p",
      text: "Di sebagian besar forwarder ukuran menengah, rate hidup di banyak tempat sekaligus: file Excel di komputer manajer pricing, lampiran PDF di email, tangkapan layar WhatsApp dari sales pelayaran, dan yang paling berbahaya, di kepala orang yang sudah lama bekerja di sana.",
    },
    {
      type: "p",
      text: "Konsekuensinya bukan sekadar tidak rapi. Ia menghasilkan tiga masalah nyata:",
    },
    {
      type: "ul",
      items: [
        "**Harga tidak konsisten.** Dua sales bisa mengutip angka berbeda untuk rute yang sama di minggu yang sama. Kalau keduanya kebetulan mengutip ke customer yang sama lewat orang berbeda, kredibilitas Anda hilang dalam satu percakapan.",
        "**Rate kedaluwarsa terpakai.** Rate laut punya masa berlaku pendek dan surcharge berubah tiap periode. File yang tidak bertanggal berlaku selamanya di mata orang yang membukanya.",
        "**Pengetahuan menempel pada orang.** Ketika manajer pricing resign, ia membawa serta pemahaman rute yang tidak pernah tertulis di mana pun. Penggantinya butuh berbulan-bulan hanya untuk kembali ke titik yang sama.",
      ],
    },
    {
      type: "h2",
      id: "rfq-yang-tidak-pernah-tercatat",
      text: "RFQ yang tidak pernah tercatat sama sekali",
    },
    {
      type: "p",
      text: "Ini bagian yang paling sering luput. Kalau RFQ masuk langsung ke inbox pribadi seorang sales, maka satu-satunya orang yang tahu RFQ itu ada adalah sales tersebut. Kalau ia sibuk, cuti, atau lupa, RFQ itu tidak pernah terjadi menurut catatan perusahaan.",
    },
    {
      type: "p",
      text: "Yang membuatnya sulit dideteksi: tidak ada gejala. Tidak ada laporan yang menampilkan \"RFQ yang tidak dijawab\", karena sistem tidak pernah tahu RFQ itu masuk. Perusahaan hanya merasa pipeline-nya agak sepi, tanpa pernah tahu berapa banyak peluang yang menguap.",
    },
    {
      type: "quote",
      text: "Anda tidak bisa memperbaiki tingkat kemenangan kalau penyebutnya sendiri tidak pernah dihitung.",
    },
    {
      type: "p",
      text: "Perbaikannya tidak harus berupa sistem. Langkah pertama cukup dengan menetapkan satu alamat masuk resmi (misalnya rfq@ perusahaan Anda) dan mewajibkan setiap RFQ yang datang ke jalur lain diteruskan ke sana sebelum dikerjakan. Sederhana, gratis, dan seketika memberi Anda penyebut.",
    },
    {
      type: "h2",
      id: "klarifikasi-yang-terlambat",
      text: "Klarifikasi yang datang terlambat",
    },
    {
      type: "p",
      text: "Pola yang sering terjadi: sales menerima RFQ, meneruskannya ke pricing, pricing mulai mengumpulkan rate, lalu di tengah jalan menyadari bahwa incoterm-nya tidak disebutkan. Pertanyaan dikirim balik ke customer. Customer menjawab dua hari kemudian. Pengumpulan rate dimulai ulang karena asumsinya berubah.",
    },
    {
      type: "p",
      text: "Dua hari itu tidak hilang karena ada yang lambat bekerja. Hilangnya karena pertanyaan diajukan pada tahap 4, padahal seharusnya di tahap 3.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Daftar periksa sebelum menyentuh rate",
      body: "Incoterm · Pelabuhan/kota asal dan tujuan · Jenis komoditas dan kode HS bila ada · Berat kotor dan dimensi · Jenis dan jumlah kontainer, atau volume LCL · Perlu asuransi? · Termasuk kepabeanan? · Ada persyaratan khusus (reefer, DG, oversize)? · Perkiraan tanggal siap muat · Frekuensi bila kontrak. Sepuluh pertanyaan ini, ditanyakan sekaligus di jam pertama, menghemat lebih banyak waktu daripada perbaikan proses lain mana pun di daftar ini.",
    },
    {
      type: "h2",
      id: "kenapa-menang-kalah-jarang-dicatat",
      text: "Kenapa kolom alasan menang-kalah selalu kosong",
    },
    {
      type: "p",
      text: "Hampir semua CRM punya kolom ini. Hampir tidak ada yang mengisinya, dan alasannya masuk akal: mengisi kolom itu tidak memberi manfaat apa pun bagi orang yang mengisinya. Sales yang kalah tender sedang tidak ingin menuliskan kenapa ia kalah.",
    },
    {
      type: "p",
      text: "Padahal ini satu-satunya data yang memberi tahu apakah Anda perlu menurunkan harga atau mempercepat respons. Tanpa itu, setiap kekalahan otomatis dijelaskan sebagai \"harga pesaing lebih murah\", penjelasan yang selalu tersedia, tidak pernah bisa dibantah, dan mendorong Anda menekan margin yang mungkin sebetulnya tidak bermasalah.",
    },
    {
      type: "p",
      text: "Cara yang lebih realistis: jangan minta esai. Sediakan lima pilihan tetap (harga, waktu respons, kapasitas/jadwal, syarat pembayaran, hubungan lama dengan pesaing) dan wajibkan satu klik. Data kasar yang terkumpul jauh lebih berguna daripada data rinci yang tidak pernah ada.",
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
        ["Waktu respons RFQ", "Turun signifikan untuk rute yang rate-nya sudah tersimpan", "Semua RFQ dijawab dalam 1 jam, termasuk rute baru"],
        ["Konsistensi harga", "Hilang sepenuhnya sebagai kelas masalah", "Harga otomatis optimal"],
        ["Tingkat kemenangan", "Naik pada segmen yang sensitif kecepatan", "Naik di semua segmen"],
        ["Beban kerja pricing", "Bergeser dari mengumpulkan ke menganalisis", "Berkurang jadi nol"],
        ["Visibilitas pipeline", "Muncul untuk pertama kalinya", "Prediksi penjualan yang akurat"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan kolom kanan. Semua yang ada di sana adalah janji yang sering muncul di presentasi vendor software, dan tidak satu pun bisa ditepati. Sistem tidak tahu berapa harga yang seharusnya; ia hanya membuat harga yang sudah Anda tentukan menjadi konsisten dan cepat diakses.",
    },
    {
      type: "h2",
      id: "langkah-pertama-tanpa-anggaran",
      text: "Tiga langkah pertama yang tidak butuh anggaran",
    },
    {
      type: "ol",
      items: [
        "Tetapkan satu alamat masuk resmi untuk RFQ, dan wajibkan semua jalur lain diteruskan ke sana. Ini memberi Anda penyebut.",
        "Buat daftar periksa klarifikasi sepuluh poin dan pakai di jam pertama setiap RFQ. Ini memotong tahap yang paling boros.",
        "Catat tanggal dan jam RFQ masuk serta quotation terkirim, walau hanya di satu spreadsheet bersama. Setelah dua minggu Anda akan tahu waktu respons Anda yang sebenarnya, dan angka itu biasanya berbeda jauh dari yang diperkirakan tim.",
      ],
    },
    {
      type: "p",
      text: "Ketiganya bisa dijalankan Senin depan. Kalau setelah sebulan angkanya menunjukkan bahwa waktu respons Anda memang sudah kompetitif, Anda baru saja menghemat anggaran sistem yang tidak Anda butuhkan. Kalau ternyata tidak, Anda punya angka untuk membenarkan pengeluarannya, dan garis dasar untuk membuktikan hasilnya nanti.",
    },
  ],
  faq: [
    {
      q: "Berapa waktu respons RFQ yang dianggap kompetitif di freight forwarding?",
      a: "Tidak ada angka baku yang berlaku universal, karena ekspektasi berbeda antara spot dan tender kontrak. Yang lebih berguna: tanyakan langsung ke tiga customer terbesar Anda berapa lama mereka biasanya menunggu sebelum menyusun shortlist. Jawaban mereka adalah patokan yang relevan untuk bisnis Anda, dan jauh lebih dapat dipercaya daripada angka industri yang digeneralisasi.",
    },
    {
      q: "Apakah rate management harus berupa sistem, atau cukup spreadsheet yang rapi?",
      a: "Spreadsheet terpusat dengan kolom masa berlaku dan riwayat perubahan sudah menyelesaikan sebagian besar masalah konsistensi, dan untuk tim di bawah lima orang sering kali itu memadai. Batasnya muncul ketika beberapa orang perlu mengedit bersamaan, ketika Anda butuh jejak siapa mengubah apa, atau ketika rate harus dipakai otomatis saat membuat quotation.",
    },
    {
      q: "Bagaimana menangani RFQ untuk rute yang belum pernah kami layani?",
      a: "Pisahkan alurnya sejak awal, dan beri tahu customer bahwa Anda sedang mencari rate baru dengan tenggat yang jelas. Yang merusak hubungan bukan jawaban lambat, melainkan diam. Sebutkan kapan Anda akan kembali, lalu tepati, itu lebih berharga daripada angka yang cepat tapi asal.",
    },
    {
      q: "Apakah menaruh semua rate di satu sistem berisiko kalau ada karyawan keluar?",
      a: "Risikonya justru sebaliknya. Ketika rate hanya ada di kepala dan file pribadi seseorang, kepergian orang itu benar-benar menghilangkan aset perusahaan. Sistem terpusat dengan hak akses berjenjang membuat pengetahuan tetap tinggal, sementara akses bisa dicabut dalam hitungan detik.",
    },
  ],
  related: ["margin-per-job-forwarder", "manajemen-vendor-subkontraktor", "memilih-software-logistik-pilot-30-hari"],
};
