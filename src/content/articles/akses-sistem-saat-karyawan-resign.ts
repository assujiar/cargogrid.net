import type { Article } from "./types";

export const article: Article = {
  slug: "akses-sistem-saat-karyawan-resign",
  layout: "brief",
  format: "Checklist Audit",
  title: "Checklist Kontrol Akses Minimum Sebelum Karyawan Resign, Pindah, atau Naik Jabatan",
  metaTitle: "Checklist Kontrol Akses Karyawan Resign untuk Logistik",
  description:
    "Checklist delapan kontrol akses minimum, akun bernama orang, password manager, MFA, sampai bukti offboarding, untuk perusahaan logistik tanpa tim IT.",
  keywords: [
    "checklist kontrol akses karyawan resign",
    "offboarding karyawan logistik",
    "akun bersama vs akun bernama TMS WMS",
    "MFA sistem operasional logistik",
    "audit akses karyawan logistik",
  ],
  category: "sistem",
  publishedAt: "2026-06-22",
  updatedAt: "2026-08-06",
  summary:
    "Checklist delapan kontrol akses minimum, dari akun bernama orang sampai bukti offboarding tertulis, yang bisa dijalankan pemilik usaha atau manajer operasional sendiri, tanpa tim IT, supaya operasional tidak mendadak buta begitu satu karyawan resign, pindah peran, atau naik jabatan.",
  takeaways: [
    "Kontrol akses yang menempel ke satu nama orang, bukan ke peran, adalah pola akar di balik operasional yang mendadak buta begitu satu karyawan resign.",
    "Delapan kontrol minimum, akun bernama orang, password manager, MFA di titik paling mahal, catatan kepemilikan, proses joiner-mover-leaver, log akses, admin cadangan, dan bukti offboarding, bisa diperiksa tanpa tim IT dalam waktu kurang dari dua jam.",
    "Checklist leaver paling berguna dijalankan sebelum hari terakhir karyawan, bukan sesudahnya, terutama untuk akun bersama dan WhatsApp Business.",
    "Checklist ini idealnya diulang penuh tiap kuartal, ditambah pengecekan tambahan setiap ada karyawan resign, pindah peran, atau naik jabatan.",
  ],
  blocks: [
    {
      type: "p",
      text: "Kalau admin operasional Anda resign besok pagi, sistem apa saja yang mendadak tidak bisa diakses siapa pun di kantor? Bukan soal seberapa jujur atau setia karyawan itu, melainkan soal apakah akses ke sistem-sistem penting menempel ke perannya atau ke namanya pribadi. Checklist ini menjawab pertanyaan itu, satu kontrol pada satu waktu.",
    },
    {
      type: "p",
      text: "Delapan kontrol di bawah ini adalah kontrol akses minimum, bukan standar keamanan tingkat enterprise. Semuanya bisa diperiksa sendiri oleh pemilik usaha atau manajer operasional dalam waktu kurang dari dua jam, tanpa departemen IT dan tanpa software keamanan khusus. Kontrol ini juga tidak cuma berlaku saat ada yang resign: sebagian celah yang sama muncul juga saat karyawan pindah departemen atau naik jabatan, ketika akses lama menumpuk tanpa pernah dicabut.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Ilustrasi: pola yang berulang, bukan catatan satu perusahaan",
      body: "Contoh berikut disederhanakan untuk menunjukkan polanya, bukan catatan satu perusahaan tertentu. Sebuah forwarder kecil kehilangan akses ke WhatsApp Business dan login admin TMS-nya bersamaan, begitu satu admin operasional resign, sebab nomor itu terdaftar di SIM pribadinya dan password admin tersambung ke emailnya. Dua hari operasional nyaris buta: sekitar delapan customer tidak terbalas, tiga di antaranya memindahkan job ke forwarder lain, dan modul invoicing yang menahan tagihan senilai kira-kira Rp180 juta tidak bisa dibuka. Delapan kontrol di bawah ini dirancang supaya pola itu tidak terulang di perusahaan Anda.",
    },
    {
      type: "h2",
      id: "kontrol-akun-bernama-orang",
      text: "Kontrol 1: Akun bernama orang, bukan login bersama",
    },
    {
      type: "p",
      text: "Login bersama menghilangkan bukti yang paling penting saat sesuatu janggal terjadi: siapa yang benar-benar login ketika perubahan data itu dibuat. Ini bukan soal mencurigai siapa pun. Justru akun bernama orang melindungi karyawan yang paling dipercaya sekalipun dari tuduhan yang tidak adil, sebab catatannya jelas.",
    },
    {
      type: "ul",
      items: [
        "Setiap orang yang mengakses TMS/WMS punya username dan password sendiri, bukan menghafal satu password admin yang dipakai bersama.",
        "Akun admin generik, kalau masih ada, tidak dipakai untuk pekerjaan harian, hanya untuk konfigurasi sistem yang memang butuh hak penuh.",
        "Login e-banking perusahaan terdaftar atas nama individu yang jelas jabatannya, bukan atas nama kantor secara umum.",
        "Untuk vendor yang cuma menyediakan satu slot login per pelanggan, seperti portal PPJK atau asuransi cargo, ada catatan tertulis siapa pemegang resminya sekarang dan siapa penggantinya kalau orang itu keluar.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-password-manager",
      text: "Kontrol 2: Kredensial yang harus dibagi disimpan di password manager",
    },
    {
      type: "p",
      text: "Sebagian kredensial memang tidak bisa dibuat per orang, misalnya akun vendor yang cuma punya satu slot login. Untuk kasus semacam ini, tempat penyimpanannya yang perlu diperbaiki: password manager berbasis tim menyimpannya terenkripsi, dan mencabut akses satu orang tidak memaksa mengganti password untuk semua pengguna lain.",
    },
    {
      type: "ul",
      items: [
        "Kredensial akun bersama disimpan di satu password manager berbasis tim, bukan di catatan WhatsApp, notes HP, atau kertas di laci.",
        "Password manager itu sendiri bisa dibuka lebih dari satu orang (lihat Kontrol 7 soal admin cadangan).",
        "Mencabut akses satu orang dari password manager tidak memaksa mengganti password untuk pengguna lain yang masih aktif.",
        "Password yang tidak pernah diganti selama bertahun-tahun, terutama untuk e-banking dan email operasional, masuk daftar untuk diganti pada audit berikutnya.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-mfa",
      text: "Kontrol 3: MFA aktif di titik akses yang paling mahal kalau bocor",
    },
    {
      type: "p",
      text: "Tidak semua sistem butuh prioritas yang sama. Mulai dari titik akses yang kalau bocor langsung berdampak ke uang atau ke seluruh jalur komunikasi customer.",
    },
    {
      type: "ul",
      items: [
        "E-banking dan sistem pembayaran vendor mewajibkan verifikasi dua langkah, bukan cuma password.",
        "Email operasional, seperti ops@, finance@, atau invoice@, punya MFA aktif, sebab email biasanya jadi jalur reset password untuk sistem lain.",
        "Device penerima OTP transaksi tidak terikat ke satu HP pribadi yang bisa hilang bersamaan orangnya keluar; ada jalur cadangan yang diketahui lebih dari satu orang.",
        "Akses admin ke TMS/WMS memakai MFA juga kalau platformnya mendukung, bukan cuma mengandalkan password yang panjang.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-catatan-kepemilikan",
      text: "Kontrol 4: Catatan kepemilikan atas nama perusahaan untuk tiap akun",
    },
    {
      type: "p",
      text: "Setiap kali sebuah sistem baru dibuka, seseorang harus jadi orang pertama yang mendaftar. Langkah yang sering terlewat adalah langkah kedua: memindahkan kepemilikannya dari nama pribadi ke identitas perusahaan begitu sistem itu mulai dipakai banyak orang. Tabel berikut memetakan pola yang paling sering ditemukan; pakai sebagai lembar kerja, cocokkan kolom tengah dan kanan dengan kondisi sistem Anda sendiri.",
    },
    {
      type: "table",
      caption: "Pola kepemilikan akun yang umum bermasalah, dan kepemilikan yang seharusnya",
      head: ["Titik akses", "Pola bermasalah yang umum ditemukan", "Kepemilikan yang seharusnya"],
      rows: [
        [
          "Nomor WhatsApp Business",
          "Didaftar di SIM pribadi karena dulu belum ada nomor kantor",
          "SIM card dan akun atas nama perusahaan, dipegang siapa pun yang menjabat admin operasional",
        ],
        [
          "Login admin TMS/WMS",
          "Satu akun dipakai bersama, terdaftar di email pribadi orang pertama yang setup",
          "Akun per pengguna; kalau harus ada akun admin generik, emailnya email perusahaan",
        ],
        [
          "Email operasional (ops@, invoice@, finance@)",
          "Didaftarkan di penyedia gratis atas nama personal",
          "Domain email perusahaan sendiri, dikelola sebagai aset perusahaan, bukan aset pribadi",
        ],
        [
          "Device OTP e-banking",
          "HP pribadi satu staf finance jadi penerima kode transaksi",
          "Terdaftar sebagai aset perusahaan, dengan jalur cadangan yang diketahui lebih dari satu orang",
        ],
        [
          "Akun vendor (PPJK, asuransi cargo)",
          "Kontak utama atas nama personal staf pertama yang onboarding vendor itu",
          "Kontak utama atas nama peran/posisi, dengan minimal satu kontak cadangan tercatat di vendor",
        ],
      ],
    },
    {
      type: "p",
      text: "Kalau WhatsApp Business Anda saat ini masih terdaftar di nomor pribadi seorang karyawan, langkah pemindahannya: beli SIM card atas nama perusahaan, lalu gunakan fitur ganti nomor resmi di WhatsApp Business supaya riwayat chat dan broadcast list ikut terbawa. Jadikan ini proyek terjadwal saat semua pihak masih ada, bukan respons darurat sesudah seseorang resign.",
    },
    {
      type: "h2",
      id: "kontrol-joiner-mover-leaver",
      text: "Kontrol 5: Proses joiner-mover-leaver, bukan cuma checklist resign",
    },
    {
      type: "p",
      text: "Istilah joiner-mover-leaver menandai tiga momen saat akses seharusnya berubah: karyawan baru masuk, karyawan pindah peran atau naik jabatan, dan karyawan keluar. Perusahaan yang cuma punya checklist untuk momen ketiga biasanya masih membiarkan akses menumpuk di dua momen lainnya.",
    },
    {
      type: "h3",
      text: "Joiner: karyawan baru",
    },
    {
      type: "ul",
      items: [
        "Akses yang diberikan mengikuti daftar akses standar untuk peran itu, bukan disalin dari akun karyawan lain yang kebetulan masih aktif, termasuk akses yang harusnya sudah dicabut dari orang itu.",
        "Karyawan baru mendapat akun sendiri sejak hari pertama, bukan menumpang akun orang yang mengajarinya.",
      ],
    },
    {
      type: "h3",
      text: "Mover: pindah peran atau naik jabatan",
    },
    {
      type: "ul",
      items: [
        "Akses ke sistem dari peran lama dicabut pada tanggal efektif perpindahan, bukan dibiarkan menumpuk karena siapa tahu masih perlu.",
        "Akses ke sistem untuk peran baru ditambahkan di tanggal yang sama, supaya tidak ada jeda kerja.",
      ],
    },
    {
      type: "h3",
      text: "Leaver: resign, diberhentikan, atau kontrak berakhir",
    },
    {
      type: "p",
      text: "Ini bagian yang paling sering sudah dipikirkan perusahaan, tapi biasanya terlambat dijalankan. Urutannya penting: sebagian besar langkah berikut idealnya selesai sebelum hari terakhir, bukan sesudahnya.",
    },
    {
      type: "ol",
      items: [
        "**Begitu resign atau rotasi diketahui,** susun daftar akses yang dipegang orang itu, mencakup sistem, akun bersama, WhatsApp Business, email, dan kunci fisik, di hari pengumuman, bukan menjelang hari terakhir.",
        "**Tentukan penerima akses berikutnya** untuk tiap baris di daftar itu sebelum hari terakhir tiba, supaya tidak ada jeda transisi.",
        "**Ganti password akun bersama** (TMS/WMS, e-banking, portal vendor) tepat di hari kerja terakhir.",
        "**Cabut akses email dan device OTP** dari daftar pengguna aktif.",
        "**Tarik kembali aset fisik**: kartu akses gudang, kunci kantor, laptop, dan HP kantor.",
        "**Kabari customer dan vendor kunci** soal kontak baru, supaya mereka tidak mencari sendiri jalur pengganti.",
        "**Catat siapa menyerahkan apa dan kapan** (lihat Kontrol 8), sehingga offboarding berikutnya punya rujukan, bukan dimulai dari nol.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-log-akses",
      text: "Kontrol 6: Log akses yang bisa dibaca, bukan cuma ada",
    },
    {
      type: "p",
      text: "Kebanyakan TMS, WMS, dan platform e-banking sudah menyimpan log login secara default. Masalahnya jarang soal log itu ada atau tidak, melainkan apakah ada orang yang tahu cara membukanya, dan apakah log itu disimpan cukup lama untuk berguna.",
    },
    {
      type: "ul",
      items: [
        "Sistem utama menyimpan log akses minimal berupa siapa login, kapan, dan dari mana.",
        "Ada satu orang, biasanya pemilik usaha atau manajer operasional, yang tahu cara membuka log itu, bukan cuma tahu bahwa log itu ada.",
        "Log disimpan cukup lama untuk menjangkau audit kuartalan berikutnya (lihat bagian audit berkala di bawah), bukan terhapus dalam hitungan hari oleh pengaturan bawaan platform.",
        "Perubahan data sensitif, seperti harga kontrak, rekening tujuan pembayaran, atau data customer, bisa ditelusuri kembali ke akun mana yang melakukannya.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-admin-cadangan",
      text: "Kontrol 7: Admin cadangan yang sudah diuji",
    },
    {
      type: "p",
      text: "Di dunia pengembangan software ada istilah **bus factor**: berapa orang yang harus keluar, secara kiasan tertabrak bus, sebelum sebuah sistem berhenti berjalan. Untuk banyak titik akses krusial di perusahaan logistik kecil, angka itu sering kali cuma satu. Kontrol ini menaikkannya jadi minimal dua.",
    },
    {
      type: "ul",
      items: [
        "Setiap sistem kritikal, seperti TMS/WMS, e-banking, WhatsApp Business, dan password manager, punya minimal dua orang dengan hak akses admin.",
        "Admin cadangan itu pernah benar-benar login dan mencoba fungsi dasar sistem, bukan cuma terdaftar di atas kertas tanpa pernah diuji.",
        "Kalau admin utama tidak bisa dihubungi sehari penuh, admin cadangan tahu langkah pertama yang harus diambil tanpa perlu bertanya ke siapa pun dulu.",
      ],
    },
    {
      type: "h2",
      id: "kontrol-bukti-offboarding",
      text: "Kontrol 8: Bukti offboarding, bukan sekadar diingat",
    },
    {
      type: "p",
      text: "Ingatan tentang siapa mencabut akses apa gampang kabur begitu beberapa bulan berlalu, apalagi kalau yang melakukannya sudah bukan orang yang sama. Bukti tertulis menyelesaikan itu, dan berguna juga kalau suatu saat ada sengketa.",
    },
    {
      type: "ul",
      items: [
        "Setiap offboarding menghasilkan catatan tertulis: siapa yang keluar, akses apa saja yang dicabut, dan tanggal pencabutannya.",
        "Catatan itu disimpan di tempat yang bisa diakses lebih dari satu orang, bukan di memori pribadi atau chat yang gampang hilang.",
        "Karyawan yang resign mengonfirmasi tertulis bahwa aset dan akses sudah diserahkan, sebagai catatan untuk kedua pihak, bukan formalitas kosong.",
        "Kalau ada sengketa di kemudian hari soal aset atau akses yang disalahgunakan, catatan ini yang pertama dicari, dan sering kali satu-satunya bukti yang tersedia.",
      ],
    },
    {
      type: "h2",
      id: "audit-berkala-tiga-kolom",
      text: "Menjalankan checklist ini sebagai rutinitas kuartalan",
    },
    {
      type: "p",
      text: "Delapan kontrol di atas menutup momen resign, pindah peran, dan karyawan baru. Ada satu celah lagi yang tidak butuh siapa pun resign untuk muncul: akses yang menumpuk pelan-pelan seiring waktu, tanpa pemicu sejelas kepergian seseorang.",
    },
    {
      type: "ol",
      items: [
        "Buat satu spreadsheet tiga kolom: nama sistem, siapa saja yang punya akses ke sana, dan peran apa yang mereka jalankan hari ini.",
        "Setiap awal kuartal, luangkan sekitar satu jam untuk membaca ulang daftar itu.",
        "Untuk tiap baris, ajukan satu pertanyaan: apakah orang ini masih perlu akses ini, mengingat perannya sekarang?",
        "Cabut akses yang jawabannya tidak, bahkan kalau orangnya masih bekerja di perusahaan yang sama.",
      ],
    },
    {
      type: "callout",
      tone: "insight",
      title: "Targetnya satu spreadsheet, satu jam, per kuartal",
      body: "Audit ini tidak butuh tim keamanan atau software mahal untuk perusahaan berisi belasan sampai puluhan karyawan. Yang dibutuhkan cuma kebiasaan: satu slot waktu tetap di kalender, satu spreadsheet yang dirawat, dan kemauan mencabut akses yang sudah tidak relevan, alih-alih membiarkannya siapa tahu suatu saat dibutuhkan lagi.",
    },
    {
      type: "h2",
      id: "hasil-checklist-langkah-berikutnya",
      text: "Setelah checklist ini dijalankan: tiga kemungkinan hasil",
    },
    {
      type: "p",
      text: "Hasil checklist ini menentukan langkah berikutnya, dan tidak semua celah butuh penanganan darurat yang sama.",
    },
    {
      type: "h3",
      text: "Sebagian besar kontrol sudah jalan, cuma satu-dua celah kecil",
    },
    {
      type: "p",
      text: "Perbaiki celah itu minggu ini, lalu jadwalkan audit kuartalan tiga kolom di atas sebagai rutinitas. Untuk kondisi ini, checklist penuh tidak perlu diulang tiap bulan, cukup dipantau lewat audit berkala.",
    },
    {
      type: "h3",
      text: "Beberapa kontrol besar belum ada, tapi tidak ada yang akan resign dalam waktu dekat",
    },
    {
      type: "p",
      text: "Jadikan ini proyek terjadwal, bukan proyek darurat. Prioritaskan titik akses yang paling mahal kalau bocor lebih dulu, biasanya e-banking, WhatsApp Business, dan login admin TMS/WMS, baru kemudian sisanya.",
    },
    {
      type: "h3",
      text: "Ada karyawan yang baru saja resign atau akan resign dalam waktu dekat, dan kontrolnya belum ada sama sekali",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Prioritaskan Kontrol 4 dan Kontrol 5 dulu",
      body: "Kalau situasinya sudah mendesak, jalankan catatan kepemilikan (Kontrol 4) dan checklist leaver (Kontrol 5) sebagai prioritas darurat minggu ini juga. Kontrol jangka panjang seperti password manager berbayar atau MFA menyeluruh bisa menyusul setelah situasi mendesaknya lewat.",
    },
    {
      type: "p",
      text: "Untuk tim yang jumlahnya di bawah sepuluh orang, kedelapan kontrol ini tetap relevan, cuma skalanya yang berbeda. Tidak perlu password manager berbayar atau kebijakan MFA berlembar-lembar; cukup pastikan WhatsApp Business dan email operasional atas nama perusahaan, ada lebih dari satu orang yang tahu password akun bersama, dan checklist leaver di Kontrol 5 dijalankan tiap kali ada yang keluar, sekecil apa pun timnya.",
    },
  ],
  cta: {
    title: "Setelah akses resmi rapi, giliran cek grup WhatsApp operasional",
    body: "Checklist ini menutup akun dan login resmi. Di banyak forwarder dan trucking kecil, penugasan job dan konfirmasi muat sehari-hari masih berjalan lewat grup WhatsApp yang tidak tercatat di sistem mana pun, celah yang berbeda sifatnya dari delapan kontrol di atas. Baca catatan lapangan soal kapan itu masih aman ditinggal di WhatsApp, dan kapan harus dipindahkan.",
    linkHref: "/artikel/grup-whatsapp-sistem-operasional-bayangan",
    linkLabel: "Baca: Keputusan yang Cuma Hidup di Grup WhatsApp Operasional",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Ditulis dari pola pengelolaan akses, dan celahnya, yang berulang kami temui di operasional forwarder dan trucking skala kecil-menengah di Indonesia.",
  },
  related: [
    "grup-whatsapp-sistem-operasional-bayangan",
    "integrasi-erp-akuntansi-logistik",
    "dokumen-kepabeanan-arsip-digital",
  ],
};
