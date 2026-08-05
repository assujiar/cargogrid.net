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
      id: "pola-rute",
      text: "Pulang pergi atau sekali jalan: pilih polanya, jangan hitung sendiri",
    },
    {
      type: "p",
      text: "Perhitungan biaya bekerja dengan dua jarak yang terpisah — kilometer bermuatan dan kilometer kosong — dan pemisahan itu memang yang benar, karena hanya kilometer bermuatan yang menghasilkan pendapatan. Persoalannya, tidak ada yang menyimpan rutenya dalam bentuk itu. Yang orang tahu adalah \"Jakarta-Surabaya, pulang kosong\".",
    },
    {
      type: "p",
      text: "Karena itu kalkulator ini menanyakan pola rutenya lebih dulu, lalu jarak sekali jalan. Sisanya dihitung sendiri.",
    },
    {
      type: "table",
      caption: "Contoh pada rute sekali jalan 500 km",
      head: ["Pola rute", "Km bermuatan", "Km kosong", "Kapan dipakai"],
      rows: [
        ["Pulang pergi, balik kosong", "500", "500", "Pola paling umum. Separuh jarak tidak menghasilkan pendapatan tetapi tetap memakan solar, ban, dan waktu sopir"],
        ["Pulang pergi, dua arah bermuatan", "1.000", "0", "Ada muatan balik yang membayar. Jarak tempuhnya sama persis, tetapi biaya per kilometer bermuatan turun tajam"],
        ["Sekali jalan saja", "500", "0", "Kendaraan tidak kembali, atau perjalanan baliknya sudah dibebankan ke pekerjaan lain"],
        ["Atur sendiri", "diisi manual", "diisi manual", "Muatan balik sebagian, jarak posisi awal, atau rute dengan beberapa titik singgah"],
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Kesalahan termahal di halaman ini",
      body: "Mengisi jarak sekali jalan lalu lupa rit baliknya sama sekali. Biaya per rit langsung terlihat separuh dari yang sebenarnya, dan tarif yang lahir dari situ merugi pada setiap rit — tanpa ada satu pos pun yang kelihatan janggal saat diperiksa ulang. Memilih pola rute lebih dulu menutup kemungkinan itu.",
    },
    {
      type: "h2",
      id: "angka-awal",
      text: "Angka awal mengikuti kelas armada, dan tetap harus Anda ganti",
    },
    {
      type: "p",
      text: "Beberapa pos tidak sedikit berbeda antar kelas armada — melainkan berbeda berkali-kali lipat. Rangkaian tractor head menempuh sekitar 2,5 kilometer per liter; truk ringan bisa tiga kali lipat itu. Karena itu mengganti pilihan armada ikut mengganti konsumsi bahan bakar, harga perolehan, umur ban, dan gaji tetap awak. Biaya ban dan perawatan ikut menyesuaikan dengan sendirinya, karena keduanya dihitung sebagai porsi harga kendaraan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Konsumsi bahan bakar tidak punya angka baku",
      body: "Kilometer per liter ditentukan medan, bobot muatan, umur mesin, gaya mengemudi, dan seberapa sering kendaraan terjebak macet. Dua unit yang persis sama pada rute yang berbeda bisa berselisih puluhan persen. Angka awal di sini hanya supaya kolomnya tidak kosong dan tidak meleset kelas — angka yang benar ada di catatan pengisian solar armada Anda sendiri, dan itu pos biaya terbesar, jadi paling layak diukur lebih dulu.",
    },
    {
      type: "p",
      text: "Prinsip yang sama berlaku untuk harga perolehan: yang ditampilkan adalah kisaran wajar untuk kelas tersebut, bukan harga yang berlaku bagi Anda. Semua kolom bisa ditimpa, dan sebaiknya memang ditimpa sebelum hasilnya dipakai menetapkan tarif.",
    },
    {
      type: "h2",
      id: "ban-dan-perawatan",
      text: "Ban dan perawatan dihitung sebagai persentase harga kendaraan",
    },
    {
      type: "p",
      text: "Tiga pos ini — harga satu set ban, biaya perawatan, dan pelumas — tidak diisi dalam rupiah, melainkan sebagai porsi harga kendaraan. Ini cara yang lazim dipakai dalam analisis biaya armada, dan alasannya praktis: biaya ban dan perawatan pada dasarnya memang mengikuti harga kendaraan. Truk yang lebih mahal memakai ban yang lebih besar, suku cadang yang lebih mahal, dan interval servis yang lebih menuntut.",
    },
    {
      type: "table",
      caption: "Rasio perencanaan yang dipakai sebagai titik awal",
      head: ["Pos", "Porsi", "Dari", "Artinya pada truk Rp 1,5 miliar"],
      rows: [
        ["Satu set ban", "6%", "Harga perolehan", "Rp 90 juta per set"],
        ["Perawatan dan perbaikan", "10% per tahun", "Harga perolehan", "Rp 150 juta setahun"],
        ["Oli dan bahan habis pakai", "12%", "Biaya perawatan", "Rp 18 juta setahun"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan bahwa perawatan dinyatakan per **tahun**, lalu dibagi kilometer efektif setahun untuk menjadi biaya per kilometer. Pembagian itu yang membuat rasio ini jujur: armada yang menempuh 150.000 kilometer setahun menanggung tagihan perawatan tahunan yang kurang lebih sama dengan armada yang menempuh 60.000 kilometer, sehingga biaya per kilometernya memang lebih rendah. Menyatakannya langsung sebagai rupiah per kilometer akan menyembunyikan hubungan itu, dan hubungan itulah yang menjelaskan kenapa armada yang jarang jalan sulit bersaing harga.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Nominalnya tetap ditampilkan",
      body: "Di bawah setiap kolom persentase, kalkulator menampilkan nilai rupiahnya — per set, per tahun, dan per kilometer. Persentase yang tidak bisa dikembalikan ke rupiah adalah persentase yang tidak bisa diperiksa siapa pun, dan angka yang tidak bisa diperiksa tidak layak dipakai menetapkan harga.",
    },
    {
      type: "p",
      text: "Rasio ini rasio perencanaan, bukan standar terbitan. Armada dengan disiplin perawatan yang baik pada rute ringan berada di bawahnya; armada tua di medan berat berada jauh di atasnya. Ketiganya bisa diubah, dan armada yang sudah punya catatan biaya bengkel sendiri sebaiknya memakai angkanya sendiri.",
    },
    {
      type: "h2",
      id: "tol-dan-penyeberangan",
      text: "Kenapa tarif tol dan penyeberangan harus Anda isi sendiri",
    },
    {
      type: "p",
      text: "Dua kolom itu sengaja dikosongkan dari angka bawaan yang mengikat, dan itu keputusan yang disengaja. Tarif tol berbeda per ruas jalan; tarif penyeberangan berbeda per lintasan. Keduanya juga berubah menurut tanggal berlaku.",
    },
    {
      type: "p",
      text: "Menanam satu tarif nasional ke dalam alat ini berarti menerbitkan angka yang akan salah dalam hitungan bulan, dan tidak akan ada yang tahu kapan mulai salahnya — termasuk Anda, yang justru memakainya menetapkan tarif. Karena itu kedua kolom itu dimulai dari nol, bukan dari angka contoh. Angka contoh yang terlihat masuk akal akan ikut terbawa ke hasil oleh sebagian orang tanpa pernah diperiksa; kolom nol menuntut perhatian.",
    },
    {
      type: "ol",
      items: [
        "Pilih armada di bagian atas. Alat ini langsung menyebutkan **golongan tol** dan **golongan penyeberangan** kelas tersebut, dan mengulangnya tepat di sebelah kolom yang harus diisi.",
        "Cari tarif untuk golongan itu pada ruas tol dan lintasan penyeberangan yang benar-benar dilewati rute Anda.",
        "Masukkan totalnya per rit — jangan lupa menjumlahkan perjalanan berangkat dan pulang, karena seluruh perhitungan di halaman ini berbasis satu rit utuh.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Golongan tol dan golongan penyeberangan tidak sama",
      body: "Golongan tol mengikuti jumlah gandar; golongan penyeberangan mengikuti panjang keseluruhan kendaraan. Truk bergandar dua yang berbadan panjang bisa masuk golongan penyeberangan lebih tinggi daripada truk bergandar tiga yang pendek. Memakai golongan tol untuk mencari tarif kapal akan meleset, dan biasanya ke arah yang merugikan.",
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
      q: "Berapa km per liter truk CDD, fuso, atau tronton?",
      a: "Sebagai titik awal yang kasar: truk ringan seperti CDE dan CDD sekitar 8 km per liter bermuatan, truk medium kelas fuso sekitar 5,5, tronton sekitar 4,5, dan rangkaian tractor head dengan trailer sekitar 2,5. Angka-angka ini bergeser jauh menurut medan, bobot muatan, umur mesin, dan gaya mengemudi — dua unit identik pada rute berbeda bisa berselisih puluhan persen. Pakai rata-rata dari catatan pengisian solar armada sendiri sebelum hasilnya dipakai menetapkan tarif.",
    },
    {
      q: "Kenapa biaya ban dan perawatan diisi dalam persen, bukan rupiah?",
      a: "Karena keduanya pada dasarnya mengikuti harga kendaraan — truk yang lebih mahal memakai ban lebih besar dan suku cadang lebih mahal. Disimpan sebagai persentase, keduanya ikut menyesuaikan begitu armada atau harganya diganti; disimpan sebagai rupiah, setiap kelas armada butuh angkanya sendiri dan masing-masing menjadi usang sendiri-sendiri. Titik awalnya 6% dari harga untuk satu set ban, 10% dari harga per tahun untuk perawatan, dan 12% dari biaya perawatan untuk pelumas. Nilai rupiahnya tetap ditampilkan di bawah tiap kolom.",
    },
    {
      q: "Kenapa angka berubah sendiri saat saya ganti pilihan armada?",
      a: "Karena konsumsi bahan bakar, harga perolehan, biaya ban, umur ban, biaya perawatan, dan gaji tetap awak semuanya berbeda berkali-kali lipat antar kelas armada. Mempertahankan satu angka untuk semua kelas akan menghasilkan perhitungan yang sangat meleset begitu Anda memilih armada selain yang menjadi dasar angka bawaan. Semua kolom tetap bisa ditimpa.",
    },
    {
      q: "Bagaimana menghitung rute pulang pergi dibanding sekali jalan?",
      a: "Pilih pola rutenya, lalu isi jarak sekali jalan — kalkulator menerjemahkannya sendiri. Pulang pergi dengan balik kosong menjadi jarak bermuatan sekali jalan ditambah jarak kosong yang sama. Pulang pergi dengan muatan dua arah menjadi dua kali jarak, seluruhnya bermuatan. Untuk muatan balik sebagian, pilih Atur sendiri dan isi keduanya terpisah.",
    },
    {
      q: "Kenapa tarif tol dan penyeberangan tidak sudah terisi otomatis?",
      a: "Karena tarif tol berbeda per ruas jalan dan tarif penyeberangan berbeda per lintasan, dan keduanya berubah menurut tanggal berlaku. Satu tarif nasional yang ditanam di dalam alat akan menjadi salah tanpa ada yang menyadarinya. Yang alat ini sediakan adalah golongan kendaraan Anda — tarifnya ambil dari ruas dan lintasan yang benar-benar dilewati, lalu masukkan sebagai isian.",
    },
    {
      q: "Bagaimana saya tahu masuk golongan berapa?",
      a: "Pilih armada di bagian atas kalkulator, dan golongan tol serta golongan penyeberangannya langsung ditampilkan — termasuk diulang tepat di sebelah kolom biaya yang harus diisi. Golongan tol mengikuti jumlah gandar, golongan penyeberangan mengikuti panjang keseluruhan kendaraan.",
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
