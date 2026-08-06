import type { Article } from "./types";

export const article: Article = {
  slug: "demurrage-detention-pelabuhan",
  layout: "dossier",
  format: "Regulatory Explainer",
  title:
    "Sembilan Titik dalam Alur Kontainer Impor yang Menentukan Kapan Demurrage dan Detention Mulai Berjalan",
  metaTitle: "Sembilan Titik Penentu Demurrage dan Detention di Pelabuhan",
  description:
    "Demurrage, detention, dan storage sering muncul di satu invoice yang sama sehingga terasa seperti satu biaya pelabuhan, padahal berasal dari tiga pihak dan tiga dasar aturan yang berbeda. Artikel ini memetakan sembilan titik dalam alur kontainer impor, dari bongkar sampai kontainer kosong dikembalikan, dan menandai mana yang diatur undang-undang, mana yang murni kontrak pelayaran.",
  keywords: [
    "demurrage detention",
    "alur kontainer impor",
    "SPPB dan jalur pemeriksaan",
    "biaya storage pelabuhan",
    "free time kontainer",
  ],
  category: "operasional",
  publishedAt: "2026-06-11",
  updatedAt: "2026-08-06",
  summary:
    "Demurrage, detention, dan storage sering muncul di satu invoice yang sama sehingga terasa seperti satu biaya pelabuhan, padahal berasal dari tiga pihak berbeda dengan tiga dasar aturan yang berbeda pula. Artikel ini memetakan sembilan titik dalam alur satu kontainer impor, dari bongkar sampai kontainer kosong dikembalikan, dan menandai mana yang diatur undang-undang, mana yang murni hasil kontrak pelayaran, dan mana yang sekadar pola operasional yang kami amati berulang di lapangan.",
  takeaways: [
    "Satu kontainer impor melewati sembilan titik, dari bongkar sampai kontainer kosong dikembalikan, dan cuma satu di antaranya (penerbitan SPPB) yang benar-benar diatur undang-undang; delapan sisanya soal kontrak pelayaran, kebijakan terminal, atau pola operasional.",
    "Storage, demurrage, dan detention adalah tiga tagihan dari dua pihak berbeda, operator terminal untuk storage, pelayaran untuk demurrage dan detention, yang sering dibayar dalam satu invoice sehingga terasa seperti satu biaya saja.",
    "Tanggal jatuh tempo demurrage bisa dihitung cukup awal, tapi hanya kalau lama free time dan syarat DO dari pelayaran yang bersangkutan sudah ada di tangan, bukan sesuatu yang otomatis diketahui semua pihak sejak hari pertama.",
    "Penyebab keterlambatan yang paling sering muncul, berdasarkan pengamatan operasional kami, ada di meja dokumen jauh sebelum truk sempat bergerak, bukan di jalan.",
  ],
  blocks: [
    {
      type: "p",
      text: "Ada klaim yang sering diulang soal demurrage: tanggal jatuh temponya \"sudah pasti diketahui sejak hari pertama\". Klaim itu perlu diluruskan sedikit sebelum dipakai sebagai patokan. Yang benar-benar pasti begitu kontainer dibongkar dari kapal hanyalah satu titik, yaitu tanggal discharge itu sendiri, karena tercatat resmi di manifest kapal. Titik-titik sesudahnya, mulai dari kapan kontainer benar-benar bisa diambil sampai berapa hari free time yang diberikan, baru bisa dipastikan setelah dokumen dan kontrak yang relevan ada di tangan, dan detailnya berbeda-beda tergantung pelayaran, terminal, serta jenis kontainer yang dipakai.",
    },
    {
      type: "p",
      text: "Artikel ini memetakan sembilan titik dalam alur satu kontainer impor, dari bongkar sampai kontainer kosong dikembalikan ke depo. Sembilan titik itu berasal dari tiga sumber otoritas yang berbeda: sebagian diatur undang-undang dan berlaku sama untuk semua importir, sebagian lagi murni hasil kontrak komersial antara Anda dan pelayaran, dan sebagian sisanya sekadar pola operasional yang kami amati berulang dari praktik importir di lapangan. Mencampur ketiganya jadi satu paragraf \"ketentuan pelabuhan\" itulah yang biasanya bikin orang berhenti mencoba memahaminya, dan malah pasrah membayar apa pun yang tertulis di invoice.",
    },
    {
      type: "h2",
      id: "kerangka-tiga-lapis",
      text: "Tiga sumber otoritas yang membentuk alur ini",
    },
    {
      type: "p",
      text: "Sebelum masuk ke sembilan titiknya satu per satu, ada gunanya memisahkan dulu dari mana masing-masing aturan itu berasal. Implikasinya berbeda: yang resmi berlaku sama untuk semua importir dan tidak bisa dinegosiasikan, yang komersial bisa dan sering layak dinegosiasikan ulang, dan yang berupa praktik operasional cuma berlaku sejauh polanya memang cocok dengan situasi perusahaan Anda.",
    },
    {
      type: "table",
      caption: "Tiga sumber otoritas di balik alur demurrage dan detention",
      head: ["Sumber aturan", "Yang diatur", "Sifatnya"],
      rows: [
        [
          "Regulasi kepabeanan (UU Kepabeanan dan aturan turunannya)",
          "Penerbitan SPPB dan jalur pemeriksaan barang (hijau, kuning, merah)",
          "Resmi: berlaku sama untuk semua importir, tidak bisa dinegosiasikan",
        ],
        [
          "Tarif dan kontrak pelayaran serta operator terminal",
          "Lama free time, syarat penerbitan DO, tarif storage, definisi gate-out dan empty return",
          "Komersial: berbeda-beda antar pelayaran, rute, jenis kontainer, dan volume kontrak",
        ],
        [
          "Pengamatan operasional CargoGrid",
          "Pola penyebab keterlambatan, cara memantau tenggat, kapan negosiasi free time masuk akal",
          "Praktik: berdasarkan pengamatan lapangan, bukan aturan baku, dan bisa berbeda di tiap perusahaan",
        ],
      ],
    },
    {
      type: "p",
      text: "Kebanyakan kebingungan soal demurrage dan detention berasal dari mencampur baris pertama dan kedua tabel di atas. Orang mengira lama free time itu semacam ketentuan baku, padahal itu murni angka yang ditetapkan pelayaran dalam tarif dan kontraknya sendiri, dan bisa berbeda jauh antara satu pelayaran dengan pelayaran lain untuk rute yang sama persis.",
    },
    {
      type: "quote",
      text: "Sembilan titik ini berasal dari tiga sumber otoritas yang berbeda. Menganggapnya sebagai satu \"ketentuan pelabuhan\" yang seragam adalah alasan paling umum kenapa denda ini terasa membingungkan, padahal sebagian besar bisa dipetakan dengan cukup jelas.",
    },
    {
      type: "h2",
      id: "sembilan-titik-alur",
      text: "Sembilan titik, dari bongkar sampai kontainer kosong kembali",
    },
    {
      type: "p",
      text: "Berikut urutan yang dilalui satu kontainer impor, mulai dari turun kapal sampai tiga jenis tagihan yang bisa muncul di sepanjang jalan itu. Enam titik pertama adalah kejadian yang berurutan menurut waktu; tiga sisanya adalah tagihan yang berjalan di antara kejadian-kejadian tersebut, dan dibahas terpisah pada bagian berikutnya.",
    },
    {
      type: "table",
      caption: "Enam titik kejadian dalam alur satu kontainer impor",
      head: ["Tahap", "Apa yang terjadi", "Sifatnya"],
      rows: [
        [
          "1. Bongkar (discharge)",
          "Kontainer diturunkan dari kapal ke terminal peti kemas. Tanggal ini jadi titik nol untuk seluruh penghitungan free time berikutnya.",
          "Fakta operasional: tercatat resmi di manifest kapal, sama untuk semua pihak",
        ],
        [
          "2. Availability",
          "Kontainer secara fisik bisa diambil dari terminal, setelah pelayaran merilisnya (biasanya usai administrasi dan biaya ke pelayaran selesai) dan sistem terminal menandainya siap. Bisa berjarak beberapa jam sampai beberapa hari dari waktu bongkar, tergantung kepadatan terminal.",
          "Kontraktual: syarat rilis ditentukan masing-masing pelayaran dan terminal",
        ],
        [
          "3. Delivery Order (DO)",
          "Diterbitkan pelayaran atau agennya sebagai bukti kontainer boleh diambil pemiliknya. Dokumen inilah yang mencantumkan berapa hari free time yang diberikan untuk kontainer tersebut.",
          "Kontraktual: syarat penerbitan dan lama free time murni kesepakatan komersial",
        ],
        [
          "4. SPPB (Surat Persetujuan Pengeluaran Barang)",
          "Diterbitkan Bea Cukai setelah dokumen kepabeanan diperiksa dan kontainer melewati jalur pemeriksaan yang ditetapkan (hijau, kuning, atau merah).",
          "Resmi: diatur UU Kepabeanan dan aturan turunannya, berlaku sama untuk semua importir",
        ],
        [
          "5. Gate-out",
          "Kontainer keluar dari gerbang terminal menuju gudang penerima. Titik ini lazimnya menutup periode demurrage dan membuka periode detention.",
          "Kontraktual: definisi persis \"kontainer keluar\" bisa berbeda antar tarif pelayaran",
        ],
        [
          "6. Pengembalian kontainer kosong (empty return)",
          "Kontainer kosong dikembalikan ke depo yang ditunjuk pelayaran, menutup periode detention. Depo tujuan bisa berbeda dari depo tempat kontainer semula diambil.",
          "Kontraktual: depo tujuan dan tenggat pengembalian ditentukan pelayaran",
        ],
      ],
    },
    {
      type: "p",
      text: "Perhatikan kolom terakhir. Dari enam titik ini, cuma penerbitan SPPB yang tunduk pada aturan resmi yang sama untuk semua importir. Lima titik lainnya bergantung pada kontrak dan kebijakan pelayaran atau terminal yang bersangkutan, sehingga jangka waktu antar-titiknya bisa berbeda jauh untuk kontainer yang datang dengan kapal dan pelayaran berbeda, meski sama-sama masuk lewat pelabuhan yang sama.",
    },
    {
      type: "h2",
      id: "tiga-jenis-tagihan",
      text: "Storage, demurrage, dan detention: tiga tagihan, dua pihak penagih",
    },
    {
      type: "p",
      text: "Ketiga tagihan ini sering muncul berdekatan pada kontainer yang sama, dan kadang direkap forwarder jadi satu baris \"biaya pelabuhan\" di invoice ke customer. Padahal yang menagih berbeda pihak, periode berjalannya berbeda, dan dasar tarifnya juga berbeda.",
    },
    {
      type: "table",
      caption: "Tiga tagihan yang sering tertukar satu sama lain",
      head: ["Tagihan", "Ditagih oleh", "Periode berjalan", "Dasar tarif"],
      rows: [
        [
          "Storage (uang tumpukan)",
          "Operator terminal / pengelola pelabuhan",
          "Sejak kontainer availability (sebagian terminal menghitung sejak discharge) sampai gate-out",
          "Tarif storage yang dipublikasikan operator terminal setempat, umumnya berjenjang: makin lama, makin mahal per hari",
        ],
        [
          "Demurrage",
          "Pelayaran (shipping line) pemilik kontainer",
          "Sejak free time yang tercantum di DO habis sampai gate-out",
          "Tarif dan kontrak pelayaran; lama free time berbeda antar pelayaran, jenis kontainer, dan rute",
        ],
        [
          "Detention",
          "Pelayaran yang sama",
          "Sejak gate-out sampai kontainer kosong dikembalikan ke depo (empty return)",
          "Tarif dan kontrak pelayaran; free time detention lazimnya dihitung terpisah dari free time demurrage, dan sering lebih pendek",
        ],
      ],
    },
    {
      type: "p",
      text: "Menyatukan ketiganya ke satu baris pembukuan membuat Anda kehilangan jejak siapa sebenarnya yang menagih apa, dan itu berarti kehilangan jejak pihak mana yang bisa diajak bernegosiasi kalau nilainya terus membengkak. Storage dinegosiasikan lewat operator terminal. Demurrage dan detention dinegosiasikan lewat pelayaran. Dua percakapan yang berbeda, dengan dua pihak yang berbeda pula.",
    },
    {
      type: "h2",
      id: "hari-kalender-bukan-hari-kerja",
      text: "Free time berjalan dalam hari kalender, bukan hari kerja",
    },
    {
      type: "p",
      text: "Ini praktik yang berlaku di hampir semua pelayaran dan biasanya tertulis di tarifnya masing-masing: penghitungan free time memakai hari kalender. Sabtu, Minggu, dan hari libur nasional ikut terhitung, persis seperti hari kerja biasa. Akibatnya, kontainer yang turun dari kapal beberapa hari sebelum libur panjang bisa kehilangan sebagian besar jatah free time-nya, meski belum ada satu proses pun yang sempat berjalan di baliknya.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Periode termahal tahun ini sudah bisa ditandai dari sekarang",
      body: "Libur Lebaran, libur Natal dan Tahun Baru, cuti bersama yang panjang: tanggalnya sudah tertulis di kalender jauh-jauh hari. Kalau kontainer dijadwalkan tiba tiga hari sebelum libur seminggu, sebagian besar free time-nya berisiko habis sebelum kantor buka kembali. Untuk kiriman yang jadwalnya masih fleksibel, menggeser tanggal kedatangan beberapa hari saja bisa jauh lebih murah daripada menanggung denda, dan keputusan itu paling murah diambil saat booking dibuat, bukan setelah kontainer mengapung di tengah laut.",
    },
    {
      type: "h2",
      id: "pola-penyebab",
      text: "Pola penyebab keterlambatan yang paling sering kami amati",
    },
    {
      type: "p",
      text: "Bagian ini bukan data resmi dari otoritas mana pun. Ini pola yang berulang dari pengamatan operasional kami terhadap praktik importir di Indonesia, dan urutannya penting karena menentukan ke mana energi perbaikan sebaiknya diarahkan lebih dulu.",
    },
    {
      type: "ol",
      items: [
        "**Dokumen belum lengkap saat kontainer tiba.** Invoice, packing list, atau dokumen asal dari shipper belum juga sampai, sehingga proses kepabeanan belum bisa dimulai meski kontainer sudah duduk di terminal. Ini penyebab yang paling sering kami temui, dan akar masalahnya sering berada jauh di luar negeri, di luar jangkauan langsung tim di Indonesia.",
        "**Jalur merah atau permintaan pemeriksaan fisik.** Menambah beberapa hari yang memang di luar kendali siapa pun di lapangan begitu jalur itu ditetapkan. Yang bisa dilakukan hanya mengantisipasinya lewat pola komoditas dan riwayat importir sendiri.",
        "**Perizinan tambahan dari kementerian teknis.** Sejumlah komoditas memang mewajibkannya. Masalah biasanya muncul kalau pengurusan izin baru dimulai setelah kontainer tiba, karena keterlambatannya bisa jauh melebihi sisa free time yang ada.",
        "**Gudang penerima sudah penuh.** Kontainer sebenarnya sudah siap keluar dari terminal, hanya saja belum ada ruang kosong untuk membongkarnya.",
        "**Antrean pengembalian kontainer kosong di depo.** Truk sudah sampai di depo membawa kontainer kosong, tapi harus mengantre lama sebelum bisa masuk. Penyebab ini sering luput dari perhatian karena dianggap murni urusan trucking, padahal kepadatan depo di luar kendali sopir maupun vendor trucking.",
      ],
    },
    {
      type: "p",
      text: "Cuma dua dari lima penyebab di atas yang benar-benar melibatkan armada truk secara langsung. Pola ini menjelaskan kenapa reaksi paling umum ketika denda membengkak, yaitu menekan vendor trucking, jarang benar-benar mengubah angka demurrage dan detention di akhir tahun.",
    },
    {
      type: "h2",
      id: "mencatat-per-kejadian",
      text: "Empat hal yang perlu dicatat di setiap kejadian denda",
    },
    {
      type: "p",
      text: "Kalau yang tercatat cuma nilai rupiahnya, denda ini akan terus terlihat seperti ongkos operasional yang wajar. Yang membuatnya bisa diperbaiki adalah konteks di baliknya, dan itu berarti mencatat empat hal berikut untuk setiap kejadian, terlepas dari alat apa pun yang dipakai untuk mencatatnya:",
    },
    {
      type: "ul",
      items: [
        "**Jenis denda.** Demurrage atau detention: ini menentukan pihak mana (operator terminal atau pelayaran) dan tim mana (dokumen atau operasional gudang/armada) yang harus turun tangan lebih dulu.",
        "**Jumlah hari keterlambatan**, bukan hanya nilai rupiahnya. Denda Rp 10 juta dari satu kontainer yang telat 20 hari adalah masalah yang berbeda dari Rp 10 juta yang tersebar merata di 20 kontainer yang masing-masing telat sehari. Kasus pertama berarti ada kontainer yang benar-benar tersangkut. Kasus kedua menandakan proses yang cenderung selalu mepet dari awal.",
        "**Penyebab utama**, dipilih dari kategori baku seperti pada bagian sebelumnya, supaya semua kejadian bisa dibandingkan apple-to-apple tanpa harus menafsirkan narasi bebas tiap orang.",
        "**Pihak yang menanggung.** Kalau polanya menunjukkan perusahaan Anda yang konsisten menanggung, itu sinyal untuk meninjau ulang kontrak dengan customer. Sebagian penyebab, misalnya dokumen dari shipper yang telat, lazimnya tidak semestinya dibebankan ke perusahaan Anda.",
      ],
    },
    {
      type: "p",
      text: "Setelah beberapa bulan berjalan, distribusi di kolom penyebab utama akan menunjukkan sesuatu yang sulit terlihat dengan cara lain: apakah akar masalah Anda ada di meja dokumen, di depan gudang, atau di cara jadwal disusun. Ketiganya tampil identik di laporan keuangan sebagai satu baris \"biaya demurrage\", padahal masing-masing butuh solusi yang berbeda begitu Anda tahu mana yang mendominasi.",
    },
    {
      type: "h2",
      id: "siapa-menanggung",
      text: "Siapa yang menanggung: forwarder, shipper, atau customer",
    },
    {
      type: "p",
      text: "Ini murni soal kontrak, bukan aturan baku, jadi jawabannya berbeda-beda tergantung apa yang tertulis di perjanjian layanan Anda dengan customer. Yang bisa dipetakan secara umum adalah pola tanggung jawabnya: kalau keterlambatan berasal dari dokumen yang belum dikirim shipper atau izin yang belum diurus importir, itu lazimnya di luar tanggung jawab forwarder. Kalau keterlambatan berasal dari internal forwarder sendiri, misalnya salah mengurutkan prioritas dokumen, itu soal lain.",
    },
    {
      type: "p",
      text: "Masalahnya, tanpa catatan penyebab di setiap kejadian seperti pada bagian sebelumnya, forwarder sering ikut menanggung demi menjaga hubungan baik dengan customer, terlepas dari siapa yang sebenarnya bertanggung jawab. Setelah terjadi berulang kali, kebiasaan itu diam-diam mengeras jadi norma yang susah dinegosiasikan ulang di kemudian hari, meski secara kontrak sebenarnya tidak pernah disepakati begitu.",
    },
    {
      type: "h2",
      id: "negosiasi-free-time",
      text: "Free time itu bisa dinegosiasikan",
    },
    {
      type: "p",
      text: "Bagi importir dengan volume rutin, tambahan hari free time termasuk salah satu poin negosiasi yang paling sering luput dibahas. Perhatian hampir selalu tersedot habis ke tarif angkut, padahal tambahan free time beberapa hari saja kerap bernilai lebih besar daripada potongan tarif yang diperjuangkan habis-habisan di meja negosiasi.",
    },
    {
      type: "p",
      text: "Coba hitung sebelum masuk ke meja negosiasi berikutnya: total demurrage yang dibayar tahun lalu, lalu berapa persen dari kejadian itu yang bisa terhindar kalau free time-nya lebih panjang tiga hari saja. Kalau angka itu lebih besar daripada nilai potongan tarif yang biasa dikejar, itu tanda poin mana yang sebaiknya dibawa lebih dulu ke meja perundingan.",
    },
    {
      type: "h2",
      id: "target-realistis",
      text: "Target yang realistis, bukan target nol",
    },
    {
      type: "p",
      text: "Sebagian demurrage memang tidak akan pernah bisa dihindari sepenuhnya, dan mengejar angka nol malah bisa memunculkan biaya baru yang tersembunyi. Pemeriksaan jalur merah, kepadatan musiman di pelabuhan, kapal yang datang lebih cepat dari jadwal semula: semua itu berada di luar kendali tim Anda, seberapa pun rapi sistem yang dibangun.",
    },
    {
      type: "p",
      text: "Target yang realistis bukan nol, melainkan memisahkan mana yang benar-benar tak terhindarkan dari mana yang masih bisa dicegah, lalu terus mengecilkan kelompok kedua sampai yang tersisa cuma kelompok pertama. Perusahaan yang ngotot mengejar nol biasanya berakhir menahan barang lebih lama di gudang sendiri, yaitu ongkos yang nyata tapi tidak pernah tercatat sebagai denda, sehingga terasa seperti kemenangan padahal cuma memindahkan biaya ke pos lain.",
    },
    {
      type: "p",
      text: "Detail persis di tiap titik pada alur ini, terutama soal lama free time, syarat penerbitan DO, dan tarif storage, tetap perlu dicek langsung ke dokumen dan kontrak pelayaran maupun operator terminal yang Anda pakai. Angka yang berlaku untuk satu pelayaran tidak otomatis berlaku untuk pelayaran lain, bahkan untuk rute yang sama.",
    },
  ],
  cta: {
    title: "Hitung sendiri titik mulai denda kontainer Anda",
    body: "Masukkan tanggal discharge, jumlah hari free time dari DO pelayaran Anda, dan perkiraan tanggal gate-out ke kalkulator demurrage & detention CargoGrid, lalu lihat langsung berapa hari lagi sampai tenggat itu terlewati untuk kontainer yang sedang berjalan sekarang.",
    linkHref: "/alat/kalkulator-demurrage",
    linkLabel: "Buka Kalkulator Demurrage & Detention",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Disusun dari pengamatan operasional tim CargoGrid terhadap alur dokumen dan kontainer importir di pelabuhan Indonesia, dipadukan dengan ketentuan kepabeanan dan praktik tarif pelayaran yang berlaku umum; bukan opini hukum dan tidak menggantikan pengecekan langsung ke kontrak atau tarif pelayaran Anda sendiri.",
  },
  related: ["dokumen-kepabeanan-arsip-digital", "tracking-multimoda-indonesia", "biaya-tersembunyi-pod-kertas"],
  relatedTools: ["kalkulator-demurrage", "ukuran-kontainer", "kamus-logistik"],
};
