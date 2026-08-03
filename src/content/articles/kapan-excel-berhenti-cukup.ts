import type { Article } from "./types";

export const article: Article = {
  slug: "kapan-excel-berhenti-cukup",
  title: "Kapan Excel Berhenti Cukup untuk Operasional Logistik: Tanda-tanda yang Sering Diabaikan",
  metaTitle: "Kapan Excel Tidak Lagi Cukup untuk Operasional Logistik | CargoGrid OS",
  description:
    "Excel bukan pilihan yang salah; ia hanya punya titik di mana biayanya berbalik. Enam tanda konkret bahwa spreadsheet Anda sudah melewati titik itu, dan tiga tanda palsu.",
  keywords: [
    "excel untuk logistik",
    "kapan ganti sistem TMS",
    "spreadsheet operasional logistik",
    "digitalisasi perusahaan logistik",
    "sistem manajemen transportasi",
  ],
  category: "sistem",
  publishedAt: "2026-08-03",
  summary:
    "Nasihat 'tinggalkan Excel' biasanya datang dari orang yang menjual penggantinya. Kenyataannya Excel adalah alat yang sangat baik sampai titik tertentu. Tulisan ini soal cara mengenali titik itu, dengan tanda yang bisa diperiksa, bukan perasaan.",
  takeaways: [
    "Jumlah shipment bukan penentu. Yang menentukan adalah berapa banyak orang yang perlu melihat data yang sama pada saat bersamaan.",
    "Tanda paling jelas: ada satu file yang tidak berani diedit siapa pun kecuali pembuatnya.",
    "Excel gagal bukan karena lambat, tapi karena tidak bisa menjawab 'siapa mengubah ini, kapan, dan kenapa'.",
    "Kalau masalah Anda adalah proses yang belum disepakati, sistem apa pun hanya akan mempercepat kekacauan yang sama.",
  ],
  blocks: [
    {
      type: "p",
      text: "Saya ingin mulai dengan membela Excel, karena nasihat untuk meninggalkannya hampir selalu datang dari pihak yang menjual penggantinya, termasuk, harus saya akui, dari perusahaan seperti kami.",
    },
    {
      type: "p",
      text: "Excel fleksibel, murah, dan sudah dikuasai semua orang. Ia tidak butuh pelatihan, tidak butuh persetujuan IT, dan bisa berubah bentuk dalam lima menit ketika proses berubah. Untuk perusahaan yang prosesnya masih bergerak, itu bukan kekurangan, itu keunggulan yang tidak dimiliki sistem mana pun.",
    },
    {
      type: "p",
      text: "Tapi Excel punya satu asumsi yang tertanam dalam desainnya: bahwa satu orang membuka satu file pada satu waktu. Selama asumsi itu benar, Excel unggul. Ketika asumsi itu tidak lagi benar, semua kekuatannya berbalik jadi beban.",
    },
    {
      type: "h2",
      id: "bukan-soal-jumlah-shipment",
      text: "Yang menentukan bukan jumlah shipment",
    },
    {
      type: "p",
      text: "Pertanyaan yang paling sering saya dengar: \"Berapa shipment per bulan sebelum harus ganti sistem?\" Pertanyaan ini tidak punya jawaban yang berguna, karena bukan volume yang mematahkan Excel.",
    },
    {
      type: "p",
      text: "Perusahaan trucking dengan 800 pengiriman sebulan yang semuanya diurus dua orang di satu ruangan bisa berjalan baik dengan spreadsheet. Forwarder dengan 120 shipment sebulan yang melibatkan sales, pricing, operasional, dokumen, gudang, dan finance di tiga lokasi akan tersiksa dengan spreadsheet yang sama.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Ukuran yang benar: berapa orang yang butuh kebenaran yang sama",
      body: "Hitung berapa peran berbeda yang perlu melihat atau mengubah data job yang sama dalam satu hari kerja. Di angka dua sampai tiga, spreadsheet bersama masih sehat. Di angka lima ke atas, Anda sudah membayar biaya koordinasi yang jauh lebih besar daripada biaya lisensi sistem apa pun, hanya saja biaya itu dibayar dalam bentuk waktu, bukan tagihan.",
    },
    {
      type: "h2",
      id: "enam-tanda-nyata",
      text: "Enam tanda bahwa titik itu sudah lewat",
    },
    {
      type: "h3",
      text: "1. Ada file yang tidak berani disentuh siapa pun",
    },
    {
      type: "p",
      text: "Setiap perusahaan yang lama memakai spreadsheet akhirnya punya satu file legendaris, biasanya bernama semacam \"MASTER FINAL revisi3 fix.xlsx\", yang berisi rumus bertingkat yang hanya dipahami pembuatnya. Semua orang memakainya. Tidak ada yang berani mengubah strukturnya.",
    },
    {
      type: "p",
      text: "File itu sudah bukan spreadsheet lagi; ia aplikasi tanpa dokumentasi, tanpa cadangan, dan dengan satu-satunya pengembang yang suatu saat akan resign. Ini bukan risiko teknologi, ini risiko kelangsungan usaha.",
    },
    {
      type: "h3",
      text: "2. Pertanyaan sederhana butuh waktu lebih dari lima menit",
    },
    {
      type: "p",
      text: "\"Berapa job yang belum ditagih bulan ini?\" Kalau menjawabnya memerlukan seseorang menggabungkan tiga file dan memeriksa satu per satu, artinya data Anda sudah ada tapi tidak bisa ditanyai. Menyimpan bukan masalah Anda; menjawab yang jadi masalah.",
    },
    {
      type: "h3",
      text: "3. Angka yang sama berbeda di dua tempat",
    },
    {
      type: "p",
      text: "Operasional bilang 143 job bulan ini, finance bilang 138. Keduanya punya file, keduanya yakin. Rapat berikutnya habis untuk mencari selisihnya, bukan untuk memutuskan apa pun.",
    },
    {
      type: "p",
      text: "Ini gejala paling mahal, karena ia menggerogoti kepercayaan pada data secara umum. Setelah beberapa kali, orang berhenti memakai angka dalam pengambilan keputusan dan kembali memakai firasat.",
    },
    {
      type: "h3",
      text: "4. Tidak ada yang bisa menjawab siapa mengubah apa",
    },
    {
      type: "p",
      text: "Harga di quotation berubah. Status job mundur. Nomor kontainer terkoreksi. Siapa yang mengubah, kapan, dan atas dasar apa? Di spreadsheet, jawabannya tidak ada, kecuali ada yang kebetulan menyimpan salinan versi lama.",
    },
    {
      type: "p",
      text: "Selama semuanya berjalan lancar, ini tidak terasa. Ia baru terasa saat ada sengketa dengan customer atau dugaan kecurangan internal, yaitu tepat ketika Anda paling membutuhkannya.",
    },
    {
      type: "h3",
      text: "5. Pekerjaan berhenti kalau satu orang tidak masuk",
    },
    {
      type: "p",
      text: "Kalau cuti seorang staf administrasi berarti tidak ada yang bisa menerbitkan invoice minggu itu, yang Anda punya bukan proses, melainkan seseorang yang menghafal proses. Spreadsheet memungkinkan kondisi ini bertahan lama tanpa terlihat, karena secara kasat mata semuanya terdokumentasi.",
    },
    {
      type: "h3",
      text: "6. Customer bertanya hal yang seharusnya bisa mereka lihat sendiri",
    },
    {
      type: "p",
      text: "Setiap pertanyaan \"barang saya sampai mana\" adalah pekerjaan yang muncul karena data Anda tidak bisa dibagikan secara aman. Spreadsheet tidak punya konsep \"customer ini boleh melihat baris ini saja\". Satu-satunya cara berbagi adalah menyalin, dan salinan langsung usang begitu dibuat.",
    },
    {
      type: "h2",
      id: "tiga-tanda-palsu",
      text: "Tiga tanda palsu yang sering dipakai membenarkan pembelian",
    },
    {
      type: "ul",
      items: [
        "**\"File-nya sudah berat dan lambat.\"** Ini masalah teknis yang bisa diselesaikan dengan memecah file atau membersihkan rumus. Bukan alasan mengganti sistem.",
        "**\"Kompetitor sudah pakai sistem.\"** Mungkin benar, mungkin juga mereka membeli sesuatu yang tidak dipakai. Ini bukan bukti kebutuhan Anda.",
        "**\"Kami mau kelihatan lebih profesional saat tender.\"** Alasan yang sah secara komersial, tapi jangan tertukar dengan alasan operasional, karena kalau itu motivasinya, yang Anda butuhkan mungkin hanya customer portal, bukan penggantian seluruh sistem.",
      ],
    },
    {
      type: "h2",
      id: "yang-harus-diperbaiki-lebih-dulu",
      text: "Satu hal yang harus diperbaiki sebelum sistem apa pun",
    },
    {
      type: "p",
      text: "Ada satu kondisi di mana mengganti sistem hampir pasti gagal: ketika prosesnya sendiri belum disepakati.",
    },
    {
      type: "p",
      text: "Kalau tiga orang di tim Anda punya tiga definisi berbeda tentang kapan sebuah job dianggap \"selesai\", spreadsheet akan mengakomodasi ketiganya secara diam-diam, masing-masing mengisi kolomnya sendiri. Sistem tidak akan seakomodatif itu. Ia memaksa satu definisi, dan hari ketika pemaksaan itu terjadi akan terasa seperti sistemnya yang bermasalah.",
    },
    {
      type: "quote",
      text: "Spreadsheet menyembunyikan ketidaksepakatan. Sistem membuatnya bersuara keras di minggu pertama.",
    },
    {
      type: "p",
      text: "Ini sebabnya banyak implementasi kandas di bulan kedua dengan kesimpulan \"sistemnya tidak cocok dengan proses kami\". Yang sebenarnya terjadi: proses itu tidak pernah ada dalam bentuk tunggal, dan sistem hanya jadi pihak pertama yang menuntut kejelasan.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Uji satu jam yang layak dilakukan sebelum menghubungi vendor mana pun",
      body: "Kumpulkan empat orang dari peran berbeda. Minta masing-masing menuliskan, tanpa berdiskusi, tahapan status sebuah job dari masuk sampai tertagih. Bandingkan hasilnya. Kalau keempat daftar itu berbeda, pekerjaan Anda yang berikutnya bukan mencari software, melainkan menyepakati satu daftar. Sistem yang dibeli sebelum kesepakatan itu ada akan menjadi tempat perselisihan yang sama, hanya dengan tagihan bulanan.",
    },
    {
      type: "h2",
      id: "jalan-tengah",
      text: "Jalan tengah yang sering terlewat",
    },
    {
      type: "p",
      text: "Pilihannya bukan hanya antara spreadsheet dan sistem penuh. Sebagian besar perusahaan mendapat manfaat terbesar dari memindahkan satu proses saja, biasanya yang paling banyak melibatkan orang luar.",
    },
    {
      type: "p",
      text: "Kandidat yang paling sering memberi hasil cepat adalah bukti pengiriman dan status job, karena keduanya melibatkan pihak yang tidak bisa Anda beri akses ke spreadsheet: driver dan customer. Sisanya (perencanaan, tarif, analisis) bisa tetap di Excel lebih lama daripada yang biasanya diperkirakan orang.",
    },
    {
      type: "p",
      text: "Pendekatan bertahap ini juga punya keuntungan yang jarang dibicarakan: kalau ternyata Anda salah menduga di mana masalahnya, kerugiannya kecil dan bisa dibatalkan. Penggantian menyeluruh tidak memberi Anda kemewahan itu.",
    },
  ],
  faq: [
    {
      q: "Apakah Google Sheets menyelesaikan masalah kolaborasi Excel?",
      a: "Sebagian. Ia menghapus masalah 'file mana yang terbaru' dan memberi riwayat versi, yang sudah menjawab dua dari enam tanda di atas. Yang tetap tidak ada: hak akses per baris, validasi yang benar-benar memaksa, dan kemampuan membagikan sebagian data ke pihak luar dengan aman. Untuk banyak perusahaan, pindah ke Sheets adalah langkah berikutnya yang tepat sebelum memikirkan sistem.",
    },
    {
      q: "Berapa lama biasanya migrasi dari spreadsheet ke sistem?",
      a: "Bagian teknis memindahkan data biasanya paling cepat. Yang menentukan durasi adalah menyepakati proses dan membiasakan tim. Rencanakan periode paralel dengan tanggal berhenti yang diumumkan jelas, menjalankan keduanya tanpa batas waktu adalah pola kegagalan yang paling sering terjadi, karena orang selalu kembali ke yang sudah dikuasai saat sedang sibuk.",
    },
    {
      q: "Apakah data historis di Excel perlu dipindahkan semua?",
      a: "Biasanya tidak, dan memaksakannya sering memperlambat proyek tanpa manfaat sepadan. Pindahkan data induk yang masih dipakai (customer, vendor, tarif berlaku) plus transaksi berjalan. Arsip lama cukup disimpan apa adanya sebagai berkas rujukan; ia jarang dibuka, dan ketika dibuka, formatnya tidak jadi soal.",
    },
    {
      q: "Tim kami menolak pindah dari Excel. Bagaimana menghadapinya?",
      a: "Dengarkan dulu isinya, karena penolakan operasional sering kali benar secara teknis. Keluhan seperti 'sistem tidak bisa menangani kasus X' biasanya menunjuk pada pengecualian nyata yang memang belum terakomodasi. Perlakukan itu sebagai daftar persyaratan yang belum terkumpul, bukan sebagai resistensi yang harus dikalahkan.",
    },
  ],
  related: ["memilih-software-logistik-pilot-30-hari", "margin-per-job-forwarder", "integrasi-erp-akuntansi-logistik"],
};
