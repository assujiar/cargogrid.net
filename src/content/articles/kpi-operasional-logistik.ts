import type { Article } from "./types";

export const article: Article = {
  slug: "kpi-operasional-logistik",
  layout: "feature",
  title: "KPI Logistik yang Benar-benar Dibaca Customer, Bukan yang Cuma Menghiasi Laporan",
  metaTitle: "KPI Operasional Logistik: yang Berguna vs yang Menyesatkan | CargoGrid OS",
  description:
    "On-time delivery 98% bisa berarti apa saja, tergantung cara Anda mendefinisikannya. Ini panduan menyusun KPI logistik yang tidak bisa dipoles dan benar-benar memandu keputusan.",
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
    "Hampir setiap laporan bulanan ke customer menampilkan angka on-time delivery yang tinggi. Anehnya, angka itu jarang dibantah tapi juga jarang benar-benar dipercaya. Tulisan ini membahas cara menyusun indikator yang tetap berdiri tegak ketika diperiksa lebih dalam.",
  takeaways: [
    "KPI tanpa definisi tertulis cepat atau lambat akan bergeser ke arah yang menguntungkan orang yang melaporkannya, dan itu sering terjadi tanpa niat buruk sama sekali.",
    "Rata-rata pandai menyembunyikan kegagalan; persentil justru membongkarnya.",
    "Kalau sebuah indikator tidak pernah mengubah tindakan siapa pun, sebaiknya dicoret, bukan dipertahankan demi kelengkapan laporan.",
    "Customer tidak menaruh percaya pada angka yang paling tinggi, melainkan pada angka yang konsisten dan selalu disertai penjelasan begitu meleset.",
  ],
  blocks: [
    {
      type: "p",
      text: "Coba perhatikan laporan kinerja bulanan yang Anda kirim ke customer. Kemungkinan besar ada angka on-time delivery di halaman pertama, dan kemungkinan besar angkanya di atas 95%. Sekarang bandingkan dengan angka yang dihitung sendiri oleh customer Anda dari sisi mereka: hampir pasti hasilnya lebih rendah.",
    },
    {
      type: "p",
      text: "Jarang sekali selisih itu terjadi karena ada yang bermain angka. Penyebabnya lebih sederhana: kata \"tepat waktu\" tidak pernah didefinisikan bersama sejak awal, jadi masing-masing pihak mengisi kekosongan itu dengan asumsi yang menurut sudut pandangnya sendiri paling masuk akal.",
    },
    {
      type: "h2",
      id: "dasar-goodhart",
      text: "Titik awal: hukum Goodhart dan dua jenis penyimpangan",
    },
    {
      type: "p",
      text: "Hukum Goodhart bilang begini: begitu sebuah ukuran dijadikan target, ia berhenti menjadi ukuran yang baik. Bukan karena orang berniat curang, tapi karena setiap definisi pasti punya celah, dan tekanan untuk mengejar angka pada akhirnya akan menemukan celah itu dengan sendirinya. Itu sebabnya definisi tertulis jauh lebih menentukan daripada besar-kecilnya target.",
    },
    {
      type: "p",
      text: "Prinsip kedua datang dari dunia pengendalian mutu statistik, dirintis Shewhart dan dipopulerkan Deming: bedakan variasi sebab umum dari variasi sebab khusus. Variasi sebab umum melekat pada proses itu sendiri, satu-satunya cara menguranginya adalah mengubah prosesnya. Variasi sebab khusus datang dari kejadian tertentu yang bisa ditelusuri sumbernya. Masalahnya, kalau variasi sebab umum ditanggapi seolah kejadian khusus, misalnya menegur tim setiap kali angka turun sedikit, yang bertambah cuma kegaduhan, bukan perbaikan.",
    },
    {
      type: "h2",
      id: "definisi-yang-menentukan-segalanya",
      text: "Lima pertanyaan yang wajib dijawab sebelum menghitung on-time delivery",
    },
    {
      type: "p",
      text: "Angka on-time delivery baru punya arti kalau kelima pertanyaan ini sudah dijawab dan ditulis hitam di atas putih:",
    },
    {
      type: "ol",
      items: [
        "**Tepat waktu dibandingkan tanggal yang mana?** Tanggal yang dijanjikan saat booking, atau tanggal yang direvisi setelah customer sendiri telat menyiapkan barang? Dua-duanya sah dipakai, tapi hasilnya bisa jauh berbeda.",
        "**Keterlambatan gara-gara customer, ikut dihitung atau tidak?** Kalau truk menunggu enam jam karena gudang customer belum siap menerima, apakah pengiriman itu masih dianggap on-time?",
        "**Berapa toleransinya?** Tiba pukul 17.05 untuk janji pukul 17.00, itu masuk on-time atau sudah telat?",
        "**Satuannya apa?** Per pengiriman, per baris pesanan, atau per unit? Satu pengiriman berisi 200 karton dengan 3 karton kurang bisa terlihat sangat berbeda tergantung satuan yang dipakai.",
        "**Kejadian di luar kendali dihitung bagaimana?** Banjir, jalan ditutup, antrean di pelabuhan, apakah dikeluarkan dari perhitungan, atau tetap masuk tapi dilaporkan terpisah?",
      ],
    },
    {
      type: "callout",
      tone: "insight",
      title: "Laporkan dua angka, bukan satu",
      body: "Cara paling ampuh menghentikan perdebatan soal definisi: tampilkan on-time delivery kotor (semua keterlambatan, apa pun sebabnya) berdampingan dengan on-time delivery bersih yang mengecualikan sebab di luar kendali Anda. Angka kotor menggambarkan pengalaman nyata yang dirasakan customer. Angka bersih menunjukkan kinerja yang memang jadi tanggung jawab Anda. Menyajikan keduanya sekaligus jauh lebih dipercaya daripada berdebat mana yang \"benar\".",
    },
    {
      type: "h2",
      id: "rata-rata-yang-menipu",
      text: "Kenapa rata-rata nyaris selalu menyesatkan",
    },
    {
      type: "p",
      text: "Rata-rata waktu pengiriman 2,1 hari kedengarannya bagus. Tapi customer tidak pernah mengalami \"rata-rata\"; mereka mengalami setiap pengiriman satu per satu, dan yang paling nempel di ingatan justru yang paling buruk.",
    },
    {
      type: "p",
      text: "Bayangkan begini: 90% pengiriman selesai dalam 2 hari, sisanya 10% molor sampai 6 hari. Rata-ratanya tetap kelihatan wajar, padahal sepersepuluh customer Anda baru saja mengalami layanan yang buruk. Merekalah yang akhirnya menelepon, mengeluh, dan lambat laun pindah ke kompetitor.",
    },
    {
      type: "table",
      caption: "Ukuran yang sama, cerita yang beda",
      head: ["Ukuran", "Yang terlihat", "Yang tersembunyi"],
      rows: [
        ["Rata-rata", "Kinerja secara umum", "Semua kasus terburuk"],
        ["Median (P50)", "Pengalaman yang tipikal", "Sebaran di kedua ujung"],
        ["Persentil 90 (P90)", "Pengalaman 1 dari 10 pengiriman terburuk", "Kasus ekstrem yang jarang"],
        ["Persentil 95 (P95)", "Batas yang jadi keluhan", ","],
        ["Nilai terburuk", "Kasus paling parah", "Seberapa sering itu terjadi"],
      ],
    },
    {
      type: "p",
      text: "Kalau cuma boleh pilih satu, pilih P90. Ia menangkap pengalaman yang cukup sering terjadi untuk dianggap berarti, tanpa gampang terdistorsi oleh satu kejadian yang benar-benar di luar kebiasaan. Dan beda dengan rata-rata, P90 tidak bisa \"diakali\" dengan cara mempercepat pengiriman yang memang sudah cepat.",
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
        "**Waktu respons RFQ (P90).** Berapa lama sampai quotation terkirim, dihitung dari 10% RFQ yang paling lambat direspons.",
        "**Tingkat kemenangan, lengkap dengan alasan kalah.** Tanpa alasan kalah, angka kemenangan tidak memandu tindakan apa pun, cuma jadi angka di slide.",
        "**Jumlah RFQ yang tidak pernah dijawab.** Biasanya nol di laporan, bukan karena memang tidak ada, tapi karena tidak pernah dicatat.",
      ],
    },
    {
      type: "h3",
      text: "Operasional",
    },
    {
      type: "ul",
      items: [
        "**On-time delivery kotor dan bersih**, keduanya dengan definisi tertulis.",
        "**Waktu POD kembali (P90).** Ini yang langsung menentukan cepat-lambatnya siklus kas Anda.",
        "**Tingkat pengiriman ulang.** Indikator kualitas yang jauh lebih susah dipoles dibanding on-time delivery.",
        "**Waktu tunggu di lokasi customer.** Data ini juga berguna sebagai bahan negosiasi kalau nanti membahas biaya tunggu.",
      ],
    },
    {
      type: "h3",
      text: "Gudang",
    },
    {
      type: "ul",
      items: [
        "**Akurasi stok**, dihitung dari cycle count, bukan dari opname tahunan.",
        "**Akurasi picking**, persentase baris pesanan yang benar tanpa perlu dikoreksi.",
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
        "**Hari dari job selesai sampai invoice terbit.** Bagian dari siklus kas yang sepenuhnya ada di tangan Anda sendiri.",
        "**Persentase invoice yang disanggah atau ditolak.** Ini indikator mutu data, bukan indikator penagihan.",
        "**Sebaran margin per job**, bukan margin yang sudah digabung jadi satu angka agregat.",
      ],
    },
    {
      type: "h2",
      id: "kpi-yang-sebaiknya-dihapus",
      text: "Indikator yang sebaiknya dicoret dari laporan",
    },
    {
      type: "p",
      text: "Menambah indikator terasa aman, menghapusnya terasa berisiko. Padahal laporan yang penuh sesak dengan indikator yang tidak pernah mengubah satu keputusan pun justru melatih pembacanya untuk berhenti membaca.",
    },
    {
      type: "ul",
      items: [
        "**Indikator yang selalu hijau.** Kalau angkanya tidak pernah keluar dari target sepanjang tahun, artinya ia sedang tidak mengukur apa pun yang benar-benar bervariasi.",
        "**Indikator tanpa pemilik.** Kalau tidak ada satu orang pun yang bisa ditunjuk bertanggung jawab, tidak akan pernah ada yang menindaklanjutinya.",
        "**Total volume tanpa konteks.** Jumlah shipment naik 12%, itu kabar baik atau buruk? Tidak bisa dijawab tanpa melihat margin dan kapasitas di baliknya.",
        "**Indikator yang datanya dikumpulkan manual setiap bulan.** Cepat atau lambat pengisiannya akan berhenti justru di bulan tersibuk, persis ketika informasinya paling dibutuhkan.",
      ],
    },
    {
      type: "quote",
      text: "Indikator yang tidak pernah membuat siapa pun mengubah rencananya, itu bukan indikator. Itu cuma dekorasi.",
    },
    {
      type: "h2",
      id: "cara-menyajikan-ke-customer",
      text: "Cara menyajikan yang justru membangun kepercayaan",
    },
    {
      type: "p",
      text: "Wajar kalau ada kekhawatiran bahwa melaporkan angka apa adanya akan merusak hubungan dengan customer. Tapi dari pengalaman kami, yang terjadi justru sebaliknya, dengan satu syarat: setiap penyimpangan harus disertai penjelasan dan tindakan yang diambil.",
    },
    {
      type: "p",
      text: "Bandingkan dua laporan. Yang satu bilang, \"on-time 91% bulan ini, turun dari 96%; penyebab utamanya antrean di terminal pada minggu kedua; kami sudah mengubah jadwal penarikan untuk mengurangi paparan risiko itu.\" Yang satu lagi cuma menampilkan 98% tanpa cerita apa-apa, bulan demi bulan. Yang pertama jauh lebih menenangkan bagi customer.",
    },
    {
      type: "p",
      text: "Alasannya sederhana: customer Anda juga menjalankan operasional sendiri, jadi mereka tahu persis tidak ada bulan yang berjalan mulus tanpa cela. Laporan yang selalu terlihat sempurna justru tidak membuat mereka tenang, malah membuat mereka curiga ada yang tidak diceritakan.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Uji sederhana untuk tiap indikator di laporan Anda",
      body: "Untuk setiap angka, coba jawab pertanyaan ini: kalau angka ini memburuk 20% bulan depan, siapa yang akan melakukan apa? Kalau tidak ada jawaban yang spesifik, berarti indikator itu sedang tidak bekerja. Hapus saja, atau tetapkan pemiliknya sekarang juga. Laporan berisi lima indikator yang semuanya punya jawaban jelas jauh lebih berguna daripada laporan dua puluh indikator yang sebagian besar tidak punya jawaban sama sekali.",
    },
  ],
  faq: [
    {
      q: "Berapa banyak KPI yang ideal untuk laporan bulanan?",
      a: "Lebih sedikit dari yang biasanya dipakai kebanyakan orang. Lima sampai tujuh indikator yang masing-masing punya pemilik dan ambang tindakan jauh lebih berguna daripada dua puluh indikator yang cuma dibaca sekilas lalu dilupakan. Kalau ada satu indikator yang tidak pernah dibahas dalam rapat selama tiga bulan berturut-turut, itu kandidat kuat untuk dicoret.",
    },
    {
      q: "Apakah SLA di kontrak harus sama persis dengan KPI internal?",
      a: "Tidak harus, dan justru sering kali sebaiknya tidak sama. SLA di kontrak adalah komitmen minimum yang punya konsekuensi komersial, sementara target internal sebaiknya dipasang lebih ketat supaya Anda masih punya ruang gerak sebelum benar-benar menyentuh batas kontrak. Yang wajib sama persis hanya definisi dan cara menghitungnya, karena perbedaan di titik itu yang biasanya berujung sengketa.",
    },
    {
      q: "Bagaimana cara mengukur kinerja subkontraktor yang tidak punya sistem sendiri?",
      a: "Ukur saja dari data yang sudah ada di tangan Anda: waktu POD kembali, jumlah pengiriman ulang, dan keluhan customer per subkontraktor. Ketiganya tercatat di sisi Anda tanpa perlu apa pun dari mereka, dan itu sudah cukup untuk membedakan mana mitra yang bisa diandalkan dan mana yang tidak.",
    },
    {
      q: "Customer minta laporan dalam format mereka sendiri, apakah harus dituruti?",
      a: "Untuk customer besar, biasanya iya, dan itu memang bagian dari biaya melayani mereka, biaya yang sebaiknya Anda hitung dan masukkan ke analisis margin per job. Yang perlu dijaga ketat: pastikan angka yang dikirim dalam format mereka berasal dari sumber data yang sama dengan laporan internal Anda. Menyusun ulang secara manual untuk tiap customer adalah cara paling ampuh untuk menghasilkan dua angka berbeda buat hal yang sebenarnya sama.",
    },
  ],
  related: ["margin-per-job-forwarder", "wms-3pl-level-bin", "customer-portal-logistik"],
};
