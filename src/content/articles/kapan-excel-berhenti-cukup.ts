import type { Article } from "./types";

export const article: Article = {
  slug: "kapan-excel-berhenti-cukup",
  layout: "essay",
  format: "Catatan Lapangan",
  title: "Excel Berhenti Membantu Bukan Karena Ukurannya, Tapi Karena Frekuensi Masalahnya",
  metaTitle: "Kapan Excel Tidak Lagi Cukup untuk Operasional Logistik",
  description:
    "Excel tetap alat yang baik untuk operasional logistik sampai titik tertentu, dan titik itu ditentukan oleh frekuensi masalah, bukan ukuran filenya. Catatan lapangan ini merangkum pola-pola yang biasa terlihat berulang, plus lima frekuensi konkret yang bisa dihitung sendiri sebelum menelepon vendor mana pun.",
  keywords: [
    "excel untuk logistik",
    "kapan ganti sistem TMS",
    "spreadsheet operasional logistik",
    "tanda perlu sistem logistik",
    "digitalisasi perusahaan logistik",
  ],
  category: "sistem",
  publishedAt: "2026-07-23",
  updatedAt: "2026-08-06",
  summary:
    "Nasihat 'tinggalkan Excel' nyaris selalu datang dari pihak yang berkepentingan menjual penggantinya, dan saya termasuk di dalamnya. Catatan ini bukan daftar tanda yang tinggal dicentang, melainkan pola-pola yang saya lihat berulang di lapangan, plus cara menghitung sendiri seberapa sering masalah itu benar-benar terjadi di tim Anda.",
  takeaways: [
    "Titik patah Excel ditentukan oleh berapa banyak orang perlu melihat data yang sama pada waktu bersamaan, bukan oleh besar-kecilnya volume shipment yang Anda tangani.",
    "Tanda paling jelas biasanya ada di depan mata: satu file yang cuma berani disentuh oleh orang yang membuatnya, sementara semua orang lain memakainya setiap hari.",
    "Excel jarang gagal karena lambat. Ia gagal karena tak sanggup menjawab siapa mengubah data ini, kapan, dan atas alasan apa.",
    "Menghitung frekuensi konflik versi, entri ulang manual, pengguna bersamaan, celah jejak audit, dan tingkat pengecualian jauh lebih berguna daripada menunggu firasat manajemen.",
    "Kalau akar masalahnya adalah proses yang belum disepakati bersama, sistem apa pun cuma akan mempercepat laju kekacauan yang sama.",
  ],
  blocks: [
    {
      type: "p",
      text: "Saya sudah kehilangan hitungan berapa kali klien bertanya kapan waktunya berhenti pakai Excel, dan sebelum menjawab, saya biasanya membela Excel dulu. Nasihat untuk meninggalkannya nyaris selalu datang dari pihak yang punya kepentingan menjual penggantinya, dan saya mengakui itu termasuk perusahaan seperti kami sendiri.",
    },
    {
      type: "p",
      text: "Excel itu fleksibel, murah, dan sudah dikuasai semua orang tanpa pelatihan khusus. Tidak perlu persetujuan IT, dan bentuknya bisa berubah dalam lima menit begitu proses kerja berubah. Untuk perusahaan yang prosesnya masih terus mencari bentuk, kelenturan semacam ini justru jadi keunggulan yang tidak dimiliki sistem mana pun.",
    },
    {
      type: "p",
      text: "Masalahnya cuma satu: Excel dibangun di atas asumsi diam-diam bahwa satu orang membuka satu file pada satu waktu. Selama asumsi itu masih berlaku, Excel unggul di hampir segala lini. Begitu jumlah orang yang membuka file yang sama mulai bertambah, kekuatan itu berbalik arah dan berubah jadi beban.",
    },
    {
      type: "h2",
      id: "dasar-biaya-koordinasi",
      text: "Dasar masalahnya: biaya koordinasi tumbuh lebih cepat daripada jumlah orangnya",
    },
    {
      type: "p",
      text: "Manajemen proyek sudah lama mengenal satu rumus untuk menjelaskan ini: jumlah jalur komunikasi antaranggota tim mengikuti n dikali n dikurang satu, dibagi dua. Tiga orang berarti tiga jalur komunikasi. Enam orang melonjak jadi lima belas jalur. Sepuluh orang sudah empat puluh lima jalur. Jumlah orangnya bertambah lurus, tapi kebutuhan koordinasinya membengkak jauh lebih cepat, sebab setiap orang baru harus terhubung dengan semua orang yang sudah ada di dalamnya.",
    },
    {
      type: "p",
      text: "Spreadsheet bekerja sangat baik selama jalur komunikasi itu masih sedikit. Kelemahannya muncul lewat sesuatu yang di dunia basis data disebut lost update: dua orang membuka data yang sama, lalu perubahan salah satunya menimpa perubahan yang lain tanpa ada yang sadar itu terjadi. Kombinasi dua hal inilah, jalur koordinasi yang melonjak dan risiko lost update, yang menentukan titik patah Excel: seberapa banyak orang perlu melihat kebenaran yang sama, bukan seberapa banyak baris di dalam filenya.",
    },
    {
      type: "h2",
      id: "bukan-soal-jumlah-shipment",
      text: "Ukuran yang keliru: jumlah shipment per bulan",
    },
    {
      type: "p",
      text: "Pertanyaan yang paling sering saya dengar dari klien kira-kira begini: \"Berapa shipment per bulan sebelum kami harus ganti sistem?\" Pertanyaan itu jarang membantu. Yang menentukan adalah berapa banyak orang harus mengakses data yang sama secara bersamaan, dan itu jarang berkorelasi rapi dengan jumlah shipment.",
    },
    {
      type: "p",
      text: "Ada perusahaan trucking dengan 800 pengiriman sebulan, semuanya diurus oleh dua orang yang duduk berhadapan di ruangan yang sama. Spreadsheet mereka berjalan mulus tanpa drama. Bandingkan dengan forwarder yang cuma menangani 120 shipment sebulan, tapi melibatkan sales, pricing, operasional, dokumen, gudang, dan finance yang tersebar di tiga lokasi berbeda. Spreadsheet yang persis sama akan membuat tim ini megap-megap setiap hari.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Ukuran yang saya pakai: berapa orang butuh kebenaran yang sama",
      body: "Hitung dulu berapa peran berbeda yang perlu melihat atau mengubah data job yang sama dalam satu hari kerja. Pada angka dua sampai tiga orang, spreadsheet bersama biasanya masih sehat-sehat saja. Begitu masuk ke angka lima ke atas, Anda kemungkinan besar sudah membayar biaya koordinasi yang jauh lebih besar daripada lisensi sistem semahal apa pun, hanya saja tagihannya datang dalam bentuk jam kerja yang hilang, bukan invoice.",
    },
    {
      type: "h2",
      id: "pola-pola-berulang",
      text: "Pola-pola yang saya lihat berulang di lapangan",
    },
    {
      type: "p",
      text: "Ini bukan daftar enam ciri yang harus dicentang satu-satu. Ini pola-pola yang menurut pengamatan saya cenderung muncul berbarengan begitu titik patah itu terlewati, dan begitu satu pola muncul, biasanya ada satu atau dua pola lain yang mengikuti tak lama sesudahnya.",
    },
    {
      type: "h3",
      text: "File yang tidak berani disentuh siapa pun",
    },
    {
      type: "p",
      text: "Setiap perusahaan yang cukup lama memakai spreadsheet akhirnya melahirkan satu file legendaris. Namanya biasanya sesuatu seperti \"MASTER FINAL revisi3 fix.xlsx\", penuh rumus bertingkat yang cuma dipahami orang yang menyusunnya dari awal. Semua orang memakainya setiap hari, tapi tidak ada yang berani mengubah strukturnya. Pada titik ini, file itu bukan sekadar spreadsheet lagi. Ia sudah berubah jadi aplikasi tanpa dokumentasi dan tanpa cadangan, dengan satu-satunya orang yang memahami isinya bisa saja resign kapan pun.",
    },
    {
      type: "h3",
      text: "Pertanyaan sederhana yang makan waktu lama",
    },
    {
      type: "p",
      text: "Berapa job yang belum ditagih bulan ini? Kalau menjawab pertanyaan sesederhana itu perlu menggabungkan tiga file berbeda lalu memeriksanya satu per satu, itu tandanya data Anda memang tersimpan tapi susah ditanyai. Menyimpan data, ternyata, jauh lebih gampang daripada menjawab pertanyaan tentang data itu sendiri.",
    },
    {
      type: "h3",
      text: "Angka yang sama, beda di dua tempat",
    },
    {
      type: "p",
      text: "Operasional mencatat ada 143 job bulan ini. Finance mencatat 138. Masing-masing punya filenya sendiri, dan masing-masing yakin angkanya yang benar. Rapat berikutnya pun habis untuk mencari selisih lima job itu, sementara keputusan yang perlu diambil malah tertunda. Gejala inilah yang menurut saya paling mahal harganya, sebab ia menggerogoti kepercayaan orang terhadap data itu sendiri. Setelah beberapa kali kejadian serupa, orang pelan-pelan berhenti memakai angka untuk mengambil keputusan dan kembali mengandalkan firasat, sesuatu yang jauh lebih sulit diaudit belakangan.",
    },
    {
      type: "h3",
      text: "Tidak ada yang bisa menjawab siapa mengubah apa",
    },
    {
      type: "p",
      text: "Harga di quotation berubah sendiri. Status job mundur tanpa penjelasan. Nomor kontainer terkoreksi diam-diam. Siapa yang mengubahnya, kapan, dan atas dasar apa? Di spreadsheet biasa, jawabannya nyaris selalu sama: tidak ada yang tahu, kecuali kebetulan ada yang menyimpan salinan versi lamanya. Selama semuanya berjalan lancar, hilangnya jejak audit ini nyaris tak terasa. Ia baru terasa menyakitkan justru saat muncul sengketa dengan customer atau dugaan kecurangan internal, persis di momen jawaban itu paling dibutuhkan.",
    },
    {
      type: "h3",
      text: "Pekerjaan berhenti total kalau satu orang izin",
    },
    {
      type: "p",
      text: "Kalau cuti seorang staf administrasi berarti tidak ada yang sanggup menerbitkan invoice minggu itu, yang terjadi adalah satu orang menyimpan proses itu sendirian di kepalanya. Begitu dia absen, prosesnya ikut absen. Spreadsheet membuat kerapuhan seperti ini bisa bertahan lama tanpa ketahuan, sebab di atas kertas semuanya tetap terlihat terdokumentasi rapi.",
    },
    {
      type: "h3",
      text: "Customer menanyakan hal yang mestinya bisa mereka lihat sendiri",
    },
    {
      type: "p",
      text: "Tiap kali customer bertanya \"barang saya sudah sampai mana\", itu pekerjaan tambahan yang lahir karena data Anda tidak bisa dibagikan dengan aman. Spreadsheet tidak mengenal konsep \"customer ini cuma boleh melihat baris ini saja\". Satu-satunya cara berbagi adalah menyalin datanya, dan begitu disalin, data itu langsung kedaluwarsa.",
    },
    {
      type: "h2",
      id: "alasan-yang-bukan-alasan",
      text: "Alasan yang sering saya dengar, tapi jarang cukup berdiri sendiri",
    },
    {
      type: "p",
      text: "Alasan pertama yang paling sering muncul begini: \"File-nya sudah berat dan lambat.\" Ini murni soal teknis, dan biasanya selesai dengan memecah file atau merapikan rumusnya. Belum cukup jadi alasan untuk ganti sistem, sebab masalahnya bukan di titik patah yang saya jelaskan di atas, melainkan di kerapian filenya sendiri.",
    },
    {
      type: "p",
      text: "Ada juga alasan yang terdengar meyakinkan tapi sering kosong isinya: \"Kompetitor sudah pakai sistem.\" Bisa jadi benar, tapi bisa juga mereka baru saja membeli sesuatu yang ujung-ujungnya menganggur. Kabar itu sendiri tidak membuktikan apa-apa soal kebutuhan Anda.",
    },
    {
      type: "p",
      text: "Alasan ketiga biasanya muncul menjelang musim tender: \"Kami mau kelihatan lebih profesional di depan calon klien.\" Alasan ini sah secara komersial, tapi sebaiknya dipisahkan dari alasan operasional. Kalau motivasinya memang ini, yang Anda perlukan mungkin cukup customer portal saja, bukan mengganti sistem operasional dari nol.",
    },
    {
      type: "h2",
      id: "diagnostik-frekuensi",
      text: "Lima frekuensi yang saya pakai untuk mengecek diri sendiri",
    },
    {
      type: "p",
      text: "Kalau pola-pola di atas terasa terlalu kualitatif untuk dijadikan keputusan, ada cara yang lebih konkret: hitung seberapa sering lima hal berikut terjadi dalam sebulan terakhir. Ambang di kolom terakhir bukan hasil riset formal, hanya ancang-ancang yang saya pakai sendiri saat berbicara dengan klien, jadi sesuaikan dengan konteks tim Anda.",
    },
    {
      type: "table",
      caption: "Lima frekuensi yang saya cek sebagai kebiasaan bulanan, bukan hitungan sekali jalan",
      head: ["Yang dihitung", "Pertanyaan yang saya ajukan", "Kapan saya mulai curiga"],
      rows: [
        [
          "Frekuensi konflik versi",
          "Berapa kali sebulan dua orang mengedit file yang sama dan salah satu perubahan hilang tanpa ada yang sadar?",
          "Lebih dari sekali seminggu, bukan lagi kejadian sial yang jarang terjadi",
        ],
        [
          "Entri ulang manual",
          "Berapa kali angka yang sama diketik ulang dari satu file ke file lain dalam satu siklus job?",
          "Setiap kali data berpindah tangan lebih dari dua kali secara manual, peluang salah ketik ikut berlipat",
        ],
        [
          "Pengguna bersamaan",
          "Berapa orang membuka file kerja yang sama dalam rentang satu jam kerja yang sibuk?",
          "Lima orang ke atas, sesuai ambang koordinasi yang saya sebut di bagian awal",
        ],
        [
          "Celah jejak audit",
          "Kalau customer atau auditor menanyakan siapa mengubah satu angka, berapa lama untuk menjawabnya dengan pasti?",
          "Kalau jawabannya butuh menelusuri riwayat chat atau bertanya keliling ke tim, itu sudah celah",
        ],
        [
          "Tingkat pengecualian",
          "Dari semua job bulan ini, berapa persen yang ditangani di luar alur standar spreadsheet, dikoreksi belakangan, atau dikerjakan manual di luar filenya?",
          "Kalau porsinya sudah lebih dari satu dari sepuluh job, kemungkinan besar templatenya sendiri yang keliru, bukan orang yang mengisinya",
        ],
      ],
    },
    {
      type: "p",
      text: "Saya tidak mengklaim angka-angka ambang ini berlaku sama persis untuk semua jenis operasional logistik. Tujuannya cuma mengubah pertanyaan dari \"apakah sudah waktunya?\", yang gampang dijawab dengan firasat, jadi pertanyaan yang bisa dihitung dari catatan minggu lalu.",
    },
    {
      type: "h2",
      id: "yang-harus-diperbaiki-lebih-dulu",
      text: "Satu hal yang wajib beres sebelum sistem apa pun dibeli",
    },
    {
      type: "p",
      text: "Satu kondisi bisa membuat penggantian sistem gagal pada kebanyakan kasus: prosesnya sendiri belum pernah disepakati bersama.",
    },
    {
      type: "p",
      text: "Bayangkan tiga orang di tim Anda menyimpan tiga definisi berbeda tentang kapan sebuah job dianggap \"selesai\". Spreadsheet akan menampung ketiganya diam-diam, sebab masing-masing orang cukup mengisi kolomnya sendiri sesuai definisi masing-masing. Sistem baru tidak akan setoleran itu. Ia memaksa satu definisi tunggal, dan pada hari pemaksaan itu terjadi, rasanya seolah-olah sistemnyalah yang bermasalah.",
    },
    {
      type: "quote",
      text: "Spreadsheet menyembunyikan ketidaksepakatan yang selama ini ada. Sistem baru justru membongkarnya keras-keras di minggu pertama.",
    },
    {
      type: "p",
      text: "Inilah kenapa banyak implementasi kandas di bulan kedua, dengan kesimpulan gampang: \"sistemnya tidak cocok dengan proses kami\". Yang terjadi, proses tunggal itu memang belum pernah ada sejak awal, dan sistem barulah pihak pertama yang berani menuntut kejelasannya.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Uji satu jam sebelum menelepon vendor mana pun",
      body: "Kumpulkan empat orang dari peran berbeda, lalu minta masing-masing menuliskan sendiri, tanpa berdiskusi dulu, tahapan status sebuah job dari masuk sampai tertagih. Bandingkan keempat daftar itu. Kalau hasilnya ternyata berbeda-beda, pekerjaan Anda berikutnya adalah menyepakati satu daftar tunggal, sebelum mencari software apa pun. Sistem yang dibeli sebelum kesepakatan itu terbentuk cuma akan memindahkan arena perselisihan yang sama, lengkap dengan tagihan bulanan.",
    },
    {
      type: "h2",
      id: "jalan-tengah",
      text: "Jalan tengah yang sering terlewatkan",
    },
    {
      type: "p",
      text: "Pilihannya lebih luas daripada sekadar bertahan di spreadsheet atau pindah total ke sistem penuh. Sebagian besar perusahaan justru meraih manfaat terbesar dengan memindahkan satu proses saja, biasanya proses yang paling banyak melibatkan pihak dari luar perusahaan.",
    },
    {
      type: "p",
      text: "Kandidat yang paling sering memberi hasil cepat adalah bukti pengiriman (POD) dan status job, sebab keduanya melibatkan pihak yang memang mustahil diberi akses ke spreadsheet internal Anda: driver di jalan dan customer di kantornya sendiri. Sisanya seperti perencanaan, tarif, dan analisis bisa bertahan di Excel jauh lebih lama daripada yang biasanya diduga orang.",
    },
    {
      type: "p",
      text: "Pendekatan bertahap seperti ini punya satu keuntungan yang jarang dibicarakan: kalau ternyata dugaan Anda soal letak masalah keliru, kerugiannya kecil dan langkahnya masih bisa dibatalkan. Penggantian menyeluruh sekaligus tidak pernah menawarkan kemewahan semacam itu.",
    },
  ],
  faq: [
    {
      q: "Apakah pindah ke Google Sheets saja sudah cukup?",
      a: "Sebagian saja. Google Sheets menghilangkan drama 'file mana yang paling baru' dan menyediakan riwayat versi, yang menjawab satu-dua pola di atas. Yang masih belum ada: hak akses per baris, validasi yang benar-benar mengikat, dan cara aman membagikan sebagian data ke pihak luar. Untuk banyak tim, ini langkah antara yang masuk akal sebelum memikirkan sistem sungguhan.",
    },
    {
      q: "Tim saya menolak pindah dari Excel, bagaimana menghadapinya?",
      a: "Saya biasanya dengarkan dulu keberatannya, sebab penolakan dari orang operasional sering benar secara teknis. Keluhan seperti \"sistem tidak bisa menangani kasus X\" biasanya menunjuk pengecualian nyata yang belum terakomodasi. Perlakukan itu sebagai daftar persyaratan yang masih perlu dilengkapi, bukan resistensi yang harus dipatahkan.",
    },
    {
      q: "Berapa lama biasanya migrasi dari spreadsheet ke sistem makan waktu?",
      a: "Memindahkan datanya sendiri biasanya cuma perkara hari, bukan minggu. Yang lambat adalah menyepakati proses dan membiasakan tim memakainya sehari-hari. Saya sarankan menetapkan tanggal berhenti untuk Excel sejak awal dan memegangnya, sebab dua sistem yang dibiarkan berjalan berdampingan tanpa batas waktu biasanya berujung orang kembali ke cara lama begitu pekerjaan menumpuk.",
    },
  ],
  cta: {
    title: "Kalau titik itu sudah lewat, mulai dari satu proses dulu",
    body: "Jangan langsung mengganti semuanya sekaligus. Bagian jalan tengah di atas menyarankan mulai dari proses yang paling banyak melibatkan pihak luar, seperti POD dan status job, lalu diuji lewat pilot singkat sebelum diperluas ke bagian lain. Berikut cara menjalankan pilot 30 hari untuk satu proses sebelum menelepon vendor mana pun.",
    linkHref: "/artikel/memilih-software-logistik-pilot-30-hari",
    linkLabel: "Baca cara menjalankan pilot 30 hari",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Ditulis dari percakapan berulang dengan tim operasional forwarder dan trucking yang sedang menimbang pindah dari spreadsheet ke sistem, bukan dari satu studi kasus tunggal.",
  },
  related: ["memilih-software-logistik-pilot-30-hari", "grup-whatsapp-sistem-operasional-bayangan", "integrasi-erp-akuntansi-logistik"],
};
