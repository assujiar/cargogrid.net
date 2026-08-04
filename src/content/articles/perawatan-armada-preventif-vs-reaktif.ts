import type { Article } from "./types";

export const article: Article = {
  slug: "perawatan-armada-preventif-vs-reaktif",
  layout: "feature",
  title: "Truk Mogok di KM 102 Cipali: Ongkos Asli di Balik Servis yang Ditunda Sebulan",
  metaTitle: "Perawatan Armada Preventif vs Reaktif: Menghitung Ongkos Sesungguhnya | CargoGrid OS",
  description:
    "Ongkos truk mogok tidak berhenti di nota bengkel. Ini cara menghitung total biaya downtime tak terjadwal dan indikator sederhana merawat armada.",
  keywords: [
    "perawatan armada preventif",
    "biaya downtime truk",
    "maintenance preventif vs reaktif",
    "manajemen perawatan kendaraan logistik",
    "jadwal servis truk",
    "total cost armada logistik",
  ],
  category: "operasional",
  publishedAt: "2026-07-30",
  summary:
    "Truk yang mogok di tengah jalan tol biasanya dianggap kejadian sial yang selesai begitu nota bengkel dibayar. Kenyataannya jauh lebih mahal: truk nganggur, sewa pengganti mendadak, penalti keterlambatan ke customer, dan kepercayaan yang mulai retak — semua biaya yang jarang dicatat di baris yang sama dengan nota servis. Artikel ini membedah model biaya gunung es di balik perawatan armada reaktif, dan dua indikator sederhana yang bisa mulai dipantau minggu ini tanpa sistem baru.",
  takeaways: [
    "Nota bengkel cuma mencatat puncak gunung es. Biaya sesungguhnya dari satu insiden mogok — downtime, sewa pengganti darurat, penalti SLA, margin backhaul yang hilang — biasanya tiga sampai empat kali lipat lebih besar, dan nyaris tak pernah muncul di baris yang sama.",
    "Menunda servis karena truk “masih bisa jalan” hanya memindahkan tagihan ke waktu yang tidak bisa dipilih sendiri — dan waktu itu biasanya jatuh persis saat jadwal pengiriman paling ketat.",
    "Preventif tidak menjamin nol insiden. Dua indikator murah — kepatuhan jadwal servis dan jarak tempuh sejak servis terakhir — sudah cukup memberi peringatan dini tanpa perlu CMMS atau TMS baru.",
    "Kalau kepatuhan jadwal servis berada di bawah 80%, atau ada truk yang sudah lama melewati interval servisnya tanpa ditandai, armada Anda sedang bergeser mendekati wilayah reaktif — meski belum ada satu truk pun yang mogok bulan ini.",
  ],
  blocks: [
    {
      type: "p",
      text: "Pukul sembilan malam, truk Hino Ranger bernomor lambung TR-14 baru melewati KM 102 Tol Cipali ketika tenaganya mendadak hilang. Kopling selip, mesin meraung tapi truk nyaris tak maju, dan sopir menepi ke rest area sambil menelepon kantor. Muatannya delapan ton komponen otomotif yang harus tiba di pabrik Semarang sebelum jalur produksi mulai berjalan jam enam pagi.",
    },
    {
      type: "p",
      text: "Montir bengkel rekanan di Cikampek tiba empat puluh menit kemudian. Ia membuka rumah kopling, memeriksa sebentar, lalu mengucapkan kalimat yang sudah terlalu sering terdengar di dunia trucking: “Ini kampas koplingnya sudah tipis banget, Pak. Mestinya diganti bulan lalu, pas kilometernya baru segini.” Bagian keuangan nanti mencatat nota bengkel malam itu sebagai biaya kejadian. Nota itu baru permukaannya saja.",
    },
    {
      type: "h2",
      id: "gunung-es-biaya-perawatan",
      text: "Nota bengkel cuma puncaknya: mengenal model biaya gunung es",
    },
    {
      type: "p",
      text: "Pada awal 1930-an, insinyur asuransi H.W. Heinrich meneliti ribuan klaim kecelakaan kerja dan menemukan pola yang jadi rujukan klasik dalam manajemen risiko: biaya langsung yang tercatat — pengobatan, kompensasi — cuma sebagian kecil dari kerugian sesungguhnya, sementara biaya tidak langsung biasanya empat sampai delapan kali lebih besar dan nyaris tak pernah muncul di laporan yang sama.",
    },
    {
      type: "p",
      text: "Pola yang sama berlaku di bengkel armada. Nota yang dipegang bagian keuangan malam itu berisi harga kampas kopling dan jasa montir panggilan darurat — bagian yang kelihatan, puncak gunung es yang menyembul di atas air. Bagian yang jauh lebih besar justru terendam: truk yang berhenti beroperasi, pengganti yang harus disewa mendadak, denda ke customer, dan kepercayaan yang pelan-pelan terkikis. Semua itu jarang dicatat di baris yang sama dengan nota bengkel, sehingga kerugian sesungguhnya nyaris tak pernah terlihat utuh.",
    },
    {
      type: "h2",
      id: "anatomi-biaya-tersembunyi",
      text: "Anatomi biaya yang tenggelam di bawah permukaan",
    },
    {
      type: "p",
      text: "Lima pos biaya berikut biasanya muncul dari satu insiden mogok di jalan tol, dan hanya satu di antaranya yang benar-benar tercatat sebagai biaya perawatan di pembukuan:",
    },
    {
      type: "table",
      caption: "Rekonstruksi biaya insiden TR-14 di KM 102 Cipali (ilustrasi)",
      head: ["Pos biaya", "Nominal", "Ke mana ia tercatat"],
      rows: [
        ["Kampas kopling + jasa montir panggilan darurat", "Rp 4.300.000", "Biaya bengkel — satu-satunya yang benar-benar terlihat"],
        ["Towing dari KM 102 ke bengkel Cikampek", "Rp 1.500.000", "Kadang masuk nota, kadang luput sama sekali"],
        ["Sewa truk pengganti tarif darurat (dipesan H-0)", "Rp 3.800.000", "Biaya operasional lain-lain, jarang dibandingkan tarif normal"],
        ["Penalti keterlambatan pengiriman just-in-time", "Rp 2.500.000", "Potongan di invoice customer bulan berikutnya"],
        ["Margin backhaul hilang, truk pengganti tak sempat ambil muatan balik", "Rp 3.500.000", "Tidak tercatat di mana pun"],
      ],
    },
    {
      type: "p",
      text: "Jumlahkan kelima baris itu dan angkanya tembus Rp 15.600.000 — sekitar 3,6 kali lipat dari nota bengkel yang cuma Rp 4.300.000. Rasio itu belum menghitung yang paling sulit diberi angka pasti: pabrik di Semarang sempat menahan jalur produksinya menunggu komponen, dan procurement mereka mulai membandingkan tarif dengan dua forwarder lain untuk tender kuartal berikutnya.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Rasio yang berulang di banyak tempat",
      body: "Angka tiga sampai empat kali lipat bukan kebetulan satu kejadian di Cipali. Begitu perusahaan mencatat kelima pos biaya di atas, bukan cuma nota bengkelnya, polanya hampir selalu serupa: biaya di kertas cuma pecahan kecil dari kerugian riil, dan rasionya makin timpang kalau insiden terjadi jauh dari basis operasional.",
    },
    {
      type: "h2",
      id: "preventif-vs-reaktif",
      text: "Dua filosofi perawatan, dua kurva biaya yang berbeda",
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
        ["Dampak ke jadwal customer", "Nyaris nol", "Bisa memicu penalti SLA dan kehilangan slot pengiriman"],
        ["Beban administratif", "Perlu disiplin mencatat km/tanggal servis", "Nol sampai insiden pecah jadi krisis mendadak"],
      ],
    },
    {
      type: "h2",
      id: "kenapa-reaktif-tetap-dipilih",
      text: "Kalau preventif jelas lebih murah, kenapa reaktif masih jadi kebiasaan?",
    },
    {
      type: "p",
      text: "Alasannya jarang soal ketidaktahuan. Kebanyakan pemilik armada tahu persis kapan servis berkala seharusnya dilakukan. Masalahnya ada di momen truk itu ditarik dari jalur pengiriman untuk diservis — truk itu sedang menghasilkan uang, dan menariknya keluar terasa seperti kehilangan pendapatan hari itu juga, padahal sebenarnya cuma dipindah beberapa jam lebih awal.",
    },
    {
      type: "p",
      text: "Tekanan arus kas memperkuat godaan itu. Servis preventif keluar dari kas sekarang untuk kerusakan yang belum tentu terjadi, sehingga menunda terasa seperti keputusan aman selama truk masih jalan. Yang tidak terlihat adalah kapan keberuntungan itu habis — dan kalau habisnya di tengah tol saat mengejar jadwal JIT, tagihannya jauh lebih besar.",
    },
    {
      type: "p",
      text: "Argumen “belum rusak, kenapa diganti” keliru soal cara komponen mekanis gagal. Kampas kopling, ban, atau timing belt aus bertahap, lalu gagal total dalam rentang waktu yang sempit dan sulit ditebak tepat harinya. Menunggu sampai benar-benar rusak berarti menunggu titik itu datang di waktu dan tempat yang paling merugikan. Truk tidak pernah mogok saat menganggur di garasi — ia mogok saat membawa muatan, biasanya justru saat jadwalnya paling ketat.",
    },
    {
      type: "quote",
      text: "Servis yang ditunda tidak pernah benar-benar hilang. Ia cuma pindah tanggal, dan biasanya mendarat di hari yang paling tidak Anda inginkan.",
    },
    {
      type: "h2",
      id: "menghitung-total-cost-downtime",
      text: "Menghitung total cost: adu program terjadwal dengan tagihan insiden",
    },
    {
      type: "p",
      text: "Perbandingan yang adil menempatkan dua angka berdampingan: total biaya program servis terjadwal untuk satu truk dalam setahun, dan total biaya insiden reaktif kalau truk yang sama dibiarkan berjalan sampai komponennya menyerah sendiri.",
    },
    {
      type: "p",
      text: "Truk yang dibiarkan reaktif tidak benar-benar terbebas dari biaya perawatan. Ongkosnya cuma ditagihkan belakangan, dalam jumlah yang lebih besar, pada waktu yang tidak bisa dipilih sendiri.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Ilustrasi perbandingan setahun, satu truk",
      body: "Anggap TR-14 menempuh rata-rata 120.000 km per tahun. Program servis preventif — oli, filter, kampas rem dan kopling diganti sesuai jadwal pabrikan — menghabiskan sekitar Rp 18.000.000 setahun, tersebar di beberapa kunjungan bengkel di luar jam sibuk. Kalau truk yang sama dibiarkan reaktif dan mengalami dua insiden serupa kejadian Cipali dalam setahun, kerugiannya sekitar Rp 31.200.000 — 73% lebih mahal, belum termasuk risiko kerusakan lebih parah kalau keausan merembet ke komponen lain.",
    },
    {
      type: "p",
      text: "Selisihnya makin lebar kalau dihitung dalam horizon tiga tahun, sebab komponen yang telat diganti berulang kali biasanya mempercepat ausnya bagian-bagian di sekitarnya. Kampas kopling yang dibiarkan sampai habis total punya peluang lebih besar merusak dual-mass flywheel, komponen yang harganya bisa tiga sampai empat kali lipat kampas kopling itu sendiri.",
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
      text: "**Jarak tempuh sejak servis terakhir** dicatat per truk, sebagai selisih antara odometer hari ini dan odometer saat servis terakhir dilakukan. Truk yang sudah melewati interval servis ditambah buffer tertentu — katakanlah jadwal 10.000 km plus toleransi 1.500 km — pantas ditandai merah dan diprioritaskan minggu itu juga, terlepas seberapa baik kondisinya terlihat dari luar.",
    },
    {
      type: "ul",
      items: [
        "**Hijau** — sisa jarak ke servis berikutnya masih di atas 1.000 km. Belum perlu tindakan apa pun.",
        "**Kuning** — sisa jarak di bawah 1.000 km, atau sudah lewat dari tanggal jadwal servis. Masuk antrean bengkel minggu ini.",
        "**Merah** — sudah melewati interval servis ditambah buffer toleransi. Prioritas utama; idealnya truk ditarik dari rute sebelum berangkat lagi.",
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
      text: "Sumber datanya juga tidak rumit: sopir memfoto odometer tiap kali truk kembali ke pool dan mengirimkannya lewat WhatsApp, lalu satu orang memasukkan angkanya ke spreadsheet tiap pagi. Yang dibutuhkan cuma disiplin, bukan aplikasi mahal. GPS tracking otomatis mempercepat proses ini nanti, tapi itu penyempurnaan, bukan syarat mulai — armada lima truk maupun lima puluh truk bisa mulai dari spreadsheet yang sama, sebelum naik ke sistem lebih canggih.",
    },
    {
      type: "h2",
      id: "batas-yang-realistis",
      text: "Target yang realistis, dan batas yang perlu diterima",
    },
    {
      type: "p",
      text: "Kemungkinan mogok di jalan tidak akan pernah nol, sekalipun program preventif berjalan sempurna. Komponen tetap bisa gagal lebih awal dari perkiraan pabrikan karena kualitas part, gaya mengemudi, atau beban yang melebihi spesifikasi kendaraan. Yang berubah adalah proporsinya: sebagian besar servis pindah ke waktu dan tempat yang Anda tentukan sendiri, dan kejadian reaktif menyusut jadi pengecualian langka.",
    },
    {
      type: "p",
      text: "Target yang realistis adalah menggeser proporsi itu konsisten dari bulan ke bulan — kepatuhan jadwal servis naik, jarak tempuh sejak servis terakhir turun rata-rata di seluruh armada — sambil menerima bahwa sesekali kejadian seperti di KM 102 Cipali masih mungkin terjadi. Bedanya, kalau itu terjadi sekali setahun alih-alih setiap bulan, ongkosnya jauh lebih kecil dan jauh lebih bisa diprediksi.",
    },
  ],
  faq: [
    {
      q: "Berapa persen penghematan realistis dari perawatan preventif dibanding reaktif?",
      a: "Bervariasi, tapi dari pola yang biasa muncul, ongkos sebuah insiden mogok — downtime, sewa pengganti, penalti SLA — sering tembus tiga sampai empat kali lipat biaya bengkelnya sendiri. Program preventif yang konsisten biasanya membuat biaya perawatan tahunan per truk lebih rendah 30-50% dibanding armada yang dibiarkan reaktif.",
    },
    {
      q: "Preventif berarti mengganti komponen padahal belum rusak. Bukankah itu pemborosan?",
      a: "Tidak, kalau jadwalnya disusun dari data pemakaian aktual — km tempuh, jam operasi, rekomendasi pabrikan — bukan sekadar tebakan. Komponen yang diganti sedikit lebih awal dari batas ausnya tetap lebih murah daripada yang dibiarkan sampai gagal total dan merusak bagian lain. Pemborosan sesungguhnya terjadi saat servis ditunda berulang kali sampai kerusakan merembet.",
    },
    {
      q: "Bagaimana kalau sebagian armada kami sewa dari vendor, bukan milik sendiri?",
      a: "Tanggung jawab perawatan biasanya sudah diatur di kontrak sewa, tapi kepatuhan jadwal servis dan jarak tempuh sejak servis terakhir tetap layak dipantau dari sisi Anda. Truk sewaan yang mogok di tengah rute tetap menimbulkan penalti SLA dan kekecewaan customer yang jadi tanggungan Anda, bukan vendor truk itu. Mintalah bukti servis berkala sebagai bagian dari evaluasi vendor rutin.",
    },
    {
      q: "Apakah butuh software CMMS atau TMS khusus untuk mulai program ini?",
      a: "Tidak untuk tahap awal. Spreadsheet dengan kolom odometer, tanggal servis terakhir, dan status warna sudah cukup, selama ada satu orang yang rutin memutakhirkannya. Sistem yang lebih canggih — GPS tracking otomatis, atau modul maintenance di TMS — baru sepadan investasinya setelah pencatatan manual terbukti jalan dan armada bertambah besar.",
    },
  ],
  related: ["odol-timbangan-jembatan-muatan-lebih", "tracking-multimoda-indonesia", "kpi-operasional-logistik"],
};
