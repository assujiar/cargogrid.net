import type { Article } from "./types";

export const article: Article = {
  slug: "perawatan-armada-preventif-vs-reaktif",
  layout: "feature",
  format: "Teardown Kasus",
  title: "Membedah Ongkos Truk Mogok di Tengah Jalan, dari Towing sampai Risiko Gagal SLA",
  metaTitle: "Ongkos Downtime Truk Tak Terjadwal vs Servis Preventif",
  description:
    "Downtime truk tak terjadwal menyeret ongkos lebih dari sekadar nota bengkel. Teardown ini membedah pos-pos biayanya lewat satu skenario komposit, plus proses keputusan preventif vs reaktif.",
  keywords: [
    "biaya downtime truk",
    "perawatan armada preventif",
    "downtime tak terjadwal truk",
    "ongkos truk mogok",
    "maintenance preventif vs reaktif",
  ],
  category: "operasional",
  publishedAt: "2026-07-30",
  updatedAt: "2026-08-06",
  summary:
    "Truk yang mogok di tengah rute sering dicatat sebagai satu nota bengkel, padahal ongkos aslinya menyebar ke towing, sewa truk pengganti, lembur tim ops, dan risiko gagal layanan ke customer. Teardown ini membedah pos-pos biaya itu lewat satu skenario komposit, bukan catatan satu insiden tertentu, lalu memetakan proses keputusan preventif vs reaktif dan dua indikator murah yang bisa mulai dipantau minggu ini.",
  takeaways: [
    "Nota bengkel cuma mencatat satu dari enam pos biaya. Downtime tak terjadwal biasanya menambah towing, sewa truk pengganti, lembur tim ops, dan risiko gagal SLA, sehingga total ongkosnya bisa tiga sampai empat kali lipat angka di nota.",
    "Downtime terjadwal dan downtime tak terjadwal sama-sama menghasilkan biaya. Bedanya cuma siapa yang memilih waktu dan tempatnya terjadi.",
    "Menunda servis karena truk masih bisa jalan bukan menghindari ongkos, cuma memindahkannya ke waktu yang tidak bisa dipilih sendiri, dan waktu itu sering jatuh persis di jadwal pengiriman paling ketat.",
    "Dua indikator murah sudah cukup jadi peringatan dini tanpa CMMS atau TMS baru: kepatuhan jadwal servis dan jarak tempuh sejak servis terakhir. Di bawah ambang tertentu, armada sedang bergeser ke wilayah reaktif meski belum ada truk yang mogok bulan ini.",
  ],
  blocks: [
    {
      type: "p",
      text: "Satu truk yang mogok di tengah rute biasanya berakhir sebagai satu baris di pembukuan: nota bengkel. Itu sebabnya downtime tak terjadwal cenderung terlihat lebih murah di atas kertas daripada aslinya. Teardown ini membedah ongkos itu memakai satu skenario komposit, gabungan pola yang berulang di banyak armada truk antar-kota, bukan catatan satu insiden atau satu perusahaan tertentu, supaya keenam pos biayanya kelihatan utuh, dari towing sampai risiko kehilangan customer.",
    },
    {
      type: "h2",
      id: "downtime-terjadwal-vs-tak-terjadwal",
      text: "Downtime terjadwal vs downtime tak terjadwal",
    },
    {
      type: "p",
      text: "**Downtime terjadwal** adalah waktu truk keluar dari rotasi pengiriman karena fleet sendiri yang menentukan: servis preventif dijadwalkan di luar jam sibuk, bengkel dan suku cadang sudah dipastikan tersedia lebih dulu, dan rute sudah diatur ulang sebelum truk benar-benar berhenti jalan.",
    },
    {
      type: "p",
      text: "**Downtime tak terjadwal** adalah waktu truk berhenti beroperasi di luar kendali siapa pun yang merencanakannya: komponen gagal di tengah rute, truk perlu ditarik ke bengkel, dan jadwal pengiriman langsung terganggu tanpa peringatan. Keduanya sama-sama menghasilkan ongkos. Bedanya cuma siapa yang memilih waktu dan tempatnya terjadi.",
    },
    {
      type: "h2",
      id: "gunung-es-biaya-perawatan",
      text: "Ongkos yang tercatat cuma puncaknya: model biaya gunung es",
    },
    {
      type: "p",
      text: "Pada awal 1930-an, insinyur asuransi H.W. Heinrich meneliti ribuan klaim kecelakaan kerja dan menemukan pola yang jadi rujukan klasik dalam manajemen risiko: biaya langsung yang tercatat, yaitu pengobatan dan kompensasi, cuma sebagian kecil dari kerugian riil, sementara biaya tidak langsung biasanya empat sampai delapan kali lebih besar dan jarang muncul di laporan yang sama.",
    },
    {
      type: "p",
      text: "Pola serupa berlaku di bengkel armada. Nota yang dipegang bagian keuangan berisi harga suku cadang dan jasa montir, bagian yang kelihatan, puncak gunung es yang menyembul di atas air. Bagian yang jauh lebih besar justru terendam: truk yang berhenti beroperasi, pengganti yang harus disewa mendadak, lembur tim yang menangani reschedule, dan kepercayaan customer yang pelan-pelan terkikis. Semua itu jarang dicatat di baris yang sama dengan nota bengkel, sehingga kerugian riilnya nyaris tak pernah terlihat utuh.",
    },
    {
      type: "h2",
      id: "lima-pos-ongkos-downtime",
      text: "Enam pos ongkos yang muncul dari satu downtime tak terjadwal",
    },
    {
      type: "p",
      text: "Berikut rinciannya, dipetakan lewat satu skenario komposit: sebut saja Truk A, unit generik yang koplingnya gagal di tengah rute antar-provinsi sambil membawa muatan just-in-time. Skenario dan angkanya disederhanakan untuk menunjukkan cara menghitungnya, bukan catatan satu kejadian yang benar-benar terjadi persis begitu.",
    },
    {
      type: "table",
      caption: "Rekonstruksi ongkos skenario komposit Truk A (ilustrasi, angka disederhanakan)",
      head: ["Pos biaya", "Nominal", "Ke mana ia biasanya tercatat"],
      rows: [
        ["Suku cadang + jasa montir panggilan darurat", "Rp 4.300.000", "Biaya bengkel, satu-satunya yang biasanya benar-benar terlihat"],
        ["Towing dari lokasi mogok ke bengkel terdekat", "Rp 1.500.000", "Kadang masuk nota, kadang luput sama sekali"],
        ["Sewa truk pengganti tarif darurat (dipesan H-0)", "Rp 3.800.000", "Biaya operasional lain-lain, jarang dibandingkan tarif normal"],
        ["Lembur tim ops untuk reschedule dan komunikasi ke customer", "Rp 1.100.000", "Biasanya tak dicatat sebagai biaya insiden sama sekali"],
        ["Penalti keterlambatan pengiriman just-in-time (risiko gagal SLA)", "Rp 2.500.000", "Potongan di invoice customer bulan berikutnya"],
        ["Margin backhaul hilang, truk pengganti tak sempat ambil muatan balik", "Rp 3.500.000", "Tidak tercatat di mana pun"],
      ],
    },
    {
      type: "p",
      text: "Jumlahkan keenam baris itu dan angkanya tembus Rp 16.700.000, sekitar 3,9 kali lipat dari nota bengkel yang cuma Rp 4.300.000. Rasio itu belum menghitung yang paling sulit diberi angka pasti: dalam skenario ini, pabrik tujuan di Semarang sempat menahan lini produksinya menunggu komponen, dan procurement mereka mulai membandingkan tarif dengan forwarder lain untuk tender kuartal berikutnya, konsekuensi yang persis masuk kategori risiko gagal layanan.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Rasio yang berulang di banyak tempat",
      body: "Rasio tiga sampai empat kali lipat bukan kebetulan dari satu skenario komposit di atas saja. Begitu perusahaan mencatat keenam pos ongkos ini, bukan cuma nota bengkelnya, polanya hampir selalu serupa: biaya di kertas cuma pecahan kecil dari kerugian riil, dan rasionya makin timpang kalau insiden terjadi jauh dari basis operasional.",
    },
    {
      type: "h2",
      id: "akar-masalah-downtime-tak-terjadwal",
      text: "Kenapa downtime tak terjadwal lebih sering muncul daripada seharusnya",
    },
    {
      type: "p",
      text: "Alasannya jarang soal ketidaktahuan. Kebanyakan pemilik armada tahu persis kapan servis berkala seharusnya dilakukan. Akar masalahnya ada di dua tempat: cara arus kas dipandang, dan cara truk ditarik dari rotasi pengiriman.",
    },
    {
      type: "p",
      text: "Truk yang sedang jalan sedang menghasilkan uang, dan menariknya keluar untuk servis terasa seperti kehilangan pendapatan hari itu juga, padahal biasanya cuma dipindah beberapa jam lebih awal. Tekanan arus kas memperkuat godaan itu: servis preventif keluar dari kas sekarang untuk kerusakan yang belum tentu terjadi, sehingga menunda terasa seperti keputusan aman selama truk masih jalan. Yang tidak terlihat adalah kapan keberuntungan itu habis. Kalau habisnya di tengah tol saat mengejar jadwal JIT, tagihannya jauh lebih besar.",
    },
    {
      type: "p",
      text: "Argumen “belum rusak, kenapa diganti” juga keliru soal cara komponen mekanis gagal. Kampas kopling, ban, atau timing belt aus bertahap, lalu gagal total dalam rentang waktu yang sempit dan sulit ditebak tepat harinya. Menunggu sampai benar-benar rusak berarti menunggu titik itu datang di waktu dan tempat yang paling merugikan. Truk jarang mogok saat menganggur di garasi. Ia mogok saat membawa muatan, sering kali justru saat jadwalnya paling ketat.",
    },
    {
      type: "h2",
      id: "proses-keputusan-preventif-reaktif",
      text: "Proses keputusan: preventif atau reaktif",
    },
    {
      type: "p",
      text: "Preventif dan reaktif sebenarnya menjawab pertanyaan yang sama: kapan komponen diganti. Preventif menggantinya berdasarkan jadwal, sebelum tanda-tanda kegagalan muncul. Reaktif menunggu sampai komponen benar-benar menyerah, baru bertindak.",
    },
    {
      type: "table",
      caption: "Preventif vs reaktif, dibandingkan dari hal yang benar-benar berdampak ke operasional",
      head: ["Dimensi", "Preventif", "Reaktif"],
      rows: [
        ["Pemicu servis", "Jadwal km atau waktu, ditentukan di muka", "Komponen sudah rusak atau truk berhenti"],
        ["Kapan truk keluar dari jalur pengiriman", "Terjadwal, di luar jam sibuk", "Mendadak, di tengah rute yang berjalan"],
        ["Harga suku cadang dan jasa", "Harga normal, kondisi terkendali", "Naik karena panggilan darurat"],
        ["Efek berantai ke komponen lain", "Minim, diganti sebelum ausnya menjalar", "Sering meluas ke komponen lain yang lebih mahal"],
        ["Dampak ke jadwal customer", "Kecil sampai nyaris nol", "Bisa memicu penalti SLA dan kehilangan slot pengiriman"],
        ["Beban administratif", "Perlu disiplin mencatat km/tanggal servis", "Nol sampai insiden pecah jadi krisis mendadak"],
      ],
    },
    {
      type: "p",
      text: "Kalau sebagian armada Anda truk sewaan dari vendor, tanggung jawab perawatan fisiknya biasanya sudah diatur di kontrak sewa. Tapi downtime tak terjadwalnya tetap mendarat di operasi Anda: penalti SLA dan kekecewaan customer jadi tanggungan pihak yang mengirim, bukan otomatis jadi tanggungan vendor truk. Kepatuhan jadwal servis dan jarak tempuh sejak servis terakhir tetap layak diminta sebagai bukti dari vendor secara rutin, bukan diasumsikan beres hanya karena sudah tertulis di kontrak.",
    },
    {
      type: "quote",
      text: "Servis yang ditunda tidak pernah benar-benar hilang. Ia cuma pindah tanggal, dan biasanya mendarat di hari yang paling tidak Anda inginkan.",
    },
    {
      type: "h2",
      id: "menghitung-total-cost-downtime",
      text: "Membandingkan total ongkos setahun pada skenario komposit yang sama",
    },
    {
      type: "p",
      text: "Perbandingan yang adil menempatkan dua angka berdampingan: total biaya program servis terjadwal untuk satu truk dalam setahun, dan total biaya kalau truk yang sama dibiarkan berjalan sampai komponennya menyerah sendiri. Truk yang dibiarkan reaktif tidak benar-benar terbebas dari biaya perawatan. Ongkosnya cuma ditagihkan belakangan, dalam jumlah yang lebih besar, pada waktu yang tidak bisa dipilih sendiri.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Ilustrasi perbandingan setahun, skenario komposit Truk A (angka disederhanakan)",
      body: "Anggap Truk A menempuh rata-rata 120.000 km per tahun. Program servis preventif (oli, filter, kampas rem dan kopling diganti sesuai jadwal pabrikan) menghabiskan sekitar Rp 18.000.000 setahun, tersebar di beberapa kunjungan bengkel di luar jam sibuk. Kalau truk yang sama dibiarkan reaktif dan mengalami dua insiden serupa skenario di atas dalam setahun, totalnya sekitar Rp 33.400.000, atau sekitar 86% lebih mahal dibanding program preventif, belum termasuk risiko kerusakan lebih parah kalau keausan merembet ke komponen lain.",
    },
    {
      type: "p",
      text: "Selisihnya makin lebar dalam horizon tiga tahun, sebab komponen yang telat diganti berulang kali cenderung mempercepat ausnya bagian-bagian di sekitarnya. Kampas kopling yang dibiarkan sampai habis total punya peluang lebih besar merusak dual-mass flywheel, komponen yang harganya bisa tiga sampai empat kali lipat kampas kopling itu sendiri. Pola ini konsisten di banyak armada yang menjalankan program preventif secara disiplin: biaya perawatan tahunan per truk cenderung 30-50% lebih rendah dibanding armada yang dibiarkan reaktif, meski angka pastinya tergantung usia armada dan medan operasinya.",
    },
    {
      type: "h2",
      id: "dua-indikator-operasional",
      text: "Dua indikator yang bisa dipantau tanpa software rumit",
    },
    {
      type: "p",
      text: "Program preventif tidak butuh CMMS atau TMS yang canggih di tahap awal. Dua angka berikut sudah cukup memberi sinyal jauh sebelum truk mogok di jalan.",
    },
    {
      type: "h3",
      text: "Kepatuhan jadwal servis",
    },
    {
      type: "p",
      text: "**Kepatuhan jadwal servis** dihitung sederhana: jumlah servis yang dilakukan tepat pada jadwalnya, dibagi total servis yang seharusnya dilakukan dalam periode yang sama. Di bawah 80%, itu tanda armada Anda sedang bergeser mendekati wilayah reaktif tanpa disadari, bahkan kalau belum ada satu truk pun yang mogok bulan ini.",
    },
    {
      type: "h3",
      text: "Jarak tempuh sejak servis terakhir",
    },
    {
      type: "p",
      text: "**Jarak tempuh sejak servis terakhir** dicatat per truk, sebagai selisih antara odometer hari ini dan odometer saat servis terakhir dilakukan. Truk yang sudah melewati interval servis ditambah buffer tertentu (katakanlah jadwal 10.000 km plus toleransi 1.500 km) pantas ditandai merah dan diprioritaskan minggu itu juga, terlepas seberapa baik kondisinya terlihat dari luar.",
    },
    {
      type: "ul",
      items: [
        "**Hijau**: sisa jarak ke servis berikutnya masih di atas 1.000 km. Belum perlu tindakan apa pun.",
        "**Kuning**: sisa jarak di bawah 1.000 km, atau sudah lewat dari tanggal jadwal servis. Masuk antrean bengkel minggu ini.",
        "**Merah**: sudah melewati interval servis ditambah buffer toleransi. Prioritas utama; idealnya truk ditarik dari rute sebelum berangkat lagi.",
      ],
    },
    {
      type: "h2",
      id: "mulai-tanpa-sistem-rumit",
      text: "Cara memulai minggu ini, bukan kuartal depan",
    },
    {
      type: "p",
      text: "Satu spreadsheet sudah cukup untuk memulai. Kolom yang dibutuhkan tidak banyak: nomor polisi, tanggal servis terakhir, odometer saat servis terakhir, interval servis berikutnya, odometer hari ini, dan status warna yang dihitung otomatis dari selisih kedua angka odometer itu.",
    },
    {
      type: "p",
      text: "Sumber datanya juga tidak rumit: sopir memfoto odometer tiap kali truk kembali ke pool dan mengirimkannya lewat WhatsApp, lalu satu orang memasukkan angkanya ke spreadsheet tiap pagi. Yang dibutuhkan cuma disiplin, bukan aplikasi mahal. GPS tracking otomatis mempercepat proses ini nanti, tapi itu penyempurnaan, bukan syarat mulai. Armada lima truk maupun lima puluh truk bisa mulai dari spreadsheet yang sama, sebelum naik ke sistem lebih canggih.",
    },
    {
      type: "h2",
      id: "batas-yang-realistis",
      text: "Target yang realistis, dan batas yang perlu diterima",
    },
    {
      type: "p",
      text: "Kemungkinan mogok di jalan tidak akan pernah nol, sekalipun program preventif berjalan mendekati sempurna. Komponen tetap bisa gagal lebih awal dari perkiraan pabrikan karena kualitas part, gaya mengemudi, atau beban yang melebihi spesifikasi kendaraan. Yang berubah adalah proporsinya: sebagian besar servis pindah ke waktu dan tempat yang Anda tentukan sendiri, dan downtime tak terjadwal menyusut jadi pengecualian, bukan pola rutin.",
    },
    {
      type: "p",
      text: "Target yang realistis adalah menggeser proporsi itu konsisten dari bulan ke bulan: kepatuhan jadwal servis naik, jarak tempuh sejak servis terakhir turun rata-rata di truk-truk yang dipantau, sambil menerima bahwa downtime tak terjadwal serupa skenario Truk A di atas sesekali masih mungkin terjadi. Bedanya, kalau itu terjadi sekali setahun alih-alih beberapa kali, ongkosnya jauh lebih kecil dan jauh lebih bisa diprediksi.",
    },
  ],
  cta: {
    title: "Hitung ongkos downtime di biaya operasional truk Anda sendiri",
    body: "Skenario komposit Truk A di atas cuma ilustrasi. Pakai Kalkulator Biaya Operasional Truk untuk memasukkan tarif towing, sewa pengganti, dan pos-pos lain versi armada Anda sendiri, lalu bandingkan hasilnya dengan ongkos program servis preventif tahunan.",
    linkHref: "/alat/biaya-operasional-truk",
    linkLabel: "Buka Kalkulator Biaya Operasional Truk",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Disusun dari pola downtime dan perawatan armada trucking yang berulang di berbagai operator logistik Indonesia, dirangkum jadi satu skenario komposit, bukan laporan satu insiden atau satu perusahaan tertentu.",
  },
  related: ["odol-timbangan-jembatan-muatan-lebih", "kpi-operasional-logistik", "manajemen-vendor-subkontraktor"],
  relatedTools: ["biaya-operasional-truk", "jenis-truk-indonesia"],
};
