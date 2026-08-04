import type { Article } from "./types";

export const article: Article = {
  slug: "kpi-operasional-logistik",
  layout: "feature",
  title: "KPI Logistik yang Benar-Benar Dibaca Customer, Bukan Cuma Pemanis di Laporan Bulanan",
  metaTitle: "Menyusun KPI Operasional Logistik yang Tahan Diperiksa",
  description:
    "Angka on-time delivery 98% di laporan Anda bisa berarti lima hal berbeda, tergantung definisi yang dipakai. Ini cara menyusun KPI logistik yang tahan diperiksa dan benar-benar memandu keputusan operasional.",
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
    "Setiap laporan bulanan ke customer biasanya menampilkan on-time delivery di atas 95%. Jarang ada yang membantahnya secara terbuka, tapi jarang pula yang benar-benar percaya pada angka itu. Tulisan ini membahas cara membangun indikator yang tetap kokoh saat diperiksa lebih dalam, sehingga tidak cuma terlihat rapi di atas kertas.",
  takeaways: [
    "KPI tanpa definisi tertulis pelan-pelan akan bergeser menguntungkan siapa pun yang menyusun laporannya, dan itu bisa terjadi tanpa ada niat curang sedikit pun.",
    "Rata-rata jago menyembunyikan kegagalan; persentil justru membongkarnya ke permukaan.",
    "Kalau sebuah indikator tidak pernah mengubah keputusan siapa pun, coret saja. Mempertahankannya demi laporan yang terlihat lengkap cuma menambah halaman, bukan menambah nilai.",
    "Customer tidak percaya pada angka yang paling tinggi. Mereka percaya pada angka yang konsisten dari bulan ke bulan dan selalu disertai penjelasan begitu meleset dari target.",
  ],
  blocks: [
    {
      type: "p",
      text: "Halaman pertama laporan kinerja bulanan ke customer nyaris selalu memuat angka on-time delivery, dan angka itu nyaris selalu berada di atas 95%. Tapi begitu customer menghitung sendiri dari sisi mereka, hasilnya biasanya lebih rendah, kadang jauh lebih rendah.",
    },
    {
      type: "p",
      text: "Selisih itu jarang muncul karena ada yang memanipulasi data. Penyebabnya jauh lebih sederhana: kata \"tepat waktu\" tidak pernah disepakati definisinya sejak awal, sehingga tiap pihak mengisi kekosongan itu dengan asumsi yang paling menguntungkan sudut pandangnya sendiri.",
    },
    {
      type: "h2",
      id: "dasar-goodhart",
      text: "Akar masalahnya: hukum Goodhart dan dua jenis penyimpangan",
    },
    {
      type: "p",
      text: "Hukum Goodhart bilang begini: begitu sebuah ukuran dijadikan target, ia berhenti menjadi ukuran yang baik. Setiap definisi pasti punya celah, dan begitu ada tekanan untuk mengejar angka, celah itu akan ditemukan, tanpa perlu ada siapa pun yang berniat curang. Itulah kenapa definisi tertulis jauh lebih menentukan ketimbang seberapa tinggi target dipasang.",
    },
    {
      type: "p",
      text: "Prinsip kedua berasal dari dunia pengendalian mutu statistik, dirintis Shewhart dan dipopulerkan Deming: variasi sebab umum harus dibedakan dari variasi sebab khusus. Variasi sebab umum melekat pada proses itu sendiri: cara satu-satunya menguranginya adalah mengubah prosesnya, sementara menegur orangnya sama sekali tidak akan membantu. Variasi sebab khusus datang dari kejadian tertentu yang sumbernya bisa dilacak. Masalah muncul kalau variasi sebab umum diperlakukan seolah kejadian khusus: setiap kali angka turun sedikit, tim ditegur, dan yang bertambah cuma kegaduhan; perbaikan sungguhan tidak pernah datang lewat cara itu.",
    },
    {
      type: "h2",
      id: "definisi-yang-menentukan-segalanya",
      text: "Lima pertanyaan yang harus dijawab dulu sebelum menghitung on-time delivery",
    },
    {
      type: "p",
      text: "On-time delivery baru bisa dibaca dengan benar setelah kelima pertanyaan berikut dijawab dan dituliskan hitam di atas putih:",
    },
    {
      type: "ol",
      items: [
        "**Tepat waktu itu diukur dari tanggal yang mana?** Tanggal yang dijanjikan sejak booking, atau tanggal baru setelah customer sendiri telat menyiapkan barangnya? Keduanya sama-sama sah dipakai, tapi hasil akhirnya bisa jomplang jauh.",
        "**Keterlambatan yang disebabkan customer sendiri, masuk hitungan atau tidak?** Misalnya truk menunggu enam jam di gerbang karena gudang customer belum siap menerima. Apakah pengiriman itu tetap dicatat on-time?",
        "**Berapa besar toleransi yang masih diterima?** Tiba pukul 17.05 padahal janjinya pukul 17.00, apakah itu dihitung on-time atau sudah dianggap telat?",
        "**Satuan penghitungannya per apa?** Per pengiriman, per baris pesanan, atau per unit barang? Satu pengiriman berisi 200 karton dengan 3 karton yang kurang bisa terlihat nyaris sempurna atau cukup buruk, tergantung satuan mana yang dipilih.",
        "**Kejadian di luar kendali diperlakukan bagaimana?** Banjir, jalan ditutup, atau antrean panjang di pelabuhan, apakah semua itu dikeluarkan dari perhitungan, atau tetap dimasukkan tapi dilaporkan sebagai kategori terpisah?",
      ],
    },
    {
      type: "callout",
      tone: "insight",
      title: "Laporkan dua angka, bukan satu",
      body: "Cara paling efektif menghentikan perdebatan soal definisi adalah menampilkan dua angka sekaligus: on-time delivery kotor, yang mencatat semua keterlambatan apa pun sebabnya, berdampingan dengan on-time delivery bersih yang sudah mengecualikan sebab-sebab di luar kendali Anda. Angka kotor menceritakan apa yang benar-benar dialami customer. Angka bersih menunjukkan kinerja yang murni jadi tanggung jawab Anda. Menyajikan keduanya sekaligus jauh lebih dipercaya ketimbang berdebat panjang soal angka mana yang paling \"benar\".",
    },
    {
      type: "h2",
      id: "rata-rata-yang-menipu",
      text: "Kenapa rata-rata nyaris selalu menipu",
    },
    {
      type: "p",
      text: "Rata-rata waktu pengiriman 2,1 hari kedengarannya solid di atas kertas. Tapi tidak ada customer yang mengalami \"rata-rata\". Mereka mengalami tiap pengiriman satu demi satu, dan pengalaman yang paling nempel di kepala selalu yang paling buruk, bukan yang paling umum.",
    },
    {
      type: "p",
      text: "Sembilan dari sepuluh pengiriman bisa saja selesai dalam 2 hari, sementara satu sisanya molor sampai 6 hari. Rata-ratanya tetap kelihatan wajar, padahal sepersepuluh customer Anda baru saja mengalami layanan yang buruk. Merekalah yang akhirnya menelepon mengeluh, lalu pelan-pelan pindah ke kompetitor.",
    },
    {
      type: "table",
      caption: "Ukuran yang sama, cerita yang beda",
      head: ["Ukuran", "Yang terlihat", "Yang tersembunyi"],
      rows: [
        ["Rata-rata", "Kesan kinerja secara keseluruhan", "Semua kegagalan individual melebur jadi tak terlihat"],
        ["Median (P50)", "Pengalaman yang paling umum dialami", "Seberapa jauh sebaran di kedua ujungnya"],
        ["Persentil 90 (P90)", "Pengalaman 1 dari 10 pengiriman terburuk", "Kasus ekstrem yang benar-benar jarang terjadi"],
        ["Persentil 95 (P95)", "Ambang batas yang biasanya memicu keluhan resmi", "Kejadian yang jauh lebih ekstrem dan lebih jarang lagi, tersembunyi lebih jauh di ekor distribusi"],
        ["Nilai terburuk", "Insiden paling parah yang pernah tercatat", "Seberapa sering kejadian seburuk itu benar-benar terjadi"],
      ],
    },
    {
      type: "p",
      text: "Kalau harus memilih satu angka saja, pilih P90. Angka ini menangkap pengalaman yang cukup sering terjadi untuk dianggap berarti, tapi tidak gampang terdistorsi oleh satu kejadian yang benar-benar di luar kebiasaan. P90 juga lebih tahan dimanipulasi. Beda dengan rata-rata yang bisa dipoles cukup dengan mempercepat pengiriman yang sebenarnya memang sudah cepat.",
    },
    {
      type: "h2",
      id: "kpi-yang-layak-dipantau",
      text: "Indikator yang layak dipantau, dipilah per fungsi",
    },
    {
      type: "h3",
      text: "Komersial",
    },
    {
      type: "ul",
      items: [
        "**Waktu respons RFQ (P90).** Mengukur berapa lama quotation terkirim, dihitung dari 10% RFQ dengan respons paling lambat.",
        "**Tingkat kemenangan, disertai alasan setiap kekalahan.** Tanpa alasan kalah, angka kemenangan cuma jadi hiasan slide, tidak memandu tindakan apa pun.",
        "**Jumlah RFQ yang tidak pernah dijawab.** Di laporan biasanya tertulis nol, padahal angka sebenarnya jarang benar-benar nol, kebanyakan cuma belum pernah dicatat.",
      ],
    },
    {
      type: "h3",
      text: "Operasional",
    },
    {
      type: "ul",
      items: [
        "**On-time delivery kotor dan bersih**, dua-duanya dengan definisi yang sudah dituliskan jelas.",
        "**Waktu POD kembali ke kantor (P90).** Angka ini yang langsung menentukan seberapa cepat siklus kas Anda berputar.",
        "**Tingkat pengiriman ulang.** Indikator kualitas yang jauh lebih sulit dipoles ketimbang on-time delivery.",
        "**Waktu tunggu di lokasi customer.** Data ini juga jadi modal negosiasi kalau nanti bicara soal biaya tunggu.",
      ],
    },
    {
      type: "h3",
      text: "Gudang",
    },
    {
      type: "ul",
      items: [
        "**Akurasi stok**, dihitung dari cycle count rutin, bukan dari stock opname tahunan yang cuma memotret satu titik waktu.",
        "**Akurasi picking**, persentase baris pesanan yang tepat sejak awal tanpa perlu koreksi ulang.",
        "**Waktu dari pesanan masuk sampai barang siap kirim (P90).**",
      ],
    },
    {
      type: "h3",
      text: "Keuangan",
    },
    {
      type: "ul",
      items: [
        "**Hari dari job selesai sampai invoice terbit.** Satu-satunya bagian siklus kas yang sepenuhnya berada di tangan Anda sendiri, tanpa bergantung pada customer.",
        "**Persentase invoice yang disanggah atau ditolak.** Angka ini sebetulnya mengukur mutu data, bukan cuma soal penagihan semata.",
        "**Sebaran margin per job**, dilihat satu per satu, jangan cuma angka rata-rata yang sudah digabung jadi satu.",
      ],
    },
    {
      type: "h2",
      id: "kpi-yang-sebaiknya-dihapus",
      text: "Indikator yang lebih baik dicoret dari laporan",
    },
    {
      type: "p",
      text: "Menambah indikator terasa aman; menghapusnya terasa berisiko. Padahal laporan yang penuh sesak dengan indikator yang tidak pernah mengubah satu keputusan pun sebenarnya sedang melatih pembacanya untuk berhenti membaca sama sekali.",
    },
    {
      type: "ul",
      items: [
        "**Indikator yang warnanya selalu hijau.** Kalau sepanjang tahun angkanya tidak pernah keluar dari target, kemungkinan besar ia tidak sedang mengukur apa pun yang benar-benar bervariasi.",
        "**Indikator tanpa pemilik.** Selama tidak ada satu nama pun yang bisa ditunjuk bertanggung jawab, tidak akan pernah ada yang menindaklanjutinya kalau angkanya memburuk.",
        "**Total volume tanpa konteks.** Jumlah shipment naik 12%. Itu kabar baik atau justru tanda bahaya? Pertanyaan itu mustahil dijawab tanpa melihat margin dan kapasitas yang menopangnya.",
        "**Indikator yang datanya dikumpulkan manual setiap bulan.** Pengisiannya biasanya berhenti duluan justru di bulan tersibuk, persis ketika informasi itu paling dibutuhkan.",
      ],
    },
    {
      type: "quote",
      text: "Kalau sebuah indikator tidak pernah membuat siapa pun mengubah rencananya, itu bukan indikator. Itu cuma dekorasi laporan.",
    },
    {
      type: "h2",
      id: "cara-menyajikan-ke-customer",
      text: "Cara menyajikan yang malah menambah kepercayaan",
    },
    {
      type: "p",
      text: "Banyak yang khawatir melaporkan angka apa adanya akan merusak hubungan dengan customer. Pengalaman kami justru menunjukkan sebaliknya, asalkan satu syarat dipenuhi: setiap penyimpangan disertai penjelasan dan tindakan konkret yang sudah diambil.",
    },
    {
      type: "p",
      text: "Bandingkan dua gaya laporan. Laporan pertama bilang: \"on-time 91% bulan ini, turun dari 96%; penyebabnya antrean di terminal pada minggu kedua; kami sudah mengubah jadwal penarikan truk untuk mengurangi paparan risiko itu.\" Laporan kedua cuma menampilkan angka 98% tanpa cerita apa pun, bulan demi bulan, tahun demi tahun. Justru laporan pertama yang jauh lebih menenangkan bagi customer.",
    },
    {
      type: "p",
      text: "Alasannya sederhana. Customer Anda juga menjalankan operasional sendiri sehingga mereka tahu persis: tidak ada satu bulan pun yang berjalan mulus tanpa cela. Laporan yang selalu tampak sempurna justru bikin mereka curiga ada sesuatu yang disembunyikan, bukannya membuat mereka tenang.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Uji sederhana untuk tiap indikator di laporan Anda",
      body: "Ajukan pertanyaan ini untuk setiap angka di laporan Anda: kalau angka ini memburuk 20% bulan depan, siapa yang akan melakukan apa? Kalau tidak ada jawaban yang spesifik, indikator itu sedang tidak bekerja. Hapus saja, atau tetapkan pemiliknya sekarang juga. Laporan berisi lima indikator yang semuanya punya jawaban jelas jauh lebih berguna daripada laporan dua puluh indikator yang sebagian besar tidak punya jawaban sama sekali.",
    },
  ],
  faq: [
    {
      q: "Berapa banyak KPI yang ideal untuk laporan bulanan?",
      a: "Lebih sedikit dari yang kebanyakan perusahaan kira. Lima sampai tujuh indikator, masing-masing dengan pemilik jelas dan ambang tindakan yang pasti, jauh lebih berguna daripada dua puluh indikator yang cuma dilirik sekilas lalu dilupakan. Kalau ada indikator yang tidak pernah dibahas dalam rapat tiga bulan berturut-turut, itu kandidat kuat untuk dicoret dari laporan.",
    },
    {
      q: "Apakah SLA di kontrak harus sama persis dengan KPI internal?",
      a: "Tidak harus sama, dan sering kali memang sebaiknya berbeda. SLA di kontrak adalah komitmen minimum yang membawa konsekuensi komersial, sementara target internal sebaiknya dipasang lebih ketat supaya Anda masih punya ruang gerak sebelum benar-benar menyentuh batas kontrak. Yang harus persis sama hanyalah definisi dan cara menghitungnya. Perbedaan di titik itulah yang biasanya berujung sengketa.",
    },
    {
      q: "Bagaimana cara mengukur kinerja subkontraktor yang tidak punya sistem sendiri?",
      a: "Ukur dari data yang sudah ada di tangan Anda sendiri: waktu POD kembali, jumlah pengiriman ulang, dan keluhan customer per subkontraktor. Ketiga angka ini tercatat otomatis di sisi Anda tanpa butuh apa pun dari mereka, dan itu sudah cukup untuk memisahkan mitra yang bisa diandalkan dari yang tidak.",
    },
    {
      q: "Customer minta laporan dalam format mereka sendiri, apakah harus dituruti?",
      a: "Untuk customer besar, biasanya iya, dan itu memang bagian dari biaya melayani mereka, biaya yang sebaiknya Anda hitung dan masukkan ke analisis margin per job. Yang wajib dijaga ketat: angka yang dikirim dalam format mereka harus berasal dari sumber data yang sama persis dengan laporan internal Anda. Menyusun ulang laporan secara manual untuk tiap customer adalah cara paling cepat menghasilkan dua angka berbeda untuk satu hal yang sebenarnya sama.",
    },
  ],
  related: ["margin-per-job-forwarder", "wms-3pl-level-bin", "customer-portal-logistik"],
};
