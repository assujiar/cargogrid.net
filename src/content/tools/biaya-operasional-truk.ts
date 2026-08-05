import type { Tool } from "./types";

export const tool: Tool = {
  slug: "biaya-operasional-truk",
  kind: "kalkulator",
  title: "Kalkulator Biaya Operasional Truk: Cost per KM, per Rit, dan per Ton-KM",
  metaTitle: "Kalkulator Biaya Operasional Truk — Cost per KM & Harga Jual Minimum | CargoGrid",
  description:
    "Hitung biaya sesungguhnya satu unit truk: biaya tetap, bahan bakar, ban, tol, dan uang jalan, sampai ketemu biaya per km bermuatan, biaya per ton-km, dan harga jual minimum sesuai margin yang dituju.",
  keywords: [
    "cost per km truk",
    "biaya operasional truk per km",
    "hitung tarif angkutan darat",
    "biaya per ton km",
    "menentukan tarif trucking",
    "harga pokok jasa angkutan",
  ],
  summary:
    "Menentukan tarif tanpa tahu biaya sendiri adalah menebak dengan langkah tambahan. Kalkulator ini menyusun seluruh pos biaya satu unit — dari penyusutan sampai uang jalan — lalu mengubahnya menjadi angka yang bisa dipakai menjawab penawaran: biaya per rit, per kilometer bermuatan, per ton-km, dan harga jual minimum.",
  searchIntents: [
    "Cara menghitung biaya operasional truk per kilometer",
    "Menentukan tarif angkutan darat yang tidak rugi",
    "Berapa biaya per ton-km armada sendiri",
    "Kenapa rit balik kosong membuat tarif jadi mahal",
    "Harga jual minimum agar margin sesuai target",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "kenapa-tarif-sering-meleset",
      text: "Kenapa tarif yang terasa aman ternyata rugi",
    },
    {
      type: "p",
      text: "Cara paling umum menghitung tarif adalah menjumlahkan solar, uang jalan, dan tol, lalu menambahkan sekian persen. Hasilnya hampir selalu terlalu rendah, dan sebabnya bukan aritmetika melainkan pos yang tidak ikut terhitung.",
    },
    {
      type: "p",
      text: "Truk tetap menyusut ketika sedang parkir. Cicilannya tetap berjalan, asuransinya tetap dibayar, sopirnya tetap digaji, dan bagian dari biaya kantor tetap melekat padanya. Semua itu tidak muncul di kuitansi mana pun sepanjang perjalanan, sehingga tidak pernah terasa sebagai biaya rit ini — padahal justru pos inilah yang biasanya terbesar.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Biaya tetap dibebankan ke seluruh kilometer, termasuk yang kosong",
      body: "Truk yang pulang tanpa muatan tetap menyusut dan tetap digaji sopirnya. Karena itu seluruh biaya perjalanan — bermuatan maupun kosong — harus ditanggung oleh kilometer yang menghasilkan pendapatan saja. Itulah sebabnya biaya per km bermuatan selalu lebih tinggi daripada biaya per km total, dan selisih keduanya adalah harga yang Anda bayar untuk rit balik kosong.",
    },
    {
      type: "h2",
      id: "cara-kerja",
      text: "Bagaimana perhitungannya disusun",
    },
    {
      type: "p",
      text: "Urutannya sengaja dipertahankan seperti model biaya armada pada umumnya, karena urutan itulah yang membuat hasilnya bisa ditelusuri kembali ketika ada yang mempertanyakan angkanya.",
    },
    {
      type: "ol",
      items: [
        "**Penyusutan tahunan** = (harga perolehan dikurangi nilai sisa) dibagi umur ekonomis.",
        "**Biaya tetap tahunan** = penyusutan ditambah cicilan, asuransi, pajak dan perizinan, gaji tetap awak, langganan sistem, serta overhead yang dibebankan.",
        "**Biaya tetap per kilometer** = biaya tetap tahunan dibagi kilometer efektif setahun, yaitu rencana kilometer dikali faktor ketersediaan armada.",
        "**Biaya bahan bakar per rit** dihitung terpisah untuk jarak bermuatan dan jarak kosong, karena konsumsinya memang berbeda dan pos ini yang paling besar.",
        "**Biaya ban per kilometer** = harga satu set dibagi umur pakainya, ditambah perawatan, pelumas, dan cairan aditif.",
        "**Biaya per rit** = biaya tetap per km dikali jarak total, ditambah bahan bakar, ditambah biaya jalan per km dikali jarak total, ditambah pos per rit seperti tol, penyeberangan, bongkar muat, dan uang jalan.",
      ],
    },
    {
      type: "p",
      text: "Dari satu angka biaya per rit itu, seluruh turunan yang dipakai bernegosiasi mengalir sendiri: biaya per kilometer bermuatan untuk membandingkan lane, biaya per ton-km untuk membandingkan efisiensi armada, dan harga jual minimum untuk memastikan margin yang dituju benar-benar tercapai.",
    },
    {
      type: "h2",
      id: "faktor-ketersediaan",
      text: "Faktor ketersediaan: pos yang paling sering dilebih-lebihkan",
    },
    {
      type: "p",
      text: "Rencana seratus dua puluh ribu kilometer setahun terdengar wajar sampai dikurangi hari servis, hari menunggu muatan, hari sopir cuti, dan hari kendaraan rusak. Faktor ketersediaan adalah tempat kejujuran itu dimasukkan.",
    },
    {
      type: "p",
      text: "Menaikkannya dari 0,85 menjadi 0,95 akan menurunkan biaya tetap per kilometer sekitar sepuluh persen di layar — dan tidak menurunkan apa pun di dunia nyata. Yang terjadi hanyalah tarif ditetapkan berdasarkan pemanfaatan yang tidak pernah tercapai, lalu selisihnya muncul sebagai kerugian di akhir tahun tanpa ada satu rit pun yang bisa ditunjuk sebagai penyebabnya.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Dua angka pemanfaatan harus saling cocok",
      body: "Jumlah rit setahun dikali jarak per rit seharusnya mendekati rencana kilometer dikali faktor ketersediaan. Kalau keduanya berselisih jauh, salah satunya keliru — dan seluruh angka per kilometer ikut terbawa. Kalkulator ini memeriksa kecocokan itu dan memberi tahu bila selisihnya melebihi sepuluh persen.",
    },
    {
      type: "h2",
      id: "rit-kosong",
      text: "Rit balik kosong: pos biaya terbesar yang tidak pernah ditagihkan",
    },
    {
      type: "p",
      text: "Kalau dua puluh tiga persen jarak tempuh berjalan tanpa muatan, itu berarti hampir seperempat solar, hampir seperempat keausan ban, dan seperempat waktu sopir dibayar tanpa menghasilkan pendapatan. Biayanya tidak hilang; ia hanya berpindah ke rit yang bermuatan.",
    },
    {
      type: "p",
      text: "Karena itu memperbaiki muatan balik hampir selalu berdampak lebih besar daripada menawar harga solar atau memangkas biaya perawatan. Angka rasio kilometer kosong yang tampil pada hasil di atas adalah cara paling langsung melihat berapa besar peluang yang sedang menganggur di rute Anda.",
    },
    {
      type: "h2",
      id: "batas-alat-ini",
      text: "Yang bisa dan tidak bisa dijawab alat ini",
    },
    {
      type: "p",
      text: "Alat ini menghitung satu unit pada satu pola rute. Ia tidak tahu unit mana yang sebenarnya berangkat kemarin, berapa muatannya, berapa lama menunggu di gudang, dan berapa tol yang benar-benar dibayar. Angka yang dimasukkan ke sini adalah rata-rata, dan rata-rata selalu menyembunyikan lane yang merugi di balik lane yang menguntungkan.",
    },
    {
      type: "p",
      text: "Untuk mengetahui lane mana yang sesungguhnya merugi, biaya harus tercatat per pengiriman, bukan per asumsi — termasuk biaya susulan yang invoicenya baru datang berminggu-minggu kemudian. Itu persoalan pencatatan, dan tidak ada kalkulator yang bisa menyelesaikannya.",
    },
  ],
  faq: [
    {
      q: "Bagaimana cara menghitung biaya operasional truk per kilometer?",
      a: "Jumlahkan seluruh biaya tetap tahunan termasuk penyusutan, lalu bagi dengan kilometer efektif setahun untuk mendapat biaya tetap per km. Tambahkan biaya jalan per km berupa bahan bakar, ban, perawatan, dan pelumas. Tambahkan pos per rit seperti tol, penyeberangan, bongkar muat, dan uang jalan, lalu bagi totalnya dengan jarak tempuh.",
    },
    {
      q: "Kenapa biaya per km bermuatan lebih tinggi daripada biaya per km total?",
      a: "Karena kilometer kosong tidak menghasilkan pendapatan tetapi tetap memakan solar, ban, dan waktu sopir. Seluruh biayanya harus ditanggung kilometer yang bermuatan saja. Semakin besar porsi rit kosong, semakin lebar selisih kedua angka itu.",
    },
    {
      q: "Apa itu biaya per ton-km dan kapan dipakai?",
      a: "Biaya per rit dibagi hasil kali muatan dalam ton dengan jarak bermuatan. Angka ini dipakai membandingkan efisiensi antar armada dan antar rute, karena menyetarakan pengiriman dengan muatan dan jarak yang berbeda-beda.",
    },
    {
      q: "Bagaimana menetapkan harga jual minimum dari biaya?",
      a: "Bagi biaya dengan satu dikurangi margin yang dituju, bukan mengalikannya dengan margin. Biaya sepuluh juta dengan target margin dua puluh persen menghasilkan harga jual minimum dua belas setengah juta, bukan dua belas juta.",
    },
    {
      q: "Apakah biaya tetap boleh dibebankan hanya pada kilometer bermuatan?",
      a: "Pembebanannya ke seluruh kilometer, tetapi pemulihannya hanya bisa dari kilometer bermuatan. Itulah sebabnya perhitungan ini menghasilkan dua angka berbeda, dan yang dipakai menetapkan tarif adalah biaya per kilometer bermuatan.",
    },
  ],
  sources: [
    { label: "Model biaya armada", detail: "Struktur perhitungan biaya tetap, biaya jalan, dan biaya per rit mengikuti model cost per km yang lazim dipakai dalam analisis armada niaga." },
    { label: "Tarif tol dan penyeberangan", detail: "Sengaja tidak ditanam di dalam alat ini. Tarif berbeda per ruas jalan dan per lintasan serta berubah menurut tanggal berlaku, jadi seluruhnya masuk sebagai isian pengguna." },
  ],
  relatedArticles: ["margin-per-job-forwarder", "negosiasi-tarif-tahunan-kontrak-shipper", "perawatan-armada-preventif-vs-reaktif"],
  relatedTools: ["jenis-truk-indonesia", "kalkulator-muatan-truk", "golongan-tol-penyeberangan"],
};
