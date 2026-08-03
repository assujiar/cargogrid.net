import type { Article } from "./types";

export const article: Article = {
  slug: "kpi-operasional-logistik",
  layout: "feature",
  title: "KPI Logistik yang Benar-benar Dibaca Customer: dan Yang Hanya Menghias Laporan",
  metaTitle: "KPI Operasional Logistik yang Berguna & yang Menyesatkan | CargoGrid OS",
  description:
    "On-time delivery 98% bisa berarti apa saja tergantung definisinya. Panduan menyusun KPI logistik yang tidak bisa dipoles dan benar-benar memandu keputusan.",
  keywords: [
    "KPI logistik",
    "on time delivery rate",
    "SLA logistik indonesia",
    "indikator kinerja gudang",
    "laporan kinerja 3PL",
  ],
  category: "operasional",
  publishedAt: "2026-07-09",
  summary:
    "Setiap laporan bulanan ke customer menampilkan angka on-time delivery yang tinggi. Angka itu jarang dibantah, dan hampir sama jarangnya dipercaya. Tulisan ini soal cara menyusun indikator yang bertahan saat diperiksa.",
  takeaways: [
    "KPI tanpa definisi tertulis akan selalu bergeser ke arah yang menguntungkan pelapornya, sering tanpa niat buruk.",
    "Rata-rata menyembunyikan kegagalan; persentil menampilkannya.",
    "Indikator yang tidak mengubah tindakan siapa pun sebaiknya dihapus, bukan dipertahankan.",
    "Yang paling dipercaya customer bukan angka tertinggi, melainkan angka yang konsisten dan disertai penjelasan saat meleset.",
  ],
  blocks: [
    {
      type: "p",
      text: "Kalau Anda mengirim laporan kinerja bulanan ke customer, kemungkinan besar ada angka on-time delivery di halaman pertama, dan kemungkinan besar angkanya di atas 95%. Kalau customer Anda juga menghitung angka yang sama secara mandiri, kemungkinan besar angka mereka lebih rendah.",
    },
    {
      type: "p",
      text: "Selisih itu jarang disebabkan manipulasi. Ia muncul karena kata \"tepat waktu\" tidak pernah didefinisikan bersama, dan setiap pihak mengisi kekosongan itu dengan asumsi yang wajar menurut sudut pandangnya sendiri.",
    },
    {
      type: "h2",
      id: "dasar-goodhart",
      text: "Dasar: hukum Goodhart dan dua jenis penyimpangan",
    },
    {
      type: "p",
      text: "Hukum Goodhart menyatakan bahwa ketika sebuah ukuran dijadikan target, ia berhenti menjadi ukuran yang baik. Bukan karena orang berniat curang, melainkan karena setiap definisi punya celah, dan tekanan untuk mencapai angka akan menemukan celah itu dengan sendirinya. Inilah alasan definisi tertulis lebih menentukan daripada besaran targetnya.",
    },
    {
      type: "p",
      text: "Prinsip kedua datang dari pengendalian mutu statistik yang dikembangkan Shewhart dan kemudian dipopulerkan Deming, yaitu pembedaan antara variasi sebab umum dan variasi sebab khusus. Variasi sebab umum melekat pada proses dan hanya bisa dikurangi dengan mengubah prosesnya. Variasi sebab khusus berasal dari kejadian tertentu yang bisa ditelusuri. Menanggapi variasi sebab umum seolah ia kejadian khusus, misalnya menegur tim setiap kali angka turun sedikit, justru menambah kegaduhan tanpa memperbaiki apa pun.",
    },
    {
      type: "h2",
      id: "definisi-yang-menentukan-segalanya",
      text: "Lima pertanyaan yang harus dijawab sebelum menghitung on-time delivery",
    },
    {
      type: "p",
      text: "Angka on-time delivery tidak punya arti sampai kelima pertanyaan ini dijawab dan ditulis:",
    },
    {
      type: "ol",
      items: [
        "**Tepat waktu dibandingkan tanggal apa?** Tanggal yang dijanjikan saat booking, atau tanggal yang direvisi setelah customer terlambat menyiapkan barang? Keduanya sah, tapi menghasilkan angka yang jauh berbeda.",
        "**Apakah keterlambatan karena customer ikut dihitung?** Kalau truk menunggu enam jam karena gudang customer belum siap, apakah pengiriman itu tetap on-time?",
        "**Berapa toleransinya?** Tiba pukul 17.05 untuk janji pukul 17.00, masuk kategori mana?",
        "**Apa satuannya?** Per pengiriman, per baris pesanan, atau per unit? Satu pengiriman berisi 200 karton dengan 3 karton kurang akan terlihat sangat berbeda tergantung pilihan ini.",
        "**Kejadian di luar kendali dihitung bagaimana?** Banjir, penutupan jalan, antrean pelabuhan. Dikeluarkan dari perhitungan, atau dilaporkan terpisah?",
      ],
    },
    {
      type: "callout",
      tone: "insight",
      title: "Laporkan dua angka, bukan satu",
      body: "Cara paling efektif menghentikan perdebatan definisi: laporkan on-time delivery kotor (semua keterlambatan apa pun sebabnya) di samping on-time delivery bersih yang mengecualikan sebab di luar kendali Anda. Angka kotor memberi customer gambaran pengalaman nyata mereka. Angka bersih menunjukkan kinerja yang memang tanggung jawab Anda. Menyajikan keduanya jauh lebih dipercaya daripada memperdebatkan mana yang benar.",
    },
    {
      type: "h2",
      id: "rata-rata-yang-menipu",
      text: "Kenapa rata-rata hampir selalu menyesatkan",
    },
    {
      type: "p",
      text: "Rata-rata waktu pengiriman 2,1 hari terdengar bagus. Tapi customer tidak mengalami rata-rata; mereka mengalami setiap pengiriman satu per satu, dan yang mereka ingat adalah yang terburuk.",
    },
    {
      type: "p",
      text: "Kalau 90% pengiriman selesai dalam 2 hari dan 10% memakan 6 hari, rata-ratanya tetap terlihat wajar sementara sepersepuluh customer Anda mengalami layanan yang buruk. Merekalah yang menelepon, mengeluh, dan pada akhirnya pindah.",
    },
    {
      type: "table",
      caption: "Ukuran yang sama, cerita yang berbeda",
      head: ["Ukuran", "Yang ditampilkan", "Yang disembunyikan"],
      rows: [
        ["Rata-rata", "Kinerja umum", "Seluruh kasus terburuk"],
        ["Median (P50)", "Pengalaman tipikal", "Sebaran di kedua ujung"],
        ["Persentil 90 (P90)", "Pengalaman 1 dari 10 pengiriman terburuk", "Kasus ekstrem yang jarang"],
        ["Persentil 95 (P95)", "Batas yang jadi keluhan", ","],
        ["Nilai terburuk", "Kasus paling parah", "Seberapa sering itu terjadi"],
      ],
    },
    {
      type: "p",
      text: "Kalau harus memilih satu, pilih P90. Ia menangkap pengalaman yang cukup sering terjadi untuk berarti, tanpa terdistorsi oleh satu kejadian luar biasa. Dan tidak seperti rata-rata, P90 tidak bisa diperbaiki dengan cara membuat pengiriman yang sudah cepat menjadi lebih cepat.",
    },
    {
      type: "h2",
      id: "kpi-yang-layak-dipantau",
      text: "Indikator yang layak dipantau, per fungsi",
    },
    {
      type: "h3",
      text: "Komersial",
    },
    {
      type: "ul",
      items: [
        "**Waktu respons RFQ (P90).** Berapa lama sampai quotation terkirim, untuk 10% RFQ paling lambat.",
        "**Tingkat kemenangan berdasarkan alasan kalah.** Tanpa alasan, angka kemenangan tidak memandu tindakan apa pun.",
        "**Jumlah RFQ yang tidak dijawab.** Sering nol di laporan karena tidak pernah tercatat, bukan karena tidak ada.",
      ],
    },
    {
      type: "h3",
      text: "Operasional",
    },
    {
      type: "ul",
      items: [
        "**On-time delivery kotor dan bersih**, dengan definisi tertulis.",
        "**Waktu POD kembali (P90).** Penentu langsung siklus kas Anda.",
        "**Tingkat pengiriman ulang.** Indikator kualitas yang jauh lebih sulit dipoles daripada on-time delivery.",
        "**Waktu tunggu di lokasi customer.** Data ini juga jadi alat negosiasi ketika membahas biaya tunggu.",
      ],
    },
    {
      type: "h3",
      text: "Gudang",
    },
    {
      type: "ul",
      items: [
        "**Akurasi stok**, dihitung dari cycle count, bukan opname tahunan.",
        "**Akurasi picking**, persentase baris pesanan yang benar tanpa koreksi.",
        "**Waktu dari pesanan diterima sampai siap kirim (P90).**",
      ],
    },
    {
      type: "h3",
      text: "Keuangan",
    },
    {
      type: "ul",
      items: [
        "**Hari dari job selesai sampai invoice terbit.** Bagian siklus kas yang sepenuhnya dalam kendali Anda.",
        "**Persentase invoice yang disanggah atau ditolak.** Indikator mutu data, bukan indikator penagihan.",
        "**Sebaran margin per job**, bukan margin agregat.",
      ],
    },
    {
      type: "h2",
      id: "kpi-yang-sebaiknya-dihapus",
      text: "Indikator yang sebaiknya dihapus dari laporan",
    },
    {
      type: "p",
      text: "Menambah indikator terasa aman; menghapusnya terasa berisiko. Padahal laporan yang penuh indikator yang tidak pernah mengubah keputusan justru melatih pembacanya untuk berhenti membaca.",
    },
    {
      type: "ul",
      items: [
        "**Indikator yang selalu hijau.** Kalau angkanya tidak pernah keluar dari target selama setahun, ia tidak sedang mengukur apa pun yang bervariasi.",
        "**Indikator tanpa pemilik.** Kalau tidak ada satu orang pun yang bisa disebut bertanggung jawab, tidak akan ada yang menindaklanjutinya.",
        "**Total volume tanpa konteks.** Jumlah shipment naik 12% itu kabar baik atau buruk? Tidak bisa dijawab tanpa margin dan kapasitas.",
        "**Indikator yang datanya dikumpulkan manual setiap bulan.** Ini akan berhenti diisi di bulan tersibuk, tepat ketika informasinya paling dibutuhkan.",
      ],
    },
    {
      type: "quote",
      text: "Indikator yang tidak pernah membuat siapa pun mengubah rencananya bukan indikator. Itu dekorasi.",
    },
    {
      type: "h2",
      id: "cara-menyajikan-ke-customer",
      text: "Cara menyajikan yang membangun kepercayaan",
    },
    {
      type: "p",
      text: "Ada kekhawatiran yang wajar bahwa melaporkan angka apa adanya akan merusak hubungan. Dalam pengalaman kami, yang terjadi justru sebaliknya, dengan satu syarat: setiap penyimpangan harus disertai penjelasan dan tindakan.",
    },
    {
      type: "p",
      text: "Laporan yang menyebut \"on-time 91% bulan ini, turun dari 96%; penyebab utama antrean di terminal pada minggu kedua; kami mengubah jadwal penarikan untuk mengurangi paparan\" jauh lebih menenangkan bagi customer daripada laporan yang selalu menampilkan 98% tanpa cerita apa pun.",
    },
    {
      type: "p",
      text: "Alasannya sederhana: customer Anda juga menjalankan operasional, dan mereka tahu tidak ada bulan yang berjalan sempurna. Laporan yang selalu sempurna tidak membuat mereka tenang, ia membuat mereka menduga ada yang tidak dilaporkan.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Uji sederhana untuk setiap indikator di laporan Anda",
      body: "Untuk setiap angka, jawab: kalau angka ini memburuk 20% bulan depan, siapa yang akan melakukan apa? Kalau tidak ada jawaban yang spesifik, indikator itu tidak sedang bekerja. Hapus, atau tetapkan pemiliknya. Laporan lima indikator yang semuanya punya jawaban lebih berguna daripada laporan dua puluh yang sebagian besar tidak.",
    },
  ],
  faq: [
    {
      q: "Berapa banyak KPI yang ideal untuk laporan bulanan?",
      a: "Lebih sedikit daripada yang biasanya dipakai. Lima sampai tujuh indikator yang masing-masing punya pemilik dan ambang tindakan lebih berguna daripada dua puluh yang dibaca sekilas. Kalau ada indikator yang tidak pernah dibahas dalam rapat selama tiga bulan berturut-turut, itu kandidat yang jelas untuk dihapus.",
    },
    {
      q: "Apakah SLA di kontrak harus sama dengan KPI internal?",
      a: "Tidak harus, dan sering sebaiknya tidak. SLA kontrak adalah komitmen minimum dengan konsekuensi komersial; target internal sebaiknya lebih ketat agar Anda punya ruang sebelum menyentuh batas kontrak. Yang wajib sama adalah definisi dan cara menghitungnya, perbedaan di situ akan berubah jadi sengketa.",
    },
    {
      q: "Bagaimana mengukur kinerja subkontraktor yang tidak punya sistem?",
      a: "Ukur dari data yang sudah Anda miliki: waktu POD kembali, jumlah pengiriman ulang, keluhan customer per subkontraktor. Ketiganya tercatat di sisi Anda tanpa memerlukan apa pun dari mereka, dan sudah cukup untuk membedakan mitra yang andal dari yang tidak.",
    },
    {
      q: "Customer meminta laporan dengan format mereka sendiri. Apakah harus dituruti?",
      a: "Untuk customer besar, biasanya iya, dan itu bagian dari biaya melayani mereka, biaya yang sebaiknya Anda hitung dan masukkan ke analisis margin per job. Yang perlu dijaga: pastikan angka yang dikirim dalam format mereka berasal dari sumber yang sama dengan laporan internal Anda. Menyusun ulang secara manual per customer adalah cara paling pasti menghasilkan dua angka yang berbeda untuk hal yang sama.",
    },
  ],
  related: ["margin-per-job-forwarder", "wms-3pl-level-bin", "customer-portal-logistik"],
};
