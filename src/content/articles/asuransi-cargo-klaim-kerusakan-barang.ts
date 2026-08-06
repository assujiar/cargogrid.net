import type { Article } from "./types";

export const article: Article = {
  slug: "asuransi-cargo-klaim-kerusakan-barang",
  layout: "dossier",
  format: "Regulatory Explainer",
  title: "Apa yang Dinilai Insurer Sebelum Membayar Klaim Asuransi Cargo",
  metaTitle: "Panduan Membaca Ketentuan Klaim Asuransi Cargo",
  description:
    "Insurer menilai klaim cargo lewat prinsip umum yang berlaku luas, tapi klausul risiko, deductible, dan syarat packing berbeda tiap polis. Panduan ini memisahkan mana yang prinsip umum, mana praktik pasar, dan mana yang perlu Anda cek sendiri di polis.",
  keywords: [
    "klaim asuransi cargo",
    "asuransi cargo ditolak",
    "cara klaim asuransi barang rusak",
    "institute cargo clauses",
    "packing sesuai standar polis",
  ],
  category: "keuangan",
  publishedAt: "2026-07-19",
  updatedAt: "2026-08-06",
  summary:
    "Penilaian klaim asuransi cargo mengikuti prinsip umum yang berlaku luas di industri, tapi detail yang menentukan cair atau tidaknya, klausul risiko, deductible, syarat packing, batas waktu lapor, ditentukan oleh wording polis masing-masing. Panduan ini memisahkan mana yang prinsip umum, mana yang praktik pasar, mana yang berasal dari pengamatan operasional CargoGrid, dan mana yang cuma bisa dijawab oleh polis Anda sendiri.",
  takeaways: [
    "Insurer membayar klaim berdasarkan empat syarat pembuktian yang berlaku luas, polis berlaku, kerugian termasuk peril yang dijamin, nilainya benar, tidak ada syarat yang dilanggar, tapi definisi detail tiap syarat itu ada di wording polis masing-masing, bukan seragam antarinsurer.",
    "Institute Cargo Clauses A, B, dan C adalah wording standar dari Lloyd's Market Association yang jadi acuan banyak polis laut di Indonesia, tapi insurer bisa menambahkan endorsement yang mengubah cakupannya, jadi dua polis berlabel sama tidak otomatis identik.",
    "Lima faktor yang umumnya dinilai surveyor: penyebab kerugian, kelayakan packing, ketepatan waktu notifikasi, kelengkapan dokumentasi serah terima, dan tindakan pemegang polis setelah kejadian ditemukan.",
    "Delapan dokumen di artikel ini adalah kebutuhan umum yang hampir selalu diminta, bukan daftar final untuk semua insurer. Cara paling murah memastikan cakupan polis Anda adalah membaca ulang klausulnya sendiri, idealnya setahun sekali, bukan menunggu klaim ditolak.",
  ],
  blocks: [
    {
      type: "h2",
      id: "cara-membaca-panduan-ini",
      text: "Tiga jenis informasi yang dipisahkan di sini, dan satu yang tidak bisa digantikan",
    },
    {
      type: "p",
      text: "Polis asuransi cargo di Indonesia sebagian besar mengacu ke klausul standar internasional, tapi detail yang menentukan klaim cair atau tidak, batas waktu lapor, definisi packing yang layak, besaran deductible, hampir selalu berbeda dari satu insurer ke insurer lain, bahkan dari satu polis ke polis lain pada insurer yang sama. Panduan ini membagi isinya jadi tiga jenis informasi, dan cuma satu yang benar-benar mengikat untuk klaim Anda.",
    },
    {
      type: "table",
      caption: "Cara membaca setiap keterangan di artikel ini",
      head: ["Jenis informasi", "Sumbernya", "Mengikat untuk polis Anda?"],
      rows: [
        [
          "Prinsip umum",
          "Praktik hukum asuransi marine cargo yang berlaku luas, termasuk dasar dari Institute Cargo Clauses",
          "Konsepnya ya, detail teknisnya tetap tergantung wording polis",
        ],
        [
          "Praktik pasar",
          "Kisaran yang umum ditemukan di polis Indonesia: rate premi, rentang batas waktu lapor",
          "Tidak, tiap insurer bisa menetapkan angka berbeda",
        ],
        [
          "Pengamatan operasional CargoGrid",
          "Pola yang berulang dari dokumentasi klaim forwarder dan trucking company pengguna CargoGrid",
          "Tidak, ini pola yang sering terlihat, bukan aturan",
        ],
      ],
    },
    {
      type: "p",
      text: "Yang mengikat secara hukum untuk klaim Anda cuma satu: wording yang tertulis di polis dan lampirannya. Bagian yang berlabel “prinsip umum” di bawah aman dijadikan pegangan konseptual, tapi begitu masuk ke angka spesifik, deductible, batas waktu, spesifikasi packing, semuanya perlu dicek ulang di polis milik Anda sendiri, bukan diasumsikan sama dengan contoh di artikel ini.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Ini panduan, bukan pengganti membaca polis atau berkonsultasi ke broker",
      body: "Istilah dan angka di artikel ini adalah gambaran umum industri, bukan kutipan dari satu polis tertentu. Yurisdiksi, insurer, dan tahun terbit polis bisa mengubah wording yang berlaku. Kalau ada keraguan soal cakupan polis Anda, cara paling murah untuk memastikannya adalah bertanya ke broker atau insurer sebelum kejadian, bukan menafsirkannya sendiri setelah klaim diajukan.",
    },
    {
      type: "h2",
      id: "empat-syarat-pembuktian",
      text: "Prinsip umum: empat hal yang harus dibuktikan sebelum insurer membayar",
    },
    {
      type: "p",
      text: "Asuransi cargo sering dipahami sebagai jaring pengaman otomatis: barang rusak, tinggal lapor, uang cair. Dalam praktik asuransi marine cargo, klaim baru dibayar kalau pemegang polis berhasil membuktikan empat hal sekaligus: polis berlaku saat kejadian, kerugian termasuk peril yang dijamin, nilainya terhitung benar, dan tidak ada syarat polis yang dilanggar. Ini bukan klausul satu insurer tertentu, melainkan logika pembuktian yang mendasari sebagian besar produk asuransi marine cargo, termasuk Institute Cargo Clauses.",
    },
    {
      type: "p",
      text: "Konsekuensinya: kalau satu dari empat syarat itu gagal dibuktikan, insurer punya dasar sah untuk menolak, terlepas dari seberapa nyata kerugian di lapangan. Foto kontainer bocor atau kesaksian sopir jadi tidak relevan kalau syarat keempat, packing sesuai standar polis, tidak terpenuhi.",
    },
    {
      type: "quote",
      text: "Nama produk asuransi tidak menentukan cakupannya. Dua polis yang sama-sama disebut “all risk” bisa mengandung pengecualian yang jauh berbeda, tergantung klausul yang benar-benar dilampirkan.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Ilustrasi pola yang berulang (contoh disederhanakan, bukan satu klaim spesifik)",
      body: "Pola berikut disederhanakan dari beberapa kasus yang bentuknya mirip, bukan catatan satu forwarder tertentu: kontainer berisi komponen mesin basah kena air laut setelah lashing di kapal kendor, kerugian ditaksir ratusan juta rupiah, videonya ada dan saksinya ada, tapi crating kayu yang dipakai di lapangan tidak memenuhi spesifikasi minimum di lampiran polis. Surveyor mencatat satu baris: packing tidak memenuhi syarat, klaim gugur berdasarkan klausul warranty, terlepas dari penyebab kerusakan yang sebenarnya.",
    },
    {
      type: "h2",
      id: "lima-faktor-yang-dinilai",
      text: "Lima faktor yang umumnya dinilai surveyor, dan dari mana masing-masing berasal",
    },
    {
      type: "p",
      text: "Dari empat prinsip pembuktian di atas, dalam praktik penilaian surveyor dan adjuster cenderung terpusat di lima faktor berikut. Sebagian berasal dari prinsip umum yang berlaku luas, sebagian lagi baru bisa dipastikan setelah membaca klausul spesifik di polis Anda.",
    },
    {
      type: "table",
      caption: "Lima faktor yang umumnya dicek saat klaim cargo diajukan",
      head: ["Faktor", "Yang dicek", "Sumber ketentuan"],
      rows: [
        [
          "Penyebab kerugian",
          "Apakah penyebabnya termasuk peril yang dijamin klausul yang berlaku (ICC A/B/C untuk laut, daftar peril tersendiri untuk darat dan udara)",
          "Spesifik ke polis, tergantung klausul yang dibeli",
        ],
        [
          "Kelayakan packing",
          "Apakah packing di lapangan sesuai spesifikasi tertulis di polis dan standar industri untuk jenis barangnya",
          "Campuran: syarat packing layak itu prinsip umum, spesifikasi minimumnya spesifik ke polis",
        ],
        [
          "Ketepatan waktu notifikasi",
          "Apakah kerusakan dilaporkan ke insurer dan pengangkut dalam batas waktu yang ditetapkan",
          "Spesifik ke polis, angka jamnya berbeda tiap insurer",
        ],
        [
          "Dokumentasi serah terima",
          "Apakah kondisi barang tercatat di tiap titik pindah tangan, dari gudang asal sampai gudang tujuan",
          "Prinsip umum, bagian dari beban pembuktian pemegang polis",
        ],
        [
          "Tindakan pascakejadian",
          "Apakah pemegang polis mengambil langkah wajar mencegah kerugian tambahan dan menjaga bukti sebelum disurvei",
          "Prinsip umum, banyak polis mencantumkannya eksplisit sebagai “Duty of Assured”",
        ],
      ],
    },
    {
      type: "p",
      text: "Penyebab kerugian adalah faktor yang paling langsung terkait klausul risiko yang dibeli: klaim akibat air laut masuk ke kontainer, misalnya, dijamin di bawah ICC A tapi umumnya tidak dijamin di bawah ICC C. Bagian berikutnya membahas perbedaan ketiga klausul ini lebih rinci.",
    },
    {
      type: "p",
      text: "Tindakan pascakejadian paling sering luput dari perhatian karena bukan soal dokumen, melainkan soal apa yang dilakukan setelah kerusakan ditemukan. Institute Cargo Clauses, di semua level A, B, dan C, mencantumkan klausul yang lazim disebut Duty of Assured (Klausul 16) yang mewajibkan pemegang polis mengambil langkah wajar untuk mencegah kerugian bertambah, menjaga hak untuk menuntut pengangkut atau pihak ketiga, biasanya lewat surat protes tertulis ke perusahaan pelayaran, dan tidak membuang atau memperbaiki barang rusak secara permanen sebelum surveyor sempat memeriksanya, kecuali kondisi darurat. Insurer umumnya mengganti biaya wajar yang dikeluarkan untuk langkah-langkah ini, tapi mengabaikannya sama sekali bisa dianggap pelanggaran syarat tersendiri.",
    },
    {
      type: "h2",
      id: "tiga-klausul-institute-cargo",
      text: "Institute Cargo Clauses: wording standar yang jadi acuan, bukan jaminan seragam antarinsurer",
    },
    {
      type: "p",
      text: "Sebagian besar polis cargo laut di Indonesia mengacu ke Institute Cargo Clauses (ICC) yang disusun Lloyd's Market Association di London, sebagai wording standar yang dipakai luas di pasar asuransi marine internasional. Ada tiga tingkat, A, B, dan C, dengan cakupan risiko yang jauh berbeda satu sama lain, dan jarang dijelaskan tuntas saat polis dijual.",
    },
    {
      type: "table",
      caption: "Semakin ke bawah, cakupannya semakin sempit, dan premi ikut semakin murah",
      head: ["Klausul", "Cakupan risiko", "Cocok untuk"],
      rows: [
        [
          "ICC A (All Risks)",
          "Semua risiko kerugian fisik, kecuali yang dikecualikan eksplisit: inherent vice, packing tidak layak, keterlambatan biasa",
          "Barang bernilai tinggi: elektronik, mesin presisi, kargo rawan pencurian atau kerusakan tersembunyi",
        ],
        [
          "ICC B",
          "Daftar peril bernama: kebakaran, kapal tenggelam, kandas, tabrakan, gempa, ditambah air laut masuk ke palka",
          "Komoditas curah dan barang menengah yang risikonya terwakili daftar peril tersebut",
        ],
        [
          "ICC C",
          "Paling sempit: hanya peril katastrofik seperti kebakaran, kapal tenggelam, tabrakan besar. Kerusakan akibat penanganan kasar atau air masuk dari celah kontainer umumnya tidak dijamin",
          "Komoditas curah bernilai rendah yang total loss-nya lebih relevan daripada kerusakan sebagian",
        ],
      ],
    },
    {
      type: "p",
      text: "Kasus air laut masuk kontainer pada ilustrasi di atas umumnya tidak dijamin di bawah ICC C, sementara ICC A mencakupnya. Yang perlu digarisbawahi: ICC adalah wording standar, bukan produk tunggal yang seragam. Insurer di Indonesia bisa menambahkan endorsement atau pengecualian tambahan di atas wording standar ini, jadi polis yang sama-sama berlabel “ICC A” pada dua insurer berbeda tidak otomatis mengandung cakupan identik. Cek lampiran endorsement di polis Anda, bukan cuma huruf klausulnya.",
    },
    {
      type: "p",
      text: "Klausul mana yang jadi kewajiban pembelian asuransi kadang sudah ditentukan lebih dulu oleh Incoterms yang dipakai dalam kontrak jual-beli, bukan oleh keputusan bebas pembeli atau penjual. Pada Incoterms 2020, term CIF mewajibkan penjual membeli asuransi minimum setara ICC C, sementara CIP mewajibkan cakupan lebih luas setara ICC A, kecuali disepakati lain secara tertulis dalam kontrak. Kalau pengapalan Anda memakai salah satu term ini, cek dulu incoterm yang tercantum di kontrak sebelum mengasumsikan cakupan asuransi pihak lain sudah cukup untuk kargo Anda.",
    },
    {
      type: "h2",
      id: "premi-deductible-warranty",
      text: "Premi, deductible, dan warranty clause: mana yang praktik pasar, mana yang perlu dicek sendiri",
    },
    {
      type: "p",
      text: "Rate premi cargo umumnya dikutip sebagai persentase kecil dari nilai barang, kisaran 0,1% sampai 0,5% tergantung komoditas dan rute, adalah angka yang lazim ditemukan di pasar Indonesia, bukan tarif resmi yang ditetapkan regulator. Industri asuransi di Indonesia diawasi Otoritas Jasa Keuangan (OJK), tapi besaran rate premi, deductible, dan warranty clause pada level polis individual ditentukan lewat negosiasi antara insurer dan pemegang polis, bukan diseragamkan oleh regulator. Selisih tipis di angka premi sering jadi penentu keputusan pembelian, padahal yang lebih menentukan justru ada di lembar berikutnya.",
    },
    {
      type: "p",
      text: "**Deductible** adalah jumlah kerugian yang jadi tanggungan sendiri sebelum insurer membayar sisanya. Polis dengan deductible Rp 25 juta dan Rp 100 juta bisa punya premi hampir sama, tapi konsekuensinya jauh berbeda untuk kerugian bernilai sedang, yang justru paling sering terjadi dibanding total loss.",
    },
    {
      type: "p",
      text: "**Warranty clause** lebih keras konsekuensinya: syarat yang harus dipenuhi persis seperti tertulis, terlepas dari apakah pelanggarannya berhubungan langsung dengan penyebab kerugian atau tidak. Ini prinsip yang umum berlaku dalam hukum asuransi marine, meski penerapannya di tiap polis bisa diperhalus lewat klausul tambahan, jadi tetap perlu dicek wording spesifiknya. Polis yang mensyaratkan “packing sesuai standar SNI atau setara” sebagai warranty berarti pelanggarannya bisa menggugurkan klaim, sekalipun kerusakan sebenarnya disebabkan hal lain, misalnya kelalaian kru kapal.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Ilustrasi: dua polis, premi mirip, hasil klaim jauh berbeda (angka disederhanakan)",
      body: "Angka berikut disederhanakan untuk ilustrasi, bukan tarif polis riil dari satu perusahaan tertentu. Dua opsi polis untuk cargo senilai Rp 15 miliar per pengapalan, 10 pengapalan setahun. Polis pertama: ICC A, deductible Rp 25 juta, premi Rp 37,5 juta setahun. Polis kedua: ICC C, deductible Rp 100 juta, warranty crating kayu penuh, premi Rp 27 juta setahun (selisih cuma Rp 10,5 juta). Begitu ada kerusakan Rp 90 juta akibat air masuk kontainer, polis pertama mencairkan sekitar Rp 65 juta bersih. Polis kedua kemungkinan besar menolak seluruhnya, karena air masuk kontainer umumnya di luar cakupan ICC C.",
    },
    {
      type: "h2",
      id: "packing-sesuai-standar-polis",
      text: "Packing “sesuai standar”: definisi yang harus dicari di tiga tempat berbeda",
    },
    {
      type: "p",
      text: "Frasa “packing yang layak” di polis jarang dijelaskan dengan angka pasti. Surveyor umumnya menilai dari kombinasi tiga hal: spesifikasi eksplisit di polis atau lampirannya, standar industri untuk jenis barang tersebut (ISTA untuk elektronik, SNI untuk kemasan kayu), dan kebiasaan wajar untuk moda serta rute yang dipakai.",
    },
    {
      type: "p",
      text: "Mesin presisi yang dikirim lewat trucking darat rute pendek mungkin cukup dengan pallet dan strapping standar. Dikirim lewat pelayaran antarpulau dengan dua kali bongkar-muat dan potensi ombak tinggi, barang yang sama biasanya memerlukan crating kayu penuh dengan bracing internal. Kalau polis mensyaratkan yang kedua tapi packing di lapangan cuma yang pertama, surveyor mencatatnya sebagai pelanggaran, berapa pun kuat argumen bahwa itu “biasanya juga aman-aman saja”.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Foto sebelum muat adalah bukti, bukan formalitas",
      body: "Tanpa foto kondisi packing sebelum kontainer disegel, klaim Anda bertumpu sepenuhnya pada kata-kata staf gudang bahwa packing sudah sesuai standar, dan insurer tidak wajib percaya begitu saja. Foto bertimestamp yang menunjukkan crating, bracing, dan pelapis anti-lembap adalah salah satu dokumen termurah yang bisa disiapkan, dan justru paling sering absen saat paling dibutuhkan.",
    },
    {
      type: "h2",
      id: "dokumentasi-serah-terima",
      text: "Dokumentasi serah terima: prinsip umum yang paling sering bolong di lapangan",
    },
    {
      type: "p",
      text: "Truk pertama, pelabuhan asal, kapal, pelabuhan tujuan, truk terakhir: lima titik serah terima biasa dilalui satu shipment antarpulau, dan kerusakan bisa terjadi di titik mana pun. Masalah ini akrab bagi siapa pun yang pernah bergulat dengan POD kertas yang tercecer, tapi taruhannya lebih besar: POD yang hilang cuma menunda pencairan invoice, sementara dokumentasi serah terima yang hilang pada klaim asuransi bisa membuat kerugian itu sepenuhnya ditanggung sendiri. Dari pengamatan operasional CargoGrid, perusahaan yang klaimnya paling mulus biasanya memotret kondisi barang, bukan cuma meminta tanda tangan, di setiap titik serah terima, dengan timestamp dan nomor job yang jelas.",
    },
    {
      type: "h2",
      id: "delapan-dokumen-klaim",
      text: "Delapan dokumen yang umumnya diminta, dan cara mengecek apakah polis Anda minta lebih",
    },
    {
      type: "p",
      text: "Ketika kerusakan terjadi, dokumen yang perlu dikumpulkan bukan sekadar soal administrasi. Delapan butir di bawah ini adalah kebutuhan umum yang hampir selalu diminta, dan masing-masing menjawab satu pertanyaan spesifik yang biasa ditanyakan surveyor atau adjuster.",
    },
    {
      type: "ul",
      items: [
        "**Salinan polis dan lampiran klausul** yang berlaku pada tanggal pengapalan, bukan versi yang sudah diperbarui setelahnya.",
        "**Bill of Lading atau surat jalan asli**, membuktikan barang diserahkan ke pengangkut dalam kondisi tertentu pada tanggal tertentu.",
        "**Packing list dan invoice komersial**, membuktikan nilai barang sesuai yang sebenarnya dikirim, bukan estimasi setelah kejadian.",
        "**Foto kondisi packing sebelum kontainer disegel**, membuktikan syarat packing di polis sudah dipenuhi sebelum keberangkatan.",
        "**Foto dan catatan kondisi barang di setiap titik serah terima**, mempersempit kapan dan di mana kerusakan sebenarnya terjadi.",
        "**Notice of claim** ke insurer dan pengangkut dalam batas waktu di polis, biasanya 24 sampai 72 jam sejak kerusakan ditemukan.",
        "**Laporan survey independen**, disusun surveyor yang ditunjuk insurer, mencatat kondisi dan dugaan penyebab kerusakan.",
        "**Bukti nilai kerugian**, berupa kuitansi perbaikan atau perhitungan yang bisa diaudit, bukan sekadar taksiran sepihak.",
      ],
    },
    {
      type: "p",
      text: "Delapan dokumen ini paling efektif disiapkan sebagai prosedur standar, jauh sebelum kerusakan ditemukan, tapi bukan daftar lengkap untuk semua insurer. Sebagian polis mensyaratkan dokumen tambahan, misalnya sertifikat asal barang, laporan cuaca pada tanggal kejadian, atau salinan surat protes ke pengangkut, yang hanya tercantum di lampiran polis Anda sendiri. Cek daftar dokumen resmi di klausul “Claims Procedure” sebelum menganggap delapan berkas ini sudah cukup, dan ingat bahwa yang sudah terlewat umumnya tidak bisa direkonstruksi lagi.",
    },
    {
      type: "h2",
      id: "cara-memverifikasi-polis-anda",
      text: "Lima hal yang perlu dicari langsung di salinan polis Anda",
    },
    {
      type: "p",
      text: "Bagian-bagian sebelumnya menjelaskan prinsip umum dan praktik pasar. Bagian ini langkah literal: lima hal yang perlu dicari langsung di dokumen polis Anda sendiri, idealnya sebelum pengapalan berikutnya, bukan setelah klaim diajukan.",
    },
    {
      type: "ol",
      items: [
        "**Klausul cakupan risiko**, biasanya di bagian “Conditions” atau lampiran: apakah ICC A, B, atau C untuk cargo laut, atau daftar peril tersendiri untuk darat dan udara, dan apakah masih cocok dengan rute serta komoditas yang sekarang dikirim, bukan yang dikirim saat polis pertama dibeli.",
        "**Deductible per kejadian**, dan apakah average clause berlaku kalau nilai pertanggungan lebih rendah dari nilai sebenarnya barang.",
        "**Daftar warranty**, terutama soal packing, penyimpanan, dan batas waktu notice of claim, biasanya ada di bagian “Warranties” atau lampiran teknis terpisah.",
        "**Endorsement tambahan** di atas wording ICC standar, yang bisa memperluas atau mempersempit cakupan dibanding tabel klausul umum di industri.",
        "**Kontak broker atau bagian klaim insurer**, untuk dihubungi kalau ada rute, komoditas, atau nilai kargo baru yang belum jelas tercakup.",
      ],
    },
    {
      type: "p",
      text: "Kelima hal ini paling murah dicek setahun sekali, idealnya saat perpanjangan polis. Kalau salah satunya tidak ditemukan jelas di salinan polis yang Anda pegang, itu sendiri sinyal untuk bertanya ke broker atau insurer, bukan menunggu sampai klaim diajukan dan ditolak. Klaim yang ditolak jarang soal itikad buruk insurer, melainkan soal syarat yang sudah tertulis sejak awal, tapi baru dibaca setelah kerugian terjadi.",
    },
  ],
  faq: [
    {
      q: "Apa bedanya polis all risk dengan asuransi yang menjamin semua kerugian tanpa syarat?",
      a: "Nama “all risk” (setara ICC A) sering disalahartikan sebagai jaminan tanpa pengecualian. ICC A tetap mengecualikan hal baku seperti inherent vice (kerusakan dari sifat alami barang), packing tidak layak, keterlambatan biasa, dan risiko perang atau kerusuhan kecuali dibeli terpisah. Cakupannya paling luas dibanding ICC B atau C, bukan berarti tanpa syarat, dan pengecualian pastinya tetap perlu dicek di lampiran polis Anda.",
    },
    {
      q: "Siapa yang menentukan packing sudah sesuai standar atau belum?",
      a: "Surveyor yang ditunjuk insurer, menilai dari spesifikasi tertulis di polis, standar industri untuk jenis barang tersebut, dan kebiasaan wajar untuk moda serta rute yang dipakai. Kalau tidak yakin standar packing selama ini sudah cukup, tanyakan langsung ke broker atau insurer sebelum pengapalan berikutnya, bukan menunggu klaim pertama.",
    },
    {
      q: "Berapa lama klaim asuransi cargo biasanya cair kalau dokumennya lengkap?",
      a: "Untuk klaim dengan dokumen lengkap dan penyebab yang tidak disengketakan, proses survey sampai pencairan biasanya 30 sampai 60 hari, angka ini praktik pasar yang umum ditemukan, bukan batas waktu yang diatur seragam. Kalau dokumen tidak lengkap atau penyebabnya diperdebatkan, prosesnya bisa molor berbulan-bulan, dan periode itulah yang paling sering berujung penolakan karena bukti sudah keburu rusak atau hilang.",
    },
    {
      q: "Kalau semua dokumen lengkap dan penyebabnya jelas, apakah nilai klaim yang cair pasti sama dengan kerugian sebenarnya?",
      a: "Belum tentu. Deductible tetap dipotong berapa pun lengkapnya dokumen Anda. Kalau nilai pertanggungan di polis lebih rendah dari nilai sebenarnya barang, sebagian polis menerapkan average clause yang memotong pencairan secara proporsional. Nilai pertanggungan perlu ditinjau ulang setiap kali nilai kargo naik, dan apakah average clause berlaku atau tidak tetap soal wording polis masing-masing.",
    },
  ],
  cta: {
    title: "Cek kewajiban asuransi di incoterm kontrak Anda",
    body: "Kalau pengapalan Anda memakai CIF atau CIP, Incoterms 2020 sudah menetapkan cakupan asuransi minimum yang wajib dibeli penjual, tapi itu batas minimum, bukan batas yang otomatis cukup untuk semua jenis kargo. Bandingkan dulu incoterm yang tercantum di kontrak dengan cakupan polis aktual sebelum mengasumsikan siapa yang menanggung risiko apa.",
    linkHref: "/alat/incoterms-2020",
    linkLabel: "Buka referensi Incoterms 2020",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Disusun dari pola klaim asuransi cargo yang berulang di dokumentasi forwarder dan trucking company pengguna CargoGrid, disandingkan dengan wording Institute Cargo Clauses yang jadi acuan standar polis laut di Indonesia.",
  },
  related: ["biaya-tersembunyi-pod-kertas", "dokumen-kepabeanan-arsip-digital", "demurrage-detention-pelabuhan"],
  relatedTools: ["incoterms-2020", "kamus-logistik"],
};
