import type { Article } from "./types";

export const article: Article = {
  slug: "memilih-software-logistik-pilot-30-hari",
  layout: "feature",
  title: "Pilot 30 Hari atau Implementasi Sekaligus? Cara Memilih Software Logistik Tanpa Bertaruh",
  metaTitle: "Memilih Software Logistik: Pilot 30 Hari vs Big Bang | CargoGrid OS",
  description:
    "Keputusan membeli sistem logistik adalah keputusan di bawah ketidakpastian. Teori opsi riil dan prinsip falsifikasi memberi cara memilih yang tidak bergantung pada tebakan.",
  keywords: [
    "memilih software logistik",
    "implementasi TMS",
    "pilot project software",
    "evaluasi vendor logistik",
    "proof of concept sistem logistik",
  ],
  category: "sistem",
  publishedAt: "2026-08-03",
  summary:
    "Presentasi vendor dirancang untuk berhasil. Karena itu ia hampir tidak memberi informasi apa pun tentang apa yang akan terjadi di kantor Anda. Tulisan ini soal cara merancang uji coba yang benar benar bisa gagal, dan kenapa itu justru syaratnya.",
  takeaways: [
    "Pilot yang tidak mungkin gagal tidak menghasilkan informasi. Tentukan lebih dulu hasil apa yang akan membuat Anda menolak.",
    "Membeli bertahap adalah cara membeli waktu untuk belajar, dan waktu itu punya nilai yang bisa dihitung.",
    "Biaya yang sudah keluar tidak boleh ikut menentukan keputusan berikutnya, meski secara psikologis paling sulit diabaikan.",
    "Uji pada proses tersibuk, bukan yang paling rapi, karena di situlah sistem akan patah kalau memang akan patah.",
  ],
  blocks: [
    {
      type: "p",
      text: "Setiap demo software logistik berjalan mulus. Datanya bersih, alurnya lurus, dan orang yang mengoperasikan sudah melakukannya ratusan kali. Ini bukan penipuan. Demo memang dirancang begitu, dan vendor mana pun akan melakukan hal yang sama.",
    },
    {
      type: "p",
      text: "Persoalannya, demo yang selalu berhasil tidak memberi Anda informasi. Sesuatu yang hasilnya sudah pasti sebelum dijalankan tidak bisa dipakai untuk membedakan pilihan yang baik dari pilihan yang buruk.",
    },
    {
      type: "h2",
      id: "dasar-falsifikasi",
      text: "Dasar pertama: uji yang berguna adalah uji yang bisa gagal",
    },
    {
      type: "p",
      text: "Karl Popper, dalam pembahasannya tentang metode ilmiah, mengajukan gagasan bahwa yang membedakan klaim yang bermakna dari klaim kosong adalah kemungkinan untuk dibantah. Teori yang cocok dengan semua kemungkinan hasil tidak menjelaskan apa apa, justru karena tidak ada hasil yang bisa membuktikannya salah.",
    },
    {
      type: "p",
      text: "Prinsip yang sama berlaku untuk pilot software. Kalau tidak ada satu pun hasil yang akan membuat Anda membatalkan pembelian, maka pilot itu bukan pengujian. Ia hanya pelatihan berbayar yang keputusannya sudah diambil sejak awal.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Pertanyaan yang menentukan, tanyakan pada diri sendiri lebih dulu",
      body: "Sebelum pilot dimulai, tuliskan: hasil seperti apa yang akan membuat kami memutuskan tidak melanjutkan? Kalau jawabannya sulit dirumuskan, atau kalau setiap kemungkinan buruk sudah punya penjelasan yang memaafkannya, hentikan dulu. Anda belum merancang pengujian. Kriteria ini harus ditulis sebelum data masuk, karena sesudahnya otak kita sangat pandai menyesuaikan standar dengan hasil yang sudah terlihat.",
    },
    {
      type: "h2",
      id: "dasar-opsi-riil",
      text: "Dasar kedua: membeli bertahap adalah membeli hak untuk berubah pikiran",
    },
    {
      type: "p",
      text: "Dalam keuangan, sebuah opsi adalah hak untuk melakukan sesuatu tanpa kewajiban melakukannya. Opsi punya nilai, dan nilainya naik seiring besarnya ketidakpastian. Gagasan ini kemudian dipakai untuk menilai keputusan investasi nyata, bukan cuma instrumen keuangan, dan dikenal sebagai teori opsi riil.",
    },
    {
      type: "p",
      text: "Penerapannya di sini cukup langsung. Implementasi sekaligus mengunci seluruh komitmen di titik ketika pengetahuan Anda paling sedikit. Implementasi bertahap membagi komitmen itu, sehingga sebagian keputusan diambil setelah Anda tahu lebih banyak.",
    },
    {
      type: "table",
      caption: "Dua cara membeli hal yang sama, dengan struktur risiko yang berbeda",
      head: ["", "Sekaligus", "Bertahap"],
      rows: [
        ["Kapan komitmen penuh diambil", "Di awal, saat pengetahuan minimum", "Menyebar, sebagian setelah belajar"],
        ["Biaya kalau ternyata salah", "Seluruh proyek", "Tahap yang sudah berjalan saja"],
        ["Waktu sampai manfaat pertama", "Lama, semua sekaligus", "Cepat, satu proses"],
        ["Beban pada tim", "Tinggi dan bersamaan", "Terbagi"],
        ["Cocok bila", "Proses sudah sangat mapan dan seragam", "Masih ada hal yang belum diketahui"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan baris terakhir. Implementasi sekaligus bukan pilihan yang salah secara mutlak. Ia masuk akal ketika ketidakpastiannya rendah, misalnya saat Anda mengganti sistem lama dengan proses yang sudah berjalan bertahun tahun tanpa perdebatan. Ketika masih banyak yang belum diketahui, nilai opsi untuk berhenti menjadi tinggi, dan itulah yang dibeli oleh pendekatan bertahap.",
    },
    {
      type: "h2",
      id: "merancang-pilot",
      text: "Merancang pilot yang menghasilkan jawaban",
    },
    {
      type: "h3",
      text: "Pilih proses tersibuk, bukan yang paling rapi",
    },
    {
      type: "p",
      text: "Godaan alaminya adalah menguji pada satu cabang kecil yang tenang, dengan tim yang paling kooperatif. Hasilnya akan bagus, dan hasil itu tidak memberi tahu apa apa tentang bagaimana sistem berperilaku saat volume naik.",
    },
    {
      type: "p",
      text: "Kalau tujuan pilot adalah mencari titik patah, jalankan di tempat yang paling mungkin mematahkannya. Cabang tersibuk, rute paling rumit, customer yang paling banyak menuntut. Kalau bertahan di sana, sisanya lebih mudah. Kalau patah, Anda baru saja mengetahuinya dengan biaya satu bulan, bukan satu tahun.",
    },
    {
      type: "h3",
      text: "Tetapkan angka sebelum mulai",
    },
    {
      type: "p",
      text: "Pilot tanpa garis dasar akan dinilai berdasarkan kesan, dan kesan selalu dimenangkan oleh suara yang paling keras. Sebelum hari pertama, catat angka yang relevan dengan masalah yang hendak diselesaikan. Beberapa yang biasanya berguna:",
    },
    {
      type: "ul",
      items: [
        "Waktu rata rata POD kembali ke kantor",
        "Hari dari job selesai sampai invoice terbit",
        "Jumlah pertanyaan status yang masuk per minggu",
        "Waktu respons RFQ pada persentil 90",
        "Jumlah selisih data antara operasional dan finance per bulan",
      ],
    },
    {
      type: "p",
      text: "Ambil dua sampai tiga saja, yang paling dekat dengan alasan Anda mencari sistem. Mengukur sepuluh hal sekaligus terdengar teliti, tapi dalam praktiknya tidak ada yang sempat mengumpulkannya, dan pilot berakhir tanpa data sama sekali.",
    },
    {
      type: "h3",
      text: "Batasi durasi, dan tepati",
    },
    {
      type: "p",
      text: "Tiga puluh hari cukup untuk melewati satu siklus penagihan penuh dan menemui sebagian besar pengecualian yang nyata. Yang penting bukan angka tiga puluhnya, melainkan adanya tanggal berakhir yang tidak bergeser.",
    },
    {
      type: "p",
      text: "Pilot yang diperpanjang berulang kali biasanya bukan pilot yang butuh waktu lebih. Ia pilot yang tidak ada yang berani menyimpulkan hasilnya.",
    },
    {
      type: "h2",
      id: "biaya-tenggelam",
      text: "Jebakan yang paling sulit dihindari: biaya yang sudah terlanjur keluar",
    },
    {
      type: "p",
      text: "Dalam ilmu ekonomi ada prinsip yang mudah dipahami tapi sulit dijalankan: biaya yang sudah dikeluarkan dan tidak bisa ditarik kembali seharusnya tidak memengaruhi keputusan selanjutnya. Yang relevan hanyalah biaya dan manfaat ke depan.",
    },
    {
      type: "p",
      text: "Dalam praktik proyek, prinsip ini nyaris selalu dilanggar. Setelah mengeluarkan uang dan tenaga besar, menghentikan proyek terasa seperti mengakui kesalahan, sehingga argumen yang muncul berbunyi seperti ini: kita sudah investasi banyak, sayang kalau berhenti sekarang.",
    },
    {
      type: "quote",
      text: "Uang yang sudah keluar tidak bisa dibuat berguna dengan cara mengeluarkan lebih banyak lagi.",
    },
    {
      type: "p",
      text: "Cara paling efektif melawannya adalah menuliskan kriteria berhenti sebelum uang pertama keluar, lalu menyerahkan penilaiannya kepada orang yang tidak ikut memutuskan pembelian. Orang yang mengusulkan proyek adalah orang yang paling sulit menilai proyeknya sendiri, dan itu bukan soal integritas, melainkan soal bagaimana manusia bekerja.",
    },
    {
      type: "h2",
      id: "pertanyaan-ke-vendor",
      text: "Pertanyaan ke vendor yang jawabannya benar benar membedakan",
    },
    {
      type: "p",
      text: "Sebagian besar pertanyaan dalam proses pengadaan dijawab sama oleh semua vendor, sehingga tidak membantu memilih. Yang berikut ini cenderung menghasilkan jawaban yang berbeda beda, dan perbedaannya bermakna:",
    },
    {
      type: "ol",
      items: [
        "Kalau kami berhenti berlangganan, dalam format apa data kami bisa dibawa keluar, dan berapa lama prosesnya? Jawaban yang mengambang di sini adalah tanda paling awal dari ketergantungan yang sulit dilepas.",
        "Siapa yang menangani kami setelah masa implementasi selesai, dan berapa lama biasanya sebuah pertanyaan dijawab?",
        "Tunjukkan satu implementasi yang tidak berjalan mulus, dan apa yang Anda ubah setelahnya. Vendor yang mengaku belum pernah gagal sedang mengatakan sesuatu tentang jumlah pelanggannya, atau tentang kejujurannya.",
        "Berapa biaya total di tahun kedua dan ketiga, termasuk penambahan pengguna dan modul? Biaya tahun pertama sering disubsidi dan menyesatkan.",
        "Apa yang tidak bisa dilakukan produk Anda? Jawaban jujur di sini adalah tanda kualitas yang paling baik yang bisa Anda dapatkan dalam proses pengadaan.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Tanda yang layak diwaspadai",
      body: "Vendor yang bersedia menyanggupi setiap permintaan tanpa mempertanyakan apa pun bukan sedang menunjukkan fleksibilitas. Ia sedang menunda percakapan sulit ke fase ketika Anda sudah terikat kontrak. Vendor yang mengatakan sebagian kebutuhan Anda sebaiknya tidak diotomatiskan, atau bahwa produknya tidak cocok untuk satu kasus tertentu, biasanya lebih dapat diandalkan sepanjang kerja sama.",
    },
    {
      type: "h2",
      id: "menyimpulkan-pilot",
      text: "Menyimpulkan pilot: tiga kemungkinan, bukan dua",
    },
    {
      type: "p",
      text: "Kebanyakan orang menyiapkan diri untuk dua hasil, berhasil atau gagal. Dalam praktiknya hampir selalu muncul hasil ketiga, dan hasil ketiga inilah yang paling sering salah ditangani.",
    },
    {
      type: "ul",
      items: [
        "**Berhasil sesuai kriteria.** Lanjutkan ke tahap berikutnya, dan tetapkan kriteria baru untuk tahap itu.",
        "**Gagal sesuai kriteria.** Hentikan. Biaya yang sudah keluar adalah harga dari informasi yang baru saja Anda peroleh, dan informasi itu murah dibanding komitmen penuh yang berhasil dihindari.",
        "**Tidak jelas, karena datanya tidak terkumpul atau tim tidak sempat memakai.** Ini bukan hasil netral. Ini kegagalan pada rancangan pilotnya, dan menjalankannya lagi dengan cara yang sama akan menghasilkan ketidakjelasan yang sama.",
      ],
    },
    {
      type: "p",
      text: "Kemungkinan ketiga adalah yang paling sering terjadi, dan paling sering ditafsirkan sebagai hasil yang cukup baik untuk melanjutkan. Padahal ia memberi tahu Anda satu hal yang penting: pada kondisi kerja yang sesungguhnya, tim tidak punya kapasitas untuk mengadopsi sistem sambil menjalankan operasional. Masalah itu tidak akan hilang dengan sendirinya pada tahap berikutnya, yang cakupannya lebih besar.",
    },
  ],
  faq: [
    {
      q: "Apakah pilot sebaiknya berbayar atau gratis?",
      a: "Pilot berbayar cenderung ditanggapi lebih serius oleh kedua pihak, dan itu justru menguntungkan Anda. Yang lebih menentukan daripada bayar atau tidak adalah kejelasan tertulis tentang apa yang terjadi bila pilot dinyatakan tidak berhasil: siapa yang menanggung apa, data dikembalikan bagaimana, dan apakah ada kewajiban yang tersisa.",
    },
    {
      q: "Berapa banyak pengguna yang sebaiknya dilibatkan dalam pilot?",
      a: "Cukup untuk mencakup semua peran yang akan memakai sistem, tetapi tidak lebih. Kalau alur kerjanya melibatkan sales, operasional, dan finance, ketiganya harus ada, karena masalah terbesar biasanya justru muncul di perpindahan antar peran, bukan di dalam satu peran.",
    },
    {
      q: "Bagaimana kalau tim menolak sistem baru selama pilot?",
      a: "Bedakan dua jenis penolakan. Keluhan yang menunjuk hal spesifik, misalnya sistem tidak bisa menangani kasus tertentu, adalah temuan berharga dan justru alasan pilot dijalankan. Penolakan umum tanpa isi biasanya menandakan tujuan perubahan belum dijelaskan dengan cara yang menjawab pertanyaan mendasar setiap orang: apa yang berubah bagi pekerjaan saya.",
    },
    {
      q: "Apakah perlu membandingkan beberapa vendor lewat pilot sekaligus?",
      a: "Menjalankan dua pilot secara bersamaan membagi perhatian tim dan biasanya menghasilkan dua pengujian yang sama sama tidak terurus. Lebih baik menyaring di tahap sebelumnya melalui demo dan percakapan, lalu menjalankan pilot sungguhan untuk satu kandidat terkuat, dengan kriteria berhenti yang jelas sehingga Anda tetap bisa mundur.",
    },
  ],
  related: ["kapan-excel-berhenti-cukup", "integrasi-erp-akuntansi-logistik", "adopsi-aplikasi-driver"],
};
